# Evermore Life — Project Map

**Look here first:** `00_START_HERE/active/`

That folder is your daily workspace. Everything inside is a symlink to the real file in its organized home, so editing in either place updates both — nothing is duplicated.

## active/ — what we're using right now and implementing next

| Folder | What it is |
| --- | --- |
| `active/cockpit/` | The mission cockpit. Open `EVERMORE_COCKPIT.html`. |
| `active/now/` | The 5 public site files (`index`, `optin`, `thank-you`, `privacy`, `terms`). These are the source of truth for what gets pasted into GoHighLevel. |
| `active/next_in_ghl/` | The GHL launch kit, numbered in build order. Start at `00_README.md`, then `01_live-build-runbook.md`. This is the **critical path** to A2P approval. |
| `active/handoffs/` | `01_COWORK_HANDOFF.md` (what Codex did) and `02_EVERMORE_HANDOFF.md` (full launch playbook). |
| `active/run/` | The four scripts you actually invoke this week: `wire_ghl_webhook.sh`, `wire_pixel.sh`, `deploy_sarah.sh`, `deploy_kvn.sh`. |
| `active/rooms/` | One folder per active task. Each room has a `README.md` (overview), `YOU_DO_THIS.md` (no-AI playbook), `HELPERS.md` (which AI does what), and pre-staged files. The cockpit's "ROOMS" panel and the active step both link in here. Current rooms: `A2P_REGISTRATION/` (your focus), `KEVIN_V2/` (parallel spec). |

## Critical-path mission

1. Build native GHL form + 5 pages on `evermorelife.org`
2. Build the lead intake workflow (SMS actions disabled until A2P approves)
3. Submit one fake lead and verify the contact, tag, opportunity, owner notify, email, and call task all fire
4. Submit A2P 10DLC registration with `06_a2p-registration-pack.md`
5. Install Meta Pixel and launch a small test ad
6. First booked appointment → first sale

Full detail in `active/cockpit/EVERMORE_COCKPIT.html`.

## Folder Lanes (organized archive)

These are Codex's organized homes for everything. The `active/` folder above pulls from them — you don't need to dig into these unless you're filing something new.

- `01_website/current` — clean public website pages (mirror what's in GHL)
- `01_website/experiments` — alternate landing pages, Sarah, KVN, cockpit prototypes
- `01_website/assets/images` — logo, Sarah images, shared web images
- `02_ghl/launch_kit` — GoHighLevel native funnel build docs, snippets, fields, workflow plan
- `02_ghl/relay_worker` — Cloudflare Worker relay for server-side GHL lead capture (parked)
- `02_ghl/private_integration` — local/server-only GHL private integration helper
- `02_ghl/docs` — GHL setup guide, SMS/email templates, integration notes
- `03_sales_marketing/playbooks` — spreadsheets, playbooks, trackers, ad scripts
- `03_sales_marketing/handoffs` — handoff notes
- `04_tools/scripts` — deploy, webhook, Meta Pixel helper scripts
- `04_tools/builders` — scripts that regenerate the Word and spreadsheet playbooks
- `04_tools/cache` — generated Python cache and old lock files
- `05_exports_archive` — zipped exported landing-page packages

## Working Rule

When something becomes part of daily work, add a symlink under `active/`. When it stops being daily, delete the symlink — the original stays in its lane. The `active/` folder should always be small enough to scan in one glance.

## Common Commands

Run from `/Users/k9smac/Desktop/EVERMORE-LIFE`:

```bash
open 00_START_HERE/active/cockpit/EVERMORE_COCKPIT.html
00_START_HERE/active/run/wire_ghl_webhook.sh
00_START_HERE/active/run/wire_pixel.sh
00_START_HERE/active/run/deploy_sarah.sh
00_START_HERE/active/run/deploy_kvn.sh
```
