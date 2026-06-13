# Evermore Cockpit Update Handoff
*Updated June 10, 2026*

## Live Surface

- Dashboard: `https://evermorelife.org/dashboard`
- Asset: `01_website/experiments/EVERMORE_COCKPIT_v2.html`
- Worker: `01_website/v2/cloudflare/evermore-live-proxy.js`
- KV key: `cockpit-v2-state`

The cockpit is Evermore-first. It shows a machine-generated morning snapshot plus manual tasks and wins.

## State Contract

State is version 2:

```json
{
  "version": 2,
  "generated": {
    "date": "",
    "mission": "",
    "nextAction": "",
    "brief": { "today": "", "done": "", "next": "", "blockers": "" },
    "priorities": [],
    "schedule": [],
    "followUps": [],
    "risks": [],
    "sources": { "gmail": "", "calendar": "", "repo": "", "highLevel": "" },
    "generatedAt": "",
    "generatedBy": ""
  },
  "user": {
    "main": {},
    "projects": {},
    "wins": []
  }
}
```

- `POST /api/cockpit-update` replaces only `generated`.
- `POST /api/cockpit-state` replaces only `user`.
- `GET /api/cockpit-state` returns both.
- Legacy `{main, projects}` state is migrated on read. Existing manual state is preserved.
- The browser does not merge or upload old `localStorage`, so an old device cannot roll the cockpit backward.

## Morning Update

Use `04_tools/cockpit_update/push_cockpit_update.py` to write and verify a structured snapshot. The local secret file is `cockpit_update.config.json`; it is ignored by Git. Keep `cockpit_update.config.example.json` as the tracked template.

The daily Codex automation runs at 7:00 AM `America/Phoenix`. It scans verified Gmail, Calendar, current handoffs, and recent workspace evidence; reports HighLevel as unavailable when authentication fails; writes both cockpit snapshots; verifies both; then emails one combined receipt.

The two targets have separate scopes:

- Revenue cockpit v2: `https://evermorelife.org/dashboard`, written with `push_cockpit_update.py`. Keep it Evermore Life revenue-first and preserve its manual state.
- Broad operating cockpit: `00_START_HERE/active/cockpit/EVERMORE_COCKPIT.html`, written with `update_broad_cockpit.py`. Include all actionable email and operational work, but exclude promotions, newsletters, shopping noise, and sensitive personal data.

Use the same JSON snapshot shape for both writers. The broad writer accepts the top-level snapshot, a `generated` object, or a `broad` object:

```bash
python3 04_tools/cockpit_update/push_cockpit_update.py --json-file /tmp/revenue.json --generated-at <utc-timestamp>
python3 04_tools/cockpit_update/update_broad_cockpit.py --json-file /tmp/broad.json
```

Both commands must return `ok: true`. Retry a failed write once. Send the success receipt only after both verify; otherwise send a failure receipt that identifies each target's status.

The cockpit marks a snapshot stale after 30 hours.

## Cockpit V3 Private Preview

- Preview: `https://evermorelife.org/dashboard-preview`
- Asset: `01_website/experiments/EVERMORE_COCKPIT_v3.html`
- Preview state key: `cockpit-v3-preview-state`
- Preview writer: `04_tools/cockpit_update/push_cockpit_preview_update.py`
- Refresh runbook: `00_START_HERE/COCKPIT_V3_REFRESH_RUNBOOK.md`
- Rollback runbook: `00_START_HERE/COCKPIT_V3_ROLLBACK_RUNBOOK.md`

V3 is isolated from production. Its state, backups, history, browser edits, and generated updates use preview-only KV keys and API routes. Do not promote V3 to `/dashboard` until the preview is explicitly approved.

Use `04_tools/cockpit_update/deploy_cockpit_preview.sh` for preview deployments so production and preview state are exported before Wrangler deploys the Worker.

## Deployment

```bash
npx wrangler deploy --config 01_website/v2/cloudflare/wrangler.live-proxy.jsonc
```

Before any deployment or state migration, export the live state. The June 10 recovery backup is stored outside the repo at:

`/tmp/evermore-cockpit-backup-2026-06-10/`
