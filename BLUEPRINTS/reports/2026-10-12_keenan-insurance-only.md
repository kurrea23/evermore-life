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
and Arizona licensing-preparation copy are retained. Live release pending.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Removal directly requested | Operator's October 12 correction | high |
| Current public sources omit the rejected background | `agents/data/profiles.json`, generated profile/directory and introduction script; scoped phrase/anchor checks passed | high |
| Insurance details remain | Generated profile contains direct contact options, current dated license records and Live Scan completion statement | high |
| Source patch is consistent | Builder succeeded and `git diff --check` passed | high |

## Map

Existing routes and owners are unchanged. The registry remains canonical.
An absent biography input correctly omits its section and the hero anchor.

## Visual Evidence

Live capture pending publication.

## Unknown Or Unavailable

Introduction video still has no recording. No new license or contact-channel
verification was performed in this copy-only update.

## Cross-Surface Overlaps

Keep the profile and future video script aligned with the current insurance-only
direction; historical reports describe prior states and must not regenerate copy.

## Recommended Next Move

Publish the correction and verify the public page no longer contains the biography.

## Files Changed

- Registry, generated profile, README and introduction-video script
- This report, `BLUEPRINTS/DECISIONS.md`, `BLUEPRINTS/OVERLAPS.md`
