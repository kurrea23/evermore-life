# GHL Page Build Guide

## Page 1: Home `/`

Goal:

Introduce Evermore Life and route visitors to `/optin`.

Builder approach:

- Use the custom-coded `01_website/current/index.html` page or recreate its hero, services, how-it-works, and footer sections in GHL.
- Use source copy from `snippets/home-copy.md`.
- Keep the small homepage GHL form embed if you want the name/phone quick form live on the home page.
- Primary CTA URL: `/optin`
- Footer links: `/privacy`, `/terms`, `/optin`

Do not use a custom API/webhook token on the home page. The current homepage uses a public GHL form embed.

## Page 2: Opt-In `/optin`

Goal:

This is the A2P proof page and primary lead capture page.

Builder approach:

- Use the custom-coded `01_website/current/optin.html` page or recreate its two-column layout in GHL.
- Keep the embedded GHL form named `Evermore Life Lead Form - Main Opt-In`.
- Place privacy/terms links directly below the form.
- Use `snippets/optin-copy.md` for page copy.

Required visible text near form:

`You can submit this quote request without agreeing to SMS. A licensed Evermore Life agent may contact you by phone or email about your request. View our Privacy Policy and Terms of Service.`

## Page 3: Thank You `/thank-you`

Goal:

Confirm the request and act as the conversion destination.

Builder approach:

- Use native GHL text/button sections.
- Use `snippets/thank-you-copy.md`.
- Add Meta/Google conversion event only after lead capture is verified.

## Page 4: Privacy `/privacy`

Goal:

A2P-compliant privacy page.

Builder approach:

- Use native GHL text section.
- Use `snippets/privacy-copy.md`.
- Footer must link to Terms.

## Page 5: Terms `/terms`

Goal:

A2P-compliant terms page.

Builder approach:

- Use native GHL text section.
- Use `snippets/terms-copy.md`.
- Footer must link to Privacy.

## Domain + Navigation

Set these final URLs:

- Home: `https://evermorelife.org/`
- Opt-in: `https://evermorelife.org/optin`
- Thank you: `https://evermorelife.org/thankyou`
- Privacy: `https://evermorelife.org/privacypolicy`
- Terms: `https://evermorelife.org/terms`

If GHL publishes with trailing slashes, use the trailing-slash version consistently in A2P.
