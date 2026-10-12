import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { availability, zoomUrl } from '../../virtual-office/availability.mjs';

const start = Date.parse('2026-10-13T17:30:00-07:00');
const end = Date.parse('2026-10-13T18:00:00-07:00');
const fixture = {
  enabled: true, zoomJoinUrl: 'https://us02web.zoom.us/j/12345678901', timeZone: 'America/Phoenix',
  sessions: [{ startsAt: '2026-10-13T17:30:00-07:00', endsAt: '2026-10-13T18:00:00-07:00' }]
};
test('repository ships with joining disabled, an approved participant URL and no staffed sessions', () => {
  const config = JSON.parse(readFileSync(new URL('../../virtual-office/office-config.json', import.meta.url)));
  assert.equal(config.enabled, false);
  assert.ok(zoomUrl(config.zoomJoinUrl));
  assert.deepEqual(config.sessions, []);
  assert.equal(availability(config, start).joinUrl, null);
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
