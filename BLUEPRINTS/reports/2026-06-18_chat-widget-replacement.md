# Cartographer Report: Chat Widget Replacement

- **Date:** 2026-06-18
- **Agent or operator:** Codex
- **Surface:** Public website chat widget, GHL paste-ready snippet, and Cloudflare Worker
- **Mission:** Replace the expired LeadConnector chat widget with the new widget ID and verify the public site is live.
- **Approval level used:** execute

## Executive Finding

The new LeadConnector chat widget ID `6a34718b718826e00221fc81` is live on
`evermorelife.org`. Live checks on `/` and `/chat` returned HTTP 200, one new
widget ID match, and zero old widget ID matches. Source files in the clean
release clone and original workspace were updated, and the Cloudflare Worker
was hotfixed because GitHub remote writes are still blocked.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Old live widget was still served before the hotfix | `curl https://evermorelife.org/` and `/chat` showed `data-widget-id="69f6e7fdcc1c6313dcd0f983"` before deploy | high |
| Cloudflare Worker accepted the live update | Cloudflare API updated Worker `evermore-life-live`, modified `2026-06-18T23:14:11.251823Z`, with `has_assets: true` | high |
| Live home and chat pages now serve the new widget | `curl` checks on `/` and `/chat` found `data-widget-id="6a34718b718826e00221fc81"` and zero old ID matches | high |
| Source embeds were updated | `01_website/v2/pages/index.html`, `01_website/v2/pages/chat.html`, `02_ghl/launch_kit/paste-ready/global-chat-widget-code.html` | high |
| Worker source includes a compatibility rewrite | `01_website/v2/cloudflare/evermore-live-proxy.js` rewrites old widget IDs to the new ID while Pages origin catches up | high |

## Map

The widget is present in two durable source places:

- `01_website/v2/pages/index.html`
- `01_website/v2/pages/chat.html`

The GHL paste-ready snippet is:

- `02_ghl/launch_kit/paste-ready/global-chat-widget-code.html`

Because the GitHub/Pages deploy path is still blocked, the live domain depends
on Cloudflare Worker `evermore-life-live` to rewrite any stale Pages-origin
HTML from the old widget ID to the new widget ID.

## Visual Evidence

No screenshots were captured. Evidence is from source inspection, Cloudflare API
response, Wrangler dry run, and live HTTP/content checks.

## Unknown Or Unavailable

- GitHub remote `main` was not updated because write access remains blocked.
- The LeadConnector widget UI was not browser-click tested; verification only
  confirmed the correct loader script and widget ID are present in live HTML.

## Cross-Surface Overlaps

The website source, GHL paste-ready snippet, and Cloudflare Worker must stay
aligned so visitors do not receive an expired widget from a stale origin.

## Recommended Next Move

Restore GitHub write access, push the clean release commit, then recheck `/` and
`/chat` live. Once the Pages origin itself emits the new widget ID, the Worker
compatibility rewrite can remain harmless or be removed in a later cleanup.

## Files Changed

- `01_website/v2/pages/index.html`
- `01_website/v2/pages/chat.html`
- `01_website/v2/cloudflare/evermore-live-proxy.js`
- `02_ghl/launch_kit/paste-ready/global-chat-widget-code.html`
- `BLUEPRINTS/DECISIONS.md`
- `BLUEPRINTS/OVERLAPS.md`
- `BLUEPRINTS/reports/2026-06-18_chat-widget-replacement.md`
