# Cartographer Report: Live Readiness Audit

- **Date:** 2026-06-18
- **Agent or operator:** Codex
- **Surface:** Public website, Cloudflare Worker/Pages deployment path, state pages, recruiting route, and repository release hygiene
- **Mission:** Determine what is done, what is live, and what is still blocked before publishing current website work.
- **Approval level used:** execute

## Executive Finding

The live site is definitely served through Cloudflare and the Worker-backed
Pages proxy, but live production does not match the current local source. Most
public website source appears close to release-ready locally, including the
legal-name update and active Arizona/Texas/Arkansas state-page drafts. The main
publish blockers are release hygiene and route/source mismatch: local Git has
object/index problems, `/recruiting` is local/untracked and returns 404 live,
live pages still show the old legal name, and live `/sarah` is served from an
experiment file that still uses the old name locally.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Apex live traffic is handled by Cloudflare Worker proxy | `curl -I https://evermorelife.org/` returned HTTP 200 and `x-evermore-deployment: cloudflare-pages-proxy` on 2026-06-18 | high |
| Worker maps public routes to `01_website/v2/pages/` on `evermore-life.pages.dev` | `01_website/v2/cloudflare/evermore-live-proxy.js` | high |
| Live root, optin, privacy, terms, thank-you, chat, and state pages still contain old `Evermore Life LLC`/plain `Evermore Life` legal-name strings | Live curl content checks on `/`, `/optin`, `/privacy`, `/terms`, `/thank-you`, `/chat`, `/arizona`, `/texas`, `/arkansas` | high |
| Local v2, state-page, and Worker source no longer contain targeted old legal-name strings | `rg -n "Evermore Life LLC\|EVERMORE LIFE LLC\|Evermore Life(?! Insurance LLC)" --pcre2 01_website/state-pages 01_website/v2/pages 01_website/v2/shared 01_website/v2/cloudflare` returned no matches | high |
| Live `/sarah` is not using `v2/pages/sarah.html`; it is served by the Worker from an experiment asset | `01_website/v2/cloudflare/evermore-live-proxy.js` uses `SARAH_ASSET_PATH = "/Sarah_Evermore_AI_v2.html"` and live `/sarah` header returned `x-evermore-deployment: cloudflare-sarah-standby` | high |
| Local Sarah experiment still has old legal-name copy | `01_website/experiments/Sarah_Evermore_AI_v2.html` old-name `rg` matches | high |
| Live `/recruiting` returns 404 | `curl https://evermorelife.org/recruiting` returned status 404 on 2026-06-18 | high |
| A prepared deploy path exists for recruiting + Arkansas activation, but says to deploy from `recruiting-arkansas-live`, not the current working tree | `HANDOFF_recruiting_deploy.md`, `DEPLOY_recruiting.sh` | high |
| Local state-page registry validates and rebuilds Arizona, Texas, and Arkansas as active drafts | `python3 01_website/state-pages/scripts/build_state_pages.py` succeeded | high |
| State pages are live but still noindex | Live `/arizona`, `/texas`, `/arkansas` returned HTTP 200 with `meta name="robots" content="noindex, nofollow"` | high |
| Repository release hygiene is not clean | `git fsck --no-reflogs` reports missing objects/broken links; `git diff --stat` exited 139; `.git/index.lock` appeared after the failed diff/update flow | high |

## Map

Current production architecture appears to be:

- Domain: `evermorelife.org`
- Edge: Cloudflare Worker `evermore-life-live`
- Worker config: `01_website/v2/cloudflare/wrangler.live-proxy.jsonc`
- Static origin: `evermore-life.pages.dev`
- Public source route family: `01_website/v2/pages/`
- State-page source and generated review pages: `01_website/state-pages/`
- Sarah live route exception: `/sarah` is served from
  `01_website/experiments/Sarah_Evermore_AI_v2.html` through the Worker asset
  binding, not from `01_website/v2/pages/sarah.html`.
