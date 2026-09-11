// Unit tests for the Agent Suite API worker.
// Run: node --test worker.test.mjs   (from this directory)
//
// Uses a minimal in-memory fake of the D1 `env.DB` binding — just enough SQL
// pattern-matching to serve the queries the worker actually issues. No network,
// no Cloudflare runtime.

import test from "node:test";
import assert from "node:assert/strict";
import worker from "./worker.js";

const TEST_DATA_KEY = Buffer.from(Uint8Array.from({ length: 32 }, (_, index) => index + 1)).toString("base64");

// ── Fake D1 ────────────────────────────────────────────────────────────────
function fakeDb(state) {
  // state: { users:[], sessions:[], clients:[], activities:[], growth_applications:[], score_days:[] }
  const db = {
    prepare(sql) {
      return {
        _sql: sql.replace(/\s+/g, " ").trim(),
        _binds: [],
        bind(...args) { this._binds = args; return this; },
        async first() { return run(this._sql, this._binds, "first"); },
        async all() { return { results: run(this._sql, this._binds, "all") }; },
        async run() { return run(this._sql, this._binds, "run"); },
      };
    },
  };

  function run(sql, binds, mode) {
    // sessions JOIN users (auth)
    if (sql.startsWith("SELECT users.id, users.email")) {
      const [token] = binds;
      const session = state.sessions.find((s) => s.token === token);
      if (!session) return null;
      const user = state.users.find((u) => u.id === session.user_id);
      if (!user) return null;
      return { ...user, expires_at: session.expires_at };
    }
    if (sql.startsWith("DELETE FROM sessions")) {
      state.sessions = state.sessions.filter((s) => s.token !== binds[0]);
      return { ok: true };
    }
    // clients ownership lookup for activities
    if (sql.startsWith("SELECT id, first_name, last_name FROM clients")) {
      const [id, userId] = binds;
      return state.clients.find((c) => c.id === id && c.user_id === userId) || null;
    }
    // client intake_json lookup for PUT
    if (sql.startsWith("SELECT intake_json FROM clients")) {
      const [id, userId] = binds;
      const row = state.clients.find((c) => c.id === id && c.user_id === userId);
      return row ? { intake_json: row.intake_json || "{}" } : null;
    }
    // full client list (dedupe scan)
    if (sql.startsWith("SELECT id, phone, first_name, last_name, intake_json FROM clients")) {
      return state.clients.filter((c) => c.user_id === binds[0]);
    }
    if (sql.startsWith("SELECT * FROM clients WHERE user_id")) {
      return state.clients.filter((c) => c.user_id === binds[0]);
    }
    // UPDATE clients SET <assignments>, updated_at = ? WHERE id = ? AND user_id = ?
    if (sql.startsWith("UPDATE clients SET")) {
      const assignments = sql.slice("UPDATE clients SET ".length, sql.indexOf(" WHERE "))
        .split(", ").map((a) => a.split(" = ")[0]);
      const values = binds.slice(0, assignments.length); // then id, user_id
      const id = binds[assignments.length];
      const userId = binds[assignments.length + 1];
      const row = state.clients.find((c) => c.id === id && c.user_id === userId);
      if (row) assignments.forEach((col, i) => { row[col] = values[i]; });
      return { ok: true };
    }
    if (sql.startsWith("INSERT INTO clients")) {
      // INSERT (id, user_id, ...CLIENT_COLUMNS, created_at, updated_at)
      const cols = sql.slice(sql.indexOf("(") + 1, sql.indexOf(")")).split(", ").map((c) => c.trim());
      const row = {};
      cols.forEach((col, i) => { row[col] = binds[i]; });
      state.clients.push(row);
      return { ok: true };
    }
    // growth applications
    if (sql.startsWith("INSERT INTO growth_applications")) {
      const columns = sql.slice(sql.indexOf("(") + 1, sql.indexOf(")")).split(", ").map((c) => c.trim());
      const row = {};
      columns.forEach((column, index) => { row[column] = binds[index]; });
      state.growth_applications.push(row);
      return { ok: true };
    }
    // activities
    if (sql.startsWith("INSERT INTO activities")) {
      const [id, user_id, client_id, type, note, premium, meta_json, created_at] = binds;
      state.activities.push({ id, user_id, client_id, type, note, premium, meta_json, created_at });
      return { ok: true };
    }
    if (sql.startsWith("SELECT activities.*")) {
      let rows = state.activities.filter((a) => a.user_id === binds[0]);
      let bindIndex = 1;
      if (sql.includes("activities.client_id = ?")) {
        const clientId = binds[bindIndex++];
        rows = rows.filter((a) => a.client_id === clientId);
      }
      if (sql.includes("activities.created_at < ?")) {
        const before = binds[bindIndex++];
        rows = rows.filter((a) => a.created_at < before);
      }
      const limit = binds[bindIndex];
      rows = [...rows].sort((a, b) => (a.created_at < b.created_at ? 1 : -1)).slice(0, limit);
      return rows.map((a) => {
        const client = state.clients.find((c) => c.id === a.client_id);
        return { ...a, c_first: client ? client.first_name : null, c_last: client ? client.last_name : null };
      });
    }
    if (sql.startsWith("DELETE FROM activities")) {
      const [id, userId] = binds;
      state.activities = state.activities.filter((a) => !(a.id === id && a.user_id === userId));
      return { ok: true };
    }
    // score_days (only to assert activities never touch them)
    if (sql.includes("score_days")) {
      state.scoreDayQueries = (state.scoreDayQueries || 0) + 1;
      if (mode === "all") return [];
      if (mode === "first") return null;
      return { ok: true };
    }
    throw new Error("fakeDb: unhandled SQL: " + sql);
  }

  return db;
}

