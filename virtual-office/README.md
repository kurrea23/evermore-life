# Virtual office landing page

Canonical local page: `virtual-office/index.html`. Proposed production route:
`/virtual-office/`, served as a root-level static directory through the existing
Cloudflare Pages fallback. **Not deployed.** No public navigation changed.

The visitor page is intentionally short and uses the existing approved brand.
Operator instructions live in the
[standard pilot guide](../03_sales_marketing/virtual-office/README.md).

## Configure for an approved session

The approved Zoom participant link is already in `office-config.json`. Edit the
remaining fields after the meeting flow and staffing are verified:

- `zoomJoinUrl`: approved HTTPS Zoom participant URL, `/j/` + 9–11 digit ID.
  Include an approved embedded participant passcode if desired. Never use host
  URLs or host tokens. This file will be publicly readable after deployment.
- `timeZone`: display timezone; default `America/Phoenix`.
- `sessions`: exact staffed date windows, each with ISO `startsAt` and `endsAt`,
  including seconds and an explicit timezone offset or `Z`.
- `enabled`: `true` only after meeting testing and approved staffing. Set
  `false` and deploy if the office must close early.
- `proposal`: display suggestions while disabled/unconfigured; never enables joining.

For example, a Tuesday pilot date window (illustrative, not an approved commitment):

```json
{"startsAt":"2026-10-13T17:30:00-07:00","endsAt":"2026-10-13T18:00:00-07:00"}
```

Use dated windows so last week’s schedule cannot reopen an unattended office.
All sessions use the same approved Zoom participant URL for the initial pilot.
If Zoom requires separate meeting URLs for weekdays and Saturday, add per-session
URL support and tests before enabling those sessions; do not silently use the
wrong meeting. The proposed weekly hours do not turn into sessions automatically.

Availability means scheduled hours, not live host presence. The browser uses the
visitor’s clock; it cannot verify staffing, capacity, or whether Zoom has started.
Keep the host online for every enabled window. A copied Zoom link still exists
outside hours; Waiting Room and join-before-host settings control admission.

The button starts disabled, opens only within a valid configured session, and
checks availability again on click. Missing/invalid settings, non-Zoom URLs,
failed refreshes, stale configuration, and expired sessions disable joining.
Configuration refreshes each minute and after returning to the tab; the state
refreshes each second. No visitor intake, chat, analytics, or browser storage is
added by this page. Existing callback and legal links use the public site routes.

## Local preview and checks

From the repository root:

```sh
python3 -m http.server 8767 --bind 127.0.0.1
node --test 04_tools/tests/virtual_office_test.mjs
```

Open `http://127.0.0.1:8767/virtual-office/`. Existing clean legal/callback routes
resolve on the production Worker, rather than this plain local file server.
Review the draft and approve publication separately. Before release, verify the
chosen site hostname, `/virtual-office/`, config refresh/cache behavior, closed
and open states, Zoom admission, and breakout handoff with a teammate.

The current deployment script ships fresh `main`, not this branch. Merge through
the approved release process first; do not run `deploy.sh` on the assumption
that it publishes this checkout. An approved Pages-only release is intended;
no shared Worker route edit is needed for this root-level directory. Keep noindex
for the pilot; indexing can be reviewed after the office is tested.

Background source and output:
[Zoom assets](../04_content_narrative/virtual-office/README.md).
