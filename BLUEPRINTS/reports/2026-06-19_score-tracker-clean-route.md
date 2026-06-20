# Cartographer Report: Score Tracker Clean Route

- **Date:** 2026-06-19
- **Agent or operator:** Codex
- **Surface:** Public website route for score tracker
- **Mission:** Place the existing score tracker HTML behind a clean
  `/score-tracker` URL.
- **Approval level used:** execute

## Executive Finding

The score tracker now has a repo-root folder route at
`score-tracker/index.html`, so static hosting can serve it at
`evermorelife.org/score-tracker` without exposing a file extension.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Source HTML was recovered from the local Evermore workspace | `/Users/k9smac/Desktop/EVERMORE-LIFE/Score-Tracker.html` | high |
| Clean route file exists in this repo | `score-tracker/index.html` | high |
| The page has no local asset dependencies requiring route rewrites | `rg -n "href=|src=|url\\(" score-tracker/index.html` showed only Google Fonts, an empty logo `src`, and a generated download link | high |
| Live production route was not verified in this local commit step | No post-push browser check was completed before this report | high |

## Map

The score tracker is a standalone static HTML tool copied into a root-level
folder route. Static hosts that serve `index.html` from folder paths should map
`/score-tracker` to `score-tracker/index.html`.

Canonical route owner is the public website surface in `BLUEPRINTS/MAP.md`.

## Visual Evidence

None captured. This was a file placement and route packaging change.

## Unknown Or Unavailable

- Live `evermorelife.org/score-tracker` availability remains unverified until
  the commit is pushed and the production host refreshes.
- The original generation history for `Score-Tracker.html` was not present in
  this worktree's git history; the source was recovered from the adjacent local
  Evermore workspace.

## Cross-Surface Overlaps

The clean URL depends on GitHub/source, static hosting behavior, and live
Cloudflare/Pages routing staying aligned.

## Recommended Next Move

After push, verify `https://evermorelife.org/score-tracker` in a browser and
record whether the live host serves the new folder index.

## Files Changed

- `score-tracker/index.html`
- `BLUEPRINTS/reports/2026-06-19_score-tracker-clean-route.md`
- `BLUEPRINTS/OVERLAPS.md`
- `BLUEPRINTS/DECISIONS.md`
- `BLUEPRINTS/MAP.md`
