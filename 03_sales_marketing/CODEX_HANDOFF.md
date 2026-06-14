# 03_sales_marketing — Codex Handoff
**Playbooks, ad scripts, and campaign tracking.**

---

## What's In Here

```
03_sales_marketing/
├── handoffs/
│   ├── EVERMORE_HANDOFF.md          → Full launch playbook (comprehensive)
│   ├── COWORK_HANDOFF.md            → Cowork session notes
│   └── imported_handoff/            → Older landing page import
└── playbooks/
    ├── Evermore_Life_Playbook.docx        → Master business playbook
    ├── Evermore_Video_Ad_Scripts.docx     → Original video ad scripts
    ├── Evermore_Meta_Funnel_Playbook.xlsx → Meta funnel tracking spreadsheet
    └── Evermore_Implementation_Tracker.xlsx → Implementation progress tracker
```

---

## Key Files

**`handoffs/EVERMORE_HANDOFF.md`** — The most comprehensive single document in the repo. Contains:
- Full system status
- GHL wiring steps
- A2P paste pack (exact copy for submission)
- Recommended GHL pipeline stages
- Recommended contact fields
- Ad creative angles (pre-campaign)
- Daily scoreboard metrics
- Open risks

**Read this before touching anything in GHL.**

---

## Tasks for Codex — This Folder

### Task A — Update DOCX playbooks with current campaign info
The `.docx` files contain older guidance (final expense focused, pre-IUL pivot).

Do not edit them directly. Use `04_tools/builders/build_playbook.py` to regenerate if needed.

Key updates needed in the playbook:
- Licensed states: Arizona, Arkansas (not California)
- Primary audiences: IUL/retirement (35–58), mortgage protection (28–50), final expense (50–75)
- Campaign name: Evermore Life Cinematic Legacy Campaign
- Funnel URL: [UPDATE WHEN LIVE]
- Sarah AI intake URL: [UPDATE WHEN LIVE]

### Task B — Update implementation tracker
`Evermore_Implementation_Tracker.xlsx` — mark completed items based on current system status.

Use `04_tools/builders/build_tracker.py` to regenerate if the Python script supports it.

If you need to update manually, open the file and check off:
- ✅ Website live
- ✅ GHL CRM live
- ✅ Sarah AI live
- 🔨 v2 website deployed
- 🔨 Funnel page hosted
- 📋 Meta Pixel verified
- 📋 Facebook ads live
- 📋 SMS nurture active
- 📋 Email nurture active
- 📋 A2P approved

### Task C — Build daily scoreboard template
Create a simple daily tracking sheet: `03_sales_marketing/DAILY_SCOREBOARD.md`

Metrics to track daily:
```
Date:
Ad spend today: $
Total clicks:
Funnel page visitors:
Sarah starts:
Form completions:
Appointments booked:
Calls made:
Contacts reached:
Appointments shown:
Quotes started:
Applications submitted:
Policies issued:
Estimated commission: $
Cost per lead: $
Cost per booked call: $
```

Include weekly summary row and a "what to do if CPL > $30" decision rule.

---

## Ad Campaign Reference

All finalized ad copy is in: `04_content_narrative/FACEBOOK_AD_CAMPAIGN_COMPLETE.md`

The original ad scripts in `Evermore_Video_Ad_Scripts.docx` are an older version. The current campaign supersedes them. Use the `04_content_narrative/` folder as the source of truth.

---

## The Three Audiences (Updated)

The playbook originally focused on final expense (older demographic). The campaign is now expanded:

**Primary — IUL/Retirement (ages 35–58)**
- Facebook Feed
- Hook: "Your life insurance might be able to fund your retirement"
- Higher premiums, higher commission

**Primary — Mortgage Protection (ages 28–50)**
- Facebook Feed + Instagram
- Hook: "What happens to your mortgage if something happens to you?"
- High relevance to homeowners

**Secondary — Final Expense (ages 50–75)**
- Facebook Feed (skews older)
- Hook: legacy stories, "give your family clarity"
- Lower premium, still worth running — Kelsey closed 12 deals this week on this audience
- Arkansas may convert well here — older demographic, less competition
