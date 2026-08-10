"""Rebuild brand SVG/HTML from icon-paths.json."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).parent
data = json.loads((ROOT / "icon-paths.json").read_text(encoding="utf-8"))

ribbon = data["ribbon"]
upper = data.get("upper", ribbon)
lower = data.get("lower", ribbon)
stroke_up = data.get("strokeUpper", ribbon)
stroke_lo = data.get("strokeLower", ribbon)
stops = data.get("gradientStops", [])
edge = data.get("edgeGradient", stops[:3])

gold_stops = "".join(
    f'<stop offset="{s["offset"]}%" stop-color="{s["hex"]}"/>' for s in stops
)
edge_stops = "".join(
    f'<stop offset="{s["offset"]}%" stop-color="{s["hex"]}"/>' for s in edge
)

SVG_BODY = f"""
            <defs>
              <filter id="brandSoft" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB">
                <feGaussianBlur stdDeviation="2.2"/>
              </filter>
              <mask id="brandInner" maskUnits="userSpaceOnUse" x="0" y="0" width="564" height="630">
                <g filter="url(#brandSoft)">
                  <path fill="#fff" d="{ribbon}"/>
                  <path fill="none" stroke="#000" stroke-width="7" d="{ribbon}"/>
                </g>
              </mask>
              <linearGradient id="brandGoldBase" x1="14%" y1="8%" x2="86%" y2="92%">
                {gold_stops}
              </linearGradient>
              <linearGradient id="brandGoldEdge" x1="10%" y1="0%" x2="90%" y2="100%">
                {edge_stops}
              </linearGradient>
              <pattern id="brandGoldPattern" patternUnits="userSpaceOnUse" width="564" height="630">
                <image href="./icon-source.png" width="564" height="630" preserveAspectRatio="xMidYMid meet"/>
              </pattern>
              <clipPath id="brandShapeClip"><path d="{ribbon}"/></clipPath>
            </defs>
            <g id="brand-icon-fill">
              <path id="brand-ribbon" fill="url(#brandGoldBase)" d="{ribbon}"/>
              <g clip-path="url(#brandShapeClip)">
                <image href="./icon-source.png" width="564" height="630" preserveAspectRatio="xMidYMid meet" mask="url(#brandInner)"/>
                <path fill="none" stroke="url(#brandGoldEdge)" stroke-width="8" opacity="0.22" filter="url(#brandSoft)" d="{ribbon}"/>
              </g>
              <path id="brand-ribbon-upper" fill="url(#brandGoldPattern)" d="{upper}" opacity="0"/>
              <path id="brand-ribbon-lower" fill="url(#brandGoldPattern)" d="{lower}" opacity="0"/>
            </g>
            <path id="brand-outline" fill="none" stroke="url(#brandGoldEdge)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" opacity="0" d="{ribbon}"/>
            <g id="brand-icon-stroke" class="brand-icon-stroke-guide" fill="none" stroke="#a57e35" stroke-linecap="round" stroke-linejoin="round">
              <path id="brand-stroke-upper" vector-effect="non-scaling-stroke" d="{stroke_up}"/>
              <path id="brand-stroke-lower" vector-effect="non-scaling-stroke" d="{stroke_lo}"/>
            </g>"""

svg_icon = f"""          <svg
            class="brand-icon brand-icon-svg"
            viewBox="0 0 564 630"
            width="564"
            height="630"
            aria-hidden="true"
            focusable="false"
          >{SVG_BODY}
          </svg>"""

html = (ROOT / "index.html").read_text(encoding="utf-8")
wrap = '<div class="brand-icon-wrap" data-brand-icon>'
start = html.index(wrap) + len(wrap)
while start < len(html) and html[start] in " \t\r\n":
    start += 1
for marker in ("          <!-- Pixel reference", "          <!-- Catalogue pixel reference"):
    try:
        end = html.index(marker)
        break
    except ValueError:
        continue
else:
    raise SystemExit("Could not find pixel reference marker in index.html")
new_html = html[: html.index(wrap) + len(wrap)] + "\n" + svg_icon.strip() + "\n\n" + html[end:]
(ROOT / "index.html").write_text(new_html, encoding="utf-8")

mark = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 564 630" width="564" height="630" fill="none" aria-hidden="true">
  <title>Space Solution — Gold Slash</title>
  <defs>
    <filter id="brandSoft" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="2.2"/>
    </filter>
    <mask id="brandInner" maskUnits="userSpaceOnUse" x="0" y="0" width="564" height="630">
      <g filter="url(#brandSoft)">
        <path fill="#fff" d="{ribbon}"/>
        <path fill="none" stroke="#000" stroke-width="7" d="{ribbon}"/>
      </g>
    </mask>
    <linearGradient id="brandGoldBase" x1="14%" y1="8%" x2="86%" y2="92%">
      {gold_stops}
    </linearGradient>
    <linearGradient id="brandGoldEdge" x1="10%" y1="0%" x2="90%" y2="100%">
      {edge_stops}
    </linearGradient>
    <clipPath id="brandShapeClip"><path d="{ribbon}"/></clipPath>
    <symbol id="brand-mark" viewBox="0 0 564 630">
      <path fill="url(#brandGoldBase)" d="{ribbon}"/>
      <g clip-path="url(#brandShapeClip)">
        <image href="./icon-source.png" width="564" height="630" preserveAspectRatio="xMidYMid meet" mask="url(#brandInner)"/>
        <path fill="none" stroke="url(#brandGoldEdge)" stroke-width="8" opacity="0.22" filter="url(#brandSoft)" d="{ribbon}"/>
      </g>
    </symbol>
  </defs>
  <use href="#brand-mark"/>
</svg>
"""
(ROOT / "mark.svg").write_text(mark, encoding="utf-8")

print("updated brand SVG and mark.svg")
