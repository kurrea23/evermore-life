import { availability } from './availability.mjs';
import { DISPLAY_ZONES, hoursInZone } from './office-hours.mjs';

let config = null;
let checkedAt = 0;
const $ = id => document.getElementById(id);
const copy = {
  unconfigured: ['Office opening soon', 'We’re preparing our office hours. Please check back soon.', 'Office opening soon'],
  unavailable: ['Office hours unavailable', 'We can’t confirm office hours right now. Please request a callback below.', 'Joining unavailable'],
  closed: ['Office closed', 'Drop in during our next office session, or request a callback below.', 'Join during office hours'],
  open: ['Office hours are open', 'Come on in. You’ll enter the Zoom waiting room, and a host will welcome you.', 'Join the virtual office']
};
function currentState() {
  // Stale or failed configuration never leaves a Join button active indefinitely.
  return availability(Date.now() - checkedAt < 90000 ? config : null);
}
function render() {
  const state = currentState();
  const [status, message, button] = copy[state.state];
  $('status').textContent = status;
  $('status').dataset.state = state.state;
  $('message').textContent = message;
  $('join').textContent = button + ' ↗';
  $('join').disabled = !state.joinUrl;
  const list = $('sessions');
  list.replaceChildren();
  $('hours-title').textContent = 'Office hours';
  $('timezone').textContent = 'All times shown in Phoenix, Arizona.';
  const add = (label, value) => {
    const li = document.createElement('li');
    const name = document.createElement('span'); name.textContent = label; li.append(name);
    if (value) { const hours = document.createElement('span'); hours.textContent = value; li.append(hours); }
    list.append(li);
  };
  if (state.state === 'unavailable') { add('Please check back for office hours.'); return; }
  $('timezone').textContent = config.hoursLabel || 'Office hours by time zone';
  if (state.sessions.length) {
    const session = state.sessions[0];
    DISPLAY_ZONES.forEach(zone => add(zone.label, hoursInZone(session.start, session.end, zone.timeZone)));
  }
  else if (state.state === 'unconfigured' && Array.isArray(config.proposal)) config.proposal.forEach(text => add(text));
  else add('Our next session will be announced here.');
}
async function refresh() {
  try {
    const response = await fetch('/virtual-office/office-config.json', { cache: 'no-store', signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('Unavailable');
    config = await response.json();
    checkedAt = Date.now();
  } catch { config = null; checkedAt = 0; }
  render();
}
$('join').addEventListener('click', () => {
  const state = currentState();
  render();
  if (state.joinUrl) window.open(state.joinUrl, '_blank', 'noopener,noreferrer');
});
document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
refresh();
setInterval(render, 1000);
setInterval(refresh, 60000);
