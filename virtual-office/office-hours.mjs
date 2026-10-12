export const DISPLAY_ZONES = [
  { label: 'Arizona', timeZone: 'America/Phoenix' },
  { label: 'Pacific', timeZone: 'America/Los_Angeles' },
  { label: 'Mountain', timeZone: 'America/Denver' },
  { label: 'Central', timeZone: 'America/Chicago' },
  { label: 'Eastern', timeZone: 'America/New_York' }
];

// Convert the same session instants; never hard-code offsets between zones.
export function hoursInZone(start, end, timeZone) {
  const time = new Intl.DateTimeFormat('en-US', {
    timeZone, hour: 'numeric', minute: '2-digit'
  });
  const zone = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' })
    .formatToParts(start).find(part => part.type === 'timeZoneName').value;
  return `${time.format(start)}–${time.format(end)} ${zone}`;
}
