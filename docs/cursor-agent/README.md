# Cursor agent guide — Space Solution

This folder documents how Cursor agents should work on this repo to **save tokens** while staying safe for the site.

## Project context

| Item | Detail |
|------|--------|
| Stack | Astro 7 static site, GSAP, Lenis, Three.js, jQuery, Swiper |
| Deploy | Cloudflare Pages / Workers (`wrangler.toml`, output in `dist/`) |
| Client JS | Source: `src/client/*.js` → minified to `public/js/*.js` via Terser |
| Pre-dev scripts | Thumbnails, header icons, minify run before full `npm run dev` and `npm run build` |

## Quick reference

| Goal | Command |
|------|---------|
| Agent local preview | `npm run dev:fast` |
| Full local dev (icons, minify, thumbnails) | `npm run dev` |
| Production build (deploy / CI) | `npm run build` |
| Minify client JS only | `node scripts/minify-js.mjs` |
| Preview production build | `npm run preview` (after build) |

## Documentation

| File | Contents |
|------|----------|
| [token-saving-rules.md](./token-saving-rules.md) | All 32 rules with rationale and safety notes |
| [workflow.md](./workflow.md) | When agents vs humans run which commands |
| [rules-index.md](./rules-index.md) | Maps rules to `.cursor/rules/*.mdc` files |

## Cursor rules location

Active agent rules live in:

```
.cursor/rules/
  agent-build-dev.mdc
  agent-browser-verification.mdc
  agent-file-reading.mdc
  agent-exploration.mdc
  agent-git-terminal-lint.mdc
  agent-behavior.mdc
  agent-one-topic-per-chat.mdc
  agent-cleanup.mdc
  public-js-generated.mdc
```

These apply automatically in Cursor agent sessions (`alwaysApply: true` except `public-js-generated.mdc`, which applies when `public/js/**` is in context).

## Screenshot workflow (recommended)

For scroll, layout, or animation feedback:

1. You run `npm run dev:fast` locally (or full `npm run dev` if testing minified JS).
2. You capture a screenshot and paste it into the agent chat.
3. Agent analyzes the image and edits source — **no browser MCP automation**.

This avoids expensive browser snapshots and repeated dev-server cycles in agent context.

## What agents must not skip

- **`npm run build` before deploy** — Cloudflare serves `dist/`; production JS must be minified.
- **Reading scroll-motion source** when changing pinned chapters, Lenis, or GSAP scroll logic.
- **Asset pipeline scripts** when reel thumbnails or header menu icons change.

## Related

- Root [README.md](../../README.md) — install, dev, build for humans
- [workflow.md](./workflow.md) — agent vs human responsibilities
