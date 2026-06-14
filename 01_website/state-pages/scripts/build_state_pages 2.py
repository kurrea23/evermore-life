#!/usr/bin/env python3
"""Validate state-page data and build deterministic draft pages."""

from __future__ import annotations

import html
import json
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "states.json"
TEMPLATE_FILE = ROOT / "templates" / "state-page.html"
CSS_FILE = ROOT / "assets" / "state-pages.css"
LOGO_FILE = ROOT.parent / "v2" / "assets" / "evermorelife-llc-logo-nav.png"
PUBLIC_DIR = ROOT / "public"

REQUIRED_FIELDS = {
    "name",
    "slug",
    "code",
    "status",
    "status_label",
    "robots",
    "canonical",
    "seo_title",
    "seo_description",
    "eyebrow",
    "hero_title",
    "hero_subtitle",
    "accent_line",
    "local_heading",
    "local_body",
    "priority_cards",
    "cta_label",
    "cta_href",
    "secondary_cta_label",
    "secondary_cta_href",
    "conversion_heading",
    "conversion_body",
    "availability_note",
}

BANNED_CLAIMS = (
    "everyone qualifies",
    "guaranteed approval",
    "licensed in all 50 states",
    "serving families nationwide",
)


def fail(message: str) -> None:
    raise ValueError(message)


def validate_state(state: dict) -> None:
    missing = sorted(REQUIRED_FIELDS - set(state))
    if missing:
        fail(f"{state.get('name', 'Unknown state')}: missing fields: {', '.join(missing)}")

    status = state["status"]
    cta_href = state["cta_href"].lower()
    combined_copy = " ".join(
        str(value).lower()
        for key, value in state.items()
        if key != "priority_cards"
    )
    combined_copy += " " + " ".join(
        f"{card.get('title', '')} {card.get('body', '')}".lower()
        for card in state["priority_cards"]
    )

    if status not in {"active", "pending", "unavailable"}:
        fail(f"{state['name']}: unsupported status {status!r}")
    if len(state["priority_cards"]) != 3:
        fail(f"{state['name']}: exactly three priority cards are required")
    if status == "active" and not cta_href.startswith("/optin"):
        fail(f"{state['name']}: active state CTA must route to /optin")
    if status != "active" and any(token in cta_href for token in ("/optin", "booking", "calendar")):
        fail(f"{state['name']}: {status} state cannot route to active intake or booking")
    if status != "active" and state["robots"].lower() != "noindex, nofollow":
        fail(f"{state['name']}: non-active states must remain noindex, nofollow")
    if not state["canonical"].endswith(f"/{state['slug']}/"):
        fail(f"{state['name']}: canonical must end with /{state['slug']}/")

    for banned in BANNED_CLAIMS:
        if banned in combined_copy:
            fail(f"{state['name']}: banned or unsupported claim detected: {banned!r}")


def render_priority_cards(cards: list[dict]) -> str:
    rendered = []
    for index, card in enumerate(cards, start=1):
        rendered.append(
            "        <article class=\"priority-card\">\n"
            f"          <span class=\"number\">0{index}</span>\n"
            f"          <h3>{html.escape(card['title'])}</h3>\n"
            f"          <p>{html.escape(card['body'])}</p>\n"
            "        </article>"
        )
    return "\n".join(rendered)


def render_page(template: str, state: dict) -> str:
    if state["status"] == "active":
        contact_links = (
            '<a href="tel:+15055043101">+1 (505) 504-3101</a>\n'
            '        <a href="mailto:evermorelifeagent01@gmail.com">evermorelifeagent01@gmail.com</a>'
        )
        mobile_actions = (
            '<a href="tel:+15055043101">Call Evermore</a>\n'
            f'    <a href="{html.escape(state["cta_href"], quote=True)}">Start Review</a>'
        )
    else:
        state_subject = html.escape(f"{state['name']} availability updates".replace(" ", "%20"), quote=True)
        contact_links = (
            f'<a href="mailto:evermorelifeagent01@gmail.com?subject={state_subject}">'
            f"{html.escape(state['name'])} availability updates</a>"
        )
        mobile_actions = (
            f'<a href="{html.escape(state["cta_href"], quote=True)}">Get Availability Updates</a>'
        )

    replacements = {
        "NAME": state["name"],
        "CODE": state["code"],
        "STATUS": state["status"],
        "STATUS_LABEL": state["status_label"],
        "ROBOTS": state["robots"],
        "CANONICAL": state["canonical"],
        "SEO_TITLE": state["seo_title"],
        "SEO_DESCRIPTION": state["seo_description"],
        "EYEBROW": state["eyebrow"],
        "HERO_TITLE": state["hero_title"],
        "HERO_SUBTITLE": state["hero_subtitle"],
        "ACCENT_LINE": state["accent_line"],
        "LOCAL_HEADING": state["local_heading"],
        "LOCAL_BODY": state["local_body"],
        "CTA_LABEL": state["cta_label"],
        "CTA_HREF": state["cta_href"],
        "NAV_CTA_LABEL": "Start a Review" if state["status"] == "active" else "Availability Updates",
        "CONTACT_LINKS": contact_links,
        "MOBILE_ACTIONS": mobile_actions,
        "MOBILE_ACTIONS_CLASS": "" if state["status"] == "active" else "single",
        "SECONDARY_CTA_LABEL": state["secondary_cta_label"],
        "SECONDARY_CTA_HREF": state["secondary_cta_href"],
        "CONVERSION_HEADING": state["conversion_heading"],
        "CONVERSION_BODY": state["conversion_body"],
        "AVAILABILITY_NOTE": state["availability_note"],
        "PRIORITY_CARDS": render_priority_cards(state["priority_cards"]),
    }
    page = template
    for key, value in replacements.items():
        escaped = value if key in {"PRIORITY_CARDS", "CONTACT_LINKS", "MOBILE_ACTIONS"} else html.escape(str(value), quote=True)
        page = page.replace(f"{{{{{key}}}}}", escaped)
    if "{{" in page or "}}" in page:
        fail(f"{state['name']}: unresolved template token remains")
    if state["status"] != "active" and ("tel:" in page.lower() or "/optin" in page.lower()):
        fail(f"{state['name']}: rendered non-active page exposed an active contact path")
    return page


def main() -> None:
    payload = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    states = payload["states"]
    template = TEMPLATE_FILE.read_text(encoding="utf-8")

    for state in states:
        validate_state(state)

    assets_dir = PUBLIC_DIR / "assets"
    assets_dir.mkdir(parents=True, exist_ok=True)
    shutil.copy2(CSS_FILE, assets_dir / CSS_FILE.name)
    shutil.copy2(LOGO_FILE, assets_dir / LOGO_FILE.name)

    built = []
    for state in states:
        output_dir = PUBLIC_DIR / state["slug"]
        output_dir.mkdir(parents=True, exist_ok=True)
        output_file = output_dir / "index.html"
        output_file.write_text(render_page(template, state), encoding="utf-8")
        built.append(f"{state['name']} ({state['status']}): {output_file.relative_to(ROOT)}")

    print("Validated and built state-page drafts:")
    for line in built:
        print(f"- {line}")


if __name__ == "__main__":
    main()
