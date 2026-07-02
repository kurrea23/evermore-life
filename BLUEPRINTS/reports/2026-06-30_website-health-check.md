# Cartographer Report: Website Health Check

- **Date:** 2026-06-30
- **Agent or operator:** Codex
- **Surface:** `evermorelife.org` public pages, state pages, app/tool folders, and private dashboard entry pages
- **Mission:** Outline each known page with clickable links and identify live 404 sources.
- **Approval level used:** observe

## Executive Finding

The main known public pages and tool pages on `https://evermorelife.org` are
currently reachable. A live crawl found `HTTP 200` for the homepage, funnel
pages, Sarah, recruiting, state pages, app/tool folders, sitemap, robots, and
dashboard login screens.

The confirmed 404 noise is inside pages, not from the main route list:

- `/sarah` still links to `/current/optin.html`, `/current/privacy.html`, and
  `/current/terms.html`; those return the live 404 page.
- The unauthenticated dashboard login screens contain POST form actions at
  `/dashboard/login` and `/dashboard-preview/login`; a direct browser GET to
  either returns 404 even though form POST handling exists in the Worker.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Canonical public routes are defined by the Worker route map and sitemap. | `01_website/v2/cloudflare/evermore-live-proxy.js`, `01_website/v2/sitemap.xml` | high |
| `https://evermorelife.org/`, `/optin`, `/chat`, `/sarah`, `/thank-you`, `/recruiting`, `/privacy`, and `/terms` returned live `200`. | `/usr/bin/curl -L` live probe on 2026-06-30 | high |
| `/arizona`, `/texas`, and `/arkansas` returned live `200`. | `/usr/bin/curl -L` live probe on 2026-06-30 | high |
| `/score-tracker`, `/growth-calculator`, `/login`, `/signup`, `/team`, and `/clients` returned live `200`, with clean tool routes redirecting to trailing slash. | `/usr/bin/curl -L` live probe on 2026-06-30 | high |
| `/sarah` contains broken internal links to `/current/*.html`. | Live crawl plus `01_website/experiments/sarah-final-expense.html` lines containing `../current/privacy.html`, `../current/terms.html`, and `../current/optin.html` | high |
| Sarah image assets with spaces in filenames are reachable when URL-encoded. | `/usr/bin/curl -L` checks for `Sarah%20at%20desk%20.png`, `Sarah%20welcoming%20sitting.png`, and `Sarah-%20wave.png` | high |
| Dashboard login POST endpoints are implemented, but direct GET to `/dashboard/login` and `/dashboard-preview/login` returns 404. | `01_website/v2/cloudflare/evermore-live-proxy.js`; live crawl on 2026-06-30 | high |

## Page Health Table

