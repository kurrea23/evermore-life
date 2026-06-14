# Evermore Blueprint

This folder is the durable navigation layer for Evermore. It is both:

- a **map** of what exists and how it connects;
- a **compass** that tells humans and agents where to look, what to trust, and
  what to do next.

The operating model is called **Local-First Agent Cartography**.

## The One Rule

No important discovery may live only in chat.

Chat is scratch space. Canonical files, verified evidence, decisions, and agent
reports are durable system memory.

## Truth Order

When sources disagree, use this order:

1. Verified live evidence and current source code
2. Canonical state, runbooks, and handoffs
3. `BLUEPRINTS/MAP.md` and approved decisions
4. Dated cartographer reports
5. Chat history

Do not silently resolve a conflict. Record it in a report.

## Simple Operating Loop

1. **Read** `AGENTS.md`, this file, and `MAP.md`.
2. **Survey** one clearly named surface.
3. **Verify** claims against files or live evidence.
4. **Report** findings in `reports/YYYY-MM-DD_topic.md`.
5. **Connect** cross-surface findings in `OVERLAPS.md`.
6. **Decide** with a human; record approved decisions in `DECISIONS.md`.
7. **Update** the map only when routes or ownership changed.

## What Belongs Here

| File | Purpose |
| --- | --- |
| `MAP.md` | Stable routes, canonical sources, system flow, current compass |
| `DECISIONS.md` | Append-only record of approved consequential decisions |
| `OVERLAPS.md` | Cross-surface dependencies, conflicts, and opportunities |
| `REPORT_TEMPLATE.md` | Required shape for cartographer reports |
| `reports/` | Dated evidence and findings from each exploration |
| `visuals/` | Screenshots and diagrams referenced by reports |

## Definition Of Done For An Agent

An agent is not done because it answered in chat. It is done when its useful
findings are written locally, evidence is linked, uncertainty is explicit, and
the next operator can continue without the conversation.

Start a report from the repository root:

```bash
cp BLUEPRINTS/REPORT_TEMPLATE.md BLUEPRINTS/reports/YYYY-MM-DD_short-topic.md
```

## Durability

This repository has a Git remote, but uncommitted or unpushed files are still
local-only. Important Blueprint updates should be reviewed, committed, and
pushed through the normal approval process.
