# Cartographer Report: Guided Intake Needs And Benefits Order

- **Date:** 2026-07-13
- **Agent or operator:** Codex
- **Surface:** Guided client intake experiment, Steps 6 through 10
- **Mission:** Match the needs, beneficiary, benefits, and coverage sequence to the source call script
- **Approval level used:** execute

## Executive Finding

Steps 6 through 10 now follow the source call script: burial or cremation,
beneficiary, deeper-needs questions, whole-life and cash-value benefits, then
maximum coverage and plan options. The shortened final-expense paragraph was
replaced with the full source wording, Beneficiary moved forward from its old
Step 10 position, and later sections were renumbered without changing saved
field identities. Step 6 presents its framing and burial-or-cremation dialogue
inside one continuous call-script pop-out. Step 8 ends with a visible transition
into the benefits explanation, including a pen-and-paper prompt, while Step 9
retains the same opening sentence in its call-script pop-out. The benefits
script adds permanent protection, level premium, fixed rate, conditional
day-one coverage, tax and probate treatment, conditional living benefits, and
a gold cash-value callout that is used only when the client asks. Level premium
and fixed rate are combined into one write-down point. Step 9 ends with a direct
maximum-coverage transition into Step 10.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Step 6 uses one burial-or-cremation call-script pop-out | Local browser readback on 2026-07-13 | high |
| Step 7 contains the beneficiary script and fields | `01_website/experiments/Client-Intake-Guided.html` and source PDF page 3 | high |
| Step 8 contains all six deeper-needs questions and the reflection pause | `01_website/experiments/Client-Intake-Guided.html` and source PDF page 3 | high |
| Step 9 explains whole life and the operator-approved benefit points before coverage options | `01_website/experiments/Client-Intake-Guided.html` and local browser DOM verification | high |
| Day-one coverage and living-benefit statements include explicit carrier-approval conditions | `01_website/experiments/Client-Intake-Guided.html` | high |
| Step 10 begins maximum-coverage and top-down quoting | `01_website/experiments/Client-Intake-Guided.html` and source PDF page 4 | high |
| The refreshed page has no browser console errors | Local browser console readback on 2026-07-13 | high |

## Map

The edited surface is the self-contained guided intake experiment at
`01_website/experiments/Client-Intake-Guided.html`. No canonical route or owner
changed. Later guided-intake sections are now numbered 10 through 13.

## Visual Evidence

Source PDF pages 2 through 4 were rendered and visually inspected. The local
form order was verified in the browser after implementation.

## Unknown Or Unavailable

Production behavior was not checked because no deployment was authorized.

## Cross-Surface Overlaps

None. The reordering is contained within the self-contained guided intake experiment.

## Recommended Next Move

The operator should review Steps 6 through 10 in the open local preview before
continuing into application and banking.

## Files Changed

- `01_website/experiments/Client-Intake-Guided.html`
- `BLUEPRINTS/reports/2026-07-13_guided-intake-health-opening.md`
- `BLUEPRINTS/reports/2026-07-13_guided-intake-needs-benefits-order.md`
