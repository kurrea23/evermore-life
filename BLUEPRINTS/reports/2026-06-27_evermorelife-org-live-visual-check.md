# Cartographer Report: evermorelife.org Live Visual Check

- **Date:** 2026-06-27
- **Agent or operator:** Codex
- **Surface:** Public Evermore website
- **Mission:** Confirm whether `https://evermorelife.org/` is live and serving the expected public quote path.
- **Approval level used:** observe

## Executive Finding

`https://evermorelife.org/` is live as of this check. The homepage, `/optin`,
`/privacy`, and the nav logo asset all returned `HTTP/2 200` through
Cloudflare with the `x-evermore-deployment: cloudflare-pages-proxy` header.

The visual browser pane could not attach in this session, so no screenshot is
stored with this report. The HTML readback confirms the homepage content,
headline, CTA path, logo asset path, Meta Pixel snippet, LeadConnector chat
loader, and footer contact details are being served.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Homepage is reachable live | `curl -I -L https://evermorelife.org/` returned `HTTP/2 200`, `server: cloudflare`, and `x-evermore-deployment: cloudflare-pages-proxy` | high |
| Homepage serves Evermore public copy | `curl -L https://evermorelife.org/` returned title `Evermore Life Insurance LLC \| Life Insurance, Mortgage Protection & Annuities — Phoenix, AZ` and hero `Protect What Matters Most. Life Insurance Made Simple.` | high |
| Primary quote path is reachable | `curl -I -L https://evermorelife.org/optin` returned `HTTP/2 200` with the same Cloudflare Pages proxy header | high |
| Legal route is reachable | `curl -I -L https://evermorelife.org/privacy` returned `HTTP/2 200` with the same Cloudflare Pages proxy header | high |
| Nav logo asset is reachable | `curl -I -L https://evermorelife.org/01_website/v2/assets/evermorelife-llc-logo-nav.png` returned `HTTP/2 200` and `content-type: image/png` | high |
| In-browser screenshot is unavailable from this run | Browser webview attach timed out before screenshot capture | high |

## Map

The live public homepage is currently served through Cloudflare and identifies
as the Pages proxy deployment. The homepage links the main CTA to `/optin`.
Canonical routing and source ownership remain mapped in `BLUEPRINTS/MAP.md`.

## Visual Evidence

No screenshot was saved because the in-app browser webview timed out before it
could attach. The live HTML readback is available in the command output for
this survey and should be replaced with a screenshot in `BLUEPRINTS/visuals/`
once browser capture is available.

## Unknown Or Unavailable

- A real browser screenshot was not captured.
- The GoHighLevel form submission, CRM receipt, workflow firing, email/call
  task creation, and thank-you tracking were not tested.
- No deploy, account change, form submission, publishing, or spend action was
  performed.

## Cross-Surface Overlaps

The public site is reachable, but lead-path health remains unproven until
`/optin` submission, CRM/workflow receipt, and tracking are verified together.

## Recommended Next Move

Open the live site in a browser session that can capture screenshots, then run
one approved controlled lead test through `/optin` to verify the full lead path
from public site to CRM/workflow/tracking.

## Files Changed

- `BLUEPRINTS/reports/2026-06-27_evermorelife-org-live-visual-check.md`
- `BLUEPRINTS/OVERLAPS.md`
