/* ============================================================
   EVERMORE LIFE — Agent Suite shared activity layer
   window.EvermoreActivity

   One source of truth for:
   - TYPES: activity types ↔ Score Tracker counters ↔ icons/colors
     (server mirror: ACTIVITY_TYPES allowlist in agent-suite-api worker.js)
   - STATUSES: the canonical pipeline stages (identical to the intake's list)
   - logActivity(): writes an activity row to the API (offline-queued) and,
     unless skipCounter, bumps today's Score Tracker counter through the
     tracker's own localStorage + sync queue — the tracker stays the single
     writer of daily counters; the server never increments score_days.

   Requires agent-suite-auth.js to be loaded first.
   ============================================================ */
(function () {
  const QUEUE_KEY = "evermore-activity-queue-v1";
  // Score Tracker's storage keys — shared contract, do not rename.
  const SCORE_STORE_KEY = "evermore-score-tracker-v1";
  const SCORE_SYNC_QUEUE_KEY = "evermore-score-sync-queue-v1";

  const TYPES = {
    dial:              { label: "Dial",             counter: "dials",            icon: "phone",          color: "#60a5fa" },
    contact:           { label: "Contacted",        counter: "contacted",        icon: "check",          color: "#2dd4bf" },
    conversation:      { label: "Conversation",     counter: "conversations",    icon: "chat",           color: "#a78bfa" },
    appt_set:          { label: "Appt Set",         counter: "apptsSet",         icon: "calendar",       color: "#d4b576" },
    appt_held:         { label: "Appt Held",        counter: "apptsHeld",        icon: "handshake",      color: "#d4b576" },
    app_started:       { label: "App Started",      counter: "appsStarted",      icon: "clipboard",      color: "#fb923c" },
    app_submitted:     { label: "App Submitted",    counter: "appsSubmitted",    icon: "send",           color: "#fb923c" },
    issued:            { label: "Policy Issued",    counter: "issued",           icon: "award",          color: "#3dd68c" },
    follow_up_set:     { label: "Follow-Up Set",    counter: "followUpSet",      icon: "refresh",        color: "#f59e0b" },
    referral_asked:    { label: "Referral Asked",   counter: "referralAsked",    icon: "hand",           color: "#f59e0b" },
    referral_received: { label: "Referral Rec'd",   counter: "referralReceived", icon: "star",           color: "#f59e0b" },
    stage_change:      { label: "Stage Change",     counter: null,               icon: "arrow-right",    color: "#d4b576" },
    note:              { label: "Note",             counter: null,               icon: "note",           color: "#8c9cb5" },
  };

  // Canonical pipeline stages — identical strings to the intake form's status
  // select and the pipeline board columns. Badge class feeds agent-suite-ui.css.
  const STATUSES = [
    { key: "In Progress",          cls: "el-s-in-progress",          color: "#60a5fa" },
    { key: "Appointment Booked",   cls: "el-s-appointment-booked",   color: "#d4b576" },
    { key: "Applied",              cls: "el-s-applied",              color: "#a78bfa" },
    { key: "Instantly Approved",   cls: "el-s-instantly-approved",   color: "#34d399" },
    { key: "Further Underwriting", cls: "el-s-further-underwriting", color: "#fb923c" },
    { key: "Approved",             cls: "el-s-approved",             color: "#5fc98b" },
    { key: "Follow Up",            cls: "el-s-follow-up",            color: "#22d3ee" },
    { key: "Declined",             cls: "el-s-declined",             color: "#e0726a" },
    { key: "Not Interested",       cls: "el-s-not-interested",       color: "#6b7280" },
  ];

  function statusMeta(key) {
    return STATUSES.find(function (s) { return s.key === key; }) || STATUSES[0];
  }

  function todayKey() { return new Date().toISOString().slice(0, 10); }

  /* ── Score Tracker localStorage bridge (single-writer counter path) ── */

  function loadScoreData() {
    try { return JSON.parse(localStorage.getItem(SCORE_STORE_KEY)) || { days: {} }; }
    catch (e) { return { days: {} }; }
  }

  function ensureDay(data, dt) {
    if (!data.days[dt]) data.days[dt] = { counters: {}, feed: [], premiums: [], sessionTime: 0 };
    if (!data.days[dt].counters) data.days[dt].counters = {};
    if (!data.days[dt].feed) data.days[dt].feed = [];
    if (!data.days[dt].premiums) data.days[dt].premiums = [];
    return data.days[dt];
  }

  // Mirrors the tracker's increment(): counter++, feed entry, cap 200.
  // Returns an undo function that reverses exactly this bump.
  function bumpLocalCounter(type, opts) {
    const def = TYPES[type];
    if (!def || !def.counter) return null;
    const dt = todayKey();
    const data = loadScoreData();
    const day = ensureDay(data, dt);
    day.counters[def.counter] = (day.counters[def.counter] || 0) + 1;
    const timeStr = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    const label = def.label + (opts && opts.feedNote ? " — " + opts.feedNote : "");
    day.feed.unshift({ time: timeStr, id: def.counter, label: label, color: def.color });
    if (day.feed.length > 200) day.feed = day.feed.slice(0, 200);
    if (opts && opts.premiumEntry) day.premiums = day.premiums.concat(opts.premiumEntry);
    localStorage.setItem(SCORE_STORE_KEY, JSON.stringify(data));
    queueScoreDaySync(dt);
    return function undoBump() {
      const d2 = loadScoreData();
      const day2 = ensureDay(d2, dt);
      day2.counters[def.counter] = Math.max(0, (day2.counters[def.counter] || 0) - 1);
      const idx = day2.feed.findIndex(function (f) { return f.id === def.counter; });
      if (idx >= 0) day2.feed.splice(idx, 1);
      if (opts && opts.premiumEntry) {
        const pIdx = day2.premiums.findIndex(function (p) { return p.premium === opts.premiumEntry.premium && p.note === opts.premiumEntry.note; });
        if (pIdx >= 0) day2.premiums.splice(pIdx, 1);
      }
      localStorage.setItem(SCORE_STORE_KEY, JSON.stringify(d2));
      queueScoreDaySync(dt);
    };
  }

  function scoreSyncQueue() {
    try { return JSON.parse(localStorage.getItem(SCORE_SYNC_QUEUE_KEY)) || []; }
    catch (e) { return []; }
  }

  // Same behavior as the tracker's queueScoreSync + flushScoreSync pair:
  // remember the dirty date so the tracker retries later, and push now if online.
  function queueScoreDaySync(dt) {
    if (!window.EvermoreAgentSuite || !EvermoreAgentSuite.token()) return;
    const queue = scoreSyncQueue();
    if (queue.indexOf(dt) === -1) queue.push(dt);
    localStorage.setItem(SCORE_SYNC_QUEUE_KEY, JSON.stringify(queue.sort()));
    clearTimeout(queueScoreDaySync.timer);
    queueScoreDaySync.timer = setTimeout(flushScoreDaySync, 400);
  }

  async function flushScoreDaySync() {
    if (!navigator.onLine || !window.EvermoreAgentSuite || !EvermoreAgentSuite.token()) return;
    const queue = scoreSyncQueue();
    const remaining = [];
    for (const dt of queue) {
      try {
        const data = loadScoreData();
        const day = data.days[dt];
        if (!day) continue;
        await EvermoreAgentSuite.api("/scores/" + dt, {
          method: "POST",
          body: JSON.stringify({
            counters: day.counters || {},
            feed: day.feed || [],
            premiums: day.premiums || [],
            sessionTime: day.sessionTime || 0,
            session_seconds: day.sessionTime || 0,
          }),
        });
      } catch (e) { remaining.push(dt); }
    }
    localStorage.setItem(SCORE_SYNC_QUEUE_KEY, JSON.stringify(remaining));
  }

  /* ── Activity queue (offline-first writes to /api/activities) ── */

  function activityQueue() {
    try { return JSON.parse(localStorage.getItem(QUEUE_KEY)) || []; }
    catch (e) { return []; }
  }
  function setActivityQueue(queue) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(0, 500)));
  }

  async function postActivity(payload) {
    const data = await EvermoreAgentSuite.api("/activities", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return data.activity;
  }

  async function flushActivityQueue() {
    if (!navigator.onLine || !window.EvermoreAgentSuite || !EvermoreAgentSuite.token()) return;
    const queue = activityQueue();
    if (!queue.length) return;
    const remaining = [];
    for (const payload of queue) {
      try { await postActivity(payload); }
      catch (e) {
        // 4xx = permanently rejected (bad type, deleted client) — drop it.
        // Network/5xx = keep for retry.
        if (!e || !e.message || !/not found|unknown|required/i.test(e.message)) remaining.push(payload);
      }
    }
    setActivityQueue(remaining);
  }

  /**
   * Log one activity.
   * opts: { clientId, type, note, premium, meta, skipCounter, feedNote }
   * - skipCounter: true when the caller already incremented the day counter
   *   (Score Tracker taps) or the type has no counter (stage_change, note).
   * Returns { activity | null (queued offline), undo }.
   */
  async function logActivity(opts) {
    const def = TYPES[opts.type];
    if (!def) throw new Error("Unknown activity type: " + opts.type);

    let undoBump = null;
    if (!opts.skipCounter && def.counter) {
      const premiumEntry = opts.type === "issued" && Number(opts.premium) > 0
        ? { premium: Number(opts.premium), commRate: Number(opts.commRate || 80), carrier: opts.carrier || "", note: opts.note || "" }
        : null;
      undoBump = bumpLocalCounter(opts.type, { feedNote: opts.feedNote, premiumEntry: premiumEntry });
    }

    const payload = {
      type: opts.type,
      client_id: opts.clientId || "",
      note: opts.note || "",
      premium: Number(opts.premium) > 0 ? Number(opts.premium) : null,
      meta: opts.meta || {},
    };

    let activity = null;
    if (navigator.onLine) {
      try { activity = await postActivity(payload); }
      catch (e) { setActivityQueue(activityQueue().concat([payload])); }
    } else {
      setActivityQueue(activityQueue().concat([payload]));
    }

    return {
      activity: activity,
      undo: async function () {
        if (undoBump) undoBump();
        if (activity && activity.id) {
          try { await EvermoreAgentSuite.api("/activities/" + activity.id, { method: "DELETE" }); }
          catch (e) {}
        } else {
          // Was queued offline — remove the last matching queued payload.
          const queue = activityQueue();
          for (let i = queue.length - 1; i >= 0; i -= 1) {
            if (queue[i].type === payload.type && queue[i].client_id === payload.client_id) {
              queue.splice(i, 1);
              break;
            }
          }
          setActivityQueue(queue);
        }
      },
    };
  }

  async function fetchActivities(opts) {
    const o = opts || {};
    const params = new URLSearchParams();
    if (o.clientId) params.set("client_id", o.clientId);
    if (o.limit) params.set("limit", String(o.limit));
    if (o.before) params.set("before", o.before);
    const qs = params.toString();
    const data = await EvermoreAgentSuite.api("/activities" + (qs ? "?" + qs : ""));
    return data.activities || [];
  }

  function relativeTime(iso) {
    const then = new Date(iso).getTime();
    if (!Number.isFinite(then)) return "";
    const mins = Math.round((Date.now() - then) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return mins + "m ago";
    const hours = Math.round(mins / 60);
    if (hours < 24) return hours + "h ago";
    const days = Math.round(hours / 24);
    if (days === 1) return "yesterday";
    if (days < 7) return days + "d ago";
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  window.addEventListener("online", function () { flushActivityQueue(); flushScoreDaySync(); });

  window.EvermoreActivity = {
    TYPES: TYPES,
    STATUSES: STATUSES,
    statusMeta: statusMeta,
    logActivity: logActivity,
    fetchActivities: fetchActivities,
    flushActivityQueue: flushActivityQueue,
    relativeTime: relativeTime,
  };

  // Drain anything queued from a previous offline session.
  flushActivityQueue();
})();
