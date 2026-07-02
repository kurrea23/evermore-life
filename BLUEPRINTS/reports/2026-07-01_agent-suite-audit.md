# Agent Suite Audit — 2026-07-01 (Claude Fable 5)

**Branch:** `agent-suite-overhaul`
**Scope:** agent-suite-auth.js, login/signup/team/clients/score-tracker/growth-calculator pages, agent-suite-api Worker.

## What is solid

- Password hashing: PBKDF2-SHA256, 100k iterations, random salt, timing-safe compare. Good.
- Sessions: random 32-byte tokens, stored server-side in D1, 30-day expiry enforced on every request, deleted on logout. Good.
- Every data route requires a valid session; owner routes check `role === 'owner'` server-side. Good.
- All SQL uses bound parameters — no injection risk. Good.
- CORS restricted to `ALLOWED_ORIGINS` env. Good.
- Clients are scoped to `user_id` on read, update, and delete. Good.

## Findings (by severity)

### 1. CRITICAL — Plaintext SSN + full bank account/routing in the database

`normalizeClient` stores full `ssn`, `routing`, `account`, and `dl_number` as
plain text columns, AND stores the entire raw payload again inside
`intake_json`. Last-4 columns already exist and are computed. A single DB leak
exposes every client's SSN and bank login. Needs a decision: keep full values
(required for carrier applications) but encrypt them, or store last-4 only.

### 2. CRITICAL — Client PUT is a full overwrite

`updateClient` rewrites ALL 79 columns from the request body; any field not
sent becomes `""`. A partial update (e.g. a future intake→CRM sync sending
just `status`) silently wipes the rest of the client record. Fix: only update
columns actually present in the request body.

### 3. HIGH — Stored XSS in shared nav

`installTopNav` injects the user's `name` into `innerHTML` unescaped. A name
containing HTML (set at signup) executes script on every Agent Suite page for
that user, and on the owner Team dashboard. Fix: escape name (and use
textContent).

### 4. MEDIUM — clients page duplicates auth logic

`clients/index.html` re-implements token check, logout, and raw `fetch` calls
instead of `EvermoreAgentSuite.requireAuth()/api()`. Behavior can drift (401
handling already differs slightly). Fix: route everything through the shared
helper.

### 5. LOW — Error responses leak internal detail

The Worker returns `detail: error.message` on 500s. Trim to a generic message
in production.

### 6. LOW / future — Owner sees all agents regardless of agency_id

`/api/owner/agents` returns every agent in the DB. Fine for one agency today;
must be scoped by `agency_id` before onboarding a second agency.

## Recommended fix order

1. PUT partial-update fix (#2) — prerequisite for intake→CRM sync.
2. XSS escape in nav (#3) — small, safe.
3. Sensitive-data handling (#1) — after operator decision on encrypt vs last-4.
4. Refactor clients page onto shared auth helper (#4).
5. Error detail trim (#5). Agency scoping (#6) when a second agency exists.

Each fix ships as its own commit on `agent-suite-overhaul`, tested, then
merged to main and deployed with a full route sweep.
