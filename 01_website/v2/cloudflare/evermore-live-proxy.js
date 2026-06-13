const PAGES_ORIGIN = "evermore-life.pages.dev";
const APEX_HOST = "evermorelife.org";
const DASHBOARD_ASSET_PATH = "/EVERMORE_COCKPIT_v2.html";
const DASHBOARD_PREVIEW_ASSET_PATH = "/EVERMORE_COCKPIT_v3.html";
const SARAH_ASSET_PATH = "/Sarah_Evermore_AI_v2.html";
const KEVIN_ASSET_PATH = "/kevin_v2.html";
const DASHBOARD_COOKIE_NAME = "__Host-evermore_dashboard";
const DASHBOARD_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const COCKPIT_STATE_KEY = "cockpit-v2-state";
const COCKPIT_PREVIEW_STATE_KEY = "cockpit-v3-preview-state";
const COCKPIT_PREVIEW_BACKUP_PREFIX = "cockpit-v3-preview-backup:";
const COCKPIT_PREVIEW_HISTORY_PREFIX = "cockpit-v3-preview-history:";

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

    if (incomingUrl.pathname === "/api/cockpit-preview-state") {
      return handleCockpitPreviewState(request, env);
    }

    if (incomingUrl.pathname === "/api/cockpit-preview-update") {
      return handleCockpitPreviewUpdate(request, env);
    }

    if (incomingUrl.pathname === "/api/cockpit-preview-history") {
      return handleCockpitPreviewHistory(request, env);
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

    const dashboardPreviewResponse = await maybeHandleDashboardPreview(request, env, incomingUrl);
    if (dashboardPreviewResponse) {
      return dashboardPreviewResponse;
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

async function maybeHandleDashboardPreview(request, env, incomingUrl) {
  if (incomingUrl.pathname === "/dashboard-preview/logout") {
    return clearDashboardSession(request, "/dashboard-preview");
  }

  if (incomingUrl.pathname === "/dashboard-preview/login" && request.method === "POST") {
    return handleDashboardLogin(request, env, "/dashboard-preview");
  }

  if (incomingUrl.pathname !== "/dashboard-preview" && incomingUrl.pathname !== "/dashboard-preview/") {
    return null;
  }

  if (request.method === "POST") {
    return handleDashboardLogin(request, env, "/dashboard-preview");
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", {
      status: 405,
      headers: privateHeaders({ allow: "GET, HEAD, POST" }),
    });
  }

  if (!(await isDashboardAuthenticated(request, env))) {
    return serveDashboardLogin("", "/dashboard-preview/login");
  }

  return serveDashboardPreviewAsset(request, env);
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

async function handleCockpitPreviewState(request, env) {
  if (!env.COCKPIT_STATE) {
    return jsonResponse({ error: "Cockpit state storage is not configured." }, 503);
  }
  if (!(await isDashboardAuthenticated(request, env))) {
    return jsonResponse({ error: "Login required." }, 401);
  }

  if (request.method === "GET" || request.method === "HEAD") {
    return jsonResponse(await readCockpitPreviewState(env), 200, request.method === "HEAD");
  }
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405, false, { allow: "GET, HEAD, POST" });
  }

  const body = await readJsonBody(request, 350000, "Cockpit preview state");
  if (body.error) return body.error;
  const currentState = await readCockpitPreviewState(env);
  await backupCockpitPreviewState(env, currentState);
  const nextState = {
    ...currentState,
    version: 3,
    user: normalizePreviewUserState(body.value.user, currentState.user),
    registry: normalizePreviewRegistry(body.value.registry, currentState.registry),
    updatedAt: new Date().toISOString(),
  };
  await env.COCKPIT_STATE.put(COCKPIT_PREVIEW_STATE_KEY, JSON.stringify(nextState));
  return jsonResponse(nextState);
}

