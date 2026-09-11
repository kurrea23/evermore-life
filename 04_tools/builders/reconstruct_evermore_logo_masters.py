#!/usr/bin/env python3
"""Reconstruct clean Evermore vector masters from the best existing artwork.

This is a one-time source-recovery tool. It traces the transparent horizontal
lockup for an exact flat vector silhouette and extracts the complete tree from
the larger circular emblem so the standalone mark does not inherit the cropped
left canopy from the horizontal artwork.
"""

from __future__ import annotations

import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "01_website" / "v2" / "assets"
LOCKUP_SOURCE = ASSETS / "evermorelife-llc-logo-nav.png"
EMBLEM_SOURCE = ROOT / "01_website" / "assets" / "images" / "evermore_logo.png"


def clean_components(mask: np.ndarray, minimum_area: int, drop_border: bool = False) -> np.ndarray:
    count, labels, stats, _ = cv2.connectedComponentsWithStats(mask, connectivity=8)
    cleaned = np.zeros_like(mask)
    for index in range(1, count):
        x, y, width, height, area = stats[index]
        touches_border = x == 0 or y == 0 or x + width == mask.shape[1] or y + height == mask.shape[0]
        if area >= minimum_area and not (drop_border and touches_border):
            cleaned[labels == index] = 255
    return cleaned


def contours_to_path(mask: np.ndarray, epsilon: float) -> str:
    contours, _ = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    parts: list[str] = []
    for contour in contours:
        if abs(cv2.contourArea(contour)) < 2:
            continue
        contour = cv2.approxPolyDP(contour, epsilon, True)
        points = contour.reshape(-1, 2)
        if len(points) < 3:
            continue
        parts.append("M" + " ".join(f"{x},{y}" for x, y in points) + "Z")
    return " ".join(parts)


def write_master(path: Path, width: int, height: int, vector_path: str, title: str) -> None:
    path.write_text(
        f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">\n'''
        f'''  <title id="title">{title}</title>\n'''
        f'''  <desc id="desc">Recovered production vector master derived from approved Evermore artwork.</desc>\n'''
        f'''  <path d="{vector_path}" fill="#C8A96E" fill-rule="evenodd"/>\n'''
        f'''</svg>\n''',
        encoding="utf-8",
    )


def reconstruct_lockup() -> None:
    image = Image.open(LOCKUP_SOURCE).convert("RGBA")
    alpha = np.asarray(image.getchannel("A"))
    mask = np.where(alpha >= 26, 255, 0).astype(np.uint8)
    mask = clean_components(mask, 2)
    write_master(
        ASSETS / "evermore-logo-master.svg",
        image.width,
        image.height,
        contours_to_path(mask, 0.38),
        "Evermore Life Insurance LLC primary lockup",
    )


def reconstruct_tree() -> None:
    source = np.asarray(Image.open(EMBLEM_SOURCE).convert("RGB"))
    # Stay inside the circular border while retaining the full canopy and roots.
    crop = source[150:1085, 178:1076]
    red = crop[:, :, 0].astype(np.int16)
    green = crop[:, :, 1].astype(np.int16)
    blue = crop[:, :, 2].astype(np.int16)
    color_distance = np.maximum(red - blue, green - blue)
    warm = (red > 92) & (green > 67) & (color_distance > 22)
    light_gold = (red > 178) & (green > 148) & (red - blue > 14)
    mask = np.where(warm | light_gold, 255, 0).astype(np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((2, 2), np.uint8))
    # The source emblem contains two circular rules. They touch this crop's
    # boundary while the tree does not, so reject boundary-connected shapes
    # instead of cropping into the canopy again.
    mask = clean_components(mask, 6, drop_border=True)

    points = cv2.findNonZero(mask)
    if points is None:
        raise RuntimeError("Tree extraction produced an empty mask")
    x, y, width, height = cv2.boundingRect(points)
    pad = 18
    x0, y0 = max(0, x - pad), max(0, y - pad)
    x1, y1 = min(mask.shape[1], x + width + pad), min(mask.shape[0], y + height + pad)
    mask = mask[y0:y1, x0:x1]
    rgba = np.zeros((mask.shape[0], mask.shape[1], 4), dtype=np.uint8)
    rgba[:, :, :3] = np.array([200, 169, 110], dtype=np.uint8)
    rgba[:, :, 3] = mask
    Image.fromarray(rgba, "RGBA").save(ASSETS / "evermore-tree-master.png")
    write_master(
        ASSETS / "evermore-tree-master.svg",
        mask.shape[1],
        mask.shape[0],
        contours_to_path(mask, 0.62),
        "Evermore Life tree and infinity roots mark",
    )


def main() -> None:
    reconstruct_lockup()
    reconstruct_tree()
    print("Reconstructed Evermore lockup and complete standalone tree masters")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"reconstruction failed: {exc}", file=sys.stderr)
        raise
