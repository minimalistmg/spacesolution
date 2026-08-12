"""Trim near-black margins; keep full floor plan width (no side crop)."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

SRC = Path("src/assets/images/open-house/open-house-wide-family.png")


def main() -> None:
    im = Image.open(SRC).convert("RGB")
    arr = np.asarray(im)
    mask = arr.max(axis=2) > 18
    ys, xs = np.where(mask)
    y0, y1 = int(ys.min()), int(ys.max())
    x0, x1 = int(xs.min()), int(xs.max())
    pad = 12
    cropped = im.crop(
        (
            max(0, x0 - pad),
            max(0, y0 - pad),
            min(im.width, x1 + 1 + pad),
            min(im.height, y1 + 1 + pad),
        )
    )
    cw, ch = cropped.size
    scale = 1920 / cw
    final = cropped.resize((1920, int(round(ch * scale))), Image.Resampling.LANCZOS)
    final.save(SRC, optimize=True)
    print(f"saved {final.size} ar={final.width/final.height:.3f}")


if __name__ == "__main__":
    main()
