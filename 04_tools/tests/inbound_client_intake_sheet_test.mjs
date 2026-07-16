import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const canonicalPath = new URL("../../inbound-client-intake/index.html", import.meta.url);
const compatibilityPath = new URL("../../01_website/experiments/Client-Intake-Guided.html", import.meta.url);
const canonical = fs.readFileSync(canonicalPath, "utf8");
const compatibility = fs.readFileSync(compatibilityPath, "utf8");

function inlineScripts(html) {
  return [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
}

test("approved inbound sheet keeps its canonical identity and complete flow", () => {
  assert.match(canonical, /<title>Evermore Life — Inbound Client Intake Sheet<\/title>/);
  assert.match(canonical, /<span class="assetBadge">Inbound Client Intake Sheet<\/span>/);
  assert.doesNotMatch(canonical, />\s*Experiment\s*</i);
  assert.doesNotMatch(canonical, /Inbound Client Intake Sheet\s*[·—-]\s*Guided/i);

  const sections = [...canonical.matchAll(/<section id="sec(\d+)"/g)].map((match) => Number(match[1]));
  assert.deepEqual(sections, Array.from({ length: 15 }, (_, index) => index + 1));
  assert.equal((canonical.match(/<details class="script"/g) || []).length, 16);
  assert.equal((canonical.match(/class="transitionNote"/g) || []).length, 13);
});

test("critical handoffs and the inbound referral close remain present", () => {
  assert.match(canonical, /You're going to receive a 6-digit code by text\. I'll just need you to read that back to me when you receive it\./);
  assert.match(canonical, /Give me just a couple of moments while I get some answers\./);
  assert.match(canonical, /Approved close-out — continue only after the carrier confirms approval/);
  assert.match(canonical, /Call script — VIBS referral close/);
  assert.match(canonical, /a referral is not automatic consent for marketing texts/i);
});

test("temporary authorization code is excluded from saved client fields", () => {
  const codeInput = canonical.match(/<input[^>]*id="authorizationCode"[^>]*>/)?.[0] || "";
  assert.ok(codeInput, "authorization code input should exist");
  assert.doesNotMatch(codeInput, /data-field=/);
  assert.match(codeInput, /autocomplete="one-time-code"/);
  assert.match(codeInput, /maxlength="6"/);
  assert.match(canonical, /function newClient\(options = \{\}\)[\s\S]*?\$\('#authorizationCode'\)\.value = '';/);
  assert.match(canonical, /function loadClient\(id, options = \{\}\)[\s\S]*?\$\('#authorizationCode'\)\.value = '';/);
});

test("inbound sheet requires Agent Suite auth and uses server client CRUD", () => {
  assert.match(canonical, /<script src="\/agent-suite-auth\.js"><\/script>/);
  assert.match(canonical, /<script src="\/agent-suite-intake-continuity\.js"><\/script>/);
  assert.match(canonical, /suite\.requireAuth\(\)/);
  assert.match(canonical, /suite\.installTopNav\('Inbound Intake'\)/);
  assert.match(canonical, /suite\.api\('\/clients'\)/);
  assert.match(canonical, /method:'POST'/);
  assert.match(canonical, /method:'PUT'/);
  assert.match(canonical, /method:'DELETE'/);
  assert.doesNotMatch(canonical, /localStorage\.setItem\(STORE, JSON\.stringify\(clients\)\)/);
});

test("browser persistence is limited to sanitized drafts and migration metadata", () => {
  assert.match(canonical, /continuity\.sanitizeDraft\(readForm\(\)\)/);
  assert.match(canonical, /DRAFT_PREFIX = 'evermore_inbound_draft_v1:';/);
  assert.match(canonical, /MIGRATION_PREFIX = 'evermore_inbound_migration_v1:';/);
  assert.match(canonical, /continuity\.safeExportClients\(clients\)/);
  assert.match(canonical, /result\.count !== legacy\.length/);
  assert.match(canonical, /Remove the old browser-only copy from this device now\?/);
});

test("legacy experiment URL redirects to the single canonical source", () => {
  assert.match(compatibility, /<link rel="canonical" href="\/inbound-client-intake\/">/);
  assert.match(compatibility, /window\.location\.replace\('\/inbound-client-intake\/'/);
  assert.equal((compatibility.match(/<section id=/g) || []).length, 0);
});

test("all inline JavaScript parses", () => {
  for (const source of [...inlineScripts(canonical), ...inlineScripts(compatibility)]) {
    assert.doesNotThrow(() => new Function(source));
  }
});
