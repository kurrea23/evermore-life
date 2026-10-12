# Evermore Life Zoom background

- **Upload:** `evermore-zoom-background-1920x1080.png` — 1920×1080, RGB, 16:9.
- **Editable composition:** `evermore-zoom-background.svg`.
- **Rebuild:** `04_tools/builders/build_virtual_office_background.mjs`.

The composition preserves the approved dimensional PNG lockup from
[`../evermore_life_brand_kit/`](../evermore_life_brand_kit/README.md), using its
canonical color tokens. The gold frame surrounds the logo’s clear space; no
outline, recolor, redraw, or effect was added to the logo itself. Navy center
space keeps faces clear. The logo is bottom right in the participant-facing view.

Rebuild from the repository root with Node and an installed `sharp` module:

```sh
node 04_tools/builders/build_virtual_office_background.mjs /absolute/path/to/node_modules/sharp
```

If `sharp` is available through normal Node resolution, omit the argument. The
Codex bundled dependency path is discoverable through workspace dependencies.
No generative artwork or external asset service is required for this composition.

See the [pilot guide](../../03_sales_marketing/virtual-office/README.md) for Zoom
installation and a participant-side readability check. This asset has been
inspected locally, but has not been installed or tested in a live meeting.
