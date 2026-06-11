# Evermore Life Retirement Planning Website

This is a separate copy of the live Evermore Life V2 website, repositioned around:

- Indexed universal life (IUL)
- Retirement income planning
- Family income protection
- Mortgage protection
- Legacy and estate liquidity
- Annuities

The existing website in `01_website/v2` and the current GHL-facing pages were not modified.

## Preview

Open `pages/index.html` locally. The design system, layout, animations, assets, and responsive behavior mirror the live V2 website.

## Draft Status

This edition is published as a private-preview route family under `evermorelife.org/retirement*`. It remains intentionally marked `noindex, nofollow` until the business identity, GHL intake, and compliance details are final.

Launch blockers:

1. Confirm that `Evermore Life Insurance LLC` is legally formed and approved for use.
2. Confirm whether `/retirement` remains the permanent public route.
3. Create a separate GHL form, pipeline, workflow, calendar, tags, and A2P-compliant messaging for this business lane.
4. Replace the copied GHL form ID `e8RIDTdhAVlc6CT9Zfj5` before launch.
5. Confirm carrier/product availability and all IUL/annuity advertising language with compliance.
6. Replace the copied phone, email, address, licensing disclosures, and privacy terms if the new entity uses different information.
7. Remove `noindex, nofollow`, update `robots.txt`, and update `sitemap.xml` only after the launch details are confirmed.

## Folder Structure

- `pages/` - public website pages
- `assets/` - copied Evermore Life visual assets
- `shared/` - reusable nav, footer, and design tokens
- `cloudflare/` - isolated Worker that owns only `evermorelife.org/retirement*`
- `PARTNERSHIP_STRATEGY.md` - recommended front-end partnership channels
- `LAUNCH_HANDOFF.md` - exact launch sequence and integration checklist
