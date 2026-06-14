# GHL Workflow Complete Spec

**Workflow name:** `Evermore Website Lead Intake`
**Purpose:** Convert a permissioned website inquiry into a verified lead, immediate owner action, compliant nurture, and booked appointment.

## Trigger

`Form Submitted` -> `Evermore Life Lead Form - Main Opt-In`

Allow re-entry only when a new form submission is received. Do not re-enter from page visits alone.

## Required Fields

- First Name, Last Name, Phone, Email
- State, Age or Age Range, Coverage Goal
- SMS Consent, SMS Consent Text, SMS Consent Timestamp
- Source Page, UTM Source, UTM Medium, UTM Campaign, UTM Content

## Workflow Steps

1. **Create or update contact**
   - Map all available form and attribution fields.
   - Never overwrite a known SMS opt-out with a new blank value.

2. **State gate**
   - If state is `AZ` or `AR`, continue.
   - If state is `TX`, add tag `state-texas-pending`, notify owner, send email explaining service is not currently available, then stop.
   - Any other state: add tag `state-not-served`, notify owner, send unavailable-state email, then stop.

3. **Consent tags**
   - If SMS consent is explicitly true: add `sms-consent-yes`.
   - Otherwise: add `sms-consent-no`.
   - Never infer consent from a phone number or form submission.

4. **Lead and attribution tags**
   - Add `evermore-life-lead`.
   - Add `source-website`.
   - Add a product-intent tag when known: `intent-family-protection`, `intent-mortgage`, `intent-retirement-iul`, `intent-final-expense`, or `intent-not-sure`.

5. **Create opportunity**
   - Pipeline: `Evermore Life`
   - Stage: `New Lead`
   - Name: `{{contact.first_name}} {{contact.last_name}} - {{contact.coverage_goal}}`
   - Status: Open

6. **Assign owner**
   - Assign Lucidus or the approved round-robin owner.

7. **Internal notification**
   - Subject: `New Evermore lead: {{contact.full_name}}`
   - Include phone, email, state, age range, coverage goal, SMS consent, source page, UTMs, and submission time.

8. **Create speed-to-lead task**
   - Title: `Call {{contact.first_name}} within 5 minutes`
   - Due: immediately
   - Note: `If no answer, move to Called - No Answer. Do not text unless A2P is approved and sms-consent-yes is present.`

9. **Send Email 1 immediately**
   - Use `EMAIL_NURTURE_SEQUENCE.md`.

10. **Conditional SMS Day 1**
    - Run only when all are true:
      - A2P campaign is approved.
      - Contact has `sms-consent-yes`.
      - Contact is not DND/opted out.
    - Use `SMS_NURTURE_SEQUENCE.md`.

11. **Wait and exit checks**
    - Before every nurture message, stop the branch if appointment is booked, contact opted out, contact is marked Not Interested, or opportunity is Won/Lost.

12. **Email nurture**
    - Day 2: Email 2
    - Day 3: Email 3
    - Day 5: Email 4
    - Day 7: Email 5

13. **SMS nurture after approval**
    - Day 2, Day 3, Day 5 according to `SMS_NURTURE_SEQUENCE.md`.

14. **Appointment booked branch**
    - Move opportunity to `Appointment Booked`.
    - Remove from unbooked nurture.
    - Send confirmation email.
    - Send SMS confirmation/reminders only with valid SMS consent and A2P approval.

15. **No-show branch**
    - Move to `No Show`.
    - Create same-day reschedule task.
    - Send low-pressure reschedule email.
    - Send SMS only with valid consent and A2P approval.

16. **STOP handling**
    - On STOP or DND: remove from every SMS workflow immediately.
    - Preserve email/phone follow-up only when independently permitted.

## Pipeline Stages

`New Lead` -> `Called - No Answer` -> `Texted` -> `Contacted` -> `Appointment Booked` -> `No Show` -> `Quote Started` -> `Application Started` -> `Issued / Won`

Terminal stages: `Not Interested`, `Bad Fit / Invalid`

## Test Cases

| Test | Expected Result |
| --- | --- |
| AZ lead, SMS unchecked | Contact/opportunity/task/email created; no SMS |
| AR lead, SMS checked, A2P off | Contact/opportunity/task/email created; no SMS |
| AR lead, SMS checked, A2P approved | Approved SMS branch runs |
| TX lead | Tagged pending, owner notified, unavailable email, workflow stops |
| Unsupported state | Tagged not served, owner notified, unavailable email, workflow stops |
| Existing opted-out contact submits again | Opt-out remains; no SMS |
| Lead books | Unbooked nurture stops; opportunity moves to Appointment Booked |
