#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CONFIG="$ROOT/04_tools/cockpit_update/cockpit_update.config.json"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_DIR="/tmp/evermore-cockpit-deploy-backups/$STAMP"
JAR="$BACKUP_DIR/cookies.txt"

mkdir -p "$BACKUP_DIR"
BASE_URL="$(python3 -c "import json;print(json.load(open('$CONFIG')).get('base_url','https://evermorelife.org').rstrip('/'))")"
ACCESS_CODE="$(python3 -c "import json;print(json.load(open('$CONFIG'))['access_code'])")"

STATUS="$(curl -sS -o /dev/null -w '%{http_code}' -c "$JAR" -X POST \
  "$BASE_URL/dashboard/login" --data-urlencode "password=$ACCESS_CODE")"
if [[ "$STATUS" != "302" ]]; then
  echo "Dashboard login failed with HTTP $STATUS" >&2
  exit 1
fi

curl -sS -b "$JAR" "$BASE_URL/api/cockpit-state" > "$BACKUP_DIR/production-state.json"
curl -sS -b "$JAR" "$BASE_URL/api/cockpit-preview-state" > "$BACKUP_DIR/preview-state.json" || true

cd "$ROOT"
npx wrangler deploy --config 01_website/v2/cloudflare/wrangler.live-proxy.jsonc
echo "Pre-deploy state exports: $BACKUP_DIR"
