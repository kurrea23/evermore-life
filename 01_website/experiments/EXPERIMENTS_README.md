# Experiments Folder — Quick Reference
*EVERMORE-LIFE/01_website/experiments/*
*Last updated: May 2026*

This folder is a workbench. It contains local HTML files used as desktop cockpits, character experiments, and UI prototypes. None of these files are deployed to evermorelife.org — they run locally in your browser.

---

## File Status at a Glance

| File | Status | Purpose |
|---|---|---|
| EVERMORE_COCKPIT_v2.html | ✅ ACTIVE | Main desktop mission cockpit — **use this one** |
| EVERMORE_COCKPIT.html | ✅ ACTIVE | Mission cockpit v1 — functional, but v2 is newer |
| KVN.html | ✅ ACTIVE | KVN knight sprite companion — embed into cockpit |
| Sarah_Evermore_AI.html | ✅ ACTIVE | Sarah AI persona page |
| EVERMORE_COCKPIT_VISIONPRO.html | 🗄️ ARCHIVED | Vision Pro layout experiment — not in active use |
| kevin_v2.html | ⛔ SUPERSEDED | 3D Kevin character — replaced by KVN.html sprite approach |
| evermore-landing.html | 🗄️ ARCHIVED | Old landing page experiment |
| Evermore_Landing_Page.html | 🗄️ ARCHIVED | Old landing page experiment (duplicate/variant) |

---

## Detail on Each File

### ✅ EVERMORE_COCKPIT_v2.html — ACTIVE (primary)
The main desktop planning interface for the Evermore mission. Step-by-step rooms, task tracking, mission status. This is what you open on your computer to work through Evermore. Newer than v1 — prefer this.

### ✅ EVERMORE_COCKPIT.html — ACTIVE (v1)
The original version of the mission cockpit. Still functional. Use v2 instead unless v2 is broken or you need to reference v1's layout.

### ✅ KVN.html — ACTIVE
KVN is the knight sprite companion — a pixel-art character built to be embedded as a companion element in the cockpit UI. Just built. The intended next step is to embed KVN into `EVERMORE_COCKPIT_v2.html`.

### ✅ Sarah_Evermore_AI.html — ACTIVE
Sarah Evermore AI persona page. Used for the AI-driven lead conversion flow — Sarah is the AI that engages leads from evermorelife.org and books appointments.

### 🗄️ EVERMORE_COCKPIT_VISIONPRO.html — ARCHIVED
An experimental layout designed for Apple Vision Pro spatial UI. Not being actively developed. Keep for reference; don't build on it.

### ⛔ kevin_v2.html — SUPERSEDED
An older attempt at a 3D Kevin character. The approach was replaced by the KVN sprite approach (KVN.html). This file is kept for reference but should not be developed further.

### 🗄️ evermore-landing.html — ARCHIVED
An early landing page prototype. The current live landing page is deployed via GHL at evermorelife.org. A polished v2 exists in `01_website/v2/pages/`. This file is obsolete.

### 🗄️ Evermore_Landing_Page.html — ARCHIVED
Another early landing page variant. Same situation as evermore-landing.html — superseded by the live GHL site and the v2 build. Keep for reference only.

---

## What Lives Where (context)

- **Live website** → `01_website/current/` → deployed to evermorelife.org via GHL
- **Website v2 (undeployed)** → `01_website/v2/pages/` → built by Codex, not yet live
- **This folder (experiments)** → local cockpits and prototypes, never deployed
- **Mobile cockpit** → Cloudflare Worker at https://evermore-internal-app.evermore-life-az.workers.dev

---

## Next Actions for This Folder

- [ ] Embed KVN.html sprite into EVERMORE_COCKPIT_v2.html
- [ ] Decide: keep v1 cockpit or delete once v2 is fully stable
- [ ] Consider: move archived files to an `_archived/` subfolder to reduce clutter (do not delete)
