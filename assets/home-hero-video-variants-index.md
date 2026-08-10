# Home hero — video variant mockups

Baseline screenshot captured from live site (`http://localhost:4321/`) on 2026-08-09.

## Current (live)

| File | Notes |
|------|-------|
| `home-hero-current-live.png` | Variant A today: left overlay copy, full-bleed video, bottom stats bar, full nav header |

**What works:** Strong headline, gold CTAs, proof stats, on-brand dark cinematic mood.

**What to improve:** Stats bar + left copy + busy header compete for attention; video feels like backdrop not product; no way to browse project clips without scrolling.

---

## 5 recommended video variants (mockups)

| # | File | Concept | Why it's better |
|---|------|---------|-----------------|
| V1 | `home-hero-video-v1-centered-cinema.png` | **Centered cinema** — one headline, one CTA, scroll cue | Cleaner luxury read (Poliform / Sél Haus). Video becomes the star; less UI chrome on first screen |
| V2 | `home-hero-video-v2-bottom-dock.png` | **Video dock gallery** — pill header + 5-thumb reel strip | Shows range of work immediately; clicking a thumb swaps the hero video (hero-header-05 pattern) |
| V3 | `home-hero-video-v3-split-wall.png` | **Split video wall** — featured player + 3 side reels | Netflix-style browsing; great for portfolio-led agencies; keeps users in hero longer |
| V4 | `home-hero-video-v4-chapter-selector.png` | **Chapter selector** — right rail switches room type | Maps to service categories (Kitchen / Living / Bedroom / Office); hover swaps main video |
| V5 | `home-hero-video-v5-flagship-reel-bar.png` | **Flagship reel bar** — immersive video + stats + silent reel strip | Combines proof + motion in one bar; best if you want stats *and* video gallery without left text block |

---

## Suggested pick order

1. **V2 Bottom dock** — easiest lift from current layout; adds video browsing without restructuring copy
2. **V4 Chapter selector** — strongest storytelling for residential + commercial mix
3. **V1 Centered cinema** — if you want maximum premium/minimal
4. **V3 Split wall** — if portfolio conversion is the #1 goal
5. **V5 Flagship reel bar** — if stats bar must stay on hero

---

## Implementation notes (when moving from mockup → code)

- Reuse `/videos/home-hero.mp4` plus 4–6 short project clips (15–30s, muted, loop)
- Keep `prefers-reduced-motion`: show poster frame, disable autoplay
- Lazy-load side/dock videos; only hero video eager
- Active thumb/chapter state synced with `aria-current` for accessibility
