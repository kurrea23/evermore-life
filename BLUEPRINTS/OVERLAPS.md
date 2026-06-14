# Evermore Cross-Surface Overlaps

This is the meeting table for cartographer agents. Add a finding here when it
affects more than one surface or reveals a useful connection that no single map
shows.

## Entry Template

### YYYY-MM-DD - Overlap title

- **Surfaces:** Surface A + Surface B
- **Finding:** What becomes visible only when the maps are compared?
- **Evidence:** Links to source files, reports, or live proof
- **Impact:** Why it matters
- **Next move:** Smallest useful action
- **Status:** open | decided | completed | unavailable

---

## 2026-06-14 - Repository readiness is not launch readiness

- **Surfaces:** Website and campaign files + live GHL and Meta systems
- **Finding:** Locally complete pages, workflows, and campaign assets do not
  prove that the public lead path works.
- **Evidence:** `SYSTEM_MAP.md`, `CODEX_MASTER_HANDOFF.md`
- **Impact:** Spending or traffic can begin before capture and follow-up are
  proven.
- **Next move:** Run and document one controlled end-to-end lead test.
- **Status:** open

## 2026-06-14 - State service status conflicts across website, GHL, Sarah, and ads

- **Surfaces:** State pages + GHL workflow + Sarah AI + Meta campaign handoffs
- **Finding:** The human operator confirmed Arizona and Texas as active and
  Arkansas as pending, while several older sources still accept Arkansas and
  stop Texas.
- **Evidence:** `01_website/state-pages/data/states.json`,
  `02_ghl/launch_kit/STATE_SERVICE_GATE_UPDATE_HANDOFF.md`,
  `02_ghl/launch_kit/GHL_WORKFLOW_COMPLETE_SPEC.md`,
  `04_content_narrative/GHL_SARAH_FULL_CONVERSATION_TREE.md`
- **Impact:** Sending Texas traffic before the live gate is corrected can reject
  valid inquiries; sending Arkansas traffic can enter a workflow that should be
  stopped.
- **Next move:** Apply and verify the revised live GHL gate, then align Sarah
  and campaign targeting before publishing or buying traffic.
- **Status:** open

## 2026-06-14 - Content production was disconnected from posting and paid activation

- **Surfaces:** Local video clips + campaign narrative + organic posting + Meta
  Ads
- **Finding:** Five complete vertical source-clip sets existed locally while
  the creative tracker still described much of the queue as briefed or prompt
  ready. The live Evermore Meta Content workspace had no organic drafts. No
  single operating source connected real asset state, a full posting queue, and
  the conditions for promoting a post into paid media.
- **Evidence:** `04_content_narrative/ad_campaign_scaffold/CONTENT_ACTIVATION_BOARD.md`,
  `04_content_narrative/ad_campaign_scaffold/activation_manifest.json`,
  `04_content_narrative/ad_campaign_scaffold/META_ORGANIC_CONTENT_BATCH_30DAY.md`,
  `BLUEPRINTS/reports/2026-06-14_content-activation-wiring.md`,
  `BLUEPRINTS/reports/2026-06-14_meta-organic-content-live-audit.md`
- **Impact:** Operators can spend time regenerating content that already exists
  or attempt paid setup before a final asset and verified lead path exist.
- **Next move:** Reopen the in-app Meta tab, load the prepared content as drafts,
  review and finish the rough-cut reels, then approve posts individually while
  keeping paid promotion on hold until the documented gates pass.
- **Status:** open

## 2026-06-14 - Local content batch is ready while Meta organic Drafts is empty

- **Surfaces:** Local content narrative + live Meta Business Suite organic
  content
- **Finding:** Meta Business Suite showed no organic drafts in the visible date
  range, while the repository now contains a complete 30-day paste-ready batch.
  The computer/browser connection closed before draft loading began.
- **Evidence:** `04_content_narrative/ad_campaign_scaffold/META_ORGANIC_CONTENT_BATCH_30DAY.md`,
  `04_content_narrative/ad_campaign_scaffold/META_CONTENT_LOADING_HANDOFF.md`,
  `BLUEPRINTS/reports/2026-06-14_meta-organic-content-loading.md`
- **Impact:** Content is no longer blocked by missing copy, but the live page
  remains empty until drafts are loaded and reviewed.
- **Next move:** Resume from the loading handoff and create copy-ready organic
  drafts; keep reels, publish, schedule, boosts, ads, and spend approval-gated.
- **Status:** open

## 2026-06-14 - Local-first active-room links can block GitHub Pages packaging

- **Surfaces:** Local-first navigation + GitHub Pages deployment
- **Finding:** Eight tracked A2P room symlinks pointed one directory too shallow.
  The links were broken in a clean checkout, so the built-in Pages workflow
  failed while packaging the repository and skipped deployment.
- **Evidence:** `BLUEPRINTS/reports/2026-06-14_github-pages-deployment-repair.md`,
  GitHub Actions run `27457145875`
- **Impact:** A local navigation-link error can prevent an otherwise unrelated
  public-site release.
- **Next move:** Keep the active-room link check in the Pages repair workflow
  evidence and verify tracked links before future public releases.
- **Status:** completed

## 2026-06-14 - Inbox lead flow is ahead of CRM proof and state-gate alignment

- **Surfaces:** Gmail lead and carrier traffic + licensing admin + HighLevel +
  launch-state governance
- **Finding:** Fresh GOAT leads, Integrity lead delivery, carrier approval, and
  Texas licensing receipts all arrived in Gmail, but HighLevel was unavailable
  and current launch/state sources still conflict, so inbox activity is moving
  faster than live CRM proof.
- **Evidence:** `BLUEPRINTS/reports/2026-06-14_dual-cockpit-morning-update.md`,
  `00_START_HERE/GUIDES_00_03_COMPLETION_HANDOFF.md`,
  `BLUEPRINTS/DECISIONS.md`
- **Impact:** Operators can overstate appointment confirmation, CRM ingestion,
  or Texas launch readiness from email evidence alone.
- **Next move:** Restore or verify HighLevel access, run one controlled lead
  test, and reconcile Texas and Arkansas routing rules before routing or
  spending against new lead inventory.
- **Status:** open

## 2026-06-14 - Broad cockpit generation drifted from project completion state

- **Surfaces:** Local broad cockpit HTML + cockpit writer + operator handoffs
- **Finding:** The broad cockpit writer was refreshing only one generated block
  inside a much older static May cockpit, so stale EDC, IRS, A2P, and
  contracting content survived under a current date stamp. The operator also
  confirmed that completed work needs a project-completion layer instead of
  staying in Main as fake active blockers.
- **Evidence:** `BLUEPRINTS/reports/2026-06-14_broad-cockpit-project-source-of-truth.md`,
  `00_START_HERE/OPERATOR_STATE_UPDATE_2026-06-14.md`
- **Impact:** The local cockpit can look current while still communicating
  materially false work priorities.
- **Next move:** Keep Main generated and read-only, use Projects and Done for
  local completion flow, and choose a durable shared project-state store if
  future automations must read those completions.
- **Status:** open
