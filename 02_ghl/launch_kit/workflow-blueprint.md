# GHL Workflow Blueprint

Workflow name:

`Evermore Website Lead Intake`

Trigger:

`Form Submitted` -> `Evermore Life Quote Request`

## Workflow Steps

1. Create/update contact from form submission.
2. Add contact tags:
   - `evermore-life-lead`
   - `website-lead`
   - `sms-consent-yes` only if SMS checkbox is checked.
   - `sms-consent-no` if SMS checkbox is unchecked or blank.
3. Create opportunity:
   - Pipeline: `Evermore Life Sales`
   - Stage: `New Lead`
   - Opportunity name: `{{contact.first_name}} {{contact.last_name}} - Website Quote Request`
   - Status: Open
4. Internal notification:
   - Send email or app notification to owner.
   - Subject: `New Evermore Life lead: {{contact.full_name}}`
   - Include phone, email, age, state, coverage type, SMS consent, source URL, and submitted timestamp.
5. Send immediate email to lead:
   - Subject: `We received your Evermore Life quote request`
   - Body: confirm request, say a licensed agent will reach out, include support email, include privacy/terms links.
6. Create call task:
   - Due immediately.
   - Title: `Call new Evermore website lead`
   - Notes: `Call within 5 minutes. If no answer, move to Called - No Answer. Do not send SMS unless A2P is approved and SMS consent is true.`
7. Conditional SMS branch:
   - If A2P approved AND SMS consent is true, send the approved first SMS.
   - If A2P is not approved, skip SMS and rely on phone/email.

## Pipeline Stages

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

## First Email Template

Subject:

`We received your Evermore Life quote request`

Body:

`Hi {{contact.first_name}},`

`Thanks for requesting information from Evermore Life. A licensed agent will review your request and reach out shortly to help you compare available life insurance options.`

`If you need help sooner, reply to this email or contact evermorelifeagent01@gmail.com.`

`Evermore Life`

`Privacy Policy: https://evermorelife.org/privacy`

`Terms: https://evermorelife.org/terms`

## Approved SMS Branch Template

Only enable after A2P approval:

`Evermore Life: Thanks for requesting a life insurance quote. Sarah here. I can help you review options and book a quick call. Reply STOP to opt out or HELP for help.`

Do not enable this branch before A2P approval.
