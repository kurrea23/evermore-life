const PAGES_ORIGIN = "evermore-life.pages.dev";
const APEX_HOST = "evermorelife.org";
const DASHBOARD_ASSET_PATH = "/EVERMORE_COCKPIT_v2.html";
const DASHBOARD_COOKIE_NAME = "__Host-evermore_dashboard";
const DASHBOARD_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const COCKPIT_STATE_KEY = "cockpit-v2-state";

const CLEAN_REDIRECTS = new Map([
  ["/index.html", "/"],
  ["/optin.html", "/optin"],
  ["/get-quote", "/optin"],
  ["/chat.html", "/chat"],
  ["/privacy.html", "/privacy"],
  ["/terms.html", "/terms"],
  ["/thank-you.html", "/thank-you"],
  ["/404.html", "/404"],
  ["/cockpit-v2.html", "/dashboard"],
  ["/cockpit-v2", "/dashboard"],
  ["/v2-cockpit", "/dashboard"],
  ["/01_website/v2/pages", "/"],
  ["/01_website/v2/pages/", "/"],
  ["/01_website/v2/pages/index", "/"],
  ["/01_website/v2/pages/index.html", "/"],
  ["/01_website/v2/pages/optin", "/optin"],
  ["/01_website/v2/pages/optin.html", "/optin"],
  ["/01_website/v2/pages/chat", "/chat"],
  ["/01_website/v2/pages/chat.html", "/chat"],
  ["/01_website/v2/pages/privacy", "/privacy"],
  ["/01_website/v2/pages/privacy.html", "/privacy"],
  ["/01_website/v2/pages/terms", "/terms"],
  ["/01_website/v2/pages/terms.html", "/terms"],
  ["/01_website/v2/pages/thank-you", "/thank-you"],
  ["/01_website/v2/pages/thank-you.html", "/thank-you"],
]);

const PUBLIC_ROUTES = new Map([
  ["/", "/01_website/v2/pages/"],
  ["/privacy", "/01_website/v2/pages/privacy"],
  ["/terms", "/01_website/v2/pages/terms"],
  ["/optin", "/01_website/v2/pages/optin"],
  ["/chat", "/01_website/v2/pages/chat"],
  ["/thank-you", "/01_website/v2/pages/thank-you"],
  ["/404", "/01_website/v2/pages/404"],
]);

export default {
  async fetch(request, env) {
    const incomingUrl = new URL(request.url);

    if (incomingUrl.hostname === `www.${APEX_HOST}`) {
      incomingUrl.hostname = APEX_HOST;
      return Response.redirect(incomingUrl.toString(), 301);
    }

    if (incomingUrl.pathname === "/robots.txt") {
      return serveRobots();
    }

    if (incomingUrl.pathname === "/api/cockpit-state") {
      return handleCockpitState(request, env);
    }

    const cleanPath = CLEAN_REDIRECTS.get(incomingUrl.pathname);
    if (cleanPath) {
      incomingUrl.pathname = cleanPath;
      return Response.redirect(incomingUrl.toString(), 302);
    }

    const dashboardResponse = await maybeHandleDashboard(request, env, incomingUrl);
    if (dashboardResponse) {
      return dashboardResponse;
    }

    const upstreamUrl = new URL(request.url);
    upstreamUrl.protocol = "https:";
    upstreamUrl.hostname = PAGES_ORIGIN;
    upstreamUrl.pathname = PUBLIC_ROUTES.get(incomingUrl.pathname) || incomingUrl.pathname;

    const upstreamRequest = new Request(upstreamUrl.toString(), request);
    const response = await fetch(upstreamRequest);

    if (response.status === 404 && !upstreamUrl.pathname.endsWith("/404")) {
      const notFoundUrl = new URL("/01_website/v2/pages/404", upstreamUrl);
      const notFound = await fetch(new Request(notFoundUrl.toString(), request));
      return new Response(rewriteHtml(await notFound.text()), {
        status: 404,
        statusText: "Not Found",
        headers: responseHeaders(notFound.headers, { html: true }),
      });
    }

    if (isHtml(response)) {
      return new Response(rewriteHtml(await response.text()), {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders(response.headers, { html: true }),
      });
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders(response.headers),
    });
  },
};

async function maybeHandleDashboard(request, env, incomingUrl) {
  if (incomingUrl.pathname === "/dashboard/logout") {
    return clearDashboardSession(request);
  }

  if (incomingUrl.pathname === "/dashboard/login" && request.method === "POST") {
    return handleDashboardLogin(request, env);
  }

  if (incomingUrl.pathname !== "/dashboard" && incomingUrl.pathname !== "/dashboard/") {
    return null;
  }

  if (request.method === "POST") {
    return handleDashboardLogin(request, env);
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", {
      status: 405,
      headers: privateHeaders({ allow: "GET, HEAD, POST" }),
    });
  }

  if (!(await isDashboardAuthenticated(request, env))) {
    return serveDashboardLogin();
  }

  return serveDashboardAsset(request, env);
}

