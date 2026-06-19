# 01_website — Codex Handoff
**All website versions — live, v2, retirement planning v2, and experiments.**

---

## Website Versions at a Glance

| Version | Folder | Status | Notes |
|---|---|---|---|
| Current (live) | `current/` | ✅ LIVE on evermorelife.org via GHL | Final expense focused |
| v2 | `v2/pages/` | 🔨 BUILT, NOT DEPLOYED | More polished, adds chat + 404 |
| Retirement v2 | `retirement-planning-v2/pages/` | 🔨 BUILT, NOT DEPLOYED | IUL/retirement angle |
| Experiments | `experiments/` | 💻 LOCAL ONLY | Prototypes, cockpits, alternate designs |

---

## Current Live Site (`current/`)

Pages:
- `index.html` — home/landing
- `optin.html` — main lead capture (has GHL webhook config placeholder)
- `thank-you.html` — post-submission page (must fire Meta Pixel Lead event)
- `privacy.html` — privacy policy (must be live for A2P + Meta ads)
- `terms.html` — terms of service (must be live for A2P + Meta ads)

**Critical:** The Meta Pixel and GHL webhook must be verified in these pages before ads launch.

---

## Website v2 (`v2/pages/`)

Built by Codex. More polished than current. Adds:
- `chat.html` — Sarah AI chat page
- `404.html` — proper 404 page
- `sarah.html` — Sarah persona/intro page
- Shared CSS tokens and nav/footer components in `v2/shared/`

Cloudflare deployment config: `v2/cloudflare/wrangler.live-proxy.jsonc`
Deploy command: `npx wrangler deploy --config 01_website/v2/cloudflare/wrangler.live-proxy.jsonc`

**After deployment:** Update `SYSTEM_MAP.md` status.

---

## Retirement Planning v2 (`retirement-planning-v2/pages/`)

Separate landing page set targeting the IUL/retirement audience (ages 35–58).
Same structure as v2 but with retirement-focused copy.
Cloudflare deployment config: `retirement-planning-v2/cloudflare/wrangler.retirement-routes.jsonc`

---

## Experiments (`experiments/`)

Do not deploy these without review. They are prototypes.
- `EVERMORE_COCKPIT_v2.html` — desktop cockpit dashboard
- `Sarah_Evermore_AI_v2.html` — Sarah persona page v2
- `kevin_v2.html` / `KVN.html` — Kevin AI assistant prototype
- `Evermore_Landing_Page.html` — earlier landing page design
- `evermore-landing.html` — React/Babel version

---

## Tasks for Codex — This Folder

### Task A — Verify Meta Pixel in all live pages
Check each page in `current/` for the Meta Pixel snippet in `<head>`:
```html
<script>
!function(f,b,e,v,n,t,s){...}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '[PIXEL_ID]');
fbq('track', 'PageView');
</script>
```

If missing: run `04_tools/scripts/wire_pixel.sh` with the correct Pixel ID.

Additional events to add:
- `thank-you.html`: add `fbq('track', 'Lead');` after the PageView event
- `optin.html`: add `fbq('track', 'ViewContent', {content_name: 'optin_page'});`
- Booking confirmation page (if separate): add `fbq('track', 'CompleteRegistration');`

### Task B — Deploy v2 to Cloudflare
1. Confirm `v2/cloudflare/wrangler.live-proxy.jsonc` has correct account ID and project name
2. Run: `npx wrangler deploy --config 01_website/v2/cloudflare/wrangler.live-proxy.jsonc`
3. Test all pages on the deployed URL
4. Update `SYSTEM_MAP.md`

If GHL deployment is preferred instead:
- Copy each HTML file from `v2/pages/` into GHL's funnel/website builder
- Use `v2/shared/_base.css` and `v2/shared/_tokens.css` as embedded styles

### Task C — Update Sarah page for full product range
`v2/pages/sarah.html` — update copy to reflect:
- Not just final expense — also IUL, retirement planning, mortgage protection, term life
- New intro: "Hi, I'm Sarah with Evermore Life Insurance LLC. I help families compare life insurance options — from family protection and retirement planning to mortgage coverage and final expense."
- Make the booking CTA more prominent (above the fold)
- Add a quick 3-question qualifier before the booking button

### Task D — Build mortgage protection landing page
New page: `v2/pages/mortgage-protection.html`

Structure:
- Headline: "What Happens to Your Mortgage If Something Happens to You?"
- Subhead: "Mortgage protection life insurance is designed to keep your family in the home — even if you're not there."
- 3-step explainer: Apply → Compare options → Get covered
- FAQ section: "How is this different from PMI?" "What if I refinance?" "How much does it cost?"
- Sarah CTA: "See what may be available for your home loan"
- Compliance footer

Target: homeowners, ages 28–50, AZ/AR/TX

### Task E — Build IUL/retirement landing page
Optimize `retirement-planning-v2/pages/index.html` for the retirement/IUL angle:
- Headline: "Is Your Life Insurance Working as Hard as You Are?"
- Subhead: "An Indexed Universal Life policy can protect your family AND build tax-advantaged cash value for retirement."
- Section: "What is an IUL?" (plain English)
- Section: "Who is it for?" (ages 35–55, planning ahead, want retirement supplement)
- Section: "How it works" (simplified: premiums → cash value → index growth → tax-advantaged access)
- Compliance disclaimer (IUL-specific)
- Sarah CTA: "Find out if an IUL fits your situation"

---

## Shared Assets

Images in `assets/images/`:
- `evermore_logo.png` — primary logo
- `Sarah at desk.png`, `Sarah welcoming sitting.png`, `Sarah- wave.png` — Sarah persona images
- `sarah_headshot.jpg.png` — headshot

In `v2/assets/` and `retirement-planning-v2/assets/`:
- `evermorelife-llc-logo.png` — LLC logo (use this for paid ads, formal materials)
- `evermorelife-llc-logo-nav.png` — smaller nav version
- `og-evermore-life.svg` — Open Graph image for social sharing

---

## Compliance Requirements on All Pages

Every page that runs traffic must have:
1. Privacy Policy link (href to `/privacy.html` or `evermorelife.org/privacy`)
2. Terms of Service link (href to `/terms.html` or `evermorelife.org/terms`)
3. Disclaimer footer: "Coverage options vary by age, health, state, carrier,
   and eligibility. Not all applicants qualify." State-service language must
   come from `state-pages/data/states.json`; the current operator-confirmed
   state-page status is Arizona and Texas active, Arkansas pending.
4. SMS consent on any form with phone field (optional checkbox, not pre-checked)

---

## Brand Rules

- Primary colors: reference `v2/pages/_tokens.css` for all CSS variables
- Never use flat stock photo aesthetic — warm, cinematic, family-forward
- Tree/acorn motif is the brand symbol
- Tagline: "Your legacy moves on. Be there evermore."
- Voice: warm, grounded, human, protective — never fear-based, never pushy
