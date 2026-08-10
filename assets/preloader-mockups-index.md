# Preloader mockups index (v2)

Six preloader concepts aligned to the **actual Space Solution lockup** — gold ribbon SVG icon · bold **space** · small-caps **SOLUTION** — while the target page loads behind a fixed overlay.

| File | Concept | Stack | Best for |
|------|---------|-------|----------|
| preloader-concept-01-blueprint-reveal.png | Blueprint Reveal | GSAP DrawSVG · SplitText · Timeline | Craft-led, technical elegance |
| preloader-concept-02-spatial-flow.png | Spatial Flow | Three.js particles · GSAP · progress ring | Cinematic, immersive, dark hero sites |
| preloader-concept-03-minimalist-stagger.png | Minimalist Stagger | GSAP Timeline · stagger | Fast, clean, editorial white-first |
| preloader-concept-04-materiality-form.png | Materiality & Form | GSAP Flip · Three.js morph · textures | Brand story — materials → finished space |
| preloader-concept-05-ambiance-illumination.png | Ambiance & Illumination | GSAP · image sequence · brightness | Mood-led reveal, interior photography |
| preloader-concept-06-layout-optimization.png | Dynamic Layout Optimization | Three.js isometric · GSAP · wireframe shader | Technical credibility, spatial expertise |

## Concept summaries

### 01 — Blueprint Reveal
Grid paper hold → icon strokes draw on (DrawSVG on brand paths) → **space** fills in → **SOLUTION** completes → concrete-texture finish, progress bar hits 100%, enter site.

### 02 — Spatial Flow
Dark architectural corridor → golden particle stream → particles coalesce into icon → wordmark resolves → circular progress ring tied to load % → dissolve to page.

### 03 — Minimalist Stagger
White screen → **1. MARK** (icon only) → **2. TEXT** (**space** beside icon) → **SOLUTION** completes lockup → thin progress line, minimal exit fade.

### 04 — Materiality & Form (Kinetic In-Lay)
Blueprint + material swatches → shards fly into icon in-lay on walnut → finished physical lockup → glow transition to live site. Variants: Elemental Fusion, Artisan Workbench, Gallery Reveal.

### 05 — Ambiance & Illumination
Black room → cove light 32% → full illumination 98% → backlit logo sign on wall → overlay fades, hero visible.

### 06 — Dynamic Layout Optimization
2D floor plan on monitor → 3D isometric wireframe lift → textures and furniture fill in → photoreal render + logo overlay, “Optimized & Ready”.

## Logo lockup reference

- **Horizontal (primary):** icon left · **space** bold lowercase espresso · **SOLUTION** tracked caps under “ace”
- **Vertical (dark hold):** icon top · **space** white · **SOLUTION** white caps below
- Reuse DOM from `brand/index.html`: `.brand-icon-wrap`, `.brand-space`, `.brand-solution`

## Shared implementation

- Fixed `#preloader` layer above app; route renders behind until `load` + min display (~1.2s)
- GSAP in repo (`public/vendor/gsap.min.js`); Three.js for concepts 02, 04, 06
- Exit: timeline `onComplete` → remove overlay; optional Flip handoff to header logo

## Previous round (v1)

Earlier GSAP-orbit-style concepts remain as `preloader-01` … `preloader-05` in this folder for reference.
