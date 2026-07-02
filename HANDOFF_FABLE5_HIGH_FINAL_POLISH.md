# Handoff: Evermore Final Polish — for Claude Fable 5 (high effort)

**Date:** 2026-07-02
**From:** Claude Fable 5 (low effort session) + operator Lucidus
**Workspace:** `/Users/k9smac/Desktop/EVERMORE-LIFE`
**Repo:** https://github.com/kurrea23/evermore-life (branch `main`, head `fc06dc5` at handoff)
**Operator skill level:** beginner with git/GitHub — explain commands, never assume.

## Read first

1. `AGENTS.md`
2. `BLUEPRINTS/README.md` and `BLUEPRINTS/MAP.md`
3. `HANDOFF_CLAUDE_FABLE_5_GIT_CLEANUP.md` (previous handoff — now COMPLETED)
4. `BLUEPRINTS/reports/2026-07-01_agent-suite-audit.md` (security audit)
5. This file

## What the previous session completed (all verified)

### Git cleanup — DONE
- The 51-file dirty tree was split into 5 lane commits and merged with
  origin/main's Arizona hero fix (hero video verified intact post-merge).
- `main` is clean, pushed, and matches production. Working tree: clean.
- Stale branch `codex/intake-crm-sync` deleted (0 unique commits, verified).
  Worktrees pruned. Safety branches kept: `cleanup-handoff-2026-07-01`,
  `my-work-backup-20260622-165651`, `agent-suite-overhaul` (merged).
- 14 macOS " 2" duplicate files removed (3 were stale schema-v1 drafts).

### Agent Suite security fixes — DONE and DEPLOYED
Worker: `01_website/agent-suite-api/cloudflare/worker.js` → `evermore-score-tracker-api` on `api.evermorelife.org/*`.
- PUT /api/clients/:id is now a PARTIAL update (only fields present in the
  body are written; intake_json is merged, not replaced). Previously a
  partial PUT wiped all 79 columns. Unit-tested with a fake DB harness.
- Field-level AES-GCM encryption at rest for `ssn`, `routing`, `account`,
  `dl_number`, `intake_json`. Key = Cloudflare secret `DATA_KEY` (set by
  operator 2026-07-02, wrangler confirmed). Values prefixed `enc:v1:`.
  Legacy plaintext rows still read fine; they encrypt on next write.
  **If DATA_KEY is ever lost, encrypted data is unrecoverable.**
- XSS fix: user display name is HTML-escaped in the shared nav
  (`agent-suite-auth.js`).
- 500 responses no longer leak `error.message` (logged to console instead).
- `clients/index.html` refactored onto the shared `EvermoreAgentSuite`
  helper (no more duplicated token/fetch logic).
- Live verification passed: bad login 401, missing token 401, no detail leak.

### Client Intake → Agent Suite integration — DONE, PARTIALLY DEPLOYED
File: `01_website/experiments/Client-Intake.html` (served at `/intake` by the
live-proxy Worker, which bundles `01_website/experiments/` as assets).
- Agent Suite login gate: no `evermore-auth-token` in localStorage →
  redirect to `/login/?next=%2Fintake`. Local master-password vault
  (client-side encryption) unchanged — operator likes it as-is.
- Silent background CRM sync: `saveClient()` fire-and-forgets
  `syncClientToServer()` (POST new / PUT existing via `serverId` stored on
  the local record; offline → `syncPending` flag, retried by
  `backfillSync()` 1.5s after each unlock). Delete syncs a server DELETE.
  Field names (camelCase) already match the Worker's normalizeClient aliases.
- Tap-to-copy: click a `.field > label` or double-click/double-tap an
  input/select/textarea in `#main` copies that value + toast.
- Removed: 🖨 Print button and 📊 Spreadsheet (exportCSV). KEPT: encrypted
  Backup/Restore/Auto-Backup, Copy Summary, section copy, recovery-code print.
