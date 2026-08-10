"""Break the render-vs-catalogue error down by face.

Whole-image averages say how close it is but not what to change. This splits the
error into the lit and shaded face of each arm, across the mark, so a systematic
bias in one band can be read off and corrected in the corresponding gradient.
"""
from __future__ import annotations

import base64
import io
import json
import statistics
import sys
from pathlib import Path

from PIL import Image

from _catalogue import (LIT, SCAN_MARGIN, VB_H, VB_W, art_to_scan, in_scan,
                        is_gold, luminance, mask_of)
from _extract_creases import SPLIT_Y, as_table, crease_points, sample, smooth, split

NB = 8


def load_render(dump: Path) -> Image.Image:
    raw = json.loads(dump.read_text(encoding="utf-8"))
    while isinstance(raw, dict):
        raw = raw.get("result", raw.get("value"))
    return Image.open(io.BytesIO(base64.b64decode(raw))).convert("RGBA")


def main(dump: Path) -> None:
    ren = load_render(dump)
    rp = ren.load()
    lim, lm, lw, lh = mask_of(LIT)
    lpx = lim.load()

    upper, lower = split(crease_points(lim, lm, lw, lh))
    tu, tl = as_table(smooth(upper)), as_table(smooth(lower))

    groups: dict[str, dict[int, list]] = {}
    for ay in range(VB_H):
        for ax in range(VB_W):
            if rp[ax, ay][3] < 200:
                continue
            sx, sy = art_to_scan(ax, ay)
            xi, yi = int(round(sx)), int(round(sy))
            if not in_scan(xi, yi, lw, lh) or not is_gold(*lpx[xi, yi]):
                continue
            if yi < SPLIT_Y:
                c = sample(tu, xi)
                arm = "upper"
                shaded = c is not None and yi < c
            else:
                c = sample(tl, xi)
                arm = "tail "
                shaded = c is not None and yi > c
            key = f"{arm} {'shaded' if shaded else 'lit   '}"
            d = luminance(*rp[ax, ay][:3]) - luminance(*lpx[xi, yi])
            groups.setdefault(key, {}).setdefault(min(NB - 1, ax * NB // VB_W),
                                                  []).append(d)

    print(f"{'face':16s} " + " ".join(f"x{int(i * VB_W / NB):>3d}+" for i in range(NB)))
    for key in sorted(groups):
        row = []
        for i in range(NB):
            v = groups[key].get(i)
            row.append(f"{statistics.mean(v):+5.1f}" if v and len(v) > 30 else "    .")
        allv = [d for b in groups[key].values() for d in b]
        print(f"{key:16s} " + " ".join(row) +
              f"   | n={len(allv):6d} mean {statistics.mean(allv):+5.1f}"
              f" absmean {statistics.mean([abs(t) for t in allv]):4.1f}")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
