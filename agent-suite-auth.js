(function () {
  const isLocalPreview = ["127.0.0.1", "localhost"].includes(window.location.hostname);
  const API_BASE = isLocalPreview ? "http://127.0.0.1:8787/api" : "https://api.evermorelife.org/api";
  const TOKEN_KEY = "evermore-auth-token";
  const USER_KEY = "evermore-auth-user";
  const NAME_KEY = "evermore-user-name";
  const ROLE_KEY = "evermore-user-role";

  function token() {
    return localStorage.getItem(TOKEN_KEY) || "";
  }

  function user() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveSession(payload) {
    if (!payload || !payload.token || !payload.user) throw new Error("Invalid server response.");
    localStorage.setItem(TOKEN_KEY, payload.token);
    localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
    localStorage.setItem(NAME_KEY, payload.user.name || "");
    localStorage.setItem(ROLE_KEY, payload.user.role || "agent");
  }

  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(NAME_KEY);
    localStorage.removeItem(ROLE_KEY);
  }

  function requireAuth() {
    if (!token()) {
      window.location.replace("/login/");
      return false;
    }
    return true;
  }

  async function api(path, options = {}) {
    const headers = new Headers(options.headers || {});
    if (!headers.has("content-type") && options.body) headers.set("content-type", "application/json");
    const currentToken = token();
    if (currentToken) headers.set("authorization", `Bearer ${currentToken}`);
    const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (response.status === 401) {
      clearSession();
      window.location.replace("/login/");
      throw new Error(data.error || "Login required.");
    }
    if (!response.ok) throw new Error(data.error || "Server error.");
    return data;
  }

  async function logout() {
    const currentToken = token();
    clearSession();
    if (currentToken) {
      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          headers: { authorization: `Bearer ${currentToken}` },
        });
      } catch {}
    }
    window.location.replace("/login/");
  }

  function installTopNav(title) {
    if (document.getElementById("agentSuiteNav")) return;
    const currentUser = user();
    const nav = document.createElement("div");
    nav.id = "agentSuiteNav";
    nav.innerHTML = `
      <a href="/score-tracker/">Score Tracker</a>
      <a href="/growth-calculator/">Growth Calculator</a>
      ${(currentUser.role || localStorage.getItem(ROLE_KEY)) === "owner" ? '<a href="/team/">Team Dashboard</a>' : ""}
      <span>${title || document.title || "Evermore"}</span>
      <strong>${currentUser.name || localStorage.getItem(NAME_KEY) || ""}</strong>
      <button type="button" id="agentSuiteLogout">Logout</button>
    `;
    document.body.prepend(nav);
    document.getElementById("agentSuiteLogout").addEventListener("click", logout);
    const style = document.createElement("style");
    style.textContent = `
      body{padding-top:52px}
      #agentSuiteNav{position:fixed;top:0;left:0;right:0;z-index:1000;display:flex;align-items:center;gap:14px;padding:10px 16px;background:#09111f;border-bottom:1px solid #253650;color:#e9eef7;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      #agentSuiteNav a{color:#d4b576;text-decoration:none;font-size:13px;font-weight:700}
      #agentSuiteNav span{margin-left:auto;color:#8c9cb5;font-size:13px}
      #agentSuiteNav strong{font-size:13px;color:#fff}
      #agentSuiteNav button{border:1px solid #d4b57666;background:transparent;color:#d4b576;border-radius:8px;padding:7px 10px;font-weight:700;cursor:pointer}
      @media(max-width:640px){#agentSuiteNav{gap:8px;overflow-x:auto}#agentSuiteNav span{display:none}#agentSuiteNav a,#agentSuiteNav strong,#agentSuiteNav button{white-space:nowrap;font-size:12px}}
    `;
    document.head.appendChild(style);
  }

  window.EvermoreAgentSuite = {
    API_BASE,
    TOKEN_KEY,
    USER_KEY,
    NAME_KEY,
    ROLE_KEY,
    token,
    user,
    saveSession,
    clearSession,
    requireAuth,
    api,
    logout,
    installTopNav,
  };
})();
