# Evermore Life Meta Ads Manager Handoff

**Last live account work:** June 14, 2026, America/Phoenix  
**Purpose:** Finish the Evermore Life Meta campaigns after approved creative files are available.  
**Current status:** Campaign scaffolding exists in Meta Ads Manager as unpublished drafts. Do not publish yet.

## Live Account Context

| Item | Verified value |
| --- | --- |
| Meta business ID | `1524120968375509` |
| Ad account ID | `324565498427892` |
| Dataset / Pixel name | `Evermore Life` |
| Dataset / Pixel ID | `1895928277755643` |
| Facebook Page | `Evermore Life LLC` |
| Instagram profile | `@evermorelifellc` |
| Special Ad Category | `Financial products and services` |
| Licensed launch states | Arizona and Arkansas |
| Texas | Pending; do not target until licensing is confirmed active |
| Primary destination | `https://evermorelife.org/optin` |
| Lead success page | `https://evermorelife.org/thank-you` |

## Safety State

- All Evermore campaign scaffolds are unpublished drafts.
- Campaign-level switches were left off.
- The intended Evermore ad sets were left off when Meta allowed the toggle to save.
- Never click `Review and publish` or `Publish` until the launch gates below pass.
- Meta may display an authentication warning with error `#3858385`.
- No active payment method was verified. The account owner will add one later.
- Existing unrelated campaigns and drafts must not be edited or discarded.

## Organic Content Workspace - Live Check June 14, 2026

- Meta Business Suite opened on the verified `Evermore Life LLC` account with
  Facebook and Instagram connected.
- The Content workspace showed no organic drafts in the current date range.
- The only visible published Page items were the April 29, 2026 profile-picture
  and cover-photo updates.
- No organic post, reel, schedule, publish, boost, or spend action was executed.
- The paste-ready loading queue is
  `META_ORGANIC_CONTENT_BATCH_30DAY.md`; the flat tracking queue is
  `meta_organic_queue.csv`.
- Load drafts only after the in-app browser is reopened. Keep publish, schedule,
  boost, and ad-spend actions approval-gated.
- The repository's current service source says Arizona and Texas active with
  Arkansas pending. Do not reuse the older Arizona/Arkansas paid-targeting
  instructions below until the state conflict is resolved and live routing is
  verified.

## Draft Campaign Hierarchy

### 1. Top Of Funnel: Video Views

| Level | Draft name | Intended setting |
| --- | --- | --- |
| Campaign | `ELC_2026_Q2_TOF_VideoViews` | Engagement objective; Financial products and services |
| Ad set | `ELC_2026_Q2_TOF_SoccerDad_29-50_AZ-AR` | On-ad engagement; Video views; Maximize ThruPlay views |
| Ad | `ELC_2026_Q2_TOF_SoccerDad_9x16_v01` | Soccer Dad video; PageView tracking |

Finish with:

- Campaign budget: `$10/day`.
- Locations: Arizona and Arkansas only.
- Placements: Advantage+ placements unless approved creative has placement limitations.
- Identity: Evermore Life LLC and `@evermorelifellc`.
- Destination: `https://evermorelife.org/`.
- CTA: `Learn More`.
- Headline: `Your Legacy Moves On`.
- Copy source: `../FACEBOOK_AD_CAMPAIGN_COMPLETE.md`, AD A-1.

### 2. Middle Of Funnel: Education Traffic

| Level | Draft name | Intended setting |
| --- | --- | --- |
| Campaign | `ELC_2026_Q2_MOF_Education` | Traffic objective; Financial products and services |
| Ad set | `ELC_2026_Q2_MOF_HowItWorks_VideoViewers25pct` | Website traffic; Landing Page Views |
| Ad | `ELC_2026_Q2_MOF_HowItWorks_9x16_v01` | How-it-works creative; Website event tracking |

Finish with:

- Campaign budget: `$10/day`.
- Audience: `ELC_VideoViewers_25pct_60d` after it exists and reaches at least 100 people.
- Locations: Arizona and Arkansas only.
- Destination: `https://evermorelife.org/optin`.
- CTA: `Get Started`.
- Headline: `Here's Exactly What Happens When You Start a Coverage Review`.
- Copy source: `../FACEBOOK_AD_CAMPAIGN_COMPLETE.md`, AD B-1.
- Do not launch before the video-viewer audience is large enough.

### 3. Bottom Of Funnel: Retargeting Leads

| Level | Draft name | Intended setting |
| --- | --- | --- |
| Campaign | `ELC_2026_Q2_BOF_Retargeting` | Leads objective; Financial products and services |
| Ad set | `ELC_2026_Q2_BOF_FunnelVisitors_30d` | Retarget opt-in visitors |
| Ad | `ELC_2026_Q2_BOF_SoftReEngage_v01` | Soft re-engagement creative |

Finish with:

- Campaign budget: `$5/day`.
- Include audience: `ELC_FunnelVisitors_30d`.
- Exclude audience: `ELC_ThankYouVisitors_180d`.
- Destination: `https://evermorelife.org/optin`.
- CTA: `Get Started`.
- Headline: `No Rush. We'll Be Here When You're Ready.`
- Copy source: `../FACEBOOK_AD_CAMPAIGN_COMPLETE.md`, AD C-1.
- Do not launch until `ELC_FunnelVisitors_30d` reaches at least 100 people.

### 4. IUL / Retirement Top Of Funnel

| Level | Draft name | Intended setting |
| --- | --- | --- |
| Campaign | `ELC_2026_Q2_TOF_IUL-Retirement` | Traffic objective; Financial products and services |
| Ad set | `ELC_2026_Q2_TOF_IUL-Retirement_40-58_AZ-AR` | Retirement-focused audience |
| Ad | `ELC_2026_Q2_TOF_IUL-Retirement_v01` | IUL / retirement creative |

