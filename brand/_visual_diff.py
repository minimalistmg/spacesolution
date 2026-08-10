"""Side-by-side and difference map of a render against the catalogue.

Averages hid a real mismatch once: shading scored 3/255 while the silhouette was
registered 3.5% out, so this reports the two separately and writes the overlays
to look at rather than only numbers.
"""
from __future__ import annotations

import base64
import io
import json
import statistics
import sys
from pathlib import Path

from PIL import Image

from _catalogue import (LIT, SCAN_MARGIN, VB_H, VB_W, art_to_scan, is_gold,
                        luminance, mask_of)


def load_render(dump: Path) -> Image.Image:
    raw = json.loads(dump.read_text(encoding="utf-8"))
    while isinstance(raw, dict):
        raw = raw.get("result", raw.get("value"))
    return Image.open(io.BytesIO(base64.b64decode(raw))).convert("RGBA")


def build_reference() -> Image.Image:
    lim, lm, lw, lh = mask_of(LIT)
    lpx = lim.load()
    ref = Image.new("RGBA", (VB_W, VB_H), (0, 0, 0, 0))
    rp = ref.load()
    for ay in range(VB_H):
        for ax in range(VB_W):
            sx, sy = art_to_scan(ax, ay)
            xi, yi = int(round(sx)), int(round(sy))
            if (SCAN_MARGIN <= xi < lw - SCAN_MARGIN
                    and SCAN_MARGIN <= yi < lh - SCAN_MARGIN
                    and is_gold(*lpx[xi, yi])):
                rp[ax, ay] = lpx[xi, yi] + (255,)
    return ref


def main(dump: Path, out: Path) -> None:
    ren = load_render(dump)
    ref = build_reference()
    rp, fp = ren.load(), ref.load()

    # Silhouette agreement, restricted to where the scan actually has coverage.
    # The scan is cropped, so its gold simply stops part way across; counting
    # that as disagreement would report a shape fault that is not there.
    lim, lm, lw, lh = mask_of(LIT)
    gx = [x for y in range(lh) for x in range(lw) if lm[y][x]]
    gy = [y for y in range(lh) for x in range(lw) if lm[y][x]]
    cov_x, cov_y = max(gx) - 12, max(gy) - 12
    print(f"scan gold reaches ({max(gx)}, {max(gy)}); comparing where it has data")

    inter = union = ronly = fonly = 0
    for y in range(VB_H):
        for x in range(VB_W):
            sx, sy = art_to_scan(x, y)
            if not (0 <= sx < cov_x and 0 <= sy < cov_y):
                continue
            a = rp[x, y][3] > 128
            b = fp[x, y][3] > 128
            if a and b:
                inter += 1
            if a or b:
                union += 1
            if a and not b:
                ronly += 1
            if b and not a:
                fonly += 1
    print(f"silhouette IoU {inter / union:.4f}   "
          f"render-only {ronly}   reference-only {fonly}")

    diffs = []
    dimg = Image.new("RGB", (VB_W, VB_H), (255, 255, 255))
    dp = dimg.load()
    for y in range(VB_H):
        for x in range(VB_W):
            if rp[x, y][3] < 200 or fp[x, y][3] < 200:
                continue
            d = luminance(*rp[x, y][:3]) - luminance(*fp[x, y][:3])
            diffs.append(d)
            k = max(-40, min(40, d)) / 40
            if k >= 0:
                dp[x, y] = (255, int(255 * (1 - k)), int(255 * (1 - k)))
            else:
                dp[x, y] = (int(255 * (1 + k)), int(255 * (1 + k)), 255)
    absd = sorted(abs(v) for v in diffs)
    print(f"shading over {len(diffs)} shared px: mean abs "
          f"{statistics.mean(absd):.1f}  signed {statistics.mean(diffs):+.1f}")
    for q in (0.5, 0.9, 0.99):
        print(f"  p{int(q * 100)} {absd[int(q * (len(absd) - 1))]:.0f}")

    panel = Image.new("RGB", (VB_W * 3 + 40, VB_H), (250, 250, 250))
    for i, layer in enumerate((ren, ref)):
        flat = Image.new("RGB", (VB_W, VB_H), (255, 255, 255))
        flat.paste(layer, (0, 0), layer)
        panel.paste(flat, (i * (VB_W + 20), 0))
    panel.paste(dimg, (VB_W * 2 + 40, 0))
    panel.save(out)
    print(f"wrote {out}  (render | reference | diff, red=render brighter)")

    ov = Image.new("RGB", (VB_W, VB_H), (255, 255, 255))
    op = ov.load()
    for y in range(VB_H):
        for x in range(VB_W):
            a, b = rp[x, y][3] > 128, fp[x, y][3] > 128
            op[x, y] = ((225, 225, 225) if a and b else
                        (220, 30, 30) if a else
                        (30, 90, 220) if b else (255, 255, 255))
    sil = out.with_name(out.stem + "_silhouette.png")
    ov.save(sil)
    print(f"wrote {sil}  (red=render only, blue=reference only)")


if __name__ == "__main__":
    main(Path(sys.argv[1]), Path(sys.argv[2]))
