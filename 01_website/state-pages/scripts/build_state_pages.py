#!/usr/bin/env python3
"""Validate state-page data and build deterministic draft pages.

Every page is a faithful clone of the live evermorelife.org homepage
(01_website/current/index.html) with only per-state copy swapped in. Active
states embed the same GoHighLevel quote form; pending states show an
availability-updates email path and never route into the active intake.
"""

from __future__ import annotations

import html
import json
import shutil
from pathlib import Path
from urllib.parse import quote


ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "states.json"
TEMPLATE_FILE = ROOT / "templates" / "state-page.html"
CSS_FILE = ROOT / "assets" / "state-pages.css"
PUBLIC_DIR = ROOT / "public"

PRIVACY_URL = "https://evermorelife.org/privacy"
TERMS_URL = "https://evermorelife.org/terms"
OPTIN_URL = "https://evermorelife.org/optin"

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
    "hero_title",
    "hero_title_accent",
    "hero_sub",
    "products_sub",
    "why_title",
    "why_sub",
    "why_cards",
    "optin_heading",
    "optin_sub",
    "optin_disclaimer",
}

BANNED_CLAIMS = (
    "everyone qualifies",
    "guaranteed approval",
    "guarantee approval",
    "licensed in all 50 states",
    "serving families nationwide",
    "best price",
    "lowest price",
    "cheapest",
)


def fail(message: str) -> None:
    raise ValueError(message)


def validate_state(state: dict) -> None:
    missing = sorted(REQUIRED_FIELDS - set(state))
    if missing:
        fail(f"{state.get('name', 'Unknown state')}: missing fields: {', '.join(missing)}")

    status = state["status"]
    if status not in {"active", "pending", "unavailable"}:
        fail(f"{state['name']}: unsupported status {status!r}")

    if not isinstance(state["why_cards"], list) or len(state["why_cards"]) != 4:
        fail(f"{state['name']}: exactly four why_cards are required")
    for card in state["why_cards"]:
        if not card.get("title") or not card.get("body"):
            fail(f"{state['name']}: each why_card needs a title and body")

    if not state["canonical"].endswith(f"/{state['slug']}/"):
        fail(f"{state['name']}: canonical must end with /{state['slug']}/")

    # Non-active states must stay out of the index and out of the active funnel.
    if status != "active" and state["robots"].lower() != "noindex, nofollow":
        fail(f"{state['name']}: non-active states must remain noindex, nofollow")

    combined = " ".join(
        str(v).lower() for k, v in state.items() if k != "why_cards"
    )
    combined += " " + " ".join(
        f"{c.get('title','')} {c.get('body','')}".lower() for c in state["why_cards"]
    )
    for banned in BANNED_CLAIMS:
        if banned in combined:
            fail(f"{state['name']}: banned or unsupported claim detected: {banned!r}")


def render_why_cards(cards: list[dict]) -> str:
    icons = (
        '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
        '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
        '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
        '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>',
    )
    rendered = []
    for index, card in enumerate(cards):
        rendered.append(
            "    <div class=\"why-card\">\n"
            f'      <div class="why-icon"><svg viewBox="0 0 24 24">{icons[index]}</svg></div>\n'
            "      <div>\n"
            f"        <h4>{html.escape(card['title'])}</h4>\n"
            f"        <p>{html.escape(card['body'])}</p>\n"
            "      </div>\n"
            "    </div>"
        )
    return "\n".join(rendered)


def render_status_pill(state: dict) -> str:
    return (
        f'<div class="status-pill status-pill-{state["status"]}">'
        f'<span></span>{html.escape(state["status_label"])}</div>'
    )


def render_ghl_form(form_id: str) -> str:
    fid = html.escape(form_id, quote=True)
    return (
        '<div class="ghl-form-frame">\n'
        '    <iframe\n'
        f'      src="https://api.leadconnectorhq.com/widget/form/{fid}"\n'
        '      style="width:100%;height:606px;border:none;border-radius:8px"\n'
        f'      id="inline-{fid}"\n'
        "      data-layout=\"{'id':'INLINE'}\"\n"
        '      data-trigger-type="alwaysShow"\n'
        '      data-trigger-value=""\n'
        '      data-activation-type="alwaysActivated"\n'
        '      data-activation-value=""\n'
        '      data-deactivation-type="neverDeactivate"\n'
        '      data-deactivation-value=""\n'
        '      data-form-name="Form 10"\n'
        '      data-height="606"\n'
        f'      data-layout-iframe-id="inline-{fid}"\n'
        f'      data-form-id="{fid}"\n'
        '      title="Form 10">\n'
        '    </iframe>\n'
        '  </div>\n'
        '  <script src="https://link.msgsndr.com/js/form_embed.js"></script>'
    )


def render_disclaimer(text: str) -> str:
    return (
        f"{html.escape(text)} View our "
        f'<a href="{PRIVACY_URL}">Privacy Policy</a> and '
        f'<a href="{TERMS_URL}">Terms of Service</a>.'
    )


def render_hero_style(state: dict) -> str:
    """Layer a dark navy gradient over the per-state photo so the white
    headline stays readable. Returns '' when the state has no hero image."""
    image = state.get("hero_image")
    if not image:
        return ""
    return (
        "background-image: linear-gradient(135deg, rgba(13,27,75,0.90) 0%, "
        "rgba(26,48,112,0.62) 55%, rgba(13,27,75,0.86) 100%), "
        f"url('../assets/{image}'); background-size: cover; "
        "background-position: center;"
    )


