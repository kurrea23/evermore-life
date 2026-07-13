# Cartographer Report: Guided Intake Opening Flow

- **Date:** 2026-07-13
- **Agent or operator:** Codex
- **Surface:** Guided client intake experiment
- **Mission:** Align Steps 1 and 2 with the supplied final-expense inbound call script
- **Approval level used:** execute

## Executive Finding

The guided intake now captures purchasing-for, resident state, and date of birth
inside the Step 1 opener before the 90-second qualification result. Step 2 now
starts with the client's name and continues through callback number, texting,
height, weight, and nicotine or tobacco use. Existing field identities, storage
behavior, and visual styling were preserved.

After visual review of page 1 of the supplied source PDF and operator review,
the first-and-last-name prompt was placed at the top of the Step 2 script. It
transitions into "Once again, my name is..." and then the callback-number
questions. The name prompt now explicitly says the spelling is being
reconfirmed, the agent-introduction transition is bold, and the four following
questions are numbered. The name prompt now appears as a visible transition
note at the bottom of Step 1, after the 90-second qualification field, using
parentheses for the reconfirm-spelling instruction. Step 2 begins directly with
the agent reintroduction. A second visible note at the bottom of Step 2 prompts
the existing-coverage question that opens Step 3; the Step 3 script remains
unchanged. No form fields were changed in this correction.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| Step 1 contains the pre-qualification purchasing, state, and birth-date questions and fields | `01_website/experiments/Client-Intake-Guided.html` and local browser DOM verification | high |
| Step 2 fields begin with first and last name, followed by callback/texting, height/weight, and tobacco use | `01_website/experiments/Client-Intake-Guided.html` and local browser DOM verification | high |
| Step 2 wording and ordering were checked against the original inbound call script | `Final Expense Inbound Call Script .pdf`, page 1 | high |
| The progress chips use the fields assigned to their visible sections | `SECTIONS` in `01_website/experiments/Client-Intake-Guided.html` | high |
| The refreshed page has no browser console errors | Local browser console readback on 2026-07-13 | high |

## Map

The edited surface is the self-contained guided intake experiment at
`01_website/experiments/Client-Intake-Guided.html`. The canonical Agent Suite
Intake remains `01_website/experiments/Client-Intake.html`; no ownership or
route changed.

## Visual Evidence

No durable screenshot was required. The placement was verified directly in the
refreshed local browser DOM.

## Unknown Or Unavailable

Production behavior was not checked because this experiment is being reviewed
locally and no deployment was authorized.

## Cross-Surface Overlaps

None. This was a script and field-order correction inside the guided intake experiment.

## Recommended Next Move

The operator should review the revised Step 1-to-Step 2 call flow in the
already-open local preview. No deploy, push, or publish action is included.

## Files Changed

- `01_website/experiments/Client-Intake-Guided.html`
- `BLUEPRINTS/reports/2026-07-13_guided-intake-step-2-script-placement.md`
