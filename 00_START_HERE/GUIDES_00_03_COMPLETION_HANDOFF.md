# Guides 00-03 Completion Handoff

**Last verified:** June 13, 2026
**Workspace:** `/Users/k9smac/Desktop/EVERMORE-LIFE`
**GHL location:** Evermore Life LLC, `OOWpXE1DSDg6zKkj4Qbd`

## Executive Status

Massive foundation progress is complete. The live website, real GHL form, pipeline,
Meta Pixel, booking calendar, Sarah standby flow, nurture copy, and A2P evidence
pack are in place.

**Current launch decision:** Hold paid ads until one controlled non-SMS lead test
proves the full GHL workflow and Meta Test Events confirms the deployed events.

**A2P decision:** Hold submission until the EIN arrives. Keep every SMS action
disabled until the A2P campaign is approved.

## Verified IDs And URLs

| Item | Verified value |
| --- | --- |
| Live site | `https://evermorelife.org` |
| GHL location ID | `OOWpXE1DSDg6zKkj4Qbd` |
| Real GHL form | `Evermore Life Lead Form - Main Opt-In` |
| Real GHL form ID | `jSPWmsXtRRndruYCzYsk` |
| Meta Pixel ID | `1895928277755643` |
| Booking calendar | `Evermore Life Coverage Review` |
| Booking calendar ID | `NzsTTtQ0xBDAMXVhly7L` |
| Booking URL | `https://api.leadconnectorhq.com/widget/booking/NzsTTtQ0xBDAMXVhly7L` |
| Pixel deployment commit | `6262300 install Meta pixel on public website` |

## Guide 00 - GHL Foundation

**Status: Mostly complete; controlled end-to-end test remains.**

Completed and verified:

- Real GHL form found and deployed on live `/optin`.
- Live `/optin` returns HTTP 200 and contains form ID `jSPWmsXtRRndruYCzYsk`.
- Existing GHL pipeline verified with all required stages:
  `New Lead`, `Called - No Answer`, `Texted`, `Contacted`,
  `Appointment Booked`, `No Show`, `Quote Started`,
  `Application Started`, `Issued/Won`, `Not Interested`, and
  `Bad Fit/Invalid`.
- Existing GHL evidence showed five website opportunities in `New Lead`.
- Existing GHL evidence showed call tasks created for website leads.
- A2P evidence screenshots captured in
  `00_START_HERE/active/rooms/A2P_REGISTRATION/screenshots_to_take/` and backed
  up at `/Users/k9smac/Desktop/A2P_Screenshots/`.

Still required:

- Submit one controlled Arizona lead with SMS unchecked.
- Verify contact fields, tags, opportunity, owner notification, welcome email,
  and call task.
- Verify no SMS is sent.
- Configure form success redirect to `/thank-you`, or prove an equivalent
  form-success `Lead` event.

## Guide 01 - Website And Meta Pixel

**Status: Deployed; Meta Test Events confirmation remains.**

Completed and verified:

- Pixel `1895928277755643` installed across public v2 pages.
- Cloudflare Pages deployment completed.
- Live home source contains the base Pixel and `PageView`.
- Live `/optin` source contains `PageView` and `ViewContent`.
- Live `/thank-you` source contains `PageView` and `Lead`.
- Live `/thank-you` contains the new booking CTA.
- Real GHL form ID is deployed on live `/optin`.

Still required:

- Open Meta Events Manager Test Events.
- Visit home, `/optin`, and `/thank-you`.
- Confirm `PageView`, `ViewContent`, and `Lead` appear in Test Events.

## Guide 02 - Facebook Ads

**Status: Build materials ready; campaigns intentionally not launched.**

Completed:

- Campaign copy and first-launch planning documents exist.
- Pixel and conversion-event code are deployed.
- Live `/optin` is selected as the safe first campaign destination.
- Recommended initial geo is Arizona and Texas only; Arkansas remains pending.
- First launch slice is documented at `$10/day` for seven days after gates pass.

Still required before spending:

- Confirm the correct Meta ad account, Facebook Page, payment method, and
  current special ad category in Meta.
- Confirm Test Events.
- Pass the controlled GHL lead test.
- Approve one final creative.
- Create and publish the first small campaign.

## Guide 03 - A2P, Nurture, Sarah, And Booking

**Status: Non-A2P assets complete; A2P and GHL workflow activation remain.**

Completed and verified:

- A2P submission explicitly placed on hold pending EIN.
- Four-file evidence pack captured:
  `01-optin-form-and-consent.png`, `02-sms-consent-closeup.png`,
  `03-privacy-page.png`, and `04-terms-page.png`.
- The evidence pack is stored inside the repo at
  `00_START_HERE/active/rooms/A2P_REGISTRATION/screenshots_to_take/`.
- Compliant five-email nurture sequence completed with the live booking URL.
- Compliant SMS nurture drafts completed with the live booking URL.
- SMS remains inactive pending EIN, submission, and approval.
- Full Sarah GHL conversation-tree reference completed with the booking URL.
- Standalone Sarah flow verified live at `https://evermorelife.org/sarah`.
- `Evermore Life Coverage Review` calendar created.
- Booking URL returns HTTP 200.
- Booking CTA added to live `/thank-you` and verified.

Still required:

- Build and activate the five-email nurture inside GHL.
- Build the SMS branch inside GHL but leave it disabled.
- Configure Sarah inside GHL if the native AI surface will be used.
- After EIN arrives, resolve remaining A2P gaps and submit.
- Activate SMS only after approval.

## Exact Next Actions

1. In GHL, configure the form success redirect to
   `https://evermorelife.org/thank-you`.
2. Build and activate the email-only nurture using
   `02_ghl/launch_kit/EMAIL_NURTURE_SEQUENCE.md`.
3. Build the SMS branch from `02_ghl/launch_kit/SMS_NURTURE_SEQUENCE.md`, but
   keep it disabled.
4. Submit one controlled Arizona lead with SMS unchecked and record results in
   `02_ghl/launch_kit/test-checklist.md`.
5. Verify `PageView`, `ViewContent`, and `Lead` in Meta Test Events.
6. Approve one creative and launch the `$10/day` Arizona and Texas test.
7. When the EIN arrives, finish and submit A2P; activate SMS only after approval.

## Important Safety Rules

- Do not send SMS before A2P approval.
- Do not infer SMS consent from a phone number or form submission.
- Do not advertise in Texas until licensing is confirmed active.
- Do not claim guaranteed approval, guaranteed pricing, or unsupported returns.
- Preserve the real form, calendar, Pixel, and location IDs listed above.
