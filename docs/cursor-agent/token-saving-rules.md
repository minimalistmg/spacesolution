# Token-saving rules (full reference)

Rules implemented for Cursor agents on Space Solution. Each rule saves context tokens, tool calls, or terminal output.

**Legend:** ✅ Safe for routine agent work · ⚠️ Do not over-apply

---

## High impact — build & dev

| # | Rule | Saves | Safety |
|---|------|-------|--------|
| 1 | Never run `npm run build` unless deploying or user asks | Full minify + Astro build + asset scripts | ✅ |
| 2 | Never run `npm run dev` to verify unless user asks | Same pre-scripts as build on every start | ✅ |
| 3 | Use `npm run dev:fast` (Astro only) for agent preview | Skips minify, thumbnails, icons | ✅ if reading `src/client/` |
| 4 | Run minify only when `src/client/*.js` changed **and** user wants runtime test | Terser over ~15 files | ✅ |
| 5 | Never run `npm install` unless deps changed | postinstall runs vendor + assets + minify | ✅ |
| 6 | Never run `npm run preview` during iteration | Requires full build first | ✅ |

**Implemented in:** `.cursor/rules/agent-build-dev.mdc`  
**Script added:** `dev:fast` in `package.json`

---

## High impact — browser & visual verification

| # | Rule | Saves | Safety |
|---|------|-------|--------|
| 7 | Do not use browser MCP unless user asks | Snapshots, screenshots, navigation loops | ✅ |
| 8 | User provides screenshots; agent analyzes, no browser | Multi-step automation | ✅ |
| 9 | No visual verification after every change | Change → browser → scroll → screenshot cycles | ✅ |
| 10 | Scroll work: read `scroll-motion.js` + CSS, don't scroll-test in browser | Slow interactive testing | ✅ mostly; polish may need your screenshot |

**Implemented in:** `.cursor/rules/agent-browser-verification.mdc`

---

## High impact — file reading

| # | Rule | Saves | Safety |
|---|------|-------|--------|
| 11 | Read `src/client/*.js`, never `public/js/*.js` | Minified one-liners | ✅ |
| 12 | Never read `dist/`, `node_modules/`, build artifacts | Huge low-signal files | ✅ |
| 13 | Never read binary assets unless user asks | Images/fonts in context | ✅ |
| 14 | Don't read `package-lock.json` unless dep debugging | Very long file | ✅ |
| 15 | Scope reads to changed files + direct imports | Whole-codebase reads | ✅ |

**Implemented in:** `.cursor/rules/agent-file-reading.mdc`, `.cursor/rules/public-js-generated.mdc`

---

## Medium impact — search & exploration

| # | Rule | Saves | Safety |
|---|------|-------|--------|
| 16 | Targeted `grep`/`glob`, not broad explore subagents | Subagents re-read many files | ✅ |
| 17 | No `Task` subagent for single-file/keyword lookups | Extra agent round-trips | ✅ |
| 18 | Prefer `grep` over reading whole files for symbols | Full file reads | ✅ |
| 19 | Don't batch unnecessary parallel reads | Upfront context bloat | ✅ |

**Implemented in:** `.cursor/rules/agent-exploration.mdc`

---

## Medium impact — git, terminal, lint

| # | Rule | Saves | Safety |
|---|------|-------|--------|
| 20 | No `git status`/`diff`/`log` unless committing or user asks | Git output every turn | ✅ |
| 21 | Don't shell when `grep`/`read` suffices | Terminal noise | ✅ |
| 22 | Lint only edited files | Whole-workspace lint dumps | ✅ |
| 23 | No test commands (no test suite) unless user adds tests | N/A today | ✅ |

**Implemented in:** `.cursor/rules/agent-git-terminal-lint.mdc`

---

## Medium impact — agent behavior & scope

| # | Rule | Saves | Safety |
|---|------|-------|--------|
| 24 | Agent-only: implement directly, no long plans unless asked | Plan prose | ✅ |
| 25 | Minimal diff — no unrelated refactors | Fewer files touched | ✅ |
| 26 | No commits/PRs unless explicitly asked | Git workflow overhead | ✅ |
| 27 | No markdown docs unless asked | Extra files/tokens | ✅ |
| 28 | Questions → chat only, no drive-by code changes | Scope creep | ✅ |

**Implemented in:** `.cursor/rules/agent-behavior.mdc`

---

## Lower impact — still useful

| # | Rule | Saves | Safety |
|---|------|-------|--------|
| 29 | Edit existing Astro components vs new abstractions | Fewer files long-term | ✅ |
| 30 | Small edits vs duplicating CSS/JS files | Less surface area | ✅ |
| 31 | Skip todo lists for 1–2 step jobs | Agent UI overhead | ✅ |
| 32 | Concise replies; don't repeat diff code | Output tokens | ✅ |

**Implemented in:** `.cursor/rules/agent-behavior.mdc`

---

## ⚠️ Do not skip (exceptions)

| Situation | Required action |
|-----------|-----------------|
| Cloudflare deploy | `npm run build` |
| Scroll/pinned chapter bugs | Read `src/client/scroll-motion.js` + related CSS |
| Reel asset changes | `node scripts/generate-reel-thumbnails.mjs` |
| Header menu icon changes | `node scripts/generate-header-menu-icons.mjs` |
| Production JS | Minify before deploy (`minify-js.mjs` or full build) |

---

## Estimated savings

| Pattern | Typical waste avoided |
|---------|----------------------|
| `npm run build` per agent turn | 30s–2min + large terminal output |
| Browser MCP verification | Snapshot YAML + screenshots in context |
| Reading `public/js/*.js` | 5–15 minified files vs readable source |
| Explore subagents for grep tasks | Full directory re-reads |
| Git status/diff every turn | Repeated diff output |

Exact token savings depend on task size; the highest ROI rules are **1–3**, **7–8**, and **11**.
