# Evermore Decision Log

Record only consequential decisions that a human approved. Append new decisions;
do not rewrite history.

## Template

### YYYY-MM-DD - Decision title

- **Status:** proposed | approved | reversed
- **Decision:** What was chosen?
- **Why:** What evidence or constraint drove it?
- **Consequences:** What changes now?
- **Evidence:** Links to reports, source files, or verified live proof
- **Owner:** Who owns the next move?

---

### 2026-06-21 - Build Agent Suite backend in an isolated release branch

- **Status:** approved
- **Decision:** Build the full Agent Suite backend in
  `codex/agent-suite-backend-v1` and keep production deploy, push, and cache
  purge approval-gated until local review passes.
- **Why:** The existing preview branch contained mixed local suite and backend
  work, while the full Agent Suite changes introduce a new D1 schema, API
  Worker, auth flow, and owner dashboard route.
- **Consequences:** Work can be tested locally without disturbing the prior
  suite preview or live site. The owner/team surface uses `/team` so the
  existing cockpit can keep `/dashboard`.
- **Evidence:** `BLUEPRINTS/reports/2026-06-21_agent-suite-backend-v1.md`
- **Owner:** Evermore operator

### 2026-06-20 - Manually deploy Pages to repair standalone calculator routes

- **Status:** approved
- **Decision:** Use Wrangler to manually deploy the tracked `main` tree to the
  Cloudflare Pages project `evermore-life`, then purge Cloudflare cache.
- **Why:** GitHub `main` contained the clean route files, but the live apex and
  Pages origin still returned 404 because the Pages project was serving a stale
  deployment.
- **Consequences:** `/score-tracker` and `/growth-calculator` now resolve live
  through the Pages origin behind the `evermore-life-live` Worker proxy.
  Cloudflare Pages Git auto-deploy behavior still needs later inspection.
- **Evidence:** `BLUEPRINTS/reports/2026-06-20_calculator-routes-live-repair.md`
- **Owner:** Evermore operator

### 2026-06-19 - Serve score tracker from a clean folder URL

- **Status:** approved
- **Decision:** Place the score tracker at `score-tracker/index.html` instead
  of serving `Score-Tracker.html` from the repository root. Place the growth
  calculator at `growth-calculator/index.html` instead of serving
  `Growth-Calculator.html` from the repository root.
- **Why:** The operator explicitly requested the clean URL
  `evermorelife.org/score-tracker` with no file extension, then requested the
  same move for the growth calculator.
- **Consequences:** Static hosting should serve both tools through folder index
  routes after the changes are pushed and production refreshes. Live route
  verification is still required before calling the URLs live.
- **Evidence:** `score-tracker/index.html`, `growth-calculator/index.html`,
  `BLUEPRINTS/reports/2026-06-19_score-tracker-clean-route.md`
- **Owner:** Evermore operator

### 2026-06-18 - Serve the in-depth recruiting page through the Worker KV bridge

- **Status:** approved
- **Decision:** Restore live `/recruiting` with the full in-depth recruiting
  page by saving the canonical page HTML in Cloudflare KV and routing the Worker
  through that KV value before falling back to the Pages origin.
- **Why:** The operator reported that the live recruiting page was not the long
  page previously built, while GitHub write access was still blocked and
  Cloudflare Worker access was available.
- **Consequences:** Live `/recruiting` now shows the full page again. The
  temporary maintenance endpoint used to load the KV value has been removed.
  GitHub/Pages still need to be reconciled through the clean release commit.
- **Evidence:** `BLUEPRINTS/reports/2026-06-18_recruiting-page-live-repair.md`
- **Owner:** Evermore operator

### 2026-06-18 - Replace expired GHL chat widget ID

- **Status:** approved
- **Decision:** Replace the expired LeadConnector chat widget ID
  `69f6e7fdcc1c6313dcd0f983` with `6a34718b718826e00221fc81` across website
  source, GHL paste-ready source, and the live Cloudflare Worker rewrite layer.
- **Why:** The operator provided the new widget embed code and requested that it
  replace the expired widget and go live.
- **Consequences:** Live `/` and `/chat` now serve the new widget ID. The old ID
  remains only in Worker source as the left side of a compatibility rewrite rule
  until the Pages origin is redeployed from GitHub.
- **Evidence:** `BLUEPRINTS/reports/2026-06-18_chat-widget-replacement.md`
- **Owner:** Evermore operator

### 2026-06-18 - Use a Cloudflare Worker hotfix while GitHub write access is blocked

- **Status:** approved
- **Decision:** Apply a targeted Cloudflare Worker hotfix for the public website
  after the operator connected Cloudflare and asked Codex to do the publish
  work.
- **Why:** Local GitHub credentials were unavailable and the connected GitHub
  integration returned `403 Resource not accessible by integration` for write
  operations, while Cloudflare API deployment was available.
- **Consequences:** Live pages now rewrite the old legal name at the edge,
  `/sarah` passes through the same rewrite, `/recruiting` and `/sitemap.xml`
  are served by the Worker, and state-page `noindex` is removed live. GitHub
  still needs a normal repository push so Cloudflare source and production stop
  depending on the hotfix bridge.
- **Evidence:** `BLUEPRINTS/reports/2026-06-18_website-live-publish-hotfix.md`
- **Owner:** Evermore operator

### 2026-06-18 - Use Evermore Life Insurance LLC as the website legal name

- **Status:** approved
- **Decision:** Public website, state-page, proxy/dashboard, and GHL
  website-copy surfaces should identify the company as
  `Evermore Life Insurance LLC`.
- **Why:** The operator stated the new LLC and articles are now under Evermore
  Life Insurance LLC.
