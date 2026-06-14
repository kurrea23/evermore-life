# 00_START_HERE — Codex Handoff
**This is the daily workspace and active task hub. Start here every session.**

## Current Guides 00-03 Handoff

Read `OPERATOR_STATE_UPDATE_2026-06-14.md` first for the current operator
correction to older cockpit assumptions.

Then read `GUIDES_00_03_COMPLETION_HANDOFF.md` for the verified June 13, 2026
state of the GHL foundation, live website, Meta Pixel, ads readiness, A2P hold,
nurture assets, Sarah flow, and booking calendar.

---

## If This Is Your First Time in This Repo

Read in this order:
1. `CODEX_MASTER_HANDOFF.md` (repo root) — full picture, all tasks, priorities
2. `SYSTEM_MAP.md` (repo root) — infrastructure status map
3. This file — daily workspace guide
4. Then go to whichever folder matches your task

---

## What's In active/

The `active/` folder is the live daily workspace. Everything symlinks back to the real file in its home folder.

| Folder | What it is | Codex Action |
|---|---|---|
| `active/rooms/A2P_REGISTRATION/` | A2P 10DLC SMS registration task | Check `HELPERS.md` for AI instructions; verify gaps with `02_ghl/CODEX_HANDOFF.md` Task E |
| `active/rooms/KEVIN_V2/` | Kevin AI v2 spec | Secondary priority — spec in `SPEC.md` |

---

## Active Rooms Status

### A2P_REGISTRATION
- **What:** Submit A2P 10DLC registration to allow SMS marketing via GHL
- **Why it matters:** SMS automations are blocked until this approves. Email nurture can run now, SMS cannot.
- **Files:** `active/rooms/A2P_REGISTRATION/README.md`, `HELPERS.md`, `YOU_DO_THIS.md`
- **Codex task:** Verify live URLs match the registration pack. Build gap report. See `02_ghl/CODEX_HANDOFF.md` Task E.

### KEVIN_V2
- **What:** Kevin AI v2 spec — secondary AI persona
- **Status:** Spec only — lower priority than ads and GHL
- **Files:** `active/rooms/KEVIN_V2/SPEC.md`

---

## Critical Path (What Needs to Happen in Order)

```
1. Controlled GHL lead test passes
      ↓
2. Meta Test Events confirms PageView, ViewContent, and Lead
      ↓
3. Email nurture is active in GHL
      ↓
4. First approved creative is ready
      ↓
5. First $10/day AZ and AR campaign launches
      ↓
6. EIN arrives → A2P submitted and approved
      ↓
7. SMS nurture sequence activated
      ↓
8. FIRST BOOKED CALL FROM OWN ADS
```

---

## Handoff Documents by Folder

Every major folder now has a `CODEX_HANDOFF.md` with specific tasks:

| Folder | Handoff File | Primary Tasks |
|---|---|---|
| `/` (root) | `CODEX_MASTER_HANDOFF.md` | Master task list, all priorities |
| `00_START_HERE/` | This file | Daily workspace, active rooms |
| `01_website/` | `01_website/CODEX_HANDOFF.md` | Deploy v2, pixel verify, new pages |
| `02_ghl/` | `02_ghl/CODEX_HANDOFF.md` | Webhook verify, Sarah AI flow, nurture sequences |
| `03_sales_marketing/` | `03_sales_marketing/CODEX_HANDOFF.md` | Tracker update, scoreboard |
| `04_content_narrative/` | `04_content_narrative/CODEX_HANDOFF.md` | Video prompts, social calendar, Meta upload package |
| `04_tools/` | `04_tools/CODEX_HANDOFF.md` | Script audit, pixel extension, cockpit metrics |

---

## Common Commands

```bash
# From repo root:
cd /Users/k9smac/Desktop/EVERMORE-LIFE

# Wire GHL webhook
./04_tools/scripts/wire_ghl_webhook.sh

# Wire Meta Pixel
./04_tools/scripts/wire_pixel.sh

# Deploy Sarah AI worker
./04_tools/scripts/deploy_sarah.sh

# Push morning cockpit update
python3 04_tools/cockpit_update/push_cockpit_update.py

# Security audit
rg -n "cfat_|GHL_API_TOKEN|Private Integration Token" . --glob '*.sh' --glob '*.html' --glob '*.js'

# Deploy Cloudflare Worker (v2 site)
npx wrangler deploy --config 01_website/v2/cloudflare/wrangler.live-proxy.jsonc

# Deploy funnel page to Cloudflare Pages
npx wrangler pages deploy 04_content_narrative/ --project-name evermore-funnel
```

---

## Business Context (Quick Reference)

- **Owner:** Lucidus (Kevin) — licensed life insurance agent
- **LLC:** Evermore Life Insurance LLC
- **Licensed states:** Arizona, Arkansas | Texas (pending)
- **GHL domain:** evermorelife.org
- **Products sold:** Term life, whole life, IUL, mortgage protection, final expense
- **Downline agents:** Kelsey, Amira (and others)
- **Goal:** Self-owned Facebook ad funnel → booked appointments → policies issued
- **Replace:** $31/lead agency model with owned leads at <$15/lead
- **Tools:** GoHighLevel, Cloudflare, Meta Ads, ElevenLabs, Runway ML, HeyGen
