# Evermore Life — Website v2

Block-based architecture. Each section is a clearly labeled HTML comment block so patches can be applied to one section without touching anything else.

## Structure

```
v2/
├── shared/
│   ├── _tokens.css     ← ALL brand colors, fonts, spacing live here
│   ├── _base.css       ← Reset, typography, utility classes
│   ├── _nav.html       ← Global nav block (copy-paste into any page)
│   └── _footer.html    ← Global footer block (copy-paste into any page)
└── pages/
    ├── index.html      ← Homepage
    └── optin.html      ← Quote / lead capture page
```

## How to patch a section

Each section in the HTML is wrapped like this:

```html
<!-- ============================================================
     BLOCK: HERO
     ============================================================ -->
...content...
<!-- END BLOCK: HERO -->
```

To update one section: find the block comment, edit only within it, done. No risk of breaking other sections.

## To update brand colors site-wide

Edit `shared/_tokens.css` only. The `--gold`, `--navy`, etc. variables cascade to every page automatically.

## A2P Compliance checklist (both pages pass)

- [x] Business name, address, phone number
- [x] Licensed independent broker disclosure
- [x] Privacy Policy + Terms of Service links (footer + CTA)
- [x] No-obligation language
- [x] SMS consent checkbox with STOP opt-out language
- [x] "Consent is not a condition of purchase" language
- [x] CTIA "Message and data rates may apply" disclosure
- [x] Chart disclaimer: "Illustrative models only"

## Deployment path

1. Push this repo to GitHub
2. Enable GitHub Pages on the `main` branch → `01_website/v2/pages/` as root
3. Point A2P reviewers at the GitHub Pages URL
4. Later: rebuild sections inside GHL using these blocks as the design spec
