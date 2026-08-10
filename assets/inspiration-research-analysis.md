# Inspiration research — light analysis for Space Solutions

Short read on what to borrow from your manual research links, and how to use it on the site. Written for quick decisions, not deep design theory.

**Current site baseline:** dark cinematic hero, gold accent, Montserrat/Gotham, video-first home, palette switcher, multiple header modes, preloader concepts in `/concepts/preloader/`.

---

## Cross-cutting themes (most links agree on these)

- **Big calm hero** — one strong interior photo/video, few words, lots of breathing room.
- **Luxury = restraint** — neutrals (cream, charcoal, warm white) + one accent (gold/brass/copper).
- **Motion with purpose** — slow fades, scroll reveals, image zooms; not flashy UI tricks.
- **Proof over decoration** — projects, process, and craftsmanship shown through galleries and timelines.
- **Editorial type hierarchy** — one loud display font for headlines, one clean font for everything else.

---

## Fonts

### [Archivo](https://fonts.google.com/specimen/Archivo?preview.script=Latn)
- **What:** Clean, readable sans with a slightly editorial feel; works for body text, nav, forms, long copy.
- **How:** Replace or pair with Montserrat for paragraphs, labels, and service pages. Keep headlines on something bolder.

### [Monument Extended](https://pangrampangram.com/products/monument-extended)
- **What:** Wide, premium display font — exactly the “luxury interior agency” headline look (INARA, Sél Haus, BC Luxury shots).
- **How:** Use only for hero H1, section titles, and preloader wordmark. All-caps or tight tracking. Already close to your Gold Forge / hero mockup direction.

### [Syne](https://fonts.google.com/specimen/Syne)
- **What:** Geometric display font that gets wider as it gets bolder — feels art-gallery/modern.
- **How:** Alternative to Monument for “Modern Interior Design Hero” and DEV UN-style layouts. Good for one-word emphasis (“Interiors”, “Craft”, “Mysuru”).

**Suggested pairing for Space Solutions:** Monument Extended (or Syne) for heroes + Archivo for UI/body. Gotham can stay as fallback where licensing matters.

---

## Dribbble — interior design agency shots

Grouped by pattern, not by individual shot.

### Hero sections (INARA, Sél Haus, BC Luxury, Kitchen/Modern hero, DEV UN, Interior Agency Hero)
- **What:** Full-bleed project photography, bottom-left or centered headline, thin transparent header.
- **How:** You already have this in `HomeHero.astro` and hero-header mockups 01/07/09. Push further: larger type, fewer lines, optional stat chips (“15+ years”, “200+ projects”).

### Light, airy studios (Intérieur, Poliform, PeaceCraft)
- **What:** Off-white backgrounds, soft shadows, rounded corners, gentle scroll.
- **How:** Map to your existing palette switcher themes (Scandinavian Sage, Coastal Serenity). Offer a “light mode” home variant for clients who want airy over cinematic dark.

### Premium craft storytelling (Sél Haus, DECOR Interactive, Melbourne Wooden Showroom)
- **What:** Material close-ups, wood/stone/finish details, “how we work” chapters.
- **How:** Add a horizontal “materials + process” strip on About/Services — 3–4 cards with macro photos and short captions. Matches your turnkey/manufacturing story.

### Scroll-driven narrative (PeaceCraft, DECOR, Heritage Museum, Ways We Work)
- **What:** Page feels like one continuous story — sections pin, text fades in, images scale slightly on scroll.
- **How:** Use lightweight GSAP ScrollTrigger (or CSS `scroll-driven animations` where supported) on home + about: pin a headline while project images slide past.

### Gallery-first layouts (Gallery Website Concept, filmstrip headers in your mockups)
- **What:** Portfolio is the homepage — thumbnail rail, full-screen viewer, minimal chrome.
- **How:** Extend `portfolio.astro` / showcase with a bottom dock or side filmstrip (see hero-header 02, 05, 06 mockups). Click opens project detail without leaving the mood.

