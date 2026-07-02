# Final Polish "Bow" Pass — 2026-07-02 (Claude Fable 5)

**Scope:** the open items from `HANDOFF_FABLE5_HIGH_FINAL_POLISH.md` — intake
duplicate risk, agency scoping, deep review of the lightly audited pages,
Blueprint doc cleanup — plus the long-broken cockpit brief push script.
**Branch:** working tree on `main` (operator commits by lane; sandbox cannot
write `.git`).

## Changes

### 1. Server-side dedupe for intake→CRM sync (Worker)

`01_website/agent-suite-api/cloudflare/worker.js`
- `createClient` now calls `findExistingClient` before inserting. Match
  order: (a) the intake app's local record id, compared against the id stored
  inside each row's (decrypted) `intake_json`; (b) phone digits + first+last
  name, case-insensitive. Phone alone never matches — spouses share numbers,
  and the intake app itself allows that on purpose.
- On match the row is partially UPDATED (same merge semantics as PUT) and the
  response is `200 {ok, id: <existing>, deduped: true}` so the intake app
  re-stores the correct `serverId`.
- Shared logic extracted into `applyClientUpdate` — PUT and POST-dedupe can
  no longer drift apart.

### 2. Stale serverId recovery (intake)

`01_website/experiments/Client-Intake.html`
- `syncApi` errors now carry `err.status`.
- If a PUT hits 404 (row deleted server-side, or the vault was restored from
  an old backup), the record's `serverId` is cleared and the client is
  re-POSTed. Because of change #1 that re-POST relinks instead of duplicating.
  Previously this state retried a 404 forever and never surfaced.

### 3. Agency scoping on owner routes (Worker)

- `/api/owner/agents`: an owner **with** an `agency_id` sees only their
  agency's agents plus legacy agents with no agency set. An owner **without**
  one sees everyone — today's behavior, unchanged.
- `/api/owner/agents/:id/scores`: same rule; cross-agency ids return 404 (not
  403, to avoid confirming the id exists).

### 4. Stored-XSS escape pass (deep review finding)

The 2026-07-01 audit fixed the nav XSS but the deep review found the same
class of bug on client- and signup-supplied data:
- `clients/index.html` — client names, phone, carrier, premium, status,
  conditions, beneficiaries, notes, and agent names all reached `innerHTML`
  raw. A client record containing HTML would execute in the **owner's**
  session (token theft risk). All interpolations now go through
  `EvermoreAgentSuite.escapeHtml`.
- `team/index.html` — `agent.name` / `agent.email` (set at signup by any
  agent) and error messages, same fix.
- `score-tracker/index.html` — feed labels (can contain typed notes), and
  `growth-calculator/index.html` — printed agent name: self-XSS only, escaped
  as defense in depth.
- `agent-suite-auth.js` now exports `escapeHtml` so pages share one escaper.

### 5. push_cockpit_brief.sh rewritten for the v7 cockpit

The old script POSTed a `generated` key the Worker's schema gatekeeper
silently drops, then printed "OK" unconditionally. New script: login (302
check) → GET full state → set only `main.dailyBrief` (sanity-checks
main/projects exist; everything else preserved) → POST full state → re-GET
and verify the text actually persisted. Non-zero exit at every failure point,
and a clear error if `cockpit_update.config.json` is missing or still the
placeholder — which it currently IS (see Blockers).

### 6. Blueprint docs cleanup

`DECISIONS.md` (23→24 entries) and `OVERLAPS.md` (34→35): heading levels
normalized (a batch of entries used `##`), consistent newest-first ordering
restored, all entry text preserved verbatim. New decision + overlap entries
added for this pass. `MAP.md` untouched — no canonical route changed.

## Verification

- Fake-D1 harness run against the real `worker.js` (Node 22, WebCrypto,
  **AES DATA_KEY enabled**): 21/21 pass. Covers: create+encrypt-at-rest,
  dedupe by intake id through encrypted `intake_json`, dedupe by phone+name,
  spouse same-phone NOT deduped, partial PUT column isolation, PUT 404,
  agency scoping in/out, cross-agency scores 404, non-owner 403.
- `bash -n` on the rewritten script; `node --check` on worker + auth helper.
- Static sweep: no unescaped `${...}` interpolations of user/client data
  remain in any Agent Suite page's innerHTML templates.

## NOT verified (needs operator)

- Live deploys (three surfaces) + 14-route sweep.
- End-to-end: /intake save → /clients shows exactly one card → clear
  localStorage → re-save → still one card (`deduped` relink).
- Phone/PWA login-gate flow (carried over from previous handoff).

## Blockers

- `04_tools/cockpit_update/cockpit_update.config.json` is STILL missing
  (4 blocked PLANNER runs: 6/25, 6/27, 7/1, 7/2). The rewritten script now
  fails loudly instead of lying, but only the operator can create the file
  with the real `DASHBOARD_PASSWORD` value. Until then the cockpit stays
  stale no matter how good the tooling is.
