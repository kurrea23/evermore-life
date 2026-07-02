# Handoff to Claude Fable 5: Evermore Git Cleanup + System Optimization

**Date:** 2026-07-01  
**Workspace:** `/Users/k9smac/Desktop/EVERMORE-LIFE`  
**Goal:** Clean up the dirty branch safely, preserve live fixes, and optimize the whole system including Agent Suite logins/tools without breaking public routes.

## Read First

1. `AGENTS.md`
2. `BLUEPRINTS/README.md`
3. `BLUEPRINTS/MAP.md`
4. `00_START_HERE/README.md`
5. This file
6. `BLUEPRINTS/reports/2026-07-01_git-branch-cleanup-handoff.md`

## Current Git State

After `git fetch origin --prune`:

- Current branch: `main`
- Local `main`: `d9a104e chore: add deploy.sh to main so the deploy helper survives branch switches`
- Remote `origin/main`: `db4e68d Fix Arizona hero: restore video on desktop, clean photo on mobile`
- Status: local `main` is **behind `origin/main` by 1 commit**
- Staged files: **none**
- Modified tracked files: **28**
- Untracked files: **23**

Do not run `git reset --hard`. Do not run `git add .`. This tree contains several unrelated lanes that need separate commits or branches.

## Already Committed Upstream

`origin/main` has one commit not yet merged into this local checkout:

```text
db4e68d Fix Arizona hero: restore video on desktop, clean photo on mobile
```

It changes:

- `01_website/state-pages/public/arizona/index.html`
- `01_website/state-pages/public/assets/state-pages.css`

This overlaps with local unstaged state-page changes. Before merging or committing, inspect conflicts carefully so the local state-page lane does not undo the remote Arizona hero fix.

## Local Branches And Worktrees

Branches:

- `main` at `d9a104e`, behind `origin/main` by 1
- `codex/intake-crm-sync` at `db4e68d`, checked out in a missing/prunable worktree path
- `my-work-backup-20260622-165651` at `0f78a45`

Worktree metadata:

- Main checkout: `/Users/k9smac/Desktop/EVERMORE-LIFE`
- Prunable temp worktree: `/private/var/folders/4k/snfvtfx154s1my_tjmzmr6080000gn/T/tmp.cVbeIOQ8hu`
- Prunable intake worktree: `/Users/keenanmain/Desktop/EVERMORE-LIFE-intake-crm-sync`

Cleanup recommendation: after preserving this dirty checkout, run `git worktree prune` only with operator approval.

## Local Unstaged Tracked Changes

### Lane A: GHL/A2P operating docs

Files:

- `00_START_HERE/ADS_LAUNCH_CONTROL.md`
- `00_START_HERE/CODEX_HANDOFF.md`
- `00_START_HERE/GUIDES_00_03_COMPLETION_HANDOFF.md`
- `00_START_HERE/README.md`
- `00_START_HERE/SETUP_GUIDE_00_GHL_FOUNDATION.md`
- `00_START_HERE/SETUP_GUIDE_03_A2P_AND_NURTURE.md`
- `00_START_HERE/active/rooms/A2P_REGISTRATION/README.md`
- `00_START_HERE/active/rooms/A2P_REGISTRATION/YOU_DO_THIS.md`
- `02_ghl/CODEX_HANDOFF.md`
- `02_ghl/launch_kit/A2P_GAP_REPORT.md`
- `02_ghl/launch_kit/README.md`
- `02_ghl/launch_kit/SMS_NURTURE_SEQUENCE.md`
- `02_ghl/launch_kit/form-workflow-next-steps.md`
- `02_ghl/launch_kit/live-build-runbook.md`
- `02_ghl/launch_kit/native-form-field-map.md`
- `02_ghl/launch_kit/native-form-fields.csv`
- `03_sales_marketing/handoffs/COWORK_HANDOFF.md`
- `03_sales_marketing/handoffs/EVERMORE_HANDOFF.md`

