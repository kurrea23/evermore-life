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

### 2026-07-01 - A2P approval changes the GHL and paid-traffic gates

- **Surfaces:** GHL Trust Center + GHL workflow + active A2P room + ads launch
  control + cockpit/Blueprints
- **Finding:** The operator confirmed A2P approval and textability, so the old
  A2P/EIN hold is no longer the blocker. The blocker moves to safe activation:
  recorded SMS consent, opt-out/DND checks, approved-use-case SMS copy, and an
  owned-number STOP/START workflow test.
- **Evidence:** `BLUEPRINTS/reports/2026-07-01_a2p-approval-textability-update.md`,
  `02_ghl/launch_kit/A2P_GAP_REPORT.md`,
  `00_START_HERE/active/rooms/A2P_REGISTRATION/YOU_DO_THIS.md`,
  `00_START_HERE/ADS_LAUNCH_CONTROL.md`
- **Impact:** SMS nurture can become part of the revenue path, but paid traffic
  should still wait until the full opt-in -> CRM -> workflow -> tracking ->
  consent-gated SMS path is proven.
- **Next move:** Enable only consent-gated workflow SMS, test checked and
  unchecked consent with an owned number, verify STOP/START, then record
  non-secret results in the launch kit.
- **Status:** open

### 2026-06-27 - Sarah final-expense route connects page, Worker, and lead path

- **Surfaces:** Public website + Cloudflare Worker + Sarah/GHL lead path +
  Meta Pixel
- **Finding:** The live `/sarah` route now serves the copied
  `sarah-final-expense.html` asset through the Worker, while the embedded
  widget still depends on a future confirmed GHL webhook/calendar connection
  for end-to-end lead capture.
- **Evidence:** `BLUEPRINTS/reports/2026-06-27_sarah-final-expense-live-route.md`,
  `01_website/experiments/sarah-final-expense.html`,
  `01_website/v2/cloudflare/evermore-live-proxy.js`
- **Impact:** The public landing page is live, but traffic/spend decisions
  still need a controlled lead-path test so Meta, Sarah, GHL, consent, and
  follow-up are proven together.
- **Next move:** Confirm the widget destination and run one approved test lead
  through `/sarah`.
- **Status:** open

### 2026-06-27 - Website and app surfaces need separate patch lanes

- **Surfaces:** Public website + state pages + Agent Suite tools + backend +
  Cloudflare routing
- **Finding:** The stable public website base, generated state pages, private
  Agent Suite/tools, app backend, and live proxy infrastructure are currently
  close enough in the repository that patches can accidentally cross ownership
  boundaries.
- **Evidence:** `BLUEPRINTS/reports/2026-06-27_website-app-partition.md`,
  `01_website/v2/`, `01_website/state-pages/`, `agent-suite-auth.js`,
  `login/index.html`, `score-tracker/index.html`,
  `01_website/agent-suite-api/cloudflare/`,
  `01_website/v2/cloudflare/evermore-live-proxy.js`
- **Impact:** A website patch can break private tools, or an app/backend patch
  can disturb the always-on public site, especially when the shared Worker is
  changed.
- **Next move:** Create clean website and app worktrees/branches after dirty
  tree review, then treat the live proxy as a dual-review shared surface.
- **Status:** open

### 2026-06-27 - Clickable map turns route checks into an operator workflow

- **Surfaces:** Public website + app/tools + lead path + content/cockpit +
  Blueprint navigation
- **Finding:** A local clickable map now groups live URLs beside source files
  so route health can be checked without confusing website, app, and shared
  infrastructure ownership.
- **Evidence:** `BLUEPRINTS/CLICKABLE_SYSTEM_MAP.html`,
  `BLUEPRINTS/reports/2026-06-27_clickable-system-map.md`
- **Impact:** The operator can click through current surfaces and record manual
  pass/fail state before authorizing patches or deploys.
- **Next move:** Use the map as the first stop before creating website/app
  patch worktrees.
- **Status:** open

### 2026-06-21 - Owner dashboard route renamed to avoid cockpit dashboard

- **Surfaces:** Agent Suite backend + existing Cloudflare apex Worker + cockpit
- **Finding:** The Agent Suite branch originally added `dashboard/index.html`
  for owner production visibility, while the live `evermore-life-live` Worker
  already handles `/dashboard` as the private Evermore cockpit. The Agent Suite
  owner surface is now `team/index.html` for `/team`.
