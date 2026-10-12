import { availability } from './availability.mjs';

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
  $('hours-title').textContent = state.state === 'unconfigured' ? 'Proposed pilot hours' : 'Office hours';
  $('timezone').textContent = 'All times shown in Phoenix, Arizona.';
  const add = text => { const li = document.createElement('li'); li.textContent = text; list.append(li); };
  if (state.state === 'unavailable') { add('Please check back for office hours.'); return; }
  const time = new Intl.DateTimeFormat('en-US', { timeZone: config.timeZone, hour: 'numeric', minute: '2-digit' });
  const date = new Intl.DateTimeFormat('en-US', { timeZone: config.timeZone, weekday: 'short', month: 'short', day: 'numeric' });
  const zone = new Intl.DateTimeFormat('en-US', { timeZone: config.timeZone, timeZoneName: 'long' }).formatToParts().find(p => p.type === 'timeZoneName').value;
  $('timezone').textContent = `${config.timeZone.replaceAll('_', ' ')} · ${zone}`;
  if (state.sessions.length) state.sessions.slice(0, 6).forEach(s => add(`${date.format(s.start)} · ${time.format(s.start)}–${time.format(s.end)}`));
  else if (state.state === 'unconfigured' && Array.isArray(config.proposal)) config.proposal.forEach(add);
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
