# SETUP GUIDE 00 — GHL Foundation
## Get your form, pipeline, and webhook actually wired and tested
**Do this FIRST before anything else. Nothing works until this is done.**

> **Current status, June 13, 2026:** Real form ID and pipeline verified, live
> form deployed, opportunities/tasks observed, and A2P screenshots captured.
> The controlled end-to-end non-SMS lead test remains. See
> `GUIDES_00_03_COMPLETION_HANDOFF.md`.

---

## What You're Doing in This Guide

1. Get your real GHL form ID
2. Replace the placeholder form ID in your website pages
3. Create your lead pipeline in GHL
4. Wire the GHL webhook so leads land in the CRM
5. Run a fake lead test to confirm it all works
6. Take screenshots for A2P submission

**Time estimate: 45–90 minutes**

---

## STEP 1 — Get Your Real GHL Form ID

You need the form ID from YOUR GHL account. Right now the pages have a copied placeholder ID.

1. Log into GoHighLevel
2. Go to: **Sites → Forms**
3. Find your lead capture form (or create one if it doesn't exist yet)
4. Click the form → Click **Integrate / Share**
5. You'll see an embed code like:
   ```
   src="https://api.leadconnectorhq.com/widget/form/XXXXXXXXXXXXXXXXX"
   ```
6. Copy that ID (the long string after `/form/`)
7. Write it here: `YOUR FORM ID: ___________________________`

**If you don't have a form yet:**
- Go to: **Sites → Forms → + New Form**
- Name it: `Evermore Life Lead Capture`
- Add these fields:
  - First Name (required)
  - Last Name (required)
  - Email (required)
  - Phone (required)
  - State (dropdown: AZ / AR / TX / Other)
  - Coverage Goal (dropdown: Protect my family / Retirement planning / Mortgage protection / Final expense / Not sure)
  - Health Status (dropdown: Excellent / Good / Fair / Have some conditions)
  - SMS Consent (checkbox — label: "I agree to receive SMS messages from Evermore Life. Message & data rates may apply. Reply STOP to opt out.")
- Save form → get the ID

---

## STEP 2 — Replace the Placeholder Form ID in Your Pages

Once you have your real form ID, we replace it in 3 files:

**File 1:** `01_website/v2/pages/optin.html`
- Open the file
- Find: `e8RIDTdhAVlc6CT9Zfj5` (appears 3 times)
- Replace all 3 with your real form ID

**File 2:** `01_website/retirement-planning-v2/pages/optin.html`
- Same — find and replace all instances of `e8RIDTdhAVlc6CT9Zfj5`

**File 3:** `04_content_narrative/FUNNEL_PAGE.html`
- Check if it has a GHL form — if not, we'll add one in Guide 02

**→ Tell me when you have your form ID and I'll make these edits for you automatically.**

---

## STEP 3 — Create Your Lead Pipeline in GHL

1. In GHL go to: **Opportunities → Pipelines → + New Pipeline**
2. Name it: `Evermore Life`
3. Add these stages IN ORDER:
   ```
   New Lead
   Called - No Answer
   Texted
   Contacted
   Appointment Booked
   No Show
   Quote Started
   Application Started
   Issued / Won
   Not Interested
   Bad Fit / Invalid
   ```
4. Save the pipeline

---

## STEP 4 — Create Your GHL Workflow (Lead Intake Automation)

1. In GHL go to: **Automation → Workflows → + New Workflow**
2. Name it: `Evermore Life — New Lead Intake`
3. Set trigger: **Form Submitted** → select your form from Step 1

**Add these workflow steps in order:**

**Step 1 — Create/Update Contact**
- Action: Contact → Create or Update
- Map fields: First Name, Last Name, Email, Phone, State, Coverage Goal, Health Status, SMS Consent

**Step 2 — Add Tag**
- Action: Tags → Add Tag
- Tag: `evermore-life-lead`

**Step 3 — Add Tag (Source)**
- Action: Tags → Add Tag
- Tag: `source-facebook` (change based on traffic source — use UTM source field if set up)

**Step 4 — Create Opportunity**
- Action: Opportunity → Create
- Pipeline: Evermore Life
- Stage: New Lead
- Name: `{{contact.firstName}} {{contact.lastName}} — Lead`

**Step 5 — Notify Owner**
- Action: Internal Notification
- Message: `🔔 New Lead: {{contact.firstName}} {{contact.lastName}} | {{contact.phone}} | State: {{contact.state}} | Goal: {{contact.coverageGoal}}`
- Send to: your email/phone

**Step 6 — Send Welcome Email**
- Action: Send Email
- From: your GHL connected email
- Subject: `You're one step closer — here's what happens next`
- Body: (see email templates in `02_ghl/launch_kit/snippets/` — or paste from Email 1 in SETUP_GUIDE_02)

**Step 7 — Create Call Task**
- Action: Task → Create Task
- Title: `Call {{contact.firstName}} NOW`
- Due: Immediately
- Assigned to: you

**Step 8 — IF/ELSE: SMS Consent**
- Condition: SMS Consent field = true
- IF YES → (leave empty for now — SMS goes here after A2P approval)
- IF NO → end

4. Save and **Publish** the workflow

---

## STEP 5 — Wire the GHL Webhook (for external pages)

This connects your Cloudflare-hosted pages to GHL so leads don't go nowhere.

1. In GHL go to: **Settings → Integrations → Webhooks** (or **Automation → Webhooks**)
2. Create a new inbound webhook
3. Copy the webhook URL — it looks like: `https://services.leadconnectorhq.com/hooks/XXXXX/webhook-trigger/XXXXX`
4. Write it here: `WEBHOOK URL: ___________________________`

5. Now run the wiring script from your terminal:
```bash
cd /Users/k9smac/Desktop/EVERMORE-LIFE
./04_tools/scripts/wire_ghl_webhook.sh
```
6. When prompted, paste your webhook URL
7. The script updates your pages automatically

---

## STEP 6 — The Fake Lead Test (DO NOT SKIP THIS)

This is the most important step. Do not run ads until this passes.

1. Open your live site: `https://evermorelife.org/optin`
2. Fill in the form with fake info:
   - Name: `Test Lead`
   - Email: `test@evermorelife.org`
   - Phone: your own cell number
   - State: AZ
   - Coverage Goal: Protect my family
   - Health: Good
   - SMS consent: checked
3. Submit the form
4. Check GHL → Contacts → confirm these ALL happened:
   - [ ] Contact `Test Lead` created
   - [ ] Email field populated
   - [ ] Phone field populated
   - [ ] Tag `evermore-life-lead` applied
   - [ ] Opportunity created in `New Lead` stage
   - [ ] You got an internal notification
   - [ ] Welcome email sent to test email
   - [ ] Call task created
   - [ ] NO SMS sent (correct — A2P not approved yet)
5. Delete the test contact after

**If any of these fail → stop and fix before moving to next guide.**

---

## STEP 7 — Screenshot for A2P

While evermorelife.org is live and the form is working, take these screenshots:

1. Screenshot of the optin page showing the form AND the SMS consent checkbox
2. Screenshot of the SMS consent checkbox text (zoomed in)
3. Screenshot of the privacy page URL bar + page content
4. Screenshot of the terms page URL bar + page content

Save these in a folder called `A2P_Screenshots` on your desktop. You'll need them in Guide 03.

---

## ✅ GUIDE 00 COMPLETE WHEN:
- [ ] Real GHL form ID is in your pages
- [ ] Pipeline exists with all stages
- [ ] Workflow is published and active
- [ ] Fake lead test passes all 9 checks
- [ ] Screenshots taken

**→ Then go to SETUP_GUIDE_01_WEBSITE_AND_PIXEL.md**
