"""Trace the fold crease of the gold slash into artboard coordinates.

The mark is a twisted ribbon and its two faces meet along a crease running its
whole length. A smooth fill has an interior luminance slope near 0.06 per pixel;
along the crease it reaches 18, so a slope threshold finds it. Emits the two
arcs as cubic path data for gold-forge.js.
"""
from __future__ import annotations

import math
import sys

from _catalogue import (LIT, SCAN_MARGIN, in_scan, is_gold, luminance, mask_of,
                        scan_to_art)

SPLIT_Y = 500          # scan row separating the upper arm from the tail
SLOPE = 6.0            # per-pixel luminance slope that counts as a fold
EROSION = 3            # keep clear of the silhouette's own antialiased edge


def interior(m, w, h):
    inner = [[False] * w for _ in range(h)]
    for y in range(EROSION, h - EROSION):
        for x in range(EROSION, w - EROSION):
            if not m[y][x] or not in_scan(x, y, w, h):
                continue
            ok = True
            for dy in range(-EROSION, EROSION + 1):
                for dx in range(-EROSION, EROSION + 1):
                    if not m[y + dy][x + dx]:
                        ok = False
                        break
                if not ok:
                    break
            inner[y][x] = ok
    return inner


def crease_points(im, m, w, h):
    px = im.load()
    inner = interior(m, w, h)
    lum = [[luminance(*px[x, y]) if m[y][x] else 0.0 for x in range(w)]
           for y in range(h)]
    pts = []
    for y in range(1, h - 1):
        for x in range(1, w - 1):
            if not inner[y][x]:
                continue
            gx = abs(lum[y][x + 1] - lum[y][x - 1]) / 2
            gy = abs(lum[y + 1][x] - lum[y - 1][x]) / 2
            if math.hypot(gx, gy) > SLOPE:
                pts.append((x, y))
    return pts


def split(pts):
    up, lo = {}, {}
    for x, y in pts:
        (up if y < SPLIT_Y else lo).setdefault(x, []).append(y)
    def red(d):
        return [(x, sorted(d[x])[len(d[x]) // 2]) for x in sorted(d)]
    return red(up), red(lo)


def smooth(seq, win=15):
    if len(seq) < win:
        return seq
    out = []
    for i in range(len(seq)):
        a, b = max(0, i - win // 2), min(len(seq), i + win // 2 + 1)
        out.append((sum(p[0] for p in seq[a:b]) / (b - a),
                    sum(p[1] for p in seq[a:b]) / (b - a)))
    return out


def as_table(seq):
    return dict((round(x), y) for x, y in seq)


def sample(table, x):
    if not table:
        return None
    ks = sorted(table)
    if x <= ks[0]:
        return table[ks[0]]
    if x >= ks[-1]:
        return table[ks[-1]]
    lo = max(k for k in ks if k <= x)
    hi = min(k for k in ks if k >= x)
    return table[lo] if hi == lo else (
        table[lo] + (table[hi] - table[lo]) * (x - lo) / (hi - lo))


def resample(seq, n):
    xs = [p[0] for p in seq]
    t = as_table(seq)
    x0, x1 = min(xs), max(xs)
    return [(x0 + (x1 - x0) * i / (n - 1), sample(t, x0 + (x1 - x0) * i / (n - 1)))
            for i in range(n)]


def to_cubic(p):
    d = f"M {p[0][0]:.1f} {p[0][1]:.1f}"
    for i in range(len(p) - 1):
        p0 = p[i - 1] if i > 0 else p[i]
        p1, p2 = p[i], p[i + 1]
        p3 = p[i + 2] if i + 2 < len(p) else p2
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += (f" C {c1[0]:.1f} {c1[1]:.1f} {c2[0]:.1f} {c2[1]:.1f}"
              f" {p2[0]:.1f} {p2[1]:.1f}")
    return d


def extrapolate(pts, to_x):
    """Continue the crease to to_x along the slope of its last two samples."""
    (x0, y0), (x1, y1) = pts[-2], pts[-1]
    if x1 == x0:
        return (to_x, y1)
    return (to_x, y1 + (y1 - y0) / (x1 - x0) * (to_x - x1))


def main() -> None:
    lim, lm, lw, lh = mask_of(LIT)
    pts = crease_points(lim, lm, lw, lh)
    upper, lower = split(pts)
    print(f"crease px {len(pts)}   upper cols {len(upper)}   lower cols {len(lower)}")

    out = {}
    for name, seq in (("UPPER", upper), ("LOWER", lower)):
        art = [scan_to_art(x, y) for x, y in resample(smooth(seq), 12)]
        head = extrapolate(list(reversed(art)), -400)
        tail = extrapolate(art, 600)
        print(f"\n{name}  artboard x {art[0][0]:.0f}..{art[-1][0]:.0f}")
        print("  " + "  ".join(f"({x:.0f},{y:.0f})" for x, y in art))
        out[name] = (head, art, tail)

    hu, au, tu = out["UPPER"]
    hl, al, tl = out["LOWER"]
    # Close each half-plane far enough out that the extrapolated ends, which can
    # run well past the artboard, stay inside it rather than pinching it shut.
    print("\n--- for gold-forge.js ---")
    print(f"\nFOLD_UPPER = 'M {hu[0]:.0f} {hu[1]:.0f} L {to_cubic(au)[2:]} "
          f"L {tu[0]:.0f} {tu[1]:.0f} L 600 -2000 L -400 -2000 Z'")
    print(f"\nFOLD_LOWER = 'M {hl[0]:.0f} {hl[1]:.0f} L {to_cubic(al)[2:]} "
          f"L {tl[0]:.0f} {tl[1]:.0f} L 600 2000 L -400 2000 Z'")


if __name__ == "__main__":
    main()