- **Evidence:** `team/index.html`,
  `01_website/v2/cloudflare/evermore-live-proxy.js`,
  `BLUEPRINTS/reports/2026-06-21_agent-suite-backend-v1.md`
- **Impact:** `/dashboard` can remain the cockpit, and `/team` can serve the
  Agent Suite owner/team view without route collision.
- **Next move:** Build future owner/team functionality under `/team`, not
  `/dashboard`.
- **Status:** completed

### 2026-06-21 - Agent Suite release needs API, D1, static pages, and cache alignment

- **Surfaces:** Static pages + Cloudflare Worker + D1 + Cloudflare Pages
- **Finding:** The static pages now depend on `https://api.evermorelife.org/api`
  for login and data sync, so publishing only the pages or only the Worker will
  leave the suite unusable.
- **Evidence:** `agent-suite-auth.js`,
  `01_website/agent-suite-api/cloudflare/wrangler.agent-suite-api.jsonc`,
  `BLUEPRINTS/reports/2026-06-21_agent-suite-backend-v1.md`
- **Impact:** Live release requires ordered setup: D1 create/bind, migration,
  Worker deploy, then static route deploy and cache purge.
- **Next move:** Keep future CRM/client work aligned to the deployed API route
  and D1 schema.
- **Status:** completed

### 2026-06-21 - Cloudflare PBKDF2 limits affect Agent Suite auth

- **Surfaces:** Cloudflare Worker + Agent Suite authentication + D1 users table
- **Finding:** Cloudflare Workers SubtleCrypto rejected PBKDF2 hashes above
  100000 iterations in the live signup path, even though the code was otherwise
  valid and the D1 migration was complete.
- **Evidence:** `01_website/agent-suite-api/cloudflare/worker.js`,
  `BLUEPRINTS/reports/2026-06-21_agent-suite-backend-v1.md`
- **Impact:** Password-hashing parameters must be chosen inside the Worker
  runtime limits or signup fails before any user row is created.
- **Next move:** Preserve the stored hash format with explicit iteration counts
  if future auth migrations change hashing settings.
- **Status:** completed

### 2026-06-19 - Standalone calculator routes depend on source and static host alignment

- **Surfaces:** Public website source + GitHub + static host route handling
- **Finding:** The score tracker and growth calculator are now packaged as
  folder indexes so the intended public URLs can be `/score-tracker` and
  `/growth-calculator`, but live availability still depends on the host serving
  folder indexes after the commits reach `origin/main`.
- **Evidence:** `score-tracker/index.html`, `growth-calculator/index.html`,
  `BLUEPRINTS/reports/2026-06-19_score-tracker-clean-route.md`
- **Impact:** The repo can contain the correct clean URL structure while the
  live route remains unavailable if Pages/Cloudflare has not refreshed or does
  not route the folder index as expected.
- **Next move:** Later, inspect why Cloudflare Pages did not auto-deploy from
  GitHub `main`.
- **Status:** completed

### 2026-06-18 - Recruiting page can drift between source, KV, and Pages

- **Surfaces:** Website source + Cloudflare Worker + Cloudflare KV +
  Cloudflare Pages + GitHub
- **Finding:** The full recruiting page source existed locally, but production
  was serving a shorter fallback until the Worker was repaired to serve the
  saved in-depth page from KV.
- **Evidence:** `BLUEPRINTS/reports/2026-06-18_recruiting-page-live-repair.md`,
  `01_website/v2/pages/recruiting.html`,
  `01_website/v2/cloudflare/evermore-live-proxy.js`
- **Impact:** A future deploy from a stale Worker or Pages origin can make a
  finished source page appear lost or incomplete on the live site.
- **Next move:** Push the clean release commit to GitHub, then verify Pages and
  Worker output both serve the in-depth recruiting page.
- **Status:** open

### 2026-06-18 - Chat widget embeds must align across source, GHL, and Worker

- **Surfaces:** Public website source + GHL paste-ready snippet + Cloudflare
  Worker
- **Finding:** The chat widget appears in both website HTML and GHL paste-ready
  code, while live traffic may still be served from an older Pages origin unless
  the Worker rewrites the widget ID.
- **Evidence:** `BLUEPRINTS/reports/2026-06-18_chat-widget-replacement.md`
- **Impact:** Updating only the GHL snippet or only the repo can leave live
  visitors on an expired widget.
- **Next move:** After GitHub write access is restored, push the clean release
  source and verify that the Worker rewrite is no longer the only thing keeping
  live pages current.
- **Status:** open

