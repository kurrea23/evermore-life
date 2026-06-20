# Cartographer Report: Calculator Routes Live Repair

- **Date:** 2026-06-20
- **Agent or operator:** Codex
- **Surface:** Public standalone calculator routes
- **Mission:** Resolve live 404s for `/score-tracker` and
  `/growth-calculator`.
- **Approval level used:** execute

## Executive Finding

The 404s were caused by Cloudflare Pages serving a stale deployment, not by
missing files on GitHub `main`. A manual Cloudflare Pages deployment of the
tracked `main` tree published both calculator folders, and a Cloudflare cache
purge was accepted from the dashboard. Both live routes now return 200 after
the expected trailing-slash redirect.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Local `main` contained both clean route files before deploy | `score-tracker/index.html`, `growth-calculator/index.html` | high |
| Live routes were still 404 before repair | `curl -I https://evermorelife.org/score-tracker` and `curl -I https://evermorelife.org/growth-calculator` returned `HTTP/2 404` on 2026-06-20 | high |
| Cloudflare Pages project was stale | Cloudflare Workers & Pages dashboard showed `evermore-life` Pages last updated 5 days earlier while GitHub `main` had the new files | high |
| Pages was manually deployed from tracked commit `9787d99` | `npx --yes wrangler@latest pages deploy /tmp/evermore-pages.poXNbB --project-name evermore-life --branch main --commit-hash 9787d9989797f18cd91d1867d0863c77fcf9b666 --commit-message "Deploy calculator clean routes" --commit-dirty=false` completed with preview `https://5dd5a8d7.evermore-life.pages.dev` | high |
| Cloudflare accepted cache purge | Dashboard confirmation showed `Purge request successfully received. Changes should take effect in less than 5 seconds.` | high |
| Live score tracker route is healthy | `curl -L -I https://evermorelife.org/score-tracker` returned `HTTP/2 308` to `/score-tracker/`, then `HTTP/2 200` | high |
| Live growth calculator route is healthy | `curl -L -I https://evermorelife.org/growth-calculator` returned `HTTP/2 308` to `/growth-calculator/`, then `HTTP/2 200` | high |

## Map

The live apex route is still served through the `evermore-life-live` Worker,
which proxies public routes to the `evermore-life` Pages origin. The calculator
folders are served by the Pages deployment and pass through the Worker proxy.

Canonical route sources remain `score-tracker/index.html` and
`growth-calculator/index.html`.

## Visual Evidence

No screenshot was saved. The dashboard displayed the purge success message in
the in-app browser.

## Unknown Or Unavailable

- The root cause of why the Pages project did not auto-deploy from GitHub
  `main` was not determined in this repair pass.

## Cross-Surface Overlaps

This closes the standalone calculator route overlap in `BLUEPRINTS/OVERLAPS.md`.

## Recommended Next Move

Inspect Cloudflare Pages Git integration later and confirm why pushes to
`origin/main` did not automatically create a fresh Pages deployment.

## Files Changed

- `BLUEPRINTS/reports/2026-06-20_calculator-routes-live-repair.md`
- `BLUEPRINTS/OVERLAPS.md`
- `BLUEPRINTS/DECISIONS.md`
