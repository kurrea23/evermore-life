# Evermore State Page System

This folder is the scalable source for premium, state-specific Evermore Life Insurance LLC
landing pages.

## Current Governing Status

| State | Service status | Page mode |
| --- | --- | --- |
| Arizona | active | coverage-review conversion page |
| Texas | active | coverage-review conversion page |
| Arkansas | active | coverage-review conversion page |

This status reflects the human operator's Arkansas activation approval after
Arkansas licensing was obtained. Older repo handoffs that conflict with the
state data are stale and must not control this state-page system.

## Build

From the repository root:

```bash
python3 01_website/state-pages/scripts/build_state_pages.py
```

Generated pages are written to:

```text
01_website/state-pages/public/<state>/index.html
```

Open the generated pages locally for visual review. Nothing in this folder is
deployed automatically.

## Durable Sources

- `AGENT_CONTEXT_PROFILE.md` - the shared context every swarm agent receives
- `SWARM_RUNBOOK.md` - role boundaries and beginning-to-end workflow
- `data/states.json` - state-specific facts, content, mode, and CTA routing
- `templates/state-page.html` - shared semantic HTML structure
- `assets/state-pages.css` - shared premium Evermore visual system
- `scripts/build_state_pages.py` - validator and deterministic generator
- `STATE_PAGE_QA.md` - launch gates for every state

## Core Rules

1. State service status comes from verified evidence plus human approval.
2. Active pages may route to the coverage-review intake.
3. Pending pages may not route to quote, booking, or active nurture flows.
4. All generated pages remain `noindex, nofollow` until live route, intake,
   licensing, compliance, and conversion tracking are verified.
5. State-specific copy may feel local without inventing statistics, legal
   requirements, carrier availability, or customer claims.
6. Deploys, publishing, messages, spending, and account changes remain
   approval-gated.
