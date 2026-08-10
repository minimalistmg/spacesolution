"""Regenerate brand/icon-source.png from src header logo on the 564×630 artboard."""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).parent
REPO = ROOT.parent
HEADER = REPO / "src/assets/images/logos/header.png"
OUT = ROOT / "icon-source.png"
VB_W, VB_H = 564, 630
# Matches brand/icon-paths.json ribbon silhouette (pre-catalog trace).
TARGET = (32, 30, 557, 602)


def extract_gold() -> Image.Image:
    im = Image.open(HEADER).convert("RGBA")
    w, h = im.size
    x_limit = int(w * 0.395)
    region = im.crop((0, 0, x_limit, h))
    rw, rh = region.size
    px = region.load()

    def is_core(r: int, g: int, b: int, a: int) -> bool:
        if a < 35:
            return False
        if min(r, g, b) > 200:
            return False
        if r < 100 or g < 55:
            return False
        if (r - b) < 26:
            return False
        if b >= g:
            return False
        return True

    raw = [[False] * rw for _ in range(rh)]
    for y in range(rh):
        for x in range(rw):
            raw[y][x] = is_core(*px[x, y])

    vis = [[False] * rw for _ in range(rh)]
    q: deque[tuple[int, int]] = deque()
    for y in range(rh):
        for x in range(min(30, rw)):
            if raw[y][x] and not vis[y][x]:
                vis[y][x] = True
                q.append((x, y))

    gold = [[False] * rw for _ in range(rh)]
    while q:
        x, y = q.popleft()
        gold[y][x] = True
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < rw and 0 <= ny < rh and raw[ny][nx] and not vis[ny][nx]:
                vis[ny][nx] = True
                q.append((nx, ny))

    keep = [[False] * rw for _ in range(rh)]
    for y in range(rh):
        for x in range(rw):
            if gold[y][x]:
                for dy in range(-2, 3):
                    for dx in range(-2, 3):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < rw and 0 <= ny < rh:
                            keep[ny][nx] = True

    out = Image.new("RGBA", (rw, rh), (0, 0, 0, 0))
    op = out.load()
    xs: list[int] = []
    ys: list[int] = []
    for y in range(rh):
        for x in range(rw):
            if not keep[y][x]:
                continue
            r, g, b, a = px[x, y]
            if min(r, g, b) > 205:
                continue
            if gold[y][x]:
                op[x, y] = (r, g, b, 255)
                xs.append(x)
                ys.append(y)
            else:
                warm = r - b
                if warm < 18 or r < 75:
                    continue
                aa = int(min(255, (warm / 100.0) * (r / 200.0) * 255))
                if aa > 10:
                    op[x, y] = (r, g, b, aa)
                    xs.append(x)
                    ys.append(y)

    pad = 4
    minx = max(0, min(xs) - pad)
    maxx = min(rw - 1, max(xs) + pad)
    miny = max(0, min(ys) - pad)
    maxy = min(rh - 1, max(ys) + pad)
    tight = out.crop((minx, miny, maxx + 1, maxy + 1))

    # Drop any fully transparent margin inside the crop.
    alpha = tight.split()[3]
    ab = alpha.getbbox()
    if ab:
        tight = tight.crop(ab)
    return tight


def place_on_artboard(tight: Image.Image) -> Image.Image:
    minx, miny, maxx, maxy = TARGET
    box_w = maxx - minx
    box_h = maxy - miny
    sw, sh = tight.size
    scale = max(box_w / sw, box_h / sh)
    nw, nh = int(round(sw * scale)), int(round(sh * scale))
    resized = tight.resize((nw, nh), Image.Resampling.LANCZOS)
    left = max(0, (nw - box_w) // 2)
    top = max(0, (nh - box_h) // 2)
    fitted = resized.crop((left, top, left + box_w, top + box_h))
    canvas = Image.new("RGBA", (VB_W, VB_H), (0, 0, 0, 0))
    canvas.paste(fitted, (minx, miny), fitted)
    return canvas


def main() -> None:
    if not HEADER.exists():
        raise SystemExit(f"missing {HEADER}")
    tight = extract_gold()
    artboard = place_on_artboard(tight)
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
    print("size", artboard.size, "alpha bbox", minx, miny, maxx, maxy)


if __name__ == "__main__":
    main()
