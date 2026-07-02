# Cartographer Report: A2P Approval And Textability Update

- **Date:** 2026-07-01
- **Agent or operator:** Codex + Evermore operator
- **Surface:** GHL A2P/SMS operating docs
- **Mission:** Update the durable operating map after operator-confirmed A2P approval and textability.
- **Approval level used:** draft

## Executive Finding

The operator confirmed that Evermore now has A2P approval and textability. The
repo operating docs were updated from "pending/hold" to "approved/textable,"
with SMS still constrained to recorded consent, opt-out/DND checks, and an
owned-number workflow test before live lead use.

## Evidence

| Claim | Evidence location | Confidence |
| --- | --- | --- |
| A2P approval/textability was reported by the operator on 2026-07-01. | Current operator instruction in chat: "we did get the A2P approval finally. We have textability." | medium |
| Previous docs treated A2P as pending or hold-gated. | `02_ghl/launch_kit/A2P_GAP_REPORT.md`, `00_START_HERE/ADS_LAUNCH_CONTROL.md`, `02_ghl/CODEX_HANDOFF.md` | high |
| SMS activation still needs live account proof and controlled testing. | Updated `02_ghl/launch_kit/A2P_GAP_REPORT.md`, `00_START_HERE/active/rooms/A2P_REGISTRATION/YOU_DO_THIS.md`, `00_START_HERE/ADS_LAUNCH_CONTROL.md` | high |

## Map

The A2P room is no longer a submission/waiting room. It is now an activation
and compliance-preservation room. GHL remains the owner of Trust Center proof,
workflow state, opt-out handling, and live SMS sends. The repository owns the
operating instructions, launch checklist, and non-secret status notes.

## Visual Evidence

None. Do not store private GHL Trust Center screenshots or customer data in this
repo.

## Unknown Or Unavailable

- Codex did not authenticate into GHL during this update.
- The GHL submission ID, campaign ID, and Trust Center approval screenshot were
  not inspected or stored.
- No owned-number STOP/START SMS test was run by Codex.

## Cross-Surface Overlaps

- GHL A2P approval affects active-room instructions, launch kit docs, ad launch
  gates, cockpit status, and Blueprint compass state.
- Paid ads are still gated until the controlled lead path proves CRM/workflow,
  tracking, and consent-gated SMS behavior.

## Recommended Next Move

Owner: Evermore operator in GHL. Record non-secret approval details, enable only
consent-gated SMS workflow actions, then run one owned-number test with SMS
checked, STOP, START, and a separate unchecked-consent test.

## Files Changed

- `00_START_HERE/README.md`
- `00_START_HERE/ADS_LAUNCH_CONTROL.md`
- `00_START_HERE/active/rooms/A2P_REGISTRATION/README.md`
- `00_START_HERE/active/rooms/A2P_REGISTRATION/YOU_DO_THIS.md`
- `02_ghl/CODEX_HANDOFF.md`
- `02_ghl/launch_kit/README.md`
- `02_ghl/launch_kit/live-build-runbook.md`
- `02_ghl/launch_kit/form-workflow-next-steps.md`
- `02_ghl/launch_kit/A2P_GAP_REPORT.md`
- `02_ghl/launch_kit/SMS_NURTURE_SEQUENCE.md`
- `BLUEPRINTS/MAP.md`
- `BLUEPRINTS/OVERLAPS.md`
- `BLUEPRINTS/DECISIONS.md`
- `BLUEPRINTS/PROJECT_OPERATING_BLUEPRINT.md`
- `01_website/v2/cloudflare/evermore-live-proxy.js`
