# Cartographer Report: GitHub Pages Deployment Repair

- **Date:** 2026-06-14
- **Agent or operator:** Codex
- **Surface:** GitHub Pages deployment
- **Mission:** Investigate failed Actions run 27457145875, repair the skipped
  Pages deploy, and verify the public surface.
- **Approval level used:** execute

## Executive Finding

Actions run `27457145875` failed in the built-in Pages workflow's `Upload
artifact` step, which caused the deploy job to be skipped. A clean checkout of
`main` contained eight broken tracked symlinks under the A2P active room. Their
relative targets were one directory too shallow.

The focused repair changed only those eight link targets and was pushed to
`main` as commit `b28ec3615b68893ebb48ea266bd06232c790fa19`. Replacement
Pages run `27504844359` completed successfully, including artifact upload and
deployment.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Run 27457145875 failed during artifact upload | GitHub Actions run `27457145875`, build job `81163702066` | high |
| The deploy job was skipped because build failed | GitHub Actions run `27457145875`, deploy job `81163709570` | high |
| Eight tracked A2P room symlinks were broken in a clean checkout | `git archive origin/main` plus `find -L` | high |
| Replacement run completed artifact upload and deploy | GitHub Actions run `27504844359` | high |
| A new GitHub Pages deployment was created from the repair commit | Deployment `5055331203` | high |
| GitHub Pages URL redirected to the custom domain, which returned the intended site with HTTP 200 | `curl` readback on 2026-06-14 | high |

## Map

GitHub's dynamic `pages-build-deployment` workflow packages the repository root
from `main`. The root contains the public entry files and the local-first
`00_START_HERE/active/` navigation layer. Broken tracked links in that local
navigation layer therefore affect Pages artifact creation even though they are
not part of the public-site route.

## Visual Evidence

None required.

## Unknown Or Unavailable

- Full GitHub Actions job logs were unavailable because `gh` is not installed
  and the unauthenticated job-log API requires repository admin rights.
- `evermorelife.org` is fronted by Cloudflare. The successful Pages deployment
  proves the skipped GitHub job was repaired; the custom-domain HTTP readback
  proves the public surface remained available.

## Cross-Surface Overlaps

Recorded in `../OVERLAPS.md`: tracked local-first navigation links can block
public Pages packaging.

## Recommended Next Move

No immediate repair action remains. Keep tracked symlinks resolvable before
future Pages releases.

## Files Changed

- Eight tracked symlinks under
  `00_START_HERE/active/rooms/A2P_REGISTRATION/`
- `BLUEPRINTS/reports/2026-06-14_github-pages-deployment-repair.md`
- `BLUEPRINTS/OVERLAPS.md`
