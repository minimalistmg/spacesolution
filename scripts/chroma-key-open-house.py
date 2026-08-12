"""Chroma-key green background to alpha and trim empty margins."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

SRC = Path(
    r"C:\Users\Maruthi Gowda\.cursor\projects\c-Users-Maruthi-Gowda-Documents-GitHub-spacesolution\assets\open-house-ref-chroma.png"
)
DST = Path("src/assets/images/open-house/open-house-wide-family.png")


def main() -> None:
    im = Image.open(SRC).convert("RGBA")
    arr = np.asarray(im).astype(np.float32)
    r, g, b, a = arr[..., 0], arr[..., 1], arr[..., 2], arr[..., 3]

    green_dom = (g > 90) & (g > r * 1.25) & (g > b * 1.25)
    near_key = (g > 140) & (r < 130) & (b < 130)
    very_green = (g > 170) & ((g - np.maximum(r, b)) > 35)
    kill = green_dom | near_key | very_green
    arr[..., 3] = np.where(kill, 0, a)

    edge = (~kill) & (g > r) & (g > b) & ((g - np.maximum(r, b)) > 12)
    arr[..., 1] = np.where(edge, np.minimum(g, (r + b) * 0.55 + 20), arr[..., 1])

    out = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGBA")
    bbox = out.getbbox()
    if bbox:
        pad = 8
        x0, y0, x1, y1 = bbox
        out = out.crop(
            (
                max(0, x0 - pad),
                max(0, y0 - pad),
                min(out.width, x1 + pad),
                min(out.height, y1 + pad),
            )
        )

    w, h = out.size
    if w < 1920:
        scale = 1920 / w
        out = out.resize((1920, max(1, int(round(h * scale)))), Image.Resampling.LANCZOS)

    DST.parent.mkdir(parents=True, exist_ok=True)
    out.save(DST, optimize=True)
    print(f"saved {DST} size={out.size} mode={out.mode} ar={out.width/out.height:.3f}")


if __name__ == "__main__":
    main()
