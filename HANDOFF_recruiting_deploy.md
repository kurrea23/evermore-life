# Handoff → Claude Code: Deploy recruiting page + footer link + Arkansas

**Goal:** Take the already-prepared, verified commit live. Recruiting page at `/recruiting`,
"Work With Us" footer link, and Arkansas activation. Nothing left to build — only deploy + verify.

## Current state (already done)
- A clean branch **`recruiting-arkansas-live`** exists in this repo: exactly **1 fast-forward commit
  over `origin/main`**, 16 files, no unrelated changes.
- Commit summary: add `/recruiting` page; worker `/recruiting` route added **on top of** existing
  AZ/TX/AR state routes; "Work With Us" → `/recruiting` footer link on all public pages + AZ/TX/AR;
  Arkansas flipped to active ("Now serving Arkansas", active intake); `/recruiting` added to root + v2 sitemap.
- Verified: AZ/TX pages and their animations are NOT regressed; worker keeps all state routes;
  recruiting page is `index,follow` with no `#TODO` links; FF over origin/main; objects intact.
- The working tree (branch `feature/activate-arkansas`) was intentionally left untouched.

## Architecture (why two deploys)
- Static site = Cloudflare **Pages** project `evermore-life`, git-integrated to `main`
  (pushing to `main` triggers the Pages build — confirmed: origin/main's latest commit is already live).
- The apex is a Cloudflare **Worker** `evermore-life-live` (`wrangler` config:
  `01_website/v2/cloudflare/wrangler.live-proxy.jsonc`) that proxies to `evermore-life.pages.dev`
  and maps clean URLs. `/recruiting` needs the Worker route, so the Worker must be redeployed too.

## ⚠️ Critical gotcha
`wrangler deploy` reads the worker file **from disk**. The working-tree worker
(`feature/activate-arkansas`) is an OLDER version **missing the AZ/TX/AR routes** — deploying it
would break the live state pages. **Deploy the worker from the `recruiting-arkansas-live` branch,
not the working tree.** The provided script does this via a temp `git worktree`.

## Do this
Preferred — run the prepared script (handles worker-from-branch + push + verify hints):
```
bash ./DEPLOY_recruiting.sh
```

Or do it manually:
```
git fetch origin
git merge-base --is-ancestor origin/main recruiting-arkansas-live   # must be true (FF)
# 1) Worker, from the branch (NOT working tree):
TMP=$(mktemp -d); git worktree add "$TMP" recruiting-arkansas-live
( cd "$TMP/01_website/v2/cloudflare" && npx --yes wrangler deploy --config wrangler.live-proxy.jsonc )
git worktree remove --force "$TMP"
# 2) Static site:
git push origin recruiting-arkansas-live:main
```
If wrangler isn't authenticated, run `npx wrangler login` first.

## Verify (wait ~1–2 min for Pages build)
```
curl -s -o /dev/null -w 'recruiting: %{http_code}\n' https://evermorelife.org/recruiting   # 200
curl -s https://evermorelife.org/ | grep -o 'Work With Us'                                  # match
curl -s https://evermorelife.org/arkansas | grep -o 'Now serving Arkansas'                  # match
curl -s -o /dev/null -w 'AZ: %{http_code}\n' https://evermorelife.org/arizona               # 200 (unchanged)
curl -s https://evermorelife.org/sitemap.xml | grep -o '/recruiting'                        # match
```

## Notes / cleanup
- A stale empty `.git/index.lock` may exist (left by the prep environment). Safe to delete:
  `rm -f .git/index.lock` (the script does this only if it's 0 bytes).
- A stale worktree/branch `publish/recruiting-live` from an earlier attempt may exist; harmless.
  Remove with `git worktree prune && git branch -D publish/recruiting-live` if desired.
- Activated Arkansas page was generated from a slightly older template — functionally complete,
  cosmetically a touch behind AZ/TX. Fine to polish later (e.g., when adding the US map feature).
- Deliberately EXCLUDED two unrelated working-tree changes: a Corebridge removal (origin/main
  just added it) and an unreviewed booking widget on thank-you.html.
