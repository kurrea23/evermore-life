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
- **Next move:** Verify `/team` after static deploy.
- **Status:** decided

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
- **Next move:** Run the release checklist only after local review and explicit
  deploy approval.
- **Status:** open

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
