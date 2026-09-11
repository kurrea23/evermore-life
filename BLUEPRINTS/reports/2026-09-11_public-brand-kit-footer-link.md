# Cartographer Report: Public Brand Kit Footer Link

- **Date:** 2026-09-11
- **Agent or operator:** Codex
- **Surface:** Evermore Life public website footer navigation
- **Mission:** Make the approved brand kit discoverable from the bottom of the public website without adding it to primary navigation.
- **Approval level used:** execute

## Executive Finding

The canonical `/brand` page is now linked as **Brand Kit** from the footer of every public v2 website page and from the shared footer source. The placement preserves the existing footer typography and keeps the primary navigation unchanged.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| The homepage footer contains one Brand Kit link | `01_website/v2/pages/index.html` | high |
| All other public v2 page footers contain the same link | `01_website/v2/pages/{optin,privacy,terms,thank-you,chat,recruiting}.html` | high |
| Future footer reuse includes the link | `01_website/v2/shared/_footer.html` | high |
| The link targets the canonical brand route | `href="/brand"` in each footer | high |

## Map

The public brand destination remains `01_website/v2/pages/brand.html`, served at `/brand`. Footer navigation is statically embedded in current public pages, with `01_website/v2/shared/_footer.html` acting as the reusable source for future page work.

## Visual Evidence

Live visual verification is recorded through the deployed homepage footer and the existing `/brand` page; no repository screenshot was required for this navigation-only change.

## Unknown Or Unavailable

None at implementation time. Production status is recorded only after live deployment and route verification.

## Cross-Surface Overlaps

The public navigation surface now exposes the same canonical brand source already governing website, campaign, product, email, social, and print work.

## Recommended Next Move

Use the footer link as the public entry point and continue keeping `/brand` out of the primary navigation unless the operator explicitly changes that decision.

## Files Changed

- `01_website/v2/pages/index.html`
- `01_website/v2/pages/optin.html`
- `01_website/v2/pages/privacy.html`
- `01_website/v2/pages/terms.html`
- `01_website/v2/pages/thank-you.html`
- `01_website/v2/pages/chat.html`
- `01_website/v2/pages/recruiting.html`
- `01_website/v2/shared/_footer.html`
- `BLUEPRINTS/OVERLAPS.md`
- `BLUEPRINTS/DECISIONS.md`