async function handleCockpitState(request, env) {
  if (!env.COCKPIT_STATE) {
    return jsonResponse({ error: "Cockpit state storage is not configured." }, 503);
  }

  if (!(await isDashboardAuthenticated(request, env))) {
    return jsonResponse({ error: "Login required." }, 401);
  }

  if (request.method === "GET" || request.method === "HEAD") {
    const state = await env.COCKPIT_STATE.get(COCKPIT_STATE_KEY, "json");
    return jsonResponse(state || defaultCockpitState(), 200, request.method === "HEAD");
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405, false, { allow: "GET, HEAD, POST" });
  }

  const bodyText = await request.text();
  if (bodyText.length > 250000) {
    return jsonResponse({ error: "Cockpit state is too large." }, 413);
  }

  let body;
  try {
    body = JSON.parse(bodyText || "{}");
  } catch {
    return jsonResponse({ error: "Invalid JSON." }, 400);
  }

  const nextState = normalizeCockpitState(body);
  await env.COCKPIT_STATE.put(COCKPIT_STATE_KEY, JSON.stringify(nextState));
  return jsonResponse(nextState);
}

function defaultCockpitState() {
  return {
    version: 1,
    main: {},
    projects: {},
    updatedAt: new Date().toISOString(),
  };
}

function normalizeCockpitState(body) {
  const state = defaultCockpitState();
  if (body && typeof body === "object") {
    if (body.main && typeof body.main === "object" && !Array.isArray(body.main)) {
      state.main = body.main;
    }
    if (body.projects && typeof body.projects === "object" && !Array.isArray(body.projects)) {
      state.projects = body.projects;
    }
  }
  state.updatedAt = new Date().toISOString();
  return state;
}

async function handleDashboardLogin(request, env) {
  const password = readSecret(env, "DASHBOARD_PASSWORD");
  const sessionSecret = readSecret(env, "DASHBOARD_SESSION_SECRET");

  if (!password || !sessionSecret) {
    return new Response("Dashboard lock is not configured.", {
      status: 503,
      headers: privateHeaders(),
    });
  }

  const form = await request.formData();
  const submittedPassword = String(form.get("password") || "");

  if (!constantTimeEqual(submittedPassword, password)) {
    return serveDashboardLogin("That access code did not match.");
  }

  const redirectUrl = new URL("/dashboard", request.url);
  const headers = privateHeaders({
    location: redirectUrl.toString(),
    "set-cookie": `${DASHBOARD_COOKIE_NAME}=${await dashboardSessionToken(env)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${DASHBOARD_COOKIE_MAX_AGE}`,
  });
  return new Response(null, { status: 302, headers });
}

async function isDashboardAuthenticated(request, env) {
  const sessionSecret = readSecret(env, "DASHBOARD_SESSION_SECRET");
  if (!sessionSecret) return false;
  return getCookie(request, DASHBOARD_COOKIE_NAME) === await dashboardSessionToken(env);
}

async function dashboardSessionToken(env) {
  const source = new TextEncoder().encode(`evermore-dashboard:${readSecret(env, "DASHBOARD_SESSION_SECRET")}`);
  const hash = await crypto.subtle.digest("SHA-256", source);
  return base64UrlEncode(hash);
}

