# Evermore Life Handoff

Created: May 2, 2026

## Mission

Evermore Life is being pushed from "good looking pages" into a working lead and appointment machine:

- Public pages live on the GoHighLevel-connected domain.
- A2P 10DLC setup has clean opt-in, privacy, terms, sample-message language, and screenshots.
- Leads flow into GoHighLevel instead of disappearing.
- Ads launch only after a real fake-lead test proves the funnel stores contacts and triggers follow-up.

## Current State

The folder is not a git repo. Treat `/Users/k9smac/Desktop/EVERMORE-LIFE` as the live working folder.

Primary pages:

- `index.html` - home/entry page with quick form.
- `optin.html` - main quote opt-in page.
- `Sarah_Evermore_AI.html` - Sarah assistant/booking page.
- `Evermore_Landing_Page.html` - main designed landing page variant.
- `evermore-landing.html` - React/Babel landing page variant.
- `privacy.html` and `terms.html` - public compliance pages.

Important docs/assets already in the folder:

- `GHL_Setup_Guide.docx`
- `GHL_SMS_Email_Templates.docx`
- `Evermore_Video_Ad_Scripts.docx`
- `Evermore_Meta_Funnel_Playbook.xlsx`
- `Evermore_Implementation_Tracker.xlsx`
- `evermore_logo.png`
- Sarah images/headshots

## What Was Changed

Security and deployment:

- Replaced `deploy_sarah.sh`, `redeploy_sarah.sh`, and `deploy_kvn.sh` so they no longer hardcode Cloudflare credentials.
- Rebuilt `wire_ghl_webhook.sh` so it asks only for a public HTTPS GoHighLevel/LeadConnector inbound webhook URL.
- The webhook script now refuses the old unsafe pattern of putting a private GHL token into browser HTML.
- Added `wire_pixel.sh` so the Meta Pixel ID can be installed across public pages consistently.
- Added `ghl_private_integration.py` for local/server-side GHL Private Integration testing without putting secrets in browser code.
- Added `ghl_lead_relay_worker.js`, `wrangler.ghl-relay.jsonc`, and `deploy_ghl_relay.sh` for an optional Cloudflare Worker relay that stores the GHL Private Integration Token as a Worker secret.

Lead capture:

- Added `window.EVERMORE_CONFIG.ghlWebhookUrl` placeholders to the working pages.
- Added real POST-to-webhook behavior where possible.
- Added local preview fallback: on `file:` or localhost, leads store in `localStorage.evermore_preview_leads`.
- Changed live pages so a missing webhook alerts instead of faking success.
- Added UTM/source/page/referrer fields to lead payloads.
- Added Meta/Google lead event hooks if `fbq` or `gtag` exist.

A2P/consent:

- SMS consent is now optional and separate from requesting a quote.
- Consent copy includes message/data rates, frequency, STOP/HELP, privacy/terms links, and not-a-condition language.
- `privacy.html` now says SMS opt-in data and consent will not be shared, sold, or used by third parties for their own marketing.
- `terms.html` now includes clearer SMS program terms, STOP/HELP, appointment reminder language, and carrier delivery disclaimers.

## Critical Security Note

Old scripts previously exposed a Cloudflare API token. Do not reuse that token. Rotate/revoke it in Cloudflare before any serious deployment work.

Never paste a GoHighLevel Private Integration Token, API key, or location secret into public HTML. Browser pages should receive leads through a public inbound webhook, a native GHL form, or a server-side endpoint.

## Immediate Blocker

The funnel is not truly shippable until the GoHighLevel lead destination is wired and tested.

Required before ads:

1. Create a GHL inbound webhook/workflow or use native GHL form embeds.
2. Run `./wire_ghl_webhook.sh` from `/Users/k9smac/Desktop/EVERMORE-LIFE`.
3. Paste only the public HTTPS webhook URL.
4. Upload/publish the updated pages in GoHighLevel.
5. Submit one fake lead from the public domain.
6. Confirm the contact appears in GHL with name, phone, email, SMS consent, source page, and UTM fields.
7. Confirm the right workflow fires, but do not send marketing SMS until A2P is approved.

Private Integration option:

- Use the public GHL inbound webhook for fastest launch.
- Use the Cloudflare relay if you want the landing pages to post to a server-side endpoint that calls GHL API v2 with a Private Integration Token.
- See `GHL_PRIVATE_INTEGRATION_NOTES.md`.
- For the GHL-native launch path, use the implementation kit in `ghl_launch_kit/`.

## A2P Setup Paste Pack

Use case:

Evermore Life sends SMS messages to people who voluntarily request a life insurance quote, appointment, or follow-up through our website. Messages include appointment reminders, quote follow-up, requested information, and help completing the insurance inquiry process.

Opt-in flow:

Visitors opt in on the Evermore Life website by entering their contact details and optionally checking the SMS consent box. The checkbox is not pre-checked. The form links to Privacy Policy and Terms of Service pages. A user can request a quote without consenting to SMS.

Opt-in URL:

`https://evermorelife.org/optin.html`

Privacy URL:

`https://evermorelife.org/privacy.html`

Terms URL:

`https://evermorelife.org/terms.html`

Sample message 1:

Evermore Life: Thanks for requesting a life insurance quote. Sarah here. I can help you review options and book a quick call. Reply STOP to opt out or HELP for help.

Sample message 2:

Evermore Life: Reminder for your scheduled life insurance consultation. Reply YES to confirm or reply STOP to opt out. Msg/data rates may apply.

Sample message 3:

