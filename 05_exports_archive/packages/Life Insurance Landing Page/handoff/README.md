# Handoff: Sunrise Final Expense — Arizona Life Insurance Lead Generation System

## Overview
A two-page lead generation funnel for a final expense life insurance agency licensed in Arizona. The goal is to capture qualified leads (ages 50–85), route them into a GoHighLevel CRM pipeline, trigger automated follow-up sequences, and connect Facebook/Google ad tracking.

**Page 1 — Landing Page (`Landing Page.html`)**
Drives cold traffic to a lead capture form. Visitors fill out name, phone, email, age, and optional coverage amount. On submit, they are redirected to the Thank You page with their first name passed as a URL query param.

**Page 2 — Thank You Page (`Thank You.html`)**
Confirms the submission, shows a 15-minute countdown timer, offers an "Add to Calendar" button, lists what to have ready for the call, displays trusted carriers, and presents an optional pre-application health questionnaire to speed up the agent call.

---

## About the Design Files
The HTML files in this bundle are **high-fidelity design references** — pixel-perfect prototypes built in plain HTML/CSS/React (Babel inline). They are NOT production code. The task for the implementing agent is to:

1. **Recreate these pages** faithfully in the target hosting environment (see deployment options below)
2. **Wire all forms** to GoHighLevel via webhook or native GHL embed
3. **Add tracking pixels** (Facebook, Google)
4. **Configure DNS** and host under the client's domain
5. **Set up GHL automations** for lead follow-up

---

## Fidelity
**High-fidelity.** Colors, typography, spacing, interactions, copy, and component hierarchy are final. Recreate pixel-accurately. Do not change copy without client approval — insurance compliance is sensitive.

---

## Design Tokens

### Colors
```
--navy:        #1B2E5E   (primary brand, backgrounds, headings)
--navy-dark:   #111D3F   (footer background)
--navy-light:  #243d7a   (hover states)
--gold:        #C8943A   (primary accent, CTAs, highlights)
--gold-light:  #E0AD56   (hover gold, hero emphasis text)
--gold-pale:   #FBF0DC   (gold tint backgrounds)
--cream:       #FAF7F1   (page background)
--cream-dark:  #F2EDE3   (section alternates)
--white:       #FFFFFF
--border:      #DDD5C8   (all borders)
--text:        #1C1C1E   (body copy)
--text-muted:  #555F70   (secondary copy)
--success:     #2E7D52   (form success states)
--success-pale:#E6F4EC
```

### Typography
```
Display font:  'Playfair Display' — weights 400, 500, 600, 700
               Google Fonts: https://fonts.google.com/specimen/Playfair+Display
Body font:     'DM Sans' — weights 300, 400, 500, 600
               Google Fonts: https://fonts.google.com/specimen/DM+Sans

Font scale:
  Hero H1:     clamp(2.2rem, 5vw, 3.4rem) — Playfair Display 600
  H2:          clamp(1.8rem, 3.5vw, 2.6rem) — Playfair Display 600
  H3:          1.35rem — Playfair Display 600
  Body:        1rem / 18px — DM Sans 400, line-height 1.75
  Small:       0.88rem — DM Sans 400
  Label/caps:  0.78rem, weight 700, letter-spacing 0.12em, uppercase — DM Sans
```

### Spacing
```
Section padding:     96px top/bottom (desktop), 48px (mobile)
Container max-width: 1140px (landing), 1060px (thank you), padding 0 24px
Card padding:        40px (desktop), 24px (mobile)
Grid gaps:           32px (benefits), 28px (testimonials), 24px (plans)
```

### Border Radius
```
Cards:       14–16px
Buttons:     6–8px
Badges:      100px (pill)
Icons:       10–12px
Avatar:      50%
```

### Shadows
```
Nav:         0 2px 12px rgba(0,0,0,0.06)
Lead form:   0 24px 80px rgba(0,0,0,0.35)
Plan featured: 0 8px 40px rgba(200,148,58,0.2)
Gold button: 0 4px 20px rgba(200,148,58,0.35)
```

---

## Page 1: Landing Page

### Sections (top to bottom)
1. Sticky Navigation
2. Hero + Lead Form
3. Trust Bar
4. Benefits (3 cards)
5. Gold Qualify Banner
6. How It Works (3 steps)
7. Coverage Plans (3 tiers)
8. Testimonials (3 cards)
9. FAQ Accordion
10. Bottom CTA + second lead form
11. Footer + disclaimer

---

