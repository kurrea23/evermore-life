# Cartographer Report: Keenan insurance-only profile

- **Date:** 2026-10-12 (America/Phoenix)
- **Agent or operator:** Codex + Keenan Urrea
- **Surface:** Public Keenan profile copy
- **Mission:** Remove personal career background and keep the page focused on insurance.
- **Approval level used:** execute; direct correction to the existing live page.

## Executive Finding

Removed the biography from the canonical registry and regenerated the page.
The About Me section and its link no longer render. The introduction script
also now focuses only on insurance. Header, contact buttons, license details
and Arizona licensing-preparation copy are retained. The corrected
[profile](https://evermorelife.org/agents/keenan-urrea/) is deployed and verified
live from source `e38de8a`; [Cloudflare origin](https://537a5f18.evermore-life.pages.dev/agents/keenan-urrea/) was also verified.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Removal directly requested | Operator's October 12 correction | high |
| Current public sources omit the rejected background | `agents/data/profiles.json`, generated profile/directory and introduction script; scoped phrase/anchor checks passed | high |
| Insurance details remain | Generated profile contains direct contact options, current dated license records and Live Scan completion statement | high |
| Source patch is consistent | Builder succeeded and `git diff --check` passed | high |
| Public correction is verified | Profile, registry and script returned HTTP 200 and matched source SHA-256; rejected content and About anchor absent | high |
| Cloudflare publish succeeded | `deploy.sh`: 481 source files, 9 uploaded, 505 already uploaded; existing seven-route sweep passed | high |

## Map

Existing routes and owners are unchanged. The registry remains canonical.
An absent biography input correctly omits its section and the hero anchor.

## Visual Evidence

[Corrected live profile](../visuals/2026-10-12_keenan-insurance-only-live.png).

## Unknown Or Unavailable

Introduction video still has no recording. No new license or contact-channel
verification was performed in this copy-only update.

## Cross-Surface Overlaps

Keep the profile and future video script aligned with the current insurance-only
direction; historical reports describe prior states and must not regenerate copy.

## Recommended Next Move

Continue with the insurance-only profile and script. Do not restore the
removed personal-background content unless Keenan explicitly requests it.

## Files Changed

- Registry, generated profile, README and introduction-video script
- This report, live screenshot, `BLUEPRINTS/DECISIONS.md`, `BLUEPRINTS/OVERLAPS.md`
