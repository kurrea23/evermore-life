# 04_tools — Codex Handoff
**Deploy scripts, builders, and the cockpit updater.**

---

## What's In Here

```
04_tools/
├── scripts/              → Shell scripts to deploy and wire things
├── builders/             → Python scripts to regenerate DOCX/XLSX playbooks
├── cockpit_update/       → Daily cockpit briefing system
└── cache/                → Python cache files (ignore)
```

---

## Scripts (`scripts/`)

| Script | What it does | Run when |
|---|---|---|
| `deploy_sarah.sh` | Deploys Sarah AI Cloudflare Worker | Sarah page needs update |
| `redeploy_sarah.sh` | Redeploys Sarah without full rebuild | Quick Sarah update |
| `deploy_kvn.sh` | Deploys KVN (Kevin AI) worker | KVN needs update |
| `deploy_ghl_relay.sh` | Deploys GHL relay Cloudflare Worker | Setting up server-side GHL API |
| `wire_ghl_webhook.sh` | Wires GHL webhook URL into site pages | First-time GHL setup or URL change |
| `wire_pixel.sh` | Installs Meta Pixel ID across pages | First-time pixel setup or ID change |

**Run all scripts from the repo root:**
```bash
cd /Users/k9smac/Desktop/EVERMORE-LIFE
chmod +x 04_tools/scripts/*.sh
./04_tools/scripts/wire_ghl_webhook.sh
./04_tools/scripts/wire_pixel.sh
```

---

## Builders (`builders/`)

| Script | What it generates |
|---|---|
| `build_playbook.py` | Regenerates `Evermore_Life_Playbook.docx` |
| `build_funnel_sheet.py` | Regenerates `Evermore_Meta_Funnel_Playbook.xlsx` |
| `build_tracker.py` | Regenerates `Evermore_Implementation_Tracker.xlsx` |

Run from repo root:
```bash
python3 04_tools/builders/build_playbook.py
python3 04_tools/builders/build_tracker.py
python3 04_tools/builders/build_funnel_sheet.py
```

Output goes to `03_sales_marketing/playbooks/`.

---

## Cockpit Update System (`cockpit_update/`)

The daily morning briefing system. Runs at 4:30 AM Phoenix time automatically.

| File | What it is |
|---|---|
| `push_cockpit_update.py` | Main script — generates and pushes morning snapshot |
| `push_cockpit_brief.sh` | Shell wrapper to invoke the Python script |
| `cockpit_update.config.json` | Local secrets config (gitignored — do not commit) |
| `cockpit_update.config.example.json` | Template for the config (tracked) |

The cockpit reads from Gmail, Calendar, and this repo. It posts to the Cloudflare KV store (`cockpit-v2-state`) and the live dashboard at `evermorelife.org/dashboard`.

**To run manually:**
```bash
python3 04_tools/cockpit_update/push_cockpit_update.py
```

**Config file format** (`cockpit_update.config.json`):
```json
{
  "worker_url": "https://evermorelife.org/api/cockpit-update",
  "worker_secret": "[SECRET]",
  "gmail_credentials": "...",
  "calendar_id": "..."
}
```

---

## Tasks for Codex — This Folder

### Task A — Verify all scripts work
1. Check `wire_ghl_webhook.sh` — does it prompt for the GHL webhook URL and write it to the right pages?
2. Check `wire_pixel.sh` — does it prompt for the Pixel ID and add it to `01_website/current/*.html`?
3. Check `deploy_sarah.sh` — does it reference the right Cloudflare project?
4. Run security audit: `rg -n "cfat_|GHL_API_TOKEN|hooks\.zapier" 04_tools/scripts/ --glob '*.sh'`
5. Fix any hardcoded secrets found

### Task B — Add pixel wiring to v2 pages
`wire_pixel.sh` currently only targets `01_website/current/`.
Extend it to also wire the pixel into:
- `01_website/v2/pages/*.html`
- `01_website/retirement-planning-v2/pages/*.html`
- `04_content_narrative/FUNNEL_PAGE.html`

### Task C — Update cockpit to include ad campaign metrics
The cockpit briefing (`push_cockpit_update.py`) currently reads Gmail, Calendar, and repo.
Add a section to the briefing output for ad campaign status:
```json
"adCampaign": {
  "status": "pending_launch / active / paused",
  "dailyBudget": 25,
  "campaignsLive": 0,
  "lastUpdated": ""
}
```
This will show in the cockpit dashboard so Lucidus can see ad status every morning.

### Task D — Build a lead counter for the cockpit
Add a GHL leads-today counter to the cockpit briefing.
The GHL private integration script is at `02_ghl/private_integration/ghl_private_integration.py`.
Pull: number of new contacts created in the last 24 hours.
Add to the cockpit brief as `"leadsToday": N`.

---

## Security Audit Commands

Run these before any deployment:

```bash
# Check for exposed secrets in scripts
rg -n "cfat_|GHL_API_TOKEN|Private Integration Token|hooks\.zapier" \
  /Users/k9smac/Desktop/EVERMORE-LIFE \
  --glob '*.sh' --glob '*.html' --glob '*.js' --glob '*.py'

# Check for hardcoded webhook URLs (should be placeholders)
rg -n "hooks\.zapier|inbound\.leadconnector|webhook\.site" \
  /Users/k9smac/Desktop/EVERMORE-LIFE \
  --glob '*.html' --glob '*.js'
```

If any secrets found: rotate them in Cloudflare/GHL immediately. Do not commit fixes that contain the old secrets — redact first, then commit.
