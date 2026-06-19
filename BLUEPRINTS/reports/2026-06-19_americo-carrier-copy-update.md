# Cartographer Report: Americo Carrier Copy Update

- **Date:** 2026-06-19
- **Agent or operator:** Codex
- **Surface:** Public website carrier copy and state-page carrier lists
- **Mission:** Add Americo to the carrier lists after operator confirmation that Evermore was approved by Americo.
- **Approval level used:** execute

## Executive Finding

Americo has been added to the repository-side carrier lists used by the active public pages, v2 draft pages, retirement-planning draft pages, generated state pages, the state-page template, older experiment copy, and the GHL paste-ready copy station.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Active homepage and quote page now include Americo or the updated six-carrier count. | `01_website/current/index.html`, `01_website/current/optin.html` | high |
| v2 and retirement draft carrier surfaces now include Americo. | `01_website/v2/pages/index.html`, `01_website/v2/pages/optin.html`, `01_website/retirement-planning-v2/pages/index.html`, `01_website/retirement-planning-v2/pages/optin.html` | high |
| State-page source and generated pages now include Americo. | `01_website/state-pages/templates/state-page.html`, `01_website/state-pages/public/arizona/index.html`, `01_website/state-pages/public/texas/index.html`, `01_website/state-pages/public/arkansas/index.html` | high |
| Older experiment page carrier copy now includes Americo. | `01_website/experiments/evermore-landing.html` | high |
| GHL paste-ready public copy now includes Americo. | `02_ghl/launch_kit/paste-ready/ghl-copy-station.html` | high |

## Map

Canonical public-site source remains `01_website/current/`. Active daily links under `00_START_HERE/active/now/` point to those files. State pages remain governed by `01_website/state-pages/`, with generated pages in `01_website/state-pages/public/`.

## Visual Evidence

None captured. This was a text-copy update only.

## Unknown Or Unavailable

- Live production deployment was not performed or verified in this turn.
- Carrier portal approval evidence was not inspected; the operator supplied the approval fact.

## Cross-Surface Overlaps

Americo carrier approval affects public website copy, state-page generated copy, older experiment copy, and GHL paste-ready copy. Any future carrier roster change should update matching repo surfaces together.

## Recommended Next Move

After approval to publish, deploy the website changes and verify the live pages at `evermorelife.org`, including `/`, `/optin`, `/arizona/`, `/texas/`, and `/arkansas/`.

## Files Changed

- `01_website/current/index.html`
- `01_website/current/optin.html`
- `01_website/v2/pages/index.html`
- `01_website/v2/pages/optin.html`
- `01_website/retirement-planning-v2/pages/index.html`
- `01_website/retirement-planning-v2/pages/optin.html`
- `01_website/state-pages/templates/state-page.html`
- `01_website/state-pages/public/arizona/index.html`
- `01_website/state-pages/public/texas/index.html`
- `01_website/state-pages/public/arkansas/index.html`
- `01_website/experiments/evermore-landing.html`
- `02_ghl/launch_kit/paste-ready/ghl-copy-station.html`
- `BLUEPRINTS/OVERLAPS.md`
- `BLUEPRINTS/DECISIONS.md`
- `BLUEPRINTS/reports/2026-06-19_americo-carrier-copy-update.md`
