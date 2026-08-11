# About Gallery — Modular Scene Brief (Source of Truth)

**Pictorial spec:** see [`about-gallery-modular-spec-mockup.png`](./about-gallery-modular-spec-mockup.png) in this folder (latest version).

**Concept reference:** clean single-bay museum wall — copy + gold CTA left, large framed video right, **gallery watcher (back view) beside the video frame**, and on **large screens** a **rotating bay accent prop** (plant, floor lamp, or other creative object) **before the watcher**, seamless beige plaster, soft spotlight on copy only, thin polished floor. **No visible patch seams, no dark lit panel.**

**Read this file before generating, replacing, or wiring any About gallery scene assets or scroll behavior.** Do not improvise new compositions, palettes, or patch layouts. Reuse the exact asset names, paths, and generation prompts below.

---

## Image generation protocol (mandatory)

**Every time** an agent or tool generates a gallery scene image (mockup or cutout):

1. **Read this file first** — do not paraphrase or shorten prompts.
2. **Copy the prompt verbatim** from the **Exact generation prompts** section below into `GenerateImage` (or equivalent).
3. **Use the exact filename** and **exact aspect ratio** listed for that asset.
4. **Save to the exact path** in the asset inventory table.
5. **Do not change** palette tokens, layout labels, text strings, or composition rules unless this file is version-bumped.
6. After generating `about-gallery-modular-spec-mockup.png`, **copy to** `docs/about-gallery-modular-spec-mockup.png` (overwrite).

If output differs from the mockup spec, **regenerate using the same prompt** — do not invent a new prompt.

---

## Goal

Rebuild the About page gallery as a **full-width, full-height** horizontal walkthrough driven by **vertical scroll**. Each bay should read like **one continuous museum wall** (see concept mockup) — not a collage of obvious patches. Modular assets exist for width flexibility and pillar seams; they must **blend invisibly** at runtime.

---

## Visual target (v3 — concept-driven)

| Principle | Target |
|-----------|--------|
| **Wall** | One seamless warm beige plaster field (`#ebe6dc`). Center tile repeats invisibly. Caps are **narrow** — pillar seams only. |
| **Light** | **Soft warm pool on copy/CTA zone only** via CSS gradient overlay. Slides 1–2: **one** ceiling spotlight at top. **Slide 3 (last): two** ceiling spotlights at top. Video zone stays evenly lit. No dark left panel. |
| **Copy** | Large display title, meta line (`2011 • Mysuru • Factory`), gold **See more →** button. Left ~32–38% of bay. |
| **Media** | Large framed video thumbnail on wall — subtle drop shadow, sharp triangle play icon. Right ~50–55%, vertically centered. Label under frame (HTML). |
| **Floor** | Thin polished concrete band (~12–15% body height), white baseboard, **no prominent stage lip** in default layout. |
| **Pillar** | Half-round modern column **only at bay seam** (peek during scroll). Not visible in static single-bay hero. |
| **Gallery watcher** | **Required.** Regular person **beside the video frame**, **back to website visitor**, facing the screen. Feet on floor line. |
| **Bay accent prop** | **Large screens only (≥1400px).** Separate PNG — **one per slide**, rotated: floor plant, single-piece floor lamp, or other gallery-appropriate object. Placed **before the watcher**. Fills ultrawide center gap. **Do not use plant on every slide.** |
| **Peek** | Next bay wall visible **only while scrubbing**, ~120–200px strip at right edge. |

### What to avoid (current ugly patterns)

- Wide dark “spotlight cap” panel that breaks wall continuity
- Visible vertical seam between lit left zone and center tile
- Full-width gray stage strip or floating platform band
- Visitor facing the camera or standing far left near copy
- Visitor overlapping the video frame or caption label
- Front-facing visitor cutout when back-view is specified
- Media frame competing with peek pillar in same static view

---

## Layout model

