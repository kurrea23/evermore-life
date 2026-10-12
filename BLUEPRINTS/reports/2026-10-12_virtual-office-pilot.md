# Cartographer Report: Evermore Life Virtual Office Pilot

- **Date:** 2026-10-12
- **Agent or operator:** Codex + Evermore operator
- **Surface:** Zoom virtual office and short visitor landing page
- **Mission:** Prepare a standard free-plan office, branded background, visitor entry page, and host/teammate operating outline on a new feature branch.
- **Approval level used:** execute (local source; separate explicit approvals for Zoom meeting Save and enabling breakout rooms)

## Executive Finding

Branch `codex/virtual-office` contains a short responsive landing page, canonical
navy/gold 1920×1080 Zoom background, and a standard two-week pilot guide. The
operator approved saving **Evermore Life Insurance Support Room** as a recurring
No Fixed Time Basic meeting and separately approved enabling breakout rooms.
Both changes were verified in Zoom's saved UI. The approved participant link is
wired into the page configuration, with joining still disabled and no staffed
date windows. The website was not published and the visitor handoff has not been
tested in a live meeting.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| New isolated feature branch started from a clean worktree | `git branch --show-current`; initial `git status --short` empty | high |
| Short branded visitor page and configured participant link | [page](../../virtual-office/index.html), [configuration](../../virtual-office/office-config.json) (public-facing participant link; embedded passcode omitted from this report) | high |
| Joining ships disabled with no staffed sessions | Config `enabled: false`, `sessions: []`; disabled button observed after final restoration | high |
| Availability permits only approved HTTPS participant Zoom links within dated windows | [availability](../../virtual-office/availability.mjs); 6/6 checks in [tests](../../04_tools/tests/virtual_office_test.mjs) | high |
| Open, expired/closed, and unavailable states work in the rendered browser | Temporary loopback-only fixture server; button enabled only in open mode; disabled in closed and HTTP 503 modes | high |
| Phone page has no horizontal overflow | Chrome 390px viewport: document scroll width 390px; local visual inspection | high |
| Approved dimensional logo preserved inside gold frame | [background PNG](../../04_content_narrative/virtual-office/evermore-zoom-background-1920x1080.png), [builder](../../04_tools/builders/build_virtual_office_background.mjs), canonical [brand kit](../../04_content_narrative/evermore_life_brand_kit/README.md) | high |
| Approved Zoom meeting exists as recurring No Fixed Time on Basic | Saved Meeting Information page and reopened edit form; [safe saved screenshot](../visuals/virtual-office/zoom-meeting-created.png) | high |
| Saved meeting keeps passcode, Waiting Room, muted entry; automatic recording, AI, My Notes transcription, persistent chat, and join-before-host off | Saved details and reopened edit form; draft controls verified again after Save | high |
| Breakout rooms enabled after separate approval | Saved account switch `aria-checked=true`, no longer disabled; [screenshot](../visuals/virtual-office/zoom-breakout-enabled.png) | high |
| Basic supports pilot but has 40-minute meeting limit; co-host requires a paid account | Official Zoom references in [pilot guide](../../03_sales_marketing/virtual-office/README.md); signed-in Mac app showed Basic account | high |
| Intended route can use existing Pages fallback | `01_website/v2/cloudflare/evermore-live-proxy.js` fallback passes unknown paths to Pages; [deployment notes](../../virtual-office/README.md) | high for source, unavailable for future live route |

## Map

- Visitor → proposed `/virtual-office/` static directory → approved Zoom
  participant URL → Waiting Room → host-managed private consultation room.
- Advisor → existing authenticated [Inbound Client Intake Sheet](../../inbound-client-intake/index.html)
  for agreed follow-up and secure records. Public visitors do not use the team login.
- Website source/config: [virtual-office](../../virtual-office/README.md).
- Host operations and suggested pilot: [standard guide](../../03_sales_marketing/virtual-office/README.md).
- Background editable source and rebuild: [asset guide](../../04_content_narrative/virtual-office/README.md).
- No shared Worker edits, homepage/footer link, SDK, Zoom API, CRM changes,
  visitor data collection, ad publishing, spend, or calendar connection.
- Page availability is scheduled hours using the visitor's clock, not verified
  real-time host presence. Dated windows expire; config refresh failure disables
  joining. Waiting Room controls admission even if someone retains the Zoom link.

## Visual Evidence

- [Desktop landing draft](../visuals/virtual-office/landing-preview.png): local
  page content, brand, disabled entry, and proposed hours.
- [Phone landing draft](../visuals/virtual-office/landing-mobile.png): readable
  single-column layout at 390px.
- [Meeting draft](../visuals/virtual-office/zoom-meeting-draft.png): reviewed
  name, dedicated recurring office setup; no passcode included.
- [Created meeting](../visuals/virtual-office/zoom-meeting-created.png): saved
  name, recurring meeting, masked passcode and Waiting Room. Crop omits invite URL.
- [Original breakout state](../visuals/virtual-office/zoom-breakout-setting.png)
  and [enabled state](../visuals/virtual-office/zoom-breakout-enabled.png): account
  change explicitly approved by the operator and verified saved.
- Background PNG was viewed locally; it has a gold frame in the bottom right
  and leaves the center clear for faces.

## Unknown Or Unavailable

- Actual staffed dates, advisor roster, capacity and public-office launch date
  remain unapproved. Suggested times are Tue/Thu 5:30–6 p.m. and Sat 10–10:30 a.m.
  in Phoenix time for two weeks.
- No live admission, screen-share, breakout assignment, advisor handoff,
  follow-up record, or meeting-end test was run. No camera/microphone session started.
- Background has not been installed or checked by another Zoom participant.
- Website route and callback flow have not been verified live for this feature;
  no deployment occurred. Shared-proxy compatibility is source evidence only.
- Zoom documents No Fixed Time as available in the web portal and also warns
  of future removal; current account offered and saved it. Recheck if recreating.
- Stripe Directory CLI was unavailable; its setup entrypoint was checked, and
  Zoom implementation facts were verified through official Zoom documentation
  and the signed-in account rather than a Directory lookup.

## Cross-Surface Overlaps

Promoted to [OVERLAPS](../OVERLAPS.md): public traffic depends on staffed Zoom
admission and private household isolation; advisors retain authenticated intake;
Basic duration constrains the office and all private sessions; organic/paid
activation depends on verified live operation. Approved local scope and each
external Zoom action are recorded in [DECISIONS](../DECISIONS.md).

## Recommended Next Move

Operator confirms exact staffed dates and runs one teammate rehearsal as host:
admit, assign visitor + advisor, screen-share privately, return, record agreed
follow-up through existing intake, end meeting. Then approve adding the dates,
enabling entry, and a Pages release. Keep the pilot below the free-plan limit.

## Files Changed

- `virtual-office/`: page, styles, availability, browser behavior, config and README.
- `03_sales_marketing/virtual-office/README.md`: standardized pilot and host guide.
- `04_content_narrative/virtual-office/`: SVG composition, RGB PNG and asset guide.
- `04_tools/builders/build_virtual_office_background.mjs`: repeatable brand-preserving builder.
- `04_tools/tests/virtual_office_test.mjs`: meaningful join-gating tests.
- `BLUEPRINTS/visuals/virtual-office/`: safe local-page and Zoom account evidence.
- `BLUEPRINTS/MAP.md`, `DECISIONS.md`, `OVERLAPS.md`, and this report.

Validation: local page HTTP 200; 6/6 automated checks passed; desktop/mobile
render inspection; open/closed/unavailable browser fixtures; saved Zoom settings
verified. Production website and live meeting flow are **not live verified**.
