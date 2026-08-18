# Cursor rules index

Maps each token-saving rule to its `.mdc` file.

| Rule file | alwaysApply | Rule #s | Topics |
|-----------|-------------|---------|--------|
| [agent-build-dev.mdc](../../.cursor/rules/agent-build-dev.mdc) | yes | 1–6 | `dev:fast`, no build/dev/preview/install by default |
| [agent-browser-verification.mdc](../../.cursor/rules/agent-browser-verification.mdc) | yes | 7–10 | Browser verification on demand when user asks |
| [agent-file-reading.mdc](../../.cursor/rules/agent-file-reading.mdc) | yes | 11–15 | Source-only reads, narrow scope |
| [agent-exploration.mdc](../../.cursor/rules/agent-exploration.mdc) | yes | 16–19 | grep/glob over subagents |
| [agent-git-terminal-lint.mdc](../../.cursor/rules/agent-git-terminal-lint.mdc) | yes | 20–23 | Git/lint/shell discipline |
| [agent-behavior.mdc](../../.cursor/rules/agent-behavior.mdc) | yes | 24–32 | Scope, commits, concise output |
| [agent-one-topic-per-chat.mdc](../../.cursor/rules/agent-one-topic-per-chat.mdc) | yes | — | Warn when unrelated topics are clubbed in one chat |
| [agent-cleanup.mdc](../../.cursor/rules/agent-cleanup.mdc) | yes | — | Terminal/browser on demand; cleanup agent-started processes only |
| [public-js-generated.mdc](../../.cursor/rules/public-js-generated.mdc) | no (`public/js/**`) | 11 | Edit `src/client`, not minified output |

## Package.json change

```json
"dev:fast": "astro dev"
```

Added to support rule #3 — Astro dev without thumbnail/icon/minify pre-scripts.

## Maintaining these rules

1. Edit the relevant `.mdc` file for agent behavior changes.
2. Update [token-saving-rules.md](./token-saving-rules.md) if rule text or numbering changes.
3. Update [workflow.md](./workflow.md) if commands or deploy flow changes.
4. Keep rules under ~50 lines each (Cursor best practice).

## Verifying rules are loaded

In Cursor, project rules under `.cursor/rules/` are picked up automatically. Rules with `alwaysApply: true` apply to every agent session in this repo.
