# Cartographer Report: Clickable System Map

- **Date:** 2026-06-27
- **Agent or operator:** Codex
- **Surface:** Blueprint navigation and verification map
- **Mission:** Give the operator one clickable local map for checking website,
  app, tool, lead-path, content, and shared infrastructure surfaces.
- **Approval level used:** draft

## Executive Finding

The operator now has a local clickable map at
`BLUEPRINTS/CLICKABLE_SYSTEM_MAP.html`. It separates live route checks from
source-file checks and keeps the website/app boundary visible before patches
are made.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| The clickable map exists locally. | `BLUEPRINTS/CLICKABLE_SYSTEM_MAP.html` | high |
| The map links to the stable website base and state-page source/output. | `BLUEPRINTS/CLICKABLE_SYSTEM_MAP.html`, `BLUEPRINTS/MAP.md` | high |
| The map links to app/tool/auth/backend surfaces separately from website source. | `BLUEPRINTS/CLICKABLE_SYSTEM_MAP.html`, `BLUEPRINTS/reports/2026-06-27_website-app-partition.md` | high |
| Live links are provided for manual checking, but no live health verification was performed by this report. | `BLUEPRINTS/CLICKABLE_SYSTEM_MAP.html` | high |

## Map

The clickable map includes lanes for:

- Stable website base
- State pages
- Agent app and tools
- Shared infrastructure
- GHL and lead path
- Content, ads, and cockpit
- Manual verification checklist

The checklist saves checkbox state in browser local storage only.

## Visual Evidence

No screenshots were captured. The artifact is directly openable in a browser.

## Unknown Or Unavailable

- Live route health was not verified.
- Auth-gated pages may require login before full behavior can be checked.
- GHL account state was not inspected.

## Cross-Surface Overlaps

- The map reinforces that `01_website/v2/cloudflare/evermore-live-proxy.js`
  is shared infrastructure, not a website-only file.
- Root clean tool routes can look like public website pages, so the map places
  them in the app/tool lane.

## Recommended Next Move

Open `BLUEPRINTS/CLICKABLE_SYSTEM_MAP.html`, click through each live/source
pair, and use the checklist to mark what actually works before creating the
two clean patch worktrees.

## Files Changed

- `BLUEPRINTS/CLICKABLE_SYSTEM_MAP.html`
- `BLUEPRINTS/reports/2026-06-27_clickable-system-map.md`
