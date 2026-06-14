# EVERMORE LIFE — CODEX MASTER HANDOFF
**Last updated:** June 2026  
**Owner:** Lucidus (kurrea7@gmail.com)  
**Business:** Evermore Life Insurance LLC  
**Operator-confirmed service states:** Arizona, Texas | Arkansas (pending)  
**GHL domain:** evermorelife.org  
**Tagline:** *Your legacy moves on. Be there evermore.*

---

## WHO YOU ARE TALKING TO

You are Codex. You are working inside the EVERMORE-LIFE repo on behalf of Lucidus, who runs a life insurance brokerage. He is the agent. He sells term life, whole life, IUL (Indexed Universal Life), mortgage protection, and final expense insurance. He works with a downline of agents (Kelsey, Amira, others).

**The business goal:** Replace paid lead vendors ($31/lead, low contact rate) with a self-owned Facebook ad funnel that generates booked appointments for less money, with better lead quality, on a system Lucidus owns completely.

**The tech stack:**
- GoHighLevel (GHL) — CRM, website hosting, automations, Sarah AI
- Cloudflare — Workers (mobile cockpit), Pages (potential funnel hosting)
- Meta Ads Manager — Facebook/Instagram ads
- evermorelife.org — primary domain on GHL
- This repo — all code, copy, scripts, handoff docs

---

## REPO STRUCTURE — WHAT EACH FOLDER IS

```
EVERMORE-LIFE/
├── 00_START_HERE/          → Daily workspace, active rooms, cockpit
├── 01_website/             → All website versions (current live, v2, experiments)
├── 02_ghl/                 → GHL launch kit, workflows, relay worker, docs
├── 03_sales_marketing/     → Playbooks, handoffs, ad scripts
├── 04_content_narrative/   → THE AD CAMPAIGN — all scripts, copy, retargeting map
├── 04_tools/               → Deploy scripts, builders, cockpit updater
├── 05_exports_archive/     → Archived packages, sprite assets
├── cockpit-os/             → Cockpit OS system (multi-project dashboard)
├── internal_app/           → Cloudflare Worker source (mobile cockpit)
├── SYSTEM_MAP.md           → Full infrastructure map with status icons
├── CODEX_MASTER_HANDOFF.md → THIS FILE
└── [root HTML files]       → Legacy/archived pages
```

---

## SYSTEM STATUS — WHAT IS LIVE VS. WHAT NEEDS WORK

| Component | Status | Notes |
|---|---|---|
| evermorelife.org | ✅ LIVE | Hosted on GHL |
| GHL CRM | ✅ LIVE | Contacts, pipeline, workflows |
| Sarah AI (GHL) | ✅ LIVE | Lead engagement bot in GHL |
| Cloudflare cockpit worker | ✅ LIVE | Mobile dashboard at evermore-internal-app.*.workers.dev |
| Website v1 (current) | ✅ LIVE | `01_website/current/` — on GHL |
| Website v2 | 🔨 BUILT, NOT DEPLOYED | `01_website/v2/pages/` — needs GHL or CF Pages deployment |
| Retirement planning v2 | 🔨 BUILT, NOT DEPLOYED | `01_website/retirement-planning-v2/` |
| Funnel page (campaign) | 🔨 BUILT, NOT HOSTED | `04_content_narrative/FUNNEL_PAGE.html` — needs a URL |
| Meta Pixel | ❓ VERIFY | Wire script exists, confirm it's in live pages |
| GHL webhook | ❓ VERIFY | `wire_ghl_webhook.sh` exists, confirm it's wired |
| Facebook Ad campaigns | 📋 NOT LAUNCHED | All copy ready in `04_content_narrative/FACEBOOK_AD_CAMPAIGN_COMPLETE.md` |
| A2P 10DLC SMS | ❓ IN PROGRESS | Registration pack in `02_ghl/launch_kit/a2p-registration-pack.md` |
| GHL Sarah AI flow | 🔨 OUTLINED | `04_content_narrative/GHL_SARAH_AI_FLOW.md` — needs full conversation tree |
| SMS nurture sequence | 📋 NOT BUILT | Needs to be written and loaded into GHL |
| Lead magnet / IUL content | 📋 NOT BUILT | Retirement planning angle, new audience segment |