async function handleCockpitPreviewUpdate(request, env) {
  if (!env.COCKPIT_STATE) {
    return jsonResponse({ error: "Cockpit state storage is not configured." }, 503);
  }
  if (!(await isDashboardAuthenticated(request, env))) {
    return jsonResponse({ error: "Login required." }, 401);
  }
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405, false, { allow: "POST" });
  }

  const body = await readJsonBody(request, 350000, "Cockpit preview update");
  if (body.error) return body.error;
  const currentState = await readCockpitPreviewState(env);
  await backupCockpitPreviewState(env, currentState);
  await archiveCockpitPreviewGenerated(env, currentState.generated);
  const nextState = {
    ...currentState,
    version: 3,
    generated: normalizePreviewGenerated(body.value.generated || body.value),
    updatedAt: new Date().toISOString(),
  };
  await env.COCKPIT_STATE.put(COCKPIT_PREVIEW_STATE_KEY, JSON.stringify(nextState));
  return jsonResponse(nextState);
}

async function handleCockpitPreviewHistory(request, env) {
  if (!env.COCKPIT_STATE) {
    return jsonResponse({ error: "Cockpit state storage is not configured." }, 503);
  }
  if (!(await isDashboardAuthenticated(request, env))) {
    return jsonResponse({ error: "Login required." }, 401);
  }
  if (request.method !== "GET" && request.method !== "HEAD") {
    return jsonResponse({ error: "Method not allowed." }, 405, false, { allow: "GET, HEAD" });
  }

  const listed = await env.COCKPIT_STATE.list({ prefix: COCKPIT_PREVIEW_HISTORY_PREFIX, limit: 1000 });
  const keys = listed.keys.map((item) => item.name).sort().reverse().slice(0, 30);
  const history = (await Promise.all(keys.map((key) => env.COCKPIT_STATE.get(key, "json"))))
    .filter((value) => value && typeof value === "object");
  return jsonResponse({ history }, 200, request.method === "HEAD");
}

async function readJsonBody(request, maxLength, label) {
  const bodyText = await request.text();
  if (bodyText.length > maxLength) {
    return { error: jsonResponse({ error: `${label} is too large.` }, 413) };
  }
  try {
    return { value: JSON.parse(bodyText || "{}") };
  } catch {
    return { error: jsonResponse({ error: "Invalid JSON." }, 400) };
  }
}

async function readCockpitPreviewState(env) {
  const storedState = await env.COCKPIT_STATE.get(COCKPIT_PREVIEW_STATE_KEY, "json");
  if (storedState) return normalizePreviewState(storedState);
  const productionState = normalizeCockpitState(await env.COCKPIT_STATE.get(COCKPIT_STATE_KEY, "json"));
  return defaultPreviewState(productionState);
}

async function backupCockpitPreviewState(env, state) {
  const key = `${COCKPIT_PREVIEW_BACKUP_PREFIX}${sortableTimestamp()}:${crypto.randomUUID()}`;
  await env.COCKPIT_STATE.put(key, JSON.stringify(normalizePreviewState(state)));
}

async function archiveCockpitPreviewGenerated(env, generated) {
  const normalized = normalizePreviewGenerated(generated);
  if (!normalized.generatedAt && !normalized.mission) return;
  const key = `${COCKPIT_PREVIEW_HISTORY_PREFIX}${sortableTimestamp(normalized.generatedAt)}:${crypto.randomUUID()}`;
  await env.COCKPIT_STATE.put(key, JSON.stringify(normalized));
}

