# Deploy sheet — 2026-07-02 "bow" pass

Run these in order, in YOUR Terminal (not the AI sandbox), from the repo root:

```bash
cd ~/Desktop/EVERMORE-LIFE
```

Every code block below is safe to paste as-is. Nothing deploys until step 3.

## 1. Commit the work, one lane at a time

Check what changed first (optional but good habit):

```bash
git status
```

**Lane 1 — Agent Suite (API + pages):**

```bash
git add 01_website/agent-suite-api/cloudflare/worker.js agent-suite-auth.js clients/index.html team/index.html score-tracker/index.html growth-calculator/index.html
git commit -m "Agent Suite: intake dedupe + agency scoping + escape client data in all pages"
```

**Lane 2 — Intake app (live-proxy asset):**

```bash
git add 01_website/experiments/Client-Intake.html
git commit -m "Intake: recover from stale serverId (PUT 404 -> relink via deduped re-POST)"
```

**Lane 3 — Tools:**

```bash
git add 04_tools/cockpit_update/push_cockpit_brief.sh
git commit -m "Cockpit: rewrite brief push for v7 schema with verified writes"
```

**Lane 4 — Blueprints:**

```bash
git add BLUEPRINTS/DECISIONS.md BLUEPRINTS/OVERLAPS.md BLUEPRINTS/reports/2026-07-02_final-polish-bow.md DEPLOY_TODAY_2026-07-02.md
git commit -m "Blueprints: bow-pass report, decision, overlap; dedupe/order docs"
```

**Push everything:**

```bash
git push origin main
```

## 2. Deploy the two Workers

```bash
npx wrangler deploy --config 01_website/agent-suite-api/cloudflare/wrangler.agent-suite-api.jsonc
npx wrangler deploy --config 01_website/v2/cloudflare/wrangler.live-proxy.jsonc
```

## 3. Publish the static site

(This also finally publishes the new /login and /signup pages from the last
session — they've been sitting on GitHub unpublished.)

```bash
./deploy.sh
```

## 4. Route sweep — all of these should load (no 404s)

Open in a browser or run:

```bash
for r in / /login/ /signup/ /clients/ /team/ /score-tracker/ /growth-calculator/ /intake /intake.webmanifest /intake-sw.js /intake-icon.svg /arizona /texas /arkansas /recruiting /sarah /dashboard /optin /privacy /terms; do echo -n "$r -> "; curl -s -o /dev/null -w "%{http_code}\n" "https://evermorelife.org$r"; done
```

(/dashboard may show 302/401 — that's the login gate, that's fine.)

## 5. ONE-TIME FIX — unblock the cockpit auto-planner (4 blocked runs so far)

The morning PLANNER hasn't been able to update your dashboard since June 25
because this file is missing. Create it once (replace YOUR-REAL-CODE with the
dashboard password — the `DASHBOARD_PASSWORD` value from your locked note /
Cloudflare secret):

```bash
cat > 04_tools/cockpit_update/cockpit_update.config.json << 'EOF'
{
  "base_url": "https://evermorelife.org",
  "dashboard_url": "https://evermorelife.org/dashboard",
  "access_code": "YOUR-REAL-CODE"
}
EOF
```

This file is gitignored — it stays on your machine only. Then test it:

```bash
./04_tools/cockpit_update/push_cockpit_brief.sh "Today: bow pass deployed. Done: dedupe, scoping, XSS fixes, cockpit script. Next: e2e intake test. Blockers: none."
```

You should see: `OK — dashboard brief updated and verified live.`
If it fails it will now tell you exactly why (the old version lied).

## 6. End-to-end intake test (2 minutes)

1. Log in at evermorelife.org/login, open /intake, unlock your vault.
2. Save a test client with a phone number → open /clients → it appears once.
3. The dedupe test: in the intake tab, open DevTools → Application →
   Local Storage → delete `evermore_vault_v1`... actually simpler: just edit
   the same client and save again a few times → /clients should STILL show
   exactly one card, never two.

## 7. Optional cleanup

The merged branch can go:

```bash
git push origin --delete agent-suite-overhaul
git branch -d agent-suite-overhaul
```