| Zone | Content |
|------|---------|
| **Headline band (above pin)** | Separate HTML: “Small team,” + `big results` watermark |
| **Stats band (inside pin, top)** | HTML only: 2011, 800+, 1, End-to-end on `#fdfbf7` |
| **Bay body** | Full viewport width × remaining gallery height |

### Per bay — HTML overlays only (never bake into images)

- Title + meta/subtext
- **Gold CTA** — `See more` + arrow; placement per variant
- Video thumbnail + center triangle play icon + caption label
- **Gallery watcher** PNG — back view, beside video frame (see below)
- **Bay accent prop** PNG — large screens only, before watcher (see **Bay accent props**)
- Optional slide nav pill (`← 1 / N →`) bottom-right of media — HTML only

**Layout rule:** Copy + CTA sit in the **soft spotlight zone** (CSS). Video sits in **neutral wall light**. On wide bays the foreground order (copy-before-video) is: `[copy] … [accent prop] [watcher] [video frame]` — accent prop **before** watcher, base on floor line.

### Per bay — generated patches (layers)

Stack order (back → front):

1. **Wall center tile** — repeat H+V; fills entire wall behind HTML
2. **Wall left cap** — **narrow**; plain or right half of pillar from previous seam
3. **Wall right cap** — **narrow**; left half of pillar at seam
4. **Spotlight wash** — **CSS `radial-gradient` on copy zone** (one pool slides 1–2; **dual pool** slide 3)
5. **Ceiling lights** — HTML/CSS fixture overlay at top of wall (see **Per-slide ceiling lights**); **1 cylinder** slides 1–2, **2 cylinders** slide 3
6. **Baseboard** strip
7. **Floor ground** patch — full-width polished concrete
8. **Floor stage** (optional) — deprecated for default; watcher stands on floor ground
9. **Gallery watcher** PNG — **back view**, beside video frame, facing screen
10. **Bay accent prop** PNG (large screens) — before watcher; plant, lamp, or creative object per slide

**Deprecated for default slides:** using `wall-cap-lights-left/right.jpg` as a wide left/right grid column. Keep assets for fallback; prefer CSS lighting. Front-facing `viewer-woman.png` / `viewer-man.png` for default bays — use **back-view** assets instead.

---

## Horizontal bay assembly (width)

```
[ NARROW LEFT CAP ] [ CENTER TILE repeat 1fr ] [ NARROW RIGHT CAP ]
         ↑                      ↑                         ↑
   pillar half (optional)   invisible repeat          pillar half → peek
```

- **Center tile dominates** — caps stay at `--gallery-cap-w: clamp(120px, 14vw, 200px)`.
- **Right cap N + left cap N+1** = one full modern pillar at seam during scroll.
- Pillar: modern minimal cylinder, smooth plaster/concrete, subtle base ring.

---

## Fixed design tokens (do not change)

| Token | Value |
|-------|--------|
| Wall tone | `#ebe6dc` warm beige plaster |
| Stats band bg | `#fdfbf7` |
| Spotlight (CSS) — slides 1–2 | `radial-gradient(ellipse 70% 55% at 22% 38%, rgba(255, 236, 200, 0.55) 0%, transparent 72%)` on copy-before-video |
| Spotlight (CSS) — slide 3 (dual) | **Two** overlapping ellipses on copy zone — see **Per-slide ceiling lights** |
| Ceiling fixture | Small white cylinder track light, ~24–32px wide in CSS; warm cone cast downward |
| CTA | Gold filled button, arrow suffix |
| Floor | Polished light grey-beige, **12–15%** of gallery body height |
| Baseboard | Clean white/off-white beading |
| Media frame shadow | `0 12px 32px rgba(40, 32, 24, 0.14)` |
| Camera | Modest distance — wall dominates; **short** floor strip |
| Peek | `--gallery-peek: clamp(120px, 14vw, 200px)` |

---

## HTML content layout variants

