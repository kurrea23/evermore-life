# Evermore Life — Website v2 Codex Handoff
## "Take It to the Finish Line"

---

## 🎯 Context & Goal

Evermore Life LLC is a licensed independent life insurance brokerage in Phoenix, AZ.
We are rebuilding the website from scratch in a **block-based architecture** so sections
can be patched independently without breaking the whole page.

**Primary goal:** A clean, professional standalone website that:
1. Passes A2P 10DLC registration review (SMS compliance)
2. Ranks on Google for local life insurance searches
3. Educates visitors with animated data visualizations
4. Converts visitors to quote requests via GHL embedded form

**GitHub repo:** `https://github.com/kurrea23/evermore-life`
**Live site (GitHub Pages):** `https://evermorelife.org/`
**Brand domain (eventually points here):** `https://evermorelife.org`

---

## 📁 File Structure

```
01_website/v2/
├── shared/
│   ├── _tokens.css       ← ALL design tokens (colors, spacing, fonts) — edit ONLY this for brand changes
│   ├── _base.css         ← Reset, typography, utility classes, scroll-reveal animation
│   ├── _nav.html         ← Reusable nav block (reference only)
│   └── _footer.html      ← Reusable footer block (reference only)
└── pages/
    ├── index.html         ← Homepage — DONE ✅
    ├── optin.html         ← Quote/lead capture page — DONE ✅
    ├── privacy.html       ← Privacy Policy — DONE ✅
    └── terms.html         ← Terms of Service — DONE ✅
```

---

## ✅ What's Already Done

- [x] Git repo initialized and pushed to GitHub
- [x] GitHub Pages enabled — site is live
- [x] Design token system (`_tokens.css`) — single source of truth for all brand values
- [x] Global nav block — sticky, mobile hamburger, gold CTA button
- [x] Global footer block — 4-column grid, license disclosure, legal links
- [x] `index.html` — full homepage with:
  - Hero section with eyebrow tag, h1, subheading, dual CTA buttons, carrier list
  - Trust bar (5 stats)
  - Products grid (6 cards: Final Expense, Term, IUL, Whole Life, Mortgage Protection, Annuities)
  - **Animated data viz section** — 2 Chart.js charts (IUL growth vs savings, premium cost comparison) that trigger on scroll
  - How It Works (4-step process with connecting line)
  - Why Us (4 benefit cards)
  - CTA section with GHL form link + phone CTA
- [x] `optin.html` — quote page with:
  - GHL form embed (form ID: `e8RIDTdhAVlc6CT9Zfj5`)
  - SMS consent checkbox with STOP opt-out language
  - Benefit list + carrier chips
  - All A2P required disclosures
- [x] `privacy.html` — full privacy policy with SMS/CTIA section
- [x] `terms.html` — full terms of service
- [x] A2P compliance verified — all required elements present on all pages
- [x] Mobile-first responsive design with hamburger nav

---

## 🚧 What Needs to Be Done (Finish Line)

### Priority 1 — Critical for Launch

**1. Fix CSS token path issue on GitHub Pages — DONE**
The v2 pages now load local `pages/_tokens.css` and `pages/_base.css` copies,
so GitHub Pages can serve the styles safely from the live page directory.

**2. Create `thank-you.html`**
After GHL form submission, redirect lands on a thank you page.
GHL form currently points to `https://evermorelife.org/thank-you`
Build `thank-you.html` in the same style as the other pages with:
- "We got your request!" confirmation message
- What to expect next (agent will call within 1 business day)
- Link back to homepage
- Same nav + footer

**3. Add a `404.html` page**
GitHub Pages serves a default 404. Create a branded one at:
`01_website/v2/pages/404.html`
Simple page: Evermore Life nav, "Page not found" message, button back to home.

---

### Priority 2 — UX & Conversion

**4. Add a 3rd animated chart to index.html**
We want a **"Protection Gap Visualizer"** — an animated donut/gauge chart showing:
- The average American family has $X in coverage but needs $Y
- Dramatic visual that creates urgency to get a quote
Add it as a 3rd card in the `.viz-grid` section (make it span full width or add a row).
Use Chart.js doughnut type. Animate on scroll same as the other two charts.

**5. Add scroll-triggered counter animation to trust bar**
The trust bar has static numbers (A+, 5+, 100%, Licensed, Free).
Make the numeric ones count up when they scroll into view.
Example: "5+" counts from 0 to 5, "100%" counts from 0 to 100.

**6. Mobile nav — active state**
When a nav link is clicked on mobile, highlight it gold so the user knows where they are.

