const SESSION_DAYS = 30;
const ENC_PREFIX = "enc:v1:";
const SENSITIVE_COLUMNS = ["ssn", "routing", "account", "dl_number", "intake_json"];
const MAX_JSON_BYTES = 350000;
const PBKDF2_ITERATIONS = 100000;
const CLIENT_COLUMNS = [
  "first_name", "middle_name", "last_name", "preferred_name", "call_date", "lead_source",
  "email", "phone", "address", "city", "state", "zip", "date_of_birth", "age", "gender",
  "height", "weight", "coverage_for", "existing_coverage", "has_permanent", "goal",
  "tobacco_use", "smoker", "health_notes", "medications", "meds_current", "meds_past",
  "diabetes", "a1c", "major_conditions", "surgeries", "doctor_name", "doctor_phone",
  "employer", "occupation", "annual_income", "coverage_amount", "product_type", "gold_cov",
  "gold_prem", "silver_cov", "silver_prem", "bronze_cov", "bronze_prem", "option_chosen",
  "coverage_type", "marital", "birth_state", "ssn", "dl_number", "dl_state", "dl_exp",
  "dl_history", "carrier", "policy_number", "final_coverage", "final_premium",
  "effective_date", "status", "appt_date_time", "premium", "payment_mode", "bank_name",
  "bank_type", "bank_state", "routing", "routing_last4", "account", "account_last4",
  "account_type", "pay_day", "ben1_name", "ben1_rel", "ben1_phone", "ben2_name",
  "ben2_rel", "ben2_phone", "referrals", "beneficiaries_json", "notes", "intake_json",
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return corsResponse(request, env);

    try {
      if (!env.DB) return json(request, env, { error: "Database binding is not configured." }, 503);
      if (!url.pathname.startsWith("/api/")) return json(request, env, { error: "Not found." }, 404);

      if (url.pathname === "/api/auth/signup" && request.method === "POST") {
        return await handleSignup(request, env);
      }
      if (url.pathname === "/api/auth/login" && request.method === "POST") {
        return await handleLogin(request, env);
      }
      if (url.pathname === "/api/auth/logout" && request.method === "POST") {
        return await handleLogout(request, env);
      }

      const auth = await requireUser(request, env);
      if (auth.error) return auth.error;
      const user = auth.user;

      if (url.pathname === "/api/clients") {
        if (request.method === "GET") return await listClients(request, env, user);
        if (request.method === "POST") return await createClient(request, env, user);
        return methodNotAllowed(request, env, "GET, POST");
      }

      const clientMatch = url.pathname.match(/^\/api\/clients\/([^/]+)$/);
      if (clientMatch) {
        if (request.method === "PUT") return await updateClient(request, env, user, clientMatch[1]);
        if (request.method === "DELETE") return await deleteClient(request, env, user, clientMatch[1]);
        return methodNotAllowed(request, env, "PUT, DELETE");
      }

      if (url.pathname === "/api/goals") {
        if (request.method === "GET") return await getGoals(request, env, user);
        if (request.method === "POST") return await saveGoals(request, env, user);
        return methodNotAllowed(request, env, "GET, POST");
      }

      if (url.pathname === "/api/scores") {
        if (request.method === "GET") return await listScores(request, env, user, url);
        return methodNotAllowed(request, env, "GET");
      }

      const scoreMatch = url.pathname.match(/^\/api\/scores\/(\d{4}-\d{2}-\d{2})$/);
      if (scoreMatch) {
        if (request.method === "GET") return await getScoreDay(request, env, user, scoreMatch[1]);
        if (request.method === "POST") return await saveScoreDay(request, env, user, scoreMatch[1]);
        return methodNotAllowed(request, env, "GET, POST");
      }

      if (url.pathname === "/api/owner/agents") {
        if (request.method === "GET") return await ownerAgents(request, env, user);
        return methodNotAllowed(request, env, "GET");
      }

      const ownerScoreMatch = url.pathname.match(/^\/api\/owner\/agents\/([^/]+)\/scores$/);
      if (ownerScoreMatch) {
        if (request.method === "GET") return await ownerAgentScores(request, env, user, ownerScoreMatch[1], url);
        return methodNotAllowed(request, env, "GET");
      }

      return json(request, env, { error: "Not found." }, 404);
    } catch (error) {
      console.error("agent-suite-api error:", safeDetail(error));
      return json(request, env, { error: "Server error." }, 500);
    }
  },
};

