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

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }

  function installTopNav(title) {
    if (document.getElementById("agentSuiteNav")) return;
    const currentUser = user();
    const role = currentUser.role || localStorage.getItem(ROLE_KEY);
    const name = escapeHtml(currentUser.name || localStorage.getItem(NAME_KEY) || "Agent");
    const path = window.location.pathname;
    const cls = (href) => (path.indexOf(href) === 0 ? ' class="active"' : "");
    const nav = document.createElement("nav");
    nav.id = "agentSuiteNav";
    nav.innerHTML = `
      <div class="navLogo">Evermore Life</div>
      <div class="navLinks">
        <a href="/score-tracker/"${cls("/score-tracker/")}>Score Tracker</a>
        <a href="/growth-calculator/"${cls("/growth-calculator/")}>Growth Calculator</a>
        <a href="/clients/"${cls("/clients/")}>Pipeline</a>
        ${role === "owner" ? `<a href="/team/"${cls("/team/")}>Team</a>` : ""}
      </div>
      <div class="navRight">
        <div class="navUser">Welcome, <strong>${name}</strong></div>
        <button type="button" id="agentSuiteLogout" class="navBtn">Log Out</button>
      </div>
    `;
    document.body.prepend(nav);
    document.getElementById("agentSuiteLogout").addEventListener("click", logout);
    const style = document.createElement("style");
    style.textContent = `
      #agentSuiteNav{background:#0d1525;border-bottom:1px solid #1e2f4a;padding:0 24px;display:flex;align-items:center;gap:16px;height:56px;position:sticky;top:0;z-index:1000;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
      #agentSuiteNav .navLogo{font-family:Palatino,Georgia,serif;font-size:17px;color:#d4b576;font-weight:700;letter-spacing:.04em;white-space:nowrap}
      #agentSuiteNav .navLinks{display:flex;gap:4px;flex:1;margin-left:8px}
      #agentSuiteNav .navLinks a{padding:6px 12px;border-radius:7px;font-size:13px;color:#8fa3c2;transition:all .15s;text-decoration:none}
      #agentSuiteNav .navLinks a:hover{background:#19243c;color:#d4b576}
      #agentSuiteNav .navLinks a.active{background:#1d2c4a;color:#d4b576}
      #agentSuiteNav .navRight{display:flex;align-items:center;gap:10px;margin-left:auto}
      #agentSuiteNav .navUser{font-size:13px;color:#8fa3c2;white-space:nowrap}
      #agentSuiteNav .navUser strong{color:#d4b576}
      #agentSuiteNav .navBtn{padding:6px 14px;border-radius:7px;font-size:13px;cursor:pointer;border:1px solid #34507d;background:transparent;color:#a9bcd9;transition:all .15s}
      #agentSuiteNav .navBtn:hover{background:#22324f;border-color:#d4b57688;color:#d4b576}
      @media(max-width:640px){#agentSuiteNav{padding:0 12px;gap:8px}#agentSuiteNav .navUser{display:none}#agentSuiteNav .navLinks{gap:2px;overflow-x:auto}#agentSuiteNav .navLinks a{padding:6px 8px;font-size:12px;white-space:nowrap}#agentSuiteNav .navLogo{font-size:15px}}
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
