(function (root) {
  "use strict";

  const SERVER_FIELD_ALIASES = {
    firstName: "first_name", lastName: "last_name", callDate: "call_date", leadSource: "lead_source",
    dob: "date_of_birth", coverageFor: "coverage_for", existingCoverage: "existing_coverage",
    hasPermanent: "has_permanent", medsCurrent: "meds_current", medsPast: "meds_past",
    majorConditions: "major_conditions", goldCov: "gold_cov", goldPrem: "gold_prem",
    silverCov: "silver_cov", silverPrem: "silver_prem", bronzeCov: "bronze_cov",
    bronzePrem: "bronze_prem", optionChosen: "option_chosen", coverageType: "coverage_type",
    birthState: "birth_state", dlNumber: "dl_number", dlState: "dl_state", dlExp: "dl_exp",
    dlHistory: "dl_history", bankName: "bank_name", bankType: "bank_type", bankState: "bank_state",
    accountType: "account_type", payDay: "pay_day", policyNumber: "policy_number",
    finalCoverage: "final_coverage", finalPremium: "final_premium", effectiveDate: "effective_date",
    apptDateTime: "appt_date_time", ben1Name: "ben1_name", ben1Rel: "ben1_rel",
    ben1Phone: "ben1_phone", ben2Name: "ben2_name", ben2Rel: "ben2_rel", ben2Phone: "ben2_phone",
  };

  const DIRECT_FIELDS = [
    "email", "phone", "address", "state", "age", "height", "weight", "goal", "smoker",
    "diabetes", "a1c", "surgeries", "ssn", "routing", "account", "carrier", "status",
    "referrals", "notes",
  ];

  const SENSITIVE_DRAFT_FIELDS = new Set([
    "ssn", "dlNumber", "dlState", "dlExp", "dlHistory",
    "bankName", "bankType", "bankState", "routing", "account", "accountType", "payDay",
    "authorizationCode",
  ]);

  function serverRowToClient(row) {
    const client = row.intake && typeof row.intake === "object" ? { ...row.intake } : {};
    DIRECT_FIELDS.forEach((key) => {
      if (row[key] !== undefined && row[key] !== null) client[key] = row[key];
    });
    Object.entries(SERVER_FIELD_ALIASES).forEach(([clientKey, rowKey]) => {
      if (row[rowKey] !== undefined && row[rowKey] !== null) client[clientKey] = row[rowKey];
    });
    client.id = row.id;
    client.serverId = row.id;
    client.updated = row.updated_at || client.updated || "";
    return client;
  }

  function sanitizeDraft(form) {
    const draft = { ...(form || {}) };
    SENSITIVE_DRAFT_FIELDS.forEach((key) => { delete draft[key]; });
    return draft;
  }

  function safeExportClients(clients) {
    return (clients || []).map((client) => sanitizeDraft(client));
  }

  async function mergeLegacyClients(legacyClients, api) {
    let count = 0;
    for (const legacy of legacyClients || []) {
      const payload = { ...legacy };
      delete payload.serverId;
      delete payload.syncPending;
      try {
        let id = legacy.serverId || "";
        if (id) {
          try {
            await api("/clients/" + encodeURIComponent(id), { method: "PUT", body: JSON.stringify(payload) });
          } catch (error) {
            if (!/not found/i.test((error && error.message) || "")) throw error;
            const out = await api("/clients", { method: "POST", body: JSON.stringify(payload) });
            id = out.id;
          }
        } else {
          const out = await api("/clients", { method: "POST", body: JSON.stringify(payload) });
          id = out.id;
        }
        if (!id) return { ok: false, count };
        count += 1;
      } catch (error) {
        return { ok: false, count, error };
      }
    }
    return { ok: true, count };
  }

  root.EvermoreIntakeContinuity = {
    SENSITIVE_DRAFT_FIELDS,
    mergeLegacyClients,
    safeExportClients,
    sanitizeDraft,
    serverRowToClient,
  };
})(globalThis);
