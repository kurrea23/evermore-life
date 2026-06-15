# Evermore Meta Ads Upload Package

**Prepared:** June 13, 2026
**Launch status:** Draft-ready; do not publish until Pixel and GHL test-lead gates pass.
**Active geographies:** Arizona and Texas only. Do not add Texas until licensing is confirmed active.

## Account-Level Setup

| Setting | Value |
| --- | --- |
| Buying type | Auction |
| Special Ad Category | Financial products and services, if required by the current Meta flow |
| Business time zone | America/Phoenix |
| Conversion location | Website |
| Initial destination | `https://evermorelife.org/optin` |
| Initial success event | `Lead` on `https://evermorelife.org/thank-you` |
| Exclusions | Existing customers, booked leads, issued clients, opted-out contacts |

## Required Pre-Publish Gates

- Correct Meta Pixel ID is installed and `PageView` and `Lead` test events pass.
- A controlled `/optin` submission creates the correct GHL contact, opportunity, task, and email.
- Final creative is approved and contains no fake testimonial framing or unsupported claim.
- Ad account, Facebook Page, Instagram account, payment method, and identity verification are confirmed.

## First Launch Slice

### Campaign

| Field | Value |
| --- | --- |
| Campaign name | `ELC_2026_Q2_LEADS_CoverageReview_AZ-AR_v01` |
| Objective | Leads |
| Budget | $10/day for 7 days |
| Campaign budget | Off for the first test |
| Stop rule | Pause immediately if any verified lead fails to enter GHL correctly |

### Ad Set

| Field | Value |
| --- | --- |
| Ad set name | `AZ-AR_Adults_CoverageReview_Broad_v01` |
| Location | Arizona; Texas |
| Age | Adults permitted by the current Financial Products and Services category |
| Gender | All |
| Audience | Broad; do not rely on restricted targeting that Ads Manager removes |
| Placements | Advantage+ placements |
| Optimization | Leads |
| Attribution | Use the current account default; document it in the scoreboard |
| Destination | `https://evermorelife.org/optin?utm_source=meta&utm_medium=paid_social&utm_campaign=elc_2026_q2_leads&utm_content=coverage_review_v01` |

### Ad 1: Coverage Review Explainer

| Field | Value |
| --- | --- |
| Ad name | `ELC_2026_Q2_LEAD_HowItWorks_9x16_v01` |
| Creative | 30-second Sarah/process explainer; vertical with captions |
| CTA | Learn More |
| Headline | Start a Simple Coverage Review |
| Description | Clear options. No pressure. |

**Primary text**

> Life insurance is not one-size-fits-all. Your age, health, state, budget, and goals all matter.
>
> Evermore Life helps families in Arizona and Texas start a simple coverage review and compare options that may fit.
>
> No pressure. No obligation. Just a clearer next step.
>
> Coverage options vary by age, health, state, product type, carrier, and eligibility. Not all applicants qualify. This is a solicitation for insurance.

### Ad 2: Legacy Story Challenger

| Field | Value |
| --- | --- |
| Ad name | `ELC_2026_Q2_LEAD_SoccerDad_9x16_v01` |
| Creative | 30-35 second Soccer Dad illustrative story; label as a story about legacy |
| CTA | Learn More |
| Headline | Your Legacy Moves On |
| Description | Start a simple coverage review. |

**Primary text**

> Some dreams do not end. They move through the people we love.
>
> Protection is one more way to keep showing up for the people who carry your story.
>
> Evermore Life helps families in Arizona and Texas compare life insurance options based on their goals and situation.
>
> Coverage options vary by age, health, state, product type, carrier, and eligibility. Not all applicants qualify. This is a solicitation for insurance.

## Warm Audience Campaigns

Build these only after the source audience exists and the Pixel is proven.

| Stage | Campaign | Audience | Ad | Budget |
| --- | --- | --- | --- | ---: |
| MOF | `ELC_2026_Q2_LPV_Education_AZ-AR_v01` | 50%+ video viewers, 60 days | How It Works | $5/day |
| BOF | `ELC_2026_Q2_LEADS_Retarget_AZ-AR_v01` | `/optin` visitors excluding `/thank-you`, 30 days | No Pressure | $5/day |

## Custom Audiences

| Name | Rule |
| --- | --- |
| `ELC_VideoViewers_50pct_60d` | People who watched at least 50% of approved Evermore videos in 60 days |
| `ELC_OptinVisitors_30d` | URL contains `evermorelife.org/optin`, 30 days |
| `ELC_Leads_180d` | Pixel `Lead` event or uploaded GHL lead list, 180 days |
| `ELC_Optin_NoLead_30d` | Opt-in visitors excluding leads, 30 days |

## Naming Template

`ELC_2026_Q2_[OBJECTIVE]_[ANGLE]_[AZ-AR]_[FORMAT]_v01`

## Launch-Day Record

Fill this before publishing:

| Item | Value |
| --- | --- |
| Meta ad account | `[CONFIRM]` |
| Facebook Page | `[CONFIRM]` |
| Instagram account | `[CONFIRM]` |
| Pixel ID | `[CONFIRM]` |
| Pixel test date | `[CONFIRM]` |
| Controlled GHL lead ID | `[CONFIRM]` |
| Approved creative path | `[CONFIRM]` |
| Human approver | `[CONFIRM]` |
