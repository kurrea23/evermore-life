# Virtual office landing page

Canonical source: `virtual-office/index.html`. **Published October 12, 2026** at
[evermorelife.org/virtual-office/](https://evermorelife.org/virtual-office/),
served as a root-level static directory through the existing Cloudflare Pages
fallback. The operator approved scheduled entry for a two-week pilot,
**October 13–23, 2026**, Monday–Friday **9 a.m.–5 p.m. Phoenix time**.
Joining opens only inside those nine dated weekday windows and
closes after the final session. No public navigation changed. See the
[hours correction](../BLUEPRINTS/reports/2026-10-12_virtual-office-business-hours.md).

The visitor page is intentionally short and uses the existing approved brand.
Operator instructions live in the
[standard pilot guide](../03_sales_marketing/virtual-office/README.md).

## Configure for an approved session

The approved Zoom participant link is already in `office-config.json`. Edit the
remaining fields when future staffing dates are approved:

- `zoomJoinUrl`: approved HTTPS Zoom participant URL, `/j/` + 9–11 digit ID.
  Include an approved embedded participant passcode if desired. Never use host
  URLs or host tokens. This file will be publicly readable after deployment.
- `timeZone`: display timezone; default `America/Phoenix`.
- `sessions`: exact staffed date windows, each with ISO `startsAt` and `endsAt`,
  including seconds and an explicit timezone offset or `Z`.
- `enabled`: `true` for the operator-approved scheduled pilot. Set
  `false` and deploy if the office must close early.
- `proposal`: display suggestions while disabled/unconfigured; never enables joining.

The first approved weekday window:

```json
{"startsAt":"2026-10-13T09:00:00-07:00","endsAt":"2026-10-13T17:00:00-07:00"}
```

Use dated windows so last week’s schedule cannot reopen an unattended office.
All sessions use the same approved Zoom participant URL for the initial pilot.
Weekly labels do not turn into sessions automatically. After October 23,
approve and publish the next set of dated windows to continue. The last day
in the original pilot span, October 24, is Saturday and is now closed.

The page displays matching hours for Arizona, Pacific, Mountain, Central and
Eastern time. `office-hours.mjs` converts the next/current session's actual
instants with IANA zones and Intl, so daylight-saving offsets are date-correct.
The rows are time conversions, not a statement of licensed service coverage.
The dense list of individual dates is replaced by this compact time-zone view.

The eight-hour page window does not remove Zoom Basic's 40-minute limit for
active participant meetings. A continuous 9–5 meeting requires an approved paid
host license. No upgrade or payment was made for this change.

Availability means scheduled hours, not live host presence. The browser uses the
visitor’s clock; it cannot verify staffing, capacity, or whether Zoom has started.
Keep the host online for every enabled window. A copied Zoom link still exists
outside hours; Waiting Room and join-before-host settings control admission.

The button starts disabled, opens only within a valid configured session, and
checks availability again on click. Missing/invalid settings, non-Zoom URLs,
failed refreshes, stale configuration, and expired sessions disable joining.
Configuration refreshes each minute and after returning to the tab; the state
refreshes each second. Root `_headers` disables caching for the office configuration
on Cloudflare Pages so updated staffing is not served from an old cached response.
No visitor intake, chat, analytics, or browser storage is
added by this page. Existing callback and legal links use the public site routes.

## Local preview and checks

From the repository root:

```sh
python3 -m http.server 8767 --bind 127.0.0.1
node --test 04_tools/tests/virtual_office_test.mjs
```

Open `http://127.0.0.1:8767/virtual-office/`. Existing clean legal/callback routes
resolve on the production Worker, rather than this plain local file server.
The published page, assets, initial disabled entry state and configuration cache
headers were verified live in the first release. The operator subsequently
approved enabling scheduled entry. Rehearse Zoom admission and breakout handoff
with a teammate before the first office session. Local open/closed state checks
do not establish live host presence.

The current deployment script ships fresh `main`, not this branch. Merge through
the approved release process first; do not run `deploy.sh` on the assumption
that it publishes this checkout. An approved Pages-only release is intended;
no shared Worker route edit is needed for this root-level directory. Keep noindex
for the pilot; indexing can be reviewed after the office is tested.

Background source and output:
[Zoom assets](../04_content_narrative/virtual-office/README.md).
