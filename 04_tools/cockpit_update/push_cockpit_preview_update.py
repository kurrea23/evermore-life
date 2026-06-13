#!/usr/bin/env python3
"""Push and verify a generated Cockpit V3 preview snapshot without touching production."""

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


def login(base_url, password, jar_path):
    status = run_curl(
        "-o", "/dev/null",
        "-w", "%{http_code}",
        "-c", jar_path,
        "-X", "POST",
        f"{base_url}/dashboard-preview/login",
        "--data-urlencode", f"password={password}",
    )
    if status != "302":
        raise RuntimeError(f"Dashboard preview login failed with HTTP {status}")


def state_counts(state):
    user = state.get("user") or {}
    return {
        "main": len(user.get("main") or {}),
        "projects": len(user.get("projects") or {}),
        "wins": len(user.get("wins") or []),
        "tasks": len(user.get("tasks") or []),
        "projectLanes": len(user.get("projectLanes") or []),
    }


def production_fingerprint(state):
    return json.dumps({
        "generatedAt": (state.get("generated") or {}).get("generatedAt"),
        "counts": state_counts(state),
    }, sort_keys=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--json-file", required=True)
    parser.add_argument("--generated-at", required=True)
    args = parser.parse_args()

    config = json.loads(CONFIG_PATH.read_text())
    base_url = config.get("base_url", "https://evermorelife.org").rstrip("/")
    password = config["access_code"]
    supplied = json.loads(pathlib.Path(args.json_file).read_text())
    generated = supplied.get("generated", supplied)
    generated["generatedAt"] = args.generated_at
    generated.setdefault("generatedBy", "evermore-cockpit-v3-preview-refresh")

    with tempfile.TemporaryDirectory() as temp_dir:
        jar_path = str(pathlib.Path(temp_dir) / "cookies.txt")
        payload_path = pathlib.Path(temp_dir) / "payload.json"
        payload_path.write_text(json.dumps({"generated": generated}))
        login(base_url, password, jar_path)

        production_before = json.loads(run_curl("-b", jar_path, f"{base_url}/api/cockpit-state"))
        preview_before = json.loads(run_curl("-b", jar_path, f"{base_url}/api/cockpit-preview-state"))
        written = json.loads(run_curl(
            "-b", jar_path,
            "-X", "POST",
            "-H", "content-type: application/json",
            "--data-binary", f"@{payload_path}",
            f"{base_url}/api/cockpit-preview-update",
        ))
        preview_after = json.loads(run_curl("-b", jar_path, f"{base_url}/api/cockpit-preview-state"))
        production_after = json.loads(run_curl("-b", jar_path, f"{base_url}/api/cockpit-state"))

    actual = (preview_after.get("generated") or {}).get("generatedAt")
    if actual != args.generated_at:
        raise RuntimeError(f"Preview verification failed: expected {args.generated_at!r}, got {actual!r}")
    if state_counts(preview_before) != state_counts(preview_after):
        raise RuntimeError("Preview manual state counts changed during generated update")
    if production_fingerprint(production_before) != production_fingerprint(production_after):
        raise RuntimeError("Production cockpit changed during preview update")
    if (written.get("generated") or {}).get("generatedAt") != actual:
        raise RuntimeError("Preview write response does not match readback")

    print(json.dumps({
        "ok": True,
        "preview": f"{base_url}/dashboard-preview",
        "generatedAt": actual,
        "previewManualCounts": state_counts(preview_after),
        "productionUnchanged": True,
    }, indent=2))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise
