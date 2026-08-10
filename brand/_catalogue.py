"""Shared registration between the catalogue art and the icon artboard.

The Logo Literature scan is the authoritative artwork but it is cropped on the
right and bottom, and it is not drawn at artboard scale. Everything that
measures the catalogue needs the same mapping onto the 564x630 artboard, so it
lives here rather than being repeated with slightly different constants.

The transform is not derived from bounding boxes. Doing that mis-scaled it by
3.5%, because the thresholded box clips the faint tips, and every colour and
crease fitted underneath was then placed against a reference sitting up to 21
units out. It is instead solved for by maximising silhouette agreement with the
rendered SHAPE, which reaches 0.996 coverage.
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ASSETS = Path(
    r"C:\Users\Maruthi Gowda\.cursor\projects"
    r"\c-Users-Maruthi-Gowda-Documents-GitHub-spacesolution\assets"
)
LIT = ASSETS / ("c__Users_Maruthi_Gowda_AppData_Roaming_Cursor_User_workspaceStorage"
                "_empty-window_images_image-8b9b459f-e0a4-476a-a363-f460c75f39d9.png")
ICON = ASSETS / ("c__Users_Maruthi_Gowda_AppData_Roaming_Cursor_User_workspaceStorage"
                 "_empty-window_images_image-bf62ff48-85e6-4f0a-a3ec-2a8692aaea7c.png")

VB_W, VB_H = 564, 630

# SHAPE.getBBox() in the live SVG.
BB_X, BB_Y, BB_W, BB_H = 40.18, 41.89, 516.67, 558.88

# scan -> artboard, solved by _align_silhouette.py (0.9961 coverage)
SCAN_SX = 0.7510
SCAN_SY = 0.7420
SCAN_OX = 5.0
SCAN_OY = 8.0

# The scan's cut edges read as a hard boundary; stay clear of them.
SCAN_MARGIN = 10


def scan_to_art(x: float, y: float) -> tuple[float, float]:
    return (x * SCAN_SX + SCAN_OX, y * SCAN_SY + SCAN_OY)


def art_to_scan(x: float, y: float) -> tuple[float, float]:
    return ((x - SCAN_OX) / SCAN_SX, (y - SCAN_OY) / SCAN_SY)


def is_gold(r: int, g: int, b: int) -> bool:
    """True for slash pixels, excluding the page, the body text and the rules."""
    if min(r, g, b) > 238:
        return False
    if r < 90 or g < 65:
        return False
    if (r - b) < 18:
        return False
    if b >= g + 8:
        return False
    return True


def luminance(r: float, g: float, b: float) -> float:
    return 0.299 * r + 0.587 * g + 0.114 * b


def mask_of(path: Path):
    im = Image.open(path).convert("RGB")
    w, h = im.size
    px = im.load()
    m = [[is_gold(*px[x, y]) for x in range(w)] for y in range(h)]
    return im, m, w, h


def in_scan(x: int, y: int, w: int, h: int) -> bool:
    return SCAN_MARGIN <= x < w - SCAN_MARGIN and SCAN_MARGIN <= y < h - SCAN_MARGIN
