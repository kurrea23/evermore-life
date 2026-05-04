#!/usr/bin/env bash
set -euo pipefail

# Wires a public GoHighLevel/LeadConnector inbound webhook into local Evermore pages.
#
# This intentionally does NOT ask for any private GHL API token. Private API
# tokens must stay server-side. Browser pages should post only to a workflow/form
# webhook URL that is designed to receive public form submissions.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SITE_CURRENT_DIR="$PROJECT_ROOT/01_website/current"
SITE_EXPERIMENTS_DIR="$PROJECT_ROOT/01_website/experiments"

cat <<'EOF'
Evermore GHL webhook wiring

Paste your GHL workflow inbound webhook URL below.
It usually starts with:
  https://hooks.leadconnectorhq.com/
or
  https://hooks.gohighlevel.com/

Do not paste a private GHL API token here.
EOF

read -r -p "GHL inbound webhook URL: " GHL_WEBHOOK_URL

if [[ ! "$GHL_WEBHOOK_URL" =~ ^https:// ]]; then
  echo "Webhook URL must start with https://" >&2
  exit 1
fi

FILES=(
  "$SITE_CURRENT_DIR/optin.html"
  "$SITE_CURRENT_DIR/index.html"
  "$SITE_EXPERIMENTS_DIR/Evermore_Landing_Page.html"
  "$SITE_EXPERIMENTS_DIR/Sarah_Evermore_AI.html"
  "$SITE_EXPERIMENTS_DIR/evermore-landing.html"
)

python3 - "$GHL_WEBHOOK_URL" "${FILES[@]}" <<'PY'
import re
import sys
from pathlib import Path

url = sys.argv[1]
paths = [Path(p) for p in sys.argv[2:]]

patterns = [
    (re.compile(r"(ghlWebhookUrl\s*:\s*)'[^']*'"), rf"\1'{url}'"),
    (re.compile(r'(ghlWebhookUrl\s*:\s*)"[^"]*"'), rf'\1"{url}"'),
    (re.compile(r"(GHL_WEBHOOK_URL\s*=\s*)'[^']*'"), rf"\1'{url}'"),
]

updated = []
for path in paths:
    if not path.exists():
        continue
    text = path.read_text(encoding="utf-8")
    new = text
    for pattern, repl in patterns:
        new = pattern.sub(repl, new)
    if new != text:
        path.write_text(new, encoding="utf-8")
        updated.append(str(path))

if not updated:
    print("No matching webhook config placeholders found. Run after the pages have the Evermore config block.")
else:
    print("Updated webhook URL in:")
    for item in updated:
        print(f"  - {item}")
PY

cat <<'EOF'

Done. Next:
1. Upload/publish the updated pages in GoHighLevel.
2. Submit a fake lead from the live domain.
3. Confirm the contact appears in GHL with source, consent, UTM, and page URL.

To redeploy Sarah to Cloudflare instead, set Cloudflare env vars and run:
  DEPLOY_SARAH_AFTER_WIRE=1 ./wire_ghl_webhook.sh
EOF

if [[ "${DEPLOY_SARAH_AFTER_WIRE:-0}" == "1" ]]; then
  "$SCRIPT_DIR/deploy_sarah.sh" "$SITE_EXPERIMENTS_DIR/Sarah_Evermore_AI.html"
fi
