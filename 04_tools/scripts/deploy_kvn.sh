#!/usr/bin/env bash
set -euo pipefail

# Deploy KVN.html to Cloudflare Workers without hardcoding secrets.
# Required env vars:
#   CLOUDFLARE_ACCOUNT_ID
#   CLOUDFLARE_API_TOKEN
# Optional:
#   WORKER_NAME=kvn-agent

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
HTML_FILE="${1:-$PROJECT_ROOT/01_website/experiments/KVN.html}"
WORKER_NAME="${WORKER_NAME:-kvn-agent}"
ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-${ACCOUNT_ID:-}}"
API_TOKEN="${CLOUDFLARE_API_TOKEN:-${CF_API_TOKEN:-}}"

if [[ ! -f "$HTML_FILE" ]]; then
  echo "KVN HTML file not found: $HTML_FILE" >&2
  exit 1
fi

if [[ -z "$ACCOUNT_ID" || -z "$API_TOKEN" ]]; then
  cat >&2 <<'EOF'
Missing Cloudflare credentials.

Set these in your terminal, then rerun:
  export CLOUDFLARE_ACCOUNT_ID="your-account-id"
  export CLOUDFLARE_API_TOKEN="your-api-token"

Do not paste API tokens into HTML or commit them into this folder.
EOF
  exit 1
fi

TMP_WORKER="$(mktemp)"
trap 'rm -f "$TMP_WORKER"' EXIT

node - "$HTML_FILE" > "$TMP_WORKER" <<'NODE'
const fs = require('fs');
const htmlPath = process.argv[2];
const html = fs.readFileSync(htmlPath, 'utf8');
process.stdout.write(`addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  return new Response(${JSON.stringify(html)}, {
    headers: {
      'content-type': 'text/html; charset=UTF-8',
      'cache-control': 'no-store'
    }
  })
}
`);
NODE

echo "Deploying $HTML_FILE to Cloudflare Worker: $WORKER_NAME"

RESPONSE="$(curl -fsS -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts/${WORKER_NAME}" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/javascript" \
  --data-binary @"$TMP_WORKER")"

SUCCESS="$(node -e "const d=JSON.parse(process.argv[1]); console.log(Boolean(d.success))" "$RESPONSE")"

if [[ "$SUCCESS" == "true" ]]; then
  echo "KVN deployed successfully."
  echo "Worker: $WORKER_NAME"
else
  echo "Deploy failed:" >&2
  echo "$RESPONSE" >&2
  exit 1
fi
