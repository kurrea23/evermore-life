# Cartographer Report: Website And App Partition

- **Date:** 2026-06-27
- **Agent or operator:** Codex with Everist website agent and Bob the Builder app agent
- **Surface:** Website, Agent Suite app, tools, and shared Cloudflare routing
- **Mission:** Separate the always-on public website base from app/tool surfaces so future patches can be built on clones and promoted only after review.
- **Approval level used:** draft

## Executive Finding

The repository currently mixes four different surfaces in one deployable tree:
the public website, generated state pages, private Agent Suite/tools, and
Cloudflare routing infrastructure. The safest operating split is not to move
files immediately from the dirty main checkout, but to freeze an explicit
ownership boundary first: website patches should target the website base, app
patches should target the Agent Suite/tool base, and the live proxy should be
treated as shared infrastructure requiring extra review.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| The public website base is primarily `01_website/v2/` plus generated state-page source/output. | `01_website/v2/README.md`, `01_website/v2/pages/`, `01_website/v2/shared/`, `01_website/v2/assets/`, `01_website/state-pages/README.md` | high |
| The root tool/app folders are separate from the public website base. | `login/index.html`, `signup/index.html`, `team/index.html`, `clients/index.html`, `score-tracker/index.html`, `growth-calculator/index.html`, `agent-suite-auth.js` | high |
| The Agent Suite backend is a separate private Worker/D1 surface. | `01_website/agent-suite-api/cloudflare/worker.js`, `01_website/agent-suite-api/cloudflare/wrangler.agent-suite-api.jsonc` | high |
| The live public Worker currently blurs website, app, cockpit, and experiment concerns. | `01_website/v2/cloudflare/evermore-live-proxy.js`, `01_website/v2/cloudflare/wrangler.live-proxy.jsonc` | high |
| This checkout is already dirty, so branch or deploy work should not start by sweeping the whole tree. | `git status --short --branch` showed modified state-page, Worker, Blueprint, and handoff files before this report was written. | high |
| Live route health was not verified in this pass. | No live curl/browser proof was collected for this report. | high |

## Map

### Stable Website Base

Owned by the website agent. This base should be treated as the always-on public
site source. It should receive small patches on cloned branches/worktrees, then
be promoted only after local and live verification.

- `01_website/v2/pages/`
- `01_website/v2/shared/`
- `01_website/v2/assets/`
- `01_website/v2/robots.txt`
- `01_website/v2/sitemap.xml`
- `01_website/state-pages/data/states.json`
- `01_website/state-pages/templates/state-page.html`
- `01_website/state-pages/assets/state-pages.css`
- `01_website/state-pages/scripts/build_state_pages.py`
- `01_website/state-pages/public/`

### Current/GHL Mirror

This is still documented as the active GHL-facing five-page set and should not
be confused with the Worker-routed `v2` public source without a reconciliation
task.

- `01_website/current/`
- `00_START_HERE/active/now/`

### App And Tool Base

Owned by the app agent. These pages are private suite or tool surfaces, not the
marketing website base.

- `agent-suite-auth.js`
- `login/index.html`
- `signup/index.html`
- `team/index.html`
- `clients/index.html`
- `score-tracker/index.html`
- `growth-calculator/index.html`

### App Backend Base

Owned by the app agent. This should be patched and deployed independently from
the public website unless a route or auth change explicitly crosses the
boundary.

- `01_website/agent-suite-api/cloudflare/worker.js`
- `01_website/agent-suite-api/cloudflare/wrangler.agent-suite-api.jsonc`
- `01_website/agent-suite-api/cloudflare/migrations/`

### Shared Infrastructure Bridge

This is the high-risk shared layer. It currently routes public pages and also
touches private/dashboard/experiment behavior. Patches here should require both
website and app review.

- `01_website/v2/cloudflare/evermore-live-proxy.js`
- `01_website/v2/cloudflare/wrangler.live-proxy.jsonc`
- root static-host compatibility files such as `CNAME`, `.nojekyll`,
  `robots.txt`, and `sitemap.xml`

### Experimental Or Private Ops Surface

These files may be useful, but they should not be part of the always-on website
base.

- `01_website/experiments/`
- `internal_app/`
- `cockpit-os/`
- `04_tools/`

## Visual Evidence

No screenshots or diagrams were created. This was a file and ownership survey.

## Unknown Or Unavailable

- Live `evermorelife.org` route health was not verified.
- No `suite/` directory was found in this checkout.
- No `Client-Intake.html`, `intake.webmanifest`, `intake-sw.js`, or
  `intake-icon.svg` were found in this checkout.
- The current checkout has pre-existing modified and untracked files. This
  report did not classify those changes for commit.
- `01_website/current/` and `01_website/v2/` still represent competing website
  truths until the operator approves a reconciliation rule.

## Cross-Surface Overlaps

- The live proxy is a shared risk surface because it combines public website,
  private app, dashboard, and experiment routing.
- Root-level Pages/static files make the app/tool surface look like part of the
  public website even when auth gates are present.
- `01_website/current/` and `01_website/v2/` need an explicit source-of-truth
  decision before the always-on base can be guaranteed.

## Recommended Next Move

Create two clean worktrees after the current dirty tree is reviewed:

- `codex/evermore-website-base` for website-only patches.
- `codex/evermore-agent-app-base` for app/tool/backend patches.

Then create a protected promotion rule: the base branch is not edited directly;
all changes are patched in a clone/worktree, previewed, and promoted only after
the relevant owner signs off and live verification is recorded.

## Files Changed

- `BLUEPRINTS/reports/2026-06-27_website-app-partition.md`
