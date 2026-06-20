# Cartographer Report: Score Tracker And Growth Calculator Clean Routes

- **Date:** 2026-06-19
- **Agent or operator:** Codex
- **Surface:** Public website routes for standalone calculators
- **Mission:** Place the existing score tracker and growth calculator HTML
  behind clean folder URLs.
- **Approval level used:** execute

## Executive Finding

The score tracker now has a repo-root folder route at
`score-tracker/index.html`, so static hosting can serve it at
`evermorelife.org/score-tracker` without exposing a file extension.
The growth calculator now has the same structure at
`growth-calculator/index.html` for `evermorelife.org/growth-calculator`.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Source HTML was recovered from the local Evermore workspace | `/Users/k9smac/Desktop/EVERMORE-LIFE/Score-Tracker.html` | high |
| Clean route file exists in this repo | `score-tracker/index.html` | high |
| Growth calculator source HTML was recovered from the local Evermore workspace | `/Users/k9smac/Desktop/EVERMORE-LIFE/Growth-Calculator.html` | high |
| Growth calculator clean route file exists in this repo | `growth-calculator/index.html` | high |
| No root score or growth HTML file exists in this `main` worktree after routing | `find . -maxdepth 2 \( -name 'Score-Tracker.html' -o -name 'Growth-Calculator.html' -o -path './score-tracker/index.html' -o -path './growth-calculator/index.html' \) -print` showed only the folder index files | high |
| The page has no local asset dependencies requiring route rewrites | `rg -n "href=|src=|url\\(" score-tracker/index.html` showed only Google Fonts, an empty logo `src`, and a generated download link | high |
| The growth calculator has no local asset dependencies requiring route rewrites | `rg -n "href=|src=|url\\(" growth-calculator/index.html` showed only Google Fonts and an empty logo `src` | high |
| Live production route was checked after push and still returned 404 | `curl -I https://evermorelife.org/score-tracker` returned `HTTP/2 404` with `x-evermore-deployment: cloudflare-pages-proxy` on 2026-06-20 UTC | high |
| Cloudflare Pages origin route was checked after push and still returned 404 | `curl -I https://evermore-life.pages.dev/score-tracker/` returned `HTTP/2 404` on 2026-06-20 UTC | high |

## Map

The score tracker and growth calculator are standalone static HTML tools copied
into root-level folder routes. Static hosts that serve `index.html` from folder
paths should map `/score-tracker` to `score-tracker/index.html` and
`/growth-calculator` to `growth-calculator/index.html`.

Canonical route owner is the public website surface in `BLUEPRINTS/MAP.md`.

## Visual Evidence

None captured. This was a file placement and route packaging change.

## Unknown Or Unavailable

- Live `evermorelife.org/score-tracker` was not yet available from the current
  Cloudflare Pages proxy response after the first route push, despite the
  source being committed and pushed to `origin/main`.
- Live `evermorelife.org/growth-calculator` still needs post-push verification.
- The original generation history for `Score-Tracker.html` was not present in
  this worktree's git history; the source was recovered from the adjacent local
  Evermore workspace.
  The same is true for `Growth-Calculator.html`.

## Cross-Surface Overlaps

The clean URLs depend on GitHub/source, static hosting behavior, and live
Cloudflare/Pages routing staying aligned.

## Recommended Next Move

Trigger or inspect the Cloudflare Pages deployment for `origin/main`, then
purge Cloudflare cache if needed and verify both clean routes return the new
folder indexes.

## Files Changed

- `score-tracker/index.html`
- `growth-calculator/index.html`
- `BLUEPRINTS/reports/2026-06-19_score-tracker-clean-route.md`
- `BLUEPRINTS/OVERLAPS.md`
- `BLUEPRINTS/DECISIONS.md`
- `BLUEPRINTS/MAP.md`