### 2026-06-18 - Cloudflare production is fixed ahead of GitHub source

- **Surfaces:** GitHub repository + local clean clone + Cloudflare Worker +
  Cloudflare Pages
- **Finding:** Cloudflare production now serves the legal-name and route fixes,
  but GitHub remote `main` is still behind because both local Git credentials
  and the connected GitHub integration could not write.
- **Evidence:** `BLUEPRINTS/reports/2026-06-18_website-live-publish-hotfix.md`
- **Impact:** Future deploys from GitHub can overwrite the Worker hotfix unless
  the clean release commit is pushed and deployed through the normal path.
- **Next move:** Restore GitHub write auth, push the clean release commit, and
  redeploy or reconcile the Worker so production no longer depends on an
  API-only patch.
- **Status:** open

## 2026-06-18 - Legal name must stay aligned across website and GHL copy

- **Surfaces:** Public website + state pages + website proxy + GHL paste-ready
  copies + policy/consent copy
- **Finding:** The approved legal entity name is now Evermore Life Insurance
  LLC, so website source, state pages, proxy/dashboard strings, GHL paste-ready
  HTML, snippets, metadata, forms, and policy pages need to move together.
- **Evidence:** `01_website/current/`, `01_website/v2/pages/`,
  `01_website/v2/shared/`, `01_website/v2/cloudflare/evermore-live-proxy.js`,
  `01_website/state-pages/`, `02_ghl/launch_kit/snippets/`,
  `02_ghl/launch_kit/paste-ready/`,
  `BLUEPRINTS/reports/2026-06-18_website-legal-name-update.md`
- **Impact:** Updating only one surface can reintroduce old legal-name copy
  when GHL pages are pasted, regenerated, or reviewed.
- **Next move:** After deploy or GHL paste updates, verify live website pages
  and GHL forms display the approved legal name.
- **Status:** open

## 2026-06-18 - Local readiness is blocked by Git and live-route drift

- **Surfaces:** Local repository + Cloudflare Worker + Cloudflare Pages +
  website compliance
- **Finding:** The live domain is on the Cloudflare Worker/Pages proxy, but
  local source and live production have drifted. Local source has newer legal
  names and active state-page drafts, while live pages still show old names,
  `/recruiting` is 404, `/sarah` is served from an older experiment asset, and
  the local Git object/index state is not release-clean.
- **Evidence:** `BLUEPRINTS/reports/2026-06-18_live-readiness-audit.md`,
  `01_website/v2/cloudflare/evermore-live-proxy.js`,
  `HANDOFF_recruiting_deploy.md`
- **Impact:** A normal commit/push from the current tree could either fail or
  ship the wrong mix of local, untracked, and unrelated changes.
- **Next move:** Publish only from a clean release branch/worktree after
  choosing whether the prepared `recruiting-arkansas-live` branch or a new
  legal-name/Sarah fix branch is the release vehicle.
- **Status:** open

## 2026-06-14 - Repository readiness is not launch readiness

- **Surfaces:** Website and campaign files + live GHL and Meta systems
- **Finding:** Locally complete pages, workflows, and campaign assets do not
  prove that the public lead path works.
- **Evidence:** `SYSTEM_MAP.md`, `CODEX_MASTER_HANDOFF.md`
- **Impact:** Spending or traffic can begin before capture and follow-up are
  proven.
- **Next move:** Run and document one controlled end-to-end lead test.
- **Status:** open

## 2026-06-15 - Recruiting page route is ready before its calendar destination

- **Surfaces:** Public website routing + recruiting operations + calendar
- **Finding:** The repository now has a private, noindex recruiting page and a
  staged `/recruiting` proxy mapping, while every booking CTA intentionally
  remains pointed at `#TODO-recruiting-calendar-link`.
- **Evidence:** `01_website/v2/pages/recruiting.html`,
  `01_website/v2/cloudflare/evermore-live-proxy.js`,
  `BLUEPRINTS/reports/2026-06-15_recruiting-page-build.md`
- **Impact:** The page can be reviewed without inventing or exposing an
  unapproved recruiting calendar, but it is not ready for traffic or publishing.
- **Next move:** Approve the page and a recruiting-specific calendar
  destination, replace the placeholder, then approve and verify deployment.
- **Status:** open

## 2026-06-15 - Arkansas state-page activation needs downstream live-route proof

- **Surfaces:** State pages + GHL workflow + Sarah AI + Meta campaign handoffs
  + analytics