| Page | Live link | Source / owner | Live status | Notes |
| --- | --- | --- | --- | --- |
| Home | [evermorelife.org/](https://evermorelife.org/) | `01_website/v2/pages/` via Worker `/` | `200` | Healthy route. |
| Opt-in | [evermorelife.org/optin](https://evermorelife.org/optin) | `01_website/v2/pages/optin` | `200` | Healthy route. Lead-path completion still needs separate CRM/workflow proof. |
| Chat | [evermorelife.org/chat](https://evermorelife.org/chat) | `01_website/v2/pages/chat` | `200` | Healthy route. |
| Sarah | [evermorelife.org/sarah](https://evermorelife.org/sarah) | `01_website/experiments/sarah-final-expense.html` served by Worker | `200` | Page loads, but footer/widget links to `/current/*.html` are broken. |
| Thank you | [evermorelife.org/thank-you](https://evermorelife.org/thank-you) | `01_website/v2/pages/thank-you` | `200` | Healthy route. Tracking proof is a separate launch-readiness check. |
| Recruiting | [evermorelife.org/recruiting](https://evermorelife.org/recruiting) | `01_website/v2/pages/recruiting.html` / Worker KV path | `200` | Healthy route. Intended as private/noindex draft unless operator approves promotion. |
| Privacy | [evermorelife.org/privacy](https://evermorelife.org/privacy) | `01_website/v2/pages/privacy` | `200` | Healthy route. |
| Terms | [evermorelife.org/terms](https://evermorelife.org/terms) | `01_website/v2/pages/terms` | `200` | Healthy route. |
| Arizona | [evermorelife.org/arizona](https://evermorelife.org/arizona) | `01_website/state-pages/public/arizona/` | `200` | Healthy route. |
| Texas | [evermorelife.org/texas](https://evermorelife.org/texas) | `01_website/state-pages/public/texas/` | `200` | Healthy route. |
| Arkansas | [evermorelife.org/arkansas](https://evermorelife.org/arkansas) | `01_website/state-pages/public/arkansas/` | `200` | Healthy route. |
| Score Tracker | [evermorelife.org/score-tracker](https://evermorelife.org/score-tracker) | `score-tracker/index.html` | `200` | Redirects to `/score-tracker/`, then serves page. |
| Growth Calculator | [evermorelife.org/growth-calculator](https://evermorelife.org/growth-calculator) | `growth-calculator/index.html` | `200` | Redirects to `/growth-calculator/`, then serves page. |
| Login | [evermorelife.org/login](https://evermorelife.org/login) | `login/index.html` | `200` | Healthy Agent Suite entry. |
| Signup | [evermorelife.org/signup](https://evermorelife.org/signup) | `signup/index.html` | `200` | Healthy Agent Suite entry. |
| Team | [evermorelife.org/team](https://evermorelife.org/team) | `team/index.html` | `200` | Page loads; runtime app behavior depends on auth/API state. |
| Clients | [evermorelife.org/clients](https://evermorelife.org/clients) | `clients/index.html` | `200` | Page loads; runtime app behavior depends on auth/API state. |
| Dashboard | [evermorelife.org/dashboard](https://evermorelife.org/dashboard) | Worker-served private cockpit login/asset | `200` | Unauthenticated view returns login screen. Direct GET to `/dashboard/login` is `404`; POST is implemented. |
| Dashboard Preview | [evermorelife.org/dashboard-preview](https://evermorelife.org/dashboard-preview) | Worker-served private cockpit preview login/asset | `200` | Unauthenticated view returns login screen. Direct GET to `/dashboard-preview/login` is `404`; POST is implemented. |
| Sitemap | [evermorelife.org/sitemap.xml](https://evermorelife.org/sitemap.xml) | `01_website/v2/sitemap.xml` | `200` | Sitemap lists core public v2 routes, not state pages or app/tool pages. |
| Robots | [evermorelife.org/robots.txt](https://evermorelife.org/robots.txt) | Worker `serveRobots()` | `200` | Healthy route. |
| 404 page | [evermorelife.org/404](https://evermorelife.org/404) | `01_website/v2/pages/404` | `200` | Custom 404 page itself returns `200` at `/404`; missing pages return 404 with this body. |

## Confirmed 404 Links To Fix Or Intentionally Handle

| Broken URL | Found on | Live status | Likely fix |
| --- | --- | --- | --- |
| [evermorelife.org/current/optin.html](https://evermorelife.org/current/optin.html) | [evermorelife.org/sarah](https://evermorelife.org/sarah) | `404` | Change Sarah footer/widget links to `/optin`. |
| [evermorelife.org/current/privacy.html](https://evermorelife.org/current/privacy.html) | [evermorelife.org/sarah](https://evermorelife.org/sarah) | `404` | Change Sarah links to `/privacy`. |
| [evermorelife.org/current/terms.html](https://evermorelife.org/current/terms.html) | [evermorelife.org/sarah](https://evermorelife.org/sarah) | `404` | Change Sarah links to `/terms`. |
| [evermorelife.org/dashboard/login](https://evermorelife.org/dashboard/login) | [evermorelife.org/dashboard](https://evermorelife.org/dashboard) form action | `404` on GET | If users or crawlers open it directly, either serve the login screen on GET or redirect to `/dashboard`. |
| [evermorelife.org/dashboard-preview/login](https://evermorelife.org/dashboard-preview/login) | [evermorelife.org/dashboard-preview](https://evermorelife.org/dashboard-preview) form action | `404` on GET | If users or crawlers open it directly, either serve the login screen on GET or redirect to `/dashboard-preview`. |

## Map

The current website health surface crosses four route layers:

- Public v2 pages are mapped by `PUBLIC_ROUTES` in
  `01_website/v2/cloudflare/evermore-live-proxy.js`.
- State pages are generated under `01_website/state-pages/public/` and mapped
  to clean state routes by the same Worker.
- Standalone app/tool pages are served as Pages folder-index routes from root
  folders such as `score-tracker/`, `growth-calculator/`, `login/`, `team/`,
  and `clients/`.
- The dashboard and dashboard preview are private Worker-handled routes that
  serve an unauthenticated login screen until the dashboard cookie is present.

No canonical route ownership changed in this survey, so `BLUEPRINTS/MAP.md`
does not need an update from this health check.

## Visual Evidence

No screenshots were captured. This was an HTTP route and internal-link crawl.

## Unknown Or Unavailable

- This survey did not log into private dashboard pages, so authenticated cockpit
  asset health is not proven here.
- This survey did not submit forms, create leads, or verify GoHighLevel CRM
  workflow behavior.
- This survey did not deploy or publish changes.
- No new human-approved architectural decision was made during this observe-only
  health check; `BLUEPRINTS/DECISIONS.md` should only be updated after operator
  approval of the preferred fix.

## Cross-Surface Overlaps

Promote this finding to `../OVERLAPS.md`: Sarah page content, v2 canonical
routes, and dashboard Worker auth handling can all generate 404 noise even when
the top-level route table is healthy.

## Recommended Next Move

Smallest useful fix: update `01_website/experiments/sarah-final-expense.html`
so the three `/current/*.html` links point to `/optin`, `/privacy`, and
`/terms`, then deploy/verify `/sarah`.

Second fix if the dashboard 404s are causing confusion: make GET requests to
`/dashboard/login` and `/dashboard-preview/login` redirect back to their parent
login screens while preserving the existing POST handlers.

Both fixes touch live website/Worker behavior and should be approval-gated
before deploy.

## Files Changed

- `BLUEPRINTS/reports/2026-06-30_website-health-check.md`
- `BLUEPRINTS/OVERLAPS.md`
