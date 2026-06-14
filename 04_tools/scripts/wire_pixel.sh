#!/usr/bin/env bash
set -euo pipefail

# Installs or replaces the Meta Pixel base code across the Evermore public pages.
# Pixel IDs are public identifiers, but still verify the ID belongs to the correct
# Meta Business account before running this on production files.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SITE_CURRENT_DIR="$PROJECT_ROOT/01_website/current"
SITE_EXPERIMENTS_DIR="$PROJECT_ROOT/01_website/experiments"
SITE_V2_DIR="$PROJECT_ROOT/01_website/v2/pages"
RETIREMENT_V2_DIR="$PROJECT_ROOT/01_website/retirement-planning-v2/pages"
CAMPAIGN_FUNNEL="$PROJECT_ROOT/04_content_narrative/FUNNEL_PAGE.html"

cat <<'EOF'
Evermore Meta Pixel wiring

Paste the numeric Meta Pixel ID from Events Manager.
This script updates the main Evermore HTML pages and replaces any older Pixel ID.
EOF

read -r -p "Meta Pixel ID: " META_PIXEL_ID

if [[ ! "$META_PIXEL_ID" =~ ^[0-9]{6,30}$ ]]; then
  echo "Meta Pixel ID should be numeric, usually 10-20 digits." >&2
  exit 1
fi

FILES=(
  "$SITE_CURRENT_DIR"/*.html
  "$SITE_V2_DIR"/*.html
  "$RETIREMENT_V2_DIR"/*.html
  "$CAMPAIGN_FUNNEL"
)

for optional_file in \
  "$SITE_EXPERIMENTS_DIR/Evermore_Landing_Page.html" \
  "$SITE_EXPERIMENTS_DIR/Sarah_Evermore_AI.html" \
  "$SITE_EXPERIMENTS_DIR/evermore-landing.html"
do
  [[ -f "$optional_file" ]] && FILES+=("$optional_file")
done

python3 - "$META_PIXEL_ID" "${FILES[@]}" <<'PY'
import re
import sys
from pathlib import Path

pixel_id = sys.argv[1]
paths = [Path(p) for p in sys.argv[2:]]

pixel_block = f"""<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{{if(f.fbq)return;n=f.fbq=function(){{n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)}};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '{pixel_id}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id={pixel_id}&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->
"""

block_re = re.compile(r"\n?<!-- Meta Pixel Code -->[\s\S]*?<!-- End Meta Pixel Code -->\n?", re.I)
config_re = re.compile(r"(window\.EVERMORE_META_PIXEL_ID\s*=\s*)['\"][^'\"]*['\"]")
updated = []

for path in paths:
    if not path.exists():
        continue
    text = path.read_text(encoding="utf-8")
    if config_re.search(text):
        new = config_re.sub(rf"\g<1>'{pixel_id}'", text)
        if new != text:
            path.write_text(new, encoding="utf-8")
            updated.append(str(path))
        continue
    without_old = block_re.sub("\n", text)
    if "</head>" not in without_old:
        print(f"Skipped {path}: no </head> tag")
        continue
    new = without_old.replace("</head>", pixel_block + "\n</head>", 1)
    if new != text:
        path.write_text(new, encoding="utf-8")
        updated.append(str(path))

print("Updated Meta Pixel in:")
for item in updated:
    print(f"  - {item}")
PY

cat <<'EOF'

Done. Next:
1. Publish the updated files.
2. Open Meta Events Manager Test Events.
3. Visit the live pages and submit one fake lead.
4. Confirm PageView and Lead/Schedule events are received.
EOF
