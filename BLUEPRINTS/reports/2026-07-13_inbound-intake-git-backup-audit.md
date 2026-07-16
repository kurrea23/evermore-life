# Cartographer Report: Inbound Intake Git Backup And Test Audit

- **Date:** 2026-07-13
- **Agent or operator:** Codex
- **Surface:** Inbound Client Intake Sheet + current Git branch/worktree
- **Mission:** Make the approved update actively testable and define a clean GitHub backup that does not mix drifting work lanes
- **Approval level used:** execute for isolated branch, commit, push, and draft
  PR; no merge, deploy, or destructive cleanup

## Executive Finding

The Inbound Client Intake Sheet is locally testable, its focused checks pass,
and its approved lane is backed up on GitHub in draft PR #3.

The checkout is on `experiment/script-intake` at `c7b2df0`, one commit ahead of
`origin/main`. That commit contains only the original guided intake file, but
the branch does not exist on `origin`. The working tree then adds the approved
canonical version plus several unrelated Agent Suite, state-page, content, and
generated-output lanes. There are 23 tracked modified entries, 19 untracked
entries, and no staged files.

The safe GitHub backup was created from `origin/main` as the isolated branch
`codex/inbound-client-intake-sheet`. The original mixed checkout was not
switched, reset, cleaned, or bulk-staged. GitHub's remote readback confirms the
draft PR contains 14 files, all belonging to the inbound worksheet and its
required Blueprint/test documentation.

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
| Isolated validation passes without changing the backend | Inbound sheet 5/5 plus existing API suite 9/9, 14/14 total | high |
| The GitHub backup is open as a draft against `main` | `https://github.com/kurrea23/evermore-life/pull/3` | high |
| The remote PR contains only the 14 approved inbound-lane files | `gh pr view 3 --json files,commits` | high |

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

## Completed GitHub Backup

1. GitHub CLI was installed and authenticated as `kurrea23`.
2. Lane A was isolated from current `origin/main` in a separate worktree on
   `codex/inbound-client-intake-sheet`.
3. Only explicit inbound files and Blueprint hunks were committed; the mixed
   checkout was left intact.
4. The inbound sheet tests passed 5/5, the existing API suite passed 9/9, and
   whitespace validation passed.
5. The branch was pushed and draft PR #3 was opened against `main`.
6. GitHub's remote readback confirmed 14 files with no
   Agent Suite backend, state-page, creative, `outputs/`, or deploy files.

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

- Save/restore/delete were not automated because the active browser may contain
  private local client records; the checklist leaves those actions to the
  operator using clearly fake data.
- The current dirty non-Inbound lanes have not been approved for keep, discard,
  commit, or push.
- Draft PR #3 has not been merged, deployed, or represented as a live route.

## Cross-Surface Overlaps

The current checkout combines four product lanes and local generated outputs.
That drift must not be represented as one release or one GitHub backup.

## Recommended Next Move

Complete the manual checklist with fake data, review draft PR #3, and merge it
only after visual approval. Triage the remaining dirty lanes independently;
do not bulk-commit the original mixed checkout.

## Files Changed

- `04_tools/tests/inbound_client_intake_sheet_test.mjs`
- `BLUEPRINTS/reports/2026-07-13_inbound-intake-git-backup-audit.md`
- `BLUEPRINTS/reports/2026-07-13_inbound-client-intake-suite-plan.md`
- `BLUEPRINTS/OVERLAPS.md`
