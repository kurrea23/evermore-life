# Cockpit Planner Report — 2026-06-27 (Sat)

**Status: NOT PUSHED — cockpit could not be updated.** The dashboard access code
is still missing, so the daily PLANNER could not log in to GET/POST
`/api/cockpit-state`. Everything below is the reconciliation I *would* have written;
apply it once the access code is restored (see "Blocker" at the end).

---

## Daily brief (ready to paste into `main.dailyBrief.text`)

> Today: Follow up Mutual of Omaha incomplete app — Sonya Richardson (Living Promise Level WL, $15k, underwriter Dani Morris, file BU6759348); 4:00 PM call Paul Marcotte (lead 51176028); work new Integrity Connect leads (order 5461579). Done: Shipped Sarah final-expense landing page + live route; built BLUEPRINTS system map (MAP, OVERLAPS, DECISIONS, clickable map) + 5 audit reports; drafted "The Promise" 60s spot and soccer-dad awareness video outline. Next: Send Agent NPN 22162173 / email / comp / upline to Blakeley to trigger InstaBrain link; sign SuranceBay/FFL Limitless contract; check Americo agent-portal notification. Blockers: GoHighLevel payments failing (OnePay "add funds" for HIGHLEVEL INC + AGENCY SUB) — CRM at risk; cockpit access_code config missing so PLANNER cannot push.

---

## Last 24h intel

### Leads / clients (highest priority)
- **Mutual of Omaha — INCOMPLETE application.** Sonya Richardson, Living Promise
  Level Whole Life, face $15,000, agent Keenan Urrea, underwriter Dani Morris,
  file BU6759348. Carrier "incomplete" notice = needs immediate follow-up to keep
  the policy moving. (from dani.morris@mutualofomaha.com, 6/26)
- **Integrity Connect — new leads delivered.** Order #5461579, dated 06/26. Log
  into IntegrityCONNECT → Manage Leads and work them. (leads.integrity.com)
- **Paul Marcotte — scheduled call TODAY 4:00 PM Phoenix.** Lead ID 51176028
  (Google Calendar focus block).
- **Americo** — new agent-portal notification regarding Keenan Urrea (6/26); log in
  to read.

### Recruiting / contracting
- **InstaBrain contract (FFL Limitless).** SuranceBay: "An agency has requested
  your signature… processing your contracting paperwork" — signature required.
- **Blakeley Smith (FFL Limitless)** replied: needs Agent NPN, Agent Email, Comp,
  Upline, Upline writing number to request the InstaBrain link (1–2 days to issue).
  Keenan's NPN is 22162173. → Reply with the requested fields to unblock.

### Billing / infrastructure blockers
- **GoHighLevel payments failing.** OnePay "Add funds to complete your payment"
  for **HIGHLEVEL INC.** and **HIGHLEVEL AGENCY SUB** (6/26). The CRM/funnels
  subscription is at risk of lapse — fund or fix the card.
- Other declines (personal, lower priority): TikTok Shop Subscribe & Save declined;
  Insomniac Passport payment pending; Progressive AZ auto balance $152.24 overdue
  (Keenan replied requesting more time, policy 872733729).
- Payments that cleared: Klarna $91.30 received; several OnePay advances/transfers
  settled.

### Ignored (noise)
Mutual of Omaha OTP codes, Google "new sign-in" security alert, newsletters
(daily.ai, futureloop, Substack), Anthropic rate-limit notice.

### Work shipped today (folder evidence, modified 2026-06-27)
- `01_website/experiments/sarah-final-expense.html` + report
  `2026-06-27_sarah-final-expense-live-route.md` — new final-expense landing page,
  live route checked.
- `BLUEPRINTS/`: `MAP.md`, `CLICKABLE_SYSTEM_MAP.html`, `OVERLAPS.md`,
  `DECISIONS.md` + reports: website-app-partition, live-visual-check,
  clickable-system-map, github-actions-ci-check (all dated 2026-06-27).
- `01_website/v2/cloudflare/evermore-live-proxy.js` — worker edited.
- Creative: `the-promise-60s-spot.md`, `soccer-dad-awareness-video-outline.md`.

---

## Proposed sequence steps to ADD (status in brackets)
1. [active] Follow up Mutual of Omaha incomplete app — Sonya Richardson (BU6759348).
2. [active] 4:00 PM call Paul Marcotte — lead 51176028.
3. [todo] Work Integrity Connect new leads — order 5461579.
4. [todo] Reply to Blakeley: send NPN 22162173 / email / comp / upline → get InstaBrain link.
5. [todo] Sign SuranceBay / FFL Limitless InstaBrain contract.
6. [blocked] Resolve GoHighLevel payment failure (fund OnePay / update card) — CRM at risk.
7. [todo] Check Americo agent-portal notification.

## Proposed steps to mark DONE (folder evidence)
- Sarah final-expense landing page shipped + live route verified.
- BLUEPRINTS system map built (MAP / OVERLAPS / DECISIONS / clickable map + audits).
- Creative drafted: "The Promise" 60s spot + soccer-dad awareness video outline.

## Suggested status pills / metrics
- Pills: GHL Billing → **alert**; Leads → **live** (3 open: MoO, Integrity, Paul);
  Contracting → **building** (InstaBrain pending signature).
- Metric ideas: Open leads = 3 (gold); GHL payment = AT RISK (red);
  State pages = AZ/TX live, AR pending (cyan).

---

## Blocker — why nothing was pushed

`04_tools/cockpit_update/cockpit_update.config.json` (holding `access_code`) is
**still absent** (only the example file exists). All three write paths were tried
and failed today:

1. **Dashboard API** — `POST /dashboard/login` needs the real access code; without
   it, no session cookie, so GET/POST `/api/cockpit-state` is impossible (GET
   unauth = 401).
2. **Cloudflare MCP** — exposes only `kv_namespace_*` (no per-key value read/write),
   so it can't touch the `cockpit-v2-state` key.
3. **Wrangler in sandbox** — `wrangler kv key get/put --remote` fails:
   "non-interactive environment, set CLOUDFLARE_API_TOKEN." No token / cached
   OAuth is available in the sandbox.

**To unblock (one-time, by the user):** recreate
`04_tools/cockpit_update/cockpit_update.config.json` from the example with the real
dashboard access code (the `DASHBOARD_PASSWORD` Cloudflare secret on the
evermore-live-proxy worker). After that the SKILL's curl login → GET → merge → POST
flow works again.

**Live KV facts for the restore:** binding `COCKPIT_STATE`, namespace id
`32fa6b4a72324b66b3f7a8967c5bdb51`, state key `cockpit-v2-state`.
