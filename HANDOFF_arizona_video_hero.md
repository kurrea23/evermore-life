# Handoff → Claude Code: Restore Arizona video hero (desktop) + clean photo (mobile)

## Goal
The Arizona state page (`/arizona/`) should look like its original design:
- **Desktop:** the desert **background video** plays (the look we like — see reference screenshot).
- **Mobile:** a **clear desert photo** background (no dark wash), matching Texas/Arkansas.

Do **not** remove the video. Do **not** change the Texas or Arkansas pages.

---

## Current live state (context)
- The site is fronted by a Cloudflare **Worker** `evermore-life-live`
  - config: `01_website/v2/cloudflare/wrangler.live-proxy.jsonc`
  - source: `01_website/v2/cloudflare/evermore-live-proxy.js`
  - It proxies to the Cloudflare **Pages** project `evermore-life` (`evermore-life.pages.dev`), which is **git-integrated to `main`** (pushing to `main` triggers the Pages rebuild).
  - Currently deployed worker version: `50689fa7-...` — a UNIFIED worker that serves `/intake`, the state pages (`/arizona` `/texas` `/arkansas`), and `/recruiting`. **Do not redeploy an older worker file over it.**
- State pages are served from Pages at `/01_website/state-pages/public/<state>/` and exposed at clean URLs via the worker's `PUBLIC_ROUTES` map.
- Assets confirmed present on `main`:
  - `01_website/state-pages/public/assets/hero-arizona.jpg` (211 KB)
  - `01_website/state-pages/public/assets/hero-arizona.mp4` (3.1 MB)
  - `01_website/state-pages/public/assets/state-pages.css`

---

## Root cause (confirmed)
Arizona's hero (`01_website/state-pages/public/arizona/index.html`, ~lines 38–42):
```html
<section class="hero" style="background-image: linear-gradient(...), url('../assets/hero-arizona.jpg'); ...">
  <video class="hero-bg" autoplay muted playsinline preload="metadata" poster="../assets/hero-arizona.jpg">
    <source src="../assets/hero-arizona.mp4" type="video/mp4" />
  </video>
  <div class="hero-veil" aria-hidden="true"></div>
  ...
```
The worker's `rewriteHtml()` (in `evermore-live-proxy.js`) runs find-and-replace on the proxied HTML. The relevant lines:
- ✅ `.replaceAll("url('../assets/hero-", "url('/01_website/state-pages/public/assets/hero-")` → the **section background** desert jpg loads correctly.
- ❌ `.replaceAll('src="../assets/', 'src="/01_website/v2/assets/')` → rewrites the **video `src`** to `/01_website/v2/assets/hero-arizona.mp4`, a **wrong path → 404**. The video never loads.
- ❌ **No rule** rewrites `poster="../assets/..."`, so the poster also resolves to `/assets/...` on the clean `/arizona/` URL → **404**.

Result: an empty/black `.hero-bg` video element (`position:absolute; inset:0; object-fit:cover; z-index:0`) covers the hero, with the `.hero-veil` dark gradient on top → dark page. On mobile, `state-pages.css` already has `@media (max-width:768px){ .hero-bg{ display:none } }`, so the dark there comes from the section gradient + `.hero-veil` stacked over the desert photo.

Note: `.hero-veil` exists **only** on the Arizona page (Texas/Arkansas have no veil and no video), so changing `.hero-veil` is Arizona-scoped.

---

## The patch (recommended: page + CSS, no worker change — lowest risk)

### 1) Fix the desktop video — `01_website/state-pages/public/arizona/index.html`
Use **absolute** asset paths so the worker's `src="../assets/"` rewrite can't mangle them.

- Video source:
  - FROM: `<source src="../assets/hero-arizona.mp4" type="video/mp4" />`
  - TO:   `<source src="/01_website/state-pages/public/assets/hero-arizona.mp4" type="video/mp4" />`
- Video poster:
  - FROM: `poster="../assets/hero-arizona.jpg"`
  - TO:   `poster="/01_website/state-pages/public/assets/hero-arizona.jpg"`
