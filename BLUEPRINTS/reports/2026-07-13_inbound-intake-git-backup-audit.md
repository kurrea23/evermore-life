# Cartographer Report: Inbound Intake Git Backup And Test Audit

- **Date:** 2026-07-13
- **Agent or operator:** Codex
- **Surface:** Inbound Client Intake Sheet + current Git branch/worktree
- **Mission:** Make the approved update actively testable and define a clean GitHub backup that does not mix drifting work lanes
- **Approval level used:** observe and test; no staging, commit, push, PR, deploy, or destructive cleanup

## Executive Finding

The Inbound Client Intake Sheet is locally testable and its focused checks pass.
It is not safely publishable from the current working tree as one bulk commit.

The checkout is on `experiment/script-intake` at `c7b2df0`, one commit ahead of
`origin/main`. That commit contains only the original guided intake file, but
the branch does not exist on `origin`. The working tree then adds the approved
canonical version plus several unrelated Agent Suite, state-page, content, and
generated-output lanes. There are 23 tracked modified entries, 19 untracked
entries, and no staged files.

The safe GitHub backup is a new isolated branch/worktree containing only the
Inbound Intake lane. A publish was not attempted because GitHub CLI (`gh`) is
not installed, and the mixed worktree requires explicit lane confirmation
before staging.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Current branch is one commit ahead of `origin/main` and not behind | `git rev-list --left-right --count origin/main...HEAD` returned `0 1` | high |
| The only committed branch delta is the original guided intake HTML | `git show --stat c7b2df0` | high |
| The branch has no matching remote head | `git ls-remote --heads origin experiment/script-intake` returned no branch | high |
| The worktree contains 23 modified and 19 untracked status entries across multiple lanes | `git status --porcelain=v1` | high |
| Inbound Intake focused sanity checks pass | `node --test 04_tools/tests/inbound_client_intake_sheet_test.mjs` — 5/5 | high |
| Existing Agent Suite API/continuity checks pass | Worker + continuity test command — 17/17 | high |
| Canonical local page renders all 15 sections, 16 script pop-outs, and 13 transitions with no browser errors | Browser readback at `http://127.0.0.1:8000/inbound-client-intake/` | high |
| Git whitespace validation and tracked active-room symlink check pass | `git diff --check` and `find -L 00_START_HERE/active -type l -print` | high |

## Map

### Lane A — Inbound Intake: publish together

- Existing committed base: `c7b2df0`
- `inbound-client-intake/index.html`
- `01_website/experiments/Client-Intake-Guided.html` (redirect only)
- `04_tools/tests/inbound_client_intake_sheet_test.mjs`
- `BLUEPRINTS/reports/2026-07-13_guided-intake-*.md`
- `BLUEPRINTS/reports/2026-07-13_inbound-client-intake-suite-plan.md`
- `BLUEPRINTS/reports/2026-07-13_inbound-intake-git-backup-audit.md`
- Only the Inbound Intake hunks from `BLUEPRINTS/DECISIONS.md`,
  `BLUEPRINTS/MAP.md`, and `BLUEPRINTS/OVERLAPS.md`

### Lane B — Agent Suite continuity: keep separate

- `01_website/agent-suite-api/cloudflare/worker.js` and tests
- `01_website/experiments/Client-Intake.html`
- `agent-suite-intake-continuity.js`
- `agent-suite-auth.js`, `agent-suite-activity.js`
- `today/`, `score-tracker/`, `growth-calculator/`, and `signup/` changes
- `04_tools/tests/agent_suite_intake_continuity_test.mjs`
- `BLUEPRINTS/reports/2026-07-10_agent-suite-continuity.md`
- Related handoff and Blueprint hunks

### Lane C — State pages: keep separate

- State-page README, template, renderer, generated Arizona page, and CSS
- `01_website/state-pages/SKILL.md`
- `04_tools/scripts/build_state_page.sh`
- State-service handoff, deployment script, and state-page report
- State-page Blueprint decision/overlap hunks

### Lane D — Content and ad review: keep separate

- Creative tracker
- Review markdown and generated review image
- Content/paid-readiness and first-ad reports
- Content/paid Blueprint overlap hunks

### Lane E — Local outputs: do not include by default

- `outputs/` spreadsheet inspection and preview artifacts
- Include only in an intentionally named artifact/export commit if the operator
  confirms they belong in Git

## Clean GitHub Backup Sequence

