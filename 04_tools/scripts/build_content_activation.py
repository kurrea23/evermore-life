#!/usr/bin/env python3
"""Build Evermore's content-to-post-to-paid activation board and post packages."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from urllib.parse import urlencode


ROOT = Path(__file__).resolve().parents[2]
SCAFFOLD = ROOT / "04_content_narrative/ad_campaign_scaffold"
MANIFEST_PATH = SCAFFOLD / "activation_manifest.json"
BOARD_PATH = SCAFFOLD / "CONTENT_ACTIVATION_BOARD.md"
PACKAGES_DIR = SCAFFOLD / "exports/post_packages"
STATE_PATH = ROOT / "01_website/state-pages/data/states.json"
DISCLOSURE = (
    "Coverage options vary by age, health, state, product type, carrier, and "
    "eligibility. Not all applicants qualify."
)


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def item_status(item: dict) -> tuple[str, int, list[str]]:
    clip_paths = [ROOT / path for path in item["clips"]]
    existing_clips = [path for path in clip_paths if path.is_file()]
    missing = [str(path.relative_to(ROOT)) for path in clip_paths if not path.is_file()]
    final_exists = (ROOT / item["final_asset"]).is_file()
    rough_exists = bool(item.get("rough_asset")) and (ROOT / item["rough_asset"]).is_file()

    if final_exists:
        return "Final asset needs approval", len(existing_clips), missing
    if rough_exists:
        return "Rough cut needs review", len(existing_clips), missing
    if item["expected_clip_count"] and not missing:
        return "Edit ready", len(existing_clips), missing
    if existing_clips:
        return "Needs clips", len(existing_clips), missing
    return "Needs production", 0, missing


def active_service_states() -> tuple[list[str], list[str]]:
    state_data = load_json(STATE_PATH)
    active = [state["name"] for state in state_data["states"] if state["status"] == "active"]
    pending = [state["name"] for state in state_data["states"] if state["status"] == "pending"]
    return active, pending


def tracking_url(base_url: str, item: dict, source: str, medium: str) -> str:
    params = urlencode(
        {
            "utm_source": source,
            "utm_medium": medium,
            "utm_campaign": f"elc_2026_q2_{item['stage'].lower()}",
            "utm_content": item["slug"],
        }
    )
    return f"{base_url}?{params}"


def build_board(manifest: dict, active: list[str], pending: list[str]) -> str:
    statuses = [(item, *item_status(item)) for item in manifest["items"]]
    edit_ready = sum(status == "Edit ready" for _, status, _, _ in statuses)
    rough_ready = sum(status == "Rough cut needs review" for _, status, _, _ in statuses)
    finals = sum(status == "Final asset needs approval" for _, status, _, _ in statuses)
    needs_production = sum(status == "Needs production" for _, status, _, _ in statuses)

    lines = [
        "# Evermore Content Activation Board",
        "",
        f"**Generated from:** `activation_manifest.json` on {manifest['updated_at']}  ",
        f"**Service status source:** `{manifest['service_status_source']}`  ",
        f"**Current repository service scope:** {', '.join(active)} active; {', '.join(pending)} pending  ",
        f"**Paid launch status:** `{manifest['paid_launch_status'].upper()}`",
        "",
        "## Operating Truth",
        "",
        (
            f"- {rough_ready} rough cuts need review; {edit_ready} source-clip sets are edit ready; "
            f"{finals} platform-ready finals exist; {needs_production} priority item still needs production."
        ),
        "- A source-clip set is not a post. A rough cut is not an approved final. An organic post is not automatically safe to promote.",
        f"- Paid hold reason: {manifest['paid_launch_reason']}",
        "- Live GHL routing still needs to be proven against the current state contract before traffic or spend.",
        "",
        "## Fastest Useful Sequence",
        "",
        "1. Produce and approve `How It Works`; it is the first paid-launch creative.",
        "2. Review the five generated silent rough cuts, then add approved voiceover/music or revise captions.",
        "3. Export one approved final, use its generated post package, and publish organically.",
        "4. Record seven-day watch, share, click, and lead evidence before choosing a story creative for paid promotion.",
        "5. Keep Meta drafts off until every live funnel and approval gate passes.",
        "",
        "## Queue",
        "",
        "| Priority | Creative | Stage | Real asset state | Clips | Organic next move | Paid bridge |",
        "| ---: | --- | --- | --- | ---: | --- | --- |",
    ]

    for item, status, clip_count, _ in sorted(statuses, key=lambda entry: entry[0]["priority"]):
        package_path = f"exports/post_packages/{item['slug']}/POST_PACKAGE.md"
        organic_move = (
            f"Review final, then use `{package_path}`"
            if status == "Final asset needs approval"
            else (
                f"Review rough cut, finish edit, then use `{package_path}`"
                if status == "Rough cut needs review"
                else (
                    f"Render rough cut, review it, then use `{package_path}`"
                    if status == "Edit ready"
                    else f"Produce asset, then use `{package_path}`"
                )
            )
        )
        lines.append(
            f"| {item['priority']} | `{item['creative_id']}` | {item['stage']} | "
            f"**{status}** | {clip_count}/{item['expected_clip_count']} | "
            f"{organic_move} | {item['paid_role']}; hold |"
        )

    lines.extend(
        [
            "",
            "## Paid Promotion Gates",
            "",
            "A post can move into a paid ad only when all are true:",
            "",
            "- [ ] Platform-ready final asset exists and was reviewed.",
            "- [ ] Illustrative stories are labeled as stories; product-focused copy includes the required disclosure.",
            "- [ ] Destination and UTM URL were checked.",
            "- [ ] Current active-state targeting matches the canonical service-status source.",
            "- [ ] Live GHL state routing and controlled lead flow passed.",
            "- [ ] Meta Test Events passed for the intended conversion event.",
            "- [ ] Organic evidence or a deliberate direct-response test justifies the spend.",
            "- [ ] Human approval to publish and spend was recorded.",
            "",
            "## Commands",
            "",
            "```bash",
            "./04_tools/scripts/build_content_activation.py",
            "cd 04_tools/content_video_factory && npm run render:rough-cuts",
            "```",
            "",
            "The builder regenerates this board and every file under `exports/post_packages/`.",
            "",
        ]
    )
    return "\n".join(lines)


def build_post_package(manifest: dict, item: dict, active: list[str], pending: list[str]) -> str:
    status, clip_count, missing = item_status(item)
    organic_url = tracking_url(manifest["default_organic_destination"], item, "organic", "social")
    paid_url = tracking_url(manifest["default_paid_destination"], item, "meta", "paid_social")
    caption = item["organic_caption"]
    if item["illustrative_story"]:
        caption = f"A story about legacy.\n\n{caption.removeprefix('A story about legacy. ').strip()}"
    if item["product_focused"]:
        caption = f"{caption}\n\n{DISCLOSURE}"
    caption = f"{caption}\n\n{item['organic_cta']}: {organic_url}\n\n{item['hashtags']}"

    if item["expected_clip_count"] == 0:
        missing_text = "- No source-clip set exists; produce the planned talking-head asset."
    else:
        missing_text = "\n".join(f"- `{path}`" for path in missing) if missing else "- None"
    channels = "\n".join(f"- {channel}" for channel in item["organic_channels"])
    meta_draft = item["meta_draft_name"] or "No existing Meta draft; create only after promotion decision."
    rough_asset = item.get("rough_asset")
    if rough_asset and (ROOT / rough_asset).is_file():
        rough_cut_instruction = f"- Review the generated silent rough cut: `{rough_asset}`"
    elif rough_asset:
        rough_cut_instruction = f"- Render the planned silent rough cut: `{rough_asset}`"
    else:
        rough_cut_instruction = "- This item has no generated rough cut; produce the planned asset first."

    return f"""# Post And Paid Activation Package: {item["title"]}