- `/login` and `/signup` rebuilt to match the intake lock-screen style with
  logo at `login/assets/evermore-logo.png` (extracted from intake's base64).
  Login honors `?next=` against an allowlist.

## Deployment architecture (CRITICAL — this is why patches "break things")

Three separate deploy surfaces; never conflate them:

1. **Static site (login, signup, clients, score-tracker, growth-calculator,
   team, index, etc.)** → Cloudflare Pages project `evermore-life`,
   published ONLY by running `./deploy.sh` from repo root (it clones fresh
   GitHub main and runs wrangler pages deploy). Pushing to GitHub does NOT
   publish the site. GitHub Pages also builds but is NOT the live origin.
2. **Live-proxy Worker** (`evermorelife.org/*` routing, serves /intake and
   its PWA assets from bundled `01_website/experiments/`) →
   `npx wrangler deploy --config 01_website/v2/cloudflare/wrangler.live-proxy.jsonc`
3. **Agent Suite API Worker** (`api.evermorelife.org/*`) →
   `npx wrangler deploy --config 01_website/agent-suite-api/cloudflare/wrangler.agent-suite-api.jsonc`

Deploy state at handoff: (2) and (3) are deployed with all changes.
(1) is NOT — new login/signup pages are on GitHub main but the operator has
not yet run `./deploy.sh`.

## Immediate next steps (in order)

1. Have the operator run `./deploy.sh` from the repo root, then verify:
   - `/login/` contains `lockCard` and loads `/login/assets/evermore-logo.png` (200)
   - `/signup/` matches
   - full route sweep returns 200: /intake /intake.webmanifest /intake-sw.js
     /intake-icon.svg /arizona /texas /arkansas /recruiting /sarah /dashboard
     /dashboard-preview /optin /privacy /terms
2. End-to-end sync test with the operator: log in → open /intake → unlock
   vault → save a client → confirm it appears in /clients Pipeline, and that
   the D1 row shows `enc:v1:` prefixes on ssn/routing/account.
3. UNTESTED so far: the login gate flow on a phone (PWA standalone mode may
   handle localStorage/redirects differently), backfillSync with many
   clients, and duplicate handling (intake re-POSTs create new server rows if
   localStorage was cleared — serverId lives in the local vault only).

## Known open items for the "big bow"

- **Intake duplicate risk:** if a device's vault is restored from backup or
  cleared, serverId links are lost/stale → sync can create duplicates.
  Consider server-side dedupe (phone match) or storing intake client id
  server-side (it IS in intake_json).
- **Two client models:** intake local vault vs CRM D1 are one-way synced
  (intake → server). Pipeline edits do NOT flow back to intake. Operator
  goal is "continuity lives on the backend" — a future step is making the
  server authoritative and the vault a cache.
- **Owner/agency scoping:** `/api/owner/agents` returns ALL agents
  regardless of agency_id — fine now, must scope before a second agency.
- **Score-tracker/growth-calculator/team pages** were audited only lightly;
  they use the shared helper correctly but haven't been deep-reviewed.
- **Blueprint docs** (MAP/DECISIONS/OVERLAPS) have accumulated entries and
  need a dedupe/ordering pass.
- **agent-suite-overhaul branch** is merged; it can be deleted on GitHub
  (`git push origin --delete agent-suite-overhaul`) and locally once the
  operator confirms everything works.

## Operating rules (inherited, still in force)

- Never `git add .`, never `git reset --hard`.
- Commit by lane; run `git diff --check` before commits (markdown trailing
  double-space line breaks are OK to waive).
- After ANY live-proxy Worker deploy, re-check all 14 routes above.
- Never mix Agent Suite changes with public website/state-page changes.
- No secrets, tokens, customer data, or private screenshots in the repo.
- State pages are GENERATED from `01_website/state-pages/templates/` +
  `data/states.json` (schema v2) via `scripts/build_state_pages.py` —
  edit source + regenerate, don't hand-edit `public/`.
- The operator prefers plain-language explanations and exact terminal
  commands they can paste. Deploys and secrets must run on THEIR machine;
  the sandbox has no GitHub/Cloudflare credentials.

## Key facts cheat-sheet

- Auth localStorage keys: `evermore-auth-token`, `evermore-auth-user`,
  `evermore-user-name`, `evermore-user-role`
- API base: `https://api.evermorelife.org/api` (defined in `agent-suite-auth.js`)
- Sessions: 30 days, server-side in D1 `sessions` table
- Passwords: PBKDF2-SHA256, 100k iterations (Cloudflare CPU cap)
- Owner role: assigned at signup if email ∈ `OWNER_EMAILS` env var
- D1 database: `evermore-agent-db`; clients table has 79 data columns
- Intake vault: localStorage `evermore_vault_v1`, AES via master password +
  recovery code (client-side, independent of server encryption)
