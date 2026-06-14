# Evermore Ads Launch Control

**Baseline verified:** June 13, 2026
**Goal:** First booked call from Evermore-owned ads without spending against an unproven funnel.

## Launch Decision

**Status: HOLD PAID ADS**

Do not publish paid campaigns yet. The public site is reachable, but tracking and the lead-to-appointment workflow have not been proven end to end.

## Verified Live

- `https://evermorelife.org/`
- `https://evermorelife.org/optin`
- `https://evermorelife.org/privacy`
- `https://evermorelife.org/terms`
- `https://evermorelife.org/thank-you`
- `https://evermorelife.org/retirement`
- The live home and opt-in pages use native GHL form embeds.
- Privacy, terms, and SMS consent language are present on the public surface.

## Blocking Gates

| Gate | Current Evidence | Pass Condition | Owner |
| --- | --- | --- | --- |
| Meta Pixel | Pixel `1895928277755643` is live; source verification confirms PageView, opt-in ViewContent, and thank-you Lead event code | Confirm events appear inside Meta Test Events | Lucidus in Meta |
| Lead workflow | Native GHL form is live; downstream actions unverified | Test lead creates contact, consent, tag, opportunity, notification, email, and call task | Lucidus in GHL |
| Lead attribution | GHL form currently uses inline thank-you; `/thank-you` Lead event may not fire | Redirect successful form submission to `/thank-you` or configure a verified form-success Lead event | Lucidus in GHL + Codex |
| Campaign destination | `FUNNEL_PAGE.html` is local and contains placeholder links | Use a reviewed live URL with working privacy, terms, and Sarah/quote CTA | Codex |
| Ad package | Campaign copy exists; upload package and creatives do not | At least one compliant ad has final copy, creative, destination, tracking, audience, and budget | Codex + Lucidus |
| Licensing scope | Arizona and Texas active; Arkansas pending | Campaign geo targets only active licensed states | Lucidus |
| Meta category | Old handoff said `Credit`; current Meta category is `Financial products and services` | Confirm the category shown in the live Ads Manager flow | Lucidus in Meta |

## First Launch Slice

Launch one small campaign before building the whole nine-ad system:

| Item | Choice |
| --- | --- |
| Offer | Free coverage review |
| Audience | Arizona and Texas only |
| Creative | One approved short-form story or direct-response video |
| Destination | Live `/optin` initially; move to campaign funnel after it passes review |
| Objective | Leads |
| Starting budget | $10/day for 7 days |
| Success event | Verified GHL lead plus booked-call attribution |
| Stop rule | Pause immediately if leads are not entering GHL correctly |

## Execution Order

1. Get the correct Meta Pixel ID from the Evermore Meta Business account.
2. Run `./04_tools/scripts/wire_pixel.sh`, publish the affected live pages, and verify events.
3. Submit one clearly labeled controlled test lead through `/optin`.
4. Record the GHL result in `02_ghl/launch_kit/test-checklist.md`.
5. Fix and host `04_content_narrative/FUNNEL_PAGE.html`, or explicitly choose `/optin` as the first campaign destination.
6. Build `04_content_narrative/META_ADS_UPLOAD_PACKAGE.md` for the first launch slice.
7. Produce and approve the first creative.
8. Build the email nurture sequence and activate it.
9. Keep SMS automation disabled until A2P approval is confirmed.
10. Publish the first campaign only after every blocking gate above passes.

## Required Manual Inputs

- Meta account access to confirm deployed events inside Test Events.
- Confirmation of which Meta ad account and Facebook Page to use.
- GHL access to verify the controlled test lead and workflow actions.
- Confirmation that Texas licensing is active before adding Texas targeting.
- Final approval for the first creative and daily budget.

## Known Local Work Remaining

- Standalone funnel CTA, legal links, state claims, and high-risk promise language corrected locally; it still needs hosting and review.
- Meta Ads upload package built; account fields and final creative remain.
- Full Sarah conversation tree built; standalone live Sarah flow verified at `/sarah`; GHL AI configuration still requires account access.
- Email and SMS nurture documents built; SMS remains disabled until A2P approval.
- GHL workflow spec built; the current browser account cannot operate the protected workflow editor.
- `Evermore Life Coverage Review` calendar is created and live at `https://api.leadconnectorhq.com/widget/booking/NzsTTtQ0xBDAMXVhly7L`.
- The booking URL is wired into the email/SMS drafts, Sarah conversation-tree reference, and live `/thank-you` CTA.
- A2P submission is on hold pending EIN. Evidence screenshots are saved in `/Users/k9smac/Desktop/A2P_Screenshots/`.
- Daily campaign scoreboard built.
- Seven-video production prompt pack and 30-day organic calendar built.
- Generate and approve creative assets. HeyGen requires reauthentication.

## Exact Account Actions Remaining

1. In the live GHL form, replace every privacy link with `https://evermorelife.org/privacy` and every terms link with `https://evermorelife.org/terms`.
2. In the live GHL form, redirect successful submissions to `https://evermorelife.org/thank-you`, or configure and prove a form-success Meta Lead event.
3. Configure and activate `Evermore Website Lead Intake` from `02_ghl/launch_kit/GHL_WORKFLOW_COMPLETE_SPEC.md`, leaving all SMS actions disabled.
4. Submit one controlled Arizona test lead with SMS unchecked and verify the entire non-SMS workflow.
5. Open Meta Test Events and confirm the deployed `PageView`, `ViewContent`, and `Lead` events.
6. Reauthenticate HeyGen and generate `ELC_2026_Q2_LEAD_HowItWorks_9x16_v01`.
7. After the EIN arrives, fix the remaining A2P gaps, submit, and activate SMS only after approval.
8. Complete the account fields in `04_content_narrative/META_ADS_UPLOAD_PACKAGE.md` and approve the $10/day first-launch slice.