---

## THE #1 PRIORITY RIGHT NOW

**Get the funnel live end-to-end so ads can launch.**

The sequence that has to work before spending a dollar on ads:

```
Facebook Ad → Funnel Page (hosted URL) → Sarah AI intake → 
  → GHL contact created → Workflow fires → SMS/email sent → 
  → Appointment booked → Lucidus closes
```

Right now the gap is: Funnel page has no hosted URL, and the full GHL Sarah AI conversation flow isn't built as a paste-ready workflow.

---

## TASK LIST FOR CODEX — ORDERED BY PRIORITY

### PRIORITY 1 — Get Funnel Live

**Task 1.1 — Deploy FUNNEL_PAGE.html**
- File: `04_content_narrative/FUNNEL_PAGE.html`
- Options: A) Deploy to Cloudflare Pages (fastest, free), B) Deploy to GHL as a funnel page
- Cloudflare Pages: run `npx wrangler pages deploy 04_content_narrative/ --project-name evermore-funnel`
- Confirm live URL, update all CTA links in the page to point to Sarah intake
- Update `SYSTEM_MAP.md` status from 🔨 to ✅

**Task 1.2 — Verify Meta Pixel is in all live pages**
- Check `01_website/current/index.html`, `optin.html`, `thank-you.html` for `fbq` pixel code
- If missing, run `04_tools/scripts/wire_pixel.sh` with correct Pixel ID
- Pixel events that must fire: `PageView` (all pages), `Lead` (thank-you page), `CompleteRegistration` (booking confirmation)
- Add pixel to `04_content_narrative/FUNNEL_PAGE.html` as well

**Task 1.3 — Verify GHL webhook is wired**
- Check `01_website/current/optin.html` for `window.EVERMORE_CONFIG.ghlWebhookUrl`
- If it's blank or localhost, run `04_tools/scripts/wire_ghl_webhook.sh`
- Submit a test lead from the live domain and confirm: contact created in GHL, tag applied, opportunity created, workflow fires
- Document test result in `02_ghl/launch_kit/test-checklist.md`

**Task 1.4 — Deploy Website v2**
- Files: `01_website/v2/pages/`
- Preferred: Deploy via Cloudflare Pages using `01_website/v2/cloudflare/wrangler.live-proxy.jsonc`
- Command: `npx wrangler deploy --config 01_website/v2/cloudflare/wrangler.live-proxy.jsonc`
- Or: Copy pages into GHL funnel builder manually
- Update `SYSTEM_MAP.md`

---

### PRIORITY 2 — Build GHL Sarah AI Full Conversation Flow

**Task 2.1 — Build the full Sarah AI conversation tree**
- Reference: `04_content_narrative/GHL_SARAH_AI_FLOW.md` (outline exists)
- Reference: `04_content_narrative/imported_campaign/Evermore_Life_Cinematic_Legacy_Campaign/07_GHL_AI_Appointment_Flow.md`
- Build a complete paste-ready GHL workflow document covering:
  - Welcome message (Sarah intro)
  - Qualification questions: age, state, health status, coverage goal, tobacco use, budget range
  - Branch: Final Expense path (ages 50+) vs. IUL/Retirement path (ages 35–55) vs. Mortgage Protection path
  - Objection handling branches: "I already have coverage," "I can't afford it," "I have health issues"
  - Booking prompt with Calendly/GHL calendar link
  - Fallback: "Would you like me to have someone call you?"
  - STOP/unsubscribe handling
- Output: `02_ghl/launch_kit/SARAH_AI_FULL_CONVERSATION_FLOW.md`

**Task 2.2 — Build 5-day SMS lead nurture sequence**
- For leads who submit form but don't book
- Compliant with A2P requirements (already referenced in `02_ghl/launch_kit/a2p-registration-pack.md`)
- Day 1 (1 hour after): "Hey [name], it's Sarah from Evermore Life. You started a coverage review — want to pick a time to finish it? [booking link]"
- Day 2 (next morning): Education message — "Did you know most families are underinsured by 50%? Here's a quick way to check your situation: [link]"
- Day 3: Objection crusher — "A lot of people think they can't afford life insurance. But term coverage can start at less than a coffee a day. Want to see what fits your budget? [link]"
- Day 5: Final follow-up — "Still thinking about it? No rush. Just wanted to make sure you had everything you need. [booking link] — Reply STOP anytime."
- Output: `02_ghl/launch_kit/SMS_NURTURE_SEQUENCE.md`

