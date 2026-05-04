# Evermore Life Forms + Workflow Next Steps

Do not change A2P registration language while the campaign is under review. Build the workflow without SMS first. Add SMS only after approval.

## 1. Verify Forms

Check both forms:

- Form 10: homepage form
- Evermore Life Lead Form - Main Opt-In: opt-in page form

Each form should have:

- First Name
- Last Name if used
- Phone
- Email if used
- State / Date of Birth if used
- One optional SMS checkbox
- Checkbox unchecked by default
- Checkbox not required
- Privacy Policy and Terms of Service links

SMS checkbox copy:

Optional: I consent to receive SMS messages from Evermore Life LLC about my quote request, appointment reminders, application updates, and related service communications at the phone number I provide. Message frequency may vary. Message and data rates may apply. Reply HELP for help or STOP to opt out. Consent is not a condition of purchase.

## 2. Create Workflow

Go to Automation > Workflows > Create Workflow.

Name:

Evermore Website Lead Intake

Trigger:

Form Submitted

Add both forms as triggers if GHL allows:

- Form 10
- Evermore Life Lead Form - Main Opt-In

## 3. Workflow Actions

Add these actions in order:

1. Add Contact Tag
   - Website Lead
   - Evermore A2P Opt-In Source

2. Add Internal Notification
   - Send to evermorelifeagent01@gmail.com
   - Subject: New Evermore Life Website Lead
   - Include contact name, phone, email, source form, and submitted page.

3. Create / Update Opportunity
   - Pipeline: Insurance / Evermore Life pipeline
   - Stage: New Lead
   - Opportunity name: {{contact.first_name}} {{contact.last_name}} - Website Lead

4. Send Confirmation Email
   - To the lead
   - Subject: We received your Evermore Life quote request
   - Body: Thanks for requesting information from Evermore Life LLC. A licensed agent will review your request and follow up shortly. You can review our Privacy Policy at https://evermorelife.org/privacypolicy and Terms of Service at https://evermorelife.org/terms.

5. Wait
   - Wait 1 day

6. Add Task
   - Call new Evermore website lead
   - Due immediately or next business day

## 4. Do Not Add Yet

Do not add SMS actions until A2P is approved.

After approval, add SMS only inside an if/else branch:

If SMS consent is checked:

- Send short confirmation / appointment follow-up SMS.

If SMS consent is not checked:

- Use email and phone call only.

## 5. Test

Submit one real test lead from:

https://evermorelife.org/optin

Then confirm:

- Contact is created
- Phone and email saved correctly
- SMS consent field saved correctly
- Tags are added
- Opportunity is created
- Internal email arrives
- Confirmation email arrives
- Task is created

If all pass, turn the workflow from Draft to Publish.
