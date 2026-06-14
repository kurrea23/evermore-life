# Agent Operating Contract

This repository uses **Local-First Agent Cartography**. Chat is temporary working
memory. Files in this repository are durable shared memory.

## Start Here

Before substantial work:

1. Read `BLUEPRINTS/README.md`.
2. Read `BLUEPRINTS/MAP.md`.
3. Read `00_START_HERE/README.md`.
4. Read only the handoff and source files relevant to the assigned surface.

## Required Finish

If you inspect, map, audit, or change a meaningful system surface:

1. Write a dated report in `BLUEPRINTS/reports/` using
   `BLUEPRINTS/REPORT_TEMPLATE.md`.
2. Add cross-surface findings to `BLUEPRINTS/OVERLAPS.md`.
3. Add a human-approved architectural or operating decision to
   `BLUEPRINTS/DECISIONS.md`.
4. Update `BLUEPRINTS/MAP.md` only when canonical routes or ownership changed.

## Guardrails

- Link to canonical files instead of duplicating their content.
- Verify live systems before calling them live, complete, or healthy.
- Mark unavailable or unknown when evidence is missing.
- Never write secrets, tokens, passwords, or private customer data into reports.
- Treat deploys, messages, account changes, publishing, and spending as
  approval-gated actions.

