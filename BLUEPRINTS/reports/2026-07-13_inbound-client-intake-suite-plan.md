# Cartographer Report: Inbound Client Intake Suite Integration Plan

- **Date:** 2026-07-13
- **Agent or operator:** Codex
- **Surface:** Inbound Client Intake Sheet + Agent Suite navigation and client continuity
- **Mission:** Establish the approved standalone source and define how it will later sit beside the general Intake without implementing backend integration now
- **Approval level used:** execute for source placement and planning; observe only for backend and shared navigation

## Executive Finding

The approved Inbound Client Intake Sheet now has one canonical source at
`inbound-client-intake/index.html`. The previous experiments URL is a small
redirect, not a second copy. The clean local review route is
`http://127.0.0.1:8000/inbound-client-intake/`.

No Agent Suite authentication, navigation, API, database, Worker, proxy, or
deployment code was changed. The recommended future integration is to add an
**Inbound Intake** destination beside the existing **Intake** link and have
both forms write the same authenticated `/api/clients` record shape.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| The inbound sheet has one maintained source outside `experiments` | `inbound-client-intake/index.html` and compatibility redirect at `01_website/experiments/Client-Intake-Guided.html` | high |
| The shared desktop navigation is generated centrally | `installTopNav()` in `agent-suite-auth.js` | high |
| The existing authenticated client contract is `/api/clients` with create, update, and delete support | `01_website/agent-suite-api/cloudflare/worker.js` and its tests | high |
| Unknown inbound-only fields can remain in `intake_json` without a new database schema | `normalizeClient()`, `applyClientUpdate()`, and `serverRowToClient()` | high |
| The current inbound sheet still stores its completed records in browser `localStorage` | `persist()` in `inbound-client-intake/index.html` | high |
| The canonical identity, 15-step structure, critical transitions, transient authorization code, compatibility redirect, and inline JavaScript have a focused automated sanity test | `04_tools/tests/inbound_client_intake_sheet_test.mjs` | high |

## Map

### Current approved state

- **General Intake:** `01_website/experiments/Client-Intake.html`, already on the
  Agent Suite continuity path.
- **Inbound Client Intake Sheet:** `inbound-client-intake/index.html`, approved
  15-step inbound-call workflow, currently standalone and browser-saved.
- **Compatibility URL:**
  `01_website/experiments/Client-Intake-Guided.html`, redirect only.
- **Shared suite navigation owner:** `agent-suite-auth.js`.
- **Shared client identity and persistence owner:** authenticated
  `/api/clients` in `01_website/agent-suite-api/cloudflare/worker.js`.

### Future implementation phases — not executed

1. **Navigation and authentication shell**
   - Load the same Agent Suite auth/navigation assets as the other private
     tools.
   - Add **Inbound Intake** directly beside **Intake** in the desktop menu.
   - On mobile, expose both choices through the Intake destination or a small
     Intake chooser so the bottom navigation does not become overcrowded.
   - Require the same logged-in agent role as general Intake.

2. **One server-backed client record**
   - Reuse `GET/POST /api/clients`, `PUT /api/clients/:id`, and
     `DELETE /api/clients/:id`; do not create a second inbound database.
   - Keep the server client ID as the permanent identity used by Pipeline,
     Today, activities, appointments, Tracker, Calculator, and Team.
   - Default `leadSource` to `Inbound` and preserve the inbound script answers
     in `intake_json`. The existing backend already retains extra intake fields,
     so no new schema is expected for the first integration pass.

3. **Draft and sensitive-data boundary**
   - Reuse `agent-suite-intake-continuity.js` for server mapping and draft
     sanitization.
   - Never persist SSN, driver-license, routing, account, bank, or authorization
     code values in a browser draft.
   - Keep the six-digit authorization code transient and clear it on client
     change, save, refresh, or logout.

4. **Legacy local-record decision**
   - Before switching storage, inventory the current
     `evermore_guided_intake_v1` browser records.
   - Offer an explicit one-time merge into the logged-in account or an export;
     never silently discard or auto-upload local records.
   - Reuse the existing server deduplication behavior for matching records.

5. **Cross-surface verification**
   - Create, edit, stage-move, appoint, and delete one inbound test client.
   - Confirm that general Intake and Inbound Intake open the same server record
     and that Pipeline, Today, Tracker, Calculator, and Team reflect it.
   - Verify desktop and mobile navigation, Phoenix date behavior, sensitive
     draft exclusion, and the transient authorization code.

6. **Release gate**
   - Complete local and preview validation first.
   - Deploy Pages, API, or live-proxy changes only after separate operator
     approval.
   - Verify every approved live route after deployment before calling the
     integration live.

## Visual Evidence

The canonical local route and the former experiments URL were browser-checked.
No customer information was entered or captured.

## Unknown Or Unavailable

- No final public/private production URL has been selected.
- No decision has been made about whether mobile navigation should use an
  Intake chooser or a second direct tab.
- Existing local inbound records were not inspected because browser storage may
  contain private customer data.
- Backend integration, authentication, and deployment were explicitly deferred.

## Cross-Surface Overlaps

The inbound sheet's current browser persistence conflicts with the canonical
server-first Intake contract. The dependency remains recorded in
`BLUEPRINTS/OVERLAPS.md`.

## Recommended Next Move

When the operator approves implementation, start with the navigation/auth shell
and a field-mapping test against the existing `/api/clients` contract. Do not
alter the approved call-flow layout or create a second client database.

## Files Changed

- `inbound-client-intake/index.html`
- `01_website/experiments/Client-Intake-Guided.html`
- `BLUEPRINTS/reports/2026-07-13_inbound-client-intake-suite-plan.md`
- `BLUEPRINTS/reports/2026-07-13_guided-intake-banking-closeout-flow.md`
- `BLUEPRINTS/DECISIONS.md`
- `BLUEPRINTS/MAP.md`
- `BLUEPRINTS/OVERLAPS.md`
- `04_tools/tests/inbound_client_intake_sheet_test.mjs`