async function handleSignup(request, env) {
  const body = await readJson(request);
  if (body.error) return json(request, env, { error: body.error }, body.status);

  const email = cleanEmail(body.value.email);
  const password = String(body.value.password || "");
  const name = cleanString(body.value.name).slice(0, 120);
  const agencyId = cleanString(body.value.agency_id || body.value.agencyCode).slice(0, 80) || null;
  if (!email || !password || !name) return json(request, env, { error: "Name, email, and password are required." }, 400);
  if (password.length < 8) return json(request, env, { error: "Password must be at least 8 characters." }, 400);

  const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (existing) return json(request, env, { error: "An account already exists for that email." }, 409);

  const role = ownerEmails(env).has(email) ? "owner" : "agent";
  const userId = crypto.randomUUID();
  const passwordHash = await hashPassword(password);
  await env.DB.prepare(
    "INSERT INTO users (id, email, password_hash, name, role, agency_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
  ).bind(userId, email, passwordHash, name, role, agencyId, nowIso()).run();

  const session = await createSession(env, userId);
  return json(request, env, {
    token: session.token,
    expires_at: session.expires_at,
    user: { id: userId, email, name, role, agency_id: agencyId },
  }, 201);
}

async function handleLogin(request, env) {
  const body = await readJson(request);
  if (body.error) return json(request, env, { error: body.error }, body.status);
  const email = cleanEmail(body.value.email);
  const password = String(body.value.password || "");
  if (!email || !password) return json(request, env, { error: "Email and password are required." }, 400);

  const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return json(request, env, { error: "Invalid email or password." }, 401);
  }

  const session = await createSession(env, user.id);
  return json(request, env, {
    token: session.token,
    expires_at: session.expires_at,
    user: publicUser(user),
  });
}

async function handleLogout(request, env) {
  const token = bearerToken(request);
  if (token) await env.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
  return json(request, env, { ok: true });
}

async function requireUser(request, env) {
  const token = bearerToken(request);
  if (!token) return { error: json(request, env, { error: "Missing bearer token." }, 401) };
  const row = await env.DB.prepare(
    `SELECT users.id, users.email, users.name, users.role, users.agency_id, users.created_at, sessions.expires_at
     FROM sessions JOIN users ON users.id = sessions.user_id
     WHERE sessions.token = ?`,
  ).bind(token).first();
  if (!row) return { error: json(request, env, { error: "Invalid session." }, 401) };
  if (new Date(row.expires_at).getTime() <= Date.now()) {
    await env.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
    return { error: json(request, env, { error: "Session expired." }, 401) };
  }
  return { user: row };
}

async function createSession(env, userId) {
  const sessionId = crypto.randomUUID();
  const token = randomHex(32);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  await env.DB.prepare("INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)")
    .bind(sessionId, userId, token, expiresAt)
    .run();
  return { id: sessionId, token, expires_at: expiresAt };
}

async function getScoreDay(request, env, user, date) {
  const row = await env.DB.prepare("SELECT * FROM score_days WHERE user_id = ? AND date = ?").bind(user.id, date).first();
  return json(request, env, { date, data: scoreRowToDay(row, date) });
}

async function saveScoreDay(request, env, user, date) {
  const body = await readJson(request);
  if (body.error) return json(request, env, { error: body.error }, body.status);
  const day = normalizeScoreDay(body.value);
  const id = crypto.randomUUID();
  await env.DB.prepare(
    `INSERT INTO score_days (id, user_id, date, counters_json, feed_json, premiums_json, session_seconds, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id, date) DO UPDATE SET
       counters_json = excluded.counters_json,
       feed_json = excluded.feed_json,
       premiums_json = excluded.premiums_json,
       session_seconds = excluded.session_seconds,
       updated_at = excluded.updated_at`,
  ).bind(id, user.id, date, JSON.stringify(day.counters), JSON.stringify(day.feed), JSON.stringify(day.premiums), day.session_seconds, nowIso()).run();
  return json(request, env, { ok: true, date, data: day });
}