function makeEnv(state, overrides = {}) {
  return { DB: fakeDb(state), ALLOWED_ORIGINS: "https://evermorelife.org", DATA_KEY: TEST_DATA_KEY, ...overrides };
}

function baseState() {
  const future = new Date(Date.now() + 86400000).toISOString();
  return {
    users: [
      { id: "u1", email: "a@x.com", name: "Agent A", role: "agent", agency_id: null, created_at: "2026-01-01" },
      { id: "u2", email: "b@x.com", name: "Agent B", role: "agent", agency_id: null, created_at: "2026-01-01" },
    ],
    sessions: [
      { id: "s1", user_id: "u1", token: "tok-u1", expires_at: future },
      { id: "s2", user_id: "u2", token: "tok-u2", expires_at: future },
    ],
    clients: [
      { id: "c1", user_id: "u1", first_name: "Jane", last_name: "Doe", phone: "5551234567", status: "In Progress", intake_json: "{}" },
      { id: "c2", user_id: "u2", first_name: "Bob", last_name: "Ray", phone: "5559876543", status: "In Progress", intake_json: "{}" },
    ],
    activities: [],
    growth_applications: [],
    score_days: [],
  };
}

test("POST /api/growth-applications stores a separate, consented B2B application", async () => {
  const state = baseState();
  const res = await worker.fetch(req("/api/growth-applications", {
    method: "POST",
    token: null,
    body: {
      first_name: "Alex", last_name: "Producer", email: "alex@example.com", phone: "555-555-1212",
      agency: "Example Agency", operating_model: "Solo producer", package_interest: "Growth",
      biggest_acquisition_problem: "Follow-up is inconsistent.", contact_consent: "on",
    },
  }), makeEnv(state));
  assert.equal(res.status, 201);
  const payload = await res.json();
  assert.equal(payload.ok, true);
  assert.equal(state.growth_applications.length, 1);
  assert.equal(state.growth_applications[0].package_interest, "Growth");
  assert.equal(state.clients.length, 2);
});

test("POST /api/growth-applications rejects missing consent and invalid package", async () => {
  const state = baseState();
  const res = await worker.fetch(req("/api/growth-applications", {
    method: "POST",
    token: null,
    body: {
      first_name: "Alex", last_name: "Producer", email: "alex@example.com", phone: "555-555-1212",
      agency: "Example Agency", operating_model: "Solo producer", package_interest: "Unknown",
      biggest_acquisition_problem: "Follow-up is inconsistent.", contact_consent: false,
    },
  }), makeEnv(state));
  assert.equal(res.status, 400);
  assert.equal(state.growth_applications.length, 0);
});

test("GET /api/growth-applications returns a method error without auth", async () => {
  const res = await worker.fetch(req("/api/growth-applications", { method: "GET", token: null }), makeEnv(baseState()));
  assert.equal(res.status, 405);
  assert.equal(res.headers.get("allow"), "POST, OPTIONS");
});

