# Evermore GHL Launch Kit

Use this kit to build the live GoHighLevel funnel. The current source pages in `01_website/current` now include the public GHL form embeds, so they can be used as the custom-coded page source when you want the stronger visual design.

## Build Order

1. Create/confirm the GHL forms: see `native-form-field-map.md`.
2. Create GHL pages: `/`, `/optin`, `/thank-you`, `/privacy`, `/terms`.
3. Build `/` and `/optin` using the custom-coded pages or matching GHL sections; keep the GHL form embeds in place for lead capture and SMS consent.
4. Add the workflow from `workflow-blueprint.md`.
5. Publish pages on `evermorelife.org`.
6. Submit one fake lead and verify GHL contact/opportunity/workflow.
7. Because A2P is approved, activate only the consent-gated SMS branches and verify with an owned test number before using SMS on real leads.

## Recommended Page Ownership

- GHL owns lead capture through the embedded public forms.
- GHL form records own SMS consent evidence.
- Current HTML files are the source/design references and now include the form embeds.
- Cloudflare Worker relay/private integration files are reserved for later API-level lead routing.

## Do Not Do

- Do not paste private API tokens or webhook secrets into public page code.
- Do not put a GHL Private Integration Token in public page code.
- Do not send SMS unless the contact gave optional SMS consent and is not opted out or DND.
- Do not change the approved A2P use case, opt-in language, privacy policy, terms, or sample-message pattern without checking GHL/TCR compliance impact first.

## Files In This Kit

- `native-form-field-map.md` - exact GHL form fields and consent text.
- `workflow-blueprint.md` - exact launch workflow to build in GHL.
- `a2p-registration-pack.md` - approved A2P campaign reference fields.
- `page-build-guide.md` - page-by-page GHL builder instructions.
- `test-checklist.md` - what must pass before ads.
- `snippets/` - body-only copy/snippets for GHL pages.
