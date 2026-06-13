#!/bin/bash
# push_cockpit_brief.sh — compatibility helper for a one-line cockpit brief
# Usage: ./push_cockpit_brief.sh "Today: ... Done: ... Next: ... Blockers: ..."
# Reads access code from cockpit_update.config.json next to this script.
# Updates generated state only. Manual tasks, notes, and wins are never touched.
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
BRIEF_TEXT="${1:?Usage: push_cockpit_brief.sh \"Today: ... Done: ... Next: ... Blockers: ...\"}"
CODE=$(python3 -c "import json;print(json.load(open('$DIR/cockpit_update.config.json'))['access_code'])")
BASE="https://evermorelife.org"
JAR=$(mktemp)

# 1. Login
status=$(curl -s -o /dev/null -w "%{http_code}" -c "$JAR" -X POST "$BASE/dashboard/login" --data-urlencode "password=$CODE")
[ "$status" = "302" ] || { echo "Login failed (HTTP $status)"; exit 1; }

# 2. Merge the brief into generated state and leave every other field alone
curl -s -b "$JAR" "$BASE/api/cockpit-state" > "$JAR.state"
BRIEF_TEXT="$BRIEF_TEXT" python3 - "$JAR.state" <<'EOF' > "$JAR.next"
import datetime, json, os, re, sys
state = json.load(open(sys.argv[1]))
generated = state.get("generated", {})
source = re.sub(r"\s+", " ", os.environ["BRIEF_TEXT"].strip())
parts = {}
patterns = {
    "today": r"today:\s*(.*?)(?=\s(?:done|wins|next|blockers):|$)",
    "done": r"(?:done|wins):\s*(.*?)(?=\s(?:today|next|blockers):|$)",
    "next": r"next:\s*(.*?)(?=\s(?:today|done|wins|blockers):|$)",
    "blockers": r"blockers:\s*(.*?)(?=\s(?:today|done|wins|next):|$)",
}
for key, pattern in patterns.items():
    match = re.search(pattern, source, re.I)
    parts[key] = match.group(1).strip() if match else ""
generated["brief"] = parts
generated["generatedAt"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
generated["generatedBy"] = "push_cockpit_brief.sh"
print(json.dumps({
    "generated": generated
}))
EOF
curl -s -b "$JAR" -X POST -H "content-type: application/json" --data-binary @"$JAR.next" "$BASE/api/cockpit-update" | head -c 300
echo
rm -f "$JAR" "$JAR.state" "$JAR.next"
echo "OK — dashboard brief updated."