function req(path, { method = "GET", token = "tok-u1", body } = {}) {
  return new Request("https://api.evermorelife.org" + path, {
    method,
    headers: {
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(body ? { "content-type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

// ── Activities ─────────────────────────────────────────────────────────────

test("POST /api/activities rejects unknown type", async () => {
  const state = baseState();
  const res = await worker.fetch(req("/api/activities", { method: "POST", body: { type: "nonsense" } }), makeEnv(state));
  assert.equal(res.status, 400);
  assert.equal(state.activities.length, 0);
});

test("POST /api/activities requires ownership of client_id", async () => {
  const state = baseState();
  const res = await worker.fetch(
    req("/api/activities", { method: "POST", body: { type: "dial", client_id: "c2" } }),
    makeEnv(state),
  );
  assert.equal(res.status, 404);
  assert.equal(state.activities.length, 0);
});

test("POST /api/activities stores a valid activity and returns it", async () => {
  const state = baseState();
  const res = await worker.fetch(
    req("/api/activities", { method: "POST", body: { type: "appt_held", client_id: "c1", note: "great presentation", premium: 0 } }),
    makeEnv(state),
  );
  assert.equal(res.status, 201);
  const { activity } = await res.json();
  assert.equal(activity.type, "appt_held");
  assert.equal(activity.client_id, "c1");
  assert.equal(activity.client_name, "Jane Doe");
  assert.equal(activity.premium, null); // 0 premium stored as null
  assert.equal(state.activities.length, 1);
});

test("POST /api/activities clamps note length and keeps stage_change meta", async () => {
  const state = baseState();
  const res = await worker.fetch(
    req("/api/activities", {
      method: "POST",
      body: { type: "stage_change", client_id: "c1", note: "x".repeat(2000), meta: { from: "In Progress", to: "Applied" } },
    }),
    makeEnv(state),
  );
  assert.equal(res.status, 201);
  const { activity } = await res.json();
  assert.equal(activity.note.length, 500);
  assert.deepEqual(activity.meta, { from: "In Progress", to: "Applied" });
});

test("GET /api/activities is user-scoped, filtered, newest-first, limit-clamped", async () => {
  const state = baseState();
  for (let i = 0; i < 5; i += 1) {
    state.activities.push({
      id: "a" + i, user_id: "u1", client_id: i % 2 ? "c1" : null, type: "dial",
      note: "", premium: null, meta_json: "{}", created_at: `2026-07-0${i + 1}T00:00:00Z`,
    });
  }
  state.activities.push({ id: "ax", user_id: "u2", client_id: "c2", type: "dial", note: "", premium: null, meta_json: "{}", created_at: "2026-07-04T00:00:00Z" });

  const all = await (await worker.fetch(req("/api/activities"), makeEnv(state))).json();
  assert.equal(all.activities.length, 5); // u2's row excluded
  assert.equal(all.activities[0].id, "a4"); // newest first

  const filtered = await (await worker.fetch(req("/api/activities?client_id=c1"), makeEnv(state))).json();
  assert.equal(filtered.activities.length, 2);
  assert.ok(filtered.activities.every((a) => a.client_id === "c1" && a.client_name === "Jane Doe"));

  const clamped = await (await worker.fetch(req("/api/activities?limit=99999"), makeEnv(state))).json();
  assert.equal(clamped.activities.length, 5); // limit clamps to 200, we have 5

  const limited = await (await worker.fetch(req("/api/activities?limit=2"), makeEnv(state))).json();
  assert.equal(limited.activities.length, 2);
});

test("DELETE /api/activities/:id only deletes own rows", async () => {
  const state = baseState();
  state.activities.push({ id: "mine", user_id: "u1", client_id: null, type: "dial", note: "", premium: null, meta_json: "{}", created_at: "2026-07-01T00:00:00Z" });
  state.activities.push({ id: "theirs", user_id: "u2", client_id: null, type: "dial", note: "", premium: null, meta_json: "{}", created_at: "2026-07-01T00:00:00Z" });

  await worker.fetch(req("/api/activities/theirs", { method: "DELETE" }), makeEnv(state));
  assert.equal(state.activities.length, 2); // no cross-user delete

  const res = await worker.fetch(req("/api/activities/mine", { method: "DELETE" }), makeEnv(state));
  assert.equal(res.status, 200);
  assert.equal(state.activities.length, 1);
  assert.equal(state.activities[0].id, "theirs");
});

test("activity writes never touch score_days", async () => {
  const state = baseState();
  await worker.fetch(req("/api/activities", { method: "POST", body: { type: "dial" } }), makeEnv(state));
  await worker.fetch(req("/api/activities"), makeEnv(state));
  assert.equal(state.scoreDayQueries || 0, 0);
});

test("requests without a token get 401", async () => {
  const res = await worker.fetch(req("/api/activities", { token: null }), makeEnv(baseState()));
  assert.equal(res.status, 401);
});

// ── Intake sync contract regression ────────────────────────────────────────

test("POST /api/clients dedupes a migrated local id instead of creating a second row", async () => {
  const state = baseState();
  state.clients[0].intake_json = JSON.stringify({ id: "legacy-local-1", firstName: "Jane" });
  const res = await worker.fetch(
    req("/api/clients", {
      method: "POST",
      body: { id: "legacy-local-1", firstName: "Jane", lastName: "Doe", status: "Applied" },
    }),
    makeEnv(state),
  );
  assert.equal(res.status, 200);
  const payload = await res.json();
  assert.equal(payload.id, "c1");
  assert.equal(payload.deduped, true);
  assert.equal(state.clients.length, 2);
  assert.equal(state.clients[0].status, "Applied");
});

test("PUT /api/clients/:id with only status updates status and merges intake_json", async () => {
  const state = baseState();
  state.clients[0].intake_json = JSON.stringify({ id: "local-1", firstName: "Jane", goal: "Protect family" });
  state.clients[0].notes = "existing note";

  const res = await worker.fetch(
    req("/api/clients/c1", { method: "PUT", body: { status: "Applied" } }),
    makeEnv(state),
  );
  assert.equal(res.status, 200);
  const payload = await res.json();
  assert.ok(payload.updated.includes("status"));
  assert.ok(payload.updated.includes("intake_json"));
  // Only provided columns (plus merged intake_json) were written.
  assert.deepEqual(
    payload.updated.filter((c) => c !== "status" && c !== "intake_json"),
    [],
  );

  const row = state.clients[0];
  assert.equal(row.status, "Applied");
  assert.equal(row.notes, "existing note"); // untouched
  assert.match(row.intake_json, /^enc:v1:/);
  const listed = await (await worker.fetch(req("/api/clients"), makeEnv(state))).json();
  const mergedIntake = listed.clients.find((client) => client.id === "c1").intake;
  assert.equal(mergedIntake.goal, "Protect family"); // previous intake preserved
  assert.equal(mergedIntake.status, "Applied"); // new field merged over
});

test("client writes encrypt sensitive columns and return them only after authenticated decryption", async () => {
  const state = baseState();
  const res = await worker.fetch(
    req("/api/clients", {
      method: "POST",
      body: {
        firstName: "Secure",
        lastName: "Test",
        phone: "5551112222",
        ssn: "111-22-3333",
        routing: "123456789",
        account: "987654321",
      },
    }),
    makeEnv(state),
  );
  assert.equal(res.status, 201);
  const stored = state.clients.at(-1);
  for (const column of ["ssn", "routing", "account", "intake_json"]) {
    assert.match(stored[column], /^enc:v1:/);
  }
  assert.doesNotMatch(JSON.stringify(stored), /111-22-3333|123456789|987654321/);

  const listed = await (await worker.fetch(req("/api/clients"), makeEnv(state))).json();
  const restored = listed.clients.find((client) => client.id === stored.id);
  assert.equal(restored.ssn, "111-22-3333");
  assert.equal(restored.routing, "123456789");
  assert.equal(restored.account, "987654321");
});

test("client writes fail closed when DATA_KEY is missing", async () => {
  const state = baseState();
  const res = await worker.fetch(
    req("/api/clients", { method: "POST", body: { firstName: "Do", lastName: "Not Store" } }),
    makeEnv(state, { DATA_KEY: "" }),
  );
  assert.equal(res.status, 503);
  assert.deepEqual(await res.json(), { error: "Secure client storage is temporarily unavailable." });
  assert.equal(state.clients.length, 2);
});
