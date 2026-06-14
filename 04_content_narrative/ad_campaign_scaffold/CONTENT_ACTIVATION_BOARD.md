# Evermore Content Activation Board

**Generated from:** `activation_manifest.json` on 2026-06-14  
**Service status source:** `01_website/state-pages/data/states.json`  
**Current repository service scope:** Arizona, Texas active; Arkansas pending  
**Paid launch status:** `HOLD`

## Operating Truth

- 5 rough cuts need review; 0 source-clip sets are edit ready; 0 platform-ready finals exist; 1 priority item still needs production.
- A source-clip set is not a post. A rough cut is not an approved final. An organic post is not automatically safe to promote.
- Paid hold reason: Live GHL state routing, controlled lead flow, Meta Test Events, final creative approval, and human publish approval remain required.
- Live GHL routing still needs to be proven against the current state contract before traffic or spend.

## Fastest Useful Sequence

1. Produce and approve `How It Works`; it is the first paid-launch creative.
2. Review the five generated silent rough cuts, then add approved voiceover/music or revise captions.
3. Export one approved final, use its generated post package, and publish organically.
4. Record seven-day watch, share, click, and lead evidence before choosing a story creative for paid promotion.
5. Keep Meta drafts off until every live funnel and approval gate passes.

## Queue

| Priority | Creative | Stage | Real asset state | Clips | Organic next move | Paid bridge |
| ---: | --- | --- | --- | ---: | --- | --- |
| 1 | `ELC_2026_Q2_LEAD_HowItWorks_9x16_v01` | LEAD | **Needs production** | 0/0 | Produce asset, then use `exports/post_packages/how-it-works/POST_PACKAGE.md` | First paid launch creative; hold |
| 2 | `ELC_2026_Q2_TOF_SoccerDad_Legacy_9x16_v01` | TOF | **Rough cut needs review** | 7/7 | Review rough cut, finish edit, then use `exports/post_packages/soccer-dad-legacy/POST_PACKAGE.md` | Top-of-funnel video-view campaign; hold |
| 3 | `ELC_2026_Q2_TOF_ChefDaughter_Legacy_9x16_v01` | TOF | **Rough cut needs review** | 6/6 | Review rough cut, finish edit, then use `exports/post_packages/chef-daughter-legacy/POST_PACKAGE.md` | Organic-first TOF challenger; hold |
| 4 | `ELC_2026_Q2_TOF_Graduation_Legacy_9x16_v01` | TOF | **Rough cut needs review** | 8/8 | Review rough cut, finish edit, then use `exports/post_packages/graduation-legacy/POST_PACKAGE.md` | Organic-first TOF challenger; hold |
| 5 | `ELC_2026_Q2_MOF_FinalExpense_Clarity_9x16_v01` | MOF | **Rough cut needs review** | 4/4 | Review rough cut, finish edit, then use `exports/post_packages/final-expense-clarity/POST_PACKAGE.md` | Warm-audience education candidate; hold |
| 6 | `ELC_2026_Q2_TOF_TreeKeepsGrowing_9x16_v01` | TOF | **Rough cut needs review** | 5/5 | Review rough cut, finish edit, then use `exports/post_packages/tree-keeps-growing/POST_PACKAGE.md` | Brand-awareness candidate; hold |

## Paid Promotion Gates

A post can move into a paid ad only when all are true:

- [ ] Platform-ready final asset exists and was reviewed.
- [ ] Illustrative stories are labeled as stories; product-focused copy includes the required disclosure.
- [ ] Destination and UTM URL were checked.
- [ ] Current active-state targeting matches the canonical service-status source.
- [ ] Live GHL state routing and controlled lead flow passed.
- [ ] Meta Test Events passed for the intended conversion event.
- [ ] Organic evidence or a deliberate direct-response test justifies the spend.
- [ ] Human approval to publish and spend was recorded.

## Commands

```bash
./04_tools/scripts/build_content_activation.py
cd 04_tools/content_video_factory && npm run render:rough-cuts
```

The builder regenerates this board and every file under `exports/post_packages/`.