def render_hero_video(state: dict) -> str:
    """Optional background video for the hero. Muted + autoplay + playsinline so
    it plays through ONCE on load and then holds on its final frame (no loop —
    the clip is short and restarting looks jarring). The hero photo is the
    poster/fallback for mobile and slow connections. Returns '' when absent."""
    video = state.get("hero_video")
    if not video:
        return ""
    poster = state.get("hero_image", "")
    poster_attr = (
        f' poster="../assets/{html.escape(poster, quote=True)}"' if poster else ""
    )
    src = html.escape(video, quote=True)
    return (
        f'<video class="hero-bg" autoplay muted playsinline preload="metadata"{poster_attr}>\n'
        f'    <source src="../assets/{src}" type="video/mp4" />\n'
        "  </video>\n"
        '  <div class="hero-veil" aria-hidden="true"></div>'
    )


def render_hero_kicker(state: dict) -> str:
    """Optional brand tagline that sits above the hero headline as live text."""
    text = state.get("hero_kicker")
    if not text:
        return ""
    return f'<p class="hero-kicker">{html.escape(text)}</p>'


def render_page(template: str, state: dict, form_id: str, email: str) -> str:
    status = state["status"]

    if status == "active":
        quote_href = "#contact"
        quote_link_label = "Get a Quote"
        nav_cta_label = "Free Quote →"
        primary_cta_href = "#contact"
        primary_cta_label = f"Get My Free {state['name']} Quote"
        optin_body = render_ghl_form(form_id)
        optout_href = OPTIN_URL
    else:
        subject = quote(f"{state['name']} availability updates")
        mailto = f"mailto:{email}?subject={subject}"
        quote_href = mailto
        quote_link_label = "Get Updates"
        nav_cta_label = "Get Updates →"
        primary_cta_href = mailto
        primary_cta_label = "Get Availability Updates"
        optin_body = (
            '<div class="availability-cta">\n'
            f'    <a href="{html.escape(mailto, quote=True)}">Get Availability Updates</a>\n'
            "  </div>"
        )
        optout_href = PRIVACY_URL

    raw = {
        "HERO_STYLE": render_hero_style(state),
        "HERO_VIDEO": render_hero_video(state),
        "HERO_KICKER": render_hero_kicker(state),
        "STATUS_PILL": render_status_pill(state),
        "WHY_CARDS": render_why_cards(state["why_cards"]),
        "OPTIN_BODY": optin_body,
        "OPTIN_DISCLAIMER": render_disclaimer(state["optin_disclaimer"]),
    }

    escaped = {
        "NAME": state["name"],
        "CODE": state["code"],
        "STATUS": status,
        "ROBOTS": state["robots"],
        "CANONICAL": state["canonical"],
        "SEO_TITLE": state["seo_title"],
        "SEO_DESCRIPTION": state["seo_description"],
        "HERO_TITLE": state["hero_title"],
        "HERO_TITLE_ACCENT": state["hero_title_accent"],
        "HERO_SUB": state["hero_sub"],
        "PRODUCTS_SUB": state["products_sub"],
        "WHY_TITLE": state["why_title"],
        "WHY_SUB": state["why_sub"],
        "OPTIN_HEADING": state["optin_heading"],
        "OPTIN_SUB": state["optin_sub"],
        "QUOTE_HREF": quote_href,
        "QUOTE_LINK_LABEL": quote_link_label,
        "NAV_CTA_LABEL": nav_cta_label,
        "PRIMARY_CTA_HREF": primary_cta_href,
        "PRIMARY_CTA_LABEL": primary_cta_label,
        "SECONDARY_CTA_LABEL": "See Our Plans",
        "SECONDARY_CTA_HREF": "#products",
        "OPTOUT_HREF": optout_href,
    }

    page = template
    for key, value in raw.items():
        page = page.replace(f"{{{{{key}}}}}", value)
    for key, value in escaped.items():
        page = page.replace(f"{{{{{key}}}}}", html.escape(str(value), quote=True))

    if "{{" in page or "}}" in page:
        fail(f"{state['name']}: unresolved template token remains")

    # Post-render compliance gate.
    low = page.lower()
    if status != "active":
        for marker in ("/optin", "leadconnectorhq", "msgsndr", "widget/form"):
            if marker in low:
                fail(f"{state['name']}: {status} page must not expose active intake ({marker})")
    else:
        if "leadconnectorhq.com/widget/form" not in low:
            fail(f"{state['name']}: active page is missing the embedded quote form")
    return page


def main() -> None:
    payload = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    states = payload["states"]
    form_id = payload.get("ghl_form_id", "")
    email = payload.get("contact_email", "evermorelifeagent01@gmail.com")
    template = TEMPLATE_FILE.read_text(encoding="utf-8")

    for state in states:
        validate_state(state)

    assets_dir = PUBLIC_DIR / "assets"
    assets_dir.mkdir(parents=True, exist_ok=True)
    shutil.copy2(CSS_FILE, assets_dir / CSS_FILE.name)

    # Copy each state's hero image (and optional hero video) into public assets.
    for state in states:
        for key in ("hero_image", "hero_video"):
            asset = state.get(key)
            if not asset:
                continue
            src = ROOT / "assets" / asset
            if not src.exists():
                fail(f"{state['name']}: {key} not found: assets/{asset}")
            shutil.copy2(src, assets_dir / asset)

    built = []
    for state in states:
        output_dir = PUBLIC_DIR / state["slug"]
        output_dir.mkdir(parents=True, exist_ok=True)
        output_file = output_dir / "index.html"
        output_file.write_text(render_page(template, state, form_id, email), encoding="utf-8")
        built.append(f"{state['name']} ({state['status']}): {output_file.relative_to(ROOT)}")

    print("Validated and built state-page drafts:")
    for line in built:
        print(f"- {line}")


if __name__ == "__main__":
    main()
