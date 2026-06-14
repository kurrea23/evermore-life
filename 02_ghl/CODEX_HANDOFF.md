# 02_ghl — Codex Handoff
**Everything GoHighLevel — wiring, workflows, SMS, email, Sarah AI, A2P.**

---

## What's In Here

```
02_ghl/
├── launch_kit/          → Step-by-step GHL build docs (numbered in order)
├── docs/                → GHL setup guide, SMS/email templates
├── private_integration/ → Python helper for GHL API (local only, do not put in HTML)
└── relay_worker/        → Cloudflare Worker for server-side GHL lead relay (parked)
```

### launch_kit/ — Read in This Order

| # | File | What it is |
|---|---|---|
| 00 | `README.md` | Start here — build order overview |
| 01 | `live-build-runbook.md` | Step-by-step GHL build instructions |
| 02 | `page-build-guide.md` | How to build pages in GHL |
| 03 | `native-form-field-map.md` | All form fields and GHL field names |
| 04 | `workflow-blueprint.md` | GHL automation workflow structure |
| 05 | `form-workflow-next-steps.md` | What happens after form submission |
| 06 | `a2p-registration-pack.md` | A2P 10DLC submission pack (paste-ready) |
| 07 | `a2p-messaging-use-case-paste.md` | Exact copy to paste into A2P form |
| 08 | `a2p-sample-messages.csv` | Sample SMS messages for A2P |
| 09 | `chatgpt-handoff-a2p-update.md` | A2P update notes |
| 10 | `test-checklist.md` | Pre-launch test checklist |

### paste-ready/
Files built to paste directly into GHL:
- `ghl-copy-station.html` — all page copy in one place
- `global-chat-widget-code.html` — chat widget embed code
- `privacy-ghl-custom-html.html` — privacy page HTML for GHL
- `terms-ghl-custom-html.html` — terms page HTML for GHL
- `thank-you-ghl-custom-html.html` — thank-you page HTML for GHL

### snippets/
- `home-copy.md` — home page copy
- `optin-copy.md` — opt-in page copy
- `thank-you-copy.md` — thank-you page copy
- `privacy-copy.md` — privacy page copy
- `terms-copy.md` — terms page copy
- `optional-ghl-custom-css.css` — optional style overrides

---

## Current GHL Status

| Item | Status | Action Needed |
|---|---|---|
| GHL account | ✅ LIVE | — |
| evermorelife.org domain | ✅ LIVE | — |
| Website pages | ✅ LIVE | v2 upgrade pending |
| Sarah AI bot | ✅ LIVE | Full conversation tree needed |
| Lead pipeline | ✅ LIVE | Verify stages match recommended list |
| GHL webhook wired | ❓ VERIFY | Run `04_tools/scripts/wire_ghl_webhook.sh` and test |
| A2P 10DLC | ❓ IN PROGRESS | Submit with `a2p-registration-pack.md` |
| SMS automations | ⛔ HOLD | Cannot send marketing SMS until A2P approved |
| Email automations | ✅ CAN SEND | Not gated by A2P |
| 5-day SMS nurture | 📋 NOT BUILT | Build after A2P approval |
| 5-email nurture | 📋 NOT BUILT | Build now (not gated) |

---

## Tasks for Codex — This Folder

### Task A — Verify GHL webhook end-to-end
1. Open `01_website/current/optin.html` and check for `window.EVERMORE_CONFIG.ghlWebhookUrl`
2. If blank or localhost, the webhook is not wired
3. Run: `04_tools/scripts/wire_ghl_webhook.sh`
4. Paste in the GHL inbound webhook URL from GHL → Settings → Integrations → Webhooks
5. Test: Submit a fake lead from the live optin page at evermorelife.org
6. Verify in GHL: contact created, tag `evermore-life-lead` applied, opportunity in `New Lead` stage, owner notified
7. Check off items in `launch_kit/test-checklist.md`
8. Document result in `launch_kit/test-checklist.md`

### Task B — Build full GHL workflow (automation)
Based on `launch_kit/workflow-blueprint.md`, build a complete GHL workflow spec:

**Trigger:** New contact via form/webhook submission

