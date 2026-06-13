#!/usr/bin/env python3
"""Push a structured Evermore morning snapshot without touching manual state."""

import argparse
import json
import pathlib
import subprocess
import sys
import tempfile


HERE = pathlib.Path(__file__).resolve().parent
CONFIG_PATH = HERE / "cockpit_update.config.json"


def run_curl(*args):
    result = subprocess.run(
        ["curl", "-sS", *args],
        check=True,
        capture_output=True,
        text=True,
    )
    return result.stdout


def build_parser():
    parser = argparse.ArgumentParser()
    parser.add_argument("--json-file", help="Read the generated snapshot from a JSON file.")
    parser.add_argument("--date", default="")
    parser.add_argument("--mission", default="")
    parser.add_argument("--next-action", default="")
    parser.add_argument("--today", default="")
    parser.add_argument("--done", default="")
    parser.add_argument("--next", default="")
    parser.add_argument("--blockers", default="")
    parser.add_argument("--priority", action="append", default=[])
    parser.add_argument("--schedule", action="append", default=[])
    parser.add_argument("--follow-up", action="append", default=[])
    parser.add_argument("--risk", action="append", default=[])
    parser.add_argument("--source", action="append", default=[], metavar="NAME=STATUS")
    parser.add_argument("--generated-at", required=True)
    parser.add_argument("--generated-by", default="evermore-cockpit-morning-update")
    return parser


def generated_from_args(args):
    if args.json_file:
        value = json.loads(pathlib.Path(args.json_file).read_text())
        return value.get("generated", value)

    sources = {}
    for source in args.source:
        name, separator, status = source.partition("=")
        if separator and name in {"gmail", "calendar", "repo", "highLevel"}:
            sources[name] = status

    return {
        "date": args.date,
        "mission": args.mission,
        "nextAction": args.next_action,
        "brief": {
            "today": args.today,
            "done": args.done,
            "next": args.next,
            "blockers": args.blockers,
        },
        "priorities": args.priority,
        "schedule": args.schedule,
        "followUps": args.follow_up,
        "risks": args.risk,
        "sources": sources,
        "generatedAt": args.generated_at,
        "generatedBy": args.generated_by,
    }


def main():
    args = build_parser().parse_args()
    config = json.loads(CONFIG_PATH.read_text())
    base_url = config.get("base_url", "https://evermorelife.org").rstrip("/")
    password = config["access_code"]

    generated = generated_from_args(args)
    with tempfile.TemporaryDirectory() as temp_dir:
        jar_path = str(pathlib.Path(temp_dir) / "cookies.txt")
        payload_path = pathlib.Path(temp_dir) / "payload.json"
        payload_path.write_text(json.dumps({"generated": generated}))

        status = run_curl(
            "-o", "/dev/null",
            "-w", "%{http_code}",
            "-c", jar_path,
            "-X", "POST",
            f"{base_url}/dashboard/login",
            "--data-urlencode", f"password={password}",
        )
        if status != "302":
            raise RuntimeError(f"Dashboard login failed with HTTP {status}")

        written = json.loads(run_curl(
            "-b", jar_path,
            "-X", "POST",
            "-H", "content-type: application/json",
            "--data-binary", f"@{payload_path}",
            f"{base_url}/api/cockpit-update",
        ))
        verified = json.loads(run_curl("-b", jar_path, f"{base_url}/api/cockpit-state"))

    expected = written.get("generated", {}).get("generatedAt")
    actual = verified.get("generated", {}).get("generatedAt")
    if not expected or expected != actual:
        raise RuntimeError(f"Dashboard verification failed: expected {expected!r}, got {actual!r}")

    print(json.dumps({
        "ok": True,
        "dashboard": config.get("dashboard_url", f"{base_url}/dashboard"),
        "generatedAt": actual,
        "manualTaskCount": len(verified.get("user", {}).get("main", {})),
        "manualProjectCount": len(verified.get("user", {}).get("projects", {})),
        "winCount": len(verified.get("user", {}).get("wins", [])),
    }, indent=2))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise
