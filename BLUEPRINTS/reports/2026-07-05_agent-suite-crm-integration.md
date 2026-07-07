# Cartographer Report: Agent Suite CRM Integration + Premium Upgrade

- **Date:** 2026-07-05
- **Agent or operator:** Claude (remote session), operator kurrea23
- **Surface:** Agent Suite (today, score-tracker, clients, growth-calculator, team, login, intake sync, agent-suite-api worker)
- **Mission:** Make the agent suite work as one integrated CRM with continuity — intake → pipeline → per-client activity → calculator — plus a premium, mobile-first visual pass replacing emojis.
- **Approval level used:** draft (branch `claude/agent-suite-crm-integration-8g1iz0`; NOT deployed)

## Executive Finding

The suite now shares one data spine. A new `activities` D1 table + `/api/activities` endpoints record every client-linked action (dials, presentations, stage moves, issued policies). The pipeline is editable (stage moves, appointments, notes, quick-log with undo), the Score Tracker can tag a client so taps flow into that client's history, OptiMaxx (renamed Growth Calculator) auto-fills its Current column from the agent's real last-30-days scores, and a new `/today/` dashboard is the post-login home. A shared design system (`agent-suite-ui.css`, `agent-suite-icons.js`, `agent-suite-activity.js`) replaces all emojis with SVG line icons and adds an app-style mobile bottom nav.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| 9/9 unit tests pass (activities validation/scoping + PUT partial-update regression) | `node --test 01_website/agent-suite-api/cloudflare/worker.test.mjs` | high |
| Migrations apply cleanly (0001 + 0002) | `wrangler d1 migrations apply evermore-agent-db --local` run in session | high |
| Full API flow works (signup→client→activities CRUD→scores isolation→partial PUT) | curl transcript against `wrangler dev --local`; score_days untouched by activity writes | high |
| End-to-end continuity works at 390px and 1280px | Playwright: login→/today/→tag client→dial→pipeline history shows it→stage move→OptiMaxx leads=dials | high |
| Offline quick-log queues and flushes | Playwright offline test: queue 0→1 offline, local counter bumps, flush→0 online, server row confirmed | high |
| No emojis remain in suite pages | grep sweep over score-tracker/clients/growth-calculator/team | high |

## Map

**Backend (`01_website/agent-suite-api/cloudflare/`)**
- `migrations/0002_activities.sql` — `activities(id, user_id, client_id NULL→SET NULL, type, note, premium, meta_json, created_at)` + user/client indexes.
- `worker.js` — `POST /api/activities` (type allowlist, client ownership check, note ≤500), `GET /api/activities?client_id=&limit=&before=` (user-scoped, newest first, limit ≤200, LEFT JOIN client name), `DELETE /api/activities/:id` (powers Undo). Existing routes untouched.
- `worker.test.mjs` — node:test suite with an in-memory fake `env.DB`.

**Shared foundation (repo root, no build step)**
- `agent-suite-ui.css` — design tokens (navy/gold), cards, buttons, badges (one class per pipeline stage), bottom sheets, stat tiles, toast, skeleton, mobile bottom nav styles.
- `agent-suite-icons.js` — `EvermoreIcons.icon(name,{size})`, ~40 inline SVG line icons.
- `agent-suite-activity.js` — `EvermoreActivity`: `TYPES` (activity ↔ tracker counter ↔ icon/color map, mirrored by the worker allowlist), `STATUSES` (canonical 9 stages), `logActivity()` (offline queue `evermore-activity-queue-v1` + tracker-storage counter bump), `fetchActivities()`, `relativeTime()`.
- `agent-suite-auth.js` — `installTopNav()` now links Today/Tracker/Pipeline/OptiMaxx/Intake/Team and injects the mobile bottom nav.

**Pages**
- `today/index.html` (NEW) — post-login home: greeting, today stat tiles (local paint → server reconcile, max-merge), goal bars, quick actions, upcoming appointments, hot list (Follow Up / Further Underwriting / Appointment Booked), recent activity. Login default redirect → `/today/` (`login/index.html` allowlist updated).
- `clients/index.html` — editable CRM: tappable stage pill → stage sheet (Appointment Booked prompts date/time and also logs `appt_set`), appointment edit sheet, notes editor, 6-button quick-log row with Undo toast, per-client activity history, `?client=<id>` deep link, mobile vertical stage list (desktop kanban unchanged).
- `score-tracker/index.html` — optional "Working with" client tag (sessionStorage, day-scoped); tagged taps also `logActivity(skipCounter:true)`; issued modal passes premium/carrier; own bottom tab bar replaced by in-page Track/Feed/Report pills (app bottom nav owns the bottom edge); `storage` listener re-renders on cross-tab bumps.
- `growth-calculator/index.html` — OptiMaxx branding; `loadMyNumbers()` fills leads←dials, contacts, convos, apptsSet, apptsHeld, appsSubmitted, issued, avgPremium←mean logged premium from `GET /api/scores` (last 30 days), banner + Reload button, everything stays editable.
- `team/index.html` — shared css/icons only.
- `01_website/experiments/Client-Intake.html` — `refreshPipelineFields()` inside `backfillSync()`: pulls server `status`/`appt_date_time` into the vault (matched by serverId) before re-sync, so a stale vault PUT can't revert a pipeline stage move. Vault untouched otherwise.
- `deploy.sh` — `/today/` + `/clients/` added to route checks and required-files list.

## Architecture decision — counters have one writer

`POST /api/scores/:date` replaces the whole day wholesale from tracker localStorage, so the server NEVER increments `score_days` on activity writes. All counter bumps go through the tracker's own localStorage + sync queue: tracker taps bump locally as before (tagged taps add an activity row with `skipCounter`), and pipeline quick-logs bump via `agent-suite-activity.js` using the identical storage contract. This kills double counting by construction.

## Deploy runbook (operator machine — nothing deployed from this session)

1. **API worker (deploy FIRST):**
   `cd 01_website/agent-suite-api/cloudflare`
   `npx wrangler d1 migrations apply evermore-agent-db --remote -c wrangler.agent-suite-api.jsonc`
   `npx wrangler deploy -c wrangler.agent-suite-api.jsonc`
   (Backward compatible — old pages keep working against the new worker.)
2. **Pages:** merge branch → `main`, then `./deploy.sh` from repo root.
3. **Live-proxy worker** (only for the intake status-refresh tweak):
   `npx wrangler deploy --config 01_website/v2/cloudflare/wrangler.live-proxy.jsonc`, then re-check the 14 routes per the standing rule.

## Unknown Or Unavailable

- Remote D1 migration not run (no Cloudflare creds in sandbox).
- PWA standalone-mode behavior of the new bottom nav on a real phone untested.
- Multi-device same-day counter overwrite is pre-existing (`/api/scores/:date` wholesale replace) and unchanged; activities themselves are append-only and safe.

## Cross-Surface Overlaps

Promoted to `../OVERLAPS.md`: intake↔pipeline shared status/appt fields; pipeline/today↔tracker shared localStorage counter store; three deploy surfaces touched by one feature.

## Recommended Next Move

Operator runs the deploy runbook above, then a phone test: log in → /today/ → intake a test client → tag them in the tracker → move them through the pipeline → confirm OptiMaxx shows the tracked numbers. Owner: operator. Approval: their own Cloudflare login.