**Workflow steps (in order):**
1. Create contact (map all fields from `native-form-field-map.md`)
2. Add tag: `evermore-life-lead`
3. Add tag: `source-[utm_source]` (dynamic)
4. Create opportunity: pipeline = "Evermore Life", stage = "New Lead"
5. Assign owner (Lucidus)
6. Send internal notification: "New lead: [First Name] [Last Name] — [Phone] — [State] — Goal: [Coverage Goal]"
7. Send email: Welcome email (use `EMAIL_NURTURE_SEQUENCE.md` Email 1 when built)
8. Create task: "Call [First Name] within 5 minutes" — due: now
9. Wait: IF SMS consent = true AND A2P approved → send SMS Day 1
10. Wait 24 hours → SMS Day 2 (if consented + A2P)
11. Wait 48 hours → SMS Day 3
12. Wait 96 hours → SMS Day 5

Output: `02_ghl/launch_kit/GHL_WORKFLOW_COMPLETE_SPEC.md`
Format as numbered steps Lucidus can follow inside GHL's workflow builder.

### Task C — Build 5-email nurture sequence
Not gated by A2P. Can go live immediately.

**Email 1 (immediate):** Subject: "You took the first step — here's what happens next"
- Warm welcome from Sarah
- "Here's exactly what we do: ask a few questions, compare your options, connect you with a licensed broker"
- Booking link: `[CALENDLY_LINK]`
- Compliance footer

**Email 2 (day 2):** Subject: "Term, IUL, final expense — which one are you?"
- Plain English breakdown of the 3 main coverage types
- "It depends on your age, health, goals, and budget — here's a quick guide"
- CTA: "Find out which fits you" → booking link

**Email 3 (day 3):** Subject: "What actually affects your premium"
- 3 factors: age, health, type of coverage
- "The sooner you look, the more options you have"
- CTA: booking link

**Email 4 (day 5):** Subject: "How Evermore Life works (and what we're NOT)"
- "We're a brokerage, not a single carrier — we compare options from multiple companies"
- "Our job is to match the right coverage to your situation, not push one product"
- Trust builder
- CTA: booking link

**Email 5 (day 7):** Subject: "Still thinking about it? Totally fine."
- Soft close: "No pressure. Just wanted to make sure you had everything you need."
- FAQ: "What if I have health issues?" "What if I can't afford it?"
- Final CTA: booking link
- "You can always reply to this email too — I check it."

Output: `02_ghl/launch_kit/EMAIL_NURTURE_SEQUENCE.md`

### Task D — Build 5-day SMS nurture sequence (build now, activate after A2P)
Reference: `a2p-registration-pack.md` for compliant language

**Day 1 (1 hour after form):**
"Hi [FirstName], it's Sarah with Evermore Life! You started a coverage review — want to pick a quick time to finish it? [LINK] Reply STOP to opt out."

**Day 2 (next morning):**
"Hey [FirstName], Sarah here. Most families are underinsured — took 2 min to see where you stand: [LINK] Reply STOP anytime."

**Day 3:**
"[FirstName] — a lot of people think they can't afford coverage. Term life can start around the cost of a coffee/day. See what fits: [LINK] Reply STOP to opt out."

**Day 5:**
"Hey [FirstName], last follow-up from Sarah at Evermore Life. Ready when you are: [LINK] — or just reply and I'll help. Reply STOP to opt out, HELP for help."

Output: `02_ghl/launch_kit/SMS_NURTURE_SEQUENCE.md`

### Task E — A2P registration verification
1. Open `launch_kit/a2p-registration-pack.md`
2. Check each item against what's currently live at evermorelife.org
3. Confirm: opt-in URL live, privacy URL live, terms URL live, sample messages match current SMS templates
4. Flag any gaps as a list in `launch_kit/A2P_GAP_REPORT.md`
5. If all green: document as ready for submission

---

## GHL Pipeline Stages — Use Exactly These

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

## GHL Contact Fields — Required

```
First Name
Last Name
Email
Phone
State (AZ / AR / TX)
Age Range (25-34 / 35-44 / 45-54 / 55-64 / 65+)
Coverage Goal (Protect my family / Retirement planning / Mortgage protection / Final expense / Not sure)
Health Status (Excellent / Good / Fair / Have some conditions)
Tobacco Use (Yes / No)
Preferred Contact Time
SMS Consent (true/false)
SMS Consent Text (exact checkbox copy)
SMS Consent Timestamp
Source Page
UTM Source
UTM Medium
UTM Campaign
UTM Content
```

## Security Rules

- Never put GHL Private Integration Token in HTML/JS files
- Use GHL inbound webhook (public URL) for form submissions
- If server-side API is needed, use `relay_worker/ghl_lead_relay_worker.js` (Cloudflare Worker with secret stored in Worker environment)
- Private Integration helper: `private_integration/ghl_private_integration.py` — local use only
