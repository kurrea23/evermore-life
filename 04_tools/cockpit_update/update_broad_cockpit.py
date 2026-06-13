#!/usr/bin/env python3
"""Replace the generated operational brief in the broad Evermore HTML cockpit."""

import argparse
import datetime
import html
import json
import pathlib
import sys


ROOT = pathlib.Path(__file__).resolve().parents[2]
DEFAULT_COCKPIT = ROOT / "00_START_HERE/active/cockpit/EVERMORE_COCKPIT.html"
START = "<!-- BROAD_COCKPIT_GENERATED_START -->"
END = "<!-- BROAD_COCKPIT_GENERATED_END -->"


def render_items(items, empty_message):
    values = [str(item).strip() for item in items if str(item).strip()]
    if not values:
        values = [empty_message]
    return "".join(f"<li>{html.escape(value)}</li>" for value in values)


def render_sources(sources):
    if not sources:
        return '<span class="broad-source">No source status supplied</span>'
    return "".join(
        f'<span class="broad-source"><strong>{html.escape(str(name))}:</strong> '
        f"{html.escape(str(status))}</span>"
        for name, status in sources.items()
    )


def render(snapshot):
    date = html.escape(str(snapshot.get("date", "")))
    generated_at = html.escape(str(snapshot.get("generatedAt", "")))
    mission = html.escape(str(snapshot.get("mission", "No mission supplied.")))
    next_action = html.escape(str(snapshot.get("nextAction", "No next action supplied.")))
    brief = snapshot.get("brief") or {}

    return f"""{START}
    <section id="broad-operational-brief" class="broad-brief">
      <div class="broad-brief-head">
        <div>
          <div class="broad-kicker">GENERATED BROAD OPERATING COCKPIT</div>
          <div class="broad-date">{date}</div>
        </div>
        <div class="broad-generated">Generated {generated_at}</div>
      </div>
      <div class="broad-mission"><strong>Mission:</strong> {mission}</div>
      <div class="broad-next"><strong>Exact next action:</strong> {next_action}</div>
      <div class="broad-grid">
        <div><h3>Priorities</h3><ol>{render_items(snapshot.get("priorities", []), "No verified priorities.")}</ol></div>
        <div><h3>Schedule</h3><ul>{render_items(snapshot.get("schedule", []), "No verified schedule items.")}</ul></div>
        <div><h3>Actionable Follow-ups</h3><ul>{render_items(snapshot.get("followUps", []), "No actionable follow-ups.")}</ul></div>
        <div><h3>Blockers and Risks</h3><ul>{render_items(snapshot.get("risks", []), brief.get("blockers") or "No verified blockers.")}</ul></div>
      </div>
      <div class="broad-brief-lines">
        <div><strong>Today:</strong> {html.escape(str(brief.get("today", "")))}</div>
        <div><strong>Done:</strong> {html.escape(str(brief.get("done", "")))}</div>
        <div><strong>Next:</strong> {html.escape(str(brief.get("next", "")))}</div>
        <div><strong>Blockers:</strong> {html.escape(str(brief.get("blockers", "")))}</div>
      </div>
      <div class="broad-sources">{render_sources(snapshot.get("sources") or {})}</div>
    </section>
    {END}"""


def replace_generated(document, replacement):
    start = document.find(START)
    end = document.find(END)
    if start < 0 or end < 0 or end < start:
        raise RuntimeError("Broad cockpit generated markers are missing or malformed")
    return document[:start] + replacement + document[end + len(END):]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--json-file", required=True)
    parser.add_argument("--cockpit-file", default=str(DEFAULT_COCKPIT))
    args = parser.parse_args()

    snapshot = json.loads(pathlib.Path(args.json_file).read_text())
    snapshot = snapshot.get("broad", snapshot.get("generated", snapshot))
    if not snapshot.get("date") or not snapshot.get("generatedAt"):
        raise RuntimeError("Snapshot must include non-empty date and generatedAt values")

    cockpit_path = pathlib.Path(args.cockpit_file)
    updated = replace_generated(cockpit_path.read_text(), render(snapshot))
    cockpit_path.write_text(updated)

    verified = cockpit_path.read_text()
    required = [
        START,
        END,
        str(snapshot["date"]),
        str(snapshot["generatedAt"]),
        "Priorities",
        "Actionable Follow-ups",
        "Blockers and Risks",
    ]
    missing = [value for value in required if value not in verified]
    if missing:
        raise RuntimeError(f"Broad cockpit verification failed; missing: {missing}")

    print(json.dumps({
        "ok": True,
        "cockpit": str(cockpit_path),
        "date": snapshot["date"],
        "generatedAt": snapshot["generatedAt"],
        "priorityCount": len(snapshot.get("priorities", [])),
        "followUpCount": len(snapshot.get("followUps", [])),
        "riskCount": len(snapshot.get("risks", [])),
    }, indent=2))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise
