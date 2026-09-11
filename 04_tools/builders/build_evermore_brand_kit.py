#!/usr/bin/env python3
"""Build the production Evermore Life brand kit from canonical repository assets."""

from __future__ import annotations

import base64
import io
import json
import shutil
import textwrap
import zipfile
from datetime import date
from pathlib import Path
from xml.etree import ElementTree

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "04_content_narrative" / "evermore_life_brand_kit"
SOURCE_LOGO = ROOT / "01_website" / "v2" / "assets" / "evermorelife-llc-logo-nav.png"
SOURCE_SQUARE = ROOT / "01_website" / "v2" / "assets" / "evermorelife-llc-logo.png"
SOURCE_OG = ROOT / "01_website" / "v2" / "assets" / "og-evermore-life.svg"
SOURCE_LOGO_MASTER = ROOT / "01_website" / "v2" / "assets" / "evermore-logo-master.svg"
SOURCE_MARK_MASTER = ROOT / "01_website" / "v2" / "assets" / "evermore-tree-master.svg"
SOURCE_MARK = ROOT / "01_website" / "v2" / "assets" / "evermore-tree-master.png"

VERSION = "1.1.0"

NAVY = "#091238"
NAVY_MID = "#142A52"
NAVY_SOFT = "#203A67"
GOLD = "#C8A96E"
GOLD_LIGHT = "#E5CB95"
CREAM = "#F7F4EE"
PAPER = "#FFFCF7"
INK = "#16223A"
MUTED = "#66748A"
WHITE = "#FFFFFF"

ARIAL = "/System/Library/Fonts/Supplemental/Arial.ttf"
ARIAL_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
GEORGIA = "/System/Library/Fonts/Supplemental/Georgia.ttf"
GEORGIA_BOLD = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def hex_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def canvas(size: tuple[int, int], color: str, mode: str = "RGB") -> Image.Image:
    return Image.new(mode, size, hex_rgb(color) if mode == "RGB" else (*hex_rgb(color), 255))


def contain(image: Image.Image, box: tuple[int, int], margin: int = 0) -> Image.Image:
    target = (max(1, box[0] - margin * 2), max(1, box[1] - margin * 2))
    copy = image.copy()
    copy.thumbnail(target, Image.Resampling.LANCZOS)
    return copy


def fit(image: Image.Image, box: tuple[int, int], margin: int = 0) -> Image.Image:
    """Contain an image and allow careful upscaling for fixed-size PNG exports."""
    target = (max(1, box[0] - margin * 2), max(1, box[1] - margin * 2))
    ratio = min(target[0] / image.width, target[1] / image.height)
    size = (max(1, round(image.width * ratio)), max(1, round(image.height * ratio)))
    return image.resize(size, Image.Resampling.LANCZOS)


def paste_center(base: Image.Image, image: Image.Image, center: tuple[int, int]) -> None:
    x = int(center[0] - image.width / 2)
    y = int(center[1] - image.height / 2)
    base.paste(image, (x, y), image if image.mode == "RGBA" else None)


def flat_gold(image: Image.Image) -> Image.Image:
    """Normalize legacy dimensional artwork into the flat production gold."""
    rgba = image.convert("RGBA")
    normalized = Image.new("RGBA", rgba.size, (*hex_rgb(GOLD), 0))
    normalized.putalpha(rgba.getchannel("A"))
    return normalized


def draw_tracking(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, fnt: ImageFont.FreeTypeFont,
                  fill: str, tracking: int = 3) -> None:
    x, y = xy
    for char in text:
        draw.text((x, y), char, font=fnt, fill=fill)
        x += int(draw.textlength(char, font=fnt)) + tracking


def draw_lines(draw: ImageDraw.ImageDraw, xy: tuple[int, int], lines: list[str], fnt: ImageFont.FreeTypeFont,
               fill: str, gap: int = 10, anchor: str | None = None) -> None:
    x, y = xy
    height = fnt.getbbox("Ag")[3]
    for line in lines:
        draw.text((x, y), line, font=fnt, fill=fill, anchor=anchor)
        y += height + gap


