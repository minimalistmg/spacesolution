# Website features

Quick links to try theme and header behaviors. Choices persist in `localStorage` until changed.

## Home hero

Variant A (overlay left) uses a full-bleed background video:

- Served at: `/videos/home-hero.mp4` (`public/videos/home-hero.mp4`)
- Component: `src/components/HomeHero.astro`

**Bases**

- Live: [https://spacesolution.in](https://spacesolution.in)
- Local: [http://localhost:4321](http://localhost:4321)

---

## Color palettes

Open the floating **Palettes** switcher (bottom-right), preview a theme, then **Apply**. The default theme is Classic Gold when nothing is saved yet.

Storage key: `ss-color-palette`

### Open switcher

| | Live | Local |
|---|------|-------|
| Show palette switcher | [spacesolution.in/?color_pallet=true](https://spacesolution.in/?color_pallet=true) | [localhost:4321/?color_pallet=true](http://localhost:4321/?color_pallet=true) |

Without `?color_pallet=true`, the switcher stays hidden. An already-applied palette still loads on every page.

### Available palettes

| ID | Name |
|----|------|
| `classic-gold` | Classic Gold (default) |
| `warm-terracotta` | Warm Terracotta |
| `scandinavian-sage` | Scandinavian Sage |
| `modern-copper` | Modern Copper |
| `coastal-serenity` | Coastal Serenity |
| `forest-haven` | Forest Haven |
| `blush-elegance` | Blush Elegance |
| `industrial-loft` | Industrial Loft |

### Key files

| File | Role |
|------|------|
| `src/data/colorPalettes.js` | Palette definitions and derived tokens |
| `src/components/ColorPaletteSelector.astro` | Floating FAB, panel, and preview modal |
| `src/styles/color-palette-selector.css` | Selector UI styles |
| `src/client/color-palette-selector.js` | Preview canvas, live apply, persistence |
| `src/layouts/BaseLayout.astro` | Mounts selector + FOUC-safe theme restore |
| `src/styles/main.css` | Default `:root` tokens |

---

## Header

Fixed white header at the top of every page. It hides when you scroll down and reappears when you scroll up (after passing the top ~50px).

### Key files

| File | Role |
|------|------|
| `src/client/header.js` | Scroll hide/show behavior, nav |
| `src/styles/header.css` | Glass styling and hide transition |
| `src/components/Header.astro` | Header markup |