- Recruiting local route target: `01_website/v2/pages/recruiting.html`, but the
  file is untracked in this working tree and not live on the Pages origin.

## Done

- Cloudflare Worker is live and serving the apex domain.
- Main public routes return HTTP 200: `/`, `/optin`, `/privacy`, `/terms`,
  `/thank-you`, `/chat`.
- State routes return HTTP 200: `/arizona`, `/texas`, `/arkansas`.
- Local v2/current/state/GHL website-copy legal-name updates are in place for
  `Evermore Life Insurance LLC`.
- Local state-page generator validates and rebuilds Arizona, Texas, and Arkansas
  as active drafts.
- Private `/dashboard` and `/kevin` routes return HTTP 200 and are noindex.
- A dedicated deploy handoff/script exists for the recruiting + Arkansas publish
  path from branch `recruiting-arkansas-live`.

## Not Done Or Not Live

- Live production pages still show the old legal name because the local
  legal-name update has not been published.
- Live `/sarah` still shows old-name copy and local Worker routing points it to
  an experiment asset that has not been updated.
- Live `/recruiting` returns 404.
- Recruiting source is currently untracked in this working tree, so it will not
  publish from this tree unless explicitly added through a clean release path.
- State pages are live but still `noindex, nofollow`; they are not SEO-live.
- `01_website/v2/pages/404.html` has no Privacy or Terms text/link matches in a
  simple local grep check, and `01_website/v2/pages/sarah.html` has Privacy
  links but no Terms match. This may matter if those are treated as traffic/A2P
  review pages.
- `01_website/CODEX_HANDOFF.md` still says Arkansas pending in one compliance
  requirement section, while local `states.json` says Arkansas active.
- `01_website/v2/robots.txt` points the sitemap to
  `https://evermorelife.org/01_website/v2/sitemap.xml`, while the Worker serves
  `/sitemap.xml` as a clean route.

## Release Blockers

1. Do not publish from the current dirty working tree until Git integrity is
   repaired or a clean worktree/branch is used.
2. Decide whether to use the already-prepared `recruiting-arkansas-live` deploy
   path or build a new clean release branch from current source.
3. Update the live Sarah asset source or change Worker routing so `/sarah` uses
   the updated v2 page.
4. Verify the legal-name update after deployment on live `/`, `/optin`,
   `/privacy`, `/terms`, `/thank-you`, `/chat`, `/sarah`, and state pages.
5. Decide whether state pages should remain `noindex` or become indexable when
   activated for production traffic.

## Visual Evidence

No screenshots were captured. Evidence is from local source inspection, state
generator validation, Git checks, and live HTTP/content checks.

## Unknown Or Unavailable

- Cloudflare dashboard build settings were not inspected directly.
- GHL live forms/workflows were not inspected directly.
- Meta Pixel event firing was not validated in a browser or Events Manager.
- The live Pages build commit was not read from Cloudflare; production/live
  state was inferred from HTTP headers and content.
- GitHub Actions/Cloudflare build logs were not inspected.

## Cross-Surface Overlaps

Live readiness depends on four surfaces moving together: Git hygiene, Cloudflare
Worker deployment, Cloudflare Pages/static content, and compliance/CRM intake
verification. Local source readiness alone does not prove production readiness.

## Recommended Next Move

Use a clean release path. The smallest safe path is either:

1. Repair or reclone the repo, then cherry-pick/apply only approved website
   changes into a clean branch and push that to the Cloudflare production path.
2. If the prepared `recruiting-arkansas-live` branch is still the intended
   release, run its deploy flow from a clean worktree, then apply the
   Evermore Life Insurance LLC legal-name update and Sarah route/source fix as a
   separate follow-up release.

## Files Changed

- `BLUEPRINTS/reports/2026-06-18_live-readiness-audit.md`
- `BLUEPRINTS/OVERLAPS.md`
- `BLUEPRINTS/DECISIONS.md`
