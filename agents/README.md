# Public agent pages

Public page sources: `/agents/` and `/agents/keenan-urrea/`. These are consumer-facing
human profiles, separate from the authenticated Agent Suite and B2B Growth page.
The operator authorized Cloudflare publication on October 12, 2026. See
`BLUEPRINTS/reports/2026-10-12_keenan-cloudflare-release.md` for verified release
status. Pages retain noindex for this first review release.

## Sources and rebuilding

- Edit the reviewed professional registry in [data/profiles.json](data/profiles.json).
- Run `python3 agents/scripts/build_pages.py` from the repository root.
- Generated `index.html` files must not be hand-edited.
- Shared layout lives in [assets/agents.css](assets/agents.css).
- Keenan's photo is displayed from the unchanged user-supplied business card,
  using CSS to frame its portrait. Replace that source with an approved standalone
  headshot when available. Do not generate a substitute likeness.
- Use the existing Evermore lockup and shared design tokens.

## License evidence

Checked October 12, 2026 through current official public lookup results:

| State | License | Type | Effective | Expires | Result |
| --- | --- | --- | --- | --- | --- |
| Arizona | 22162173 | Resident Insurance Producer | 2026-03-20 | 2029-05-31 | Active |
| Arkansas | 22162173 | Non-resident Insurance Producer | 2026-06-15 | 2028-05-31 | Active |
| Texas | 3510352 | Life Agent Individual | 2026-06-12 | 2028-05-31 | Active |

NPN: **22162173**. Source URLs and lines of authority are in the registry.
The supplied Arkansas certificate and locally found Arizona certificate agree
with the live results. Original license documents remain outside this checkout
because they contain a private address. No public certificate download is created.
Texas additionally showed an active Life appointment with United of Omaha,
dated June 24, 2026. Other card-listed carrier appointments were not checked;
no carrier-logo strip or representation claim is added to the pages.

The card supplies the mobile, Arkansas office and business email. Those channels
were transcribed, not called or emailed. Direct links reach Keenan; the shared
quote form has no verified Keenan owner routing and is not used by these pages.

## Insurance-only profile copy

Keenan requested removal of the personal-background section on October 12, 2026.
Keep his profile and introduction script focused on insurance, verified licenses,
contact details and his stated Arizona licensing preparation. Do not reintroduce
career biography without a new explicit request.

The fingerprinting/Live Scan/background-check completion statement comes directly
from Keenan's October 12 request. These process statements are distinct from the
regulator-verified license records. No private check records are stored or linked.

[INTRO_VIDEO_SCRIPT.md](INTRO_VIDEO_SCRIPT.md) is an insurance-only recording
script. No video exists on the page yet. Add a reviewed recording and captions
when available. Latest change: `BLUEPRINTS/reports/2026-10-12_keenan-insurance-only.md`.

## Release

Review the photo framing, copy, contact details and current credentials; then
obtain approval for publication. The existing Worker passes these root-level
directories through to Cloudflare Pages; no Worker change is needed.
Noindex prevents search indexing, not access: the current Pages deployment copies
repository files, so a future approved deployment can expose these drafts even
without adding navigation. Recheck credentials and remove noindex deliberately
when search indexing is approved. Do not add biography, testimonials, services,
carrier affiliations, or additional states without evidence and review.