function clearDashboardSession(request) {
  const redirectUrl = new URL("/dashboard", request.url);
  const headers = privateHeaders({
    location: redirectUrl.toString(),
    "set-cookie": `${DASHBOARD_COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
  });
  return new Response(null, { status: 302, headers });
}

async function serveDashboardAsset(request, env) {
  const assetResponse = await env.DASHBOARD_ASSETS.fetch(`https://dashboard-assets.local${DASHBOARD_ASSET_PATH}`);
  if (!assetResponse.ok) {
    return new Response("Dashboard is temporarily unavailable.", {
      status: 502,
      headers: privateHeaders(),
    });
  }

  const headers = privateHeaders(assetResponse.headers, { html: true });
  headers.set("x-evermore-deployment", "cloudflare-dashboard");
  return new Response(request.method === "HEAD" ? null : assetResponse.body, {
    status: 200,
    headers,
  });
}

function serveDashboardLogin(errorMessage = "") {
  const errorHtml = errorMessage
    ? `<p class="error">${escapeHtml(errorMessage)}</p>`
    : `<p class="hint">Private Evermore access.</p>`;

  return new Response(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow,noarchive">
<title>Evermore Life - Private Dashboard</title>
<style>
  :root {
    color-scheme: dark;
    --ink: #f6efe3;
    --muted: rgba(246,239,227,.62);
    --gold: #c9a84c;
    --navy: #0b1724;
    --line: rgba(201,168,76,.24);
  }
  * { box-sizing: border-box; }
  html, body { min-height: 100%; margin: 0; }
  body {
    display: grid;
    place-items: center;
    padding: 28px;
    background:
      linear-gradient(180deg, rgba(255,255,255,.035), transparent 36%),
      radial-gradient(circle at 50% 0%, rgba(201,168,76,.18), transparent 42%),
      var(--navy);
    color: var(--ink);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  main {
    width: min(100%, 380px);
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 28px;
    background: rgba(255,255,255,.045);
    box-shadow: 0 24px 70px rgba(0,0,0,.32);
  }
  .brand {
    color: var(--gold);
    font-family: Georgia, "Times New Roman", serif;
    font-size: 2rem;
    letter-spacing: .16em;
    line-height: 1;
    text-transform: uppercase;
  }
  .sub {
    margin: 10px 0 30px;
    color: var(--muted);
    font-size: .72rem;
    letter-spacing: .14em;
    text-transform: uppercase;
  }
  label {
    display: block;
    margin-bottom: 8px;
    color: var(--muted);
    font-size: .72rem;
    letter-spacing: .12em;
    text-transform: uppercase;
  }
  input, button {
    width: 100%;
    min-height: 48px;
    border-radius: 6px;
    font: inherit;
  }
  input {
    border: 1px solid var(--line);
    padding: 0 14px;
    background: rgba(0,0,0,.24);
    color: var(--ink);
    outline: none;
  }
  input:focus { border-color: var(--gold); }
  button {
    margin-top: 14px;
    border: 0;
    background: var(--gold);
    color: #0b1724;
    font-weight: 800;
    letter-spacing: .12em;
    text-transform: uppercase;
  }
  .hint, .error {
    min-height: 1.2em;
    margin: 14px 0 0;
    font-size: .82rem;
    text-align: center;
  }
  .hint { color: var(--muted); }
  .error { color: #ff9b9b; }
</style>
</head>
<body>
  <main>
    <div class="brand">Evermore</div>
    <div class="sub">Life cockpit</div>
    <form method="post" action="/dashboard/login">
      <label for="password">Access code</label>
      <input id="password" name="password" type="password" autocomplete="current-password" autofocus>
      <button type="submit">Enter</button>
      ${errorHtml}
    </form>
  </main>
</body>
</html>`, {
    status: 200,
    headers: privateHeaders({ "content-type": "text/html; charset=utf-8" }),
  });
}

function serveRobots() {
  return new Response([
    "User-agent: *",
    "Disallow: /dashboard",
    "Disallow: /dashboard/",
    "Disallow: /dashboard/login",
    "Disallow: /dashboard/logout",
    "Allow: /",
    "Sitemap: https://evermorelife.org/sitemap.xml",
    "",
  ].join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}

function isHtml(response) {
  return (response.headers.get("content-type") || "").includes("text/html");
}

function rewriteHtml(html) {
  return html
    .replaceAll('href="_tokens.css"', 'href="/01_website/v2/pages/_tokens.css"')
    .replaceAll('href="_base.css"', 'href="/01_website/v2/pages/_base.css"')
    .replaceAll('src="../assets/', 'src="/01_website/v2/assets/')
    .replaceAll("https://kurrea23.github.io/evermore-life/01_website/v2/assets/", "https://evermorelife.org/01_website/v2/assets/")
    .replaceAll('href="index.html#', 'href="/#')
    .replaceAll('href="index.html"', 'href="/"')
    .replaceAll('href="optin.html"', 'href="/optin"')
    .replaceAll('href="privacy.html"', 'href="/privacy"')
    .replaceAll('href="terms.html"', 'href="/terms"')
    .replaceAll('href="thank-you.html"', 'href="/thank-you"');
}

function responseHeaders(sourceHeaders, options = {}) {
  const headers = new Headers(sourceHeaders);
  headers.set("x-evermore-deployment", "cloudflare-pages-proxy");
  if (options.html) {
    headers.delete("content-length");
    headers.set("content-type", "text/html; charset=utf-8");
  }
  return headers;
}

function jsonResponse(payload, status = 200, head = false, extraHeaders = {}) {
  const headers = privateHeaders({
    "content-type": "application/json; charset=utf-8",
    ...extraHeaders,
  });
  return new Response(head ? null : JSON.stringify(payload), { status, headers });
}

function privateHeaders(sourceHeaders = {}, options = {}) {
  const headers = new Headers(sourceHeaders);
  headers.set("cache-control", "no-store");
  headers.set("x-robots-tag", "noindex, nofollow, noarchive");
  headers.set("x-frame-options", "DENY");
  headers.set("referrer-policy", "no-referrer");
  headers.delete("content-length");
  if (options.html) {
    headers.set("content-type", "text/html; charset=utf-8");
  }
  return headers;
}

function readSecret(env, key) {
  const value = env && env[key];
  return typeof value === "string" ? value : "";
}

function getCookie(request, name) {
  const cookie = request.headers.get("cookie") || "";
  for (const item of cookie.split(";")) {
    const [rawName, ...rawValue] = item.trim().split("=");
    if (rawName === name) return rawValue.join("=");
  }
  return "";
}

function constantTimeEqual(left, right) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}

function base64UrlEncode(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
