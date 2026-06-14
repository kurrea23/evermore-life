# SETUP GUIDE 02 — Facebook Ad Campaigns
## Get your first campaigns live in Meta Ads Manager
**Do Guides 00 and 01 first. Pixel must be firing before you spend a dollar.**

> **Current status, June 13, 2026:** Campaign materials are ready, but paid ads
> remain intentionally on hold until the controlled GHL lead test and Meta Test
> Events pass. See `GUIDES_00_03_COMPLETION_HANDOFF.md`.

---

## What You're Doing in This Guide

1. Set up your Meta Business Manager correctly
2. Create your 3 campaigns (TOF / MOF / BOF)
3. Build your custom audiences
4. Launch your first ad
5. Set up the retargeting sequence

**Time estimate: 2–3 hours first time. Gets faster.**

**All ad copy is already written in:**
`04_content_narrative/FACEBOOK_AD_CAMPAIGN_COMPLETE.md`
Open that file alongside this guide.

---

## STEP 1 — Meta Business Manager Setup

Go to: `business.facebook.com`

Check these are all set up:
- [ ] Business Manager account exists
- [ ] Your Facebook Page is connected (Evermore Life page)
- [ ] Instagram account is connected (if you have one)
- [ ] Ad account is created
- [ ] Payment method is on file and verified
- [ ] Meta Pixel is connected to the ad account (Events Manager → your pixel → Connect to Ad Account)

**Ad Account Settings to verify:**
1. Ad account → **Settings**
2. Time zone: America/Phoenix
3. Currency: USD
4. Country: United States

---

## STEP 2 — Set Up Special Ad Category

This is critical. Insurance = financial product. Meta requires it.

When creating ANY campaign:
1. Click **+ Create Campaign**
2. Before anything else, look for **Special Ad Categories**
3. Select: **Credit**
4. This applies to the whole campaign — cannot change later

**If you skip this:** Meta may reject your ads or shut your account. Do not skip.

---

## STEP 3 — Create Campaign A (Top of Funnel — Video Views)

**Goal:** Build a warm audience of people who watch your story videos.

In Ads Manager → + Create:

**Campaign level:**
- Objective: **Video Views**
- Special Ad Category: **Credit**
- Campaign name: `ELC_2026_Q2_TOF_VideoViews`
- Campaign Budget Optimization: ON
- Budget: $10/day

**Ad Set level:**
- Ad set name: `ELC_2026_Q2_TOF_SoccerDad_29-50_AZ-AR-TX`
- Locations: Arizona and Texas; exclude Arkansas while pending
- Age: 29–50
- Gender: All
- Detailed targeting: Parenting, Family, Homeownership, Financial Planning
- ⚠️ With Special Ad Category "Credit" selected, detailed targeting is limited — that's normal
- Optimization: ThruPlay (15+ seconds watched)
- Placement: Automatic (let Meta decide) OR manually select: Facebook Feed, Instagram Feed, Facebook Reels, Instagram Reels

**Ad level:**
- Ad name: `ELC_2026_Q2_TOF_SoccerDad_9x16_v01`
- Format: Single video
- Upload your Soccer Dad video (or Tree/Acorn if that's what's ready)
- Primary text: Copy from `FACEBOOK_AD_CAMPAIGN_COMPLETE.md` → AD A-1
- Headline: `Your Legacy Moves On`
- CTA button: **Learn More**
- Website URL: `https://evermorelife.org` (for now — swap to funnel page when live)

**Publish the campaign.**

---

## STEP 4 — Build Your Custom Audiences (Do This Immediately After First Video Gets Views)

In Ads Manager → **Audiences → + Create Audience → Custom Audience**

**Audience 1 — Video Viewers 25%+**
- Source: Video
- Engagement: People who watched at least 25% of your video
- Select: your TOF video(s)
- Retention: 60 days
- Name: `ELC_VideoViewers_25pct_60d`

**Audience 2 — Video Viewers 75%+**
- Same as above but: 75% threshold
- Name: `ELC_VideoViewers_75pct_60d`

**Audience 3 — Funnel Page Visitors**
- Source: Website (requires pixel to be live — confirm Guide 01 is done)
- People who visited: specific pages containing your funnel URL
- Retention: 30 days
- Name: `ELC_FunnelVisitors_30d`

