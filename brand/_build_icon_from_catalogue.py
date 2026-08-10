"""Build brand/icon-source.png from catalogue reference art.

Primary 3D shading from catalogue-full.png (high-res crop).
Missing bottom + right tips patched from catalogue-literature.png.
"""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).parent
REFS = ROOT / "refs"
LIT = REFS / "catalogue-literature.png"
CROP = REFS / "catalogue-full.png"
OUT = ROOT / "icon-source.png"
VB_W, VB_H = 564, 630
TARGET = (32, 30, 557, 602)


def is_gold(r: int, g: int, b: int, a: int) -> bool:
    if a < 20:
        return False
    if min(r, g, b) > 238:
        return False
    if r < 95 or g < 70:
        return False
    if (r - b) < 18:
        return False
    if b >= g + 8:
        return False
    return True


def flood_gold(im: Image.Image, seed_max_x: int) -> Image.Image:
    w, h = im.size
    px = im.load()
    raw = [[is_gold(*px[x, y]) for x in range(w)] for y in range(h)]

    vis = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()
    for y in range(h):
        for x in range(min(seed_max_x, w)):
            if raw[y][x] and not vis[y][x]:
                vis[y][x] = True
                q.append((x, y))

    keep = [[False] * w for _ in range(h)]
    while q:
        x, y = q.popleft()
        keep[y][x] = True
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and raw[ny][nx] and not vis[ny][nx]:
                vis[ny][nx] = True
                q.append((nx, ny))

    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    op = out.load()
    xs: list[int] = []
    ys: list[int] = []
    for y in range(h):
        for x in range(w):
            if not keep[y][x]:
                continue
            r, g, b, a = px[x, y]
            if min(r, g, b) > 245:
                continue
            op[x, y] = (r, g, b, 255)
            xs.append(x)
            ys.append(y)

    pad = 4
    return out.crop((min(xs) - pad, min(ys) - pad, max(xs) + pad + 1, max(ys) + pad + 1))


def extract_crop(im: Image.Image) -> Image.Image:
    w, h = im.size
    px = im.load()
    xs = [x for y in range(h) for x in range(w) if is_gold(*px[x, y])]
    ys = [y for y in range(h) for x in range(w) if is_gold(*px[x, y])]
    if not xs:
        return im
    pad = 2
    tight = im.crop((min(xs) - pad, min(ys) - pad, max(xs) + pad + 1, max(ys) + pad + 1))
    out = Image.new("RGBA", tight.size, (0, 0, 0, 0))
    tp, op = tight.load(), out.load()
    tw, th = tight.size
    for y in range(th):
        for x in range(tw):
            if is_gold(*tp[x, y]):
                op[x, y] = (*tp[x, y][:3], 255)
    return out


def fit_to_box(src: Image.Image, box_w: int, box_h: int) -> Image.Image:
    sw, sh = src.size
    scale = max(box_w / sw, box_h / sh)
    nw, nh = int(round(sw * scale)), int(round(sh * scale))
    resized = src.resize((nw, nh), Image.Resampling.LANCZOS)
    left = max(0, (nw - box_w) // 2)
    top = max(0, (nh - box_h) // 2)
    return resized.crop((left, top, left + box_w, top + box_h))


def compose(lit_tight: Image.Image, crop_tight: Image.Image, box_w: int, box_h: int) -> Image.Image:
    """High-res crop for the body; literature fills cropped-off bottom/right."""
    lit = fit_to_box(lit_tight, box_w, box_h)
    bb = lit.split()[3].getbbox()
    if not bb:
        return lit
    x0, y0, x1, y1 = bb
    bw, bh = x1 - x0, y1 - y0
    detail = fit_to_box(crop_tight, bw, bh)

    layer = Image.new("RGBA", (box_w, box_h), (0, 0, 0, 0))
    layer.paste(detail, (x0, y0), detail)
    return Image.composite(layer, lit, layer.split()[3])


def place_on_artboard(tight: Image.Image) -> Image.Image:
    minx, miny, maxx, maxy = TARGET
    box_w, box_h = maxx - minx, maxy - miny
    fitted = fit_to_box(tight, box_w, box_h)
    canvas = Image.new("RGBA", (VB_W, VB_H), (0, 0, 0, 0))
    canvas.paste(fitted, (minx, miny), fitted)
    return canvas


def main() -> None:
    if not LIT.exists():
        raise SystemExit(f"missing {LIT}")

    lit_tight = flood_gold(Image.open(LIT).convert("RGBA"), seed_max_x=200)

    if CROP.exists():
        crop_tight = extract_crop(Image.open(CROP).convert("RGBA"))
        minx, miny, maxx, maxy = TARGET
        merged = compose(lit_tight, crop_tight, maxx - minx, maxy - miny)
        artboard = Image.new("RGBA", (VB_W, VB_H), (0, 0, 0, 0))
        artboard.paste(merged, (minx, miny), merged)
    else:
        artboard = place_on_artboard(lit_tight)

    artboard.save(OUT, optimize=True)
    px = artboard.load()
    minx = miny = VB_W
    maxx = maxy = 0
    for y in range(VB_H):
        for x in range(VB_W):
            if px[x, y][3] > 128:
                minx = min(minx, x)
                miny = min(miny, y)
                maxx = max(maxx, x)
                maxy = max(maxy, y)
    print("wrote", OUT, OUT.stat().st_size, "bytes")
    print("alpha bbox", minx, miny, maxx, maxy)


if __name__ == "__main__":
    main()