- **Consequences:** Website metadata, visible copy, state-page copy,
  proxy/dashboard labels, policy/terms language, consent references, GHL
  paste-ready HTML, and GHL snippets should use the new legal entity name. Live
  deployment and live GHL updates remain approval-gated.
- **Evidence:** `BLUEPRINTS/reports/2026-06-18_website-legal-name-update.md`
- **Owner:** Evermore operator

### 2026-06-18 - Audit before publishing current website work

- **Status:** approved
- **Decision:** Before pushing the current website changes live, perform and
  preserve a local/live readiness audit that separates local done, live done,
  unknown, and blocked work.
- **Why:** The operator stated that Git and Cloudflare publish the site and
  asked for an audit because much of the current work is believed to be ready
  for live release.
- **Consequences:** Current website work should be released from an
  evidence-backed clean branch/worktree, not from an unverified dirty tree.
- **Evidence:** `BLUEPRINTS/reports/2026-06-18_live-readiness-audit.md`
- **Owner:** Evermore operator

## 2026-06-14 - Adopt Local-First Agent Cartography

- **Status:** approved
- **Decision:** Use `BLUEPRINTS/` as Evermore's durable cross-surface navigation,
  report, overlap, and decision layer.
- **Why:** Important intelligence must survive individual chats, models, and
  agents without creating a duplicate source of truth.
- **Consequences:** Meaningful mapping work ends with a local report; canonical
  files and live evidence remain authoritative.
- **Evidence:** `AGENTS.md`, `BLUEPRINTS/README.md`, `BLUEPRINTS/MAP.md`
- **Owner:** Evermore operator

## 2026-06-14 - Govern first-wave state pages from one status registry

- **Status:** approved
- **Decision:** Use `01_website/state-pages/data/states.json` as the governing
  state-page service-mode registry. Arizona and Texas are active; Arkansas is
  pending.
- **Why:** The human operator corrected the state status during the build, a
  Texas license artifact exists, and older website, GHL, Sarah, and campaign
  sources conflict with the correction.
- **Consequences:** Arizona and Texas receive active draft conversion pages.
  Arkansas receives an unindexed availability-update page with no quote,
  booking, phone, or active-nurture path. Live GHL, Sarah, and campaign rules
  must be corrected and verified before traffic.
- **Evidence:** `01_website/state-pages/data/states.json`,
  `STATE LICENSES/TEXAS INSURANCE LICENSE.pdf`,
  `02_ghl/launch_kit/STATE_SERVICE_GATE_UPDATE_HANDOFF.md`,
  `BLUEPRINTS/reports/2026-06-14_state-page-swarm-foundation.md`
- **Owner:** Evermore operator

### 2026-06-14 - Use Projects and Done as the broad cockpit completion layer

- **Status:** approved
- **Decision:** The local broad cockpit should keep generated Main state read
  only, track actionable completion in Projects, and move finished items into
  Done instead of leaving retired work in the active Main view.
- **Why:** The operator confirmed that older May 11, EDC, IRS-call, contracting,
  and old-LLC A2P items were already done or retired, but they remained visible
  because no completion layer was driving active-vs-done display.
- **Consequences:** The broad cockpit now exposes `Main`, `Projects`, and
  `Done`, and older handoffs must be overridden when operator-corrected state
  says a former blocker is no longer live.
- **Evidence:** `00_START_HERE/OPERATOR_STATE_UPDATE_2026-06-14.md`,
  `BLUEPRINTS/reports/2026-06-14_broad-cockpit-project-source-of-truth.md`
- **Owner:** Evermore operator

### 2026-06-15 - Activate Arkansas for review before live release

- **Status:** approved
- **Decision:** Move Arkansas from pending to active in the state-page registry
  now that Arkansas licensing has been obtained, but keep the release
  approval-gated behind a single local review link before production deploy.
- **Why:** The operator requested Arkansas activation in controlled build mode
  and explicitly asked for one review link first, with live release only after
  review approval.
- **Consequences:** Arkansas may render with active quote CTAs and the shared
  quote form in local generated output. The page remains `noindex, nofollow`
  and production deploy, sitemap/indexing, CRM workflow proof, campaign traffic,
  publishing, and spend remain approval-gated.
- **Evidence:** `01_website/state-pages/data/states.json`,
  `01_website/state-pages/public/arkansas/index.html`,
  `BLUEPRINTS/reports/2026-06-15_arkansas-activation-review.md`
- **Owner:** Evermore operator

### 2026-06-19 - Include Americo in carrier roster copy

- **Status:** approved
- **Decision:** Add Americo to Evermore carrier roster copy across the public
  website, state-page source/generated pages, and GHL paste-ready copy assets.
- **Why:** The operator confirmed Evermore was approved by Americo and asked to
  add Americo under the carriers Evermore works with across pages.
- **Consequences:** Future carrier-roster edits should update the active
  current pages, draft pages, state-page template/generated output, and GHL
  paste-ready assets together. Live publishing and live verification remain
  approval-gated.
- **Evidence:** `BLUEPRINTS/reports/2026-06-19_americo-carrier-copy-update.md`
- **Owner:** Evermore operator

### 2026-06-19 - Publish Americo carrier update live with Worker bridge

- **Status:** approved
- **Decision:** Push the queued website updates to GitHub `main` and deploy a
  Cloudflare Worker bridge so live pages show Americo immediately while Pages
  catches up to the latest source.
- **Why:** The operator requested that everything be made live because the
  Americo updates were not visible in production.
- **Consequences:** Live public pages now show Americo. The Worker contains a
  temporary Americo-specific rewrite that should be removed after Pages origin
  output reflects GitHub `main` directly.
- **Evidence:** `BLUEPRINTS/reports/2026-06-19_americo-live-publish.md`
- **Owner:** Evermore operator