Evermore Life: We received your quote request and can help compare options. What is the best time today for a quick call? Reply STOP to opt out or HELP for help.

Compliance notes:

- Include screenshots of the exact live opt-in form.
- Brand name, domain, privacy policy, terms, and sample messages need to match.
- Do not claim users can opt in by texting START unless that keyword/number is truly configured.
- Keep marketing and appointment/quote follow-up under one clear lead-follow-up use case unless GHL requires separate campaigns.
- Official A2P references checked: Twilio A2P 10DLC guide and HighLevel A2P best practices.

## GHL Funnel Wiring

Recommended contact fields:

- First name
- Last name
- Email
- Phone
- State
- Age range
- Coverage goal
- Health status
- Tobacco use
- Preferred time
- SMS consent true/false
- SMS consent text
- SMS consent timestamp
- Source page
- UTM source
- UTM medium
- UTM campaign
- UTM content
- UTM term

Recommended pipeline stages:

- New Lead
- Called - No Answer
- Texted
- Contacted
- Appointment Booked
- No Show
- Quote Started
- Application Started
- Issued/Won
- Not Interested
- Bad Fit/Invalid

Minimum workflow:

1. New form/webhook submission creates or updates contact.
2. Add tag: `evermore-life-lead`.
3. Create opportunity in `New Lead`.
4. Notify owner immediately.
5. If A2P approved and SMS consent is true, send compliant first SMS.
6. Send email immediately even if A2P is pending.
7. Create call task due now.
8. If no contact after first call, move to `Called - No Answer`.

## Ads ASAP Plan

Do not launch paid traffic until the fake-lead test passes.

Meta:

- Because this is insurance/financial-services adjacent, check the Financial Products and Services special ad category in Ads Manager if prompted or required.
- Use broad, compliant targeting and qualify with creative/form questions rather than restricted personal attributes.
- Start small: 2 to 3 creatives, 1 campaign objective, daily budget the team is comfortable burning for learning.

Meta creative angles:

1. Sarah direct-to-camera: "Most families put this off because it feels complicated. I can help you see options in a few minutes."
2. Family protection: "A simple quote can show what it may take to protect the people who count on you."
3. No-pressure review: "Already have coverage? Request a quick review and see if it still fits."

Meta primary text:

Option A:
Life insurance can feel heavy, but getting a quote does not have to. Evermore Life helps you compare options and book a simple consultation.

Option B:
Protecting your family starts with knowing your options. Request a quick Evermore Life quote and Sarah can help you take the next step.

Option C:
Not sure how much coverage makes sense? Start with a quick quote request and a short consultation. No pressure, just clarity.

Google Search starter keywords:

- life insurance quotes
- term life insurance quote
- whole life insurance quote
- life insurance agent
- family life insurance
- final expense insurance
- burial insurance quote
- compare life insurance

Google negative keywords:

- free money
- lawsuit
- job
- career
- salary
- license
- pdf
- template
- reddit
- scam

Ad policy notes:

- Avoid guarantees like "approval guaranteed" or "lowest rate guaranteed."
- Avoid implying the ad knows the user's health, income, family status, or hardship.
- Keep landing pages clear about who Evermore Life is, what happens after submission, and how users can opt out of SMS.
- Official references checked: Google financial products/services ad policy and Meta financial-products special-category guidance.

## Daily Scoreboard

Track this every day during launch:

- Ad spend
- Clicks
- Landing page conversion rate
- Leads
- Cost per lead
- Leads called within 5 minutes
- Contacts reached
- Appointments booked
- Appointment show rate
- Quotes started
- Applications started
- Policies issued
- Estimated commission

Target rhythm:

- Call new leads within 5 minutes.
- Make at least 3 contact attempts in the first 24 hours.
- Pause any ad set that spends enough for a fair test without leads.
- Keep the best creative and replace weak creative fast.

## Next 90 Minutes

1. Rotate the exposed Cloudflare token.
2. Create the GHL inbound webhook/workflow.
3. Run `./wire_ghl_webhook.sh`.
4. Publish the updated pages to the GHL domain.
5. Submit a fake lead from the public domain.
6. Confirm lead fields and workflow in GHL.
7. Take screenshots of opt-in, privacy, and terms for A2P.
8. Finish A2P campaign submission with the paste pack above.
9. Install/verify Meta Pixel or Google tag.
10. Launch a small test campaign only after the fake lead works.

## Open Risks

- If `ghlWebhookUrl` is blank on a live domain, the pages now alert and stop instead of pretending the lead worked.
- A2P approval can fail if the live page copy, screenshots, sample messages, privacy policy, and terms do not match.
- The legal agency name, license details, physical address, and phone number still need final business-owner verification.
- Privacy and terms pages are operational templates, not legal advice.
- Some DOCX/XLSX files may contain older workflow guidance and should be refreshed after the live GHL workflow is finalized.

## Useful Commands

From the project folder:

```bash
cd /Users/k9smac/Desktop/EVERMORE-LIFE
chmod +x deploy_sarah.sh redeploy_sarah.sh deploy_kvn.sh wire_ghl_webhook.sh
./wire_ghl_webhook.sh
```

Check for accidental exposed secrets:

```bash
rg -n "cfat_|GHL_API_TOKEN|Private Integration Token|hooks\\.zapier" /Users/k9smac/Desktop/EVERMORE-LIFE --glob '*.sh' --glob '*.html'
```

Check preview leads during local testing:

```js
JSON.parse(localStorage.getItem("evermore_preview_leads") || "[]")
```