| Variant | Copy + CTA | Video | Spotlight (CSS) | Foreground order (copy-before-video) |
|---------|------------|-------|-----------------|--------------------------------------|
| **copy-before-video** (primary) | Left ~35% | Center-right ~52% | Ellipse top-left on copy | `[accent prop?] [watcher] [video]` — prop only ≥1400px |
| **copy-beside-video** (alternate) | Right ~35% | Center-left ~52% | Ellipse top-right on copy | `[video] [watcher] [accent prop?]` — prop only ≥1400px |

---

## Slide catalog (3 bays)

| # | ID | Title | Layout | Watcher | Ceiling lights | Accent prop (lg+) |
|---|-----|-------|--------|---------|----------------|-------------------|
| 1 | `craft` | In-house craft | copy-before-video | `viewer-back-woman` | **One** | **Floor plant** (`gallery-floor-plant.png`) |
| 2 | `factory` | Factory finish | copy-beside-video | `viewer-back-man` | **One** | **Single-piece floor lamp** (`gallery-floor-lamp.png`) |
| 3 | `spaces` | Built spaces | copy-before-video | `viewer-back-girl` | **Two** | **Creative object** — e.g. material sample plinth (`gallery-accent-plinth.png`) or approved alternate |

---

## Per-slide ceiling lights

Visible **at the top of the wall** — small modern cylinder track lights (HTML/CSS), casting warm cones onto the **copy/CTA zone only**. Never aimed at the video frame.

| Slide | Fixture count | Placement | Spotlight CSS |
|-------|---------------|-----------|---------------|
| **1 – craft** | **1** | Top-left, above copy zone | Single ellipse (token above) |
| **2 – factory** | **1** | Top-right, above copy zone | Single ellipse mirrored: `at 78% 38%` |
| **3 – spaces (last)** | **2** | **Two** fixtures top-left, side by side, above copy zone | Dual ellipse — see below |

### Slide 3 dual-light spec (required)

Slide 3 (`spaces` / “Built spaces”) is the **only** bay with **two** ceiling lights instead of one.

**Fixtures:** two identical white cylinder track spotlights, horizontally spaced (~80–120px apart at desktop), both top-left quadrant, both casting toward copy + CTA — **not** toward video.

**Dual spotlight CSS (copy-before-video, slide 3 only):**

```css
.about-gallery-slide.is-dual-ceiling-lights .about-gallery-spotlight--left {
  background:
    radial-gradient(ellipse 55% 50% at 16% 36%, rgba(255, 236, 200, 0.5) 0%, transparent 68%),
    radial-gradient(ellipse 55% 50% at 28% 36%, rgba(255, 236, 200, 0.48) 0%, transparent 68%);
}
```

**Markup:** add class `is-dual-ceiling-lights` on slide 3 article; `.about-gallery-ceiling-lights` contains one or two `.about-gallery-ceiling-light` elements per slide.

**Mockup / image generation:** any pictorial of slide 3 must show **two** top lights, not one.

---

## Gallery watcher (back view — required)

The **website visitor** sees the **back** of a regular gallery guest who is watching the video on the wall. The watcher stands **next to the video frame**, not near the copy block.

| Rule | Value |
|------|--------|
| **Camera POV** | Website visitor = frontal view of the bay → watcher’s **back** is visible |
| **Watcher POV** | Watcher faces the **video frame** / screen |
| **Placement (copy-before-video)** | Standing on floor, **immediately to the left of the video frame**, slight overlap with frame shadow OK, **never covering play icon** |
| **Placement (copy-beside-video)** | Standing on floor, **immediately to the right of the video frame** |
| **Scale** | Full body or ¾ body; height ~28–34% of gallery body; feet on floor line |
| **Cast** | Rotate `viewer-back-woman`, `viewer-back-man`, `viewer-back-boy`, `viewer-back-girl` across slides |
| **Default slide 1 (craft)** | `viewer-back-woman.png` |
| **Never** | Front-facing cutout, floating above floor, centered on copy side, baked into JPG patches |

