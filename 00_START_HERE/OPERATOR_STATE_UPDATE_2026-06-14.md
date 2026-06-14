# Operator State Update - 2026-06-14

This note records operator-corrected current state for cockpit work. It is
intended to override older handoff assumptions when they drift.

## Evidence Standard

The items below are operator-reported in chat during the June 14 cockpit review.
They were not independently re-verified live in this turn unless explicitly
noted elsewhere.

## Operator-Corrected Current State

- The old May 11 / EDC / Craig / IRS-call story is retired and should not stay
  in the active cockpit.
- The older A2P IRS-call blocker tied to the previous LLC is no longer the live
  active blocker.
- The current A2P path depends on the new LLC approval and the new EIN path.
- The GHL work is built out.
- The lead test is done.
- The Cloudflare API rotation is done.
- Meta Pixel install work is done.
- Completed work should move out of the active Main view and into a completion
  layer instead of lingering as active blockers.

## Cockpit Operating Rule

- Main should show live current work.
- Projects should be the place where actionable work is tracked and marked off.
- Done should hold completed items so retired work drops out of active focus.

## Next Source-Of-Truth Move

Update daily cockpit handoffs so future generated snapshots do not recreate
retired blockers from older documents.