async function listScores(request, env, user, url) {
  const from = validDate(url.searchParams.get("from")) || "0000-01-01";
  const to = validDate(url.searchParams.get("to")) || "9999-12-31";
  const result = await env.DB.prepare(
    "SELECT * FROM score_days WHERE user_id = ? AND date >= ? AND date <= ? ORDER BY date ASC",
  ).bind(user.id, from, to).all();
  return json(request, env, { days: rowsToDays(result.results || []) });
}

async function getGoals(request, env, user) {
  const row = await env.DB.prepare("SELECT goals_json FROM goals WHERE user_id = ?").bind(user.id).first();
  return json(request, env, { goals: row ? parseJson(row.goals_json, {}) : {} });
}

async function saveGoals(request, env, user) {
  const body = await readJson(request);
  if (body.error) return json(request, env, { error: body.error }, body.status);
  const goals = objectOrEmpty(body.value.goals || body.value);
  await env.DB.prepare(
    `INSERT INTO goals (id, user_id, goals_json, updated_at) VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET goals_json = excluded.goals_json, updated_at = excluded.updated_at`,
  ).bind(crypto.randomUUID(), user.id, JSON.stringify(goals), nowIso()).run();
  return json(request, env, { ok: true, goals });
}

async function listClients(request, env, user) {
  const result = await env.DB.prepare("SELECT * FROM clients WHERE user_id = ? ORDER BY updated_at DESC").bind(user.id).all();
  const clients = await Promise.all((result.results || []).map((row) => clientRowToObject(env, row)));
  return json(request, env, { clients });
}

async function createClient(request, env, user) {
  const body = await readJson(request);
  if (body.error) return json(request, env, { error: body.error }, body.status);
  const { client } = normalizeClient(body.value);
  const id = crypto.randomUUID();
  await writeClient(env, user.id, id, client, null);
  return json(request, env, { id, client: { id, ...client } }, 201);
}

async function updateClient(request, env, user, id) {
  const body = await readJson(request);
  if (body.error) return json(request, env, { error: body.error }, body.status);
  const existing = await env.DB.prepare("SELECT intake_json FROM clients WHERE id = ? AND user_id = ?").bind(id, user.id).first();
  if (!existing) return json(request, env, { error: "Client not found." }, 404);
  const { client, provided, source } = normalizeClient(body.value);
  // Partial update: merge new intake data over the existing record instead of wiping unsent fields.
  const previousIntake = parseJson(await decryptValue(env, existing.intake_json), {});
  client.intake_json = JSON.stringify({ ...previousIntake, ...source });
  const columns = CLIENT_COLUMNS.filter((column) => provided.has(column));
  if (!columns.length) return json(request, env, { error: "No recognized fields to update." }, 400);
  await writeClient(env, user.id, id, client, columns);
  return json(request, env, { ok: true, updated: columns });
}

async function deleteClient(request, env, user, id) {
  await env.DB.prepare("DELETE FROM clients WHERE id = ? AND user_id = ?").bind(id, user.id).run();
  return json(request, env, { ok: true });
}

async function ownerAgents(request, env, user) {
  if (user.role !== "owner") return json(request, env, { error: "Owner access required." }, 403);
  const today = new Date().toISOString().slice(0, 10);
  const weekStart = dateDaysAgo(6);
  const users = await env.DB.prepare(
    "SELECT id, email, name, role, agency_id, created_at FROM users WHERE role = 'agent' ORDER BY created_at DESC",
  ).all();
  const scores = await env.DB.prepare(
    "SELECT user_id, date, counters_json, premiums_json, session_seconds FROM score_days WHERE date >= ? AND date <= ?",
  ).bind(weekStart, today).all();

  const summaryByUser = new Map();
  for (const row of scores.results || []) {
    const summary = summaryByUser.get(row.user_id) || emptySummary();
    const counters = parseJson(row.counters_json, {});
    const premiums = parseJson(row.premiums_json, []);
    addScore(summary.week, counters, premiums, row.session_seconds);
    if (row.date === today) addScore(summary.today, counters, premiums, row.session_seconds);
    summaryByUser.set(row.user_id, summary);
  }

  const agents = (users.results || []).map((agent) => ({
    ...publicUser(agent),
    summary: summaryByUser.get(agent.id) || emptySummary(),
  }));
  const agency = emptyMetricSet();
  for (const agent of agents) mergeMetricSet(agency, agent.summary.week);
  return json(request, env, { agents, agency, today, week_from: weekStart, week_to: today });
}