### Section 1: Sticky Navigation
- White background, 1px bottom border `#DDD5C8`, box-shadow `0 2px 12px rgba(0,0,0,0.06)`
- Height: 72px, sticky top:0, z-index 100
- Left: Logo mark (44×44px navy rounded square with sun SVG icon in gold) + brand name "Sunrise Final Expense" (Playfair Display 700, 1.15rem, navy) + subtitle "Licensed in Arizona" (DM Sans 500, 0.72rem, gold, uppercase, letter-spacing 0.12em)
- Right: tap-to-call phone link + "Free Quote" gold button (scrolls to #get-quote)
- Mobile (<640px): hide button and phone label, show phone icon only

---

### Section 2: Hero + Lead Form
- Background: `--navy` (#1B2E5E)
- Radial gradient overlay: `radial-gradient(ellipse 80% 60% at 70% 50%, rgba(200,148,58,0.12), transparent)`
- Subtle crosshatch SVG texture at 1.5% opacity
- Desktop: 2-column grid, `1fr 420px`, gap 64px, aligned center
- Padding: 80px top, 100px bottom

**Left column:**
- Badge pill: gold border/bg tint, "★ Arizona's Most Trusted Final Expense Provider"
- H1: "Protect Your Family. Leave Nothing Behind." — "Leave Nothing Behind." in `--gold-light`
- Subheadline: rgba(255,255,255,0.72), 1.15rem
- 4 bullet points with gold circle check icons:
  - Coverage from $5,000 to $50,000
  - Guaranteed acceptance — ages 50 to 85
  - Rates never increase, coverage never expires
  - Benefits paid directly to your family in days
- Phone line: "Prefer to call? (505) 504-3101 — Mon–Fri 8am–7pm AZ time"

**Right column — Lead Form Card:**
- White card, border-radius 16px, padding 40px 36px
- Shadow: `0 24px 80px rgba(0,0,0,0.35)`
- Title: "Get Your Free Quote" (Playfair Display, 1.5rem, navy)
- Subtitle: "Takes less than 2 minutes. No obligation." (0.9rem, muted)
- Fields: First Name, Last Name (row), Phone, Email, Age (select 50–85), Coverage Amount (select)
- Submit button: full width, gold, "Get My Free Quote →"
- Disclaimer: 0.72rem, centered, muted — TCPA language
- **On submit:** validate all required fields → show loading state → redirect to `Thank You.html?name=[firstName]`
- **Validation:** firstName, lastName required; phone regex `/^\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}$/`; email regex standard; age required

---

### Section 3: Trust Bar
- White background, 1px bottom border
- 5 items centered, flex-wrap, gap 40px
- Items: Licensed in Arizona | Proudly Serving Arizona Seniors | A+ Rated Carriers | No Medical Exam Required | Coverage Starts Same Day
- Each: icon (18px, gold) + text (0.9rem, 500, muted)

---

### Section 4: Benefits
- Background: `--cream`
- 3-column grid, gap 32px
- Each card: white bg, 1px border, 14px radius, 36px/32px padding, hover lift (-4px translate + shadow)
- Icon container: 54×54px, gold-pale bg, 12px radius
- Cards:
  1. Shield icon — "Guaranteed Acceptance" — No medical exams, ages 50–85, regardless of health history
  2. Dollar icon — "Affordable, Locked-In Rates" — Premium set at enrollment, never increases
  3. Heart icon — "Benefits Paid Fast" — Claims paid 24–48hrs, direct to beneficiary

---

### Section 5: Gold Qualify Banner
- Background: `--gold` solid
- Padding: 56px top/bottom
- 2-column flex (text left, CTA right), flex-wrap on mobile
- Label: "Healthy? You Deserve Better Rates" (white 75% opacity, uppercase, small caps)
- H2: "See Which Carrier You Qualify For" (white, Playfair Display)
- Body: lists all 5 carriers, "your health profile unlocks your lowest possible rate"
- Button: white bg, gold text, "✓ See If I Qualify" — scrolls to #get-quote

---

### Section 6: How It Works
- Background: `--navy`
- 3-column grid with decorative gold line connecting step numbers
- Steps numbered 1–3 with gold circle badges (54px, gold bg, Playfair Display 700)
- Cards: rgba(255,255,255,0.05) bg, 1px rgba border
  1. "Get a Free Quote" — fill form or call, agent reviews
  2. "Choose Your Plan" — $5,000–$50,000, agent walks you through
  3. "Coverage Starts Today" — begins same day, protected for life

---

### Section 7: Coverage Plans
- Background: `--cream-dark`
- 3-column grid, gap 24px, middle card featured (scale 1.03, gold border)
- "Most Popular" badge on middle card

| Plan | Coverage | Features |
|------|----------|----------|
| Essential | $10,000 | Funeral costs, medical bills, guaranteed acceptance, no exam, locked rate |
| Most Popular | $15,000 | Everything + credit card/loan payoff, family expenses, cash value, 24hr payout |
| Complete | $25,000 | Everything + estate/legal, charitable giving, accelerated death benefit, priority claims |

- Rate line: "Rate based on age & health" (no dollar amounts — compliance requirement)
- Disclaimer footnote: rates vary by age, health, carrier
- CTA: "Get This Plan" → scrolls to #get-quote

---

### Section 8: Testimonials
- Background: white
- 3-column grid
- Each card: cream bg, 1px border, large gold quote mark (opacity 0.4), 5 gold stars, italic quote, author avatar (navy circle with initials), name + city/age detail

| Reviewer | Location | Summary |
|----------|----------|---------|
| Dorothy M. | Mesa, AZ · 67 | Easy process, same-day coverage, sleeps better knowing family protected |
| Robert K. | Tucson, AZ · 71 | Called after wife passed, covered in one call, premium less than cable bill |
| Patricia T. | Scottsdale, AZ · 63 | Health history not an issue, $20K no exam, son moved to tears |

---

### Section 9: FAQ Accordion
- Background: `--cream`, max-width 760px centered
- 6 questions, expand/collapse, chevron rotates 180° when open

1. Do I need a medical exam to qualify?
2. What ages are eligible?
3. How quickly does coverage start?
4. What can the benefit be used for?
5. Will my premiums increase as I age?
6. Can my coverage be cancelled by the insurance company?

---

### Section 10: Bottom CTA + Form
- Background: `--navy` with gold radial gradient at bottom
- 2-column: left = headline + phone block; right = duplicate lead form card
- Headline: "Your Family Deserves This Protection"
- Phone block: gold circle icon, "(505) 504-3101"

---

### Section 11: Footer
- Background: `--navy-dark` (#111D3F)
- Logo + "Licensed in the State of Arizona"
- Links: Privacy Policy, Terms of Service, Do Not Sell My Info, Accessibility, phone
- Disclaimer: license number [PLACEHOLDER], carrier list, not affiliated with government, © 2026

---

## Page 2: Thank You Page

### Sections (top to bottom)
1. Navigation (same as landing, back link to Landing Page)
2. Confirmation Hero with countdown
3. Two-column: What to Have Ready + Carrier list | Pre-Application Form
4. Footer

---

### Section 1: Confirmation Hero
- Background: `--navy` + gold radial gradient at bottom
- Green "Request Confirmed" badge
- Animated pulsing green check circle (80px)
- H1: "You're on the list, [firstName]!" — firstName from URL param `?name=`
- Subtext + phone CTA
- **Countdown Timer:**
  - 15-minute countdown stored in `localStorage` key `sf_countdown_start`
  - Persists on page refresh — reads elapsed time and resumes
  - SVG ring animates `stroke-dashoffset` from full to 0 over 15 min
  - When timer hits 0: ring stops, message changes to "Your agent is calling you right now!"
- **Action buttons:** "Call Now: (505) 504-3101" (gold) + "Add to Calendar" (ghost)

---

### Section 2: Add to Calendar Modal
- Triggered by "Add to Calendar" button
- Overlay + white modal card
- Options:
  - Google Calendar: opens `calendar.google.com/render?action=TEMPLATE` with event pre-filled (title, description, start = now + 20 min, end = now + 50 min)
  - Apple / Outlook: generates `.ics` file blob and triggers download
- Close button dismisses modal

---

### Section 3: What to Have Ready
- 4 items with icon + title + description:
  1. Government-Issued ID — full legal name, date of birth
  2. Basic Health Info — major diagnoses, current medications
  3. Beneficiary Name — full legal name of recipient
  4. Monthly Budget — rough comfort range (no specific amounts quoted)

---

### Section 4: Trusted Carriers
- List of 5 carriers with gold dot indicators:
  - Mutual of Omaha
  - Ethos Life
  - American Amicable
  - Transamerica
  - Aetna
- Headline: "We Shop the Best Rates For You"

---

### Section 5: Pre-Application Form (Optional)
- Gold-bordered card, gold badge "Free Carrier Qualification Check"
- Headline: "See If You Qualify for the Best Rates"
- Initially collapsed — "✓ See If I Qualify" button expands form
- Fields:
  - Tobacco use: radio (No never / Former user / Yes current)
  - Height: select dropdown
  - Weight: number input
  - Coverage goal: radio (Funeral costs / Pay off debts / Leave inheritance / All of the above)
  - Health conditions: checkbox grid (9 conditions including "None of the Above")
  - Beneficiary name + relationship
  - Medications: textarea (optional)
- Submit: "✓ Check My Qualification Now" (gold button)
- On submit: 1s loading state → success message "Pre-Application Received!"

---

## Backend Integration Checklist

### Step 1: Domain & Hosting
```
□ Purchase domain (e.g. sunrisefinalexpense.com) via Namecheap or GoDaddy
□ Option A — Host in GHL:
    - GHL → Sites → Funnels → New Funnel
    - Add two steps: Landing Page + Thank You Page
    - Connect custom domain in GHL settings → update DNS CNAME to GHL
□ Option B — Host on Netlify/Vercel (simpler for HTML):
    - Drop both HTML files into Netlify → auto-deploys
    - Add custom domain → update DNS A record
    - Use GHL webhook for form submissions (see Step 3)
```

### Step 2: Facebook Pixel
```
□ In Facebook Business Manager → Events Manager → Create Pixel → copy Pixel ID
□ Add to <head> of BOTH pages:

<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>

□ On Thank You page load, also fire:  fbq('track', 'Lead');
□ On pre-app form submit, also fire:  fbq('track', 'CompleteRegistration');
```

### Step 3: GoHighLevel Form Webhook
```
□ In GHL → Settings → Integrations → Webhooks → Create Webhook
□ Copy webhook URL (format: https://hooks.leadconnectorhq.com/hooks/...)
□ Replace the form submit handler in Landing Page.html:

// Replace the setTimeout redirect with:
fetch('YOUR_GHL_WEBHOOK_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: form.firstName,
    lastName: form.lastName,
    phone: form.phone,
    email: form.email,
    age: form.age,
    coverage: form.coverage,
    source: 'Landing Page',
    tags: ['final-expense', 'arizona', 'web-lead']
  })
}).then(() => {
  window.location.href = `Thank You.html?name=${encodeURIComponent(form.firstName)}`;
});

□ Same pattern for the bottom CTA form (second LeadForm instance)
□ For pre-app form on Thank You page — send to same webhook with additional fields:
  smoker, height, weight, conditions[], beneficiary, relationship, medications, coverageGoal
  Add tag: 'pre-app-complete'
```

### Step 4: Google Ads Conversion Tracking
```
□ In Google Ads → Tools → Conversions → New Conversion → Website
□ Set conversion event: "Lead" on Thank You page load
□ Add Google tag to <head> of both pages:

<script async src="https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-XXXXXXXXX');
</script>

□ On Thank You page body load:
  gtag('event', 'conversion', { 'send_to': 'AW-XXXXXXXXX/XXXXXXXXX' });
```

### Step 5: GHL Pipeline & Automation
```
□ Create Pipeline: "Final Expense AZ"
  Stages: New Lead → Attempted Contact → Contacted → Quoted → Enrolled → Lost

□ Create Workflow triggered on "Contact Created" with tag "web-lead":
  1. [Immediate] Internal notification → agent SMS: 
     "New lead: {{contact.firstName}} {{contact.lastName}} | {{contact.phone}} | Age: {{contact.customField.age}}"
  2. [Immediate] Send contact SMS:
     "Hi {{contact.firstName}}, this is [Agent Name] with Sunrise Final Expense. 
      I'm calling you right now about your free quote! If I miss you, I'll try again shortly. 
      Questions? Reply to this text."
  3. [Immediate] Send confirmation email to contact (template below)
  4. [5 min] If no disposition change → auto-dial attempt #2
  5. [30 min] If no answer → SMS: "Hi {{contact.firstName}}, still trying to reach you..."
  6. [Next business day 9am] SMS + call attempt #3
  7. [Day 3] Final follow-up SMS with link back to landing page

□ If tag "pre-app-complete" present → notify agent with pre-app data summary before call

□ Missed Call Text-Back: GHL Settings → Phone → Enable missed call text-back
  Message: "Hi! We just tried calling about your final expense quote. 
  Reply YES and we'll call you right back, or call us at (505) 504-3101."
```

### Step 6: Confirmation Email Template (GHL)
```
Subject: Your Free Quote Request — Sunrise Final Expense

Hi {{contact.firstName}},

Thank you for reaching out! A licensed Arizona agent will be calling you 
within the next 15 minutes during business hours.

To prepare for your call, have handy:
• Your government-issued ID
• Any major health diagnoses
• Name of your beneficiary

Questions before the call? Call us directly: (505) 504-3101
Mon–Fri 8am–7pm Arizona time

— The Sunrise Final Expense Team
Licensed in the State of Arizona | License #[PLACEHOLDER]

This message was sent because you requested a free insurance quote. 
To opt out, reply STOP.
```

### Step 7: Call Tracking
```
□ In GHL → Phone Numbers → Buy Number (Arizona 602/480/520 area code)
□ Forward to agent's real phone
□ Replace (505) 504-3101 on BOTH pages with this tracked GHL number
□ GHL will log all inbound/outbound calls in the contact timeline
```

### Step 8: Compliance Checklist
```
□ Add real AZ insurance license number to footer of both pages
  Replace: License #[AZ-XXXXXXXX]
□ Add real agent/agency name to footer
□ Review TCPA consent language on form disclaimer (currently: 
  "By submitting, you agree to be contacted by a licensed insurance agent.")
  — Consult upline/E&O carrier for exact required language
□ Add Privacy Policy page (required for Facebook Ads)
□ Add Terms of Service page (required for Facebook Ads)
□ Confirm "Do Not Sell My Info" link goes to a real CCPA opt-out page
□ SMS opt-in: GHL will handle this — ensure contacts explicitly opt in via form
```

### Step 9: Facebook Ad Campaign Setup
```
□ Campaign objective: Leads (or Traffic if using landing page, not native form)
□ Ad Set targeting:
  - Location: Arizona
  - Age: 50–70
  - Interests: Life insurance, AARP, retirement planning, Medicare
  - Exclude: existing customers (upload suppression list)
□ Budget: Start $30–50/day, scale winners
□ Ad creative recommendations:
  - Headline: "Arizona Seniors: Get Your Final Expense Rate in 2 Minutes"
  - Primary text: Address the fear of leaving family with bills
  - CTA: "Get Quote" → links to your landing page URL
  - Creative: family photo (stock or real), warm/trustworthy
□ Install Facebook Pixel (Step 2) BEFORE running ads
□ Set up Custom Conversion: Thank You page URL = "Lead" event
```

### Step 10: Google Search Campaign
```
□ Keywords (phrase/exact match):
  "final expense insurance arizona"
  "burial insurance arizona"
  "life insurance no medical exam arizona"
  "final expense insurance quotes"
  "guaranteed life insurance arizona seniors"
□ Negative keywords: "jobs", "careers", "free", "cheap"
□ Budget: $40–80/day to start
□ Landing page URL: your hosted domain
□ Conversion tracking: Thank You page load (Step 4)
□ Call extension: add (505) 504-3101 (or GHL number)
```

---

## Placeholder Values to Replace Before Launch

| Location | Current Value | Replace With |
|----------|--------------|--------------|
| Both pages nav + hero | (505) 504-3101 | Real GHL tracked number |
| Both footers | License #[AZ-XXXXXXXX] | Real AZ license number |
| Both footers | © 2026 Sunrise Final Expense | Verify agency legal name |
| GHL webhook | YOUR_GHL_WEBHOOK_URL | Real GHL webhook endpoint |
| Facebook Pixel | YOUR_PIXEL_ID | Real Pixel ID from Business Manager |
| Google Ads tag | AW-XXXXXXXXX | Real Google Ads conversion ID |
| Email template | [Agent Name] | Real agent name |
| GHL phone | (505) 504-3101 | Purchased GHL tracking number |

---

## Files in This Package

| File | Purpose |
|------|---------|
| `Landing Page.html` | Main lead capture page — high-fidelity design reference |
| `Thank You.html` | Post-submission confirmation + pre-app page |
| `README.md` | This document — full implementation spec |

---

## Tech Stack Used in Prototypes
- React 18.3.1 (inline Babel JSX)
- Google Fonts: Playfair Display + DM Sans
- Pure CSS (no framework) — all styles in `<style>` block
- No external dependencies beyond React + Babel CDN
- localStorage for countdown timer persistence

For production: can be re-implemented in any framework (Next.js, plain HTML, GHL funnel builder). The HTML files are the design spec — not the production build.

---

## Questions Before Implementing
1. What is the real GHL webhook URL?
2. What is the Facebook Pixel ID?
3. What is the Google Ads conversion ID?
4. What domain/subdomain will this live on?
5. What is the real AZ insurance license number?
6. Will there be an agent headshot/bio to add?
7. Are the testimonials real (get consent) or should they be marked as illustrative?
8. Has legal/compliance reviewed the disclaimer and TCPA consent language?

---

*Prepared by Sunrise Final Expense Design Session — April 2026*
*Design files are prototypes only. Do not ship HTML directly — implement in target environment.*
