import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../../agent-suite-intake-continuity.js", import.meta.url), "utf8");
const context = { globalThis: {} };
vm.runInNewContext(source, context);
const continuity = context.globalThis.EvermoreIntakeContinuity;

const authSource = fs.readFileSync(new URL("../../agent-suite-auth.js", import.meta.url), "utf8");
const authStorage = new Map();
const authContext = {
  window: { location: { hostname: "evermorelife.org", pathname: "/inbound-client-intake/", replace() {} } },
  localStorage: {
    getItem: (key) => authStorage.get(key) || null,
    setItem: (key, value) => authStorage.set(key, value),
    removeItem: (key) => authStorage.delete(key),
  },
  Headers,
  fetch,
  Intl,
  Date,
  URL,
  setTimeout,
};
vm.runInNewContext(authSource, authContext);

test("browser date keys stay on the Phoenix calendar after UTC midnight", () => {
  const dateKey = authContext.window.EvermoreAgentSuite.dateKey;
  assert.equal(dateKey(new Date("2026-07-11T00:30:00Z")), "2026-07-10");
  assert.equal(dateKey(new Date("2026-07-11T07:30:00Z")), "2026-07-11");
});

test("server rows become Intake records with server identity and canonical pipeline fields", () => {
  const client = continuity.serverRowToClient({
    id: "server-1",
    first_name: "Server",
    status: "Applied",
    appt_date_time: "2026-07-11T10:00",
    intake: { id: "legacy-1", firstName: "Legacy", goal: "Protect family" },
  });
  assert.equal(client.id, "server-1");
  assert.equal(client.serverId, "server-1");
  assert.equal(client.firstName, "Server");
  assert.equal(client.status, "Applied");
  assert.equal(client.apptDateTime, "2026-07-11T10:00");
  assert.equal(client.goal, "Protect family");
});

test("draft cache and safe exports exclude every sensitive Inbound Intake field", () => {
  const sourceClient = {
    firstName: "Safe",
    ssn: "111-22-3333",
    dlNumber: "D123",
    dlState: "AZ",
    routing: "123456789",
    account: "987654321",
    bankName: "Bank",
    payDay: "Friday",
    authorizationCode: "123456",
  };
  const draft = continuity.sanitizeDraft(sourceClient);
  assert.deepEqual(Object.keys(draft), ["firstName"]);
  assert.equal(sourceClient.ssn, "111-22-3333", "sanitizing must not mutate in-memory values");
  const exported = continuity.safeExportClients([sourceClient]);
  assert.deepEqual(Object.keys(exported[0]), ["firstName"]);
});

test("legacy migration POSTs local-only records and accepts deduped ids", async () => {
  const calls = [];
  const api = async (path, options) => {
    calls.push({ path, method: options.method, body: JSON.parse(options.body) });
    return { id: "existing-server-id" };
  };
  const result = await continuity.mergeLegacyClients([{ id: "local-1", firstName: "One" }], api);
  assert.equal(result.ok, true);
  assert.equal(result.count, 1);
  assert.equal(calls[0].path, "/clients");
  assert.equal(calls[0].method, "POST");
});

test("legacy migration recovers stale links through deduped POST", async () => {
  const calls = [];
  const api = async (path, options) => {
    calls.push({ path, method: options.method });
    if (options.method === "PUT") throw new Error("Client not found.");
    return { id: "relinked-server-id" };
  };
  const result = await continuity.mergeLegacyClients([{ id: "local-2", serverId: "missing" }], api);
  assert.equal(result.ok, true);
  assert.equal(result.count, 1);
  assert.deepEqual(calls, [
    { path: "/clients/missing", method: "PUT" },
    { path: "/clients", method: "POST" },
  ]);
});

test("legacy migration does not complete after a network interruption", async () => {
  let calls = 0;
  const api = async () => {
    calls += 1;
    if (calls === 2) throw new Error("network unavailable");
    return { id: "server-" + calls };
  };
  const result = await continuity.mergeLegacyClients([
    { id: "local-1" },
    { id: "local-2" },
    { id: "local-3" },
  ], api);
  assert.equal(result.ok, false);
  assert.equal(result.count, 1);
  assert.equal(calls, 2);
});
