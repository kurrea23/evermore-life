# Codex Handoff — Evermore State Pages (Homepage-Clone System)

**Last updated:** June 14, 2026
**Owner action that triggered this:** "Make the state pages pixel-for-pixel like
evermorelife.org, custom per state, with a state hero image on top."

This document is the source of truth for how the per-state landing pages are
built now. It supersedes the older bespoke "premium editorial" template approach
that previously lived in this folder.

---

## 1. What this system produces

A scalable family of state landing pages at `evermorelife.org/<state>/` that are
a faithful clone of the live homepage (`01_website/current/index.html`) — same
navy (`#0d1b4b`) and gold (`#c8a96e`), same Segoe UI type, same section order —
with only the copy localized per state and a full-bleed state photo behind the
hero.

Currently built (all drafts, `noindex, nofollow`, nothing deployed):

- **Arizona** — `active` — embeds the live quote form, hero photo of the Sonoran desert.
- **Texas** — `active` — embeds the live quote form, hero photo of the Hill Country.
- **Arkansas** — `pending` — "coming soon" availability-updates page, hero photo of the Ozarks.

---

## 2. Key decisions (so you don't re-litigate them)

1. **Pixel-for-pixel = clone the real homepage.** The template and stylesheet are
   a direct port of `01_website/current/index.html`. A CSS diff confirms every
   homepage style rule is reproduced. The only intentional deltas: dropped the
   homepage's dead `.optin-form`/`.inline-consent` rules (unused — the homepage
   uses the GHL iframe), added `align-items:center` to the nav, and added a
   required compliance disclosure line in the footer.
2. **Text logo, not PNG.** The homepage uses a text logo ("Evermore" white +
   "Life" gold). An earlier scaffold swapped in a PNG `<img>` that wasn't
   rendering — that was the missing-logo bug. Do **not** reintroduce a PNG logo;
   keep the text logo so it matches the homepage.
3. **Active states embed the same GoHighLevel form** (id `e8RIDTdhAVlc6CT9Zfj5`,
   stored in `data/states.json`). CTAs scroll to `#contact`. Per-state form
   tracking is intentionally deferred (see §7).
4. **Pending states never touch the active funnel.** No `/optin`, no GHL form, no
   booking — enforced by the generator. They offer an availability-updates
   `mailto:` only.
5. **Medium localization, no invented facts.** Hero, intro, "Why <State>", and
   quote heading speak from inside the state (cities/regions). No invented
   stats, laws, offices, license numbers, or carrier availability.

---

## 3. File map

```
01_website/state-pages/
├── data/states.json            ← per-state content + form id + email (EDIT THIS)
├── templates/state-page.html   ← shared HTML structure with {{TOKENS}}
├── assets/state-pages.css      ← shared stylesheet (port of homepage CSS)
├── assets/hero-<state>.jpg     ← per-state hero photos (1376×768, ~200 KB)
├── schema/state-page.schema.json ← validation shape (schema_version 2)
├── scripts/build_state_pages.py  ← validator + deterministic generator
├── public/<slug>/index.html    ← GENERATED output (do not hand-edit)
├── public/assets/              ← GENERATED copy of css + hero images
├── README.md, SWARM_RUNBOOK.md, AGENT_CONTEXT_PROFILE.md, STATE_PAGE_QA.md
└── CODEX_HANDOFF.md            ← this file
```

**Rule:** never hand-edit anything in `public/`. Edit data/template/CSS and rebuild.

---

## 4. How to build

From the repo root:

```bash
python3 01_website/state-pages/scripts/build_state_pages.py
```

The script validates every state, fails loudly on compliance or missing-field
errors, copies the CSS and each state's hero image into `public/assets/`, and
writes `public/<slug>/index.html`. Open the generated files in a browser to
review desktop + mobile.

---

## 5. How to add a new state

1. Add a hero image to `assets/` named `hero-<slug>.jpg` (see §6 to generate one).
2. Add a state object to the `states` array in `data/states.json`. Required
   fields (validator enforces all of them): `name, slug, code, status,
   status_label, robots, canonical, hero_image, seo_title, seo_description,
   hero_title, hero_title_accent, hero_sub, products_sub, why_title, why_sub,
   why_cards (exactly 4), optin_heading, optin_sub, optin_disclaimer`.
3. Set `status`:
   - `active` → embeds the quote form, CTAs go to `#contact`. `canonical` must
     end `/<slug>/`.
   - `pending` → availability-updates mailto only; must stay `noindex, nofollow`.
4. Run the build. Fix any validation errors it prints.
5. Run the launch gates in `STATE_PAGE_QA.md` before anything goes live.

The generator derives all CTAs, the status pill, the form/email block, and the
hero overlay from `status` + the data — you only write copy.

---

## 6. Hero image system

Each state's hero is the photo behind a dark navy gradient so the white headline
stays readable. The generator builds the inline `background-image` (gradient +
`url('../assets/<file>')`) from the `hero_image` field; `state-pages.css` holds
the `.hero` sizing and a navy fallback.

The three current photos were generated as photorealistic, text-free landscapes
(Sonoran desert / Hill Country / Ozarks) at 16:9, downscaled to 1376×768 JPEG
~82% quality (~200 KB each) for web performance.

**To replace or add an image:** drop a new `hero-<slug>.jpg` in `assets/`,
point the state's `hero_image` at it, and rebuild. Keep them wide (16:9-ish),
under ~300 KB, and free of embedded text. If a `hero_image` is omitted, the hero
falls back to the original solid navy gradient automatically.

---

## 7. Deferred / open items

- **State-tagged form routing.** All active states currently post to the same
  GHL form id. When lead attribution per state is needed, give each active state
  its own form id (or append a hidden `state`/`source` param) in `states.json`
  and thread it through `render_ghl_form`. Owner explicitly deferred this.
- **Going live.** Pages are `noindex, nofollow` drafts. Publishing, routing
  verification, and conversion tracking remain owner-approved steps.
- **Footer address.** All pages show the real Phoenix HQ address (no invented
  local offices). Revisit only if real per-state offices exist.

---

## 8. Compliance guardrails already enforced by the build

- Pending/unavailable states cannot emit `/optin`, the GHL form, `leadconnectorhq`,
  `msgsndr`, or `widget/form`; active states must contain the embedded form.
- Non-active states must remain `noindex, nofollow`.
- `canonical` must end with the state slug.
- Banned-claim scan (guaranteed approval, everyone qualifies, "licensed in all
  50 states," nationwide, cheapest/lowest/best price, etc.).
- Required insurance disclosure is rendered in every footer.
- Exactly four `why_cards` per state; unresolved template tokens fail the build.
