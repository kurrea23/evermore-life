# Evermore State Page Swarm Runbook

This is the beginning-to-end operating model for producing state pages at
premium quality without losing brand, compliance, or routing control.

## Swarm Roles

### 1. Orchestrator

Owns the run, assigns one state at a time, resolves conflicts, and integrates
only evidence-backed work. The orchestrator is the only role that changes
`data/states.json`.

### 2. License And Service Gatekeeper

Confirms the state's service mode from current evidence and human approval.
This role can block publishing. It does not interpret a missing artifact as
proof of active status.

### 3. State Strategist

Builds the local audience and messaging brief. It creates relevance without
inventing laws, data, products, or testimonials.

### 4. Brand And Conversion Designer

Keeps the page visually consistent with the Evermore design system and adapts
the conversion path to the approved state mode.

### 5. Compliance Reviewer

Checks claims, disclosures, CTA routing, privacy/terms links, indexing status,
and the separation between educational content and licensed recommendations.

### 6. Builder

Updates structured state data, runs the deterministic generator, and fixes
validation failures. It does not hand-edit generated HTML.

### 7. QA And Live-Proof Agent

Reviews desktop/mobile output, tests links, verifies the live route and intake,
and captures proof before any page is called live or healthy.

## Parallel Work Pattern

The Gatekeeper, State Strategist, and Brand Designer may work in parallel.
The Builder starts only after the Gatekeeper defines the state mode. Compliance
and QA review the integrated draft. The Orchestrator records the final state.

## Per-State Workflow

1. Create a state brief with known facts and explicit unknowns.
2. Confirm `active`, `pending`, or `unavailable`.
3. Choose the CTA allowed for that mode.
4. Draft local positioning using the Evermore narrative and shared sections.
5. Add the state record to `data/states.json`.
6. Run `python3 01_website/state-pages/scripts/build_state_pages.py`.
7. Review generated desktop and mobile pages.
8. Run every gate in `STATE_PAGE_QA.md`.
9. Record findings in `BLUEPRINTS/reports/` and cross-surface conflicts in
   `BLUEPRINTS/OVERLAPS.md`.
10. Publish only with explicit approval, then verify the live route and intake.

## 50-State Expansion Batches

Use small batches so licensing, workflow routing, SEO, and QA remain observable:

- Batch 1: Arizona, Texas, Arkansas
- Later batches: no more than five states at a time
- Never activate an entire batch because one state passed

## Agent Handoff Format

Every specialist returns:

```text
State:
Role:
Service mode:
Evidence used:
Copy or design recommendation:
Claims intentionally avoided:
Unknown or unavailable:
Launch blockers:
Files affected:
```