Finish with:

- Campaign budget: `$10/day`.
- Locations: Arizona and Arkansas only.
- Destination: `https://evermorelife.org/retirement`.
- Use compliant IUL copy from `../FACEBOOK_AD_CAMPAIGN_COMPLETE.md`, AD A-3.
- Include the educational-content and not-financial-advice disclosures.
- Do not make guaranteed growth, tax, income, or suitability claims.

## Custom Audiences Created

| Audience | Rule | Live status |
| --- | --- | --- |
| `ELC_FunnelVisitors_30d` | Dataset `Evermore Life`; URL contains `/optin`; past 30 days | Created; populating; available for use |
| `ELC_ThankYouVisitors_180d` | Dataset `Evermore Life`; URL contains `/thank-you`; past 180 days | Created |

Create after an approved TOF video exists:

| Audience | Rule |
| --- | --- |
| `ELC_VideoViewers_25pct_60d` | People who watched at least 25% of approved Evermore videos; 60 days |
| `ELC_VideoViewers_75pct_60d` | People who watched at least 75% of approved Evermore videos; 60 days |
| `ELC_LAL_VideoViewers75_1pct` | US 1% lookalike after the 75% source reaches at least 500 people |

## Pixel And Website Evidence

Pixel ID `1895928277755643` is installed in the live GitHub-backed website content.

| URL | Expected browser events |
| --- | --- |
| `https://evermorelife.org/` | `PageView` |
| `https://evermorelife.org/optin` | `PageView`, `ViewContent` |
| `https://evermorelife.org/thank-you` | `PageView`, `Lead` |

Before publishing, confirm these events appear in Meta Events Manager Test Events using a normal browser with tracking protection disabled.

## Creative Drop Folder And Naming

Place final approved files in:

`04_content_narrative/ad_campaign_scaffold/assets/generated/`

Preferred filenames:

```text
ELC_2026_Q2_TOF_SoccerDad_Legacy_9x16_v01_final.mp4
ELC_2026_Q2_MOF_Sarah_HowItWorks_9x16_v01_final.mp4
ELC_2026_Q2_BOF_SoftReEngage_1x1_v01_final.mp4
ELC_2026_Q2_TOF_IUL-Retirement_v01_final.mp4
```

Update `creative_output_tracker.md` when each file arrives and after approval.

Creative requirements:

- Vertical `9:16` MP4 preferred for video.
- Include burned-in captions.
- Keep key text and faces inside mobile-safe areas.
- No fabricated testimonials or implied guaranteed outcomes.
- Use only approved Evermore branding and licensed-state claims.
- Add the required compliance disclosure in ad text.

## Exact Finish Sequence

1. Confirm the approved creative filenames and map one file to each draft ad.
2. Open each draft ad and upload its creative.
3. Paste the matching primary text, headline, description, CTA, and destination.
4. Enable website-event tracking and confirm dataset `Evermore Life`.
5. Add UTM parameters:

```text
utm_source=meta&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}
```

6. At the ad-set level, set Arizona and Arkansas only.
7. Set Advantage+ placements unless the approved creative requires exclusions.
8. Apply `ELC_FunnelVisitors_30d` and `ELC_ThankYouVisitors_180d` to BOF.
9. Create and apply video-viewer audiences after TOF creative exists.
10. Set budgets: TOF `$10/day`, MOF `$10/day`, BOF `$5/day`, retirement `$10/day`.
11. Confirm every campaign and ad set remains off.
12. Complete Meta authentication if error `#3858385` remains.
13. Attach and verify a payment method.
14. Run a controlled `/optin` lead and verify GHL plus Meta `Lead`.
15. Review every draft for compliance and destination correctness.
16. Obtain explicit human approval before publishing.

## Pre-Publish Gates

- [ ] Approved creative uploaded for every ad being launched.
- [ ] Meta authentication warning cleared.
- [ ] Payment method attached and verified.
- [ ] Meta Test Events confirms `PageView`, `ViewContent`, and `Lead`.
- [ ] Controlled lead reaches GHL and the follow-up workflow works.
- [ ] Only Arizona and Arkansas are targeted.
- [ ] Special Ad Category is `Financial products and services`.
- [ ] Every ad includes required compliance language.
- [ ] Every URL and CTA works.
- [ ] Campaign and ad-set budgets match the approved plan.
- [ ] Human approval received for publish and spend.

## Known Meta Interface Notes

- Meta currently names the required category `Financial products and services`, not `Credit`.
- Meta may default new draft campaigns and ad sets to visually on even though they remain unpublished. Always turn them off before final review.
- The account contains unrelated solar campaigns and older drafts. Do not edit or discard them.
- Do not use `Discard drafts` globally; it could remove unrelated user work.
- The BOF Leads flow may default to Instant Forms. Change the conversion location to Website before launch if the goal remains the live Evermore opt-in funnel.

## Source Documents

- `../FACEBOOK_AD_CAMPAIGN_COMPLETE.md` - complete campaign copy.
- `../META_ADS_UPLOAD_PACKAGE.md` - paste-ready launch package.
- `campaign_matrix.md` - creative and funnel-stage map.
- `creative_output_tracker.md` - creative production state.
- `higgsfield_mcp_brief.md` - generation briefs.
- `../../00_START_HERE/SETUP_GUIDE_02_FACEBOOK_ADS.md` - original setup guide.
- `../../00_START_HERE/ADS_LAUNCH_CONTROL.md` - launch gates and hold decision.