**7. Add a sticky mobile CTA bar**
On mobile only, add a fixed bar at the bottom of the screen:
```
[📞 Call Us]   [Get Free Quote →]
```
Both are tap targets. This is a major mobile conversion driver.

---

### Priority 3 — SEO & Performance

**8. Add structured data (JSON-LD) to index.html**
Add a `<script type="application/ld+json">` block for `LocalBusiness` schema:
```json
{
  "@context": "https://schema.org",
  "@type": "InsuranceAgency",
  "name": "Evermore Life LLC",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "4539 N 22nd St, Ste R",
    "addressLocality": "Phoenix",
    "addressRegion": "AZ",
    "postalCode": "85016"
  },
  "telephone": "+15055043101",
  "url": "https://evermorelife.org",
  "priceRange": "$$",
  "description": "Licensed independent life insurance brokerage in Phoenix, AZ"
}
```

**9. Add Open Graph image meta tag**
Create a simple 1200x630px OG image (navy background, gold Evermore Life logo/text)
and add `<meta property="og:image" content="...">` to all pages.

**10. Add sitemap.xml**
Create `01_website/v2/sitemap.xml` listing all 4 pages with their GitHub Pages URLs.
This helps Google index the site faster.

**11. Add robots.txt**
Create `01_website/v2/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://evermorelife.org/01_website/v2/sitemap.xml
```

---

### Priority 4 — GHL Integration Polish

**12. Update GHL form embed on optin.html**
Current form ID: `e8RIDTdhAVlc6CT9Zfj5`
Confirm this is the correct active form in GHL.
If a new form is created, swap the `src` URL in the iframe — that's the only change needed.

**13. Add GHL chat widget to index.html**
The chat widget code snippet is already in the repo at:
`02_ghl/launch_kit/paste-ready/global-chat-widget-code.html`
Copy that script tag and add it before `</body>` on `index.html`.

---

## 🎨 Brand Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--navy` | `#0d1b4b` | Primary background, headings |
| `--navy-deep` | `#091238` | Footer, dark sections |
| `--gold` | `#c8a96e` | Accent, CTAs, highlights |
| `--gold-dark` | `#b8934f` | Hover states |
| `--white` | `#ffffff` | Light backgrounds |
| `--off-white` | `#f7f9fc` | Section backgrounds |
| `--text-secondary` | `#6b7c99` | Body copy |

Font: **Inter** (loaded from Google Fonts)

---

## 🏢 Business Info (use exactly as shown)

```
Evermore Life LLC
4539 N 22nd St, Ste R
Phoenix, AZ 85016
Phone: +1 (505) 504-3101
Email: evermorelifeagent01@gmail.com
Website: https://evermorelife.org
GHL subdomain: https://evermorelife.org (also app.evermorelife.org for internal)
```

---

## 🔐 A2P Compliance — Must Remain on ALL Pages

Every page must have these elements visible (reviewers check):
- [ ] Business name, address, phone number
- [ ] "Licensed independent insurance" disclosure
- [ ] Privacy Policy link
- [ ] Terms of Service link
- [ ] On optin.html: SMS consent checkbox with STOP opt-out
- [ ] On optin.html: "Consent is not a condition of purchase"
- [ ] On optin.html: "Message and data rates may apply"

**Do not remove any of these elements when making changes.**

---

## 🚀 Deploy Workflow

After any changes:
```bash
cd ~/Desktop/EVERMORE-LIFE
git add .
git commit -m "describe what you changed"
git push
```

GitHub Pages auto-deploys within ~2 minutes. No build step needed — pure HTML/CSS/JS.

If git locks up run:
```bash
rm -f .git/index.lock .git/HEAD.lock .git/refs/heads/main.lock
```

---

## 📋 Finish Line Checklist

- [x] Fix CSS relative path issue for GitHub Pages
- [x] Build thank-you.html
- [x] Build 404.html
- [x] Add Protection Gap donut chart
- [x] Add counter animation to trust bar
- [x] Add sticky mobile CTA bar
- [x] Add JSON-LD structured data
- [x] Add sitemap.xml + robots.txt
- [x] Add GHL chat widget to index.html
- [x] Test all pages on mobile (iPhone Safari + Android Chrome viewport/user-agent checks)
- [x] Test all internal links work (privacy, terms, optin)
- [ ] Add GitHub Pages CNAME for evermorelife.org after DNS cutover is approved
- [ ] Point Cloudflare DNS records for evermorelife.org at GitHub Pages
- [ ] Submit site to Google Search Console