**Task 2.3 — Build email nurture sequence**
- Parallel to SMS, 5 emails over 7 days
- Email 1: "You took the first step — here's what happens next"
- Email 2: "The difference between term, IUL, and final expense (plain English)"
- Email 3: "What affects your life insurance premium"
- Email 4: "How Evermore Life compares your options"  
- Email 5: "Ready when you are — [booking link]"
- Output: `02_ghl/launch_kit/EMAIL_NURTURE_SEQUENCE.md`

---

### PRIORITY 3 — Facebook Ad Campaign Launch Prep

**Task 3.1 — Build Facebook Ad upload package**
- Reference: `04_content_narrative/FACEBOOK_AD_CAMPAIGN_COMPLETE.md` (all copy is written)
- Create a structured upload document: `04_content_narrative/META_ADS_UPLOAD_PACKAGE.md`
- For each ad, format exactly as Meta Ads Manager expects:
  - Campaign name
  - Ad set name (audience + targeting notes)
  - Ad name
  - Primary text (character count — keep under 125 chars for preview)
  - Headline (max 40 chars)
  - Description (max 30 chars)
  - CTA button
  - Creative notes (what video/image to use)
  - Destination URL
- Include the 3 campaign structures (TOF/MOF/BOF) with audience build instructions

**Task 3.2 — Write AI video production prompts**
- Reference: `04_content_narrative/imported_campaign/Evermore_Life_Cinematic_Legacy_Campaign/10_AI_Footage_Prompt_Pack.md`
- Reference: `04_content_narrative/AI_VIDEO_PROMPTS.md`
- For each of the 7 short-form storyboards in `05_Short_Form_Storyboards.md`:
  - Write scene-by-scene Runway ML prompts
  - Write ElevenLabs voiceover text (formatted for paste)
  - Write HeyGen talking-head script if applicable
  - Write Midjourney thumbnail prompt
- Output: `04_content_narrative/VIDEO_PRODUCTION_PROMPTS_COMPLETE.md`

**Task 3.3 — Build organic social content calendar**
- 30 days of posts: hooks, captions, platform (TikTok/Reels/Facebook)
- Mix: 40% emotional story, 35% education, 25% trust/process
- Reference the messaging ladder from `02_Ideal_Client_Map.md`
- IUL/retirement content for Facebook (older demographic)
- Final expense content for Facebook (50–75)
- Story/legacy content for TikTok/Reels (28–50)
- Output: `04_content_narrative/ORGANIC_CONTENT_CALENDAR_30DAY.md`

---

### PRIORITY 4 — Infrastructure Polish

**Task 4.1 — Update SYSTEM_MAP.md**
- After each completed task above, update status icons in `SYSTEM_MAP.md`
- Add new components: retirement-planning-v2, funnel page URL, ad campaigns

**Task 4.2 — Consolidate cockpit-os duplicates**
- There are 4 copies of the cockpit-os folder (untitled folder, untitled folder copy, nested versions)
- Keep: `cockpit-os/cockpit-os/untitled folder/` as canonical
- Archive or delete the duplicate copies
- Do NOT delete any unique content — diff first

**Task 4.3 — A2P Registration completion**
- Reference: `02_ghl/launch_kit/a2p-registration-pack.md`
- Verify all 10 checklist items in `11_Compliance_Checklist.md` are met
- Confirm live URLs match what's in the A2P pack
- Flag any gaps for Lucidus to fix manually in GHL

**Task 4.4 — Security audit**
- Run: `rg -n "cfat_|GHL_API_TOKEN|Private Integration Token" /Users/k9smac/Desktop/EVERMORE-LIFE --glob '*.sh' --glob '*.html' --glob '*.js'`
- Report any exposed secrets
- Confirm no credentials are hardcoded anywhere

---

### PRIORITY 5 — New Content Builds (Lower Priority, High Value)