1. Install and authenticate GitHub CLI:
   - `brew install gh`
   - `gh auth login`
   - verify with `gh auth status`
2. Confirm that **Lane A only** is the intended first backup.
3. Create an isolated branch/worktree from current `origin/main` named
   `codex/inbound-client-intake-sheet`.
4. Bring in `c7b2df0`, then apply only the Lane A files and Blueprint hunks.
5. Run:
   - `node --test 04_tools/tests/inbound_client_intake_sheet_test.mjs`
   - `git diff --check`
   - browser verification of the canonical and compatibility routes
6. Stage explicit Lane A paths/hunks only; never use `git add .` or
   `git add -A` in the mixed checkout.
7. Commit with a narrow message such as
   `Approve inbound client intake sheet`.
8. Push the isolated branch and open a draft PR against `main`.
9. Verify the remote branch/PR contains no Agent Suite continuity, state-page,
   content, or `outputs/` files before considering merge.

## Active Manual Test Checklist

Use fake information only. The current sheet saves completed records and JSON
backups in the browser without the future Agent Suite secure-storage
integration.

1. Open `http://127.0.0.1:8000/inbound-client-intake/`.
2. Confirm the top badge says **Inbound Client Intake Sheet** and that all
   section chips 1 through 15 are available.
3. Click **New Client** and confirm the call date is filled and Lead Source is
   `Inbound`.
4. Open every call-script pop-out and review each transition in order.
5. Enter fake basic, household, beneficiary, needs, banking, and policy data.
6. In Health Qualification, mark each supported “Yes” item and confirm its
   follow-up area appears; turn it off and confirm the follow-up closes.
7. In Plan Options, test burial and cremation presets, edit coverage/premium,
   and add more than one carrier quote.
8. In Policy Setup, use a fake SSN and confirm the eye button masks/unmasks it.
9. In Text Verification, enter fake code `123456`, then switch to **New Client**
   and confirm the code clears.
10. Save one clearly named fake client such as `TEST INBOUND DELETE ME`.
11. Search for that client, reopen it, edit a non-sensitive value, save again,
    and confirm the list updates.
12. Use **Copy Summary** and verify the sections and chosen quote appear in the
    copied summary without the temporary authorization code.
13. Use **Backup** with fake records only, then verify **Restore** recognizes the
    downloaded JSON in a disposable test pass.
14. Delete the fake client and confirm it disappears from search and the list.
15. Narrow the browser to mobile width and confirm the client drawer, chips,
    script pop-outs, fields, and action menu remain usable.
16. Open the former experiments URL and confirm it redirects to
    `/inbound-client-intake/`.

### Pass criteria

- No browser errors.
- All 15 sections remain reachable.
- Conditional health fields behave correctly.
- Quote presets and multiple carriers work.
- Temporary authorization code never follows another client.
- Fake client save, search, edit, summary, backup/restore, and delete all work.
- Desktop and mobile remain readable without horizontal clipping.

## Visual Evidence

The canonical page was browser-checked without entering customer data. It
rendered the approved title, 15 sections, 16 scripts, 13 transitions, client
controls, and primary actions with no console errors.

## Unknown Or Unavailable

- GitHub publish and draft PR creation are blocked until `gh` is installed and
  authenticated.
- Homebrew installation is currently blocked because `/opt/homebrew` and its
  writable support directories are owned by the separate macOS account
  `evermorelife:staff`, while the active user is `k9smac`. No `sudo` command or
  ownership change was executed by Codex.
- Save/restore/delete were not automated because the active browser may contain
  private local client records; the checklist leaves those actions to the
  operator using clearly fake data.
- The current dirty non-Inbound lanes have not been approved for keep, discard,
  commit, or push.
- No deploy or live route was requested or attempted.

## Cross-Surface Overlaps

The current checkout combines four product lanes and local generated outputs.
That drift must not be represented as one release or one GitHub backup.

## Recommended Next Move

Confirm **Lane A only** for the first GitHub backup and install/authenticate
`gh`. Then create the isolated branch/worktree, commit the verified Lane A
scope, push it, and open a draft PR. Triage the remaining lanes independently.

## Files Changed

- `04_tools/tests/inbound_client_intake_sheet_test.mjs`
- `BLUEPRINTS/reports/2026-07-13_inbound-intake-git-backup-audit.md`
- `BLUEPRINTS/reports/2026-07-13_inbound-client-intake-suite-plan.md`
- `BLUEPRINTS/OVERLAPS.md`
