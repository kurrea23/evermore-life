# Cartographer Report: Evermore Original Lockup Restoration

- **Date:** 2026-09-11
- **Agent or operator:** Codex
- **Surface:** Evermore Life primary lockup and brand-kit derivatives
- **Mission:** Restore the approved dimensional Evermore Life lockup while
  retaining the corrected standalone tree.
- **Approval level used:** execute

## Executive Finding

The v1.1.0 path-traced lockup preserved the rough silhouette but removed the
dimensional gold finish and visibly degraded the script lettering. The operator
rejected that reconstruction. Version 1.1.1 restores the original approved
transparent lockup everywhere, removes the bad traced lockup from canonical
assets, and keeps the complete standalone tree and compact icon repairs.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| The original approved lockup is restored | `01_website/v2/assets/evermorelife-llc-logo-nav.png`; local browser review | high |
| The incorrect traced lockup is no longer canonical | Removal of `evermore-logo-master.svg` and `evermore-logo-gold.svg` | high |
| The complete standalone tree remains | `01_website/v2/assets/evermore-tree-master.svg`; `evermore-tree-gold.svg` | high |
| The kit contains 38 documented v1.1.1 assets | `asset-manifest.json`; builder output | high |
| Live production verification | Pending deployment and cache-busted review | unavailable |

## Map

- Approved primary lockup source:
  `01_website/v2/assets/evermorelife-llc-logo-nav.png`
- Complete standalone tree source:
  `01_website/v2/assets/evermore-tree-master.svg`
- Production package: `04_content_narrative/evermore_life_brand_kit/`
- Public source of truth: `01_website/v2/pages/brand.html`

## Visual Evidence

Local browser review confirmed the original gold dimensional script lettering,
original tree relationship, and original root flourish are restored. The
repaired standalone tree remains complete and visually separate from the
primary horizontal lockup.

## Unknown Or Unavailable

- No original Illustrator or EPS lockup source was available. The approved
  primary lockup therefore remains raster artwork and is labeled honestly.
- Live production state remains unavailable until v1.1.1 is deployed.

## Cross-Surface Overlaps

- Social, email, print, navigation, and brand-page previews must use the
  original dimensional lockup; only standalone-tree placements use the
  reconstructed vector mark.

## Recommended Next Move

Publish v1.1.1 and verify the restored lockup, complete tree, downloads, and
representative applications from cache-busted production URLs.

## Files Changed

- `01_website/v2/pages/brand.html`
- `04_content_narrative/evermore_life_brand_kit/`
- `04_tools/builders/build_evermore_brand_kit.py`
- `04_tools/builders/reconstruct_evermore_logo_masters.py`
- `BLUEPRINTS/DECISIONS.md`
- `BLUEPRINTS/OVERLAPS.md`
