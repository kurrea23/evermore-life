const PAGES_ORIGIN = "evermore-life.pages.dev";
const APEX_HOST = "evermorelife.org";
const DASHBOARD_ASSET_PATH = "/EVERMORE_COCKPIT_v2.html";
const SARAH_ASSET_PATH = "/Sarah_Evermore_AI_v2.html";
const KEVIN_ASSET_PATH = "/kevin_v2.html";
const DASHBOARD_COOKIE_NAME = "__Host-evermore_dashboard";
const DASHBOARD_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const COCKPIT_STATE_KEY = "cockpit-v2-state";

const CLEAN_REDIRECTS = new Map([
  ["/index.html", "/"],
  ["/optin.html", "/optin"],
  ["/get-quote", "/optin"],
  ["/chat.html", "/chat"],
  ["/sarah.html", "/sarah"],
  ["/kevin.html", "/kevin"],
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
  ["/01_website/v2/pages/sarah", "/sarah"],
  ["/01_website/v2/pages/sarah.html", "/sarah"],
  ["/01_website/experiments/kevin_v2", "/kevin"],
  ["/01_website/experiments/kevin_v2.html", "/kevin"],
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
  ["/sarah", "/01_website/v2/pages/sarah"],
  ["/thank-you", "/01_website/v2/pages/thank-you"],
  ["/404", "/01_website/v2/pages/404"],
  ["/arizona", "/01_website/state-pages/public/arizona/"],
  ["/arizona/", "/01_website/state-pages/public/arizona/"],
  ["/texas", "/01_website/state-pages/public/texas/"],
  ["/texas/", "/01_website/state-pages/public/texas/"],
  ["/arkansas", "/01_website/state-pages/public/arkansas/"],
  ["/arkansas/", "/01_website/state-pages/public/arkansas/"],
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

    if (incomingUrl.pathname === "/api/cockpit-update") {
      return handleCockpitUpdate(request, env);
    }

    if (incomingUrl.pathname === "/api/kevin-chat") {
      return handleKevinChat(request, env);
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

    const kevinResponse = await maybeHandleKevin(request, env, incomingUrl);
    if (kevinResponse) {
      return kevinResponse;
    }

    if (incomingUrl.pathname === "/sarah" || incomingUrl.pathname === "/sarah/") {
      return serveSarahAsset(request, env);
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

async function maybeHandleKevin(request, env, incomingUrl) {
  if (incomingUrl.pathname !== "/kevin" && incomingUrl.pathname !== "/kevin/") {
    return null;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", {
      status: 405,
      headers: privateHeaders({ allow: "GET, HEAD" }),
    });
  }

  if (!(await isDashboardAuthenticated(request, env))) {
    return serveDashboardLogin();
  }

  return serveKevinAsset(request, env);
}

async function handleCockpitState(request, env) {
  if (!env.COCKPIT_STATE) {
    return jsonResponse({ error: "Cockpit state storage is not configured." }, 503);
  }

  if (!(await isDashboardAuthenticated(request, env))) {
    return jsonResponse({ error: "Login required." }, 401);
  }

  if (request.method === "GET" || request.method === "HEAD") {
    const storedState = await env.COCKPIT_STATE.get(COCKPIT_STATE_KEY, "json");
    return jsonResponse(withLegacyAliases(normalizeCockpitState(storedState)), 200, request.method === "HEAD");
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

  const currentState = normalizeCockpitState(await env.COCKPIT_STATE.get(COCKPIT_STATE_KEY, "json"));
  const legacyBrief = objectOrEmpty(objectOrEmpty(body.main).dailyBrief);
  const nextState = {
    ...currentState,
    version: 2,
    generated: legacyBrief.text
      ? mergeLegacyBrief(currentState.generated, legacyBrief)
      : currentState.generated,
    user: normalizeUserState(body.user || legacyUserState(body)),
    updatedAt: new Date().toISOString(),
  };
  await env.COCKPIT_STATE.put(COCKPIT_STATE_KEY, JSON.stringify(nextState));
  return jsonResponse(withLegacyAliases(nextState));
}

async function handleCockpitUpdate(request, env) {
  if (!env.COCKPIT_STATE) {
    return jsonResponse({ error: "Cockpit state storage is not configured." }, 503);
  }

  if (!(await isDashboardAuthenticated(request, env))) {
    return jsonResponse({ error: "Login required." }, 401);
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405, false, { allow: "POST" });
  }

  const bodyText = await request.text();
  if (bodyText.length > 250000) {
    return jsonResponse({ error: "Cockpit update is too large." }, 413);
  }

  let body;
  try {
    body = JSON.parse(bodyText || "{}");
  } catch {
    return jsonResponse({ error: "Invalid JSON." }, 400);
  }

  const currentState = normalizeCockpitState(await env.COCKPIT_STATE.get(COCKPIT_STATE_KEY, "json"));
  const nextState = {
    ...currentState,
    version: 2,
    generated: normalizeGeneratedState(body.generated || body),
    updatedAt: new Date().toISOString(),
  };
  await env.COCKPIT_STATE.put(COCKPIT_STATE_KEY, JSON.stringify(nextState));
  return jsonResponse(withLegacyAliases(nextState));
}

async function handleKevinChat(request, env) {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405, false, { allow: "POST" });
  }

  if (!(await isDashboardAuthenticated(request, env))) {
    return jsonResponse({ error: "Login required." }, 401);
  }

  const apiKey = readSecret(env, "OPENAI_API_KEY");
  if (!apiKey) {
    return jsonResponse({ error: "Kevin AI is not configured yet." }, 503);
  }

  const bodyText = await request.text();
  if (bodyText.length > 50000) {
    return jsonResponse({ error: "Message is too large." }, 413);
  }

  let body;
  try {
    body = JSON.parse(bodyText || "{}");
  } catch {
    return jsonResponse({ error: "Invalid JSON." }, 400);
  }

  const message = String(body.message || "").trim();
  if (!message) {
    return jsonResponse({ error: "Message is required." }, 400);
  }

  const history = Array.isArray(body.history) ? body.history.slice(-8) : [];
  const cockpitState = await readCockpitStateForKevin(env);
  const prompt = buildKevinPrompt(message, history, cockpitState);

  const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "authorization": `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: readSecret(env, "OPENAI_MODEL") || "gpt-4.1-mini",
      instructions: [
        "You are Kevin, the private Evermore Life project manager.",
        "Keep the operator focused on the next concrete action.",
        "Use the cockpit state as context, but clearly separate verified facts from stale or documented-only status.",
        "Do not claim a deployment, A2P approval, lead submission, workflow publish, or live result is complete unless the provided state explicitly proves it.",
        "Kevin is read-only in this version. Do not say you updated the dashboard, marked tasks done, sent messages, or changed external systems.",
        "Keep replies concise, practical, and direct. Prefer a short next-action list when useful.",
        "Do not provide legal, tax, carrier-compliance, or insurance advice as fact; suggest checking the relevant official source or human owner when needed.",
      ].join(" "),
      input: prompt,
      max_output_tokens: 650,
    }),
  });

  const data = await openAiResponse.json().catch(() => null);
  if (!openAiResponse.ok) {
    return jsonResponse({
      error: "Kevin AI request failed.",
      detail: data && data.error && data.error.message ? data.error.message : "OpenAI returned an error.",
    }, 502);
  }

  return jsonResponse({ reply: extractOpenAIText(data) || "I heard you. The next move is to verify the dashboard state and choose the next concrete action." });
}

async function readCockpitStateForKevin(env) {
  if (!env.COCKPIT_STATE) return null;
  try {
    return await env.COCKPIT_STATE.get(COCKPIT_STATE_KEY, "json");
  } catch {
    return null;
  }
}

function buildKevinPrompt(message, history, cockpitState) {
  return JSON.stringify({
    user_message: message,
    recent_history: history.map((item) => ({
      role: String(item.role || "").slice(0, 20),
      content: String(item.content || "").slice(0, 1200),
    })),
    cockpit_state: cockpitState || defaultCockpitState(),
  });
}

function extractOpenAIText(data) {
  if (!data || typeof data !== "object") return "";
  if (typeof data.output_text === "string") return data.output_text.trim();
  if (!Array.isArray(data.output)) return "";

  const chunks = [];
  for (const item of data.output) {
    if (!item || !Array.isArray(item.content)) continue;
    for (const part of item.content) {
      if (part && typeof part.text === "string") chunks.push(part.text);
    }
  }
  return chunks.join("").trim();
}

function defaultCockpitState() {
  return {
    version: 2,
    generated: normalizeGeneratedState({}),
    user: normalizeUserState({}),
    updatedAt: new Date().toISOString(),
  };
}

function normalizeCockpitState(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return defaultCockpitState();
  }

  if (body.version === 2 || body.generated || body.user) {
    return {
      version: 2,
      generated: normalizeGeneratedState(body.generated),
      user: normalizeUserState(body.user),
      updatedAt: cleanString(body.updatedAt) || new Date().toISOString(),
    };
  }

  const main = objectOrEmpty(body.main);
  const dailyBrief = objectOrEmpty(main.dailyBrief);
  const legacyMain = { ...main };
  delete legacyMain.dailyBrief;
  delete legacyMain.__wins;

  return {
    version: 2,
    generated: normalizeGeneratedState({
      briefText: dailyBrief.text,
      generatedAt: dailyBrief.updatedAt || body.updatedAt,
      generatedBy: "legacy-state-migration",
    }),
    user: normalizeUserState({
      main: legacyMain,
      projects: body.projects,
      wins: main.__wins,
    }),
    updatedAt: cleanString(body.updatedAt) || new Date().toISOString(),
  };
}

function legacyUserState(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return {};
  const main = { ...objectOrEmpty(body.main) };
  const wins = Array.isArray(main.__wins) ? main.__wins : body.wins;
  delete main.dailyBrief;
  delete main.__wins;
  return {
    main,
    projects: body.projects,
    wins,
  };
}

function withLegacyAliases(state) {
  const generated = normalizeGeneratedState(state.generated);
  const user = normalizeUserState(state.user);
  return {
    ...state,
    main: {
      ...user.main,
      dailyBrief: {
        text: briefText(generated.brief),
        updatedAt: generated.generatedAt,
      },
      __wins: user.wins,
    },
    projects: user.projects,
  };
}

function mergeLegacyBrief(currentGenerated, legacyBrief) {
  const generated = normalizeGeneratedState(currentGenerated);
  const parsed = parseBriefText(cleanString(legacyBrief.text));
  return normalizeGeneratedState({
    ...generated,
    brief: {
      today: parsed.today || generated.brief.today,
      done: parsed.done || generated.brief.done,
      next: parsed.next || generated.brief.next,
      blockers: parsed.blockers || generated.brief.blockers,
    },
    generatedAt: cleanString(legacyBrief.updatedAt) || new Date().toISOString(),
    generatedBy: "legacy-dashboard-edit",
  });
}

function briefText(brief) {
  const value = objectOrEmpty(brief);
  return [
    `Today: ${cleanString(value.today)}`,
    `Done: ${cleanString(value.done)}`,
    `Next: ${cleanString(value.next)}`,
    `Blockers: ${cleanString(value.blockers)}`,
  ].join(" ");
}

function normalizeGeneratedState(value) {
  const source = objectOrEmpty(value);
  const parsedBrief = parseBriefText(cleanString(source.briefText));
  const providedBrief = objectOrEmpty(source.brief);
  const generatedAt = cleanString(source.generatedAt) || cleanString(providedBrief.updatedAt) || "";

  return {
    date: cleanString(source.date),
    mission: cleanString(source.mission),
    nextAction: cleanString(source.nextAction),
    brief: {
      today: cleanString(providedBrief.today) || parsedBrief.today,
      done: cleanString(providedBrief.done) || parsedBrief.done,
      next: cleanString(providedBrief.next) || parsedBrief.next,
      blockers: cleanString(providedBrief.blockers) || parsedBrief.blockers,
    },
    priorities: stringArray(source.priorities, 5),
    schedule: stringArray(source.schedule, 20),
    followUps: stringArray(source.followUps, 20),
    risks: stringArray(source.risks, 20),
    sources: normalizeSources(source.sources),
    generatedAt,
    generatedBy: cleanString(source.generatedBy),
  };
}

function normalizeUserState(value) {
  const source = objectOrEmpty(value);
  return {
    main: objectOrEmpty(source.main),
    projects: objectOrEmpty(source.projects),
    wins: Array.isArray(source.wins) ? source.wins.slice(0, 50) : [],
  };
}

function normalizeSources(value) {
  const source = objectOrEmpty(value);
  return {
    gmail: cleanString(source.gmail) || "not-scanned",
    calendar: cleanString(source.calendar) || "not-scanned",
    repo: cleanString(source.repo) || "not-scanned",
    highLevel: cleanString(source.highLevel) || "not-scanned",
  };
}

function parseBriefText(text) {
  const parts = { today: "", done: "", next: "", blockers: "" };
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  const patterns = [
    ["today", /today:\s*(.*?)(?=\s(done|wins|next|blockers):|$)/i],
    ["done", /(done|wins):\s*(.*?)(?=\s(today|next|blockers):|$)/i],
    ["next", /next:\s*(.*?)(?=\s(today|done|wins|blockers):|$)/i],
    ["blockers", /blockers:\s*(.*?)(?=\s(today|done|wins|next):|$)/i],
  ];
  for (const [key, pattern] of patterns) {
    const match = normalized.match(pattern);
    if (match) parts[key] = (key === "done" ? match[2] : match[1]).trim();
  }
  return parts;
}

function objectOrEmpty(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function stringArray(value, maxItems) {
  if (!Array.isArray(value)) return [];
  return value.map(cleanString).filter(Boolean).slice(0, maxItems);
}

function cleanString(value) {
  return typeof value === "string" ? value.trim().slice(0, 5000) : "";
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

async function serveSarahAsset(request, env) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", {
      status: 405,
      headers: responseHeaders(new Headers({ allow: "GET, HEAD" })),
    });
  }

  const assetResponse = await env.DASHBOARD_ASSETS.fetch(`https://dashboard-assets.local${SARAH_ASSET_PATH}`);
  if (!assetResponse.ok) {
    return new Response("Sarah is temporarily unavailable.", {
      status: 502,
      headers: responseHeaders(new Headers()),
    });
  }

  const headers = responseHeaders(assetResponse.headers, { html: true });
  headers.set("x-evermore-deployment", "cloudflare-sarah-standby");
  return new Response(request.method === "HEAD" ? null : assetResponse.body, {
    status: 200,
    headers,
  });
}

async function serveKevinAsset(request, env) {
  const assetResponse = await env.DASHBOARD_ASSETS.fetch(`https://dashboard-assets.local${KEVIN_ASSET_PATH}`);
  if (!assetResponse.ok) {
    return new Response("Kevin is temporarily unavailable.", {
      status: 502,
      headers: privateHeaders(),
    });
  }

  const headers = privateHeaders(assetResponse.headers, { html: true });
  headers.set("x-evermore-deployment", "cloudflare-kevin-private");
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
    "Disallow: /kevin",
    "Disallow: /kevin/",
    "Disallow: /api/kevin-chat",
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
    .replaceAll('href="../assets/state-pages.css"', 'href="/01_website/state-pages/public/assets/state-pages.css"')
    .replaceAll("url('../assets/hero-", "url('/01_website/state-pages/public/assets/hero-")
    .replaceAll('href="../../../../index.html"', 'href="/"')
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
