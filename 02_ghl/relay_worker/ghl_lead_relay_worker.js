const GHL_BASE_URL = "https://services.leadconnectorhq.com";
const MAX_BODY_BYTES = 64 * 1024;

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

      if (request.method === "OPTIONS") {
        return handleOptions(request, env);
      }

      if (request.method === "GET" && url.pathname === "/health") {
        return json({ ok: true, service: "evermore-ghl-lead-relay" }, 200, request, env);
      }

      if (request.method !== "POST" || !["/", "/api/lead"].includes(url.pathname)) {
        return json({ ok: false, error: "Not found" }, 404, request, env);
      }

      const originCheck = checkOrigin(request, env);
      if (!originCheck.ok) {
        return json({ ok: false, error: "Origin not allowed" }, 403, request, env);
      }

      const contentLength = Number(request.headers.get("content-length") || "0");
      if (contentLength > MAX_BODY_BYTES) {
        return json({ ok: false, error: "Payload too large" }, 413, request, env);
      }

      const input = await readJson(request);
      if (isBotSubmission(input)) {
        return json({ ok: true, ignored: true }, 200, request, env);
      }

      const lead = normalizeLead(input, env);
      const validation = validateLead(lead);
      if (!validation.ok) {
        return json({ ok: false, error: validation.error }, 422, request, env);
      }

      const ghlResult = await upsertContact(lead, env);
      ctx.waitUntil(logLeadResult(lead, ghlResult));

      return json({
        ok: true,
        contactId: ghlResult.contactId || null,
        preview: false,
      }, 200, request, env);
    } catch (error) {
      console.error(JSON.stringify({
        event: "lead_relay_error",
        message: error instanceof Error ? error.message : String(error),
      }));
      return json({ ok: false, error: "Lead relay failed" }, 500, request, env);
    }
  },
};

function handleOptions(request, env) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request, env),
  });
}

function json(data, status, request, env) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders(request, env),
    },
  });
}

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = allowedOrigins(env);
  const allowOrigin = allowed.includes(origin) ? origin : allowed[0] || "";
  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
  if (allowOrigin) {
    headers["Access-Control-Allow-Origin"] = allowOrigin;
  }
  return headers;
}

function allowedOrigins(env) {
  return String(env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function checkOrigin(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = allowedOrigins(env);
  if (allowed.length === 0) {
    return { ok: false };
  }
  if (!origin && env.ALLOW_SERVER_TO_SERVER_TESTS === "1") {
    return { ok: true };
  }
  return { ok: allowed.includes(origin) };
}

async function readJson(request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new Error("Expected application/json");
  }
  const text = await request.text();
  return JSON.parse(text);
}

function isBotSubmission(input) {
  return Boolean(
    input.website ||
    input.company_website ||
    input.fax ||
    input.hidden_field ||
    input.hp
  );
}

function normalizeLead(input, env) {
  const fullName = clean(input.name || input.full_name || "");
  const split = splitName(fullName);
  const firstName = clean(input.firstName || input.first_name || split.firstName);
  const lastName = clean(input.lastName || input.last_name || split.lastName);
  const email = clean(input.email);
  const phone = clean(input.phone);
  const smsConsent = clean(input.smsConsent || input.sms_consent).toLowerCase() === "yes";
  const source = clean(input.source) || "Evermore Life Landing Page";
  const defaultTags = String(env.GHL_DEFAULT_TAGS || "evermore-life-lead")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return {
    firstName,
    lastName,
    email,
    phone,
    locationId: env.GHL_LOCATION_ID,
    source: [
      source,
      clean(input.utm_source) ? `utm_source=${clean(input.utm_source)}` : "",
      clean(input.utm_campaign) ? `utm_campaign=${clean(input.utm_campaign)}` : "",
      clean(input.page_url) ? `page=${clean(input.page_url).slice(0, 180)}` : "",
    ].filter(Boolean).join(" | "),
    tags: unique([
      ...defaultTags,
      smsConsent ? "sms-consent-yes" : "sms-consent-no",
      clean(input.lead_type || "life-insurance-lead"),
    ]),
  };
}

function validateLead(lead) {
  if (!lead.locationId) return { ok: false, error: "Missing location configuration" };
  if (!lead.phone && !lead.email) return { ok: false, error: "Phone or email is required" };
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return { ok: false, error: "Email is invalid" };
  }
  if (lead.phone && lead.phone.replace(/\D/g, "").length < 10) {
    return { ok: false, error: "Phone is invalid" };
  }
  return { ok: true };
}

async function upsertContact(lead, env) {
  if (!env.GHL_PRIVATE_TOKEN) {
    throw new Error("Missing GHL_PRIVATE_TOKEN secret");
  }

  const response = await fetch(`${GHL_BASE_URL}/contacts/upsert`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Authorization": bearer(env.GHL_PRIVATE_TOKEN),
      "Content-Type": "application/json",
      "Version": env.GHL_API_VERSION || "2021-07-28",
    },
    body: JSON.stringify(lead),
  });

  const raw = await response.text();
  let body = {};
  if (raw) {
    try {
      body = JSON.parse(raw);
    } catch {
      body = { raw };
    }
  }

  if (!response.ok) {
    console.error(JSON.stringify({
      event: "ghl_upsert_failed",
      status: response.status,
      body,
    }));
    throw new Error(`HighLevel upsert failed with ${response.status}`);
  }

  return {
    status: response.status,
    body,
    contactId: body.contact?.id || body.id || body.contactId || null,
  };
}

async function logLeadResult(lead, result) {
  console.log(JSON.stringify({
    event: "lead_upserted",
    contactId: result.contactId || null,
    hasPhone: Boolean(lead.phone),
    hasEmail: Boolean(lead.email),
    source: lead.source,
  }));
}

function bearer(token) {
  return token.toLowerCase().startsWith("bearer ") ? token : `Bearer ${token}`;
}

function clean(value) {
  return String(value || "").trim();
}

function splitName(name) {
  const parts = clean(name).split(/\s+/).filter(Boolean);
  return {
    firstName: parts.shift() || "",
    lastName: parts.join(" "),
  };
}

function unique(items) {
  return [...new Set(items.map(clean).filter(Boolean))];
}
