# Cartographer Report: Arizona Main Page Source Update

- **Date:** 2026-06-25
- **Agent or operator:** Codex
- **Surface:** Arizona state page source and generated output
- **Mission:** Make the Pages-backed Arizona state page behave as the main Arizona page surface.
- **Approval level used:** draft

## Executive Finding

The Arizona page source already governs the Pages origin path and the Worker-backed
`evermorelife.org/arizona/` route. The source update aligned the state-page
brand links with the homepage text-logo pattern and absolute Evermore home route,
then regenerated all state pages from the shared template.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Cloudflare Pages origin for the Arizona asset path returned HTTP 200 before source edits. | `curl -I https://evermore-life.pages.dev/01_website/state-pages/public/arizona/` on 2026-06-25 | high |
| The public apex route maps `/arizona/` to the Pages state-page output. | `01_website/v2/cloudflare/evermore-live-proxy.js` route map | high |
| Arizona remains canonicalized to the main public route. | `01_website/state-pages/public/arizona/index.html` canonical and Open Graph URL | high |
| State pages now use text-logo brand links to `https://evermorelife.org/` instead of a relative generated-path PNG link. | `01_website/state-pages/templates/state-page.html`, `01_website/state-pages/assets/state-pages.css`, regenerated `01_website/state-pages/public/arizona/index.html` | high |
| The hero kicker is no longer timing-gated behind the Arizona hero video, so the headline treatment is stable on first paint. | `01_website/state-pages/templates/state-page.html`, regenerated `01_website/state-pages/public/arizona/index.html` | high |
| The Worker rewrite now preserves state-page hero poster and video paths under the state-page public assets folder. | `01_website/v2/cloudflare/evermore-live-proxy.js` | high |
| The public Worker was deployed with the Arizona video-route fix. | `npx --yes wrangler@latest deploy --config wrangler.live-proxy.jsonc`, Worker version `518301f6-9527-4ab6-b6b4-da291d143da6` | high |
| The public Arizona route now rewrites the hero poster and video to the state-page assets. | `curl -L https://evermorelife.org/arizona/` after deploy | high |
| The public Arizona video and poster assets return HTTP 200. | `curl -I https://evermorelife.org/01_website/state-pages/public/assets/hero-arizona.mp4` and `.jpg` | high |
| The generator completed successfully after the source update. | `python3 01_website/state-pages/scripts/build_state_pages.py` | high |

## Map

The canonical state-page source remains `01_website/state-pages/data/states.json`
plus `01_website/state-pages/templates/state-page.html` and
`01_website/state-pages/assets/state-pages.css`. Generated output remains under
`01_website/state-pages/public/<state>/index.html`. The Worker maps
`evermorelife.org/arizona/` to `01_website/state-pages/public/arizona/` at the
Pages origin.

## Visual Evidence

No screenshots were captured in this pass.

## Unknown Or Unavailable

This pass deployed the Cloudflare Worker route fix only. The live Pages origin
and apex route were checked before and after the Worker update, and the visible
mismatch was traced to the live Worker rewrite pointing the Arizona video/poster
at a different asset lane than the raw Pages state page.

## Cross-Surface Overlaps

State-page "main page" behavior spans generated state output, Cloudflare Pages
origin paths, and the Worker clean-route map. Future Arizona edits should avoid
hand-editing `public/arizona/index.html` and should verify both the Pages origin
path and `evermorelife.org/arizona/` after an approved publish.

## Recommended Next Move

Open `https://evermorelife.org/arizona/` in a fresh tab or hard refresh the
existing tab and confirm the video version is now the main public Arizona page.

## Files Changed

- `01_website/state-pages/templates/state-page.html`
- `01_website/state-pages/assets/state-pages.css`
- `01_website/state-pages/public/assets/state-pages.css`
- `01_website/state-pages/public/arizona/index.html`
- `01_website/state-pages/public/texas/index.html`
- `01_website/state-pages/public/arkansas/index.html`
- `01_website/v2/cloudflare/evermore-live-proxy.js`
- `BLUEPRINTS/reports/2026-06-25_arizona-main-page-source-update.md`
