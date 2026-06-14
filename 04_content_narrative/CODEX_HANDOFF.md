# 04_content_narrative — Codex Handoff
**This folder is the entire Facebook ad campaign, content system, and narrative bible.**

---

## What's In Here

| File | What it is | Status |
|---|---|---|
| `FACEBOOK_AD_CAMPAIGN_COMPLETE.md` | ⭐ ALL ad copy written — 9 ads, 3 campaigns, retargeting map, IUL pivot | READY TO USE |
| `NARRATIVE_BIBLE.md` | Brand voice, story engine, core lines, what to never say | READ FIRST |
| `RETARGETING_MAP.md` | 5-bucket retargeting strategy with audience build instructions | READY |
| `EXECUTION_PLAN.md` | Week-by-week launch roadmap with budgets and tool costs | READY |
| `GHL_SARAH_AI_FLOW.md` | Sarah AI conversation outline | OUTLINE ONLY — needs full tree |
| `COMPLIANCE_CHECKLIST.md` | What every ad/page must include | REQUIRED READING |
| `FUNNEL_PAGE.html` | Campaign funnel page | BUILT — NEEDS HOSTING |
| `CAMPAIGN_COCKPIT.html` | Campaign tracking dashboard | LOCAL ONLY |
| `PRODUCTION_CHECKLIST.md` | Phase-by-phase execution checklist | USE THIS |
| `AI_VIDEO_PROMPTS.md` | AI video generation prompts | PARTIAL — needs expansion |

### imported_campaign/Evermore_Life_Cinematic_Legacy_Campaign/
The full original campaign document set. **Do not edit these** — they are the source of truth.

| File | What it is |
|---|---|
| `01_Narrative_Bible.md` | Story engine, emotional formula, brand voice |
| `02_Ideal_Client_Map.md` | ICP1 (family protector 30–55), ICP2 (final expense 50–80), messaging ladder |
| `03_Content_System.md` | 3-layer content architecture, 30-day batch, posting rhythm |
| `04_Hero_Video_Script.md` | Full Soccer Dad 3–5 min hero video script |
| `05_Short_Form_Storyboards.md` | 7 short-form video scripts (30–60 sec each) |
| `06_Funnel_Page_Copy_and_Wireframe.md` | Funnel page wireframe and copy |
| `07_GHL_AI_Appointment_Flow.md` | GHL Sarah AI flow outline |
| `08_Retargeting_Map.md` | 5-bucket retargeting system |
| `09_Execution_Form.md` | Phase-by-phase build checklist |
| `10_AI_Footage_Prompt_Pack.md` | AI video prompts (Runway, Midjourney) |
| `11_Compliance_Checklist.md` | Ad/page compliance rules |

### ad_campaign_scaffold/
| File | What it is |
|---|---|
| `campaign_matrix.md` | Creative ID table — TOF/MOF/BOF ad tracking |
| `creative_output_tracker.md` | Track which creatives are built vs. live |
| `higgsfield_mcp_brief.md` | AI video tool brief |

---

## Tasks for Codex — This Folder

### Task A — Build complete video production prompt pack
All 7 short-form videos from `05_Short_Form_Storyboards.md` need:
- Scene-by-scene Runway ML prompts (5–8 sec clips, cinematic, warm, realistic)
- ElevenLabs voiceover text formatted for paste (voice: warm male, measured, 0.85x)
- Midjourney thumbnail prompt (warm-toned, single text overlay)
- HeyGen script for any talking-head segments

Output: `04_content_narrative/VIDEO_PRODUCTION_PROMPTS_COMPLETE.md`

Format each video as:
```
## Video [N] — [Title]
### Runway Prompts (Scene by Scene)
Scene 1: [prompt]
Scene 2: [prompt]
...
### ElevenLabs Voiceover
[full voiceover text]
### Midjourney Thumbnail
[prompt]
### HeyGen Script (if applicable)
[script]
```

### Task B — Build 30-day organic social content calendar
- 30 posts across TikTok, Instagram Reels, Facebook
- Mix: 40% emotional story, 35% education, 25% trust
- Use caption formula from `03_Content_System.md`: Hook → Story → Bridge → CTA
- IUL/retirement angle for Facebook (ages 40–58)
- Final expense for Facebook (ages 50–75)
- Story/legacy for TikTok/Reels (ages 28–50)
- Include hashtag sets per platform

Output: `04_content_narrative/ORGANIC_CONTENT_CALENDAR_30DAY.md`

### Task C — Build Meta Ads Manager upload package
All 9 ads from `FACEBOOK_AD_CAMPAIGN_COMPLETE.md` formatted for direct paste into Meta:
- Character counts verified (primary text: no hard limit but 125 preview; headline: 40 max; description: 30 max)
- Creative notes per ad
- Audience targeting specs per ad set
- Campaign structure laid out for Meta's interface

Output: `04_content_narrative/META_ADS_UPLOAD_PACKAGE.md`

### Task D — Build full GHL Sarah AI conversation tree
Expand `GHL_SARAH_AI_FLOW.md` into a complete paste-ready workflow.

Must include:
- Opening message (Sarah intro)
- Qualification branch: Final Expense path vs. IUL/Retirement path vs. Mortgage Protection path
- Age gating: if under 30 → term/mortgage protection; 30–55 → IUL or term; 50+ → final expense option
- Health question (simplified — not a full health history)
- Budget question
- Objection handlers: "I already have coverage," "I can't afford it," "I have health issues," "I need to think about it"
- Booking prompt with calendar link placeholder `[CALENDLY_LINK]`
- Fallback: "Want me to have someone call you?"
- STOP handling and unsubscribe language

Output: `04_content_narrative/GHL_SARAH_FULL_CONVERSATION_TREE.md`

### Task E — Host FUNNEL_PAGE.html
- Deploy `FUNNEL_PAGE.html` to Cloudflare Pages
- Command: `npx wrangler pages deploy 04_content_narrative/ --project-name evermore-funnel`
- OR copy into GHL funnel builder if preferred
- After hosting, update all CTA hrefs in the page to point to real Sarah intake URL
- Update `SYSTEM_MAP.md`

---

## Compliance Rules — Never Skip These

Every piece of content from this folder must include:

> Coverage options vary by age, health, state, carrier, and eligibility. Not all applicants qualify.

IUL-specific content must add:

> This is educational content only. Not financial advice. IUL products are complex. Consult a licensed professional.

States licensed: **Arizona, Arkansas** | Texas (pending). Do not reference California.
