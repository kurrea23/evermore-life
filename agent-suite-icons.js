/* ============================================================
   EVERMORE LIFE — Agent Suite icon set
   window.EvermoreIcons.icon(name, {size, cls, stroke}) → inline SVG string.
   Premium line icons: 24px viewBox, stroke currentColor, 1.75 weight.
   Replaces the emoji glyphs previously scattered across suite pages.
   ============================================================ */
(function () {
  // Path data only — wrapped in a common <svg> shell by icon().
  const PATHS = {
    phone: '<path d="M6.6 3.2c.5-.3 1.1-.1 1.4.4l1.7 2.9c.3.5.2 1.1-.2 1.5l-1.2 1.1a.9.9 0 0 0-.2 1.1 12.6 12.6 0 0 0 5.7 5.7c.4.2.8.1 1.1-.2l1.1-1.2c.4-.4 1-.5 1.5-.2l2.9 1.7c.5.3.7.9.4 1.4l-.9 1.7c-.4.7-1.1 1.1-1.9 1-8-.8-14.4-7.2-15.2-15.2-.1-.8.3-1.5 1-1.9l1.7-.9z"/>',
    check: '<path d="M4.5 12.5l5 5 10-11"/>',
    'check-circle': '<circle cx="12" cy="12" r="9"/><path d="M8.2 12.4l2.6 2.6 5-5.6"/>',
    chat: '<path d="M21 12a8 8 0 0 1-8 8H4l2.3-2.9A8 8 0 1 1 21 12z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 9.5h17M8 2.8V6M16 2.8V6"/>',
    'calendar-check': '<rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 9.5h17M8 2.8V6M16 2.8V6M8.7 14.8l2.2 2.2 4.4-4.6"/>',
    handshake: '<path d="M2.5 7.5L7 5l5 2 5-2 4.5 2.5v7L17 17l-4.3 3.4a1.2 1.2 0 0 1-1.4 0L7 17l-4.5-2.5v-7z"/><path d="M12 7L8.6 10a1.6 1.6 0 0 0 2.2 2.3l1.5-1.2 4.2 3.5"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17.5" rx="2"/><path d="M9 4a3 3 0 0 1 6 0M8.5 10h7M8.5 13.5h7M8.5 17h4.5"/>',
    send: '<path d="M21 3.5L3 10.5l7 3 3 7 8-17z"/><path d="M10 13.5L21 3.5"/>',
    card: '<rect x="2.5" y="5.5" width="19" height="13" rx="2.5"/><path d="M2.5 10h19M6.5 14.5h4"/>',
    award: '<circle cx="12" cy="9" r="5.5"/><path d="M8.8 13.5L7 21l5-2.6L17 21l-1.8-7.5"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.6M20 3.5V7h-3.5"/>',
    hand: '<path d="M8 12V5.2a1.4 1.4 0 0 1 2.8 0V11m0-5.8V4a1.4 1.4 0 0 1 2.8 0v7m0-5.6a1.4 1.4 0 0 1 2.8 0V13m0-4a1.4 1.4 0 0 1 2.8 0v6.5c0 3.6-2.5 6-6.2 6-2.8 0-4.5-.9-5.9-3.2L5 14.7c-.7-1-.5-2 .3-2.6.7-.5 1.7-.4 2.3.4L8 13.4"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9l-5.4 2.9 1.1-6.1L3.2 9.4l6.1-.8L12 3z"/>',
    home: '<path d="M4 10.5L12 3.5l8 7V20a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 20v-9.5z"/><path d="M9.5 21.5v-7h5v7"/>',
    gauge: '<path d="M4.5 19a9 9 0 1 1 15 0"/><path d="M12 14.5L16 9"/><circle cx="12" cy="15" r="1.6"/>',
    pipeline: '<rect x="3" y="4" width="5" height="16" rx="1.4"/><rect x="9.5" y="4" width="5" height="11" rx="1.4"/><rect x="16" y="4" width="5" height="7" rx="1.4"/>',
    calculator: '<rect x="4.5" y="2.8" width="15" height="18.5" rx="2.4"/><path d="M8 7h8"/><path d="M8.3 12h.01M12 12h.01M15.7 12h.01M8.3 15.4h.01M12 15.4h.01M15.7 15.4h.01M8.3 18.6h.01M12 18.6h.01M15.7 18.6h.01"/>',
    users: '<circle cx="9" cy="8.2" r="3.6"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0"/><path d="M15.7 5a3.6 3.6 0 0 1 0 6.6M17.6 14.3A6.2 6.2 0 0 1 21.2 20"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.4 2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    edit: '<path d="M4 20h4.5L20 8.5a2.1 2.1 0 0 0-3-3L5.5 17 4 20z"/><path d="M14.5 6.5l3 3"/>',
    note: '<path d="M5 4.5h14a1.5 1.5 0 0 1 1.5 1.5v9L15 20.5H5A1.5 1.5 0 0 1 3.5 19V6A1.5 1.5 0 0 1 5 4.5z"/><path d="M15 20.5V15h5.5M7.5 9.5h9M7.5 13h5"/>',
    'arrow-right': '<path d="M4 12h16M13.5 5.5L20 12l-6.5 6.5"/>',
    'chevron-right': '<path d="M9 5l7 7-7 7"/>',
    'chevron-down': '<path d="M5 9l7 7 7-7"/>',
    'trend-up': '<path d="M3.5 17.5l6-6 4 4 7-7.5"/><path d="M15 7.5h5.5V13"/>',
    logout: '<path d="M14.5 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6.5a2 2 0 0 0 2-2v-2"/><path d="M9.5 12H21M17.5 8.5L21 12l-3.5 3.5"/>',
    spark: '<path d="M12 2.5l1.9 5.8 5.8 1.9-5.8 1.9L12 18l-1.9-5.9-5.8-1.9 5.8-1.9L12 2.5z"/><path d="M19 15.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M16.2 16.2L21 21"/>',
    play: '<path d="M7 4.8l12 7.2-12 7.2V4.8z"/>',
    pause: '<path d="M7.5 4.5v15M16.5 4.5v15"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="1.5"/>',
    undo: '<path d="M8 5L3.5 9.5 8 14"/><path d="M3.5 9.5H15a5.5 5.5 0 0 1 0 11h-3"/>',
    dollar: '<path d="M12 2.5v19M16.5 6.5c-.8-1.3-2.4-2-4.5-2-2.7 0-4.5 1.3-4.5 3.4 0 4.6 9.3 2.3 9.3 7 0 2.2-1.9 3.6-4.8 3.6-2.3 0-4-.8-4.8-2.2"/>',
    briefcase: '<rect x="3" y="7.5" width="18" height="13" rx="2"/><path d="M8.5 7.5V5.6A1.6 1.6 0 0 1 10.1 4h3.8a1.6 1.6 0 0 1 1.6 1.6v1.9M3 12.5h18"/>',
    shield: '<path d="M12 2.8l7.5 2.8v6c0 4.6-3 8-7.5 9.9C7.5 19.6 4.5 16.2 4.5 11.6v-6L12 2.8z"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/>',
    sun: '<circle cx="12" cy="12" r="4.4"/><path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M4.9 4.9L6.7 6.7M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/>',
  };

  function icon(name, opts) {
    const o = opts || {};
    const size = o.size || 20;
    const cls = "el-ic" + (o.cls ? " " + o.cls : "");
    const stroke = o.stroke || 1.75;
    const path = PATHS[name];
    if (!path) return "";
    return '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + stroke + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + "</svg>";
  }

  window.EvermoreIcons = { icon: icon, has: function (name) { return !!PATHS[name]; } };
})();
