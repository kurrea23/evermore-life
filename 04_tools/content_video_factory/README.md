# Evermore Content Video Factory

This local Remotion project turns the existing vertical source clips into
silent, captioned rough cuts for review.

It does not publish content, buy ads, generate voiceover, or call a rough cut
final.

## Run

From this folder:

```bash
npm install
npm run render:rough-cuts
```

Rough cuts render to:

`04_content_narrative/ad_campaign_scaffold/exports/rough-cuts/`

The compositions and captions are driven by:

`04_content_narrative/ad_campaign_scaffold/activation_manifest.json`

After review, add approved voiceover/music or revise the caption-only edit,
then export a reviewed final to the final path listed in the matching generated
post package.
