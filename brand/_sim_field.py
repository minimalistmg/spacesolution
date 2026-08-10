"""Reproduce the preloader's distance-field build outside the browser.

The page hangs on load and browser_navigate blocks with it, so the flood fill is
re-run here against the same SHAPE to find out whether it terminates and how
much work it actually does.
"""
from __future__ import annotations

import re
import struct
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

JS = Path(__file__).resolve().parents[1] / "concepts/preloader/19-gold-forge/gold-forge.js"
W, H = 564, 630


def load_shape() -> str:
    txt = JS.read_text(encoding="utf-8")
    m = re.search(r"var SHAPE\s*=\s*\n?\s*'([^']+)'", txt)
    if not m:
        raise SystemExit("SHAPE not found")
    return m.group(1)


def flatten(d: str, steps: int = 24):
    toks = d.replace(",", " ").split()
    pts, i, cur, start = [], 0, (0.0, 0.0), (0.0, 0.0)
    while i < len(toks):
        c = toks[i]
        if c == "M":
            cur = (float(toks[i + 1]), float(toks[i + 2]))
            start = cur
            pts.append(cur)
            i += 3
        elif c == "C":
            p1 = (float(toks[i + 1]), float(toks[i + 2]))
            p2 = (float(toks[i + 3]), float(toks[i + 4]))
            p3 = (float(toks[i + 5]), float(toks[i + 6]))
            p0 = cur
            for s in range(1, steps + 1):
                t = s / steps
                u = 1 - t
                x = (u**3 * p0[0] + 3 * u * u * t * p1[0]
                     + 3 * u * t * t * p2[0] + t**3 * p3[0])
                y = (u**3 * p0[1] + 3 * u * u * t * p1[1]
                     + 3 * u * t * t * p2[1] + t**3 * p3[1])
                pts.append((x, y))
            cur = p3
            i += 7
        elif c in ("Z", "z"):
            pts.append(start)
            cur = start
            i += 1
        else:
            i += 1
    return pts


def main() -> None:
    poly = flatten(load_shape())
    im = Image.new("L", (W, H), 0)
    ImageDraw.Draw(im).polygon(poly, fill=255)
    solid = (np.array(im) > 128).astype(np.uint8)
    n_solid = int(solid.sum())
    print(f"solid cells: {n_solid} of {W * H}")

    S2, S5 = 2 ** 0.5, 5 ** 0.5
    NX = [1, -1, 0, 0,  1,  1, -1, -1,  2,  2, -2, -2,  1,  1, -1, -1]
    NY = [0, 0, 1, -1,  1, -1,  1, -1,  1, -1,  1, -1,  2, -2,  2, -2]
    NW = [1, 1, 1, 1, S2, S2, S2, S2, S5, S5, S5, S5, S5, S5, S5, S5]
    GAX = [0, 0, 0, 0, 0, 0, 0, 0,  1,  1, -1, -1,  0,  0,  0,  0]
    GAY = [0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0,  0,  1, -1,  1, -1]
    GBX = [0, 0, 0, 0, 0, 0, 0, 0,  1,  1, -1, -1,  1,  1, -1, -1]
    GBY = [0, 0, 0, 0, 0, 0, 0, 0,  1, -1,  1, -1,  1, -1,  1, -1]

    flat = solid.reshape(-1)
    # Float32Array, exactly as the browser stores it.
    dist = np.full(W * H, np.inf, dtype=np.float32)

    sx, sy = 47.54, 550.82
    best, seed = 1e18, -1
    ys, xs = np.nonzero(solid)
    dd = (xs - sx) ** 2 + (ys - sy) ** 2
    j = int(np.argmin(dd))
    seed = int(ys[j]) * W + int(xs[j])

    STEP = 0.5
    buckets: dict[int, list[int]] = {}

    def add(k, v):
        buckets.setdefault(int(v / STEP), []).append(k)

    dist[seed] = 0
    add(seed, 0.0)

    pushes = 0
    processed = 0
    far = 0.0
    CAP = n_solid * 60
    b = 0
    maxb = 0
    while b <= maxb:
        lst = buckets.get(b)
        b_now = b
        b += 1
        if not lst:
            continue
        t = 0
        while t < len(lst):
            k = lst[t]
            t += 1
            dk = float(dist[k])
            if dk > (b_now + 1) * STEP:
                continue
            processed += 1
            x, y = k % W, k // W
            for d in range(16):
                X, Y = x + NX[d], y + NY[d]
                if X < 0 or Y < 0 or X >= W or Y >= H:
                    continue
                kk = Y * W + X
                if not flat[kk]:
                    continue
                if not flat[(y + GAY[d]) * W + (x + GAX[d])]:
                    continue
                if not flat[(y + GBY[d]) * W + (x + GBX[d])]:
                    continue
                v = dk + NW[d]
                if v < dist[kk]:
                    dist[kk] = v
                    if v > far:
                        far = v
                    add(kk, v)
                    pushes += 1
                    nb = int(v / STEP)
                    if nb > maxb:
                        maxb = nb
                    if pushes > CAP:
                        print(f"RUNAWAY: {pushes} pushes for {n_solid} cells "
                              f"({pushes / n_solid:.1f} per cell) — not terminating")
                        return
    print(f"terminated. processed {processed}, pushes {pushes} "
          f"({pushes / n_solid:.2f} per solid cell), far {far:.1f}, "
          f"max bucket {maxb}")
    reached = int(np.isfinite(dist).sum())
    print(f"cells reached: {reached} of {n_solid} solid")


if __name__ == "__main__":
    main()
