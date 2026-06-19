#!/usr/bin/env bash
# Publishes the recruiting page + footer link + Arkansas activation.
# Safe: deploys the WORKER from a temp checkout of the prepared branch,
# so your current working tree is never touched.
set -euo pipefail

REPO="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO"
BR="recruiting-arkansas-live"

# Clear a stale, EMPTY index.lock if one was left behind (safe: only if 0 bytes).
if [ -f .git/index.lock ] && [ ! -s .git/index.lock ]; then
  rm -f .git/index.lock && echo "(cleared stale empty .git/index.lock)"
fi

echo "==> Fetching latest from origin..."
git fetch origin --quiet

echo "==> Verifying '$BR' fast-forwards cleanly over origin/main..."
if ! git rev-parse --verify --quiet "$BR" >/dev/null; then
  echo "ERROR: branch '$BR' not found. It was prepared in this repo by Claude." >&2
  exit 1
fi
if ! git merge-base --is-ancestor origin/main "$BR"; then
  echo "ERROR: '$BR' is not a fast-forward over origin/main. Stop and review." >&2
  exit 1
fi
echo "    OK. Files to publish:"
git --no-pager diff --stat origin/main "$BR"

echo
echo "==> [1/2] Deploying Cloudflare Worker (adds /recruiting route; keeps AZ/TX/AR)..."
TMP="$(mktemp -d)"
cleanup() { git worktree remove --force "$TMP" >/dev/null 2>&1 || true; }
trap cleanup EXIT
git worktree add --quiet "$TMP" "$BR"
( cd "$TMP/01_website/v2/cloudflare" && npx --yes wrangler deploy --config wrangler.live-proxy.jsonc )
cleanup; trap - EXIT

echo
echo "==> [2/2] Publishing static site (push to main -> Pages build)..."
git push origin "$BR:main"

echo
echo "==> Deploy submitted. Cloudflare Pages build takes ~1-2 minutes."
echo "    Verify (wait ~2 min, then run):"
echo "      curl -s -o /dev/null -w 'recruiting: %{http_code}\n' https://evermorelife.org/recruiting"
echo "      curl -s https://evermorelife.org/arkansas | grep -o 'Now serving Arkansas'"
echo "      curl -s https://evermorelife.org/ | grep -o 'Work With Us'"
