# Cartographer Report: Website Legal Name Update

- **Date:** 2026-06-18
- **Agent or operator:** Codex
- **Surface:** Public website legal-name copy, state pages, website proxy strings, and GHL paste-ready website copies
- **Mission:** Update website-facing company references to Evermore Life Insurance LLC after the new LLC/articles update.
- **Approval level used:** execute

## Executive Finding

The local website source, state-page system, website proxy strings, and GHL
paste-ready/snippet copies now use
`Evermore Life Insurance LLC` instead of the prior `Evermore Life` or
`Evermore Life LLC` references in the targeted public website surfaces.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Current public site source uses the new legal name | `01_website/current/` | high |
| V2 website pages and shared nav/footer use the new legal name | `01_website/v2/pages/`, `01_website/v2/shared/` | high |
| State-page data, template, and generated pages use the new legal name | `01_website/state-pages/` | high |
| Website proxy/dashboard strings use the new legal name | `01_website/v2/cloudflare/evermore-live-proxy.js` | high |
| GHL paste-ready and snippet copies use the new legal name | `02_ghl/launch_kit/paste-ready/`, `02_ghl/launch_kit/snippets/` | high |
| Old targeted strings are absent from the edited website/GHL surfaces | `rg -n "Evermore Life LLC\|EVERMORE LIFE LLC\|Evermore Life(?! Insurance LLC)" --pcre2 01_website/current 01_website/v2/pages 01_website/v2/shared 01_website/v2/cloudflare 01_website/state-pages 02_ghl/launch_kit/snippets 02_ghl/launch_kit/paste-ready` returned no matches | high |

## Map

The canonical public-site route remains `01_website/current/`, with active
symlinks in `00_START_HERE/active/now/`. The newer website source in
`01_website/v2/pages/` and shared fragments in `01_website/v2/shared/` were
also aligned because those files are active website candidates. State-page
source and generated review pages in `01_website/state-pages/` were aligned
because they are part of the public website surface. GHL copy in
`02_ghl/launch_kit/` was aligned so future paste/update work does not
reintroduce the prior legal name.

## Visual Evidence

No screenshots were captured. This was a text/legal-name update verified against
local source files, not a live-site visual audit.

## Unknown Or Unavailable

- The live `evermorelife.org` pages were not verified in a browser during this
  pass.
- The referenced articles PDF was not opened or copied into this report; the
  human request supplied the approved legal-name direction.
- GHL live pages/forms were not updated or verified inside GHL during this pass.

## Cross-Surface Overlaps

The legal entity name affects public website copy, GHL paste-ready page copy,
state-page copy, proxy/dashboard strings, forms, consent language, policy pages,
metadata, and campaign-facing snippets.

## Recommended Next Move

Operator should deploy or paste the updated website/GHL source into the live
surfaces, then verify `evermorelife.org`, `/optin`, `/privacy`, `/terms`, and
`/thank-you` display `Evermore Life Insurance LLC` where needed.

## Files Changed

- `01_website/current/`
- `01_website/state-pages/`
- `01_website/v2/cloudflare/evermore-live-proxy.js`
- `01_website/v2/pages/`
- `01_website/v2/shared/`
- `02_ghl/launch_kit/snippets/`
- `02_ghl/launch_kit/paste-ready/`
- `BLUEPRINTS/OVERLAPS.md`
- `BLUEPRINTS/DECISIONS.md`
- `BLUEPRINTS/reports/2026-06-18_website-legal-name-update.md`
