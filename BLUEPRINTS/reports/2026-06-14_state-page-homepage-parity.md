# Cartographer Report: State Page Homepage Parity

- **Date:** 2026-06-14
- **Agent or operator:** Codex
- **Surface:** State-page website drafts
- **Mission:** Patch Arizona, Texas, and Arkansas drafts to mirror the main homepage structure without changing state-specific content or routing.
- **Approval level used:** execute

## Executive Finding

The shared state-page template now follows the main homepage section order and
includes its missing chart and responsive components while preserving each
state's SEO metadata, hero image, copy, and active or pending intake mode.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| All state pages use the homepage section order and include three chart canvases | `01_website/state-pages/templates/state-page.html` and generated pages under `01_website/state-pages/public/` | high |
| Arizona and Texas retain the active GHL quote form | `01_website/state-pages/public/arizona/index.html`, `01_website/state-pages/public/texas/index.html` | high |
| Arkansas retains pending-state routing and exposes no active intake markers | `01_website/state-pages/public/arkansas/index.html` and successful generator compliance check | high |
| State metadata, copy, and hero images remain sourced from state data | `01_website/state-pages/data/states.json` and generated pages | high |

## Map

The canonical state-page sources remain
`01_website/state-pages/templates/state-page.html`,
`01_website/state-pages/assets/state-pages.css`, and
`01_website/state-pages/data/states.json`. Generated drafts remain under
`01_website/state-pages/public/<state>/index.html`.

## Visual Evidence

Local browser verification confirmed the Arizona hero image, homepage-style
navigation, shared section order, chart section, and responsive component
presence. No visual artifact was saved.

## Unknown Or Unavailable

The drafts were not deployed or verified on live public state routes. External
Chart.js loading was unavailable in the local browser session, so chart canvas
presence and initialization code were verified locally but live chart rendering
remains unverified.

## Cross-Surface Overlaps

No new cross-surface operating finding was introduced by this scoped patch.

## Recommended Next Move

Run the state-page QA checklist and obtain owner approval before any publish or
route change.

## Files Changed

- `01_website/state-pages/templates/state-page.html`
- `01_website/state-pages/assets/state-pages.css`
- `01_website/state-pages/scripts/build_state_pages.py`
- `01_website/state-pages/public/assets/state-pages.css`
- `01_website/state-pages/public/arizona/index.html`
- `01_website/state-pages/public/texas/index.html`
- `01_website/state-pages/public/arkansas/index.html`
- `BLUEPRINTS/reports/2026-06-14_state-page-homepage-parity.md`
