# SETUP GUIDE 01 — Website & Meta Pixel
## Get your pixel firing on every page so Meta knows what's happening
**Do Guide 00 first. Come back here when GHL form test passes.**

> **Current status, June 13, 2026:** Pixel `1895928277755643` and conversion
> event code are deployed live. Meta Test Events confirmation remains. See
> `GUIDES_00_03_COMPLETION_HANDOFF.md`.

---

## What You're Doing in This Guide

1. Get your Meta Pixel ID
2. Install the pixel across all live pages
3. Verify the pixel is firing correctly
4. Deploy the v2 website (optional upgrade)

**Time estimate: 30–45 minutes**

---

## STEP 1 — Get Your Meta Pixel ID

1. Go to: `business.facebook.com`
2. Navigate to: **Events Manager** (left sidebar)
3. Find your pixel — it's called something like "Evermore Life Pixel" or similar
4. Click on it → the Pixel ID is a 15-16 digit number shown at the top
5. Write it here: `PIXEL ID: ___________________________`

**If you don't have a pixel yet:**
1. Events Manager → **+ Connect Data Sources → Web → Meta Pixel**
2. Name it: `Evermore Life`
3. Enter your website URL: `evermorelife.org`
4. Copy the Pixel ID

---

## STEP 2 — Install the Pixel on Your Pages

Run the wiring script from your terminal:

```bash
cd /Users/k9smac/Desktop/EVERMORE-LIFE
./04_tools/scripts/wire_pixel.sh
```

When prompted, paste your Pixel ID.

**If the script doesn't cover all pages, I'll add it manually. Tell me and I'll edit each file for you.**

The pixel code that should be in the `<head>` of every page:
```html
<!-- Meta Pixel -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID_HERE');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID_HERE&ev=PageView&noscript=1"/></noscript>
<!-- End Meta Pixel -->
```

**Pages that need this:**
- `01_website/current/index.html` ← primary live page
- `01_website/current/optin.html` ← lead capture (add ViewContent event too)
- `01_website/current/thank-you.html` ← conversion page (Lead event already there, just needs pixel to load)
- `01_website/v2/pages/index.html`
- `01_website/v2/pages/optin.html`
- `04_content_narrative/FUNNEL_PAGE.html`

---

## STEP 3 — Add Conversion Events to Key Pages

The base pixel fires PageView everywhere. We need specific events on conversion pages.

**On `optin.html`** — add after the base pixel:
```html
<script>fbq('track', 'ViewContent', {content_name: 'optin_page'});</script>
```

**On `thank-you.html`** — confirm this is present (Codex added it):
```html
<script>
  if (typeof fbq !== 'undefined') fbq('track', 'Lead', { content_name: 'Evermore Thank You Page' });
</script>
```
This fires the `Lead` event which Meta uses to optimize your ad campaigns. Critical for retargeting.

**On booking confirmation page (when you have one):**
```html
<script>fbq('track', 'CompleteRegistration');</script>
```

---

## STEP 4 — Verify the Pixel is Firing

Install this Chrome extension: **Meta Pixel Helper**
(Search "Meta Pixel Helper Chrome extension" → install it)

Then:
1. Open `https://evermorelife.org`
2. The Pixel Helper icon in your browser toolbar should show a green checkmark
3. Click it — confirm you see:
   - Pixel ID matches your ID
   - PageView event fired
4. Go to `/optin` — confirm ViewContent fires
5. Submit a test form — go to `/thank-you` — confirm Lead fires

**If anything is missing → tell me exactly what the Pixel Helper shows and I'll fix the code.**

---

## STEP 5 — Upload Updated Pages to GHL

After the pixel is in your pages, push the updated files to GHL:

1. Log into GHL
2. Go to: **Sites → Website** (or Funnels, depending on how it's set up)
3. For each page (index, optin, thank-you, privacy, terms):
   - Open the page editor
   - Go to **Custom Code / Header** section
   - Paste the pixel code in the `<head>` section

**OR** if your GHL site uses the HTML files directly:
- Go to **Settings → Custom Code** → add pixel to the global `<head>`
- This adds it to ALL pages at once — faster

The global `<head>` method is better. One paste, covers everything.

---

## STEP 6 (Optional) — Deploy v2 Website

The v2 website is built and polished. Current site is older. To upgrade:

**Option A — Deploy via Cloudflare (already configured):**
```bash
cd /Users/k9smac/Desktop/EVERMORE-LIFE
npx wrangler deploy --config 01_website/v2/cloudflare/wrangler.live-proxy.jsonc
```

**Option B — Replace pages in GHL manually:**
- Copy the HTML content from each `01_website/v2/pages/*.html` file
- Paste into GHL page editor for each page

**Before deploying v2:** confirm the real GHL form ID (from Guide 00, Step 1) is already in `v2/pages/optin.html`. The placeholder ID `e8RIDTdhAVlc6CT9Zfj5` must be replaced first.

---

## ✅ GUIDE 01 COMPLETE WHEN:
- [ ] Pixel ID is in all live pages
- [ ] Meta Pixel Helper shows green on evermorelife.org
- [ ] PageView fires on home and optin
- [ ] Lead event fires on thank-you page
- [ ] GHL global `<head>` has pixel code
- [ ] (Optional) v2 site deployed

**→ Then go to SETUP_GUIDE_02_FACEBOOK_ADS.md**