async function ownerAgentScores(request, env, user, agentId, url) {
  if (user.role !== "owner") return json(request, env, { error: "Owner access required." }, 403);
  const from = validDate(url.searchParams.get("from")) || dateDaysAgo(29);
  const to = validDate(url.searchParams.get("to")) || new Date().toISOString().slice(0, 10);
  const agent = await env.DB.prepare("SELECT id, email, name, role, agency_id, created_at FROM users WHERE id = ?").bind(agentId).first();
  if (!agent) return json(request, env, { error: "Agent not found." }, 404);
  const result = await env.DB.prepare(
    "SELECT * FROM score_days WHERE user_id = ? AND date >= ? AND date <= ? ORDER BY date ASC",
  ).bind(agentId, from, to).all();
  return json(request, env, { agent: publicUser(agent), days: rowsToDays(result.results || []) });
}

async function writeClient(env, userId, id, client, updateColumns) {
  const now = nowIso();
  const stored = { ...client };
  for (const column of SENSITIVE_COLUMNS) {
    if (stored[column]) stored[column] = await encryptValue(env, stored[column]);
  }
  if (updateColumns) {
    const assignments = updateColumns.map((column) => `${column} = ?`).join(", ");
    const values = updateColumns.map((column) => stored[column] ?? "");
    await env.DB.prepare(`UPDATE clients SET ${assignments}, updated_at = ? WHERE id = ? AND user_id = ?`)
      .bind(...values, now, id, userId)
      .run();
    return;
  }
  const placeholders = CLIENT_COLUMNS.map(() => "?").join(", ");
  await env.DB.prepare(
    `INSERT INTO clients (id, user_id, ${CLIENT_COLUMNS.join(", ")}, created_at, updated_at)
     VALUES (?, ?, ${placeholders}, ?, ?)`,
  ).bind(id, userId, ...CLIENT_COLUMNS.map((column) => stored[column] ?? ""), now, now).run();
}

function normalizeScoreDay(value) {
  const source = objectOrEmpty(value.data || value);
  return {
    counters: objectOrEmpty(source.counters),
    feed: Array.isArray(source.feed) ? source.feed.slice(0, 500) : [],
    premiums: Array.isArray(source.premiums) ? source.premiums.slice(0, 500) : [],
    session_seconds: Number(source.session_seconds ?? source.sessionTime ?? source.session_time ?? 0) || 0,
  };
}

function scoreRowToDay(row, date) {
  if (!row) return { counters: {}, feed: [], premiums: [], sessionTime: 0, session_seconds: 0, date };
  const sessionSeconds = Number(row.session_seconds || 0);
  return {
    date: row.date,
    counters: parseJson(row.counters_json, {}),
    feed: parseJson(row.feed_json, []),
    premiums: parseJson(row.premiums_json, []),
    sessionTime: sessionSeconds,
    session_seconds: sessionSeconds,
    updated_at: row.updated_at,
  };
}

function rowsToDays(rows) {
  const days = {};
  for (const row of rows) days[row.date] = scoreRowToDay(row, row.date);
  return days;
}