def logo_assets(logo: Image.Image, mark: Image.Image) -> list[dict]:
    items: list[dict] = []
    logo_trim = logo.crop(logo.getbbox())
    logo_viewbox, logo_path = load_vector_master(SOURCE_LOGO_MASTER)
    mark_viewbox, mark_path = load_vector_master(SOURCE_MARK_MASTER)
    logo_scaled = fit(logo_trim, (1040, 466))
    logo_2x = Image.new("RGBA", (1040, 466), (0, 0, 0, 0))
    paste_center(logo_2x, logo_scaled, (520, 233))
    logo_2x.save(OUT / "evermore-logo-gold-transparent.png")
    items.append(asset("evermore-logo-gold-transparent.png", "Logo", "1040×466", "transparent", "Primary gold lockup"))
    write_svg_vector(OUT / "evermore-logo-gold.svg", logo_viewbox, logo_path, GOLD, "Primary gold lockup")
    items.append(asset("evermore-logo-gold.svg", "Logo", "vector", "transparent", "Primary gold vector lockup"))

    for name, bg, label in [
        ("evermore-logo-light", CREAM, "Light surfaces"),
        ("evermore-logo-dark", NAVY, "Dark surfaces"),
    ]:
        image = canvas((1200, 420), bg, "RGBA")
        scaled = contain(logo_trim, (1040, 320))
        paste_center(image, scaled, (600, 210))
        image.save(OUT / f"{name}.png")
        write_svg_vector_wrapper(OUT / f"{name}.svg", 1200, 420, bg, logo_viewbox, logo_path, GOLD, 80, 55, 1040, 310, label)
        items.extend([
            asset(f"{name}.svg", "Logo", "1200×420", bg, f"Primary lockup · {label.lower()}"),
            asset(f"{name}.png", "Logo", "1200×420", bg, f"Primary lockup · {label.lower()}"),
        ])

    alpha = logo_trim.getchannel("A")
    for name, color, label in [
        ("evermore-logo-white", WHITE, "Monochrome white"),
        ("evermore-logo-black", "#111111", "Monochrome black"),
    ]:
        mono = Image.new("RGBA", logo_trim.size, (*hex_rgb(color), 0))
        mono.putalpha(alpha)
        mono = contain(mono, (1040, 466))
        mono.save(OUT / f"{name}.png")
        write_svg_vector(OUT / f"{name}.svg", logo_viewbox, logo_path, color, label)
        items.extend([
            asset(f"{name}.svg", "Logo", f"{mono.width}×{mono.height}", "transparent", label),
            asset(f"{name}.png", "Logo", f"{mono.width}×{mono.height}", "transparent", label),
        ])

    mark_trim = mark.crop(mark.getbbox())
    for name, color, label in [
        ("evermore-tree-gold", None, "Gold tree and roots mark"),
        ("evermore-tree-white", WHITE, "White tree and roots mark"),
        ("evermore-tree-black", "#111111", "Black tree and roots mark"),
    ]:
        rendered = mark_trim.copy()
        if color:
            rendered = Image.new("RGBA", mark_trim.size, (*hex_rgb(color), 0))
            rendered.putalpha(mark_trim.getchannel("A"))
        rendered = contain(rendered, (800, 800))
        rendered.save(OUT / f"{name}.png")
        write_svg_vector(OUT / f"{name}.svg", mark_viewbox, mark_path, color or GOLD, label)
        items.extend([
            asset(f"{name}.svg", "Mark", f"{rendered.width}×{rendered.height}", "transparent", label),
            asset(f"{name}.png", "Mark", f"{rendered.width}×{rendered.height}", "transparent", label),
        ])
    return items


def asset(filename: str, group: str, dimensions: str, background: str, description: str) -> dict:
    return {
        "file": filename,
        "group": group,
        "dimensions": dimensions,
        "background": background,
        "description": description,
    }


def png_data(image: Image.Image) -> str:
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("ascii")


def load_vector_master(path: Path) -> tuple[str, str]:
    root = ElementTree.parse(path).getroot()
    vector_path = root.find("{http://www.w3.org/2000/svg}path")
    if vector_path is None or not vector_path.attrib.get("d"):
        raise ValueError(f"Missing vector path in {path}")
    return root.attrib["viewBox"], vector_path.attrib["d"]


