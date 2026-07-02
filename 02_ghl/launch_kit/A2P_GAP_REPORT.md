# A2P Gap Report

**Verified:** July 1, 2026
**Status:** A2P approved per operator confirmation. Textability is available.
Repo-side docs are updated; live GHL Trust Center proof, submission ID/campaign
ID, and first owned-number SMS test still need to be recorded.

## Live Evidence Verified

| Check | Result | Evidence |
| --- | --- | --- |
| `/optin` public | Pass | Returns HTTP 200 |
| `/privacy` public | Pass | Returns HTTP 200 |
| `/terms` public | Pass | Returns HTTP 200 |
| Phone field present | Pass | Live GHL form includes a required phone field |
| SMS consent present | Pass | Live GHL form includes a terms/consent checkbox |
| SMS consent optional | Pass | Live GHL form configuration marks the checkbox as not required |
| Consent unchecked by default | Pass from configuration | No checked/default-true state detected |
| STOP and HELP language | Pass | Live form text includes both |
| Consent not condition of purchase | Pass | Live form text includes this statement |
| Privacy and Terms links | Pass with cleanup needed | Links resolve, but mixed canonical paths are used |

## Blocking Gaps

### 1. Canonical links inside the GHL form are inconsistent

The live embedded form references:

- `https://evermorelife.org/01_website/v2/pages/privacy.html`
- `https://evermorelife.org/01_website/v2/pages/terms.html`
- `https://evermorelife.org/privacypolicy`
- `https://evermorelife.org/terms`

These currently resolve, but the A2P pack and public standard use:

- `https://evermorelife.org/privacy`
- `https://evermorelife.org/terms`

**Required action in GHL:** Update every consent/footer link in the native form to the canonical `/privacy` and `/terms` URLs.

### 2. Consent copy does not exactly match the registration pack

The live GHL form mentions application updates and service communications, while some A2P pack files use insurance information or coverage follow-up.

**Required action:** Choose one customer-care use case and make the live checkbox, campaign description, opt-in flow, and sample messages match exactly. Recommended live wording:

> Optional: I consent to receive SMS messages from Evermore Life LLC about my quote request, appointment reminders, application updates, and related service communications at the phone number I provide. Message frequency may vary. Message and data rates may apply. Reply HELP for help or STOP to opt out. Consent is not a condition of purchase. See our Privacy Policy and Terms of Service.

### 3. Screenshot evidence captured

Evidence captured June 13, 2026 in
`00_START_HERE/active/rooms/A2P_REGISTRATION/screenshots_to_take/` and backed
up at `/Users/k9smac/Desktop/A2P_Screenshots/`:

- `01-optin-form-and-consent.png`
- `02-sms-consent-closeup.png`
- `03-privacy-page.png`
- `04-terms-page.png`

### 4. Form submission behavior does not redirect to `/thank-you`

The live GHL form configuration shows an inline thank-you message and no redirect URL. This is not necessarily an A2P rejection issue, but it blocks the planned Meta `Lead` event on `/thank-you`.

**Required action in GHL:** Redirect successful submissions to `https://evermorelife.org/thank-you`, or configure a reliable Lead event directly on successful GHL form submission.

### 5. A2P approval confirmed by operator

On July 1, 2026, the operator confirmed A2P approval and textability. No secret,
submission ID, campaign ID, or private account screenshot is stored in this repo.

**Required action in GHL:** Record non-secret approval evidence, confirm the
approved use case, then run an owned-number SMS test through the consent-gated
workflow branch.

## Submission Decision

**APPROVED / TEXTABLE.** SMS may be enabled only for contacts with recorded
optional SMS consent who are not opted out or DND. Keep paid traffic gated until
the controlled lead test proves contact creation, opportunity creation,
notification/email/task creation, tracking, and consent-gated SMS behavior.
