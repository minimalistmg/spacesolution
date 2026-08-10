"""Fit the lit face and the shaded face of the gold slash separately.

The base ramp has to be the lit face, not the average of both, otherwise laying
a shadow over it can only ever land the shaded side and leaves the lit side too
dark. This classifies every scan pixel against the fold creases, fits the ramp
to the lit ones, then derives the overlay tint the shaded ones need at a fixed
alpha. Prints gradient stops for gold-forge.js.
"""
from __future__ import annotations

import math
import statistics

from _catalogue import (BB_H, BB_W, BB_X, BB_Y, LIT, in_scan, is_gold, luminance,
                        mask_of, scan_to_art)
from _extract_creases import (SPLIT_Y, as_table, crease_points, sample, smooth,
                              split)

ALPHA = 0.34
NB = 12
AXIS_DEG = 8


def main() -> None:
    lim, lm, lw, lh = mask_of(LIT)
    lpx = lim.load()

    upper, lower = split(crease_points(lim, lm, lw, lh))
    tu, tl = as_table(smooth(upper)), as_table(smooth(lower))

    # The two arms need separate shade gradients. Sharing one leaves the tail's
    # shaded face about 13 too dark through the middle, because its shadow fades
    # off faster along the mark than the upper arm's does.
    lit_px, shade_up, shade_lo = [], [], []
    for y in range(lh):
        for x in range(lw):
            if not in_scan(x, y, lw, lh) or not is_gold(*lpx[x, y]):
                continue
            p = scan_to_art(x, y) + lpx[x, y]
            if y < SPLIT_Y:
                c = sample(tu, x)
                if c is not None and y < c:          # upper arm: back face above
                    shade_up.append(p)
                    continue
            else:
                c = sample(tl, x)
                if c is not None and y > c:          # tail: back face below
                    shade_lo.append(p)
                    continue
            lit_px.append(p)

    shade_px = shade_up + shade_lo
    print(f"lit {len(lit_px)}   shaded upper {len(shade_up)}   tail {len(shade_lo)}")

    a = math.radians(AXIS_DEG)
    ux, uy = math.cos(a), math.sin(a)

    def proj(p):
        return ((p[0] - BB_X) / BB_W) * ux + ((p[1] - BB_Y) / BB_H) * uy

    allp = lit_px + shade_px
    lo = min(proj(p) for p in allp)
    hi = max(proj(p) for p in allp)
    print(f"\naxis: x1=\"{lo * ux * 100:.2f}%\" y1=\"{lo * uy * 100:.2f}%\" "
          f"x2=\"{hi * ux * 100:.2f}%\" y2=\"{hi * uy * 100:.2f}%\"")
    print(f"same axis in userSpace x: {BB_X + lo * ux * BB_W:.0f} .. "
          f"{BB_X + hi * ux * BB_W:.0f}")

    def binned(src):
        bins = [[] for _ in range(NB)]
        for p in src:
            k = min(NB - 1, max(0, int((proj(p) - lo) / (hi - lo) * NB)))
            bins[k].append(p)
        return bins

    lb = binned(lit_px)
    ramp = []
    print("\n--- gfGoldBase stops (lit face) ---")
    for i, bn in enumerate(lb):
        off = (i + 0.5) / NB * 100
        if not bn:
            ramp.append(None)
            continue
        m = tuple(statistics.median([q[2 + j] for q in bn]) for j in range(3))
        ramp.append(m)
        print(f"'<stop offset=\"{off:.0f}%\" stop-color=\""
              f"#{int(m[0]):02x}{int(m[1]):02x}{int(m[2]):02x}\"/>' +"
              f"   // lum {luminance(*m):3.0f}  n={len(bn)}")
    for i in range(NB):
        if ramp[i] is None:
            ramp[i] = (next((ramp[j] for j in range(i, -1, -1) if ramp[j]), None)
                       or next((ramp[j] for j in range(i, NB) if ramp[j]), None))

    for label, src in (("gfFoldUpper", shade_up), ("gfFoldLower", shade_lo)):
        print(f"\n--- {label} stops (shaded face, alpha {ALPHA}) ---")
        prev = None
        for i, bn in enumerate(binned(src)):
            off = (i + 0.5) / NB * 100
            base = ramp[i]
            if len(bn) < 60:
                # No shaded pixels here: the fold is edge-on or off the end of
                # the arm, so the tint has to be the ramp itself or the overlay
                # would tug the lit face around.
                tint, note = list(base), "no fold here, neutral"
            else:
                m = tuple(statistics.median([q[2 + j] for q in bn]) for j in range(3))
                tint = [max(0, min(255, (m[j] - base[j] * (1 - ALPHA)) / ALPHA))
                        for j in range(3)]
                note = f"dL {luminance(*m) - luminance(*base):+4.0f}  n={len(bn)}"
            print(f"'<stop offset=\"{off:.0f}%\" stop-color=\""
                  f"#{int(tint[0]):02x}{int(tint[1]):02x}{int(tint[2]):02x}\" "
                  f"stop-opacity=\"{ALPHA}\"/>' +   // {note}")
            prev = tint


if __name__ == "__main__":
    main()
