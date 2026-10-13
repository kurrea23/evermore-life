# Cartographer Report: Keenan Cloudflare release

- **Date:** 2026-10-12 (America/Phoenix)
- **Agent or operator:** Codex + Evermore operator
- **Surface:** Public human-agent pages on Cloudflare
- **Mission:** Publish the approved directory and Keenan page and provide live links.
- **Approval level used:** execute; operator requested "Put a link with cloudflare live".

## Executive Finding

[Keenan’s profile](https://evermorelife.org/agents/keenan-urrea/) and the
[agent directory](https://evermorelife.org/agents/) are live on the existing
Cloudflare Pages site. Deployment source is `6426ced`; both pages and their
assets match repository source byte for byte. No Worker deployment was needed.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Public source and credentials prepared | [Draft report](2026-10-12_keenan-agent-pages-and-licenses.md), [registry](../../agents/data/profiles.json) | high |
| Current source preserves newer virtual-office changes | Feature rebased onto current `origin/main` (`ab9cbc5`) before release | high |
| Cloudflare access and project verified | Wrangler OAuth account check and `pages project list`, October 12 | high |
| Approved source deployed | `deploy.sh` fetched GitHub main `6426ced`, validated 474 source files, uploaded 18 files (489 already uploaded), and uploaded `_headers` | high |
| Deployment origin serves the profile | [Cloudflare deployment](https://75349c2d.evermore-life.pages.dev/agents/keenan-urrea/) returned HTTP 200 and expected profile content | high |
| Public pages and assets match approved source | HTTPS curl requests for `/agents/`, `/agents/keenan-urrea/`, stylesheet, unchanged card asset and canonical logo returned 200 and passed SHA-256 equality | high |
| Live browser renders credentials and direct contacts | Public profile readback showed all three licenses, supplied contacts and portrait | high |
| Existing website routes remain available | Deploy sweep returned 200 for root, brand, growth calculator, score tracker, clients, today and inbound client intake | high for route availability |

## Map

Canonical routes are `/agents/` and `/agents/keenan-urrea/`; source and owner are
documented in [the handoff](../../agents/README.md). The existing Worker passes
root-level directories to Pages. Prepared explicit proxy mappings were removed
as unnecessary before release; no Worker redeployment is required.
Publication uses [deploy.sh](../../deploy.sh), which reads fresh GitHub `main`.
Noindex remains for this first review release; the pages are publicly accessible.

## Visual Evidence

See [local draft screenshots](2026-10-12_keenan-agent-pages-and-licenses.md#visual-evidence).
[Live profile](../visuals/2026-10-12_keenan-live.png) records the public page after release.

## Unknown Or Unavailable

Contact channels were not called or emailed. Licenses reflect October 12
checks, not an exhaustive national search. Search indexing remains disabled
by noindex; public access is live.

## Cross-Surface Overlaps

Release preserves current virtual-office source. Public profiles remain separate
from authenticated Agent Suite and the generic quote intake. No customer or
private-address data is introduced by this release.

## Recommended Next Move

Operator can share the live profile and directory links. Review the next
agent’s professional details and current license evidence before adding them.

## Files Changed

- `agents/README.md`
- This report, live screenshot, `BLUEPRINTS/MAP.md`, `BLUEPRINTS/DECISIONS.md`, `BLUEPRINTS/OVERLAPS.md`
