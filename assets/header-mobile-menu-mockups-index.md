# Mobile header menu mockups index

Five responsive mobile navigation patterns for Space Solutions, aligned with desktop mega-menu segments and accent colors.

## Static mockup

| File | Description |
|------|-------------|
| header-mobile-menu-5-variants.png | Single sheet — all 5 variants side by side |

## Variants

| # | Name | Pattern | Best for |
|---|------|---------|----------|
| 01 | Slide Accordion | Full-screen slide-over; contact row + expandable segment rows | Closest to current `MobileMenu.astro`; lowest build cost |
| 02 | Bottom Sheet | Dimmed page + draggable sheet; horizontal segment pills; featured card + icon grid | Matches existing Connect hub sheet pattern (`HeaderContactMenu`) |
| 03 | Card Grid | Dark full-screen 2×3 segment cards with accent borders | Strong visual hierarchy; good first-time orientation |
| 04 | Master Detail | Left segment rail + right submenu panel | Fast switching between segments; mirrors desktop mega-menu density |
| 05 | Stacked Minimal | Large typographic list + inline expand; floating Connect FAB | Premium, airy feel; fewer UI chrome elements |

## Segment accent colors (from desktop nav)

| Segment | Accent |
|---------|--------|
| Home Interiors | `#e67e22` |
| Commercial | `#4682b4` |
| Institutional | `#2e8b57` |
| Hospitality | `#c05840` |
| Studio | `#7e22ce` |

## Current implementation (reference)

- Breakpoint: `max-width: 1023px` — desktop nav hidden, hamburger shown
- Component: `src/components/MobileMenu.astro`
- Styles: `src/styles/header.css` (`.mobile-menu`, `.mobile-nav`, etc.)