- **Finding:** Arkansas is now active in the local state-page registry and
  generated review page, but the public route, GHL follow-through, Sarah/nurture
  routing, campaign targeting, and conversion tracking were not deployed or
  verified in this local review build.
- **Evidence:** `01_website/state-pages/data/states.json`,
  `01_website/state-pages/public/arkansas/index.html`,
  `BLUEPRINTS/reports/2026-06-15_arkansas-activation-review.md`
- **Impact:** The page can be reviewed as an active Arkansas draft, but Arkansas
  should not be called live or receive paid traffic until the downstream intake
  and tracking path is verified.
- **Next move:** After human review approval, deploy the Arkansas route and run
  one end-to-end live verification across page, form, CRM/workflow, and
  tracking before changing indexing or campaign traffic.
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

## 2026-06-14 - Local content batch reached Meta organic Drafts

- **Surfaces:** Local content narrative + live Meta Business Suite organic
  content
- **Finding:** Meta Business Suite showed no organic drafts at the start. The
  repository now contains a complete 30-day paste-ready batch, and all 25
  copy-ready text posts are saved as Facebook drafts. Meta's delayed grid
  refresh caused duplicate draft copies for Days 12, 13, and 14.
- **Evidence:** `04_content_narrative/ad_campaign_scaffold/META_ORGANIC_CONTENT_BATCH_30DAY.md`,
  `04_content_narrative/ad_campaign_scaffold/META_CONTENT_LOADING_HANDOFF.md`,
  `BLUEPRINTS/reports/2026-06-14_meta-organic-content-loading.md`
- **Impact:** Content is no longer blocked by missing copy or an empty Facebook
  Drafts queue. Instagram and reels remain blocked by approved media, and the
  duplicate drafts require deliberate cleanup.
- **Next move:** Review Facebook drafts, approve deletion of duplicate copies,
  and finish approved media; keep publish, schedule, boosts, ads, and spend
  approval-gated.
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

## 2026-06-19 - Carrier roster copy spans website, state pages, and GHL paste-ready assets

- **Surfaces:** Public website + state pages + GHL launch-kit copy
- **Finding:** Operator confirmed Evermore was approved by Americo, so Americo
  needed to be added consistently across the active public pages, v2 and
  retirement draft pages, generated state pages, state-page template, older
  experiment copy, and GHL paste-ready copy.
- **Evidence:** `BLUEPRINTS/reports/2026-06-19_americo-carrier-copy-update.md`,
  `01_website/current/index.html`, `01_website/current/optin.html`,
  `01_website/state-pages/templates/state-page.html`,
  `02_ghl/launch_kit/paste-ready/ghl-copy-station.html`
- **Impact:** A carrier approval can become inconsistent if only the visible
  site page is edited while generated pages or GHL paste-ready assets keep the
  old roster.
- **Next move:** After approved publish, verify the live public pages show
  Americo anywhere carrier rosters are displayed.
- **Status:** open

## 2026-06-19 - Worker bridge is masking stale Pages output for Americo

- **Surfaces:** GitHub main + Cloudflare Pages + Cloudflare Worker
- **Finding:** GitHub `main` contains the Americo source update, but the live
  Pages output initially remained on the previous Corebridge-only build. The
  Worker now rewrites stale carrier copy to include Americo and seven-carrier
  counts while Pages catches up.
- **Evidence:** `BLUEPRINTS/reports/2026-06-19_americo-live-publish.md`,
  `01_website/v2/cloudflare/evermore-live-proxy.js`
- **Impact:** Visitors see the correct carrier roster now, but production has a
  temporary edge bridge that should not become permanent source drift.
- **Next move:** Recheck Pages after the build settles, then remove the
  Americo-specific Worker rewrite once origin output is current.
- **Status:** open

## 2026-06-25 - Arizona main page spans generated state source, Pages origin, and Worker routing

- **Surfaces:** State-page generator + Cloudflare Pages + Cloudflare Worker
- **Finding:** The Arizona page at the Pages origin path is the same surface
  mapped to the clean `evermorelife.org/arizona/` route, so source edits must
  land in the state-page template/data/CSS and then be regenerated.
- **Evidence:** `BLUEPRINTS/reports/2026-06-25_arizona-main-page-source-update.md`,
  `01_website/state-pages/templates/state-page.html`,
  `01_website/v2/cloudflare/evermore-live-proxy.js`
- **Impact:** Hand-editing generated Arizona HTML or only checking the Pages
  path can create drift between source, origin, and the public clean route.