function sortableTimestamp(value = "") {
  const date = value ? new Date(value) : new Date();
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
  return safeDate.toISOString().replace(/[:.]/g, "-");
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

function defaultPreviewState(productionState = defaultCockpitState()) {
  const production = normalizeCockpitState(productionState);
  return {
    version: 3,
    generated: defaultPreviewGenerated(production.generated),
    user: defaultPreviewUser(production.user),
    registry: defaultPreviewRegistry(),
    updatedAt: new Date().toISOString(),
  };
}

function normalizePreviewState(value) {
  const source = objectOrEmpty(value);
  if (source.version !== 3 && !source.registry) return defaultPreviewState();
  return {
    version: 3,
    generated: normalizePreviewGenerated(source.generated),
    user: normalizePreviewUserState(source.user),
    registry: normalizePreviewRegistry(source.registry),
    updatedAt: cleanString(source.updatedAt) || new Date().toISOString(),
  };
}

function defaultPreviewGenerated(productionGenerated) {
  const current = normalizeGeneratedState(productionGenerated);
  const verifiedAt = current.generatedAt;
  return normalizePreviewGenerated({
    date: current.date,
    mission: current.mission || "Turn verified information into the next concrete move.",
    nextAction: current.nextAction || "Run the first Cockpit V3 preview refresh.",
    brief: current.brief,
    priorities: current.priorities,
    schedule: current.schedule,
    generatedAt: verifiedAt,
    generatedBy: "cockpit-v3-preview-seed",
    metrics: [
      { label: "Leads today", value: "Unavailable", detail: "Connect HighLevel read-only API" },
      { label: "Appointments", value: "Unavailable", detail: "Connect HighLevel read-only API" },
      { label: "Ad spend", value: "Unavailable", detail: "Connect Meta read-only API" },
      { label: "Open execution tasks", value: "See Projects", detail: "Manual cockpit state is preserved" },
    ],
    cards: defaultPreviewCards(verifiedAt),
    sourceHealth: {
      gmail: { status: current.sources.gmail, detail: "Daily refresh source" },
      calendar: { status: current.sources.calendar, detail: "Daily schedule and festival evidence" },
      repo: { status: current.sources.repo, detail: "Current handoffs and implementation evidence" },
      highLevel: { status: current.sources.highLevel, detail: "Read-only API not connected yet" },
      meta: { status: "setup needed", detail: "Read-only Marketing API not connected yet" },
    },
  });
}

function defaultPreviewCards(verifiedAt) {
  return [
    {
      id: "revenue-funnel",
      category: "Revenue",
      title: "Lead-to-appointment funnel",
      status: "Setup evidence available; live stats not connected",
      nextLevel: "Verified lead-to-appointment flow with daily counts",
      nextAction: "Connect HighLevel read-only API and run one controlled lead test.",
      owner: "Keenan",
      link: "https://app.gohighlevel.com/",
      source: "Current repo handoffs",
      verifiedAt,
    },
    {
      id: "meta-ads",
      category: "Ads",
      title: "Meta campaign launch",
      status: "Draft scaffolds documented; live metrics not connected",
      nextLevel: "First controlled campaign with verified attribution",
      nextAction: "Connect the read-only Meta API and verify Test Events before launch.",
      owner: "Keenan",
      link: "https://business.facebook.com/adsmanager/manage/campaigns?act=324565498427892",
      source: "Meta Ads Manager handoff",
      verifiedAt,
    },
    {
      id: "public-funnel",
      category: "Revenue",
      title: "Public opt-in funnel",
      status: "Routes documented live; end-to-end proof still needed",
      nextLevel: "Verified opt-in to GHL to booked call",
      nextAction: "Submit one controlled Arizona lead and record every downstream result.",
      owner: "Keenan",
      link: "https://evermorelife.org/optin",
      source: "Ads launch control",
      verifiedAt,
    },
    {
      id: "a2p",
      category: "Systems",
      title: "A2P and SMS",
      status: "Documented hold; live status unavailable",
      nextLevel: "Approved compliant SMS branch",
      nextAction: "Verify the current EIN and A2P status inside HighLevel.",
      owner: "Keenan",
      link: "https://app.gohighlevel.com/",
      source: "Current repo handoffs",
      verifiedAt,
    },
    {
      id: "cockpit-refresh",
      category: "Operations",
      title: "Daily cockpit refresh",
      status: "Private preview awaiting approval",
      nextLevel: "Verified 6:23 AM hosted refresh",
      nextAction: "Review the preview, then promote it and activate the paused automation.",
      owner: "Codex",
      link: "https://evermorelife.org/dashboard-preview",
      source: "Cockpit V3 implementation",
      verifiedAt,
    },
    {
      id: "festival-radar",
      category: "Life",
      title: "Festival radar",
      status: "Registry seeded; calendar sync pending review",
      nextLevel: "Confirmed events and tentative plans kept current automatically",
      nextAction: "Review event dates and approve tentative Calendar holds.",
      owner: "Keenan",
      link: "https://calendar.google.com/",
      source: "Gmail confirmations and Calendar",
      verifiedAt,
    },
  ];
}

function normalizePreviewGenerated(value) {
  const source = objectOrEmpty(value);
  const brief = objectOrEmpty(source.brief);
  return {
    date: cleanString(source.date),
    mission: cleanString(source.mission),
    nextAction: cleanString(source.nextAction),
    brief: {
      today: cleanString(brief.today),
      done: cleanString(brief.done),
      next: cleanString(brief.next),
      blockers: cleanString(brief.blockers),
    },
    priorities: stringArray(source.priorities, 5),
    schedule: stringArray(source.schedule, 20),
    cards: objectArray(source.cards, 30, normalizePreviewCard),
    metrics: objectArray(source.metrics, 20, normalizePreviewMetric),
    sourceHealth: normalizePreviewSourceHealth(source.sourceHealth),
    generatedAt: cleanString(source.generatedAt),
    generatedBy: cleanString(source.generatedBy),
  };
}

function normalizePreviewCard(value) {
  const source = objectOrEmpty(value);
  return {
    id: cleanString(source.id) || crypto.randomUUID(),
    category: cleanString(source.category),
    title: cleanString(source.title),
    status: cleanString(source.status),
    nextLevel: cleanString(source.nextLevel),
    nextAction: cleanString(source.nextAction),
    owner: cleanString(source.owner),
    link: safeUrl(source.link),
    source: cleanString(source.source),
    verifiedAt: cleanString(source.verifiedAt),
  };
}

function normalizePreviewMetric(value) {
  const source = objectOrEmpty(value);
  return {
    label: cleanString(source.label),
    value: cleanString(String(source.value ?? "")),
    detail: cleanString(source.detail),
    status: cleanString(source.status),
  };
}

function normalizePreviewSourceHealth(value) {
  const source = objectOrEmpty(value);
  const normalized = {};
  for (const [name, item] of Object.entries(source).slice(0, 20)) {
    const detail = typeof item === "string" ? { status: item } : objectOrEmpty(item);
    normalized[cleanString(name)] = {
      status: cleanString(detail.status) || "not-scanned",
      detail: cleanString(detail.detail),
      verifiedAt: cleanString(detail.verifiedAt),
    };
  }
  return normalized;
}

function defaultPreviewUser(productionUser) {
  const production = normalizeUserState(productionUser);
  return normalizePreviewUserState({
    main: production.main,
    projects: production.projects,
    wins: production.wins,
    tasks: [
      { id: "controlled-lead-test", title: "Run one controlled non-SMS lead test and record every downstream result", owner: "Keenan", done: false, link: "https://evermorelife.org/optin", notes: [] },
      { id: "connect-highlevel", title: "Connect HighLevel read-only API for leads, appointments, and pipeline snapshot", owner: "Keenan", done: false, link: "https://app.gohighlevel.com/", notes: [] },
      { id: "connect-meta", title: "Connect Meta read-only API for spend, delivery, clicks, and leads", owner: "Keenan", done: false, link: "https://business.facebook.com/adsmanager/manage/campaigns?act=324565498427892", notes: [] },
    ],
    projectLanes: defaultPreviewProjectLanes(),
  });
}

function normalizePreviewUserState(value, fallback = {}) {
  const source = objectOrEmpty(value);
  const previous = objectOrEmpty(fallback);
  return {
    main: objectOrEmpty(source.main || previous.main),
    projects: objectOrEmpty(source.projects || previous.projects),
    wins: objectArray(source.wins || previous.wins, 200, normalizePreviewWin),
    tasks: objectArray(source.tasks || previous.tasks, 200, normalizePreviewTask),
    projectLanes: objectArray(source.projectLanes || previous.projectLanes, 50, normalizePreviewProjectLane),
  };
}

function normalizePreviewTask(value) {
  const source = objectOrEmpty(value);
  return {
    id: cleanString(source.id) || crypto.randomUUID(),
    title: cleanString(source.title),
    owner: cleanString(source.owner) || "Keenan",
    link: safeUrl(source.link),
    done: Boolean(source.done),
    createdAt: cleanString(source.createdAt),
    completedAt: cleanString(source.completedAt),
    notes: objectArray(source.notes, 100, normalizePreviewNote),
  };
}

function normalizePreviewNote(value) {
  const source = typeof value === "string" ? { text: value } : objectOrEmpty(value);
  return {
    id: cleanString(source.id) || crypto.randomUUID(),
    text: cleanString(source.text),
    createdAt: cleanString(source.createdAt || source.ts),
  };
}

function normalizePreviewWin(value) {
  const source = objectOrEmpty(value);
  return {
    id: cleanString(source.id) || crypto.randomUUID(),
    title: cleanString(source.title),
    note: cleanString(source.note),
    createdAt: cleanString(source.createdAt || source.ts),
  };
}

function defaultPreviewProjectLanes() {
  return [
    {
      id: "revenue-launch",
      name: "Revenue launch proof",
      status: "Active",
      nextLevel: "First verified lead and booked-call attribution",
      nextAction: "Run the controlled lead test before spending on ads.",
      link: "https://evermorelife.org/optin",
      tasks: [
        { id: "verify-events", title: "Verify PageView, ViewContent, and Lead in Meta Test Events", done: false },
        { id: "verify-ghl", title: "Verify contact, opportunity, email, owner notification, and call task in HighLevel", done: false },
      ],
    },
    {
      id: "api-connections",
      name: "Read-only API connections",
      status: "Staged",
      nextLevel: "Live daily revenue and ad snapshots",
      nextAction: "Connect HighLevel first, then Meta.",
      link: "https://evermorelife.org/dashboard-preview",
      tasks: [
        { id: "highlevel-api", title: "Add HighLevel read-only credential", done: false },
        { id: "meta-api", title: "Add Meta Marketing API read-only credential", done: false },
      ],
    },
  ];
}

function normalizePreviewProjectLane(value) {
  const source = objectOrEmpty(value);
  return {
    id: cleanString(source.id) || crypto.randomUUID(),
    name: cleanString(source.name),
    status: cleanString(source.status),
    nextLevel: cleanString(source.nextLevel),
    nextAction: cleanString(source.nextAction),
    link: safeUrl(source.link),
    tasks: objectArray(source.tasks, 100, normalizePreviewTask),
  };
}

function defaultPreviewRegistry() {
  return normalizePreviewRegistry({
    festivals: [
      { id: "lost-lands-2026", name: "Lost Lands 2026", startDate: "2026-09-18", endDate: "2026-09-20", status: "on-the-books", annual: true, evidence: "Permanent annual entry; dates verified on official site", sourceLink: "https://www.lostlandsfestival.com/" },
      { id: "bass-canyon-2026", name: "Bass Canyon 2026", startDate: "2026-08-14", endDate: "2026-08-16", status: "on-the-books", annual: true, evidence: "Permanent annual entry; dates verified on official site", sourceLink: "https://www.basscanyon.com/" },
      { id: "edsea-2027", name: "EDSea 2027", startDate: "2027-01-26", endDate: "2027-01-31", status: "on-the-books", evidence: "Sixthman booking and processed-payment confirmations", sourceLink: "https://www.edsea.com/" },
      { id: "edc-lv-2027-dusk", name: "EDC Las Vegas 2027: Dusk", startDate: "2027-05-14", endDate: "2027-05-17", status: "on-the-books", evidence: "Insomniac Passport reservation and payment receipt", sourceLink: "https://lasvegas.electricdaisycarnival.com/" },
      { id: "edc-lv-2027-dawn", name: "EDC Las Vegas 2027: Dawn", startDate: "2027-05-21", endDate: "2027-05-24", status: "on-the-books", evidence: "Insomniac Passport reservation and payment receipt", sourceLink: "https://lasvegas.electricdaisycarnival.com/" },
      { id: "night-trip-az-2026", name: "Night Trip Festival Arizona 2026", startDate: "2026-08-29", endDate: "2026-08-29", status: "on-the-books", evidence: "Insomniac Passport reservation and Google Calendar event", sourceLink: "https://calendar.google.com/" },
      { id: "boo-az-2026", name: "BOO Arizona 2026", startDate: "2026-10-30", endDate: "2026-11-01", status: "on-the-books", evidence: "Insomniac Passport reservation and payment receipt", sourceLink: "https://www.insomniac.com/" },
      { id: "apocalypse-2026", name: "Apocalypse: Zombieland 2026", startDate: "2026-06-19", endDate: "2026-06-21", status: "on-the-books", evidence: "Insomniac Passport reservation and payment receipt", sourceLink: "https://www.insomniac.com/" },
      { id: "forbidden-kingdom-2027", name: "Forbidden Kingdom 2027", startDate: "2027-04-23", endDate: "2027-04-26", status: "on-the-books", evidence: "Insomniac Passport reservation and payment receipt", sourceLink: "https://www.insomniac.com/" },
      { id: "tomorrowland-thailand-2026", name: "Tomorrowland Thailand 2026", startDate: "2026-12-11", endDate: "2026-12-13", status: "planning", evidence: "Official organizer email supplies dates; no attendance confirmation", sourceLink: "https://thailand.tomorrowland.com/" },
      { id: "edc-thailand-2026", name: "EDC Thailand 2026", startDate: "2026-12-18", endDate: "2026-12-20", status: "planning", evidence: "Official organizer site supplies dates; no attendance confirmation", sourceLink: "https://thailand.electricdaisycarnival.com/" },
    ],
    cardConfiguration: [],
  });
}

function normalizePreviewRegistry(value, fallback = {}) {
  const source = objectOrEmpty(value);
  const previous = objectOrEmpty(fallback);
  return {
    festivals: objectArray(source.festivals || previous.festivals, 300, normalizePreviewFestival),
    cardConfiguration: objectArray(source.cardConfiguration || previous.cardConfiguration, 100, (item) => objectOrEmpty(item)),
  };
}

function normalizePreviewFestival(value) {
  const source = objectOrEmpty(value);
  const allowedStatuses = new Set(["on-the-books", "planning", "completed"]);
  return {
    id: cleanString(source.id) || crypto.randomUUID(),
    name: cleanString(source.name),
    startDate: cleanString(source.startDate),
    endDate: cleanString(source.endDate),
    status: allowedStatuses.has(source.status) ? source.status : "planning",
    annual: Boolean(source.annual),
    evidence: cleanString(source.evidence),
    sourceLink: safeUrl(source.sourceLink),
    calendarEventId: cleanString(source.calendarEventId),
    planningHoldApproved: Boolean(source.planningHoldApproved),
    createdAt: cleanString(source.createdAt),
    updatedAt: cleanString(source.updatedAt),
  };
}

function objectArray(value, maxItems, normalizer) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => item && typeof item === "object").slice(0, maxItems).map(normalizer);
}