Shared back-view prompt suffix (append to every CHAR-BACK-* prompt):

```
View from BEHIND the person — website visitor sees their BACK and back of head, NOT their face. Person is looking AT a gallery video screen on the wall in front of them. Regular natural everyday person, NOT a fashion model. Relaxed posture. Photoreal. Solid chroma green #00FF00 background. Full body, feet visible. No text.
```

---

## Bay accent props (large screens — rotate per slide)

A **separate PNG cutout** — not baked into wall/floor JPGs. Fills the ultrawide center gap on **≥1400px** viewports. **Rotate the prop across slides** — do **not** default to a plant on every bay.

### Approved prop types

| Type | Asset | Use on slide | Notes |
|------|-------|--------------|-------|
| **Floor plant** | `gallery-floor-plant.png` | 1 – craft | Fiddle-leaf or rubber plant in cream pot |
| **Single-piece floor lamp** | `gallery-floor-lamp.png` | 2 – factory | One sculptural accent lamp — arc, tripod, or minimal column; warm gallery tone |
| **Creative accent object** | `gallery-accent-plinth.png` (or slide-specific) | 3 – spaces | e.g. low plinth with material samples, small sculpture, design object on stand — must feel gallery-appropriate |
| **Future alternates** | `gallery-accent-*.png` | Any | Stool, side table with object, bench corner — **approve in brief first** before generating |

### Shared rules (all accent props)

| Rule | Value |
|------|--------|
| **Show when** | Viewport **≥ 1400px** only |
| **Placement (copy-before-video)** | On floor, **immediately before the watcher** (between copy and watcher) |
| **Placement (copy-beside-video)** | On floor, **immediately after the watcher** (between watcher and copy side) |
| **Scale** | Height ~18–26% of gallery body; base on floor line |
| **Per slide** | **Exactly one** accent prop — never stack plant + lamp together |
| **Rotation** | **Different prop type per slide** when possible (see slide catalog) |
| **Never** | Block copy, cover play icon, overlap watcher badly, show on mobile/tablet, repeat same prop on all slides unless user requests |

Shared accent-prop prompt suffix (append to every PROP-* prompt):

```
Separate object for modern interior gallery scene. Warm neutral palette matching beige wall #ebe6dc. Soft shadow at base. NO person, NO wall, NO floor in background — solid chroma green #00FF00 only. Full object visible including base. No text.
```

---

## Asset generation order

1. `wall-center-tile.jpg` ← **first** (must tile invisibly)
2. `wall-cap-left.jpg` + `wall-cap-right.jpg` (pillar pair, **narrow** caps)
3. `baseboard-strip.png`
4. `floor-ground.jpg`
5. **Gallery watcher back-view cutouts** (`viewer-back-woman` first, then man / boy / girl)
7. **Bay accent props** — `gallery-floor-plant.png`, `gallery-floor-lamp.png`, `gallery-accent-plinth.png` (one type per slide)
8. ~~`floor-stage.png`~~ — optional legacy
9. ~~`wall-cap-lights-*.jpg`~~ — deprecated; CSS handles spotlight
10. **`about-gallery-modular-spec-mockup.png`** — regenerate from exact prompt after any layout change

---

## Asset inventory (canonical paths)

All assets under `src/assets/images/gallery-backgrounds/` unless noted.

