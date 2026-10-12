// Dated staffing windows expire naturally. These are office hours, not Zoom presence.
export function zoomUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.port ||
        !(url.hostname === 'zoom.us' || url.hostname.endsWith('.zoom.us')) ||
        !/^\/j\/\d{9,11}$/.test(url.pathname) || url.hash ||
        [...url.searchParams.keys()].some(key => key !== 'pwd')) return null;
    return url.href;
  } catch { return null; }
}

export function availability(config, now = Date.now()) {
  const unavailable = { state: 'unavailable', sessions: [], joinUrl: null };
  if (!config || !Number.isFinite(now)) return unavailable;
  try { new Intl.DateTimeFormat('en-US', { timeZone: config.timeZone }).format(); }
  catch { return unavailable; }
  if (!config.timeZone || !Array.isArray(config.sessions)) return unavailable;
  const sessions = [];
  const absolute = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/;
  for (const session of config.sessions) {
    if (!session || !absolute.test(session.startsAt) || !absolute.test(session.endsAt)) return unavailable;
    const start = Date.parse(session.startsAt), end = Date.parse(session.endsAt);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return unavailable;
    sessions.push({ start, end });
  }
  sessions.sort((a, b) => a.start - b.start);
  const upcoming = sessions.filter(s => s.end > now);
  const joinUrl = zoomUrl(config.zoomJoinUrl);
  if (config.enabled !== true || !joinUrl || !sessions.length) {
    return { state: 'unconfigured', sessions: upcoming, joinUrl: null };
  }
  const current = upcoming.find(s => s.start <= now && now < s.end);
  return { state: current ? 'open' : 'closed', sessions: upcoming, joinUrl: current ? joinUrl : null };
}