### Zoom / portal transitions (Landing page zoom-in, Smart Home onboarding, ovsi header)
- **What:** One image starts full-screen, then zooms into a “room” or UI panel as you enter the site.
- **How:** Optional hero exit animation: hero photo scales up and dissolves into the first project grid. Reuse preloader timing so it feels like one motion, not two loaders.

### FamilyCamp / welcome headers
- **What:** Friendly oversized welcome line + subtle playful motion.
- **How:** Softer tone for enquiry/contact pages — warmer copy, lighter background, small staggered text entrance.

---

## Dribbble — color palette search
- **What:** Interior sites lean warm neutrals + one accent; avoid rainbow UI.
- **How:** Your palette switcher is already the right idea. Curate 4–5 palettes max for production (Classic Gold, Warm Terracotta, Scandinavian Sage, Modern Copper). Hide experimental ones until a client asks.

---

## [Miro](https://miro.com/)
- **What:** Infinite canvas, smooth pan/zoom, modular cards, collaborative feel.
- **How:** Borrow the *interaction model*, not the UI: on Portfolio or Design Library, let users drag/pan a mood-board canvas of finishes and room types. Lighter version: horizontal snap-scroll “board” of swatches and reference images.

---

## CodePen demos (animation techniques)

These are technique references — verify exact pens in browser; names vary.

| Pen / pattern | What | How for Space Solutions |
|---------------|------|-------------------------|
| Scroll-triggered text reveal | Lines or words appear as you scroll | About page mission statement; service page intros |
| Split / curtain reveal | Two panels open to show content | Preloader handoff into hero (pairs with Gold Forge) |
| Image mask / clip-path wipe | Photo unveiled by a moving shape | Project cards on hover; hero-to-portfolio transition |
| Smooth parallax layers | Background moves slower than foreground | Hero video + floating headline; use sparingly (performance) |
| Staggered grid entrance | Cards fade/slide in one after another | Portfolio grid, Instagram reels section |

**Rule:** one animated “signature” per page max. Home gets preloader + hero; inner pages stay mostly static.

---

## Local: [Gold Forge preloader](http://localhost:60664/concepts/preloader/19-gold-forge/)
- **What:** Logo outline draws itself, gold fills in, warm bloom on paper — on-brand “craft/metal” metaphor without being cheesy.
- **How:** Strongest preloader candidate for production. Wire into `BaseLayout.astro` with `prefers-reduced-motion` skip, `sessionStorage` so repeat visits aren’t blocked, and a “Skip” control (already in concept).

---

## What to implement first (practical priority)

1. **Typography upgrade** — Monument Extended (hero) + Archivo (body). Biggest visual lift for least layout change.
2. **Ship Gold Forge preloader** — matches gold brand and separates you from generic interior templates.
3. **Hero refinement** — fewer words, bigger type, optional stats bar (mockup 01/10 already sketched).
4. **Portfolio filmstrip** — bottom or side gallery on home + portfolio; increases time-on-site.
5. **Scroll story on About** — pinned headline + 4-step process (design → make → install → handover).
6. **Light theme variant** — one-click palette for Poliform/Intérieur-inspired clients.
7. **Enquiry as destination** — single focused form page with warm welcome motion (FamilyCamp pattern).

---

## What to skip or defer

- Heavy WebGL / 3D room tours unless you have budget for assets and performance tuning.
- Too many simultaneous scroll animations — feels template-y and hurts mobile.
- Replacing all Gotham/Montserrat at once — phase display font first.
- Miro-style full canvas unless Design Library becomes a core product feature.

---

## Fit with existing project assets

Your repo already points in the same direction:

- `assets/hero-header-mockups-index.md` — header/gallery patterns match Dribbble filmstrip heroes.
- `assets/variants-research-brief.md` — cinematic / spatial / flagship variants align with Sél Haus + Immersive Garden research.
- `concepts/preloader/` — Gold Forge (19) is the best bridge between font/display luxury and brand gold.

**Bottom line:** Your references say “quiet luxury + craft + motion.” The site already has the bones (video hero, gold tokens, palettes, preloaders). Next wins are type pairing, one polished entrance animation, and scroll-based storytelling on portfolio/about — not a full redesign.