| ID | Filename | Type | Purpose |
|----|----------|------|---------|
| WALL-MID | `wall-center-tile.jpg` | JPG tile | Repeat H+V; **invisible** seams |
| WALL-CAP-L | `wall-cap-left.jpg` | JPG cap | **Narrow** left edge; pillar half optional |
| WALL-CAP-R | `wall-cap-right.jpg` | JPG cap | **Narrow** right edge; pillar half at seam |
| BASEBOARD | `baseboard-strip.png` | PNG strip | Horizontal beading |
| FLOOR | `floor-ground.jpg` | JPG patch | Full-width polished floor band |
| STAGE | `floor-stage.png` | PNG patch | Optional legacy; prefer floor ground only |
| CHAR-BACK-W | `../gallery-spectators/viewer-back-woman.png` | PNG cutout | Woman, **back view**, watching video |
| CHAR-BACK-M | `../gallery-spectators/viewer-back-man.png` | PNG cutout | Man, **back view**, watching video |
| CHAR-BACK-BOY | `../gallery-spectators/viewer-back-boy.png` | PNG cutout | Boy, **back view**, watching video |
| CHAR-BACK-GIRL | `../gallery-spectators/viewer-back-girl.png` | PNG cutout | Girl, **back view**, watching video |
| PROP-PLANT | `../gallery-spectators/gallery-floor-plant.png` | PNG cutout | Floor plant — slide 1 |
| PROP-LAMP | `../gallery-spectators/gallery-floor-lamp.png` | PNG cutout | Single-piece floor lamp — slide 2 |
| PROP-PLINTH | `../gallery-spectators/gallery-accent-plinth.png` | PNG cutout | Creative accent / material plinth — slide 3 |
| MOCKUP | `about-gallery-modular-spec-mockup.png` | PNG | Slide 1 pictorial — **one** top light |
| MOCKUP-S2 | `about-gallery-slide-2-mockup.png` | PNG | Slide 2 pictorial — floor **lamp** accent prop |
| MOCKUP-S3 | `about-gallery-slide-3-mockup.png` | PNG | Slide 3 pictorial — **two** top lights + creative accent prop |

**Deprecated:** front-facing `viewer-woman.png` / `viewer-man.png` for default bays; `wall-cap-lights-left.jpg`, `wall-cap-lights-right.jpg`, unified scene JPGs.

---

## Exact generation prompts

Copy verbatim into `GenerateImage`. Only regenerate if this brief changes or user approves a version bump.

### WALL-MID — `wall-center-tile.jpg` (1:1)

```
Square 1:1 seamless tileable texture. Warm beige plaster wall #ebe6dc, subtle fine grain, evenly lit, NO spotlights, NO corners, NO baseboard, NO floor, NO pillar. Must tile flawlessly horizontally and vertically with zero visible seams. No text, no objects.
```

### WALL-CAP-L — `wall-cap-left.jpg` (3:4)

```
Tall narrow 3:4 photoreal gallery wall LEFT EDGE cap patch. Warm beige plaster #ebe6dc, evenly lit, same tone as center tile. RIGHT edge ONLY: RIGHT HALF of modern minimal round pillar (smooth cylinder, subtle base ring) sliced at center. LEFT 85%: plain seamless wall matching tile. NO spotlights, NO floor, NO person, NO text. Flat frontal camera.
```

### WALL-CAP-R — `wall-cap-right.jpg` (3:4)

```
Tall narrow 3:4 photoreal gallery wall RIGHT EDGE cap patch. Warm beige plaster #ebe6dc, evenly lit. LEFT edge ONLY: LEFT HALF of same modern minimal round pillar sliced at center. RIGHT 85%: plain seamless wall matching tile. NO spotlights, NO floor, NO person, NO text. Flat frontal camera.
```

### BASEBOARD — `baseboard-strip.png` (16:1)

```
Wide ultra-wide horizontal strip, photoreal white/off-white architectural wall baseboard and beading profile. Top meets flat wall, bottom meets floor. Warm gallery style. No text.
```

### FLOOR — `floor-ground.jpg` (16:3)

```
Wide 16:3 photoreal polished concrete floor band. Light grey-beige, subtle reflection. Floor only — no wall, no baseboard, no stage. No text.
```

### STAGE — `floor-stage.png` (16:4) — optional

```
Wide 16:4 photoreal subtle raised floor platform for gallery visitor. Same polished concrete family, small elevated lip at top, bottom 40% fades to floor extension (clipped in CSS). NO person. No text.
```

