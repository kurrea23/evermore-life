# Cartographer Report: Sarah Final Expense Live Route

- **Date:** 2026-06-27
- **Agent or operator:** Codex
- **Surface:** Public `/sarah` route and Cloudflare live proxy
- **Mission:** Publish the approved final-expense landing page as the live Sarah route without editing or deleting the original experiment code.
- **Approval level used:** execute

## Executive Finding

`https://evermorelife.org/sarah` now serves the copied `sarah-final-expense.html`
asset through the live Cloudflare Worker. The original experiment source and the
previous Sarah asset were preserved.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| The source HTML was copied from the operator-specified worktree into the live asset bundle. | `01_website/experiments/sarah-final-expense.html`; SHA-256 `8df1a80508f29b8782ae39f636f61e67e65e804aeb1882e3faea25be28881c04` matched the provided worktree file. | high |
| The live Worker points `/sarah` at the new asset. | `01_website/v2/cloudflare/evermore-live-proxy.js` sets `SARAH_ASSET_PATH = "/sarah-final-expense.html"`. | high |
| Production was deployed. | `wrangler deploy --config 01_website/v2/cloudflare/wrangler.live-proxy.jsonc`; deployed `evermore-life-live` version `6ceb592e-348e-4131-81ae-8d1cc8d71fd2`. | high |
| Live `/sarah` returns the final-expense page. | `curl -I https://evermorelife.org/sarah` returned HTTP 200 and `x-evermore-deployment: cloudflare-sarah-standby`; full HTML readback included `Final Expense Insurance`. | high |

## Map

The public `/sarah` route remains owned by the live Cloudflare Worker in
`01_website/v2/cloudflare/evermore-live-proxy.js`. The route now serves
`01_website/experiments/sarah-final-expense.html` from the Worker asset bundle.
The older `01_website/experiments/Sarah_Evermore_AI_v2.html` file remains in
place but is no longer the live `/sarah` target.

## Visual Evidence

No screenshot was saved during this route swap. Live HTTP and HTML readback were
used as verification.

## Unknown Or Unavailable

The embedded Sarah widget lead webhook is still configured in the HTML as an
empty `ghlWebhookUrl`. Live visitor form submission behavior was not tested
because submitting leads and CRM changes are approval-gated.

## Cross-Surface Overlaps

The Sarah route ties together the public website route, Cloudflare Worker asset
bundle, Meta Pixel, and GHL/Sarah lead path. The page is live, but the lead
handoff still needs a controlled GHL test before traffic or spend is treated as
fully proven.

## Recommended Next Move

Run one approved test lead through `/sarah` after the GHL webhook/calendar
destination is confirmed, then document contact creation, consent capture, and
follow-up behavior.

## Files Changed

- `01_website/experiments/sarah-final-expense.html`
- `01_website/v2/cloudflare/evermore-live-proxy.js`
- `BLUEPRINTS/MAP.md`
- `BLUEPRINTS/OVERLAPS.md`
- `BLUEPRINTS/DECISIONS.md`
- `BLUEPRINTS/reports/2026-06-27_sarah-final-expense-live-route.md`
