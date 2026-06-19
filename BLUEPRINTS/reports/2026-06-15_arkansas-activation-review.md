# Cartographer Report: Arkansas Activation Review

- **Date:** 2026-06-15
- **Agent or operator:** Codex
- **Surface:** State-page system, Arkansas generated review page
- **Mission:** Move Arkansas from pending-state behavior to active-state review behavior without deploying production.
- **Approval level used:** execute

## Executive Finding

Arkansas is activated in the local state-page source and generated review output. The generated Arkansas page now behaves like the active Arizona and Texas pages: active status pill, quote CTAs to `#contact`, and the shared GoHighLevel quote form embed. Production was not deployed, committed, pushed, merged, or indexed.

Review URL while the local preview server is running:

`http://127.0.0.1:8000/arkansas/`

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Arkansas mode is now `active` in the governing registry. | `01_website/state-pages/data/states.json` | high |
| Arkansas generated output uses active page behavior. | `01_website/state-pages/public/arkansas/index.html` shows `body.state-active`, `Now serving Arkansas`, `Get My Free Arkansas Quote`, and the GHL form iframe `e8RIDTdhAVlc6CT9Zfj5`. | high |
| Robots/indexing did not change. | Arkansas remains `noindex, nofollow`; no sitemap or robots file was edited. | high |
| Arizona and Texas generated pages did not drift. | `git diff --exit-code -- 01_website/state-pages/public/arizona/index.html 01_website/state-pages/public/texas/index.html` returned clean. | high |
| Generator is deterministic after the patch. | Two consecutive `python3 01_website/state-pages/scripts/build_state_pages.py` runs produced matching checksums for generated state pages and assets. | high |
| Local preview opened and primary CTA worked. | Browser review of `http://127.0.0.1:8000/arkansas/`; primary CTA navigated to `#contact` and exposed the quote form iframe. | high |
| Mobile CTA is present. | Browser viewport check at 390x844 showed `.mobile-cta-bar` visible with `Get a Quote` pointing to `#contact`. | high |
| Chart markup and external Chart.js reference remain present. | Arkansas output still contains `chartIUL`, `chartCost`, `chartGap`, and `https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js`. | medium |

## Map

The governing route remains:

- `01_website/state-pages/data/states.json` controls state mode, SEO copy, CTA copy, and state-specific messaging.
- `01_website/state-pages/scripts/build_state_pages.py` renders active states with the shared GoHighLevel form and pending states with availability-update email behavior.
- `01_website/state-pages/public/arkansas/index.html` is generated output and should not be hand-edited.
- `BLUEPRINTS/MAP.md` did not need a route update because canonical ownership and file routes did not change.

## Visual Evidence

No screenshot was saved. The page was opened in the in-app browser at `http://127.0.0.1:8000/arkansas/` for live local review.

## Unknown Or Unavailable

- The public route `https://evermorelife.org/arkansas/` was not deployed or verified.
- GoHighLevel form submission, CRM contact creation, opportunity/task creation, and follow-up workflow were not tested.
- Sarah AI, campaign targeting, and ad handoffs were not aligned during this local activation patch.
- Analytics, Pixel, and conversion events were not verified.
- Chart runtime drawing was not conclusively inspectable from the local in-app browser automation context, despite the unchanged external script reference and chart canvases being present. Treat rendered chart animation as unproven until a live or fully interactive preview proves it.

## Cross-Surface Overlaps

Arkansas state-page activation now needs downstream alignment before traffic: GHL state gates, Sarah/nurture routing, campaign targeting, live route deployment, and conversion tracking must be verified before calling Arkansas live or sending paid traffic.

## Recommended Next Move

The Evermore operator should review `http://127.0.0.1:8000/arkansas/`. If approved, the next operator can deploy the Arkansas route, verify the live page and intake path end to end, then decide whether sitemap/indexing should change after live evidence exists.

## Files Changed

- `01_website/state-pages/data/states.json`
- `01_website/state-pages/public/arkansas/index.html`
- `01_website/state-pages/README.md`
- `01_website/state-pages/CODEX_HANDOFF.md`
- `01_website/state-pages/AGENT_CONTEXT_PROFILE.md`
- `BLUEPRINTS/reports/2026-06-15_arkansas-activation-review.md`