### MOCKUP — `about-gallery-modular-spec-mockup.png` (16:9)

**Always copy this block verbatim. Do not edit at generation time.**

```
UI design mockup 16:9 of a premium interior design studio About page gallery bay on a WIDE desktop viewport (~1920px feel). Top: white stats bar with four columns — "2011" / "Studio founded in Mysuru", "800+" / "Projects across Karnataka", "1" / "In-house manufacturing unit", "End-to-end" / "Design to installation" — bold serif numbers, small sans labels. Main bay: single full-width museum gallery wall, warm seamless beige plaster #ebe6dc, evenly lit with ONE soft warm spotlight pool on the LEFT third only illuminating copy zone. LEFT: large black serif headline "In-house craft", grey subtext "2011 • Mysuru • Factory", gold rounded pill button "See more →". RIGHT-CENTER: large rectangular framed video thumbnail on wall showing bright luxury living room interior with wood ceiling and sofa, thin dark frame, subtle drop shadow, black triangle play icon centered on thumbnail, small uppercase caption "Studio craft" below frame. BETWEEN copy and video, on polished floor in this left-to-right order: first a nice tall interior floor plant in cream ceramic pot (fiddle-leaf fig or rubber plant, separate accent prop object with soft shadow, fills center gap on wide screen), then immediately beside the prop one regular natural woman gallery visitor seen FROM BEHIND — back and back of head visible, facing the video screen, standing on floor, everyday smart casual, feet on floor, NOT facing camera. Accent prop is BEFORE the watcher (closer to copy). Top-left ceiling: ONE small white cylinder track spotlight visible. Bottom: thin white baseboard and short polished light grey concrete floor band full width. NO visible patch seams, NO dark left panel, NO peek of next slide, NO pillar in main view, NO browser chrome. Clean minimal Ness Studio museum walkthrough. Small grey annotation labels at bottom edge: "copy + spotlight" under left copy, "accent prop — plant (lg+)" under plant, "gallery watcher (back)" under person, "video frame" under video, "floor band" under floor.
```

### MOCKUP-SLIDE-3 — `about-gallery-slide-3-mockup.png` (16:9)

**Slide 3 / last bay only. Always copy verbatim. Shows TWO top lights (not one).**

```
UI design mockup 16:9 of premium interior design studio About page gallery SLIDE 3 (last bay) on wide desktop ~1920px. Top: same white stats bar — "2011", "800+", "1", "End-to-end" with labels. Main bay: warm seamless beige plaster wall #ebe6dc. Top-left ceiling: TWO small white cylinder track spotlights side by side (NOT one) casting overlapping warm pools on copy zone only. LEFT: large black serif headline "Built spaces", grey subtext "Homes • Work • Hospitality", gold pill button "See more →". RIGHT-CENTER: large framed video thumbnail showing residential villa interior walkthrough, play icon, caption "Project walkthrough" below. On floor between copy and video: low material sample plinth or small creative gallery accent object (NOT a plant — rotate props per slide) then young girl gallery visitor FROM BEHIND facing video, accent object before watcher. Bottom: white baseboard and grey concrete floor band. NO peek, NO pillar, NO browser chrome. Labels: "copy + dual spotlight", "2 ceiling lights", "accent prop — plinth (lg+)", "gallery watcher (back)", "video frame", "floor band".
```

### PROP-PLANT — `gallery-floor-plant.png` (3:4)

```
Single photoreal interior floor plant for a modern gallery — tall fiddle-leaf fig OR rubber plant with glossy green leaves, in a simple cream-white ceramic pot. Natural soft shadow at pot base. Warm neutral tones matching beige gallery #ebe6dc environment. NO person, NO wall, NO floor texture in background — solid chroma green #00FF00 only. Full plant visible including pot. No text.
```

### PROP-LAMP — `gallery-floor-lamp.png` (3:4)

