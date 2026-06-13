# Cockpit V3 Preview Rollback Runbook

## Protected Baseline

- Git branch: `codex/cockpit-v3-refresh`
- Restored V6 baseline commit: `2ab1097`
- Immutable tag: `cockpit-restored-v6-2026-06-13`
- Production dashboard asset: `01_website/experiments/EVERMORE_COCKPIT_v2.html`
- Preview dashboard asset: `01_website/experiments/EVERMORE_COCKPIT_v3.html`

The production V6 asset must remain byte-for-byte identical to the baseline tag until V3 is explicitly promoted.

## Before Every Deployment

Run:

```bash
./04_tools/cockpit_update/deploy_cockpit_preview.sh
```

The script exports production and preview state to `/tmp/evermore-cockpit-deploy-backups/<utc-timestamp>/` before deploying.

## Worker Rollback

List recent versions:

```bash
npx wrangler versions list --config 01_website/v2/cloudflare/wrangler.live-proxy.jsonc
```

Rollback to the restored V6-compatible deployment:

```bash
npx wrangler rollback 166b0f6d-8abc-4ef6-84c6-cf46ea53811f \
  --config 01_website/v2/cloudflare/wrangler.live-proxy.jsonc
```

Then verify `https://evermorelife.org/dashboard` and `/api/cockpit-state`.

## Git Rollback

Do not reset the dirty workspace. Restore only cockpit files from the protected tag:

```bash
git restore --source cockpit-restored-v6-2026-06-13 -- \
  01_website/experiments/EVERMORE_COCKPIT_v2.html \
  01_website/v2/cloudflare/evermore-live-proxy.js
```

## KV Recovery

Production state remains at `cockpit-v2-state`.

Preview state remains isolated at `cockpit-v3-preview-state`. Every preview write first creates a full recovery copy under:

- `cockpit-v3-preview-backup:`
- `cockpit-v3-preview-history:`

Never write preview state to `cockpit-v2-state`. Never restore a preview backup over production.

## Promotion Gate

Do not replace `/dashboard` or activate the 6:23 AM automation until:

1. `/dashboard-preview` is approved.
2. Preview writes preserve manual state.
3. Preview writes leave production unchanged.
4. The V6 asset hash still matches the protected tag.
