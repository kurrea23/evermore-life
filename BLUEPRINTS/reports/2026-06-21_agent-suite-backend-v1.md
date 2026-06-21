# Cartographer Report: Agent Suite Backend V1

- **Date:** 2026-06-21
- **Agent or operator:** Codex
- **Surface:** Evermore Life Agent Suite backend and private tool routes
- **Mission:** Build a local, reviewable full backend lane for one-login access to Score Tracker, Growth Calculator, client data API, and owner dashboard without touching root `Client-Intake.html`.
- **Approval level used:** draft

## Executive Finding

The full Agent Suite backend is implemented locally on branch
`codex/agent-suite-backend-v1` with an isolated Cloudflare Worker API intended
for `api.evermorelife.org`. It is not deployed, pushed, or cache-purged.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Cloudflare Worker API is isolated from the existing apex Worker | `01_website/agent-suite-api/cloudflare/wrangler.agent-suite-api.jsonc` | high |
| D1 migration defines auth, sessions, clients, scores, and goals | `01_website/agent-suite-api/cloudflare/migrations/0001_agent_suite.sql` | high |
| Password hashing uses PBKDF2 via SubtleCrypto | `01_website/agent-suite-api/cloudflare/worker.js` | high |
| Login/signup pages exist as folder-index routes | `login/index.html`, `signup/index.html` | high |
| Score Tracker is auth-gated and uses background score API sync | `score-tracker/index.html` | high |
| Growth Calculator is auth-gated and prefills agent name | `growth-calculator/index.html` | high |
| Team dashboard page exists as a static route | `team/index.html` | high |
| Local static pages return 200 | `curl -I http://127.0.0.1:8001/{login,signup,score-tracker,growth-calculator,team}/` | high |
| Worker bundle validates with Wrangler dry-run | `npx --yes wrangler@latest deploy --dry-run --config 01_website/agent-suite-api/cloudflare/wrangler.agent-suite-api.jsonc` | high |
| SQL migration parses under SQLite | `sqlite3 :memory: ".read 01_website/agent-suite-api/cloudflare/migrations/0001_agent_suite.sql"` | high |

## Map

The new API source lives under `01_website/agent-suite-api/cloudflare/` and is
configured for `api.evermorelife.org/*`, keeping it separate from the existing
`evermore-life-live` apex Worker in `01_website/v2/cloudflare/`.

Static private tool routes in this branch:

- `login/index.html`
- `signup/index.html`
- `score-tracker/index.html`
- `growth-calculator/index.html`
- `team/index.html`
- `agent-suite-auth.js`

The browser helper stores session state in `localStorage` using
`evermore-auth-token` plus companion user fields.

## Visual Evidence

No screenshots were saved. The in-app browser was navigated to
`http://127.0.0.1:8001/login/`, and DOM checks verified login/signup rendering
plus redirects from protected routes to `/login/` when no token exists.

## Unknown Or Unavailable

- D1 database `evermore-agent-db` has not been created in Cloudflare from this
  branch.
- The migration has not been run against remote D1.
- The Worker has not been deployed.
- Production URLs were not verified for the new routes because publish/deploy
  remains approval-gated.
- Existing live `/dashboard` is already owned by the apex cockpit Worker. The
  Agent Suite owner/team view was moved to `/team` to avoid that route
  collision.
- Owner account bootstrap depends on the Worker `OWNER_EMAILS` environment
  variable.

## Cross-Surface Overlaps

- The owner/team dashboard uses `/team` so it does not conflict with the
  existing cockpit dashboard route.
- Cloudflare Pages source, the live apex Worker, and the new API Worker must be
  deployed in a coordinated release to avoid local/source/live drift.

## Recommended Next Move

Create or bind `evermore-agent-db`, set `OWNER_EMAILS`, run the D1 migration,
then deploy the API Worker and test one real signup/login before pushing static
pages live.

## Files Changed

- `01_website/agent-suite-api/cloudflare/wrangler.agent-suite-api.jsonc`
- `01_website/agent-suite-api/cloudflare/worker.js`
- `01_website/agent-suite-api/cloudflare/migrations/0001_agent_suite.sql`
- `agent-suite-auth.js`
- `login/index.html`
- `signup/index.html`
- `score-tracker/index.html`
- `growth-calculator/index.html`
- `team/index.html`
- `BLUEPRINTS/reports/2026-06-21_agent-suite-backend-v1.md`
