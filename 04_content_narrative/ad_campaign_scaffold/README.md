# Evermore Life Ad Campaign Scaffold

This folder is the operating lane for turning the Evermore story system into actual ads.

**Start here for today's content queue:** `CONTENT_ACTIVATION_BOARD.md`

**Start here for the paste-ready 30-day Meta batch:** `META_ORGANIC_CONTENT_BATCH_30DAY.md`

**Resume Meta organic draft loading here:** `META_CONTENT_LOADING_HANDOFF.md`

**Start here for the live Meta account state:** `META_ADS_MANAGER_HANDOFF.md`

The existing campaign docs define the message. This scaffold defines the production workflow:

1. Pick a campaign cell from `campaign_matrix.md`.
2. Copy the matching prompt from `higgsfield_mcp_brief.md`.
3. Generate video assets through Higgsfield or another video model.
4. Save generated files in `assets/generated/`.
5. Log every take in `creative_output_tracker.md`.
6. Approve winners and export final ad packages from `exports/`.
7. Run `../../04_tools/scripts/build_content_activation.py` to refresh the
   post packages and organic-to-paid activation gates.

## Production Lanes

| Lane | Purpose |
| --- | --- |
| `assets/inputs/` | Brand references, still frames, product screenshots, voiceover, music refs |
| `assets/generated/` | Raw model outputs from Higgsfield, Sora, Runway, or other tools |
| `exports/` | Final cutdowns ready for Meta, TikTok, YouTube, or GHL follow-up |
| `campaign_matrix.md` | The ad map: audience, offer, hook, format, CTA, metric |
| `higgsfield_mcp_brief.md` | Prompt queue and output contract for the Higgsfield MCP |
| `creative_output_tracker.md` | Take log, status board, and launch notes |
| `META_ADS_MANAGER_HANDOFF.md` | Live Meta account IDs, draft hierarchy, audiences, blockers, and exact finish sequence |
| `activation_manifest.json` | Structured source of truth for real assets, post copy, and paid promotion paths |
| `CONTENT_ACTIVATION_BOARD.md` | Generated daily queue connecting production, organic posts, and paid activation |
| `exports/post_packages/` | Generated paste-ready captions, URLs, and paid-promotion gates |
| `META_ORGANIC_CONTENT_BATCH_30DAY.md` | Full paste-ready Facebook and Instagram organic batch |
| `meta_organic_queue.csv` | Flat operating queue for draft loading, review, and status tracking |
| `META_CONTENT_LOADING_HANDOFF.md` | Verified live organic-content state and exact resume path |

## Naming Convention

Use one stable ID across prompt, file, ad, and tracker rows:

```text
ELC_2026_Q2_[STAGE]_[STORY]_[ANGLE]_[FORMAT]_v##
```

Examples:

```text
ELC_2026_Q2_TOF_SoccerDad_Legacy_9x16_v01
ELC_2026_Q2_MOF_Sarah_HowItWorks_9x16_v01
ELC_2026_Q2_BOF_Sarah_NoPressure_1x1_v01
```

## Status Values

| Status | Meaning |
| --- | --- |
| `Briefed` | Prompt and campaign row are ready |
| `Generating` | Model job has been started |
| `Needs Review` | Raw output exists and needs selection |
| `Approved` | Creative can be edited or posted |
| `Exported` | Final platform-ready version exists |
| `Launched` | Live in ad account or organic post |
| `Paused` | Held due to quality, compliance, or performance |

## Compliance Notes

Keep insurance claims plain and conservative:

- Do not promise guaranteed approval unless the product actually supports it.
- Avoid precise savings claims without carrier-backed proof.
- Avoid fear-heavy language that implies immediate catastrophe.
- Use "options," "coverage review," and "what you may qualify for" when qualification depends on age, health, location, or carrier underwriting.
- Keep Sarah framed as intake and education unless the live flow is verified to quote, qualify, or book.

## First Production Batch

Start with five ads:

1. Soccer Dad legacy short, 9:16, cold audience.
2. Mom took care of it, 9:16, cold adult-child audience.
3. What happens when you apply, 9:16, warm audience.
4. No pressure Sarah reminder, 1:1, page visitor retargeting.
5. What funeral costs actually are, 9:16, adult-child education.