function safeUrl(value) {
  const text = cleanString(value);
  if (!text) return "";
  try {
    const url = new URL(text);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
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

async function handleDashboardLogin(request, env, redirectPath = "/dashboard") {
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
    return serveDashboardLogin("That access code did not match.", `${redirectPath}/login`);
  }

  const redirectUrl = new URL(redirectPath, request.url);
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

function clearDashboardSession(request, redirectPath = "/dashboard") {
  const redirectUrl = new URL(redirectPath, request.url);
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

async function serveDashboardPreviewAsset(request, env) {
  const assetResponse = await env.DASHBOARD_ASSETS.fetch(`https://dashboard-assets.local${DASHBOARD_PREVIEW_ASSET_PATH}`);
  if (!assetResponse.ok) {
    return new Response("Dashboard preview is temporarily unavailable.", {
      status: 502,
      headers: privateHeaders(),
    });
  }

  const headers = privateHeaders(assetResponse.headers, { html: true });
  headers.set("x-evermore-deployment", "cloudflare-dashboard-preview");
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

function serveDashboardLogin(errorMessage = "", formAction = "/dashboard/login") {
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
    <form method="post" action="${escapeHtml(formAction)}">
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
    "Disallow: /dashboard-preview",
    "Disallow: /dashboard-preview/",
    "Disallow: /dashboard-preview/login",
    "Disallow: /dashboard-preview/logout",
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
