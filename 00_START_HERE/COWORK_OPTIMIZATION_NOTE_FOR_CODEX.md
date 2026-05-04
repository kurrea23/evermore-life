# Cowork Optimization Note → Codex

Date: 2026-05-02
From: Cowork
To: Codex (next pass)

## What changed

Your numbered folder structure (`01_website/`, `02_ghl/`, `03_sales_marketing/`, `04_tools/`, `05_exports_archive/`) is preserved exactly. **Nothing was moved.** I only added one thing on top of it: an **`active/` workspace** at `00_START_HERE/active/` that uses symlinks to surface the files we're touching this week.

## Why

After your reorg, the 4–6 files we actually need every day were spread across four different lanes:

- The cockpit was filed under `experiments/` (it's not an experiment — it's the live dashboard)
- The GHL launch kit (critical path to A2P) was three folders deep
- The handoffs were in `sales_marketing/handoffs/`
- The scripts we run this week were in `tools/scripts/`

A user shouldn't have to remember four paths. With `active/`, there's one folder to open.

## active/ layout

```
00_START_HERE/active/
├── cockpit/          → EVERMORE_COCKPIT.html  (live dashboard)
├── now/              → 5 public site pages    (source of truth)
├── next_in_ghl/      → launch_kit, numbered 00–07 in build order
├── handoffs/         → 01_COWORK_HANDOFF.md, 02_EVERMORE_HANDOFF.md
└── run/              → 4 scripts to invoke this week
```

Every entry is a relative symlink. **Editing through `active/` writes to the original; deleting a symlink does not delete the original.**

## Files I touched

1. `00_START_HERE/README.md` — rewritten. Now points at `active/` first, then explains the lanes underneath. Your original lane descriptions are preserved.
2. `00_START_HERE/active/` — created. All contents are symlinks.
3. `01_website/experiments/EVERMORE_COCKPIT.html` — fixed twelve broken relative paths inside it. After your reorg moved the cockpit into `experiments/`, its `window.open('ghl_launch_kit/...')` calls were pointing nowhere. They now point to `../../02_ghl/launch_kit/...` and the equivalent for handoffs and playbooks. **Cockpit is fully functional from its new home.**
4. `00_START_HERE/COWORK_OPTIMIZATION_NOTE_FOR_CODEX.md` — this file.

## Mission-state context

The cockpit (`active/cockpit/EVERMORE_COCKPIT.html`) was rewritten earlier in this same session to reflect the post-Codex state:

- 4 of 10 launch steps locked done (security hardening, launch kit shipped, native-GHL-form approach decided, local QA)
- 6 remaining are the A2P critical path: build form + 5 pages, build workflow, fake-lead test, submit A2P, install Pixel + ads, first booked appointment
- Sarah/KVN Worker pills downgraded to "deployed · verify" (they may still be live, but weren't pinged today)
- Stop-conditions panel + Codex changelog visible at bottom

## What you can do on your next pass

If anything below makes the workspace cleaner, go for it. None of it is required:

1. If you decide a file in `active/` is no longer daily, delete the symlink — the original stays in place.
2. If you add new files to the launch kit or scripts, consider whether they belong as a new symlink under `active/`.
3. If you want to promote one of the `01_website/experiments/` HTML files (cockpit, Sarah, KVN, landing variants) out of "experiments" — they're production-grade, not prototypes. Up to you whether to move them.
4. The Vision Pro cockpit (`EVERMORE_COCKPIT_VISIONPRO.html`) hasn't been refreshed in this pass. Standard cockpit is the source of truth right now.
5. The `04_tools/system_files/root.DS_Store` is a macOS `.DS_Store` file. Probably safe to delete.

## Working rule (proposed)

Cowork builds & ships → Codex hardens & files → Cowork verifies & surfaces → loop. Use `active/` as the shared "what we're touching this week" surface. Everything else lives in its lane.