**Task 5.1 — Build IUL/Retirement landing page variant**
- Based on `01_website/retirement-planning-v2/pages/index.html`
- Optimize headline and CTA for retirement/IUL angle: "Is Your Life Insurance Working as Hard as You Are?"
- Add IUL explainer section (what it is, how cash value works, who it's for)
- Keep compliance disclaimer
- Target audience: ages 35–58, AZ/AR/TX

**Task 5.2 — Build mortgage protection landing page variant**
- New page targeting homeowners
- Headline: "What Happens to Your Mortgage If Something Happens to You?"
- Simple 3-step explainer
- Sarah AI intake CTA
- Output: `01_website/v2/pages/mortgage-protection.html`

**Task 5.3 — Update Sarah AI persona page**
- Reference: `01_website/v2/pages/sarah.html`
- Update copy to reflect full product range (not just final expense)
- Add IUL and retirement planning to Sarah's intro
- Make booking CTA more prominent

---

## FILES CODEX SHOULD READ FIRST

In order:

1. `SYSTEM_MAP.md` — full infrastructure picture
2. `00_START_HERE/README.md` — daily workspace guide
3. `04_content_narrative/FACEBOOK_AD_CAMPAIGN_COMPLETE.md` — the finished ad campaign
4. `04_content_narrative/imported_campaign/Evermore_Life_Cinematic_Legacy_Campaign/08_Retargeting_Map.md` — retargeting strategy
5. `02_ghl/launch_kit/README.md` — GHL build order
6. `03_sales_marketing/handoffs/EVERMORE_HANDOFF.md` — full launch playbook
7. `04_content_narrative/imported_campaign/Evermore_Life_Cinematic_Legacy_Campaign/02_Ideal_Client_Map.md` — who we're targeting

---

## THINGS CODEX SHOULD NEVER DO

- Do not delete any file without explicit instruction
- Do not hardcode API keys, tokens, or secrets into HTML or JS files
- Do not change the GHL webhook URL without running it through `wire_ghl_webhook.sh`
- Do not deploy to production without confirming the test lead flow works first
- Do not modify `03_sales_marketing/playbooks/*.docx` or `*.xlsx` files directly — use the Python builders in `04_tools/builders/` instead
- Do not add California to the service states. The current operator-confirmed
  state-page status is Arizona and Texas active, Arkansas pending. Verify live
  workflow routing before traffic.

---

## COMPLIANCE RULES (NON-NEGOTIABLE)

All ad copy, landing pages, emails, and SMS must:
- Include: "Coverage options vary by age, health, state, carrier, and eligibility. Not all applicants qualify."
- Never claim guaranteed approval
- Never use exact pricing without full context (age, health, state, product)
- Never say "everyone qualifies"
- Always include STOP/HELP language in SMS
- Always link to Privacy Policy and Terms pages
- Use Special Ad Category "Credit" in Meta Ads Manager for insurance ads

Full compliance checklist: `04_content_narrative/imported_campaign/Evermore_Life_Cinematic_Legacy_Campaign/11_Compliance_Checklist.md`

---

## KEY CREDENTIALS (DO NOT STORE IN CODE — REFERENCE ONLY)

- GHL webhook URL: set via `04_tools/scripts/wire_ghl_webhook.sh`
- Cloudflare account: credentials in `.wrangler/cache/wrangler-account.json` (gitignored)
- Meta Pixel ID: set via `04_tools/scripts/wire_pixel.sh`
- Cockpit update config: `04_tools/cockpit_update/cockpit_update.config.json` (gitignored)

---

## DONE = DEFINITION OF SUCCESS

The system is "done" (Phase 1) when:

1. ✅ Funnel page has a live URL
2. ✅ Test lead flows from funnel → GHL → Sarah AI → booked appointment
3. ✅ Meta Pixel fires on all key pages
4. ✅ Facebook ad campaigns are live (even at $10/day)
5. ✅ Sarah AI conversation flow is complete and tested in GHL
6. ✅ 5-day SMS + email nurture sequence is active in GHL
7. ✅ Organic social content is scheduled for 2 weeks

When all 7 are green, the machine is running. Everything after that is optimization.
