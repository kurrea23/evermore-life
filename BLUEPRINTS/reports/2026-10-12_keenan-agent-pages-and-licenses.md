# Cartographer Report: Keenan agent pages and license verification

- **Date:** 2026-10-12 (America/Phoenix)
- **Agent or operator:** Codex, at Evermore operator's request
- **Surface:** Public human-agent directory and Keenan Urrea profile
- **Mission:** Find Keenan's licenses and prepare agent pages with a real-people-helping-you voice.
- **Approval level used:** observe and draft; user explicitly authorized NAIC terms acceptance and license lookup. No publication approval requested or used.

## Executive Finding

Current official lookup results confirm active Arizona, Arkansas and Texas
insurance licenses for Keenan Urrea, NPN 22162173. A local directory and first
profile are built from a reusable registry, featuring the supplied real portrait,
direct phone/email links and dated credentials. No deploy, publish, message,
account change or spending occurred.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Arizona: active resident Insurance Producer, license 22162173, effective March 20, 2026, expires May 31, 2029; Life and Variable Life and Variable Annuity | [Official NAIC Arizona result](https://external-lookup-web.prod.naic.org/solar-external-lookup/lookup?jurisdiction=AZ&searchType=Licensee&entityType=IND&npn=22162173), browser readback October 12 | high |
| Arkansas: active non-resident Insurance Producer, license 22162173, effective June 15, 2026, expires May 31, 2028; Life and Variable Life and Variable Annuity | [Official NAIC Arkansas result](https://external-lookup-web.prod.naic.org/solar-external-lookup/lookup?jurisdiction=AR&searchType=Licensee&entityType=IND&npn=22162173), browser readback October 12; supplied certificate agrees | high |
| Texas: active Life Agent Individual, license 3510352, effective June 12, 2026, expires May 31, 2028; Life qualification | [TDI instructions](https://www.tdi.texas.gov/agent/agent-lookup.html) → [Sircon](https://www.sircon.com/ComplianceExpress/Inquiry/consumerInquiry.do?nonSscrb=Y), Individual search for Urrea/Keenan returned matching NPN October 12 | high |
| Texas United of Omaha Life appointment active since June 24, 2026 | Same Sircon result, Affiliations/Appointments table | high |
| Portrait and contacts match supplied card | Unchanged card at `agents/assets/keenan-business-card.png`; only its portrait framed by CSS | high for transcription; channel operation untested |
| Local profile returns HTTP 200; logo and portrait load | Local curl and browser image completion readback | high |
| Mobile profile and directory have no horizontal overflow at 390px | Browser readbacks: `innerWidth=390`, `scrollWidth=390`; screenshots | high |
| Proxy mappings preserve existing homepage mapping | Node assertions with mocked upstream: four agent URL variants and homepage passed; Worker syntax and `git diff --check` passed | high for local source only |

## Map

- [Registry](../../agents/data/profiles.json) is canonical public profile input.
- [Builder](../../agents/scripts/build_pages.py) generates the
  [directory](../../agents/index.html) and
  [Keenan profile](../../agents/keenan-urrea/index.html).
- [Shared presentation](../../agents/assets/agents.css) uses the established
  Evermore lockup, shared tokens, Playfair Display and Inter.
- [Handoff](../../agents/README.md) documents rebuilding and release limits.
- Prepared routes: `/agents/` and `/agents/keenan-urrea/`, including variants
  without trailing slash, in the shared live proxy source. These routes are
  **local drafts, not live verified**.
- Owner: Evermore operator + public website owners. Authenticated Agent Suite
  and B2B Growth remain distinct surfaces.

## Visual Evidence

- [Desktop profile](../visuals/2026-10-12_keenan-desktop.png): full layout and supplied-photo framing.
- [Mobile profile](../visuals/2026-10-12_keenan-mobile.png): stacked content at 390px.
- [Preview](../visuals/2026-10-12_keenan-preview.png): desktop hero for review.

## Unknown Or Unavailable

- No public deployment or production-route proof for these pages.
- Other states have not been checked; this is not an exhaustive national search.
- Other card-listed carrier appointments and securities registration were not
  checked; no broad carrier or securities claim is added to the draft.
- Phone and email channels were not called or messaged.
- Browser navigation/FAQ click attempts returned unchanged state; activation
  was not confirmed through the automation tool. Static destinations were
  inspected, and both destination pages loaded by direct navigation.
- Original certificates remain outside the repository; no private address is
  copied into website source or this report.

## Cross-Surface Overlaps

- Agency state availability does not prove an individual agent's license.
  Use the dated individual registry and regulator links for profile claims.
- Generic quote intake has no verified Keenan assignment. Direct contact links
  avoid promising individual ownership of leads entering that shared form.
- Repository-wide Pages deployment can expose draft files. Noindex prevents
  indexing, not access; future releases must review the new directory explicitly.

## Recommended Next Move

Evermore operator reviews copy, photo framing and contacts. Publication remains
approval-gated. Recheck credentials before an approved deploy and verify public
routes afterward. Add the next person with reviewed public details and current
license evidence.

## Files Changed

- `agents/README.md`, registry, builder, shared CSS, unchanged card asset,
  generated directory and Keenan profile
- `01_website/v2/cloudflare/evermore-live-proxy.js`
- This report and linked screenshots
- `BLUEPRINTS/OVERLAPS.md`, `BLUEPRINTS/DECISIONS.md`, `BLUEPRINTS/MAP.md`
