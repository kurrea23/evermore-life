# Cartographer Report: Weekday Business Hours And Time Zones

- **Date:** 2026-10-12
- **Agent or operator:** Codex + Evermore operator
- **Surface:** Virtual office hours and visitor time-zone presentation
- **Mission:** Correct the office to 9–5 and replace date clutter with clear regional hours.
- **Approval level used:** execute; operator directly requested this correction to the live office

## Executive Finding

[The live office](https://evermorelife.org/virtual-office/) now uses
**Monday–Friday, 9 a.m.–5 p.m. Phoenix time**. It displays matching hours for
Arizona, Pacific, Mountain, Central and Eastern time, calculated for the same
session instants. The original two-week pilot boundary is preserved: nine
weekday windows from **October 13–23**; weekends are closed. It is correctly
closed on October 12 before the first pilot window, which opens October 13 at
9 a.m. Arizona time. This replaces the previously approved short evening and
Saturday sessions.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| New hours directly authorized | Operator: “this should be like 9-5 and then jsut show all the time zones we are currently in”; [decision](../DECISIONS.md) | high |
| Nine 8-hour weekday windows replace earlier slots | [configuration](../../virtual-office/office-config.json); participant invite passcode omitted from this report | high |
| Time-zone rows describe one office window accurately | [conversion module](../../virtual-office/office-hours.mjs) and [browser behavior](../../virtual-office/office.mjs) | high |
| Correct October equivalents | Arizona/Pacific 9–5, Mountain 10–6, Central 11–7, Eastern noon–8; live browser and Intl results | high |
| Daylight-saving conversion and availability tests pass | [tests](../../04_tools/tests/virtual_office_test.mjs): 7/7, including November offset changes, each date boundary, weekends and pilot expiry | high |
| Source was committed and published | Commit `70bd43e` pushed to remote main; clean-main `deploy.sh` validated 459 files, uploaded 12 new assets (480 already uploaded) and `_headers` | high |
| Public hostname and deployment origin serve exact source | HTTPS GET checks for HTML, config, browser module, conversion module and CSS all HTTP 200 and byte-identical | high |
| Cloudflare deployment completed | [Deployment origin](https://9f9f7356.evermore-life.pages.dev/virtual-office/) | high |
| Browser shows all five regional rows without errors | Live Chrome and in-app browser inspection; no console errors | high |
| Mobile remains within viewport | Chrome 390px viewport: document scroll width 390px | high |
| Existing public route sweep passes | `/`, `/brand`, `/growth-calculator/`, `/score-tracker/`, `/clients/`, `/today/`, `/inbound-client-intake/`: HTTP 200 | high for route availability |

## Map

Canonical route and ownership are unchanged, so `MAP.md` was not edited.
Current operation is documented in the [office source guide](../../virtual-office/README.md)
and [host guide](../../03_sales_marketing/virtual-office/README.md). The compact
regional-hours list replaces individual dated session rows while exact dated
windows continue to govern entry. No shared Worker or Zoom account change was made.

Regional labels are conversion references. They do not establish team locations
or licensed insurance coverage in particular states. Phoenix remains the base
clock; equivalent regional times use IANA zones with Intl rather than fixed offsets.
[NIST's DST reference](https://www.nist.gov/pml/time-and-frequency-division/popular-links/daylight-saving-time-dst)
confirms Arizona's different daylight-saving behavior, which the tests cover.

## Visual Evidence

- [Live business hours](../visuals/virtual-office/landing-business-hours-live.png):
  desktop production page with the five date-correct regional equivalents.
- [Mobile hours](../visuals/virtual-office/landing-business-hours-mobile.png):
  readable timezone rows at 390px without horizontal scrolling.

## Unknown Or Unavailable

- The user did not explicitly change the base clock or weekday convention.
  Phoenix and Monday–Friday were stated as implementation assumptions before work.
- Human host presence and a live visitor/private-room rehearsal remain unverified.
  A page schedule does not launch Zoom or prove a teammate is waiting.
- [Zoom's official meeting limits](https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0067966)
  still apply: Basic active meetings are generally limited to 40 minutes. An
  uninterrupted 9–5 Zoom room requires an approved paid host license. The operator
  was informed; no purchase or upgrade occurred.
- The dated pilot does not continue after October 23 without approved new windows.

## Cross-Surface Overlaps

Promoted to [OVERLAPS](../OVERLAPS.md): one base office window must display
date-aware regional equivalents, and website hours do not remove Zoom license
limits or establish insurance service geography. The direct hours correction and
deployment approval are recorded in [DECISIONS](../DECISIONS.md).

## Recommended Next Move

Operator confirms staffing and approves a paid host license if the Zoom room
must remain uninterrupted throughout 9–5. Rehearse admissions/private-room handoff
before the October 13 opening. Approve future dated windows if continuing after
the original pilot. Current website changes are deployed and verified.

## Files Changed

- `virtual-office/office-config.json`: corrected nine weekday windows and summary.
- `virtual-office/office-hours.mjs`: date-aware five-zone conversion module.
- `virtual-office/office.mjs`, `index.html`, `office.css`: compact regional presentation.
- `04_tools/tests/virtual_office_test.mjs`: weekday 9–5 and DST regression checks.
- `virtual-office/README.md`, `03_sales_marketing/virtual-office/README.md`.
- `BLUEPRINTS/DECISIONS.md`, `OVERLAPS.md`, this report and live screenshots.

The release is isolated on `codex/virtual-office`, pushed to main and deployed.
Receipt-only commits do not change application behavior. Unrelated Desktop
checkout files and branches were preserved.