- (Optional, for consistency) the section `background-image` url is already rewritten correctly by the worker; you may also make it absolute (`url('/01_website/state-pages/public/assets/hero-arizona.jpg')`) so it never depends on the rewrite.

Why absolute works: a request to `/01_website/state-pages/public/assets/hero-arizona.mp4` is not in `PUBLIC_ROUTES`, so the worker proxies it straight to Pages at the same path, where the file exists → 200.

### 2) Clear desert on mobile — `01_website/state-pages/public/assets/state-pages.css`
In the existing mobile media query that already contains `.hero-bg { display: none; }` (~line 426), add:
```css
.hero-veil { display: none; }
```
This removes the extra dark overlay on phones. Since the video is already hidden on mobile and `.hero-veil` is Arizona-only, mobile Arizona then shows the section's desert photo + base gradient — clean, like Texas/Arkansas. Desktop is unchanged (video + veil remain).

### Acceptance
- Desktop `/arizona/`: desert video plays; hero matches the reference screenshot.
- Mobile `/arizona/`: desert photo is clearly visible (no dark wash); reads like `/texas/` and `/arkansas/`.
- `/texas/` and `/arkansas/` unchanged.
- DevTools → Network on `/arizona/`: `hero-arizona.mp4` and `hero-arizona.jpg` return **200** (not 404, not under `/01_website/v2/assets/`).

---

## Alternative (central) fix — only if you want it fixed for all state pages
Instead of editing the page, fix `rewriteHtml()` in `01_website/v2/cloudflare/evermore-live-proxy.js`. **Before** the generic `.replaceAll('src="../assets/', 'src="/01_website/v2/assets/')` line, add (order matters):
```js
.replaceAll('src="../assets/hero-', 'src="/01_website/state-pages/public/assets/hero-')
.replaceAll('poster="../assets/hero-', 'poster="/01_website/state-pages/public/assets/hero-')
```
Then redeploy the worker:
```
npx wrangler@3 deploy --config 01_website/v2/cloudflare/wrangler.live-proxy.jsonc
```
⚠️ This is the shared UNIFIED worker (intake + states + recruiting, v50689fa7). Higher blast radius — back up `evermore-live-proxy.js` first and re-verify intake + all routes after. The page-level fix above is preferred unless a central fix is explicitly wanted.

---

## How to deploy the page/CSS fix
The Pages site rebuilds from `main`, so the change must land on `main`.

⚠️ **Repo state:** the working tree on this machine is on a branch like `my-work-backup-*` with heavy uncommitted divergence from `main`. **Do not commit that working tree to main.** Make the edit in an isolated temp worktree of `origin/main`:
```bash
cd ~/Desktop/EVERMORE-LIFE
git fetch origin
TMP="$(mktemp -d)"
git worktree add --detach "$TMP" origin/main
# edit:
#   $TMP/01_website/state-pages/public/arizona/index.html   (absolute video src + poster)
#   $TMP/01_website/state-pages/public/assets/state-pages.css (.hero-veil display:none in mobile query)
cd "$TMP"
git add 01_website/state-pages/public/arizona/index.html 01_website/state-pages/public/assets/state-pages.css
git commit -m "Arizona hero: absolute video/poster paths + hide veil on mobile"
git push origin HEAD:main
cd ~/Desktop/EVERMORE-LIFE && git worktree remove --force "$TMP"
```
Pages rebuilds in ~1–2 min, then verify.

⚠️ **GitHub auth:** pushing to `main` needs credentials. The account currently has **no cached git credentials** (a `Username for https://github.com` prompt appeared and GitHub no longer accepts passwords). Set up auth first — either a Personal Access Token (use as the password, username `kurrea23`) or `gh auth login` (browser-based). Repo: `https://github.com/kurrea23/evermore-life.git`.

## Environment notes
- Node on this machine is **v19** → use `npx wrangler@3` (wrangler v4 requires Node 22).
- Backups of the worker file exist as `evermore-live-proxy.js.OLD-*` in `01_website/v2/cloudflare/`.
- Reference screenshot of the desired desktop look was provided by the user (desert + cacti + navy gradient, "NOW SERVING ARIZONA" pill).
