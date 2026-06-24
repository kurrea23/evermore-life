#!/usr/bin/env bash
###############################################################################
# Evermore Life — One-Step Deploy to evermorelife.org
#
# WHAT THIS DOES (and why it won't break):
#   1. Pulls a FRESH copy of the `main` branch straight from GitHub.
#      (It ignores your local folders + worktrees on purpose — those get
#       tangled. GitHub `main` is the single source of truth.)
#   2. Sanity-checks the files before deploying (so it can never upload an
#      empty / half-broken site).
#   3. Deploys to the Cloudflare Pages project that powers the live site.
#   4. Verifies the live site is actually responding before declaring success.
#
# THE WORKFLOW (just two steps, every time):
#   STEP 1 — Save your change to GitHub `main`:
#       Edit the file, then commit + push it to the `main` branch.
#       (If a file only lives in your feature folder, copy it into the live
#        path first — e.g. growth-calculator/index.html — then commit + push.)
#   STEP 2 — Run this script:
#       ./deploy.sh
#
#   That's it.  Edit → push to main → ./deploy.sh
#
# REQUIREMENTS: git, curl, and Node/npx (for wrangler). You already have them.
###############################################################################

set -euo pipefail

# ----- Settings (rarely need to change) --------------------------------------
REPO_URL="https://github.com/kurrea23/evermore-life.git"
BRANCH="main"
PAGES_PROJECT="evermore-life"
LIVE_URL="https://evermorelife.org"
CHECK_ROUTES=("/" "/growth-calculator/" "/score-tracker/")  # expect HTTP 200 after deploy
MIN_FILES=100          # a healthy build has ~349 files; <100 means something is wrong
WORKDIR="$(mktemp -d /tmp/evermore-deploy.XXXXXX)"

# ----- Pretty output ---------------------------------------------------------
bold=$'\033[1m'; green=$'\033[32m'; red=$'\033[31m'; yellow=$'\033[33m'; reset=$'\033[0m'
say()  { echo "${bold}▸ $*${reset}"; }
ok()   { echo "${green}✓ $*${reset}"; }
warn() { echo "${yellow}! $*${reset}"; }
die()  { echo "${red}✗ $*${reset}" >&2; exit 1; }

cleanup() { rm -rf "$WORKDIR"; }
trap cleanup EXIT

# ----- 0. Tool check ---------------------------------------------------------
for tool in git curl npx; do
  command -v "$tool" >/dev/null 2>&1 || die "Missing required tool: $tool"
done

# ----- 1. Fresh clone of main from GitHub ------------------------------------
say "Fetching a clean copy of '$BRANCH' from GitHub..."
git clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$WORKDIR/site" >/dev/null 2>&1 \
  || die "Clone failed. Check your internet / GitHub access and try again."
SHA="$(git -C "$WORKDIR/site" rev-parse HEAD)"
SHORT_SHA="${SHA:0:7}"
SUBJECT="$(git -C "$WORKDIR/site" log -1 --pretty=%s)"
rm -rf "$WORKDIR/site/.git"   # don't deploy git internals
ok "Got commit $SHORT_SHA — \"$SUBJECT\""

# ----- 2. Sanity checks (refuse to deploy a broken tree) ---------------------
say "Sanity-checking the build before deploy..."
FILE_COUNT="$(find "$WORKDIR/site" -type f | wc -l | tr -d ' ')"
[ "$FILE_COUNT" -ge "$MIN_FILES" ] \
  || die "Only $FILE_COUNT files found (expected >= $MIN_FILES). Aborting so we don't push an empty site."
for must in "index.html" "growth-calculator/index.html" "score-tracker/index.html" "agent-suite-auth.js" "CNAME"; do
  [ -f "$WORKDIR/site/$must" ] || die "Expected file missing: $must — aborting."
done
ok "Build looks healthy ($FILE_COUNT files, key pages present)."

# ----- 3. Confirm with the operator ------------------------------------------
echo
echo "${bold}About to deploy:${reset}"
echo "   Commit : $SHORT_SHA  \"$SUBJECT\""
echo "   Files  : $FILE_COUNT"
echo "   Target : Cloudflare Pages '$PAGES_PROJECT' (branch $BRANCH) → $LIVE_URL"
echo
read -r -p "Proceed? [y/N] " reply
case "$reply" in
  y|Y|yes|YES) ;;
  *) die "Cancelled. Nothing was deployed." ;;
esac

# ----- 4. Deploy to Cloudflare Pages -----------------------------------------
say "Deploying to Cloudflare Pages..."
DEPLOY_LOG="$WORKDIR/deploy.log"
if ! ( cd "$WORKDIR/site" && npx --yes wrangler@latest pages deploy . \
      --project-name "$PAGES_PROJECT" \
      --branch "$BRANCH" \
      --commit-hash "$SHA" \
      --commit-message "$SUBJECT" \
      --commit-dirty=true ) 2>&1 | tee "$DEPLOY_LOG"; then
  die "wrangler deploy failed — read the output above. (If it asked you to log in, authenticate and re-run.)"
fi

# Guard against the silent "Uploaded 0 files" empty-deploy footgun:
if grep -q "Uploaded 0 files" "$DEPLOY_LOG" && ! grep -q "already uploaded" "$DEPLOY_LOG"; then
  die "Deploy uploaded 0 files — the source was empty. Live site was NOT changed."
fi
PREVIEW_URL="$(grep -oE 'https://[a-z0-9]+\.'"$PAGES_PROJECT"'\.pages\.dev' "$DEPLOY_LOG" | head -1 || true)"
ok "Pages deploy complete.${PREVIEW_URL:+  Preview: $PREVIEW_URL}"

# ----- 5. Verify the live site is responding ---------------------------------
say "Verifying the live site..."
sleep 5
ALL_GOOD=1
for route in "${CHECK_ROUTES[@]}"; do
  code="$(curl -sL -m 25 -o /dev/null -w '%{http_code}' "${LIVE_URL}${route}?cb=$(date +%s%N)" || echo 000)"
  if [ "$code" = "200" ]; then
    ok "200  ${LIVE_URL}${route}"
  else
    warn "$code  ${LIVE_URL}${route}  (may just need a moment or a cache purge)"
    ALL_GOOD=0
  fi
done

echo
if [ "$ALL_GOOD" = "1" ]; then
  echo "${green}${bold}🚀 LIVE.${reset} ${green}$LIVE_URL is serving commit $SHORT_SHA.${reset}"
  echo "   If your phone still shows an old version: hard-refresh, or purge cache —"
  echo "   Cloudflare Dashboard → evermorelife.org → Caching → Purge Everything."
else
  echo "${yellow}${bold}Deployed, but a route wasn't 200 yet.${reset}"
  echo "   Wait ~30s and reload. If it persists, purge cache —"
  echo "   Cloudflare Dashboard → evermorelife.org → Caching → Purge Everything."
fi
