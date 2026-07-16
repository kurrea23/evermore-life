# Cartographer Report: Inbound Intake Agent Suite Integration

- **Date:** 2026-07-16
- **Agent or operator:** Codex with Evermore operator approval
- **Surface:** Inbound Client Intake Sheet, Agent Suite auth/navigation, and
  agent-suite-api client storage
- **Mission:** Make the approved inbound worksheet usable as one server-backed
  Agent Suite tool without changing its established visual design or deploying
  it to production.
- **Approval level used:** execute locally; no production deploy or merge

## Executive Finding

The Inbound Client Intake Sheet is now server-first and locally testable on the
isolated `codex/inbound-intake-live-integration` branch. It uses the existing
Agent Suite login, shared navigation, and `/api/clients` CRUD contract. The
approved 15-step workflow, 16 script panels, 13 transitions, colors, spacing,
and responsive sidebar remain intact.

Completed clients are stored in local-preview D1 during validation, not in the
browser. The browser keeps only a user-scoped sanitized unfinished draft. SSN,
driver-license, bank, routing, account, and authorization-code values did not
survive a browser reload. No live Worker, Pages surface, proxy route, AI, GHL,
password recovery, email, message, or external account was changed.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Existing API behavior plus new continuity/security checks pass | `node --test 01_website/agent-suite-api/cloudflare/worker.test.mjs 04_tools/tests/agent_suite_intake_continuity_test.mjs 04_tools/tests/inbound_client_intake_sheet_test.mjs` returned 25/25 passing on 2026-07-16 | high |
| One Agent Suite login returns to Inbound Intake and installs the shared menu | Local in-app browser at `http://127.0.0.1:8001/inbound-client-intake/`; menu showed Today, Score Tracker, Pipeline, Growth Calculator, Intake, Inbound Intake, and Team | high |
| Server-backed create, reload, edit, and delete work | Local browser created `Preview Continuity`, reloaded it from the local API, changed status from In Progress to Applied, and deleted it; the client count returned to zero | high |
| Sensitive draft values are not persisted | Local browser entered fake SSN, routing, account, and authorization-code values plus a fake name/phone, then reloaded. Name/phone restored; every sensitive value was blank | high |
| D1 stores sensitive values as ciphertext | Local Wrangler/D1 inspection showed `ssn`, routing, account, and `intake_json` values using the `enc:v1:` envelope; the fake lifecycle record was removed | high |
| Client writes do not fall back to plaintext | Worker unit test without `DATA_KEY` returned a controlled 503 and did not write the record | high |
| Phoenix calendar behavior is explicit | `EvermoreSuite.dateKey()` uses `America/Phoenix`; automated rollover test passes | high |
| Production remains unchanged | No Wrangler deploy, Pages deploy, live-proxy deploy, merge, or production route verification occurred | high |

## Map

- **Canonical inbound UI:** `inbound-client-intake/index.html`
- **Shared client/draft/migration helpers:**
  `agent-suite-intake-continuity.js`
- **Authentication and navigation:** `agent-suite-auth.js`, `login/index.html`
- **Authoritative completed records:** existing authenticated `/api/clients`
  endpoints in `01_website/agent-suite-api/cloudflare/worker.js`
- **Permanent identity:** server client ID
- **Unfinished work:** non-sensitive, per-user local draft only
- **Legacy browser records:** detected once, imported only after confirmation,
  verified by acknowledged record count, and retained unless explicitly removed
- **Sensitive database fields:** encrypted by the Worker's existing `DATA_KEY`;
  writes fail with 503 if encryption is unavailable

## Visual Evidence

The in-app browser preview verified the existing desktop visual structure and
shared menu without creating a screenshot containing client information. Mobile
behavior remains governed by the existing `max-width:820px` sidebar rules and
the shared navigation's responsive rules; final operator device review remains
part of the private preview checklist.

## Unknown Or Unavailable

- Production API encryption and cross-device continuity were not tested because
  production deployment is separately approval-gated.
- The live `/inbound-client-intake/` route is not claimed active from this
  branch. Public routing and post-deploy readback remain outstanding.
- A real pre-integration browser vault was not opened during browser QA; the
  migration paths are covered by automated tests for local-only, deduped,
  stale-link, and interrupted imports. Incorrect-password behavior remains in
  the existing encrypted-vault unlock layer and should be included in operator
  preview if such a vault is available.
- AI, GoHighLevel, and password recovery remain explicitly deferred.

## Cross-Surface Overlaps

The inbound worksheet, Pipeline, Today, and Worker now depend on the same client
identity and a coordinated static/API release. This is recorded in
`BLUEPRINTS/OVERLAPS.md`.

## Recommended Next Move

The Evermore operator should test the local/private preview with fake data on
desktop and mobile. After approval, commit and push the isolated branch for a
draft PR. Production deployment should then be separately approved and executed
as one coordinated API/static/live-route release, followed by authenticated
readback of every route and a second-browser continuity test.

## Files Changed

- `inbound-client-intake/index.html`
- `agent-suite-intake-continuity.js`
- `agent-suite-auth.js`
- `login/index.html`
- `01_website/agent-suite-api/cloudflare/worker.js`
- `01_website/agent-suite-api/cloudflare/worker.test.mjs`
- `04_tools/tests/agent_suite_intake_continuity_test.mjs`
- `04_tools/tests/inbound_client_intake_sheet_test.mjs`
- `BLUEPRINTS/MAP.md`
- `BLUEPRINTS/DECISIONS.md`
- `BLUEPRINTS/OVERLAPS.md`
- `BLUEPRINTS/reports/2026-07-16_inbound-intake-live-integration.md`
