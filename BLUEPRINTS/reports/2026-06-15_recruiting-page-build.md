# Cartographer Report: Recruiting Page Build

- **Date:** 2026-06-15
- **Agent or operator:** Codex
- **Surface:** Evermore Life recruiting page
- **Mission:** Create a private recruiting-page draft at `/recruiting` without changing the public homepage, state pages, navigation, or live deployment.
- **Approval level used:** execute

## Executive Finding

Evermore Life now has a noindex recruiting-page draft and a staged proxy route
for `/recruiting`. The page uses the live V2 website design system and the
state-page card, step, mobile, and reveal patterns while keeping the recruiting
calendar intentionally unconnected.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| The recruiting page contains the requested mission, agent profile, support, first-50, process, culture, FAQ, and final CTA sections | `01_website/v2/pages/recruiting.html` | high |
| Every recruiting booking CTA uses the approved placeholder | `01_website/v2/pages/recruiting.html` and placeholder validation | high |
| The new page remains private from search and absent from public navigation | `noindex, nofollow` metadata and scoped repository diff | high |
| The proxy source maps `/recruiting` to the new static page | `01_website/v2/cloudflare/evermore-live-proxy.js` and successful Worker syntax check | high |
| The live `/recruiting` route returned 404 before this local build | HTTP header readback on 2026-06-15 | high |
| Desktop and mobile layouts render without horizontal overflow or browser-console errors | Local browser verification at 1280px and 390px widths | high |

## Map

The recruiting-page source is `01_website/v2/pages/recruiting.html`. The clean
public route is staged in `01_website/v2/cloudflare/evermore-live-proxy.js`.
The page reuses `01_website/v2/pages/_tokens.css` and
`01_website/v2/pages/_base.css`. No homepage, state-page, or public navigation
source was changed.

## Visual Evidence

Local browser verification confirmed the hero, cards, mobile one-column layouts,
four-step process, sticky mobile action bar, working hamburger menu, reveal
behavior, and absence of horizontal overflow at 1280px and 390px widths. No
visual artifact was saved. No live-site visual proof exists because no deploy
was approved or performed.

## Unknown Or Unavailable

The recruiting-specific calendar URL is not approved and remains
`#TODO-recruiting-calendar-link`. The local proxy mapping is not live until an
approved deployment occurs. Live `/recruiting` route behavior after deployment
is therefore unknown.

## Cross-Surface Overlaps

The page route is a website concern, while the final booking destination is a
recruiting-operations and calendar concern. This dependency is recorded in
`../OVERLAPS.md`.

## Recommended Next Move

Review the local page, approve its copy and design, then approve a
recruiting-specific calendar URL before any deploy or traffic.

## Files Changed

- `01_website/v2/pages/recruiting.html`
- `01_website/v2/cloudflare/evermore-live-proxy.js`
- `BLUEPRINTS/MAP.md`
- `BLUEPRINTS/OVERLAPS.md`
- `BLUEPRINTS/reports/2026-06-15_recruiting-page-build.md`