```
Single photoreal sculptural floor lamp for a modern gallery — ONE accent piece only: minimal arc floor lamp OR slim tripod lamp with warm fabric or brass shade, off when lit softly by gallery ambient (no harsh bloom). Cream, brass, or matte black finish matching warm beige gallery #ebe6dc. Base on floor. Separate object for modern interior gallery scene. Warm neutral palette matching beige wall #ebe6dc. Soft shadow at base. NO person, NO wall, NO floor in background — solid chroma green #00FF00 only. Full object visible including base. No text.
```

### PROP-PLINTH — `gallery-accent-plinth.png` (3:4)

```
Single photoreal low gallery plinth or pedestal for interior design showroom — small rectangular white or light oak base with 2-3 material samples on top (wood swatch, stone tile, fabric chip) OR one minimal ceramic design object. Museum/gallery styling, warm neutral #ebe6dc palette. Separate object for modern interior gallery scene. Soft shadow at base. NO person, NO wall, NO floor in background — solid chroma green #00FF00 only. Full object visible. No text.
```

### MOCKUP-SLIDE-2 — `about-gallery-slide-2-mockup.png` (16:9)

**Slide 2 only. Always copy verbatim. Accent prop = floor lamp (not plant).**

```
UI design mockup 16:9 of premium interior design studio About page gallery SLIDE 2 on wide desktop ~1920px. Top: white stats bar. Main bay: warm beige plaster wall #ebe6dc, ONE soft spotlight pool top-RIGHT on copy zone. RIGHT: copy block "Factory finish", "CNC • Soft-close • Site fit", gold "See more →". LEFT-CENTER: large framed modular kitchen video thumbnail with play icon, caption "Modular kitchen". On floor: ONE sculptural single-piece floor lamp (accent prop, NOT a plant) then man gallery visitor FROM BEHIND facing video, lamp after watcher toward copy side (copy-beside-video layout). ONE ceiling spotlight top-right. Bottom: baseboard and floor band. Labels: "accent prop — floor lamp (lg+)", "gallery watcher (back)", "video frame". NO browser chrome.
```

### CHAR-BACK-W — `viewer-back-woman.png` (3:4)

```
Full body photoreal regular natural Indian woman age 27-32, everyday smart casual — simple blouse and trousers, flat shoes. View FROM BEHIND — website visitor sees her BACK and back of head, NOT her face. She stands relaxed looking at a gallery video screen on the wall in front of her. Arms natural at sides or one hand slightly raised toward screen. NOT a model pose — ordinary museum visitor. Solid chroma green #00FF00 background. Feet visible. No text.
```

### CHAR-BACK-M — `viewer-back-man.png` (3:4)

```
Full body photoreal regular natural Indian man age 28-35, everyday clothes — plain shirt and chinos, casual shoes. View FROM BEHIND — back and back of head visible, NOT face. Standing relaxed looking at gallery video on wall ahead. NOT a model — ordinary visitor. Solid chroma green #00FF00 background. Feet visible. No text.
```

### CHAR-BACK-BOY — `viewer-back-boy.png` (3:4)

```
Full body photoreal regular natural Indian boy age 11-13, everyday t-shirt and jeans, sneakers. View FROM BEHIND — back visible, looking at gallery video on wall. Natural kid posture. Solid chroma green #00FF00 background. Feet visible. No text.
```

### CHAR-BACK-GIRL — `viewer-back-girl.png` (3:4)

```
Full body photoreal regular natural Indian girl age 11-13, everyday top and jeans, sneakers. View FROM BEHIND — back visible, looking at gallery video on wall. Natural kid posture. Solid chroma green #00FF00 background. Feet visible. No text.
```

### CHAR-FRONT (deprecated) — `viewer-woman.png` / `viewer-man.png`

Do not use for default gallery bays. Retain files only for legacy reference.

---

## CSS implementation notes (v3)

