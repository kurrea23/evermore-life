# Cartographer Report: State Pages Mobile Overpass

- **Date:** 2026-06-25
- **Agent or operator:** Codex
- **Surface:** `01_website/state-pages/`
- **Mission:** Remove mobile horizontal overflow from generated state pages with the smallest shared-source patch.
- **Approval level used:** execute

## Executive Finding

The generated Arizona, Texas, and Arkansas state pages had mobile horizontal
overflow from two shared layout rules: the desktop quote CTA stayed visible next
to the long text logo and hamburger, and the trust bar kept five stat cells in a
single row. A shared CSS-only patch fixed the issue across all generated state
pages without changing copy, routes, data, or live deployment state.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Before patch, Arizona at 375px rendered wider than the viewport because of the header CTA/hamburger and trust bar. | Browser measurement against `http://127.0.0.1:8765/arizona/`: `innerWidth=375`, `documentElement.scrollWidth=736`, offenders included `.nav-cta`, `.nav-toggle`, and `.trust-item`. | high |
| Source patch is limited to shared state-page CSS. | `01_website/state-pages/assets/state-pages.css` | high |
| Generated output was rebuilt deterministically after the patch. | `python3 01_website/state-pages/scripts/build_state_pages.py` returned validated builds for Arizona, Texas, and Arkansas. | high |
| Final mobile sweep showed no horizontal overflow on all active generated state pages. | Browser measurements against `http://127.0.0.1:8767/{arizona,texas,arkansas}/` at 320, 375, 390, and 430px all returned `documentElement.scrollWidth == innerWidth` and `offenders=0`. | high |

## Map

Canonical state-page source remains `01_website/state-pages/`, with page data in
`data/states.json`, shared markup in `templates/state-page.html`, and shared
visual rules in `assets/state-pages.css`. Generated review output remains under
`public/<state>/index.html`.

No route, owner, state status, or publishing path changed. `BLUEPRINTS/MAP.md`
does not need an update for this pass.

## Visual Evidence

No screenshot artifact was saved. Verification used read-only browser DOM
measurements across mobile breakpoints.

## Unknown Or Unavailable

Live production was not verified and no deploy was performed. This pass proves
the local generated state-page drafts only.

## Cross-Surface Overlaps

State-page mobile behavior is a shared generated-output concern. Fixes should be
made in `assets/state-pages.css` and regenerated, not hand-edited per generated
HTML file.

## Recommended Next Move

Owner review local drafts at `http://127.0.0.1:8767/arizona/`,
`http://127.0.0.1:8767/texas/`, and `http://127.0.0.1:8767/arkansas/` while the
preview server is running. Production publish remains approval-gated.

## Files Changed

- `01_website/state-pages/assets/state-pages.css`
- `01_website/state-pages/public/assets/state-pages.css`
- `01_website/state-pages/public/arizona/index.html`
- `01_website/state-pages/public/texas/index.html`
- `01_website/state-pages/public/arkansas/index.html`
- `BLUEPRINTS/reports/2026-06-25_state-pages-mobile-overpass.md`
