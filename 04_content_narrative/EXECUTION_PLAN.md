# Evermore Life — Content Execution Plan
## Week-by-Week Launch Roadmap

**Campaign Start:** Week of first script finalization
**Full Funnel Live:** Week 4
**Ongoing optimization:** Month 2+

---

## Overview: The Launch Arc

```
WEEK 1 → Script + AI video production begins
WEEK 2 → Short form clips posted, audience building starts
WEEK 3 → Retargeting infrastructure set up, audiences seeded
WEEK 4 → Hero video + funnel live, Sarah AI connected
MONTH 2+ → Content calendar, A/B testing, scale winners
```

---

## WEEK 1 — Script Finalization + AI Video Production

### Goal
Translate the Soccer Dad script and Tree/Acorn script into AI-generated video assets ready for editing. Simultaneously, shoot or generate the 3 highest-priority short-form hooks.

### Tasks

**Content:**
- Finalize Soccer Dad script (see `STORY_SCRIPTS/soccer_dad_script.md`) — lock scene directions and voiceover text
- Finalize Tree/Acorn script (see `STORY_SCRIPTS/tree_acorn_brand_story.md`)
- Select top 3 hooks from `short_form_hooks.md` to produce first: recommended starting set = Hook #1 (He Never Made the Pros), Hook #4 (My Mom Already Took Care of It), Hook #7 (What Happens When You Apply)

**AI Video Production:**
- Generate Soccer Dad scenes 1–4 using **Runway ML** or **Sora** (see `AI_VIDEO_PROMPTS.md` for scene-by-scene prompts)
- Generate Tree/Acorn spot visuals using **Runway** or **Midjourney** → **Runway** (static to motion pipeline)
- Record spokesperson segment for Acts 5–6 of hero video using **HeyGen** (realistic AI presenter) or real founder on camera
- Record voiceover for all video using **ElevenLabs** ("Daniel" voice — warm male, measured pace, 0.85x speed)

**Music:**
- License track from **Artlist.io** — search: "emotional piano legacy cinematic strings build"
  - Must be available for commercial use, no content ID issues on YouTube/Meta
  - Need a 6-minute version for hero video + 30-second edit + 15-second edit

**Estimated AI Production Costs — Week 1:**
| Tool | Usage | Est. Cost |
|------|-------|-----------|
| Runway ML Gen-4 | ~30 clips × 4–8 sec each | $40–80/mo (Standard plan) |
| ElevenLabs | Full voiceover across all assets | $22/mo (Creator plan) |
| HeyGen | Spokesperson segments | $29/mo (Creator plan) |
| Artlist.io | Music license | $199/yr or $29.90/mo |
| Midjourney | Thumbnail + still frames | $10–30/mo |
| **Total Week 1** | | **~$100–160** |

---

## WEEK 2 — Short Form Clips Posted, Audience Building Begins

### Goal
Get the first 3–5 short-form videos live on TikTok, Instagram Reels, and YouTube Shorts. Start building the retargeting audience from day one. Begin pixel warming.

### Tasks

**Video Editing:**
- Edit Hook #1, #4, #7 using **CapCut** (free, mobile/desktop) or **DaVinci Resolve** (free, desktop)
- Add captions to every video (auto-caption in CapCut → review for accuracy)
- Export 9:16 vertical for TikTok/Reels/Shorts + 1:1 square cut for Facebook feed
- Thumbnail: warm, textured, single line of text — generate with Midjourney or Canva

**Posting Schedule — Week 2:**
| Day | Platform | Video |
|-----|----------|-------|
| Mon | TikTok + Reels | Hook #1 — He Never Made the Pros |
| Tue | YouTube Shorts | Hook #7 — What Happens When You Apply |
| Wed | TikTok + Reels | Hook #4 — My Mom Already Took Care of It |
| Thu | Facebook (page + feed) | Hook #1 (repurposed) |
| Fri | TikTok + Reels | Hook #7 (repurposed) |
| Sat | YouTube Shorts | Hook #4 |

**Platform Setup:**
- TikTok Business Account — ensure pixel is installed on funnel page
- Instagram Business Account — connected to Facebook Business Manager
- YouTube channel — Evermore Life branded, about section filled, links to funnel page
- Facebook Page — professional, cover photo, CTA button → funnel page

**Tracking:**
- UTM parameters on every link in bio: `?utm_source=tiktok&utm_medium=organic&utm_campaign=launch_w2`
- Log views, likes, saves, shares, and comments daily in a simple tracking sheet

**Estimated Costs — Week 2:**
| Item | Cost |
|------|------|
| CapCut (if Pro needed) | $0–$8/mo |
| Canva Pro (thumbnails, graphics) | $15/mo |
| Posting (all organic) | $0 |
| **Total Week 2** | **~$15–23/mo overhead** |

---

## WEEK 3 — Retargeting Infrastructure + Paid Amplification Begins

