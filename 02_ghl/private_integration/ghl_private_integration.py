#!/usr/bin/env python3
"""
GoHighLevel private integration helper for Evermore Life.

This script is intentionally server/local-only. Do not import it from browser
HTML and do not paste private integration tokens into public pages.

Environment variables:
  GHL_PRIVATE_TOKEN   Required. Sub-account Private Integration Token.
  GHL_LOCATION_ID     Required. HighLevel sub-account/location ID.
  GHL_API_VERSION     Optional. Defaults to 2021-07-28.

Examples:
  python3 ghl_private_integration.py location --dry-run
  python3 ghl_private_integration.py location --live
  python3 ghl_private_integration.py test-contact --dry-run
  python3 ghl_private_integration.py test-contact --live
  python3 ghl_private_integration.py upsert-json lead_payload.json --live
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from typing import Any


BASE_URL = "https://services.leadconnectorhq.com"


def env_required(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        raise SystemExit(f"Missing {name}. Set it in your shell or secret manager first.")
    return value


def auth_header(token: str) -> str:
    if token.lower().startswith("bearer "):
        return token
    return f"Bearer {token}"


def headers() -> dict[str, str]:
    token = env_required("GHL_PRIVATE_TOKEN")
    return {
        "Accept": "application/json",
        "Authorization": auth_header(token),
        "Content-Type": "application/json",
        "Version": os.environ.get("GHL_API_VERSION", "2021-07-28"),
    }


def request_json(method: str, path: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
    body = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(
        BASE_URL + path,
        data=body,
        headers=headers(),
        method=method,
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as response:
            raw = response.read().decode("utf-8")
            return {
                "status": response.status,
                "body": json.loads(raw) if raw else {},
            }
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        raise SystemExit(json.dumps({
            "status": exc.code,
            "error": raw,
        }, indent=2))


def print_payload(label: str, method: str, path: str, payload: dict[str, Any] | None) -> None:
    redacted_headers = headers()
    redacted_headers["Authorization"] = "Bearer ***redacted***"
    print(json.dumps({
        "label": label,
        "method": method,
        "url": BASE_URL + path,
        "headers": redacted_headers,
        "payload": payload,
    }, indent=2))


def location(live: bool) -> None:
    location_id = env_required("GHL_LOCATION_ID")
    path = f"/locations/{location_id}"
    if not live:
        print_payload("Dry run: get location", "GET", path, None)
        return
    print(json.dumps(request_json("GET", path), indent=2))


def test_contact(live: bool) -> None:
    location_id = env_required("GHL_LOCATION_ID")
    stamp = int(time.time())
    payload = {
        "firstName": "Evermore",
        "lastName": "Codex Test",
        "email": f"evermore.codex.test+{stamp}@example.com",
        "phone": "+15550100199",
        "locationId": location_id,
        "source": "Codex private integration test",
        "tags": ["evermore-life-lead", "codex-test"],
    }
    path = "/contacts/"
    if not live:
        print_payload("Dry run: create test contact", "POST", path, payload)
        return
    print(json.dumps(request_json("POST", path, payload), indent=2))


def upsert_json(input_path: str, live: bool) -> None:
    location_id = env_required("GHL_LOCATION_ID")
    with open(input_path, "r", encoding="utf-8") as handle:
        payload = json.load(handle)
    payload.setdefault("locationId", location_id)
    path = "/contacts/upsert"
    if not live:
        print_payload("Dry run: upsert contact from JSON", "POST", path, payload)
        return
    print(json.dumps(request_json("POST", path, payload), indent=2))


def main() -> int:
    parser = argparse.ArgumentParser(description="Evermore GHL private integration helper")
    sub = parser.add_subparsers(dest="command", required=True)

    for name in ("location", "test-contact"):
        cmd = sub.add_parser(name)
        cmd.add_argument("--live", action="store_true", help="Actually call the HighLevel API")
        cmd.add_argument("--dry-run", action="store_true", help="Print the request without calling HighLevel")

    upsert = sub.add_parser("upsert-json")
    upsert.add_argument("input_path")
    upsert.add_argument("--live", action="store_true", help="Actually call the HighLevel API")
    upsert.add_argument("--dry-run", action="store_true", help="Print the request without calling HighLevel")

    args = parser.parse_args()
    live = bool(args.live)

    if args.command == "location":
        location(live)
    elif args.command == "test-contact":
        test_contact(live)
    elif args.command == "upsert-json":
        upsert_json(args.input_path, live)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
