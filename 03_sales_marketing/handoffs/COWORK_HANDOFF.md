# Evermore Life - Cowork Handoff

Date: May 2, 2026

## Current State

Local implementation work is complete enough for a GoHighLevel build handoff.

The in-app GHL session was briefly inside the `Evermore Life LLC` location under `New Mexico Marketing Parnters LLC`, but probing admin/agency access kicked the browser back to the login screen. No live GHL pages were published, no A2P submission was made, no SMS was sent, and no live GHL contact creation was intentionally performed from Codex.

## What Is Ready

Primary handoff folder:

`/Users/k9smac/Desktop/EVERMORE-LIFE/ghl_launch_kit/`

Start with:

- `ghl_launch_kit/README.md`
- `ghl_launch_kit/live-build-runbook.md`
- `ghl_launch_kit/native-form-field-map.md`
- `ghl_launch_kit/workflow-blueprint.md`
- `ghl_launch_kit/a2p-registration-pack.md`
- `ghl_launch_kit/test-checklist.md`

Machine-readable helpers:

- `ghl_launch_kit/ghl-launch-map.json`
- `ghl_launch_kit/native-form-fields.csv`
- `ghl_launch_kit/a2p-sample-messages.csv`

Copy snippets:

- `ghl_launch_kit/snippets/home-copy.md`
- `ghl_launch_kit/snippets/optin-copy.md`
- `ghl_launch_kit/snippets/thank-you-copy.md`
- `ghl_launch_kit/snippets/privacy-copy.md`
- `ghl_launch_kit/snippets/terms-copy.md`
- `ghl_launch_kit/snippets/optional-ghl-custom-css.css`

## Recommended GHL Path

Use GHL-native lead capture first.

1. Create native GHL form: `Evermore Life Quote Request`.
2. Build GHL pages:
   - `/`
   - `/optin`
   - `/thank-you`
   - `/privacy`
   - `/terms`
3. Use the native GHL form on `/optin`.
4. Keep SMS consent optional and unchecked.
5. Add visible Privacy and Terms links near the form.
6. Create workflow: `Evermore Website Lead Intake`.
7. Enable SMS actions only after confirming A2P approval/textability and consent-gated workflow checks.
8. Publish pages only after final review.
9. Test fake lead.
10. Take A2P screenshot and submit registration.

## Exact SMS Consent Copy

Use this text for the optional unchecked checkbox:

`Optional: I consent to receive SMS text messages from Evermore Life about my quote request, appointment reminders, and insurance information. Msg & data rates may apply. Message frequency varies. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase.`

The checkbox must not be required and must not be pre-checked.

## A2P URLs

Use these once pages are live:

- Opt-in: `https://evermorelife.org/optin`
- Privacy: `https://evermorelife.org/privacy`
- Terms: `https://evermorelife.org/terms`

If GHL publishes with trailing slashes, use the trailing-slash versions consistently in the A2P form.

## Private Integration / Relay Option

Private GHL tokens must never go in browser HTML.

Server-side/private integration files are ready if needed:

- `GHL_PRIVATE_INTEGRATION_NOTES.md`
- `ghl_private_integration.py`
- `ghl_lead_relay_worker.js`
- `wrangler.ghl-relay.jsonc`
- `deploy_ghl_relay.sh`

Fastest launch path remains GHL-native form. Use the Cloudflare Worker relay later only if exact custom HTML/Sarah pages need API-level lead routing.

## Local Page Changes Already Made

Local HTML pages were hardened:

- `index.html`
- `optin.html`
- `Sarah_Evermore_AI.html`
- `Evermore_Landing_Page.html`
- `evermore-landing.html`
- `privacy.html`
- `terms.html`
- `thank-you.html`

Changes include:

- Optional SMS consent language.
- Privacy/terms links.
- STOP/HELP/rates/frequency/not-a-condition language.
- Safer insurance ad copy with fewer guarantee/lowest-rate claims.
- Local preview fallback for `file:`, `localhost`, `127.0.0.1`, and `::1`.
- Live-page behavior now alerts if lead webhook is missing instead of faking success.

## Scripts Ready

- `wire_ghl_webhook.sh` - wires a public inbound webhook or Worker relay URL into local HTML pages.
- `wire_pixel.sh` - installs/replaces Meta Pixel base code across public pages.
- `deploy_sarah.sh`, `redeploy_sarah.sh`, `deploy_kvn.sh` - no longer hardcode Cloudflare credentials.

Critical security note:

An old Cloudflare token existed in prior scripts. It has been removed from current scripts, but it should still be revoked/rotated in Cloudflare.

## Verification Already Run

Commands/checks passed:

- `python3 -m json.tool ghl_launch_kit/ghl-launch-map.json`
- `node --check ghl_lead_relay_worker.js`
- `python3 -m py_compile ghl_private_integration.py`
- Local preview server testing for:
  - `index.html`
  - `optin.html`
  - `thank-you.html`
  - `evermore-landing.html`
  - `Sarah_Evermore_AI.html`
  - `privacy.html`
  - `terms.html`

Note:

`Evermore_Landing_Page.html` includes a real Meta Pixel ID, so it was not browser-loaded during final local QA to avoid firing test traffic to Meta. Its script blocks passed static JS syntax checks earlier.

## What Still Needs Human/GHL Access

1. Log into the correct GHL account/location.
2. Confirm admin/agency access if needed.
3. Build the native GHL form from `native-form-field-map.md`.
4. Build the five GHL pages using snippets.
5. Build workflow from `workflow-blueprint.md`.
6. Publish pages only after review.
7. Submit fake lead with SMS unchecked and checked.
8. Confirm contact, tag, opportunity, owner notification, email, and call task.
9. Confirm SMS sends only for checked-consent owned-number tests.
10. Record non-secret A2P approval/textability and STOP/START test results after live page screenshot is ready.

## Stop Conditions

Pause before:

- Publishing public pages.
- Submitting A2P registration.
- Sending SMS.
- Creating or rotating private tokens.
- Entering passwords, 2FA codes, or password-manager values.
- Uploading private documents or business IDs.
