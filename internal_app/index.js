// ============================================================
//  EVERMORE LIFE — Internal Dashboard Worker
//  Deploy: npx wrangler deploy
// ============================================================

// ── CONFIG (change these at the top) ────────────────────────
const PASSWORD      = "EvermoreLife2026!";
const SESSION_TOKEN = "el_session_tok_8f3kQ9mZ2pX";
const COOKIE_NAME   = "el_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// ── ROUTER ──────────────────────────────────────────────────
export default {
  async fetch(request) {
    const url      = new URL(request.url);
    const path     = url.pathname;
    const method   = request.method;
    const authed   = isAuthenticated(request);

    if (path === "/login" && method === "GET")  return serveLogin();
    if (path === "/login" && method === "POST") return handleLogin(request);
    if (path === "/logout")                     return handleLogout();
    if (path === "/" || path === "")            return authed
                                                  ? Response.redirect(new URL("/dashboard", request.url).href, 302)
                                                  : Response.redirect(new URL("/login", request.url).href, 302);
    if (path === "/dashboard") {
      if (!authed) return Response.redirect(new URL("/login", request.url).href, 302);
      return serveDashboard();
    }
    return new Response("Not found", { status: 404 });
  }
};

// ── AUTH HELPERS ─────────────────────────────────────────────
function isAuthenticated(request) {
  const cookie = request.headers.get("Cookie") || "";
  return cookie.split(";").some(c => c.trim() === `${COOKIE_NAME}=${SESSION_TOKEN}`);
}

async function handleLogin(request) {
  const body     = await request.formData();
  const password = body.get("password") || "";
  if (password === PASSWORD) {
    return new Response(null, {
      status: 302,
      headers: {
        "Location":   "/dashboard",
        "Set-Cookie": `${COOKIE_NAME}=${SESSION_TOKEN}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${COOKIE_MAX_AGE}`
      }
    });
  }
  return serveLogin("Incorrect password. Please try again.");
}

function handleLogout() {
  return new Response(null, {
    status: 302,
    headers: {
      "Location":   "/login",
      "Set-Cookie": `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`
    }
  });
}

// ── HTML HELPERS ─────────────────────────────────────────────
function html(body) {
  return new Response(body, { headers: { "Content-Type": "text/html;charset=UTF-8" } });
}

// ════════════════════════════════════════════════════════════
//  LOGIN PAGE
// ════════════════════════════════════════════════════════════
function serveLogin(errorMsg = "") {
  return html(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Evermore Life — Login</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy:  #0d1f2d;
    --navy2: #122436;
    --gold:  #c9a84c;
    --cream: #f5f0e8;
    --muted: rgba(245,240,232,0.45);
  }
  html, body {
    height: 100%; background: var(--navy);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Inter', sans-serif;
  }
  .wrap {
    width: 100%; max-width: 380px; padding: 0 28px;
    display: flex; flex-direction: column; align-items: center; gap: 0;
  }
  .logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.6rem; font-weight: 300; letter-spacing: 0.18em;
    color: var(--gold); text-transform: uppercase;
    margin-bottom: 4px; text-align: center;
  }
  .logo span { font-style: italic; font-weight: 400; }
  .tagline {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem; font-style: italic; font-weight: 300;
    color: var(--muted); letter-spacing: 0.06em;
    margin-bottom: 52px; text-align: center;
  }
  .divider {
    width: 48px; height: 1px; background: var(--gold);
    opacity: 0.35; margin-bottom: 52px;
  }
  form { width: 100%; display: flex; flex-direction: column; gap: 14px; }
  .field-label {
    font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 6px;
  }
  input[type=password] {
    width: 100%; background: rgba(255,255,255,0.05);
    border: 1px solid rgba(201,168,76,0.3);
    color: var(--cream); font-family: 'Inter', sans-serif;
    font-size: 1rem; padding: 14px 18px; border-radius: 6px;
    outline: none; transition: border-color 0.2s;
    -webkit-appearance: none;
  }
  input[type=password]:focus { border-color: var(--gold); }
  input[type=password]::placeholder { color: rgba(245,240,232,0.25); }
  .btn {
    width: 100%; padding: 15px; background: var(--gold);
    color: #0d1f2d; font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem; font-weight: 600; letter-spacing: 0.18em;
    text-transform: uppercase; border: none; border-radius: 6px;
    cursor: pointer; transition: opacity 0.2s; margin-top: 6px;
  }
  .btn:active { opacity: 0.8; }
  .error {
    color: #e07070; font-size: 0.82rem; text-align: center;
    letter-spacing: 0.04em; min-height: 18px;
  }
  .footer {
    margin-top: 60px; font-size: 0.65rem; letter-spacing: 0.12em;
    text-transform: uppercase; color: rgba(245,240,232,0.18);
    text-align: center;
  }
</style>
</head>
<body>
<div class="wrap">
  <div class="logo">Evermore<span>Life</span></div>
  <div class="tagline">"Your legacy doesn't end. It grows."</div>
  <div class="divider"></div>
  <form method="POST" action="/login">
    <div>
      <div class="field-label">Access Code</div>
      <input type="password" name="password" placeholder="Enter password" autofocus autocomplete="current-password">
    </div>
    <button class="btn" type="submit">Enter</button>
    <div class="error">${errorMsg}</div>
  </form>
  <div class="footer">Evermore Life &nbsp;·&nbsp; Internal Systems &nbsp;·&nbsp; Confidential</div>