**Creative ID:** `{item["creative_id"]}`  
**Real asset state:** {status}  
**Source clips present:** {clip_count}/{item["expected_clip_count"]}  
**Rough cut:** `{rough_asset or "Not planned"}`  
**Expected final:** `{item["final_asset"]}`  
**Paid status:** HOLD

## Finish The Asset

- Production source: {item["production_source"]}
- Missing source clips:
{missing_text}
{rough_cut_instruction}
- Add approved voiceover/music or refine the caption-only edit.
- Export the reviewed final to the expected final path above.
- Do not call the rough cut final or publish it without review.

## Organic Post

**Channels**

{channels}

**Paste-ready caption**

```text
{caption}
```

## Paid Bridge

| Field | Value |
| --- | --- |
| Role | {item["paid_role"]} |
| Objective | {item["paid_objective"]} |
| Meta draft | `{meta_draft}` |
| Paid destination | `{paid_url}` |
| Ad-copy source | `{item["ad_copy_source"]}` |
| Promotion rule | {item["promotion_rule"]} |
| Current repository service scope | {", ".join(active)} active; {", ".join(pending)} pending |

## Required Before Promotion

- [ ] Final asset exists and is approved.
- [ ] Copy and visual passed compliance review.
- [ ] Organic post result or direct-response test rationale is recorded.
- [ ] Live GHL state routing and controlled lead flow passed.
- [ ] Meta Test Events passed.
- [ ] Targeting uses only verified active service states.
- [ ] Human approved publish and spend.
"""


def write_or_check(path: Path, content: str, check: bool) -> bool:
    content = content.rstrip() + "\n"
    current = path.read_text(encoding="utf-8") if path.exists() else None
    if current == content:
        return True
    if check:
        print(f"OUTDATED: {path.relative_to(ROOT)}")
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    print(f"WROTE: {path.relative_to(ROOT)}")
    return True


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="Fail if generated files are outdated.")
    args = parser.parse_args()

    manifest = load_json(MANIFEST_PATH)
    active, pending = active_service_states()
    ok = write_or_check(BOARD_PATH, build_board(manifest, active, pending), args.check)

    for item in manifest["items"]:
        package_path = PACKAGES_DIR / item["slug"] / "POST_PACKAGE.md"
        item_ok = write_or_check(
            package_path,
            build_post_package(manifest, item, active, pending),
            args.check,
        )
        ok = ok and item_ok

    if args.check and ok:
        print("Content activation outputs are current.")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
