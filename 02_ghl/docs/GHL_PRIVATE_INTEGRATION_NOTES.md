# GHL Private Integration Notes

Use a GoHighLevel Private Integration Token for server-side tools only.

Do not put the token in:

- `index.html`
- `optin.html`
- `Sarah_Evermore_AI.html`
- `Evermore_Landing_Page.html`
- `evermore-landing.html`
- any public GHL funnel page

## What To Create In GHL

Create the Private Integration at the sub-account/location level if this funnel is only for Evermore Life.

Recommended name:

`Evermore Codex Lead Ops`

Recommended description:

`Server-side tools for Evermore Life lead capture testing, contact upsert, pipeline QA, and launch verification. Token is never embedded in public pages.`

Minimum useful scopes:

- Contacts read/write
- Contact tags read/write
- Opportunities read/write, if you want script-created opportunities
- Locations read, for connection testing
- Workflows read/execute only if you plan to trigger workflows directly by API

Avoid broad agency-level access unless you specifically need it.

## How Codex Can Use It

The safe pattern is:

1. User creates/copies the Private Integration Token in GHL.
2. User stores it as a local environment variable or a Cloudflare Worker secret.
3. Codex runs server-side/local scripts that call HighLevel API v2.
4. Public landing pages keep using a public inbound webhook or a server-side relay.

Official HighLevel docs say Private Integration Tokens are for internal/single-account integrations, use the Authorization header, and should be scoped and rotated.

## Local Test Commands

From `/Users/k9smac/Desktop/EVERMORE-LIFE`:

```bash
export GHL_PRIVATE_TOKEN="paste-token-here"
export GHL_LOCATION_ID="paste-location-id-here"
python3 ghl_private_integration.py location --dry-run
python3 ghl_private_integration.py test-contact --dry-run
```

Only after you are ready to create a real test contact:

```bash
python3 ghl_private_integration.py location --live
python3 ghl_private_integration.py test-contact --live
```

The `--live` commands transmit data to GHL and can create records.

## Better Production Pattern

For production lead capture, use one of these:

- Native GHL forms/workflows embedded on the GHL-hosted pages.
- Public GHL inbound webhook URL stored in `window.EVERMORE_CONFIG.ghlWebhookUrl`.
- Cloudflare Worker relay with `GHL_PRIVATE_TOKEN` stored as a Worker secret.

Do not expose the Private Integration Token in client-side JavaScript.

## Worker Relay Option

Files added:

- `02_ghl/relay_worker/ghl_lead_relay_worker.js`
- `02_ghl/relay_worker/wrangler.ghl-relay.jsonc`
- `04_tools/scripts/deploy_ghl_relay.sh`

Flow:

1. Browser form posts lead JSON to the Worker URL.
2. Worker validates origin, required phone/email, and honeypot fields.
3. Worker calls HighLevel `/contacts/upsert` with the private token.
4. Browser receives only a simple success/failure response.

Setup:

```bash
cd /Users/k9smac/Desktop/EVERMORE-LIFE
open 02_ghl/relay_worker/wrangler.ghl-relay.jsonc
04_tools/scripts/deploy_ghl_relay.sh
```

After editing `GHL_LOCATION_ID`, run the two commands printed by `deploy_ghl_relay.sh`.

Once deployed, use `04_tools/scripts/wire_ghl_webhook.sh` and paste the Worker HTTPS URL, such as:

`https://evermore-ghl-lead-relay.<your-subdomain>.workers.dev/api/lead`
