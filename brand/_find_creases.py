"""Look for creases inside the catalogue gold slash.

A smooth gradient has a low, even luminance slope everywhere. Overlapping ribbon
faces meet at a crease, which shows up as a thin line of high slope well inside
the silhouette. This reports the slope distribution and writes a visualisation.
"""
from __future__ import annotations

import statistics
import sys
from pathlib import Path

from PIL import Image


def is_gold(r: int, g: int, b: int) -> bool:
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


def main(path: Path, out: Path) -> None:
    im = Image.open(path).convert("RGB")
    w, h = im.size
    px = im.load()

    solid = [[is_gold(*px[x, y]) for x in range(w)] for y in range(h)]

    # Erode so silhouette edges don't count as creases.
    EROSION = 4
    inner = [[False] * w for _ in range(h)]
    for y in range(EROSION, h - EROSION):
        for x in range(EROSION, w - EROSION):
            if not solid[y][x]:
                continue
            ok = True
            for dy in range(-EROSION, EROSION + 1):
                for dx in range(-EROSION, EROSION + 1):
                    if not solid[y + dy][x + dx]:
                        ok = False
                        break
                if not ok:
                    break
            inner[y][x] = ok

    lum = [[luminance(*px[x, y]) if solid[y][x] else 0.0 for x in range(w)]
           for y in range(h)]

    slopes = []
    vis = Image.new("RGB", (w, h), (255, 255, 255))
    vp = vis.load()
    hot = 0
    for y in range(1, h - 1):
        for x in range(1, w - 1):
            if not inner[y][x]:
                continue
            gx = abs(lum[y][x + 1] - lum[y][x - 1]) / 2
            gy = abs(lum[y + 1][x] - lum[y - 1][x]) / 2
            g = (gx * gx + gy * gy) ** 0.5
            slopes.append(g)
            if g > 6:
                hot += 1
                vp[x, y] = (220, 20, 20)
            else:
                v = int(max(0, 255 - g * 28))
                vp[x, y] = (v, v, v)
    vis.save(out)

    slopes.sort()
    n = len(slopes)
    print(f"{path.name}: {n} interior px")
    print(f"slope per px  mean {statistics.mean(slopes):.2f}  median {slopes[n // 2]:.2f}")
    for q in (0.9, 0.99, 0.999):
        print(f"  p{q * 100:g} = {slopes[int(q * (n - 1))]:.2f}")
    print(f"max {slopes[-1]:.2f}")
    print(f"px with slope > 6 (crease candidates): {hot}  ({100 * hot / n:.2f}%)")
    print(f"wrote {out}")


if __name__ == "__main__":
    main(Path(sys.argv[1]), Path(sys.argv[2]))
