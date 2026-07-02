# Cartographer Report: Intake Route Restore

- **Date:** 2026-07-01
- **Agent or operator:** Codex
- **Surface:** Cloudflare Worker live route `/intake` and PWA assets
- **Mission:** Restore the broken client-intake route without rolling back newer Worker routes.
- **Approval level used:** execute

## Executive Finding

`https://evermorelife.org/intake` was returning `404` because the live Worker
source no longer contained the intake route handlers, even though a prior intake
branch still had the route and assets. The repair forward-ported only the intake
route/PWA handling into the current Worker and restored the intake assets under
the existing Worker asset directory.

Live verification after deploy shows `/intake`, `/intake.webmanifest`,
`/intake-sw.js`, and `/intake-icon.svg` all returning `200`.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| The current pre-repair live `/intake` route returned `404`. | `/usr/bin/curl -L https://evermorelife.org/intake` before patch | high |
| The prior intake implementation existed on `origin/codex/intake-mobile-live`. | `git show origin/codex/intake-mobile-live:01_website/v2/cloudflare/evermore-live-proxy.js` and asset paths | high |
| The current Worker had newer route work but lacked intake constants, redirects, and handlers. | `01_website/v2/cloudflare/evermore-live-proxy.js` before patch | high |
| Wrangler dry-run read the Worker asset bundle successfully before deploy. | `npx --yes wrangler@latest deploy --dry-run --config 01_website/v2/cloudflare/wrangler.live-proxy.jsonc` | high |
| Worker deploy succeeded. | Wrangler deploy output, Worker version `13c8a12f-8311-4a85-8543-3e2b027a2df8` | high |
| `/intake`, manifest, service worker, icon, state pages, Sarah, recruiting, dashboard, and core legal/funnel routes returned `200` after deploy. | Final `/usr/bin/curl -L` route sweep on 2026-07-01 | high |

## Map

The restored live intake route is:

- [https://evermorelife.org/intake](https://evermorelife.org/intake)

Worker/PWA assets:

- [https://evermorelife.org/intake.webmanifest](https://evermorelife.org/intake.webmanifest)
- [https://evermorelife.org/intake-sw.js](https://evermorelife.org/intake-sw.js)
- [https://evermorelife.org/intake-icon.svg](https://evermorelife.org/intake-icon.svg)

Canonical source locations:

- `01_website/v2/cloudflare/evermore-live-proxy.js`
- `01_website/experiments/Client-Intake.html`
- `01_website/experiments/intake.webmanifest`
- `01_website/experiments/intake-sw.js`
- `01_website/experiments/intake-icon.svg`

The Worker asset binding in `01_website/v2/cloudflare/wrangler.live-proxy.jsonc`
serves from `01_website/experiments`, so the intake app must remain there for
Worker deploys to include it.

## Visual Evidence

No screenshots were captured. This was a route and deployment restore verified
by HTTP readbacks.

## Unknown Or Unavailable

- The intake app page loads over HTTPS, but this report did not complete a full
  in-browser iPad install test.
- The intake app preserves local encrypted storage; this report did not connect
  it to CRM sync or submit private customer data.

## Cross-Surface Overlaps

Promote this finding to `../OVERLAPS.md`: the live Worker is shared by intake,
state pages, Sarah, recruiting, dashboards, and app assets, so any deploy must
forward-port existing routes instead of replacing the Worker from a narrower
branch.

## Recommended Next Move

Keep future Worker changes in a clean branch/worktree and run a pre-deploy route
sweep that includes `/intake`, its PWA assets, state pages, Sarah, recruiting,
and dashboard routes.

## Files Changed

- `01_website/v2/cloudflare/evermore-live-proxy.js`
- `01_website/experiments/Client-Intake.html`
- `01_website/experiments/intake.webmanifest`
- `01_website/experiments/intake-sw.js`
- `01_website/experiments/intake-icon.svg`
- `BLUEPRINTS/MAP.md`
- `BLUEPRINTS/OVERLAPS.md`
- `BLUEPRINTS/DECISIONS.md`
- `BLUEPRINTS/reports/2026-07-01_intake-route-restore.md`