| Concern | Implementation |
|---------|----------------|
| Spotlight | `.about-gallery-spotlight`; slides 1–2 single ellipse; slide 3 `.is-dual-ceiling-lights` dual ellipse |
| Ceiling lights | `.about-gallery-ceiling-lights` + `.about-gallery-ceiling-light` ×1 or ×2; slide 3 always ×2 |
| Wall grid | `grid-template-columns: var(--gallery-cap-w) 1fr var(--gallery-cap-w)` — **never widen cap for lights** |
| Center tile | `background-size: var(--gallery-tile-size) auto`; match `#ebe6dc` fallback |
| Media | `.about-gallery-media` ~52% width, 74% height, centered vertically |
| Floor | `--gallery-ground-h: clamp(48px, 14cqh, 100px)` — shorter than v2 |
| Gallery watcher | `.about-gallery-watcher` beside video frame in `.about-gallery-media-group` |
| Watcher scale | `height: clamp(160px, 32cqh, 340px)` |
| Bay accent prop | `.about-gallery-accent-prop` before watcher; `@media (min-width: 1400px)` only; class per type: `is-prop-plant`, `is-prop-lamp`, `is-prop-plinth` |
| Prop scale | `height: clamp(120px, 22cqh, 280px)`; align base with watcher on floor line |
| Lights JPG | Remove from markup; plain caps only |

---

## Scroll / motion spec (GSAP ScrollTrigger)

| Phase | Behavior |
|-------|----------|
| **Pin start** | Gallery pin engages; header hides |
| **Start hold** | ~1 viewport vertical scroll before horizontal movement |
| **Scrub** | Horizontal crawl; peek shows next bay wall + pillar half |
| **End hold** | ~1 viewport after last slide before unpin |

---

## Code touchpoints

| File | Role |
|------|------|
| `src/components/AboutGalleryCarousel.astro` | Markup, patches, HTML overlays, optional visitor flag |
| `src/styles/about-gallery-carousel.css` | CSS spotlight, narrow caps, floor, media frame |
| `src/client/scroll-motion.js` | Pin, holds, horizontal scrub |
| `src/data/images.ts` | Asset imports |
| `src/pages/about.astro` | Headline + stats + carousel |

---

## Workflow for agents

1. Read this file + concept mockup before any gallery work.
2. Match **concept single-bay** look first; modular patches must be invisible.
3. Use **CSS spotlight**, not wide lights JPG caps.
4. **Gallery watcher back-view** beside video; **rotate bay accent props** on lg+ (plant / lamp / creative object); **slide 3 = two ceiling lights**.
5. Regenerate mockups **only** with verbatim **MOCKUP** (slide 1), **MOCKUP-SLIDE-2** (slide 2), or **MOCKUP-SLIDE-3** (slide 3) prompts.
6. Run `node scripts/minify-js.mjs` after `scroll-motion.js` changes.

---

## Review checklist

- [ ] Wall reads as one continuous beige field (no dark left panel)
- [ ] Slide 1–2: **one** ceiling spotlight at top; slide 3: **two** ceiling spotlights at top
- [ ] Slide 3 dual pools hit copy/CTA only; video evenly lit
- [ ] Media frame large, centered, with shadow — matches concept
- [ ] Floor band thin; baseboard visible; no full-width stage strip
- [ ] Accent prop visible on wide / ≥1400px only; **rotated per slide** (not plant on every slide)
- [ ] Prop sits **before** watcher (or after on copy-beside-video); neither blocks play icon or copy
- [ ] Gallery watcher visible **from behind**, beside video frame, facing screen
- [ ] Watcher feet on floor line; does not cover play icon or caption
- [ ] Pillar half only at seam / peek during scroll
- [ ] Center tile repeats with no visible seam
- [ ] Scroll start/end holds smooth

---

*Last updated: 2026-08-11 (v3.4 — bay accent props rotate: plant / floor lamp / creative object; not plant-only).*