Meaning: updates old “A2P pending/hold” language to “A2P approved/textable per operator confirmation,” with the next gate being consent-gated SMS workflow testing and STOP/START proof.

Commit candidate: `docs: update A2P status and consent-gated SMS next steps`

### Lane B: Live Worker and route stability

Files:

- `01_website/v2/cloudflare/evermore-live-proxy.js`
- `01_website/experiments/Client-Intake.html` (untracked)
- `01_website/experiments/intake.webmanifest` (untracked)
- `01_website/experiments/intake-sw.js` (untracked)
- `01_website/experiments/intake-icon.svg` (untracked)
- `01_website/experiments/sarah-final-expense.html` (untracked)

Meaning:

- `/intake` was restored live by forward-porting intake route handlers into the current Worker.
- `/intake`, `/intake.webmanifest`, `/intake-sw.js`, `/intake-icon.svg` all verified `200` after deploy.
- `/sarah` points at `sarah-final-expense.html`.
- Shared route sweep after deploy returned `200` for `/arizona`, `/texas`, `/arkansas`, `/recruiting`, `/sarah`, `/dashboard`, `/dashboard-preview`, `/optin`, `/privacy`, and `/terms`.

Commit candidate: `fix: restore intake PWA route in unified Worker`

Risk: this Worker is shared infrastructure. Any future edit must re-check all routes above.

### Lane C: State pages / generated source drift

Files:

- `01_website/state-pages/assets/state-pages.css`
- `01_website/state-pages/public/arizona/index.html`
- `01_website/state-pages/public/arkansas/index.html`
- `01_website/state-pages/public/assets/state-pages.css`
- `01_website/state-pages/public/texas/index.html`
- `01_website/state-pages/templates/state-page.html`

Meaning:

- Local changes convert logo images to text-logo treatment, adjust mobile nav/trust bar behavior, and remove the hero kicker script from generated state pages/template.
- `git diff --check` currently fails on trailing whitespace in:
  - `01_website/state-pages/public/arkansas/index.html:37`
  - `01_website/state-pages/public/texas/index.html:37`
- This lane overlaps with `origin/main` commit `db4e68d`, which already fixed Arizona hero video/poster behavior.

Commit candidate only after cleanup: `fix: align generated state pages with mobile-safe text branding`

Required before commit:

- Merge/rebase onto `origin/main` or apply the remote Arizona fix into the dirty checkout.
- Remove trailing whitespace.
- Regenerate state pages if changing the template/source.
- Verify `/arizona`, `/texas`, `/arkansas` live or in preview.

### Lane D: Blueprint maps/reports/decisions

Files:

- `BLUEPRINTS/DECISIONS.md`
- `BLUEPRINTS/MAP.md`
- `BLUEPRINTS/OVERLAPS.md`
- `BLUEPRINTS/CLICKABLE_SYSTEM_MAP.html` (untracked)
- `BLUEPRINTS/PROJECT_OPERATING_BLUEPRINT.md` (untracked)
- reports under `BLUEPRINTS/reports/` from 2026-06-25 through 2026-07-01

Meaning:

- Adds durable map/reporting for Sarah route, state pages, clickable system map, website health, A2P update, and intake route restore.
- Some Blueprint files have accumulated many entries and should be reviewed for duplicate chronology/order before commit.

Commit candidate: `docs: add Evermore route and operations blueprint reports`

### Lane E: Content/video concepts

Files:

- `soccer-dad-awareness-video-outline.md`
- `the-promise-60s-spot.md`

Meaning: campaign creative outlines. Keep out of website/Worker commits.

Commit candidate: `docs: add Evermore campaign video concepts`

## Agent Suite / Login Optimization Surface

Use this lane for the “agent logins etc.” optimization. Do not mix it with public website route patches.

Primary files:

