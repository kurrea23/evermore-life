# Cartographer Report: Project Organization Swarm

- **Date:** 2026-06-25
- **Agent or operator:** Codex swarm coordinator
- **Surface:** Whole-project operating map
- **Mission:** Organize the Evermore project into actionable lanes, blockers,
  ownership, and next moves without changing live systems.
- **Approval level used:** observe

## Executive Finding

The project is organized enough to execute, but action is being slowed by four
cross-surface truth conflicts: public website source of truth, state-service
gates, lead-path proof, and cockpit/task-state durability. The next useful move
is not more content or more pages; it is a controlled lead-path proof after GHL
form, consent, state gate, and thank-you tracking are reconciled.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Public routes are currently routed through the Worker and v2/static assets, while older docs still describe `01_website/current/` as live GHL truth. | `01_website/v2/cloudflare/evermore-live-proxy.js`, `01_website/CODEX_HANDOFF.md`, `BLUEPRINTS/MAP.md` | high |
| GHL is the critical lead-capture owner, but live CRM/workflow state remains unverified without authenticated account access. | `02_ghl/launch_kit/README.md`, `02_ghl/launch_kit/A2P_GAP_REPORT.md`, `02_ghl/launch_kit/GHL_WORKFLOW_COMPLETE_SPEC.md` | high |
| A2P is not ready for submission because the current local status is `HOLD pending EIN`. | `02_ghl/launch_kit/A2P_GAP_REPORT.md` | high |
| State-service truth conflicts across website, GHL workflow, and content/Meta activation docs. | `01_website/state-pages/data/states.json`, `02_ghl/launch_kit/STATE_SERVICE_GATE_UPDATE_HANDOFF.md`, `02_ghl/launch_kit/GHL_WORKFLOW_COMPLETE_SPEC.md`, `04_content_narrative/ad_campaign_scaffold/CONTENT_ACTIVATION_BOARD.md`, `04_content_narrative/ad_campaign_scaffold/META_ADS_MANAGER_HANDOFF.md` | high |
| Paid ads should remain held until the lead-to-appointment path and tracking are proven. | `00_START_HERE/ADS_LAUNCH_CONTROL.md`, `04_content_narrative/ad_campaign_scaffold/CONTENT_ACTIVATION_BOARD.md` | high |
| The cockpit schedule and task state have stale/durable-state gaps. | `00_START_HERE/COCKPIT_UPDATE_HANDOFF.md`, `04_tools/CODEX_HANDOFF.md`, `BLUEPRINTS/reports/2026-06-14_broad-cockpit-project-source-of-truth.md` | high |
| Current worktree contains pre-existing uncommitted edits in state-page and Blueprint files. | `git status --short` | high |

## Map

### Lane 1: Public Website And Routes

- **Canonical files:** `01_website/v2/cloudflare/evermore-live-proxy.js`,
  `01_website/v2/cloudflare/wrangler.live-proxy.jsonc`,
  `01_website/v2/pages/`, `01_website/current/`,
  `01_website/state-pages/`, `score-tracker/index.html`,
  `growth-calculator/index.html`.
- **Current action:** Decide and document which surface is the operational
  public-site source for each route: GHL mirror, Worker-served v2 page,
  generated state page, or standalone static tool.
- **Stop gate:** Do not call a page live or healthy without fresh live readback
  and, for forms, downstream CRM proof.

### Lane 2: GHL, A2P, And Lead Path

- **Canonical files:** `02_ghl/launch_kit/README.md`,
  `02_ghl/launch_kit/live-build-runbook.md`,
  `02_ghl/launch_kit/native-form-field-map.md`,
  `02_ghl/launch_kit/GHL_WORKFLOW_COMPLETE_SPEC.md`,
  `02_ghl/launch_kit/A2P_GAP_REPORT.md`,
  `02_ghl/launch_kit/a2p-registration-pack.md`.
- **Current action:** Fix account-side form links and consent copy, set one
  state gate, configure success behavior to `/thank-you` or equivalent Lead
  event, then run one controlled lead test.
- **Stop gate:** No SMS branches, A2P submission, or launch claim until EIN,
  Trust Center submission/approval proof, and live workflow proof exist.

### Lane 3: Content, Brand, Organic, And Paid

- **Canonical files:** `04_content_narrative/README.md`,
  `04_content_narrative/NARRATIVE_BIBLE.md`,
  `04_content_narrative/ad_campaign_scaffold/CONTENT_ACTIVATION_BOARD.md`,
  `00_START_HERE/ADS_LAUNCH_CONTROL.md`,
  `04_content_narrative/ad_campaign_scaffold/META_ADS_MANAGER_HANDOFF.md`,
  `04_content_narrative/META_ADS_UPLOAD_PACKAGE.md`.
- **Current action:** Keep paid ads on hold, resolve state targeting, rehydrate
  or regenerate missing video assets, and produce/review the first How It Works
  launch creative.
- **Stop gate:** No draft deletion, publishing, scheduling, uploading, or spend
  without explicit human approval.

### Lane 4: Cockpit, Automations, And Active Rooms

- **Canonical files:** `00_START_HERE/README.md`,
  `00_START_HERE/active/cockpit/EVERMORE_COCKPIT.html`,
  `00_START_HERE/COCKPIT_UPDATE_HANDOFF.md`,
  `00_START_HERE/active/rooms/A2P_REGISTRATION/`,
  `04_tools/cockpit_update/`, `04_tools/scripts/`.
- **Current action:** Reconcile stale schedule references and choose durable
  project-completion storage for automation-readable state.
- **Stop gate:** Do not deploy scripts, Workers, GHL changes, or SMS without
  explicit approval.

## Visual Evidence

None captured. This was a source-map and handoff survey.

## Unknown Or Unavailable

- Authenticated GHL CRM, workflow, contact, opportunity, and A2P Trust Center
  state were not verified.
- Cloudflare dashboard and Pages auto-deploy settings were not verified in this
  pass.
- Meta account live draft state, payment method, pixel test events, and
  Instagram/reel assets were not verified in the account.
- Browser-local cockpit Projects/Done state is not automation-readable from
  source files.
- Existing uncommitted state-page and Blueprint changes were not modified or
  validated as part of this swarm pass.

## Cross-Surface Overlaps

- Website route truth is split across Worker routing, v2 pages, current/GHL
  mirror docs, and generated state pages.
- State-service truth conflicts across state-page registry, GHL workflow docs,
  and campaign/Meta activation docs.
- Paid activation depends on GHL proof and Meta tracking, not only local content
  readiness.
- Cockpit schedule/task state conflicts can make daily operating instructions
  appear current while pointing to stale timing or non-durable browser state.

## Recommended Next Move

Run a narrow lead-path reconciliation sprint:

1. Confirm active states and write that state gate into GHL, content, and
   website docs.
2. Fix the live GHL form privacy/terms links and SMS consent wording.
3. Configure success redirect or reliable Lead event on `/thank-you`.
4. Run one controlled test lead and record page, form, CRM, notification,
   opportunity, task, email, and tracking proof.
5. Only after that proof, decide whether to resume organic publishing or A2P
   submission once EIN is available.

## Files Changed

- `BLUEPRINTS/reports/2026-06-25_project-organization-swarm.md`
- `BLUEPRINTS/OVERLAPS.md`
- `BLUEPRINTS/DECISIONS.md`