- **Next move:** After any approved Arizona publish, verify both the Pages
  origin URL and `https://evermorelife.org/arizona/`.
- **Status:** open

## 2026-06-25 - Project actionability depends on reconciling source truth before launch work

- **Surfaces:** Public website + GHL lead path + content activation + cockpit
- **Finding:** The repo has enough source material to execute, but the current
  operating blockers are cross-surface truth conflicts: public route source,
  active-state gate, lead-path proof, and durable cockpit task state.
- **Evidence:** `BLUEPRINTS/reports/2026-06-25_project-organization-swarm.md`,
  `01_website/v2/cloudflare/evermore-live-proxy.js`,
  `02_ghl/launch_kit/A2P_GAP_REPORT.md`,
  `04_content_narrative/ad_campaign_scaffold/CONTENT_ACTIVATION_BOARD.md`,
  `00_START_HERE/COCKPIT_UPDATE_HANDOFF.md`
- **Impact:** More pages, ads, or content can increase drift unless the lead
  path and state gate are made consistent first.
- **Next move:** Run a focused lead-path reconciliation sprint before publishing,
  SMS, A2P submission, or paid spend.
- **Status:** open

## 2026-06-25 - Active-state contract conflicts across website, GHL, and Meta content

- **Surfaces:** State pages + GHL workflow + Meta/content activation
- **Finding:** `states.json` marks Arizona, Texas, and Arkansas active, while
  GHL and content launch docs disagree about whether Texas or Arkansas is the
  pending state.
- **Evidence:** `BLUEPRINTS/reports/2026-06-25_project-organization-swarm.md`,
  `01_website/state-pages/data/states.json`,
  `02_ghl/launch_kit/STATE_SERVICE_GATE_UPDATE_HANDOFF.md`,
  `02_ghl/launch_kit/GHL_WORKFLOW_COMPLETE_SPEC.md`,
  `04_content_narrative/ad_campaign_scaffold/META_ADS_MANAGER_HANDOFF.md`
- **Impact:** A wrong state gate can reject valid leads, accept unready leads,
  or target ads to states that downstream workflows do not handle correctly.
- **Next move:** Human-confirm the active-state contract, then update website,
  GHL workflow docs, and campaign targeting together.
- **Status:** open

## 2026-06-25 - Paid activation is blocked by lead-path and tracking proof

- **Surfaces:** Content activation + GHL workflow + Meta Pixel + public opt-in
- **Finding:** Local content and drafts exist, but paid launch remains blocked
  until `/optin`, form success, CRM/workflow receipt, `/thank-you` tracking, and
  state targeting are proven end to end.
- **Evidence:** `BLUEPRINTS/reports/2026-06-25_project-organization-swarm.md`,
  `00_START_HERE/ADS_LAUNCH_CONTROL.md`,
  `04_content_narrative/ad_campaign_scaffold/CONTENT_ACTIVATION_BOARD.md`,
  `02_ghl/launch_kit/A2P_GAP_REPORT.md`
- **Impact:** Spend can start before capture, compliance, and follow-up are
  actually working.
- **Next move:** Keep paid ads on hold and run one controlled live lead test
  after GHL form cleanup.
- **Status:** open

## 2026-06-25 - State-page mobile fixes must land in shared generated source

- **Surfaces:** State-page template/CSS + generated Arizona/Texas/Arkansas pages
- **Finding:** Mobile horizontal overflow on the state pages came from shared
  layout CSS, not state-specific copy. The header CTA and trust bar affected all
  generated active state pages.
- **Evidence:** `BLUEPRINTS/reports/2026-06-25_state-pages-mobile-overpass.md`,
  `01_website/state-pages/assets/state-pages.css`,
  `01_website/state-pages/public/assets/state-pages.css`
- **Impact:** Hand-editing generated per-state HTML would create drift and miss
  the common source of the mobile bug.
- **Next move:** Keep mobile/layout fixes in `assets/state-pages.css`, then run
  `python3 01_website/state-pages/scripts/build_state_pages.py` before review.
- **Status:** open

## 2026-06-27 - Live homepage is reachable but lead-path proof is still separate

- **Surfaces:** Public website + Cloudflare Pages proxy + GHL lead path
- **Finding:** `https://evermorelife.org/`, `/optin`, `/privacy`, and the nav
  logo asset returned live `HTTP/2 200` responses through the Cloudflare Pages
  proxy, but this only proves route availability, not lead capture or workflow
  health.
