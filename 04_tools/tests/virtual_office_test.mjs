import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { availability, zoomUrl } from '../../virtual-office/availability.mjs';
import { hoursInZone } from '../../virtual-office/office-hours.mjs';

const start = Date.parse('2026-10-13T17:30:00-07:00');
const end = Date.parse('2026-10-13T18:00:00-07:00');
const fixture = {
  enabled: true, zoomJoinUrl: 'https://us02web.zoom.us/j/12345678901', timeZone: 'America/Phoenix',
  sessions: [{ startsAt: '2026-10-13T17:30:00-07:00', endsAt: '2026-10-13T18:00:00-07:00' }]
};
test('approved weekday pilot opens 9–5 Phoenix, excludes weekends and expires after two weeks', () => {
  const config = JSON.parse(readFileSync(new URL('../../virtual-office/office-config.json', import.meta.url)));
  assert.equal(config.enabled, true);
  assert.ok(zoomUrl(config.zoomJoinUrl));
  assert.equal(config.timeZone, 'America/Phoenix');
  assert.equal(config.sessions.length, 9);
  for (const session of config.sessions) {
    const s = Date.parse(session.startsAt), e = Date.parse(session.endsAt);
    assert.equal(e - s, 8 * 3600000);
    assert.equal(availability(config, s - 1).joinUrl, null);
    assert.ok(availability(config, s).joinUrl);
    assert.ok(availability(config, e - 1).joinUrl);
    assert.equal(availability(config, e).joinUrl, null);
    const phoenix = new Date(s - 7 * 3600000);
    const day = phoenix.getUTCDay();
    assert.ok(day >= 1 && day <= 5);
    assert.equal(phoenix.getUTCHours(), 9);
    assert.equal(phoenix.getUTCMinutes(), 0);
  }
  assert.equal(availability(config, Date.parse('2026-10-12T14:00:00-07:00')).state, 'closed');
  assert.equal(availability(config, Date.parse('2026-10-17T12:00:00-07:00')).state, 'closed');
  assert.equal(availability(config, Date.parse('2026-10-24T12:00:00-07:00')).state, 'closed');
  assert.equal(availability(config, Date.parse('2026-10-27T17:30:00-07:00')).joinUrl, null);
});
test('time-zone rows convert the same hours accurately before and after daylight saving changes', () => {
  const start = Date.parse('2026-10-13T09:00:00-07:00'), end = Date.parse('2026-10-13T17:00:00-07:00');
  assert.equal(hoursInZone(start, end, 'America/Phoenix'), '9:00 AM–5:00 PM MST');
  assert.equal(hoursInZone(start, end, 'America/Los_Angeles'), '9:00 AM–5:00 PM PDT');
  assert.equal(hoursInZone(start, end, 'America/Denver'), '10:00 AM–6:00 PM MDT');
  assert.equal(hoursInZone(start, end, 'America/Chicago'), '11:00 AM–7:00 PM CDT');
  assert.equal(hoursInZone(start, end, 'America/New_York'), '12:00 PM–8:00 PM EDT');
  const winterStart = Date.parse('2026-11-02T09:00:00-07:00'), winterEnd = Date.parse('2026-11-02T17:00:00-07:00');
  assert.equal(hoursInZone(winterStart, winterEnd, 'America/Los_Angeles'), '8:00 AM–4:00 PM PST');
  assert.equal(hoursInZone(winterStart, winterEnd, 'America/Denver'), '9:00 AM–5:00 PM MST');
  assert.equal(hoursInZone(winterStart, winterEnd, 'America/Chicago'), '10:00 AM–6:00 PM CST');
  assert.equal(hoursInZone(winterStart, winterEnd, 'America/New_York'), '11:00 AM–7:00 PM EST');
});
test('only a configured dated staffing window enables joining, including exact boundaries', () => {
  assert.equal(availability(fixture, start - 1).state, 'closed');
  assert.equal(availability(fixture, start).state, 'open');
  assert.ok(availability(fixture, end - 1).joinUrl);
  assert.equal(availability(fixture, end).joinUrl, null);
  assert.equal(availability(fixture, end + 86400000).state, 'closed');
});
test('disabled office and expired staffing never permit joining', () => {
  assert.equal(availability({ ...fixture, enabled: false }, start).joinUrl, null);
  assert.equal(availability({ ...fixture, sessions: [] }, start).joinUrl, null);
  assert.deepEqual(availability(fixture, end).sessions, []);
});
test('bad config, unavailable config, ambiguous dates and invalid timezone fail closed', () => {
  for (const config of [null, {}, { ...fixture, timeZone: 'oops' }, { ...fixture, sessions: [{}] },
    { ...fixture, sessions: [{ startsAt: '2026-10-13T17:30:00', endsAt: '2026-10-13T18:00:00' }] },
    { ...fixture, sessions: [{ startsAt: fixture.sessions[0].endsAt, endsAt: fixture.sessions[0].startsAt }] }]) {
    assert.equal(availability(config, start).joinUrl, null);
  }
});
test('only HTTPS Zoom participant join links are accepted; host/start and lookalike URLs fail closed', () => {
  for (const url of ['javascript:alert(1)', 'https://zoom.us.attacker.test/j/12345678901',
    'http://zoom.us/j/12345678901', 'https://zoom.us/s/12345678901?zak=secret',
    'https://user:pass@zoom.us/j/12345678901', 'https://zoom.us:444/j/12345678901',
    'https://zoom.us/j/not-a-meeting', 'https://zoom.us/',
    'https://zoom.us/j/12345678901?zak=secret', 'https://zoom.us/j/12345678901#host']) {
    assert.equal(zoomUrl(url), null);
    assert.equal(availability({ ...fixture, zoomJoinUrl: url }, start).joinUrl, null);
  }
  assert.ok(zoomUrl(fixture.zoomJoinUrl));
  assert.ok(zoomUrl(fixture.zoomJoinUrl + '?pwd=approved-participant-passcode'));
});
test('timestamps with offsets refer to the same instant across timezones', () => {
  const config = { ...fixture, timeZone: 'America/New_York' };
  assert.equal(availability(config, Date.parse('2026-10-13T20:30:00-04:00')).state, 'open');
});
