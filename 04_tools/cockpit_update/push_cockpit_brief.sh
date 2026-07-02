#!/bin/bash
# push_cockpit_brief.sh — update the one-line daily brief on the v7 living cockpit.
# Usage: ./push_cockpit_brief.sh "Today: ... Done: ... Next: ... Blockers: ..."
#
# v7 REWRITE (2026-07-02). The old version POSTed {"generated":{...}} to
# /api/cockpit-update — a key the Worker's schema gatekeeper silently drops —
# and then printed "OK" unconditionally. This version follows the verified
# flow: login → GET full state → set main.dailyBrief (merge, never overwrite
# anything else) → POST the FULL state back → re-GET and confirm the brief
# actually landed. Exits non-zero at every failure point.
#
# Reads access_code from cockpit_update.config.json next to this script
# (gitignored — copy cockpit_update.config.example.json and fill it in).
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
BRIEF_TEXT="${1:?Usage: push_cockpit_brief.sh \"Today: ... Done: ... Next: ... Blockers: ...\"}"
CONFIG="$DIR/cockpit_update.config.json"

[ -f "$CONFIG" ] || { echo "FAIL: $CONFIG not found. Copy cockpit_update.config.example.json to cockpit_update.config.json and set the real access_code." >&2; exit 1; }

CODE=$(python3 -c "import json;print(json.load(open('$CONFIG'))['access_code'])")
BASE=$(python3 -c "import json;print(json.load(open('$CONFIG')).get('base_url','https://evermorelife.org'))")

case "$CODE" in
  ""|set-the-private-dashboard-access-code-locally)
    echo "FAIL: access_code in cockpit_update.config.json is empty or still the placeholder." >&2; exit 1;;
esac

JAR=$(mktemp); STATE=$(mktemp); NEXT=$(mktemp); ECHOED=$(mktemp)
trap 'rm -f "$JAR" "$STATE" "$NEXT" "$ECHOED"' EXIT

# 1. Login (a successful login is a 302 + cookie; a 200 means REJECTED)
status=$(curl -s -o /dev/null -w "%{http_code}" -c "$JAR" -X POST "$BASE/dashboard/login" --data-urlencode "password=$CODE")
[ "$status" = "302" ] || { echo "FAIL: login rejected (HTTP $status — expected 302). Check access_code." >&2; exit 1; }

# 2. GET the current full state
status=$(curl -s -o "$STATE" -w "%{http_code}" -b "$JAR" "$BASE/api/cockpit-state")
[ "$status" = "200" ] || { echo "FAIL: GET /api/cockpit-state returned HTTP $status." >&2; exit 1; }

# 3. Merge: set main.dailyBrief only; preserve every other key, done-flag, and note
BRIEF_TEXT="$BRIEF_TEXT" python3 - "$STATE" <<'EOF' > "$NEXT"
import datetime, json, os, re, sys
state = json.load(open(sys.argv[1]))
if not isinstance(state.get("main"), dict) or not isinstance(state.get("projects"), dict):
    sys.stderr.write("FAIL: fetched state is missing main/projects — refusing to write.\n")
    sys.exit(1)
now = datetime.datetime.now(datetime.timezone.utc).isoformat()
text = re.sub(r"\s+", " ", os.environ["BRIEF_TEXT"].strip())
state["main"]["dailyBrief"] = {"text": text, "updatedAt": now}
state["updatedAt"] = now
json.dump(state, sys.stdout)
EOF

# 4. POST the FULL merged state back
status=$(curl -s -o "$ECHOED" -w "%{http_code}" -b "$JAR" -X POST -H "content-type: application/json" --data-binary @"$NEXT" "$BASE/api/cockpit-state")
[ "$status" = "200" ] || { echo "FAIL: POST /api/cockpit-state returned HTTP $status: $(head -c 300 "$ECHOED")" >&2; exit 1; }

# 5. Verify: re-GET and confirm the brief text actually persisted
curl -s -b "$JAR" "$BASE/api/cockpit-state" > "$ECHOED"
BRIEF_TEXT="$BRIEF_TEXT" python3 - "$ECHOED" <<'EOF'
import json, os, re, sys
state = json.load(open(sys.argv[1]))
want = re.sub(r"\s+", " ", os.environ["BRIEF_TEXT"].strip())
got = (state.get("main", {}).get("dailyBrief") or {}).get("text", "")
if got != want:
    sys.stderr.write(f"FAIL: brief did not persist. Live value: {got[:200]!r}\n")
    sys.exit(1)
EOF

echo "OK — dashboard brief updated and verified live."
