# Cartographer Report: Recruiting Page Live Repair

- **Date:** 2026-06-18
- **Agent or operator:** Codex
- **Surface:** Public recruiting page + Cloudflare Worker
- **Mission:** Verify whether the in-depth recruiting page was lost, restore it live, and document the production/source drift.
- **Approval level used:** execute

## Executive Finding

The in-depth recruiting page was not lost. The canonical source file exists at
`01_website/v2/pages/recruiting.html` and is 893 lines. Production was serving a
shorter fallback through the Cloudflare Worker/Pages path. Live `/recruiting`
now serves the full in-depth page from Cloudflare KV, and the temporary upload
maintenance endpoint used for the repair has been removed.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Full recruiting source exists locally | `01_website/v2/pages/recruiting.html` contains the long recruiting page and live markers such as `Purpose Over Pleasure`, `AI-Assisted Operations`, and `The First 50 Will Shape the Standard` | high |
| Live route now serves the full page | `curl https://evermorelife.org/recruiting` returned 893 lines and matched `Request a 30-Minute Team-Fit Call`, `Purpose Over Pleasure`, `AI-Assisted Operations`, and `The First 50 Will Shape the Standard` | high |
| Repair endpoint is removed | `curl -D - https://evermorelife.org/api/recruiting-page-source` returned HTTP 404 after the Worker cleanup | high |
| Worker bindings survived cleanup | Cloudflare Worker settings after upload still showed `COCKPIT_STATE`, `DASHBOARD_ASSETS`, and the existing secret bindings | high |
| Source now carries the KV-backed route | `01_website/v2/cloudflare/evermore-live-proxy.js` defines `RECRUITING_PAGE_KV_KEY` and routes `/recruiting` through `serveRecruitingPage(request, env)` before the generic Pages proxy | high |

## Map

- Canonical recruiting HTML: `01_website/v2/pages/recruiting.html`
- Worker route/proxy source: `01_website/v2/cloudflare/evermore-live-proxy.js`
- Live content bridge: Cloudflare KV key `public:recruiting-page-html:v1`
- Live route verified: `https://evermorelife.org/recruiting`

The Worker now checks KV first for the recruiting page. If the KV value is not
available, source falls back to the Pages origin path for
`/01_website/v2/pages/recruiting`.

## Visual Evidence

None captured. This repair was verified with live HTTP response content and
Cloudflare Worker settings.

## Unknown Or Unavailable

- GitHub remote `main` is still not confirmed updated because write access was
  blocked during the website publish work.
- Cloudflare Pages origin may still lag the local release source until GitHub
  write access is restored and the clean release commit is pushed.

## Cross-Surface Overlaps

Production can drift from source when a Cloudflare Worker hotfix or KV bridge is
used while GitHub/Pages deployment is blocked. This is recorded in
`BLUEPRINTS/OVERLAPS.md`.

## Recommended Next Move

Restore GitHub write access, push the clean release commit, then verify
Cloudflare Pages and the Worker serve the same recruiting page without depending
only on the KV bridge.

## Files Changed

- `01_website/v2/cloudflare/evermore-live-proxy.js`
- `BLUEPRINTS/reports/2026-06-18_recruiting-page-live-repair.md`
- `BLUEPRINTS/OVERLAPS.md`
- `BLUEPRINTS/DECISIONS.md`
