# Cartographer Report: Website Live Publish Hotfix

- **Date:** 2026-06-18
- **Agent or operator:** Codex
- **Surface:** Public website, clean release clone, GitHub publish path, and Cloudflare Worker
- **Mission:** Publish the legal-name/site-readiness fixes as far as available access allows, then verify live production.
- **Approval level used:** execute

## Executive Finding

The public website is now live with the approved `Evermore Life Insurance LLC`
legal name on the checked public routes. Cloudflare accepted a targeted Worker
hotfix at `2026-06-18T23:01:58Z`, and live verification shows `/`,
`/sarah`, `/privacy`, `/terms`, `/arizona`, `/texas`, `/arkansas`, and
`/recruiting` return HTTP 200 with no old `Evermore Life LLC` matches. GitHub
is still not fixed: the clean release commit is ready locally, but remote write
operations are blocked.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Clean release clone is ahead of `origin/main` with the website fixes | `/Users/keenanmain/Desktop/EVERMORE-LIFE-CLEAN-20260618-153255`, commit `339ff72` | high |
| Local Git push is blocked by missing HTTPS credentials | `git push origin main` returned `fatal: could not read Username for 'https://github.com': Device not configured` | high |
| Connected GitHub integration is read-capable but write-blocked | GitHub `_create_branch` returned `403 Resource not accessible by integration` for `kurrea23/evermore-life` | high |
| Cloudflare Worker content update succeeded | Cloudflare API returned success for Worker `evermore-life-live`, `has_assets: true`, `handlers: ["fetch"]`, `last_deployed_from: "api"`, modified `2026-06-18T23:01:58.126208Z` | high |
| Public routes verified after hotfix | `curl` checks on `/`, `/optin`, `/privacy`, `/terms`, `/thank-you`, `/chat`, `/sarah`, `/arizona`, `/texas`, `/arkansas`, `/recruiting`, `/sitemap.xml`, and `/robots.txt` returned HTTP 200 | high |
| Checked public pages no longer expose old legal-name copy | `grep` checks on `/`, `/sarah`, `/privacy`, `/terms`, `/arizona`, `/texas`, `/arkansas`, and `/recruiting` found zero `Evermore Life LLC`/`EVERMORE LIFE LLC` matches | high |
| State pages are indexable live and in source | Live checks found zero `noindex` matches for `/arizona`, `/texas`, `/arkansas`; clean release source now uses `index, follow` | high |

## Map

Production traffic for `evermorelife.org` is served through Cloudflare Worker
`evermore-life-live` in front of the `evermore-life.pages.dev` Pages origin.
The normal durable path is still GitHub to Cloudflare, but the current live fix
was applied through the Cloudflare Worker API because GitHub writes were
blocked.

The hotfix does four things at the edge:

- Rewrites old legal-name strings to `Evermore Life Insurance LLC`.
- Routes `/sarah` through the same HTML rewrite instead of streaming the asset
  body unchanged.
- Serves `/recruiting` and `/sitemap.xml` directly while GitHub source is not
  pushed.
- Rewrites state-page robots metadata from `noindex, nofollow` to
  `index, follow`.

## Visual Evidence

No screenshots were captured. Evidence is from Cloudflare API responses, local
Git/GitHub checks, and live HTTP/content checks.

## Unknown Or Unavailable

- GitHub remote `main` was not updated because all available write paths were
  blocked.
- Cloudflare Pages source deployment was not triggered from GitHub.
- GHL forms/workflows and Meta Pixel events were not end-to-end tested.
- The Cloudflare Worker hotfix should be treated as a bridge until GitHub source
  can be pushed and redeployed normally.

## Cross-Surface Overlaps

Cloudflare production is now ahead of GitHub source. The next deploy from
GitHub must include the clean release commit or it may undo the live hotfix.

## Recommended Next Move

Fix GitHub write access, then push the clean release commit from
`/Users/keenanmain/Desktop/EVERMORE-LIFE-CLEAN-20260618-153255` and redeploy
Cloudflare through the normal path. After that, rerun the same live checks and
remove any need for the Worker-only bridge.

## Files Changed

- `BLUEPRINTS/reports/2026-06-18_website-live-publish-hotfix.md`
- `BLUEPRINTS/OVERLAPS.md`
- `BLUEPRINTS/DECISIONS.md`
