#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
CONFIG="$PROJECT_ROOT/02_ghl/relay_worker/wrangler.ghl-relay.jsonc"

cat <<'EOF'
Evermore GHL lead relay deploy

Before deploying:
1. Edit 02_ghl/relay_worker/wrangler.ghl-relay.jsonc and set GHL_LOCATION_ID.
2. Make sure ALLOWED_ORIGINS includes the exact public GHL/domain origins.
3. Run the secret command below and paste the GHL Private Integration Token.

This deploys a server-side relay. The private token is stored as a Worker secret,
not in browser HTML.
EOF

echo
echo "Set secret:"
echo "  npx --yes wrangler@latest secret put GHL_PRIVATE_TOKEN --config \"$CONFIG\""
echo
echo "Deploy:"
echo "  npx --yes wrangler@latest deploy --config \"$CONFIG\""