def write_svg_vector(path: Path, viewbox: str, vector_path: str, fill: str, title: str) -> None:
    width = viewbox.split()[2]
    height = viewbox.split()[3]
    path.write_text(
        f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="{viewbox}" role="img" aria-labelledby="title desc">\n'''
        f'''  <title id="title">{title}</title>\n'''
        f'''  <desc id="desc">Production vector artwork for Evermore Life Insurance LLC.</desc>\n'''
        f'''  <path d="{vector_path}" fill="{fill}" fill-rule="evenodd"/>\n'''
        f'''</svg>\n''',
        encoding="utf-8",
    )


def write_svg_vector_wrapper(path: Path, width: int, height: int, bg: str, viewbox: str,
                             vector_path: str, fill: str, x: int, y: int,
                             image_width: int, image_height: int, title: str) -> None:
    path.write_text(
        f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">\n'''
        f'''  <title id="title">{title}</title>\n'''
        f'''  <desc id="desc">Production vector artwork for Evermore Life Insurance LLC.</desc>\n'''
        f'''  <rect width="{width}" height="{height}" rx="28" fill="{bg}"/>\n'''
        f'''  <svg x="{x}" y="{y}" width="{image_width}" height="{image_height}" viewBox="{viewbox}" preserveAspectRatio="xMidYMid meet">\n'''
        f'''    <path d="{vector_path}" fill="{fill}" fill-rule="evenodd"/>\n'''
        f'''  </svg>\n'''
        f'''</svg>\n''',
        encoding="utf-8",
    )


def write_svg_image(path: Path, width: int, height: int, image: Image.Image, title: str) -> None:
    encoded = png_data(image)
    path.write_text(
        f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-label="{title}">\n'''
        f'''  <image width="{width}" height="{height}" href="data:image/png;base64,{encoded}"/>\n</svg>\n''',
        encoding="utf-8",
    )


def write_svg_wrapper(path: Path, width: int, height: int, bg: str, logo: Image.Image,
                      x: int, y: int, image_width: int, image_height: int, title: str) -> None:
    encoded = png_data(logo)
    path.write_text(
        f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-label="{title}">\n'''
        f'''  <rect width="{width}" height="{height}" rx="28" fill="{bg}"/>\n'''
        f'''  <image x="{x}" y="{y}" width="{image_width}" height="{image_height}" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,{encoded}"/>\n</svg>\n''',
        encoding="utf-8",
    )


