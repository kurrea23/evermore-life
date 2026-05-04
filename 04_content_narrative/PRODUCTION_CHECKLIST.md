# Evermore Life — Production Checklist
## Phase-by-Phase Pre-Launch Ops Form

**Source:** Imported from Cinematic Legacy Campaign (09_Execution_Form.md) + expanded
**Use:** Check off each item before advancing to the next phase. Do not skip ahead.

---

## Phase 1 — Campaign Foundation

- [ ] Confirm campaign name (recommendation: "Your Legacy Moves On")
- [ ] Confirm main tagline ("Your legacy moves on. Be there evermore.")
- [ ] Confirm Evermore tree/acorn visual motif is locked
- [ ] Confirm primary offer: simple coverage review (no hard close on first touch)
- [ ] Confirm primary target audience for first campaign (ICP1 or ICP2)
- [ ] Confirm licensed states for advertising
- [ ] Confirm which carriers can be mentioned publicly in ads
- [ ] Confirm compliance disclaimers (see COMPLIANCE_CHECKLIST.md)
- [ ] Confirm GHL native form fields (see GHL_SARAH_AI_FLOW.md)
- [ ] Confirm SMS consent checkbox copy approved by compliance

---

## Phase 2 — Story Development

- [ ] Finalize the Soccer Dad hero story script (see STORY_SCRIPTS/soccer_dad_script.md)
- [ ] Lock voiceover script for full hero video (5:30–6:00 min)
- [ ] Break hero video into 8–12 discrete scenes (see script Acts 1–6)
- [ ] Create character bible for father (see AI_VIDEO_PROMPTS.md — Character Bibles)
- [ ] Create character bible for son
- [ ] Create setting bible: home, soccer field, stadium, tree
- [ ] Create shot list for each scene
- [ ] Plan 7 short-form cutdowns from the hero story
- [ ] Confirm which 4 alternate family stories to produce in Month 2 (see additional_legacy_stories.md)

---

## Phase 3 — AI Visual Production

- [ ] Generate still reference images for father, son, home, field, stadium, tree (Midjourney)
- [ ] Lock visual style: cinematic, warm, realistic, emotional, premium (see AI_VIDEO_PROMPTS.md style notes)
- [ ] Generate each scene as short 5–8 second clips (Runway ML / Sora)
- [ ] Use seed/reference frames to maintain character consistency across scenes
- [ ] Generate B-roll shots: hands, cleats, tree, photos, work boots, stadium lights
- [ ] Export all clips in both 16:9 (YouTube/Facebook) and 9:16 (TikTok/Reels)
- [ ] Organize clips by scene number in a shared folder
- [ ] Review every clip for: distorted faces, extra fingers, text artifacts, logos on clothing
- [ ] Replace broken or unusable AI footage with new generations
- [ ] Generate thumbnail frames for each short-form hook (Midjourney 9:16)

---

## Phase 4 — Audio & Editing

- [ ] Record or generate voiceover (ElevenLabs "Daniel" voice or real talent)
- [ ] Select music licensed for commercial use (Artlist.io — "emotional piano cinematic strings")
- [ ] License a 6-minute track + 30-second edit + 15-second edit of the same piece
- [ ] Add subtle sound design: ambient crowd, wind through leaves, stadium echo
- [ ] Edit 5:30–6:00 minute hero video (Acts 1–6 per soccer_dad_script.md)
- [ ] Edit 90-second brand spot (tree_acorn_brand_story.md)
- [ ] Edit 7 short-form vertical clips (30–45 seconds each)
- [ ] Add captions to every video
- [ ] Add Evermore Life end card to every video
- [ ] Add required compliance disclaimer to hero video lower-third and/or end card
- [ ] Export master versions in 4K (or highest quality available from AI tool)
- [ ] Export social cuts: 9:16 for TikTok/Reels, 16:9 for YouTube, 1:1 for Facebook feed

---

## Phase 5 — Funnel Page