### Goal
Install tracking pixels everywhere, build custom audiences from Week 2 viewers, and launch low-budget paid promotion on the best-performing organic content. Do not run full paid campaigns yet — this week is about seeding audiences for the Week 4 hero video launch.

### Tasks

**Pixel Setup:**
- **Meta Pixel** → Install on `FUNNEL_PAGE.html` (add to `<head>` tag)
  - Events to track: PageView, ViewContent (ICP pathway clicked), Lead (Sarah AI started), CompleteRegistration (call booked)
- **TikTok Pixel** → Install on funnel page
  - Events: ViewContent, InitiateCheckout (Sarah AI), CompletePayment (if applicable)
- **Google Tag Manager** → Use GTM container to manage all pixels from one place — cleaner, faster
- **Hotjar or Microsoft Clarity** → Install free heatmap tool to see how visitors interact with FUNNEL_PAGE.html

**Audience Building in Meta Ads Manager:**
Create these custom audiences now (they'll be seeded by Week 4):
1. **Video viewers 75%+** — Anyone who watched 75% or more of any of your Facebook/Instagram videos
2. **Funnel page visitors** — Anyone who visited FUNNEL_PAGE.html in last 30 days
3. **Sarah AI starters** — Anyone who hit the Sarah CTA (track as ViewContent event with `content_name: 'sarah_start'`)
4. **Lookalike 1%** — Lookalike of your video viewers 75%+ audience (minimum 100 people to create)

**TikTok Audience Building:**
1. **Video engagers (75%+ watch)** — TikTok Ads Manager → Custom Audience → Video Interactions
2. **Profile visitors** — Anyone who visited your TikTok profile in last 30 days

**Paid Promotion — Week 3 (Optional Boost):**
- Take the best-performing organic post from Week 2 (highest save rate + watch time)
- Boost on Facebook/Instagram: $10–20/day, 7 days, cold audience
- Target: Ages 28–50, interest in parenting/family, income $50K+, US only
- Goal: Video Views (optimize for ThruPlay — 15+ seconds watched)
- Do NOT send to funnel page yet — just build the audience

**Estimated Costs — Week 3:**
| Item | Cost |
|------|------|
| GTM (Google Tag Manager) | Free |
| Hotjar / Clarity | Free |
| Facebook/Instagram paid boost | $70–140 (7 days × $10–20/day) |
| TikTok optional boost | $50–100 |
| **Total Week 3** | **$120–240** |

---

## WEEK 4 — Hero Video Live + Funnel Page Live + Sarah AI Connected

### Goal
The full funnel goes live. The Soccer Dad hero video is published on YouTube and Facebook. The funnel page is deployed. Sarah AI is connected. Retargeting campaigns go live pointing to the hero video and then to the funnel page.

### Tasks

**Hero Video Launch:**
- Upload Soccer Dad video to YouTube (unlisted first for review, then public)
  - Title: "He Was the Best Player in His County. Then He Had a Son. | Evermore Life"
  - Description: Brand story + link to funnel page + key timestamps
  - Thumbnail: The father/son embrace, warm-toned, with text overlay
- Upload to Facebook as native video (NOT YouTube link — native video gets more reach)
- Upload 90-second Tree/Acorn brand spot simultaneously as brand page header video

**Funnel Page Deployment:**
- Deploy `FUNNEL_PAGE.html` to hosting
  - Options: **Webflow** (easiest visual control), **Netlify** (free tier, just drop the HTML), or **WordPress** with Elementor
  - Domain: `evermorelife.com/legacy` or `legacy.evermorelife.com`
- Embed YouTube video into the hero video placeholder in the HTML file
- Replace `href="https://evermorelife.com/sarah"` with the actual Sarah AI intake URL
- Test all CTA buttons, mobile responsiveness, pixel firing

**Sarah AI Integration:**
- Connect Sarah AI intake to the funnel page CTA buttons
- Configure Sarah to collect: name, age, health situation, coverage goal (protect family vs. protect parents), budget range
- Sarah should present 2–3 coverage options and offer to connect with a human advisor if desired
- Book-a-call integration: **Calendly** embed at end of Sarah flow

**Retargeting Campaigns — Live This Week:**
Launch three retargeting campaigns:

**Campaign A — Video Viewers → Hero Video**
- Audience: Short-form video viewers 75%+ (from Week 2–3)
- Content: Soccer Dad hero video (or 90-sec cut)
- Objective: Video Views / ThruPlay
- Budget: $20–30/day
- Platforms: Facebook, Instagram

**Campaign B — Hero Video Viewers → Funnel Page**
- Audience: People who watched 75%+ of the hero video
- Content: Simple testimonial or brand clip + CTA ("Talk to Sarah →")
- Objective: Traffic / Landing Page Views
- Budget: $15–25/day
- Platforms: Facebook, Instagram, YouTube

**Campaign C — Funnel Page Visitors → Sarah CTA**
- Audience: Funnel page visitors who did NOT click Sarah
- Content: Direct response — "Still thinking about it? Sarah's waiting. No pressure."
- Objective: Conversions (Lead event)
- Budget: $10–15/day
- Platforms: Facebook, Instagram

**Estimated Costs — Week 4:**
| Item | Cost |
|------|------|
| Netlify hosting (funnel page) | Free |
| Calendly for booking | Free (basic) |
| Retargeting Campaigns A+B+C | $350–500/week |
| **Total Week 4** | **~$350–500** |

---

## MONTH 2+ — Content Calendar + Scale + Optimization

### Content Calendar — Ongoing Rhythm

**Weekly Production Targets:**
- 3–5 short-form posts (TikTok + Reels + Shorts)
- 1 medium-form post (YouTube/Facebook — 2–3 min)
- 2 Facebook organic posts (education or story content)

**Monthly Content Themes:**

| Month | Theme | Content Focus |
|-------|-------|---------------|
| Month 1 | Launch / Awareness | Soccer Dad story, Tree/Acorn brand, foundational hooks |
| Month 2 | Education | "Did you know" series, Term vs IUL vs Final Expense explainers |
| Month 3 | Testimonials | Real or UGC-style "why I got covered" stories |
| Month 4 | ICP2 Push | Adult child / protect your parents content push |
| Month 5 | Legacy | Long-form legacy stories, graduation/wedding/first job |
| Month 6 | Scale Winners | Double down on highest-performing content types |

### A/B Testing Protocol

**What to test (run simultaneously, evaluate at 7 days):**
1. Hook pairs: Hook #1 vs Hook #6 (ICP1 emotional) — which drives more 75%+ completions?
2. Hook pairs: Hook #4 vs Hook #8 (ICP2 emotional) — which drives more saves and profile visits?
3. Hero video thumbnail A/B: Father/son embrace vs. stadium wide shot
4. CTA copy A/B on funnel page: "Talk to Sarah" vs. "Find My Coverage"
5. Pathway card CTA: "Get My Family Covered" vs. "See My Options in 10 Minutes"

**Decision rule:** After 7 days and minimum 500 impressions, pause the lower-performing variant. Winner continues. New challenger introduced.

### Scale Framework

**When to scale a paid campaign:**
- Cost Per Lead (CPL) is under $25 → increase budget by 30% and monitor for 3 days
- If CPL stays under $30 after scale → increase again
- If CPL rises above $40 → pause, review creative, test new hook

**KPIs to track weekly:**
| Metric | Target |
|--------|--------|
| Short-form video avg watch time | >50% |
| 75%+ video completion rate | >15% |
| Funnel page conversion rate (visitor → Sarah start) | >8% |
| Sarah start → call booked | >30% |
| Cost per lead (Sarah start) | <$25 |
| Cost per booked call | <$75 |

---

## AI Tools Master List

| Tool | Purpose | Cost/Mo | Link |
|------|---------|---------|------|
| **Runway ML** | AI cinematic video generation | $40 (Standard) | runwayml.com |
| **Sora** (OpenAI) | Long-form AI video scenes | ~$20+ (Plus) | openai.com |
| **HeyGen** | AI spokesperson / talking head | $29 (Creator) | heygen.com |
| **ElevenLabs** | Voiceover generation | $22 (Creator) | elevenlabs.io |
| **Midjourney** | Still frames, thumbnails, storyboard | $10 (Basic) | midjourney.com |
| **Pika Labs** | Short motion video clips | Free/$8 | pika.art |
| **CapCut** | Video editing (free, mobile/desktop) | Free | capcut.com |
| **Canva Pro** | Thumbnails, graphics, story assets | $15 | canva.com |
| **Artlist.io** | Licensed music | $200/yr | artlist.io |
| **Descript** | Transcription + caption editing | $12 (Creator) | descript.com |
| **Meta Ads Manager** | Facebook/Instagram paid campaigns | Free (ad spend varies) | — |
| **TikTok Ads Manager** | TikTok paid campaigns | Free (ad spend varies) | — |
| **Google Tag Manager** | Pixel management | Free | tagmanager.google.com |
| **Calendly** | Call booking | Free | calendly.com |
| **Hotjar / Clarity** | Heatmaps on funnel page | Free | — |

**Estimated Total Monthly Stack Cost (tools only):**
~$155–200/month for the full AI production toolkit

**Estimated Monthly Ad Spend (after launch):**
- Minimum viable: $500/month (brand awareness + retargeting)
- Recommended: $1,500–3,000/month (to see meaningful conversion volume)
- Scale phase: $5,000+/month once CPL is proven under $25

---

## 30-Day Budget Summary

| Phase | Content/Production | Ad Spend | Total |
|-------|-------------------|----------|-------|
| Week 1 | $100–160 | $0 | $100–160 |
| Week 2 | $15–23 | $0 | $15–23 |
| Week 3 | $0 | $120–240 | $120–240 |
| Week 4 | $0 | $350–500 | $350–500 |
| **Month 1 Total** | **~$115–183** | **~$470–740** | **~$585–923** |

*Tool subscriptions are ongoing monthly costs. AI video generation costs front-load in Week 1.*
