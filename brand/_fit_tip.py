"""Register the reference tail crop onto the artboard and read off the tip.

The crop and the artboard are the same artwork at different scales, so a single
uniform scale plus an offset is enough. The tip itself is excluded from the fit,
since that is the part being corrected.
"""

import re

import numpy as np
from PIL import Image, ImageDraw

REF = (
    r'C:\Users\Maruthi Gowda\.cursor\projects'
    r'\c-Users-Maruthi-Gowda-Documents-GitHub-spacesolution\assets'
    r'\c__Users_Maruthi_Gowda_AppData_Roaming_Cursor_User_workspaceStorage'
    r'_empty-window_images_image-4cd488cd-18e0-4600-ab0e-1e3ad92f8d25.png'
)
JS = r'concepts/preloader/19-gold-forge/gold-forge.js'
VB_W, VB_H = 564, 630
TAIL_Y_MIN = 460  # isolates the tail band from the hook above it


def shape_d():
    src = open(JS, encoding='utf-8').read()
    i = src.index('var SHAPE')
    j = src.index("'", i)
    k = src.index("'", j + 1)
    return src[j + 1:k]


def flatten(d, steps=60):
    nums = lambda s: [float(v) for v in re.findall(r'-?\d+\.?\d*', s)]
    pts = []
    cur = None
    for cmd in re.findall(r'[MCZ][^MCZ]*', d):
        head, rest = cmd[0], cmd[1:]
        v = nums(rest)
        if head == 'M':
            cur = (v[0], v[1])
            pts.append(cur)
        elif head == 'C':
            for c in range(0, len(v), 6):
                c1, c2, p3 = (v[c], v[c + 1]), (v[c + 2], v[c + 3]), (v[c + 4], v[c + 5])
                p0 = cur
                for s in range(1, steps + 1):
                    t = s / steps
                    u = 1 - t
                    x = u**3 * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t**3 * p3[0]
                    y = u**3 * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t**3 * p3[1]
                    pts.append((x, y))
                cur = p3
    return pts


def edges(mask, y_min=0):
    """Per column, the first and last ink row (restricted to y >= y_min)."""
    up, lo = {}, {}
    h, w = mask.shape
    for x in range(w):
        col = np.nonzero(mask[:, x])[0]
        col = col[col >= y_min]
        if len(col):
            up[x], lo[x] = int(col.min()), int(col.max())
    return up, lo


img = Image.new('1', (VB_W, VB_H), 0)
ImageDraw.Draw(img).polygon(flatten(shape_d()), fill=1)
ours = np.asarray(img)
o_up, o_lo = edges(ours, TAIL_Y_MIN)

a = np.asarray(Image.open(REF).convert('RGBA')).astype(int)
ref = (a[:, :, 3] > 60) & (a[:, :, :3].sum(axis=2) < 720)
r_up, r_lo = edges(ref)
r_x = sorted(r_up)
r_tip = min(r_x)

# Thickness does not depend on the vertical offset, so scale and the horizontal
# offset can be fitted on their own, and the vertical offset solved afterwards.
fit_x = np.array([x for x in r_x if r_tip + 45 <= x <= r_tip + 300], dtype=float)
r_t = np.array([r_lo[int(x)] - r_up[int(x)] for x in fit_x], dtype=float)

o_x = np.array(sorted(o_up), dtype=float)
o_t = np.array([o_lo[int(x)] - o_up[int(x)] for x in o_x], dtype=float)
o_u = np.array([o_up[int(x)] for x in o_x], dtype=float)

best = None
for s in np.arange(0.45, 1.45, 0.002):
    for ox in np.arange(-80.0, 90.0, 0.25):
        xa = s * fit_x + ox
        keep = (xa >= o_x[0]) & (xa <= o_x[-1])
        if keep.sum() < 20:
            continue
        pred = np.interp(xa[keep], o_x, o_t)
        err = float(np.mean((s * r_t[keep] - pred) ** 2))
        if best is None or err < best[0]:
            best = (err, s, ox, keep)

err, s, ox, keep = best
xa = s * fit_x + ox
oy = float(np.mean(np.interp(xa[keep], o_x, o_u) - s * np.array(
    [r_up[int(x)] for x in fit_x])[keep]))
print('thickness rms=%.2f  scale=%.4f  ox=%.2f  oy=%.2f' % (err**0.5, s, ox, oy))

tip_rows = np.nonzero(ref[:, r_tip])[0]
tip_y = (tip_rows.min() + tip_rows.max()) / 2
print('ref tip (%d, %.1f) -> artboard (%.2f, %.2f)'
      % (r_tip, tip_y, s * r_tip + ox, s * tip_y + oy))


print('\nper-column check, artboard units (ours minus reference):')
worst = 0.0
for xr in range(r_tip, r_tip + 130, 5):
    if xr not in r_up:
        continue
    xa = s * xr + ox
    xi = int(round(xa))
    if xi not in o_up:
        print('  x=%6.1f   MISSING in ours' % xa)
        continue
    du = o_up[xi] - (s * r_up[xr] + oy)
    dl = o_lo[xi] - (s * r_lo[xr] + oy)
    worst = max(worst, abs(du), abs(dl))
    print('  x=%6.1f   upper %+6.2f   lower %+6.2f' % (xa, du, dl))
print('worst tip-region deviation = %.2f units' % worst)


def slope(edge, x0, span):
    xs = [x for x in range(x0, x0 + span) if x in edge]
    ys = [edge[x] for x in xs]
    return np.polyfit(xs, ys, 1)[0]


for name, e in (('upper', r_up), ('lower', r_lo)):
    m = slope(e, r_tip, 34)
    print('%s edge slope near tip = %+.3f  (artboard, same: %+.3f)' % (name, m, m))
    for dx in (10, 20, 30, 45, 60):
        xr = r_tip + dx
        if xr in e:
            print('    x=%3d  art=(%.1f, %.1f)' % (xr, s * xr + ox, s * e[xr] + oy))