- [ ] Host FUNNEL_PAGE.html on Webflow, Netlify, or GHL funnel builder
- [ ] Deploy at recommended URL: `/coverage-review` or `/legacy`
- [ ] Embed YouTube hero video into video placeholder slot (replace placeholder SVG)
- [ ] Replace Sarah AI CTA href with actual GHL form or chat widget URL
- [ ] Replace carrier logos row with only carriers you are contracted/allowed to advertise
- [ ] Update phone number in footer disclaimer
- [ ] Link Privacy Policy and Terms of Service pages
- [ ] Add compliance disclaimer footer (see COMPLIANCE_CHECKLIST.md)
- [ ] Install Meta Pixel with standard events: PageView, ViewContent, Lead, CompleteRegistration
- [ ] Install TikTok Pixel with equivalent events
- [ ] Install Google Tag Manager container (manages both pixels from one place)
- [ ] Install Hotjar or Microsoft Clarity (free heatmap)
- [ ] Test all CTA buttons on desktop and mobile
- [ ] Test ICP pathway cards scroll and anchor links
- [ ] Test complete form submission end-to-end
- [ ] Verify contact created in GHL on form submit
- [ ] Verify thank-you page / confirmation message displays correctly
- [ ] Verify GHL workflow triggers correctly (see GHL_SARAH_AI_FLOW.md)

---

## Phase 6 — Sarah AI / GHL Appointment Flow

- [ ] Create Sarah chat widget in GHL with welcome message
- [ ] Add all 7 qualification questions in correct order
- [ ] Add calendar booking trigger after Q7
- [ ] Add guardrails to Sarah's response library (see GHL_SARAH_AI_FLOW.md guardrails section)
- [ ] Add SMS consent language to all message flows
- [ ] Test complete lead capture flow (submit form → Sarah contacts → appointment booked)
- [ ] Test appointment confirmation SMS sends correctly
- [ ] Test 24-hour reminder SMS
- [ ] Test STOP/unsubscribe removes contact from all sequences immediately
- [ ] Test mobile experience (most leads will engage on mobile)
- [ ] Test Calendly/GHL calendar booking link
- [ ] Set up pipeline stages in GHL (see GHL_SARAH_AI_FLOW.md pipeline stages)

---

## Phase 7 — Organic Posting

- [ ] Post first emotional short (Hook #1 — Soccer Dad condensed)
- [ ] Post educational clip same day or next day (Hook #7 — What Happens When You Apply)
- [ ] Pin hero story or brand intro to profile top
- [ ] Add link-in-bio CTA pointing to funnel page (use Linktree or direct link)
- [ ] Monitor first 48 hours: views, saves, shares, comments
- [ ] Respond to all comments in first 48 hours (boosts organic reach)
- [ ] Note any recurring questions in comments → add to FAQ video list
- [ ] Save high-performing hooks (top 3 by watch time and save rate after 7 days)

---

## Phase 8 — Paid Ads / Retargeting

- [ ] Confirm ad account is in compliance with Meta's Special Ad Category requirements
- [ ] Select correct Special Ad Category (Financial Products & Services) in Meta Ads Manager
- [ ] Upload emotional story video to Meta Ads Library
- [ ] Create custom audience: video engagement (75%+ watch, last 30 days)
- [ ] Create custom audience: funnel page visitors (last 30 days)
- [ ] Create lookalike audience: 1% lookalike of 75% video viewers
- [ ] Launch education retargeting campaign (Bucket 2 — see RETARGETING_MAP.md)
- [ ] Launch coverage review retargeting (Bucket 3 — see RETARGETING_MAP.md)
- [ ] Set up campaign naming convention (see RETARGETING_MAP.md)
- [ ] Track weekly: CPL, appointment rate, show rate
- [ ] Set up UTM parameters on all paid links

---

## Phase 9 — Optimization (Ongoing)

- [ ] After 7 days: identify top 3 performing hooks by watch time and save rate
- [ ] After 14 days: pause bottom-performing A/B variants
- [ ] Identify best-performing story type (emotional vs. educational vs. testimonial)
- [ ] Identify best-performing CTA copy ("Talk to Sarah" vs. "Start My Coverage Review")
- [ ] Identify most common viewer questions from comments → create answer videos
- [ ] Cut hero video into additional 15–30 second clips as hook tests
- [ ] Refresh creative every 2–3 weeks to prevent ad fatigue
- [ ] Improve funnel page copy based on heatmap data and common questions
- [ ] Scale winning campaigns (see EXECUTION_PLAN.md scale framework)
