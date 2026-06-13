# Cockpit V3 Preview Refresh Runbook

## Scope

Until V3 is explicitly approved, every refresh targets only:

- `https://evermorelife.org/dashboard-preview`
- `POST /api/cockpit-preview-update`
- Preview KV keys beginning with `cockpit-v3-preview-`

Never write to `/dashboard`, `/api/cockpit-update`, or `cockpit-v2-state`.

## Daily Refresh Contract

1. Read `00_START_HERE/COCKPIT_UPDATE_HANDOFF.md`, this runbook, current preview state, previous preview history, and current repo handoffs.
2. Treat `user` and `registry` as persistent manual state. Generated refreshes may replace only `generated`.
3. Convert newly completed tasks and their ISO-timestamped notes into the generated Done/Wins summary. Carry unfinished work forward with a concrete next action.
4. Scan Gmail read-only for recent Evermore business evidence and strict festival confirmations.
5. Scan the primary Google Calendar in `America/Phoenix` for the current day and registered festivals.
6. Build source-backed mission, priorities, schedule, cards, metrics, and source-health values.
7. Preserve the previous value when a source is unavailable, label it stale or unavailable, and include the exact reconnection step. Never convert unavailable into zero.
8. Push generated state with `04_tools/cockpit_update/push_cockpit_preview_update.py`.
9. Require writer output containing `ok: true` and `productionUnchanged: true`.
10. Verify preview history gained the prior generated snapshot and manual counts did not change.
11. Send a receipt to `kurrea7@gmail.com` only after verification. Clearly label it as a V3 preview refresh.

## Festival Evidence Rules

- A reservation, paid receipt, booking confirmation, or equivalent direct evidence proves attendance status.
- A promotion or organizer announcement may supply official dates but does not prove attendance.
- Lost Lands and Bass Canyon remain annual `on-the-books` registry entries.
- Tomorrowland Thailand and EDC Thailand remain `planning` until direct attendance evidence exists.
- Deduplicate by normalized festival name, year, and lane before changing the registry or Calendar.
- Confirmed or annual `on-the-books` festivals sync to the primary Calendar.
- Planning festivals receive a tentative Calendar hold only after their registry entry has `planningHoldApproved: true`.
- Search Calendar before creating an event. Cockpit-created events contain:
  `Managed by Evermore Cockpit V3 festival registry.`

## Source Rules

- Gmail is read-only except for the requested refresh receipt.
- Calendar writes are limited to deduplicated confirmed festival sync and explicitly approved planning holds.
- HighLevel and Meta remain unavailable until read-only adapters are authenticated.
- Direct links must point to the real source system.
- Generated cards must include status, verified source, freshness, next level, exact next action, owner, and direct link.

## Promotion Gate

Do not promote V3 or activate the automation until:

1. The user approves `/dashboard-preview`.
2. Production V6 still matches `cockpit-restored-v6-2026-06-13`.
3. Preview refresh preserves user and registry state.
4. Preview writes leave production state unchanged.
5. The paused automation has completed one supervised preview run.