- **Evidence:** `BLUEPRINTS/reports/2026-06-27_evermorelife-org-live-visual-check.md`
- **Impact:** The site can be shown to prospects, but paid activation and
  funnel-health claims still depend on an approved controlled lead test through
  `/optin`, CRM receipt, workflow firing, and tracking verification.
- **Next move:** Capture a browser screenshot when browser tooling is
  available, then run one approved end-to-end lead-path test.
- **Status:** open

## 2026-06-27 - GitHub Pages CI status is not full live-system proof

- **Surfaces:** GitHub Actions + GitHub Pages + Cloudflare Worker + lead path
- **Finding:** The latest visible GitHub Pages deployment run succeeded and no
  open PRs were available for CI inspection, but Pages CI only proves the Pages
  build/deploy surface. It does not prove Worker route behavior, public readback,
  GHL lead capture, CRM workflow execution, or tracking.
- **Evidence:** `BLUEPRINTS/reports/2026-06-27_github-actions-ci-check.md`
- **Impact:** Operators should not treat a green Pages deployment as proof that
  the public funnel or paid-traffic path is healthy end to end.
- **Next move:** When repairing a specific CI incident, provide a PR or Actions
  run URL; when validating launch readiness, run separate live route and
  lead-path checks.
- **Status:** open

## 2026-06-30 - Live page health and embedded 404 noise are separate checks

- **Surfaces:** Public website + Sarah route + dashboard Worker auth + app/tool pages
- **Finding:** The known public, state, app/tool, sitemap, robots, and dashboard
  entry routes returned live `200` responses, but the `/sarah` page still links
  to `/current/optin.html`, `/current/privacy.html`, and
  `/current/terms.html`, which return 404. Dashboard login form actions also
  return 404 on direct GET even though the Worker implements POST handlers.
- **Evidence:** `BLUEPRINTS/reports/2026-06-30_website-health-check.md`,
  `01_website/experiments/sarah-final-expense.html`,
  `01_website/v2/cloudflare/evermore-live-proxy.js`
- **Impact:** Operators can see scattered 404s in crawlers or browser tooling
  while the main page URLs still appear healthy, creating confusion about
  whether the site itself is down.
- **Next move:** Patch the Sarah links to canonical clean routes and decide
  whether dashboard login GET routes should redirect to the parent login
  screens.
- **Status:** open

## 2026-07-01 - Unified Worker deploys must preserve intake and public routes together

- **Surfaces:** Client intake PWA + Cloudflare Worker + state pages + Sarah +
  recruiting + dashboards
- **Finding:** `/intake` broke because the active Worker no longer contained
  the intake route/PWA handlers even though newer public route work was present.
  The repair forward-ported intake handling into the current Worker instead of
  redeploying the older intake branch.
- **Evidence:** `BLUEPRINTS/reports/2026-07-01_intake-route-restore.md`,
  `01_website/v2/cloudflare/evermore-live-proxy.js`,
  `01_website/experiments/Client-Intake.html`
- **Impact:** Any Worker deploy from a partial branch can silently drop another
  live route. The blast radius includes intake, state pages, Sarah, recruiting,
  dashboard, and bundled app assets.
- **Next move:** Require a shared Worker route sweep before every deploy:
  `/intake`, `/intake.webmanifest`, `/intake-sw.js`, state pages, `/sarah`,
  `/recruiting`, `/dashboard`, and `/dashboard-preview`.
- **Status:** open

## 2026-07-01 - Dirty git tree mixes deployed source, docs, state pages, and app work

- **Surfaces:** Git hygiene + Cloudflare Worker + Blueprint memory + GHL docs +
  state pages + Agent Suite
- **Finding:** The local `main` checkout is behind `origin/main` by one commit
  and contains no staged changes, but it has 28 modified tracked files and 23
  untracked files spanning several unrelated lanes. The already-deployed
  `/intake` restore is mixed with A2P docs, Blueprint reports, state-page
  generated output, and campaign concepts.
- **Evidence:** `BLUEPRINTS/reports/2026-07-01_git-branch-cleanup-handoff.md`,
  `HANDOFF_CLAUDE_FABLE_5_GIT_CLEANUP.md`
- **Impact:** A bulk commit or reset could either lose live Worker source
  parity or sweep unrelated docs/content/state-page changes into the same
  release.
- **Next move:** Preserve the dirty checkout on a safety branch, then stage
  explicit path groups by lane. Commit the Worker/intake source parity first.
- **Status:** open