- `agent-suite-auth.js`
- `login/index.html`
- `signup/index.html`
- `team/index.html`
- `clients/index.html`
- `score-tracker/index.html`
- `growth-calculator/index.html`
- `01_website/agent-suite-api/cloudflare/worker.js`
- `01_website/agent-suite-api/cloudflare/wrangler.agent-suite-api.jsonc`
- `01_website/agent-suite-api/cloudflare/migrations/0001_agent_suite.sql`

Known facts:

- Auth token key: `evermore-auth-token`
- User storage key: `evermore-auth-user`
- API base is defined in `agent-suite-auth.js`
- Backend route family: `api.evermorelife.org/*`
- Backend Worker source: `01_website/agent-suite-api/cloudflare/worker.js`
- PBKDF2 iterations are capped at `100000` for Cloudflare runtime compatibility.
- `/api/clients` exists and uses auth.
- Client `PUT` behavior should be treated carefully because full overwrite risk was previously documented.

Optimization ask for Claude:

1. Audit login/signup/logout flow across all tool pages.
2. Audit owner/team role behavior.
3. Audit token expiry/redirect behavior.
4. Audit client API payload safety before connecting any intake sync.
5. Improve navigation and state consistency without changing public website routes.
6. Keep API secrets and customer/private lead data out of repo.

## Recommended Cleanup Sequence

1. Preserve current dirty state by creating a new branch from this checkout, for example `codex/cleanup-handoff-2026-07-01`.
2. Do not merge `origin/main` until the dirty state is preserved.
3. Split commits by lane:
   - Worker/intake route restore
   - A2P/GHL docs
   - Blueprint reports/map
   - state-page cleanup
   - content/video concepts
4. For the Worker/intake commit, include only:
   - `01_website/v2/cloudflare/evermore-live-proxy.js`
   - `01_website/experiments/Client-Intake.html`
   - `01_website/experiments/intake.webmanifest`
   - `01_website/experiments/intake-sw.js`
   - `01_website/experiments/intake-icon.svg`
   - `01_website/experiments/sarah-final-expense.html`
   - related Blueprint report/decision entries if desired
5. For state pages, resolve `origin/main` Arizona hero overlap before commit.
6. Run `git diff --check` before every commit.
7. Run route checks after any Worker deploy:
   - `/intake`
   - `/intake.webmanifest`
   - `/intake-sw.js`
   - `/intake-icon.svg`
   - `/arizona`
   - `/texas`
   - `/arkansas`
   - `/recruiting`
   - `/sarah`
   - `/dashboard`
   - `/dashboard-preview`
   - `/optin`
   - `/privacy`
   - `/terms`

## Do Not Do

- Do not run `git add .`.
- Do not run `git reset --hard`.
- Do not redeploy the older `origin/codex/intake-mobile-live` Worker wholesale.
- Do not mix Agent Suite login/API changes with public website/state-page changes.
- Do not commit private screenshots, secrets, tokens, customer data, or GHL Trust Center private proof.
- Do not call GHL, CRM, SMS, or tracking healthy without live account evidence.

## Current Known Verification

Latest live route sweep after intake restore returned `200` for:

- `https://evermorelife.org/intake`
- `https://evermorelife.org/intake.webmanifest`
- `https://evermorelife.org/intake-sw.js`
- `https://evermorelife.org/intake-icon.svg`
- `https://evermorelife.org/arizona`
- `https://evermorelife.org/texas`
- `https://evermorelife.org/arkansas`
- `https://evermorelife.org/recruiting`
- `https://evermorelife.org/sarah`
- `https://evermorelife.org/dashboard`
- `https://evermorelife.org/dashboard-preview`
- `https://evermorelife.org/optin`
- `https://evermorelife.org/privacy`
- `https://evermorelife.org/terms`

## Immediate Next Step For Claude

Start by creating a safety branch from the dirty checkout and producing a commit plan without staging. Then stage explicit paths for the Worker/intake route restore first, because that is already deployed live and needs source control to match production.
