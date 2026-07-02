# A2P ACTIVATION — YOU DO THIS

The version of this you can run alone. No AI required. Print it if you want.

---

## Phase 1 — Pre-flight (5 min)

1. Open `https://evermorelife.org/optin` in a private/incognito browser window.
2. Confirm:
   - [ ] Page loads with Evermore Life branding visible.
   - [ ] Form has a Phone field.
   - [ ] There is an SMS consent checkbox **that is unchecked by default**.
   - [ ] The checkbox text starts with "Optional: I consent to receive SMS text messages from Evermore Life…"
   - [ ] Privacy Policy link is visible near the form and clicking it opens `evermorelife.org/privacy`.
   - [ ] Terms link is visible near the form and clicking it opens `evermorelife.org/terms`.
3. If any box above is unchecked → STOP. Go back to the cockpit Step 5–7. Don't proceed.

---

## Phase 2 — Screenshot (2 min)

1. Still in the incognito window on `/optin`, take ONE screenshot that captures:
   - The URL bar showing `evermorelife.org/optin`
   - The form fields including phone
   - The unchecked SMS consent checkbox + full consent text
   - Privacy + Terms links
   - Evermore Life branding
2. Save as `optin_a2p_evidence_<YYYY-MM-DD>.png` into the `screenshots_to_take/` folder in this room.
3. (Optional) Take a second one of `/privacy` and `/terms` for your own records.

---

## Phase 3 — Confirm Approved Campaign In GHL (5 min)

1. Open GoHighLevel → Settings → Phone Numbers → Trust Center (or Compliance → A2P 10DLC).
2. Confirm the Evermore campaign is approved/textable.
3. Open `paste_into_ghl/01_a2p-registration-pack.md` in this room.
4. Confirm each approved GHL field still matches the pack:

| GHL field | Source in the pack |
| --- | --- |
| Opt-in URL | "Public URLs → Opt-in URL" |
| Privacy Policy URL | "Public URLs → Privacy Policy" |
| Terms URL | "Public URLs → Terms of Service" |
| Campaign Description / Use Case | "Campaign Description" |
| Opt-In Flow / How users consent | "Opt-In Flow" |
| Opt-In Confirmation Message | "Opt-In Confirmation Message" |
| Sample Message 1 | "Sample 1" |
| Sample Message 2 | "Sample 2" |
| Sample Message 3 | "Sample 3" |

5. If GHL shows sample messages, compare them to `paste_into_ghl/02_a2p-sample-messages.csv`.
6. **Verify before activating** — common compliance problems:
   - Sample messages don't include "Reply STOP to opt out"
   - Brand name in messages doesn't match the brand in the campaign
   - Opt-in URL goes to a page that doesn't show the consent text in the screenshot

---

## Phase 4 — Activate Consent-Gated SMS (10 min)

1. In GHL, open "Evermore Website Lead Intake" workflow.
2. Enable only the SMS actions that sit behind SMS consent = true and not-DND/not-opted-out checks.
3. Leave any broadcast, cold outreach, or non-approved-use-case SMS disabled.
4. Save/publish the workflow only after checking the branches.

---

## Phase 5 — Verify

1. Submit a fake lead with **your own phone number** and SMS consent **checked**.
4. Confirm the opt-in confirmation SMS arrives on your phone.
5. Reply `STOP` from your phone → confirm GHL flags the contact as opted-out and stops sending.
6. Reply `START` → confirm SMS resumes.
7. Submit a second fake lead with SMS consent **unchecked** and confirm no SMS sends.
8. Mark the cockpit/GHL launch checklist as DONE only after both tests pass.

---

## Approval and test log

| Date | Submission ID/Campaign ID | Status | Notes |
| --- | --- | --- | --- |
|  |  |  |  |
