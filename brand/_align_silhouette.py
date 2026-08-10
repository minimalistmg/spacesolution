"""Solve the scan -> artboard registration by matching silhouettes.

Distinguishes two faults that look identical in an overlay: the path being the
wrong shape, versus the path being right but registered wrong. Fits scale and
offset to maximise agreement with the rendered SHAPE. If agreement jumps, the
geometry is fine and only the placement was off. Prints constants for
_catalogue.py.
"""
from __future__ import annotations

import base64
import io
import json
import sys
from pathlib import Path

from PIL import Image

from _catalogue import LIT, VB_H, VB_W, mask_of

MARGIN = 10


def load_render(dump: Path) -> Image.Image:
    raw = json.loads(dump.read_text(encoding="utf-8"))
    while isinstance(raw, dict):
        raw = raw.get("result", raw.get("value"))
    return Image.open(io.BytesIO(base64.b64decode(raw))).convert("RGBA")


def main(dump: Path) -> None:
    ren = load_render(dump)
    rp = ren.load()
    lim, lm, lw, lh = mask_of(LIT)

    ref = [(x, y) for y in range(MARGIN, lh - MARGIN, 2)
           for x in range(MARGIN, lw - MARGIN, 2) if lm[y][x]]
    ren_px = [(x, y) for y in range(0, VB_H, 2) for x in range(0, VB_W, 2)
              if rp[x, y][3] > 128]
    print(f"reference px {len(ref)}   render px {len(ren_px)}")

    def score(sx, sy, ox, oy):
        """Symmetric: reference covered by render, and render backed by reference."""
        cov = 0
        for (x, y) in ref:
            xi = int(round(x * sx + ox))
            yi = int(round(y * sy + oy))
            if 0 <= xi < VB_W and 0 <= yi < VB_H and rp[xi, yi][3] > 128:
                cov += 1
        stray = 0
        for (x, y) in ren_px:
            sxx = int(round((x - ox) / sx))
            syy = int(round((y - oy) / sy))
            if not (MARGIN <= sxx < lw - MARGIN and MARGIN <= syy < lh - MARGIN):
                continue
            if not lm[syy][sxx]:
                stray += 1
        return cov, stray, cov / (len(ref) + stray)

    best = None
    for sx in [0.72 + i * 0.004 for i in range(11)]:
        for ox in [4 + i * 4 for i in range(6)]:
            for oy in [0 + i * 4 for i in range(6)]:
                _, _, s = score(sx, sx, ox, oy)
                if best is None or s > best[0]:
                    best = (s, sx, sx, ox, oy)
    print(f"coarse: score {best[0]:.4f}  sx {best[1]:.4f} ox {best[3]:.1f} oy {best[4]:.1f}")

    ds, do = 0.004, 2.0
    for _ in range(7):
        improved = False
        _, cx, cy, ox, oy = best
        for a in (-ds, 0, ds):
            for b in (-ds, 0, ds):
                for c in (-do, 0, do):
                    for d in (-do, 0, do):
                        if a == b == c == d == 0:
                            continue
                        _, _, s = score(cx + a, cy + b, ox + c, oy + d)
                        if s > best[0]:
                            best = (s, cx + a, cy + b, ox + c, oy + d)
                            improved = True
        if not improved:
            ds /= 2
            do /= 2

    s, sx, sy, ox, oy = best
    cov, stray, _ = score(sx, sy, ox, oy)
    print(f"\nbest: score {s:.4f}  covered {cov}/{len(ref)} ({cov / len(ref):.4f})"
          f"  stray {stray}")
    print("\nfor _catalogue.py:")
    print(f"  SCAN_SX = {sx:.4f}")
    print(f"  SCAN_SY = {sy:.4f}")
    print(f"  SCAN_OX = {ox:.1f}")
    print(f"  SCAN_OY = {oy:.1f}")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
