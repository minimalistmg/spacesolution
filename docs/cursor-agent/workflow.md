# Agent vs human workflow

Who runs what, and when — so agents stay fast and deploys stay correct.

## Daily agent iteration (UI, CSS, Astro, client JS source)

```
Agent edits src/** and src/client/**
        ↓
Optional: user runs npm run dev:fast locally
        ↓
User pastes screenshot if visual feedback needed
        ↓
Agent continues from source + screenshot (no browser MCP)
```

**Agent should not run:** `build`, `dev`, `preview`, `npm install`

**Agent may run (only if user asks):** `npm run dev:fast`, `node scripts/minify-js.mjs`

---

## Testing minified client JS in browser

Minified output in `public/js/` is what the dev server loads for script tags.

```
Agent edits src/client/foo.js
        ↓
User asks to test in browser OR deploy approaching
        ↓
node scripts/minify-js.mjs
        ↓
npm run dev:fast  (or npm run dev)
```

**Agent should not** minify on every keystroke — only when runtime behavior must be verified.

---

## Content pipeline changes

| Change | Script |
|--------|--------|
| Instagram reel sources | `node scripts/generate-reel-thumbnails.mjs` |
| Header menu icons | `node scripts/generate-header-menu-icons.mjs` |
| New npm dependency | `npm install` (runs postinstall) |

These are **not** part of `dev:fast`. Run the relevant script when those assets change, then build before deploy if needed.

---

## Production deploy (Cloudflare)

Cloudflare Pages builds on push from GitHub. Locally, before manual deploy or sanity check:

```powershell
npm run build
npm run preview   # optional human check
```

**Full build includes:**

1. `generate-reel-thumbnails.mjs`
2. `generate-header-menu-icons.mjs`
3. `minify-js.mjs`
4. `astro build` → `dist/`

**Agents do not** run this for every change — CI handles it on merge.

---

## Visual / scroll debugging

| Approach | Token cost | When to use |
|----------|------------|-------------|
| User screenshot + agent code review | Low | Layout, color, scroll feel, animation timing |
| Agent browser MCP | High | Only when user explicitly requests |
| User runs dev locally | Zero agent tokens | Preferred for all visual QA |

For scroll-story sections (`HomePinnedChapter`, `HomeStickyWhy`, `scroll-motion.js`):

1. Agent reads source and CSS
2. User scrolls locally and shares screenshot or short screen recording
3. Agent adjusts thresholds, CSS, or GSAP/Lenis config

---

## Git and PRs

| Action | Who |
|--------|-----|
| Edit files | Agent (when asked) |
| `git commit` / `git push` / PR | Agent only when user explicitly asks |
| `git status` / `diff` for curiosity | Neither — wastes agent context |

---

## Command cheat sheet

| Command | Agent default | Human / CI |
|---------|---------------|------------|
| `npm run dev:fast` | Only if user asks | Primary local preview |
| `npm run dev` | Avoid | When testing full pipeline locally |
| `npm run build` | Avoid | Deploy, CI, pre-release check |
| `npm run preview` | Avoid | After build, human QA |
| `npm install` | Avoid unless deps changed | After `package.json` edit |
| `node scripts/minify-js.mjs` | Only if user asks + JS changed | Before browser test of minified JS |
| Browser MCP | Avoid | User request only |
