# Live GHL Build Runbook

Use this while inside GoHighLevel.

## 1. Create Native Form

GHL path:

`Sites` -> `Forms` -> `Builder` -> `New Form`

Form name:

`Evermore Life Quote Request`

Build the fields from `native-form-field-map.md`.

Settings:

- Redirect on submit: `/thank-you`
- Keep the SMS checkbox optional.
- Do not pre-check the SMS checkbox.
- Add Privacy and Terms links under the form if the form builder allows custom text. If not, add them directly below the form on the page.

## 2. Create Funnel/Site Pages

GHL path:

`Sites` -> `Funnels` or `Websites`

Create:

- `/`
- `/optin`
- `/thank-you`
- `/privacy`
- `/terms`

Use `page-build-guide.md` and the snippets folder.

## 3. Build Workflow

GHL path:

`Automation` -> `Workflows` -> `Create Workflow`

Workflow:

`Evermore Website Lead Intake`

Use `workflow-blueprint.md`.

Important:

- A2P is approved, so SMS actions may be enabled only behind recorded SMS consent and opt-out/DND checks.
- Email and call task can run immediately.

## 4. Publish + Verify

After publishing:

- Open `https://evermorelife.org/optin`.
- Submit one fake lead with SMS unchecked.
- Submit one fake lead with SMS checked.
- Verify tags, consent state, opportunity, email, notification, and call task.
- Confirm SMS sends only for the opted-in owned test contact and does not send for the unchecked-consent test.

## 5. A2P Approval Record

Use `a2p-registration-pack.md` as the approved-use-case reference.

Screenshot must show:

- Browser URL bar
- Evermore branding
- Phone field
- Optional unchecked SMS checkbox
- Full consent language
- Privacy and Terms links

Record the GHL Trust Center approval/textability status in `A2P_GAP_REPORT.md`
before relying on SMS for live leads.