function normalizeClient(value) {
  const source = objectOrEmpty(value.client || value);
  const client = {};
  const provided = new Set();
  const has = (...keys) => keys.some((key) => source[key] !== undefined && source[key] !== null);
  const assign = (column, ...keys) => {
    client[column] = cleanString(firstValue(source, column, ...keys));
    if (has(column, ...keys)) provided.add(column);
  };

  assign("first_name", "firstName");
  assign("middle_name", "middleName");
  assign("last_name", "lastName");
  assign("preferred_name", "preferredName");
  assign("call_date", "callDate");
  assign("lead_source", "leadSource");
  client.email = cleanEmail(firstValue(source, "email"));
  if (has("email")) provided.add("email");
  assign("phone");
  assign("address");
  assign("city");
  assign("state");
  assign("zip");
  assign("date_of_birth", "dob");
  assign("age");
  assign("gender");
  assign("height");
  assign("weight");
  assign("coverage_for", "coverageFor");
  assign("existing_coverage", "existingCoverage");
  assign("has_permanent", "hasPermanent");
  assign("goal");
  assign("tobacco_use", "tobaccoUse");
  assign("smoker");
  assign("health_notes", "healthNotes");
  assign("medications");
  assign("meds_current", "medsCurrent");
  assign("meds_past", "medsPast");
  assign("diabetes");
  assign("a1c");
  assign("major_conditions", "majorConditions");
  assign("surgeries");
  assign("doctor_name", "doctorName");
  assign("doctor_phone", "doctorPhone");
  assign("employer");
  assign("occupation");
  assign("annual_income", "annualIncome");
  assign("coverage_amount", "coverageAmount");
  assign("product_type", "productType");
  assign("gold_cov", "goldCov");
  assign("gold_prem", "goldPrem");
  assign("silver_cov", "silverCov");
  assign("silver_prem", "silverPrem");
  assign("bronze_cov", "bronzeCov");
  assign("bronze_prem", "bronzePrem");
  assign("option_chosen", "optionChosen");
  assign("coverage_type", "coverageType");
  assign("marital");
  assign("birth_state", "birthState");
  assign("ssn");
  assign("dl_number", "dlNumber");
  assign("dl_state", "dlState");
  assign("dl_exp", "dlExp");
  assign("dl_history", "dlHistory");
  assign("carrier");
  assign("policy_number", "policyNumber");
  assign("final_coverage", "finalCoverage");
  assign("final_premium", "finalPremium");
  assign("effective_date", "effectiveDate");
  assign("status");
  assign("appt_date_time", "apptDateTime");
  assign("premium");
  assign("payment_mode", "paymentMode");
  assign("bank_name", "bankName");
  assign("bank_type", "bankType");
  assign("bank_state", "bankState");
  assign("routing");
  client.routing_last4 = last4(firstValue(source, "routing_last4", "routingNumber", "routing"));
  if (has("routing_last4", "routingNumber", "routing")) provided.add("routing_last4");
  assign("account");
  client.account_last4 = last4(firstValue(source, "account_last4", "accountNumber", "account"));
  if (has("account_last4", "accountNumber", "account")) provided.add("account_last4");
  assign("account_type", "accountType");
  assign("pay_day", "payDay");
  assign("ben1_name", "ben1Name");
  assign("ben1_rel", "ben1Rel");
  assign("ben1_phone", "ben1Phone");
  assign("ben2_name", "ben2Name");
  assign("ben2_rel", "ben2Rel");
  assign("ben2_phone", "ben2Phone");
  assign("referrals");
  client.beneficiaries_json = JSON.stringify(Array.isArray(source.beneficiaries) ? source.beneficiaries : parseJson(source.beneficiaries_json, []));
  if (has("beneficiaries", "beneficiaries_json")) provided.add("beneficiaries_json");
  client.notes = cleanString(source.notes);
  if (has("notes")) provided.add("notes");
  client.intake_json = JSON.stringify(source);
  provided.add("intake_json");
  return { client, provided, source };
}

async function clientRowToObject(env, row) {
  const out = { ...row };
  for (const column of SENSITIVE_COLUMNS) {
    if (out[column]) out[column] = await decryptValue(env, out[column]);
  }
  out.beneficiaries = parseJson(out.beneficiaries_json, []);
  out.intake = parseJson(out.intake_json, {});
  return out;
}

async function dataKey(env) {
  if (!env.DATA_KEY) return null;
  try {
    return await crypto.subtle.importKey("raw", fromBase64(env.DATA_KEY), "AES-GCM", false, ["encrypt", "decrypt"]);
  } catch {
    return null;
  }
}

async function encryptValue(env, value) {
  const text = String(value || "");
  if (!text || text.startsWith(ENC_PREFIX)) return text;
  const key = await dataKey(env);
  if (!key) return text; // no key configured yet: store as-is so nothing breaks pre-rollout
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(text)));
  return `${ENC_PREFIX}${base64(iv)}:${base64(cipher)}`;
}

async function decryptValue(env, value) {
  const text = String(value || "");
  if (!text.startsWith(ENC_PREFIX)) return text; // legacy plaintext rows
  const key = await dataKey(env);
  if (!key) return "";
  const [ivRaw, cipherRaw] = text.slice(ENC_PREFIX.length).split(":");
  try {
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromBase64(ivRaw) }, key, fromBase64(cipherRaw));
    return new TextDecoder().decode(plain);
  } catch {
    return "";
  }
}

