# Cartographer Report: Americo Live Publish

- **Date:** 2026-06-19
- **Agent or operator:** Codex
- **Surface:** Public website production publish
- **Mission:** Publish the Americo carrier roster update and related queued website updates to the live Evermore site.
- **Approval level used:** execute

## Executive Finding

GitHub `main` and the Cloudflare Worker are now updated. The live site shows Americo on the homepage, opt-in page, and active state pages. The Worker also bridges stale Cloudflare Pages output so Americo appears live while Pages catches up to the latest `main` source.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| GitHub `main` contains Americo in source. | `git push origin HEAD:main` to commit `08a0b24`; raw GitHub checks for `01_website/v2/pages/index.html`, `01_website/v2/pages/optin.html`, and `01_website/state-pages/public/arizona/index.html` | high |
| Worker deployed successfully. | Wrangler deploy version `e0c673a7-e49d-4227-b93b-34f626392945` | high |
| Homepage shows Corebridge and Americo with seven-carrier count. | `curl https://evermorelife.org/?v=08a0b24` | high |
| Opt-in page shows Corebridge and Americo. | `curl https://evermorelife.org/optin?v=08a0b24` | high |
| Arizona, Texas, and Arkansas pages show Corebridge and Americo with seven-carrier count. | `curl https://evermorelife.org/arizona?v=08a0b24`, `/texas?v=08a0b24`, `/arkansas?v=08a0b24` | high |
| Recruiting route is live. | `curl https://evermorelife.org/recruiting?v=08a0b24` | high |

## Map

The production route remains `evermorelife.org` through the `evermore-life-live` Cloudflare Worker, proxying `evermore-life.pages.dev`. GitHub `main` is the durable source for the public website, while the Worker currently includes a narrow HTML rewrite bridge for Americo carrier copy until Pages output fully reflects the latest source.

## Visual Evidence

None captured. Verification used live HTTP readback.

## Unknown Or Unavailable

- Cloudflare Pages build status was not read from the Cloudflare dashboard.
- GHL pasted pages were not updated or verified in this turn.

## Cross-Surface Overlaps

Cloudflare Worker can temporarily correct stale Pages output, but source and edge rewrites must be reconciled so future route or copy changes do not depend on hidden edge transformations.

## Recommended Next Move

After Cloudflare Pages catches up, verify the live HTML still shows Americo without relying on the Worker bridge, then remove the temporary Americo-specific rewrite from `rewriteHtml`.

## Files Changed

- `01_website/v2/cloudflare/evermore-live-proxy.js`
- `BLUEPRINTS/OVERLAPS.md`
- `BLUEPRINTS/DECISIONS.md`
- `BLUEPRINTS/reports/2026-06-19_americo-live-publish.md`