def app_icon(mark: Image.Image, size: int) -> Image.Image:
    image = canvas((size, size), NAVY, "RGBA")
    draw = ImageDraw.Draw(image)
    radius = int(size * 0.22)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size, size), radius=radius, fill=255)
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse((size * .18, size * .18, size * .82, size * .82), fill=(*hex_rgb(GOLD), 70))
    glow = glow.filter(ImageFilter.GaussianBlur(size * .12))
    image.alpha_composite(glow)
    draw.ellipse((size * .12, size * .12, size * .88, size * .88), outline=GOLD, width=max(1, size // 170))
    scaled = contain(mark, (int(size * .72), int(size * .72)))
    paste_center(image, scaled, (size // 2, size // 2))
    image.putalpha(mask)
    return image


def application_assets(mark: Image.Image, logo: Image.Image) -> list[dict]:
    items: list[dict] = []
    icon = app_icon(mark, 1024)
    icon.save(OUT / "evermore-app-icon-1024.png")
    items.append(asset("evermore-app-icon-1024.png", "Application", "1024×1024", NAVY, "App icon"))
    for size in (512, 192, 180, 32, 16):
        resized = compact_icon(size) if size < 48 else icon.resize((size, size), Image.Resampling.LANCZOS)
        name = f"evermore-icon-{size}.png"
        resized.save(OUT / name)
        items.append(asset(name, "Application", f"{size}×{size}", NAVY, "Browser and app icon"))

    for side in ("front", "back"):
        card = canvas((1050, 600), NAVY if side == "front" else CREAM)
        draw = ImageDraw.Draw(card)
        if side == "front":
            scaled = contain(logo, (760, 300))
            paste_center(card, scaled, (525, 250))
            draw_tracking(draw, (345, 470), "YOUR LEGACY MOVES ON.", font(ARIAL_BOLD, 24), GOLD_LIGHT, 4)
        else:
            draw.text((80, 85), "YOUR NAME", font=font(GEORGIA_BOLD, 46), fill=NAVY)
            draw_tracking(draw, (83, 153), "LICENSED INSURANCE AGENT", font(ARIAL_BOLD, 18), GOLD, 3)
            draw.line((82, 215, 968, 215), fill=GOLD, width=3)
            draw.text((82, 272), "PHONE  ·  EMAIL", font=font(ARIAL_BOLD, 24), fill=INK)
            draw.text((82, 320), "evermorelife.org", font=font(ARIAL, 24), fill=MUTED)
            small_mark = contain(mark, (260, 260))
            paste_center(card, small_mark, (850, 420))
        name = f"evermore-business-card-{side}-1050x600.png"
        card.save(OUT / name, dpi=(300, 300))
        items.append(asset(name, "Print", "1050×600 · 300dpi", NAVY if side == "front" else CREAM, f"Business card {side} template"))
    return items


def compact_icon(size: int) -> Image.Image:
    """Use an intentional small-size monogram where detailed leaves cannot resolve."""
    image = canvas((size, size), NAVY, "RGBA")
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size, size), radius=max(3, size // 5), fill=255)
    draw = ImageDraw.Draw(image)
    inset = max(2, size // 8)
    draw.ellipse((inset, inset, size - inset - 1, size - inset - 1), outline=GOLD, width=max(1, size // 18))
    fnt = font(GEORGIA_BOLD, max(11, round(size * .57)))
    draw.text((size / 2, size * .49), "E", font=fnt, fill=GOLD_LIGHT, anchor="mm")
    image.putalpha(mask)
    return image


def rings(draw: ImageDraw.ImageDraw, center: tuple[int, int], radius: int, color: str, count: int = 4) -> None:
    for i in range(count):
        r = int(radius * (i + 1) / count)
        draw.ellipse((center[0] - r, center[1] - r, center[0] + r, center[1] + r), outline=color, width=2)


def social_art(size: tuple[int, int], logo: Image.Image, mark: Image.Image, kind: str) -> Image.Image:
    w, h = size
    image = canvas(size, NAVY)
    draw = ImageDraw.Draw(image)
    min_side = min(w, h)
    rings(draw, (int(w * .82), int(h * .28)), int(min_side * .33), NAVY_SOFT, 4)
    arc_top = int(h * (.78 if kind in {"linkedin", "facebook", "x", "youtube"} else .64))
    arc_bottom = int(h * (1.30 if kind in {"linkedin", "facebook", "x", "youtube"} else 1.18))
    draw.arc((-int(w * .1), arc_top, int(w * .8), arc_bottom), 190, 350, fill=GOLD, width=max(2, min_side // 300))

    if kind in {"linkedin", "facebook", "x", "youtube"}:
        logo_scaled = contain(logo, (int(w * .30), int(h * .62)))
        image.paste(logo_scaled, (int(w * .05), int(h * .10)), logo_scaled)
        headline_size = max(24, int(h * .16))
        head = font(GEORGIA_BOLD, headline_size)
        sub = font(ARIAL, max(14, int(h * .065)))
        x = int(w * .45)
        y = int(h * .25)
        draw.text((x, y), "Your legacy", font=head, fill=CREAM)
        draw.text((x, y + headline_size * 1.1), "moves on.", font=head, fill=GOLD_LIGHT)
        draw.text((x, y + headline_size * 2.25), "PROTECTION FOR THE PEOPLE WHO CARRY YOUR STORY FORWARD.", font=sub, fill=WHITE)
    else:
        logo_scaled = contain(logo, (int(w * .62), int(h * .22)))
        image.paste(logo_scaled, (int(w * .07), int(h * .06)), logo_scaled)
        if kind == "square":
            lines = ["A promise today.", "Protection tomorrow."]
        elif kind == "portrait":
            lines = ["Protect the life", "you're building."]
        elif kind == "story":
            lines = ["Be there.", "Evermore."]
        elif kind == "pinterest":
            lines = ["Legacy begins", "with one decision."]
        else:
            lines = ["Your legacy", "moves on."]
        headline = font(GEORGIA_BOLD, max(52, int(min_side * .072)))
        start_y = int(h * .44)
        draw_lines(draw, (int(w * .08), start_y), lines, headline, CREAM, gap=int(min_side * .018))
        draw_tracking(draw, (int(w * .08), int(h * .78)), "EVERMORE LIFE INSURANCE LLC", font(ARIAL_BOLD, max(16, int(min_side * .024))), GOLD_LIGHT, max(2, int(min_side * .004)))
        draw.text((int(w * .08), int(h * .84)), "evermorelife.org", font=font(ARIAL, max(18, int(min_side * .027))), fill=WHITE)
        small_mark = contain(mark, (int(min_side * .32), int(min_side * .32)))
        image.paste(small_mark, (int(w * .68), int(h * .65)), small_mark)
    return image


def social_assets(logo: Image.Image, mark: Image.Image) -> list[dict]:
    specs = [
        ("linkedin-company-cover-1512x256.png", (1512, 256), "linkedin", "LinkedIn company cover"),
        ("facebook-page-cover-851x315.png", (851, 315), "facebook", "Facebook Page cover"),
        ("x-header-1500x500.png", (1500, 500), "x", "X profile header"),
        ("youtube-channel-banner-2560x1440.png", (2560, 1440), "youtube", "YouTube channel banner"),
        ("social-feed-square-1080x1080.png", (1080, 1080), "square", "Square feed master"),
        ("social-feed-portrait-1080x1350.png", (1080, 1350), "portrait", "Portrait feed master"),
        ("social-story-reel-1080x1920.png", (1080, 1920), "story", "Story and Reel master"),
        ("pinterest-pin-1000x1500.png", (1000, 1500), "pinterest", "Pinterest Pin master"),
        ("paid-social-landscape-1200x628.png", (1200, 628), "landscape", "Paid social landscape master"),
    ]
    items = []
    for filename, size, kind, description in specs:
        social_art(size, logo, mark, kind).save(OUT / filename)
        items.append(asset(filename, "Social", f"{size[0]}×{size[1]}", NAVY, description))
    return items


def write_support_files(manifest: list[dict]) -> None:
    tokens = {
        "name": "Evermore Life",
        "version": VERSION,
        "colors": {
            "evermoreNavy": NAVY,
            "heritageNavy": NAVY_MID,
            "legacyGold": GOLD,
            "warmGold": GOLD_LIGHT,
            "parchment": CREAM,
            "paper": PAPER,
            "ink": INK,
            "slate": MUTED,
        },
        "typography": {
            "display": "Playfair Display, Georgia, serif",
            "sans": "Inter, Segoe UI, Arial, sans-serif",
        },
        "voice": ["human", "protective", "clear", "grounded", "hopeful"],
        "primaryTagline": "Your legacy moves on.",
        "supportingLine": "Be there evermore.",
        "recruitingLine": "Build with purpose. Protect families. Grow into leadership.",
    }
    (OUT / "brand-tokens.json").write_text(json.dumps(tokens, indent=2) + "\n", encoding="utf-8")
    manifest.append(asset("brand-tokens.json", "Guidance", "JSON", "n/a", "Design tokens and messaging architecture"))

    social_specs = {
        "version": VERSION,
        "safeZoneRule": "Keep logos and essential copy inside the central 80% of each canvas. Preview every final upload in-platform before publishing.",
        "placements": [item for item in manifest if item["group"] == "Social"],
    }
    (OUT / "social-specs.json").write_text(json.dumps(social_specs, indent=2) + "\n", encoding="utf-8")
    manifest.append(asset("social-specs.json", "Guidance", "JSON", "n/a", "Social dimensions and safe-zone rule"))

    email_html = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Evermore Life email signature</title></head>
<body style="margin:0;font-family:Arial,sans-serif;color:#16223A">
<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
<tr><td style="padding-right:18px;border-right:2px solid #C8A96E"><img src="https://evermorelife.org/04_content_narrative/evermore_life_brand_kit/evermore-logo-gold-transparent.png" width="220" alt="Evermore Life Insurance LLC"></td>
<td style="padding-left:18px"><strong style="font-size:16px;color:#091238">YOUR NAME</strong><br><span style="font-size:13px;color:#66748A">Licensed Insurance Agent</span><br><a href="https://evermorelife.org" style="font-size:13px;color:#142A52">evermorelife.org</a></td></tr>
</table></body></html>\n"""
    (OUT / "email-signature.html").write_text(email_html, encoding="utf-8")
    manifest.append(asset("email-signature.html", "Email", "HTML", "transparent", "Editable email signature template"))

    email_header = canvas((1200, 300), NAVY)
    logo = flat_gold(Image.open(SOURCE_LOGO))
    paste_center(email_header, contain(logo, (720, 250)), (600, 150))
    email_header.save(OUT / "email-header-1200x300.png")
    manifest.append(asset("email-header-1200x300.png", "Email", "1200×300", NAVY, "Email header artwork"))

    readme = f"""# Evermore Life Brand Kit

Version {VERSION} · released {date.today().isoformat()}

This package is the production source of truth for the Evermore Life identity.
The original Evermore Life lockup silhouette is preserved as a true vector.
The standalone tree is recovered from the complete high-resolution emblem so
its canopy and infinity roots are no longer cropped.

## Core identity

- Primary tagline: **Your legacy moves on.**
- Supporting line: **Be there evermore.**
- Recruiting line: **Build with purpose. Protect families. Grow into leadership.**
- Display type: Playfair Display (Georgia fallback)
- Body and interface type: Inter (Segoe UI / Arial fallback)

## Usage

- Use the gold lockup on navy or other sufficiently dark, quiet backgrounds.
- Use the light-surface presentation file on parchment and white backgrounds.
- Keep clear space around the logo equal to the height of the capital “L” in Life.
- Minimum digital width: 220px for the horizontal lockup; 48px for the tree mark.
- Never stretch, rotate, redraw, crop, recolor, outline, or add effects to the logo.
- Do not place the mark over faces, high-detail photography, or low-contrast areas.
- Keep product language accurate. Never imply guaranteed eligibility, pricing, approval, or benefits.
- Preview platform artwork in its final destination before publication.

See `asset-manifest.json`, `brand-tokens.json`, and `social-specs.json` for machine-readable guidance.
"""
    (OUT / "README.md").write_text(readme, encoding="utf-8")
    manifest.append(asset("README.md", "Guidance", "Markdown", "n/a", "Brand kit usage guide"))


def build_zip() -> None:
    social_zip = OUT / f"Evermore-Life-Social-Kit-v{VERSION}.zip"
    with zipfile.ZipFile(social_zip, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in sorted(OUT.iterdir()):
            if path.name != "social-specs.json" and path.name.startswith(("linkedin-", "facebook-", "x-header", "youtube-", "social-", "pinterest-", "paid-social-")):
                archive.write(path, arcname=f"Evermore-Life-Social-Kit-v{VERSION}/{path.name}")
        archive.write(OUT / "social-specs.json", arcname=f"Evermore-Life-Social-Kit-v{VERSION}/social-specs.json")

    zip_path = OUT / f"Evermore-Life-Brand-Kit-v{VERSION}.zip"
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in sorted(OUT.iterdir()):
            if path == zip_path or path.name.startswith("."):
                continue
            archive.write(path, arcname=f"Evermore-Life-Brand-Kit-v{VERSION}/{path.name}")


def main() -> None:
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)
    logo = flat_gold(Image.open(SOURCE_LOGO))
    mark = Image.open(SOURCE_MARK).convert("RGBA")

    manifest: list[dict] = []
    manifest.extend(logo_assets(logo, mark))
    manifest.extend(application_assets(mark, logo))
    manifest.extend(social_assets(logo, mark))
    shutil.copy2(SOURCE_OG, OUT / "evermore-open-graph.svg")
    manifest.append(asset("evermore-open-graph.svg", "Application", "1200×630", "varied", "Existing website social preview artwork"))
    write_support_files(manifest)
    manifest_path = OUT / "asset-manifest.json"
    manifest_path.write_text(json.dumps({"brand": "Evermore Life", "version": VERSION, "assetCount": len(manifest), "assets": manifest}, indent=2) + "\n", encoding="utf-8")
    build_zip()
    print(f"Built {len(manifest)} assets in {OUT}")


if __name__ == "__main__":
    main()