**Audience 4 — Lookalike (build after Audience 1 hits 500+ people)**
- Source: `ELC_VideoViewers_75pct_60d`
- Location: United States
- Size: 1%
- Name: `ELC_LAL_VideoViewers75_1pct`

---

## STEP 5 — Create Campaign B (Middle of Funnel — Traffic)

**Goal:** Send warm video viewers to your funnel page / Sarah intake.

**Wait until Audience 1 has at least 100 people before launching this.**

In Ads Manager → + Create:

**Campaign level:**
- Objective: **Traffic** (or Website Conversions if pixel has 50+ Lead events)
- Special Ad Category: **Credit**
- Campaign name: `ELC_2026_Q2_MOF_Education`
- Budget: $10/day

**Ad Set level:**
- Ad set name: `ELC_2026_Q2_MOF_HowItWorks_VideoViewers25pct`
- Custom audience: `ELC_VideoViewers_25pct_60d`
- Locations: Arizona, Texas
- Optimization: Landing Page Views

**Ad level:**
- Ad name: `ELC_2026_Q2_MOF_HowItWorks_9x16_v01`
- Primary text: Copy from `FACEBOOK_AD_CAMPAIGN_COMPLETE.md` → AD B-1
- Headline: `Here's Exactly What Happens When You Start a Coverage Review`
- CTA button: **Get Started**
- URL: Your funnel page URL (or evermorelife.org/optin until funnel page is live)

---

## STEP 6 — Create Campaign C (Bottom of Funnel — Leads)

**Goal:** Convert funnel visitors who didn't book into booked appointments.

**Wait until Audience 3 (Funnel Visitors) has at least 100 people.**

In Ads Manager → + Create:

**Campaign level:**
- Objective: **Leads** (or Conversions)
- Special Ad Category: **Credit**
- Campaign name: `ELC_2026_Q2_BOF_Retargeting`
- Budget: $5/day

**Ad Set level:**
- Custom audience: `ELC_FunnelVisitors_30d`
- Exclude: People who visited your thank-you page (they already converted)

**Ad level:**
- Ad name: `ELC_2026_Q2_BOF_SoftReEngage_v01`
- Primary text: Copy from `FACEBOOK_AD_CAMPAIGN_COMPLETE.md` → AD C-1
- Headline: `No Rush. We'll Be Here When You're Ready.`
- CTA button: **Get Started**
- URL: Your funnel page / optin URL

---

## STEP 7 — The IUL/Retirement Separate Campaign (Higher Priority Than It Looks)

This is a different audience with different copy. Run it as its own campaign.

**Campaign level:**
- Objective: Video Views or Traffic
- Special Ad Category: Credit
- Name: `ELC_2026_Q2_TOF_IUL-Retirement`
- Budget: $10/day

**Ad Set level:**
- Age: 40–58
- Interests: Retirement Planning, Financial Independence, 401k, Investing
- Locations: Arizona, Texas

**Ad level:**
- Use: AD A-3 from `FACEBOOK_AD_CAMPAIGN_COMPLETE.md`
- URL: `evermorelife.org/retirement` (the retirement v2 page — when unblocked from noindex)

---

## STEP 8 — Daily Monitoring (5 Minutes Every Morning)

Check these numbers every day:

| Metric | What it means | Action if bad |
|---|---|---|
| 3-sec video views | Are people stopping to watch? | New hook needed if <5% stop |
| ThruPlay rate | Are people watching past 15 sec? | Test new story if <10% |
| CTR to funnel | Are warm viewers clicking? | New MOF ad if <1% |
| Cost per lead | What's each form submission costing? | Kill ad if >$30 |
| Booked calls | The only metric that makes money | Everything serves this |

**Decision rule:** After 7 days OR $50 spent on any ad — keep winners, pause losers. Don't let an ad die slow.

---

## ✅ GUIDE 02 COMPLETE WHEN:
- [ ] Business Manager fully set up
- [ ] Campaign A (TOF) is live
- [ ] Custom audiences are created
- [ ] At least 1 ad is running and getting impressions
- [ ] You checked the Ads Manager on day 2 and confirmed video views are coming in
- [ ] Campaign B (MOF) launched once audience hits 100+ people

**→ Then go to SETUP_GUIDE_03_A2P_SMS.md**