</div>
</body>
</html>`);
}

// ════════════════════════════════════════════════════════════
//  MAIN DASHBOARD
// ════════════════════════════════════════════════════════════
function serveDashboard() {
  return html(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Evermore Life — Dashboard</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
/* ── RESET & TOKENS ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
:root {
  --navy:    #0d1f2d;
  --navy2:   #122436;
  --navy3:   #162c40;
  --gold:    #c9a84c;
  --gold2:   #e8c97a;
  --violet:  #7b5ea7;
  --violet2: #a07fd4;
  --cream:   #f5f0e8;
  --muted:   rgba(245,240,232,0.55);
  --muted2:  rgba(245,240,232,0.28);
  --green:   #4caf7d;
  --amber:   #e8a03c;
  --red:     #e05555;
  --card-bg: rgba(255,255,255,0.04);
  --card-border: rgba(201,168,76,0.14);
  --tab-h:   64px;
}
html, body { height: 100%; background: var(--navy); color: var(--cream); font-family: 'Inter', sans-serif; overflow: hidden; }
body { display: flex; flex-direction: column; }

/* ── SCROLLABLE CONTENT ── */
#app {
  flex: 1; overflow-y: auto; overflow-x: hidden;
  padding-bottom: calc(var(--tab-h) + env(safe-area-inset-bottom) + 12px);
  -webkit-overflow-scrolling: touch;
}

/* ── TABS ── */
.tab-pane { display: none; padding: 0 0 8px 0; animation: fadeIn 0.22s ease; }
.tab-pane.active { display: block; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

/* ── BOTTOM NAV ── */
.bottom-nav {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
  background: rgba(13,31,45,0.97); backdrop-filter: blur(16px);
  border-top: 1px solid rgba(201,168,76,0.18);
  display: flex; align-items: stretch;
  height: calc(var(--tab-h) + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
}
.nav-tab {
  flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 3px; cursor: pointer; transition: opacity 0.15s;
  background: none; border: none; color: var(--muted2); padding: 0;
}
.nav-tab.active { color: var(--gold); }
.nav-tab .tab-icon { font-size: 1.3rem; line-height: 1; }
.nav-tab .tab-label { font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500; }

/* ── SECTION HEADER ── */
.page-header {
  padding: 56px 20px 20px;
  display: flex; align-items: center; justify-content: space-between;
}
.page-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.7rem; font-weight: 600; letter-spacing: 0.1em;
  color: var(--gold);
}
.page-subtitle { font-size: 0.7rem; color: var(--muted2); letter-spacing: 0.12em; text-transform: uppercase; margin-top: 2px; }

/* ── CARDS ── */
.card {
  background: var(--card-bg); border: 1px solid var(--card-border);
  border-radius: 12px; padding: 16px;
}
.section-label {
  font-size: 0.62rem; letter-spacing: 0.15em; text-transform: uppercase;
  color: var(--muted2); margin-bottom: 10px; padding: 0 20px;
}

/* ── STATUS BADGE ── */
.badge { display: inline-flex; align-items: center; gap: 5px; font-size: 0.7rem; font-weight: 500; padding: 3px 9px; border-radius: 20px; letter-spacing: 0.04em; }
.badge-green  { background: rgba(76,175,125,0.15); color: var(--green); }
.badge-amber  { background: rgba(232,160,60,0.15);  color: var(--amber); }
.badge-red    { background: rgba(224,85,85,0.15);   color: var(--red); }
.badge-violet { background: rgba(123,94,167,0.15);  color: var(--violet2); }

/* ── PULSE DOT ── */
.pulse-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.pulse-green  { background: var(--green);  animation: pulse 1.6s infinite; }
.pulse-amber  { background: var(--amber);  animation: pulse 2.2s infinite; }
.pulse-red    { background: var(--red); }
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.55; transform: scale(0.75); }
}

/* ── METRIC CHIP (tap to increment) ── */
.metric-chip {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  background: var(--card-bg); border: 1px solid var(--card-border);
  border-radius: 10px; padding: 12px 8px; cursor: pointer;
  transition: background 0.15s, transform 0.1s; user-select: none;
  flex: 1;
}
.metric-chip:active { background: rgba(201,168,76,0.1); transform: scale(0.95); }
.metric-val { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 600; color: var(--gold); line-height: 1; }
.metric-lbl { font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted2); text-align: center; }

/* ── PROGRESS BAR ── */
.progress-track { height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; margin-top: 10px; }
.progress-fill  { height: 100%; border-radius: 2px; background: var(--gold); transition: width 0.4s; }

/* ── MODALS ── */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.65); z-index: 200;
  display: none; align-items: flex-end; justify-content: center;
}
.modal-overlay.open { display: flex; }
.modal-sheet {
  width: 100%; max-width: 500px; background: var(--navy2);
  border-top-left-radius: 20px; border-top-right-radius: 20px;
  padding: 20px 20px calc(20px + env(safe-area-inset-bottom));
  border-top: 1px solid var(--card-border);
  animation: slideUp 0.22s ease;
}
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.modal-handle { width: 36px; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; margin: 0 auto 16px; }
.modal-title { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 600; color: var(--gold); margin-bottom: 12px; }
textarea.modal-input {
  width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,168,76,0.25);
  color: var(--cream); font-family: 'Inter', sans-serif; font-size: 0.9rem;
  padding: 12px; border-radius: 8px; resize: none; outline: none; height: 100px;
}
.modal-btn-row { display: flex; gap: 10px; margin-top: 12px; }
.btn-primary {
  flex: 1; padding: 13px; background: var(--gold); color: #0d1f2d;
  border: none; border-radius: 8px; font-weight: 600; font-size: 0.85rem;
  letter-spacing: 0.08em; cursor: pointer; text-transform: uppercase;
}
.btn-secondary {
  padding: 13px 18px; background: transparent; color: var(--muted);
  border: 1px solid rgba(255,255,255,0.12); border-radius: 8px;
  font-size: 0.85rem; cursor: pointer;
}

/* ── COLLAPSIBLE ── */
.collapsible-header {
  display: flex; align-items: center; justify-content: space-between;
  cursor: pointer; padding: 12px 0; user-select: none;
}
.collapsible-body { display: none; padding-top: 8px; }
.collapsible-body.open { display: block; }
.chevron { transition: transform 0.2s; display: inline-block; color: var(--muted2); }
.chevron.open { transform: rotate(90deg); }

/* ── STORY CARDS ── */
.story-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.story-card {
  background: var(--card-bg); border: 1px solid var(--card-border);
  border-radius: 10px; padding: 12px; cursor: pointer; transition: border-color 0.15s;
}
.story-card:hover { border-color: rgba(201,168,76,0.4); }
.story-emoji { font-size: 1.5rem; margin-bottom: 6px; }
.story-title { font-size: 0.78rem; font-weight: 500; color: var(--cream); margin-bottom: 4px; }
.story-sub { font-size: 0.65rem; color: var(--muted2); }

/* ── FUNNEL FLOW ── */
.funnel-flow { display: flex; flex-direction: column; gap: 0; }
.funnel-step {
  display: flex; align-items: center; gap: 10px;
  background: var(--card-bg); border: 1px solid var(--card-border);
  border-radius: 8px; padding: 10px 14px; font-size: 0.8rem;
  color: var(--cream);
}
.funnel-arrow { color: var(--gold); font-size: 0.7rem; text-align: center; padding: 2px 0; opacity: 0.5; }
.funnel-icon { font-size: 1rem; min-width: 20px; }

/* ── TOOL PILLS ── */
.tool-row { display: flex; flex-wrap: wrap; gap: 8px; }
.tool-pill {
  background: rgba(123,94,167,0.15); border: 1px solid rgba(123,94,167,0.3);
  color: var(--violet2); border-radius: 20px; padding: 5px 12px;
  font-size: 0.72rem; font-weight: 500; letter-spacing: 0.04em;
}

/* ── ICP PATHS ── */
.icp-card {
  border-radius: 10px; padding: 14px; margin-bottom: 10px;
}
.icp-gold   { background: rgba(201,168,76,0.08);  border: 1px solid rgba(201,168,76,0.3); }
.icp-cream  { background: rgba(245,240,232,0.06); border: 1px solid rgba(245,240,232,0.2); }
.icp-title  { font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-weight: 600; margin-bottom: 6px; }
.icp-detail { font-size: 0.75rem; color: var(--muted); line-height: 1.5; }

/* ── LOOP DIAGRAM ── */
.loop-container { position: relative; width: 100%; height: 180px; margin: 8px 0; }
.loop-ring {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
  border-radius: 50%; border: 2px solid;
  animation: spin 18s linear infinite;
}
.loop-ring-gold   { width: 150px; height: 150px; border-color: rgba(201,168,76,0.4); animation-duration: 22s; }
.loop-ring-violet { width: 150px; height: 150px; border-color: rgba(123,94,167,0.4); animation-duration: 18s; animation-direction: reverse; }
@keyframes spin { to { transform: translate(-50%,-50%) rotate(360deg); } }
.loop-node {
  position: absolute; width: 64px; height: 64px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
  background: var(--navy2); border-radius: 50%;
  font-size: 0.55rem; font-weight: 600; text-align: center; letter-spacing: 0.06em;
  text-transform: uppercase; line-height: 1.2;
  border: 1.5px solid;
}
.loop-node-gold   { border-color: rgba(201,168,76,0.5); color: var(--gold); }
.loop-node-violet { border-color: rgba(123,94,167,0.5); color: var(--violet2); }
.loop-label { font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-weight: 600; text-align: center; margin-bottom: 4px; }

/* ── PROJECT CARDS ── */
.project-card {
  background: var(--card-bg); border: 1px solid var(--card-border);
  border-radius: 12px; padding: 16px; margin-bottom: 12px;
}
.project-name { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-weight: 600; letter-spacing: 0.08em; color: var(--cream); margin-bottom: 8px; }
.next-action { font-size: 0.75rem; color: var(--muted); padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
.next-action:last-of-type { border-bottom: none; }
.next-action::before { content: "→ "; color: var(--gold); }

/* ── CALENDAR ── */
.week-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 0; cursor: pointer;
}
.week-tag {
  font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase;
  background: rgba(201,168,76,0.1); color: var(--gold);
  border-radius: 4px; padding: 2px 8px;
}
.cal-item { padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
.cal-item:last-child { border-bottom: none; }
.cal-day { font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold); margin-bottom: 2px; }
.cal-desc { font-size: 0.8rem; color: var(--cream); }
.cal-sub { font-size: 0.68rem; color: var(--muted2); margin-top: 2px; }

/* ── ACTIVITY FEED ── */
.feed-item { display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
.feed-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
.feed-dot-gold { background: var(--gold); }
.feed-dot-green { background: var(--green); }
.feed-dot-violet { background: var(--violet); }
.feed-text { font-size: 0.78rem; color: var(--cream); }
.feed-time { font-size: 0.62rem; color: var(--muted2); margin-top: 2px; }

/* ── INBOX ITEMS ── */
.inbox-item {
  background: rgba(201,168,76,0.07); border-left: 3px solid var(--gold);
  border-radius: 0 8px 8px 0; padding: 10px 12px; margin-bottom: 8px; font-size: 0.82rem;
  color: var(--cream); display: flex; justify-content: space-between; align-items: flex-start;
}
.inbox-del { background: none; border: none; color: var(--muted2); cursor: pointer; font-size: 0.9rem; padding: 0 2px; flex-shrink: 0; }

/* ── LOGOUT ── */
.logout-link { font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted2); text-decoration: none; }
.logout-link:active { color: var(--cream); }

/* ── UTILITY ── */
.px { padding-left: 20px; padding-right: 20px; }
.mb8  { margin-bottom: 8px; }
.mb12 { margin-bottom: 12px; }
.mb20 { margin-bottom: 20px; }
.mt4  { margin-top: 4px; }
.row  { display: flex; gap: 10px; }
.col  { display: flex; flex-direction: column; gap: 10px; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.text-gold    { color: var(--gold); }
.text-green   { color: var(--green); }
.text-amber   { color: var(--amber); }
.text-violet  { color: var(--violet2); }
.text-muted   { color: var(--muted2); }
.font-serif   { font-family: 'Cormorant Garamond', serif; }
.text-sm      { font-size: 0.8rem; }
.text-xs      { font-size: 0.7rem; }
.fw6          { font-weight: 600; }
.uppercase    { text-transform: uppercase; letter-spacing: 0.08em; }
.divider-line { height: 1px; background: rgba(255,255,255,0.06); margin: 16px 0; }
</style>
</head>
<body>
<div id="app">

<!-- ══════════════════ HOME TAB ══════════════════ -->
<div class="tab-pane active" id="tab-home">
  <div class="page-header px">
    <div>
      <div class="page-title">EVERMORE LIFE</div>
      <div class="page-subtitle">Internal Operations &nbsp; <span style="display:inline-flex;align-items:center;gap:5px;"><span class="pulse-dot pulse-amber"></span> System Active</span></div>
    </div>
    <a href="/logout" class="logout-link">Log out</a>
  </div>

  <!-- Status grid -->
  <div class="section-label px">System Status</div>
  <div class="grid2 px mb20">
    <div class="card" style="grid-column: span 1">
      <div class="text-xs text-muted uppercase mb8">Funnel</div>
      <span class="badge badge-amber"><span class="pulse-dot pulse-amber"></span> In Progress</span>
    </div>
    <div class="card">
      <div class="text-xs text-muted uppercase mb8">Campaign</div>
      <span class="badge badge-amber"><span class="pulse-dot pulse-amber"></span> In Production</span>
    </div>
    <div class="card">
      <div class="text-xs text-muted uppercase mb8">Sarah AI</div>
      <span class="badge badge-green"><span class="pulse-dot pulse-green"></span> Live</span>
    </div>
    <div class="card">
      <div class="text-xs text-muted uppercase mb8">A2P SMS</div>
      <span class="badge badge-red"><span class="pulse-dot pulse-red" style="background:var(--red)"></span> Pending</span>
    </div>
  </div>

  <!-- Quick Metrics -->
  <div class="section-label px">Today's Metrics &nbsp;<span style="font-size:0.55rem;color:var(--muted2)">(tap to increment)</span></div>
  <div class="row px mb20">
    <div class="metric-chip" onclick="inc('leads')">
      <div class="metric-val" id="m-leads">0</div>
      <div class="metric-lbl">Leads Today</div>
    </div>
    <div class="metric-chip" onclick="inc('appts')">
      <div class="metric-val" id="m-appts">0</div>
      <div class="metric-lbl">Appointments</div>
    </div>
    <div class="metric-chip" onclick="inc('policies')">
      <div class="metric-val" id="m-policies">0</div>
      <div class="metric-lbl">Policies</div>
    </div>
  </div>

  <!-- Quick Action -->
  <div class="section-label px">Quick Actions</div>
  <div class="px mb20">
    <button class="btn-primary" style="width:100%;border-radius:10px;" onclick="openInbox()">＋ Add to Inbox</button>
    <div id="inbox-list" style="margin-top:12px;"></div>
  </div>

  <!-- Activity Feed -->
  <div class="section-label px">Recent Activity</div>
  <div class="px mb20">
    <div class="feed-item">
      <div class="feed-dot feed-dot-green"></div>
      <div>
        <div class="feed-text">Sarah AI responded to lead — Priya M., age 34, Fresno</div>
        <div class="feed-time">Today · 10:42 AM</div>
      </div>
    </div>
    <div class="feed-item">
      <div class="feed-dot feed-dot-gold"></div>
      <div>
        <div class="feed-text">Campaign video exported — "Soccer Dad" hero story (2:14)</div>
        <div class="feed-time">Today · 9:15 AM</div>
      </div>
    </div>
    <div class="feed-item">
      <div class="feed-dot feed-dot-violet"></div>
      <div>
        <div class="feed-text">A2P SMS registration submitted — awaiting carrier approval</div>
        <div class="feed-time">Yesterday · 4:30 PM</div>
      </div>
    </div>
    <div class="feed-item">
      <div class="feed-dot feed-dot-gold"></div>
      <div>
        <div class="feed-text">Funnel landing page draft complete — review needed</div>
        <div class="feed-time">Yesterday · 2:00 PM</div>
      </div>
    </div>
    <div class="feed-item">
      <div class="feed-dot feed-dot-green"></div>
      <div>
        <div class="feed-text">GHL pipeline connected — 3 stages configured</div>
        <div class="feed-time">2 days ago</div>
      </div>
    </div>
  </div>
</div>
<!-- END HOME TAB -->


<!-- ══════════════════ CAMPAIGN TAB ══════════════════ -->
<div class="tab-pane" id="tab-campaign">
  <div class="page-header px">
    <div>
      <div class="page-title" style="font-size:1.4rem">Campaign Cockpit</div>
      <div class="page-subtitle">Evermore Legacy Campaign</div>
    </div>
  </div>

  <!-- Campaign Metrics -->
  <div class="section-label px">Campaign Metrics &nbsp;<span style="font-size:0.55rem;color:var(--muted2)">(tap to increment)</span></div>
  <div class="grid2 px mb20">
    <div class="metric-chip" onclick="inc('c-vids')">
      <div class="metric-val" id="m-c-vids">0</div>
      <div class="metric-lbl">Videos Published</div>
    </div>
    <div class="metric-chip" onclick="inc('c-views')">
      <div class="metric-val" id="m-c-views">0</div>
      <div class="metric-lbl">Total Views</div>
    </div>
    <div class="metric-chip" onclick="inc('c-75')">
      <div class="metric-val" id="m-c-75">0</div>
      <div class="metric-lbl">75%+ Completions</div>
    </div>
    <div class="metric-chip" onclick="inc('c-sessions')">
      <div class="metric-val" id="m-c-sessions">0</div>
      <div class="metric-lbl">Web Sessions</div>
    </div>
    <div class="metric-chip" onclick="inc('c-sarah')">
      <div class="metric-val" id="m-c-sarah">0</div>
      <div class="metric-lbl">Sarah Convos</div>
    </div>
    <div class="metric-chip" onclick="inc('c-appts')">
      <div class="metric-val" id="m-c-appts">0</div>
      <div class="metric-lbl">Appts Set</div>
    </div>
    <div class="metric-chip" onclick="inc('c-sold')" style="grid-column: span 2">
      <div class="metric-val" id="m-c-sold">0</div>
      <div class="metric-lbl">Policies Sold</div>
    </div>
  </div>

  <!-- Story Pipeline -->
  <div class="section-label px">Story Pipeline</div>
  <div class="story-grid px mb20">
    <div class="story-card">
      <div class="story-emoji">⚽</div>
      <div class="story-title">Soccer Dad</div>
      <div class="story-sub">Hero story · In production</div>
      <div class="mt4"><span class="badge badge-amber" style="font-size:0.6rem">In Production</span></div>
    </div>
    <div class="story-card">
      <div class="story-emoji">🌳</div>
      <div class="story-title">Tree &amp; Acorn</div>
      <div class="story-sub">Legacy metaphor · Scripting</div>
      <div class="mt4"><span class="badge badge-amber" style="font-size:0.6rem">Scripting</span></div>
    </div>
    <div class="story-card">
      <div class="story-emoji">👨‍🍳</div>
      <div class="story-title">The Chef</div>
      <div class="story-sub">Provider story · Concept</div>
      <div class="mt4"><span class="badge badge-violet" style="font-size:0.6rem;background:rgba(123,94,167,0.15);color:var(--violet2)">Concept</span></div>
    </div>
    <div class="story-card">
      <div class="story-emoji">🎓</div>
      <div class="story-title">Graduation</div>
      <div class="story-sub">Milestone story · Concept</div>
      <div class="mt4"><span class="badge badge-violet" style="font-size:0.6rem;background:rgba(123,94,167,0.15);color:var(--violet2)">Concept</span></div>
    </div>
    <div class="story-card" style="grid-column: span 2">
      <div class="story-emoji">💍</div>
      <div class="story-title">The Wedding</div>
      <div class="story-sub">Family milestone · Upcoming</div>
      <div class="mt4"><span class="badge badge-red" style="font-size:0.6rem">Upcoming</span></div>
    </div>
  </div>

  <!-- 4-Week Calendar -->
  <div class="section-label px">4-Week Content Calendar</div>
  <div class="px mb20">
    <!-- Week 1 -->
    <div class="card mb8">
      <div class="week-header" onclick="toggleCollapse('wk1')">
        <div>
          <span class="week-tag">Week 1</span>
          <span style="font-size:0.8rem;color:var(--cream);margin-left:10px">Foundation &amp; Launch</span>
        </div>
        <span class="chevron" id="chevron-wk1">›</span>
      </div>
      <div class="collapsible-body" id="wk1">
        <div class="cal-item">
          <div class="cal-day">Mon</div>
          <div class="cal-desc">Drop Soccer Dad hero video (Reels + TikTok)</div>
          <div class="cal-sub">CTA: "Protect what matters" → link in bio</div>
        </div>
        <div class="cal-item">
          <div class="cal-day">Wed</div>
          <div class="cal-desc">Behind-the-scenes: building the campaign</div>
          <div class="cal-sub">IG Story series · 5 slides</div>
        </div>
        <div class="cal-item">
          <div class="cal-day">Fri</div>
          <div class="cal-desc">Tree &amp; Acorn short clip (60s)</div>
          <div class="cal-sub">Metaphor hook → watch for full story</div>
        </div>
        <div class="cal-item">
          <div class="cal-day">Sun</div>
          <div class="cal-desc">Weekly recap Story + poll</div>
          <div class="cal-sub">"Which story resonated most?"</div>
        </div>
      </div>
    </div>
    <!-- Week 2 -->
    <div class="card mb8">
      <div class="week-header" onclick="toggleCollapse('wk2')">
        <div>
          <span class="week-tag">Week 2</span>
          <span style="font-size:0.8rem;color:var(--cream);margin-left:10px">Retargeting &amp; Trust</span>
        </div>
        <span class="chevron" id="chevron-wk2">›</span>
      </div>
      <div class="collapsible-body" id="wk2">
        <div class="cal-item">
          <div class="cal-day">Mon</div>
          <div class="cal-desc">Run retargeting ads to 75%+ viewers</div>
          <div class="cal-sub">Meta Custom Audience · Budget $25/day</div>
        </div>
        <div class="cal-item">
          <div class="cal-day">Tue</div>
          <div class="cal-desc">Chef story drop — short form (45s)</div>
          <div class="cal-sub">Emotion hook: "What if you couldn't provide tomorrow?"</div>
        </div>
        <div class="cal-item">
          <div class="cal-day">Thu</div>
          <div class="cal-desc">Educational carousel: "What is IUL?"</div>
          <div class="cal-sub">5-slide IG post · save-worthy format</div>
        </div>
        <div class="cal-item">
          <div class="cal-day">Sat</div>
          <div class="cal-desc">Social proof post: testimonial format</div>
          <div class="cal-sub">Animated quote card via Canva/CapCut</div>
        </div>
      </div>
    </div>
    <!-- Week 3 -->
    <div class="card mb8">
      <div class="week-header" onclick="toggleCollapse('wk3')">
        <div>
          <span class="week-tag">Week 3</span>
          <span style="font-size:0.8rem;color:var(--cream);margin-left:10px">Conversion Push</span>
        </div>
        <span class="chevron" id="chevron-wk3">›</span>
      </div>
      <div class="collapsible-body" id="wk3">
        <div class="cal-item">
          <div class="cal-day">Mon</div>
          <div class="cal-desc">Graduation story drop (full 90s)</div>
          <div class="cal-sub">YouTube + Reels · milestone emotion</div>
        </div>
        <div class="cal-item">
          <div class="cal-day">Wed</div>
          <div class="cal-desc">Sarah AI intro post — "Meet your guide"</div>
          <div class="cal-sub">Short demo clip of Sarah conversation</div>
        </div>
        <div class="cal-item">
          <div class="cal-day">Fri</div>
          <div class="cal-desc">Landing page CTA push — all channels</div>
          <div class="cal-sub">24-hour urgency window · link in bio</div>
        </div>
        <div class="cal-item">
          <div class="cal-day">Sun</div>
          <div class="cal-desc">Retarget: landing page visitors → appointment</div>
          <div class="cal-sub">Meta conversion objective · $30/day</div>
        </div>
      </div>
    </div>
    <!-- Week 4 -->
    <div class="card">
      <div class="week-header" onclick="toggleCollapse('wk4')">
        <div>
          <span class="week-tag">Week 4</span>
          <span style="font-size:0.8rem;color:var(--cream);margin-left:10px">Close &amp; Scale</span>
        </div>
        <span class="chevron" id="chevron-wk4">›</span>
      </div>
      <div class="collapsible-body" id="wk4">
        <div class="cal-item">
          <div class="cal-day">Mon</div>
          <div class="cal-desc">Wedding story drop (emotional anchor)</div>
          <div class="cal-sub">"Build something they inherit" — hero format</div>
        </div>
        <div class="cal-item">
          <div class="cal-day">Wed</div>
          <div class="cal-desc">Month recap: metrics &amp; proof post</div>
          <div class="cal-sub">Views / conversations / appointments so far</div>
        </div>
        <div class="cal-item">
          <div class="cal-day">Fri</div>
          <div class="cal-desc">Final CTA: "One conversation changes everything"</div>
          <div class="cal-sub">Book with Sarah → direct scheduler link</div>
        </div>
        <div class="cal-item">
          <div class="cal-day">Sun</div>
          <div class="cal-desc">Review &amp; plan Month 2</div>
          <div class="cal-sub">Scale winning content · kill underperforming</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Funnel Flow -->
  <div class="section-label px">Conversion Funnel</div>
  <div class="px mb20">
    <div class="funnel-flow">
      <div class="funnel-step"><span class="funnel-icon">📱</span><span>Short Video (Reels / TikTok / YouTube)</span></div>
      <div class="funnel-arrow">↓ Watch 75%+</div>
      <div class="funnel-step"><span class="funnel-icon">🎯</span><span>Retarget Engaged Viewers</span></div>
      <div class="funnel-arrow">↓</div>
      <div class="funnel-step"><span class="funnel-icon">🎬</span><span>Hero Video (Full Story)</span></div>
      <div class="funnel-arrow">↓</div>
      <div class="funnel-step"><span class="funnel-icon">🌐</span><span>Landing Page (Evermore Life)</span></div>
      <div class="funnel-arrow">↓</div>
      <div class="funnel-step" style="border-color:rgba(201,168,76,0.4)"><span class="funnel-icon">🤖</span><span style="color:var(--gold)">Sarah AI — Qualifies &amp; Nurtures</span></div>
      <div class="funnel-arrow">↓</div>
      <div class="funnel-step"><span class="funnel-icon">📅</span><span>Appointment Set</span></div>
      <div class="funnel-arrow">↓</div>
      <div class="funnel-step" style="border-color:rgba(76,175,125,0.4)"><span class="funnel-icon">✅</span><span style="color:var(--green)">Coverage Issued</span></div>
    </div>
  </div>

  <!-- AI Toolkit -->
  <div class="section-label px">AI &amp; Production Toolkit</div>
  <div class="px mb20">
    <div class="tool-row">
      <div class="tool-pill">Sora / Runway</div>
      <div class="tool-pill">HeyGen</div>
      <div class="tool-pill">ElevenLabs</div>
      <div class="tool-pill">Midjourney</div>
      <div class="tool-pill">CapCut</div>
      <div class="tool-pill">Meta Ads</div>
      <div class="tool-pill">GHL + Sarah</div>
    </div>
  </div>

  <!-- ICP Paths -->
  <div class="section-label px">ICP Audience Paths</div>
  <div class="px mb20">
    <div class="icp-card icp-gold">
      <div class="icp-title text-gold">🛡 Protective Parent</div>
      <div class="icp-detail">Ages 28–42 · Family-first mindset · Earner or dual-income<br>Fear: not being there / not having enough<br>Hook: "What if tomorrow isn't guaranteed?"<br>CTA: Protect them now → Talk to Sarah</div>
    </div>
    <div class="icp-card icp-cream">
      <div class="icp-title" style="color:var(--cream)">💛 Adult Child Planner</div>
      <div class="icp-detail">Ages 24–38 · Aging parent concern · Mid-career earner<br>Fear: burden, loss, regret · Values: family duty, legacy<br>Hook: "Your parents gave everything. Here's how you give back."<br>CTA: Start the conversation → Book a call</div>
    </div>
  </div>
</div>
<!-- END CAMPAIGN TAB -->


<!-- ══════════════════ OS TAB ══════════════════ -->
<div class="tab-pane" id="tab-os">
  <div class="page-header px">
    <div>
      <div class="page-title">Master OS</div>
      <div class="page-subtitle">All Projects · Lucidus Ecosystem</div>
    </div>
  </div>

  <!-- Project Cards -->
  <div class="section-label px">Active Projects</div>
  <div class="px mb20">
    <!-- EVERMORE-LIFE -->
    <div class="project-card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div class="project-name">EVERMORE-LIFE</div>
        <span class="badge badge-amber"><span class="pulse-dot pulse-amber"></span> In Progress</span>
      </div>
      <div class="next-action">Complete A2P SMS registration</div>
      <div class="next-action">Launch campaign funnel landing page</div>
      <div class="progress-track"><div class="progress-fill" style="width:42%"></div></div>
      <div style="font-size:0.6rem;color:var(--muted2);margin-top:4px;text-align:right">42% complete</div>
    </div>

    <!-- LUCIDUS-MEDIA -->
    <div class="project-card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div class="project-name">LUCIDUS-MEDIA</div>
        <span class="badge badge-amber"><span class="pulse-dot pulse-amber"></span> In Progress</span>
      </div>
      <div class="next-action">Host lucidus_media_site.html publicly</div>
      <div class="next-action">DM 5 artists before EDC 2026</div>
      <div class="progress-track"><div class="progress-fill" style="width:28%"></div></div>
      <div style="font-size:0.6rem;color:var(--muted2);margin-top:4px;text-align:right">28% complete</div>
    </div>

    <!-- LUCIDUS-APP -->
    <div class="project-card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div class="project-name">LUCIDUS-APP</div>
        <span class="badge badge-red">🔴 Needs Direction</span>
      </div>
      <div class="next-action">Define core use case &amp; user flow</div>
      <div class="next-action">Review ContentView.swift architecture</div>
      <div class="progress-track"><div class="progress-fill" style="width:12%;background:var(--red)"></div></div>
      <div style="font-size:0.6rem;color:var(--muted2);margin-top:4px;text-align:right">12% complete</div>
    </div>

    <!-- LUCIDUS-BRAND -->
    <div class="project-card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div class="project-name">LUCIDUS-BRAND</div>
        <span class="badge badge-amber"><span class="pulse-dot pulse-amber"></span> In Progress</span>
      </div>
      <div class="next-action">Audit and organize logo file library</div>
      <div class="next-action">Create brand one-pager for partnerships</div>
      <div class="progress-track"><div class="progress-fill" style="width:35%"></div></div>
      <div style="font-size:0.6rem;color:var(--muted2);margin-top:4px;text-align:right">35% complete</div>
    </div>
  </div>

  <!-- Reinforcing Loops -->
  <div class="section-label px">Reinforcing Loops</div>

  <!-- Loop A — Gold (Content Engine) -->
  <div class="px mb12">
    <div class="card">
      <div class="loop-label text-gold">Loop A — Content Engine</div>
      <div style="font-size:0.68rem;color:var(--muted2);text-align:center;margin-bottom:8px">The more you create, the more leverage you build</div>
      <div class="loop-container">
        <div class="loop-ring loop-ring-gold"></div>
        <!-- nodes positioned around the circle -->
        <div class="loop-node loop-node-gold" style="top:10px;left:50%;transform:translateX(-50%)">Content</div>
        <div class="loop-node loop-node-gold" style="top:50%;right:8px;transform:translateY(-50%)">Views</div>
        <div class="loop-node loop-node-gold" style="bottom:10px;right:22%;transform:translateX(50%)">Cred&shy;ibility</div>
        <div class="loop-node loop-node-gold" style="bottom:10px;left:22%;transform:translateX(-50%)">Access</div>
        <div class="loop-node loop-node-gold" style="top:50%;left:8px;transform:translateY(-50%)">Better<br>Content</div>
      </div>
    </div>
  </div>

  <!-- Loop B — Violet (Revenue Engine) -->
  <div class="px mb20">
    <div class="card">
      <div class="loop-label text-violet">Loop B — Revenue Engine</div>
      <div style="font-size:0.68rem;color:var(--muted2);text-align:center;margin-bottom:8px">Every policy funds the next wave of leads</div>
      <div class="loop-container">
        <div class="loop-ring loop-ring-violet"></div>
        <div class="loop-node loop-node-violet" style="top:10px;left:50%;transform:translateX(-50%)">Leads</div>
        <div class="loop-node loop-node-violet" style="top:50%;right:8px;transform:translateY(-50%)">SMS<br>Nurture</div>
        <div class="loop-node loop-node-violet" style="bottom:10px;right:22%;transform:translateX(50%)">Conver&shy;sion</div>
        <div class="loop-node loop-node-violet" style="bottom:10px;left:22%;transform:translateX(-50%)">Revenue</div>
        <div class="loop-node loop-node-violet" style="top:50%;left:8px;transform:translateY(-50%)">Ads →<br>Leads</div>
      </div>
    </div>
  </div>

</div>
<!-- END OS TAB -->

</div><!-- /#app -->

<!-- ── BOTTOM NAV ── -->
<nav class="bottom-nav">
  <button class="nav-tab active" id="btn-home" onclick="switchTab('home')">
    <span class="tab-icon">🏠</span>
    <span class="tab-label">Home</span>
  </button>
  <button class="nav-tab" id="btn-campaign" onclick="switchTab('campaign')">
    <span class="tab-icon">📊</span>
    <span class="tab-label">Campaign</span>
  </button>
  <button class="nav-tab" id="btn-os" onclick="switchTab('os')">
    <span class="tab-icon">🌐</span>
    <span class="tab-label">OS</span>
  </button>
</nav>

<!-- ── INBOX MODAL ── -->
<div class="modal-overlay" id="inbox-modal" onclick="closeInboxIfOutside(event)">
  <div class="modal-sheet">
    <div class="modal-handle"></div>
    <div class="modal-title">Add to Inbox</div>
    <textarea class="modal-input" id="inbox-input" placeholder="Type a note, task, or idea…"></textarea>
    <div class="modal-btn-row">
      <button class="btn-secondary" onclick="closeInbox()">Cancel</button>
      <button class="btn-primary" onclick="saveInbox()">Save to Inbox</button>
    </div>
  </div>
</div>

<script>
// ── TAB SWITCHING ──
function switchTab(name) {
  ['home','campaign','os'].forEach(t => {
    document.getElementById('tab-' + t).classList.toggle('active', t === name);
    document.getElementById('btn-' + t).classList.toggle('active', t === name);
  });
  document.getElementById('app').scrollTop = 0;
}

// ── COLLAPSIBLE ──
function toggleCollapse(id) {
  const body    = document.getElementById(id);
  const chevron = document.getElementById('chevron-' + id);
  body.classList.toggle('open');
  chevron.classList.toggle('open');
}

// ── METRIC INCREMENT ──
const metrics = {};
function inc(key) {
  metrics[key] = (metrics[key] || 0) + 1;
  const el = document.getElementById('m-' + key);
  if (el) {
    el.textContent = metrics[key];
    el.style.transform = 'scale(1.25)';
    el.style.color = 'var(--gold2)';
    setTimeout(() => { el.style.transform = ''; el.style.color = ''; }, 180);
  }
}

// ── INBOX ──
let inboxItems = [];
function openInbox() {
  document.getElementById('inbox-modal').classList.add('open');
  setTimeout(() => document.getElementById('inbox-input').focus(), 250);
}
function closeInbox() {
  document.getElementById('inbox-modal').classList.remove('open');
  document.getElementById('inbox-input').value = '';
}
function closeInboxIfOutside(e) {
  if (e.target === document.getElementById('inbox-modal')) closeInbox();
}
function saveInbox() {
  const val = document.getElementById('inbox-input').value.trim();
  if (!val) return;
  inboxItems.unshift({ id: Date.now(), text: val });
  renderInbox();
  closeInbox();
}
function deleteInbox(id) {
  inboxItems = inboxItems.filter(i => i.id !== id);
  renderInbox();
}
function renderInbox() {
  const list = document.getElementById('inbox-list');
  list.innerHTML = inboxItems.map(i =>
    \`<div class="inbox-item">
      <span>\${i.text.replace(/</g,'&lt;')}</span>
      <button class="inbox-del" onclick="deleteInbox(\${i.id})">✕</button>
    </div>\`
  ).join('');
}
</script>
</body>
</html>`);
}
