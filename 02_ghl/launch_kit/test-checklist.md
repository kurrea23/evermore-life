# Launch Test Checklist

Run this before ads or A2P submission.

## Public Page Checks

- `/` loads without broken links.
- `/optin` loads without login or preview mode.
- `/privacy` loads publicly.
- `/terms` loads publicly.
- `/thank-you` loads publicly.
- Header/footer links resolve correctly.
- Mobile view shows full SMS consent text without overlap.

## Form Checks

- SMS checkbox is visible.
- SMS checkbox is optional.
- SMS checkbox is not pre-checked.
- Quote request can submit with SMS unchecked.
- Quote request can submit with SMS checked.
- Thank-you page loads after submission.

## GHL CRM Checks

- Contact is created/updated.
- Phone and email are saved.
- SMS consent field/tag is saved accurately.
- Contact has tag `evermore-life-lead`.
- Opportunity is created in `New Lead`.
- Owner notification fires.
- First email sends.
- Call task is created.
- No SMS sends before A2P approval.

## A2P Checks

- Screenshot captures public URL, form, checkbox, consent copy, privacy/terms links.
- A2P campaign description matches the actual page.
- Sample messages use the Evermore Life brand name.
- Privacy Policy includes mobile opt-in non-sharing language.
- Terms include STOP/HELP, rates, frequency, and carrier delivery disclaimer.