function emptySummary() {
  return { today: emptyMetricSet(), week: emptyMetricSet() };
}

function emptyMetricSet() {
  return { dials: 0, contacted: 0, issued: 0, policies_issued: 0, total_premium: 0, total_commission: 0, session_seconds: 0 };
}

function addScore(target, counters, premiums, sessionSeconds) {
  target.dials += Number(counters.dials || 0);
  target.contacted += Number(counters.contacted || 0);
  target.issued += Number(counters.issued || 0);
  target.policies_issued = target.issued;
  target.session_seconds += Number(sessionSeconds || 0);
  for (const item of Array.isArray(premiums) ? premiums : []) {
    const premium = Number(item.premium || 0);
    const rate = Number(item.commRate || item.commission_rate || 80);
    target.total_premium += premium;
    target.total_commission += premium * rate / 100;
  }
}

function mergeMetricSet(target, source) {
  for (const key of Object.keys(target)) target[key] += Number(source[key] || 0);
}

async function readJson(request) {
  const text = await request.text();
  if (text.length > MAX_JSON_BYTES) return { error: "Request body is too large.", status: 413 };
  try {
    return { value: JSON.parse(text || "{}") };
  } catch {
    return { error: "Invalid JSON.", status: 400 };
  }
}

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await pbkdf2Key(password, salt, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" }, key, 256);
  return `pbkdf2_sha256$${PBKDF2_ITERATIONS}$${base64(salt)}$${base64(new Uint8Array(bits))}`;
}

async function verifyPassword(password, stored) {
  const [scheme, iterationsRaw, saltRaw, hashRaw] = String(stored || "").split("$");
  if (scheme !== "pbkdf2_sha256") return false;
  const iterations = Number(iterationsRaw);
  const salt = fromBase64(saltRaw);
  const expected = fromBase64(hashRaw);
  const key = await pbkdf2Key(password, salt, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations, hash: "SHA-256" }, key, expected.length * 8);
  return timingSafeEqual(new Uint8Array(bits), expected);
}

function pbkdf2Key(password, salt, usages) {
  return crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, usages);
}

function bearerToken(request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
}

function json(request, env, payload, status = 200, extraHeaders = {}) {
  const headers = corsHeaders(request, env);
  headers.set("content-type", "application/json; charset=utf-8");
  for (const [key, value] of Object.entries(extraHeaders)) headers.set(key, value);
  return new Response(JSON.stringify(payload), { status, headers });
}

function methodNotAllowed(request, env, allow) {
  return json(request, env, { error: "Method not allowed." }, 405, { allow });
}

function corsResponse(request, env) {
  const headers = corsHeaders(request, env);
  headers.set("access-control-max-age", "86400");
  headers.set("content-length", "0");
  return new Response(null, { status: 204, headers });
}

function corsHeaders(request, env) {
  const headers = new Headers();
  const origin = request.headers.get("origin") || "";
  const allowed = new Set(String(env.ALLOWED_ORIGINS || "").split(",").map((item) => item.trim()).filter(Boolean));
  if (allowed.has(origin)) headers.set("access-control-allow-origin", origin);
  headers.set("vary", "Origin");
  headers.set("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS");
  headers.set("access-control-allow-headers", "Authorization, Content-Type");
  return headers;
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role || "agent",
    agency_id: user.agency_id || null,
    created_at: user.created_at,
  };
}

function ownerEmails(env) {
  return new Set(String(env.OWNER_EMAILS || "").split(",").map(cleanEmail).filter(Boolean));
}

function randomHex(bytes) {
  const data = crypto.getRandomValues(new Uint8Array(bytes));
  return [...data].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function base64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value) {
  const binary = atob(value || "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

function cleanEmail(value) {
  return String(value || "").trim().toLowerCase().slice(0, 254);
}

function cleanString(value) {
  return String(value || "").trim();
}

function firstValue(source, ...keys) {
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) return source[key];
  }
  return "";
}

function objectOrEmpty(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function parseJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function validDate(value) {
  const text = String(value || "");
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : "";
}

function dateDaysAgo(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

function nowIso() {
  return new Date().toISOString();
}

function last4(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits ? digits.slice(-4) : "";
}

function safeDetail(error) {
  const message = error && error.message ? String(error.message) : "";
  return message.slice(0, 160);
}
