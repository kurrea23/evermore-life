# Evermore Map And Compass

**Purpose:** Own and operate an evidence-backed lead-to-sale system.

**Current compass:** Finish and verify the complete lead path before increasing
traffic or spend.

## System Context

```mermaid
flowchart LR
    Visitor[Visitor or prospect] --> Public[Public pages and campaign content]
    Public --> GHL[GoHighLevel forms, CRM, and workflows]
    GHL --> Sarah[Sarah AI and nurture]
    Sarah --> Booking[Appointment]
    Booking --> Sale[Human sales process]

    Repo[EVERMORE-LIFE repository] --> Public
    Repo --> Proof[Runbooks, scripts, and reports]
    GHL --> LiveProof[Live account evidence]
    Public --> LiveProof
    Proof --> Cockpit[Cockpit and operating brief]
    LiveProof --> Cockpit
```

## Canonical Sources

| Question | Read first | Verification rule |
| --- | --- | --- |
| What is active now? | `00_START_HERE/README.md` | Check linked real files |
| How does infrastructure connect? | `SYSTEM_MAP.md` | Verify time-sensitive live claims |
| What should an operator do next? | `CODEX_MASTER_HANDOFF.md` and relevant handoff | Confirm it is still current |
| What is the public-site source? | `01_website/current/` | Compare with the live GHL page |
| How are state-specific pages built? | `01_website/state-pages/` | Validate state mode, regenerate drafts, and verify live routing before publish |
| How should GHL be built? | `02_ghl/launch_kit/` | Verify inside GHL before completion |
| What campaign assets exist? | `04_content_narrative/` | Check destination URLs and publish state |
| What content is ready to edit, post, or promote? | `04_content_narrative/ad_campaign_scaffold/CONTENT_ACTIVATION_BOARD.md` | Verify real files, approvals, live routing, and paid gates |
| What automation is safe to run? | `04_tools/` and its handoffs | Review command and approval level first |
| What did a cartographer learn? | `BLUEPRINTS/reports/` | Prefer newer verified evidence |

## Core Surfaces

| Surface | Owner or system | Durable location |
| --- | --- | --- |
| Daily command and active rooms | Human operator + cockpit | `00_START_HERE/active/` |
| Website and funnel | GHL + repository source | `01_website/` |
| State-page expansion | Human operator + website/GHL owners | `01_website/state-pages/` plus verified service and workflow evidence |
| CRM, forms, workflows, nurture | GHL | `02_ghl/` plus verified live evidence |
| Sales and marketing operations | Human operator | `03_sales_marketing/` |
| Campaign narrative and creative | Content systems | `04_content_narrative/` |
| Scripts and cockpit writers | Local automation | `04_tools/` |
| Cross-system intelligence | Humans + cartographer agents | `BLUEPRINTS/` |

## Map Maintenance Rules

- This file routes to truth; it does not replace truth.
- A live claim requires current live proof.
- A report records a survey. A decision changes direction.
- When a route changes, update this map and cite the report or decision that
  caused the change.
