/**
 * Set mínimo de iconos en línea (sin librerías externas) para mantener el
 * peso del sitio bajo. Cada entrada es el contenido interno de un <svg>.
 */
const ICONS = {
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
  leaf: '<path d="M20 4C10 4 4 10 4 20c10 0 16-6 16-16Z"/><path d="M4 20 12 12"/>',
  heart: '<path d="M12 20.5s-7.5-4.6-9.7-9.2C.7 7.6 2.6 4 6.3 4c2.1 0 3.7 1.1 4.7 2.7C12 5.1 13.6 4 15.7 4c3.7 0 5.6 3.6 4 7.3C19.5 15.9 12 20.5 12 20.5Z"/>',
  shield: '<path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6Z"/><path d="m9 12 2 2 4-4"/>',
  phone: '<path d="M6 3h3l1.5 4.5L8 9.5a12 12 0 0 0 6.5 6.5l2-2.5L21 15v3a2 2 0 0 1-2 2C10.7 20 4 13.3 4 5a2 2 0 0 1 2-2Z"/>',
  whatsapp: '<path d="M7 17.5 4.5 20 5.6 16A8 8 0 1 1 7 17.5Z"/><path d="M9 10.5c0 3 2.5 5.5 5.5 5.5" /><path d="M9 10.5c0-.5.2-1 .6-1.3l.7-.6c.3-.3.4-.7.2-1.1L10 6.6c-.2-.4-.6-.6-1-.5-1 .3-1.9 1.3-1.9 2.4 0 3.9 3.5 8.5 8.5 8.5 1.1 0 2.1-.9 2.4-1.9.1-.4-.1-.8-.5-1l-.9-.5c-.4-.2-.8-.1-1.1.2l-.5.6" />',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  pin: '<path d="M12 21s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/>',
  truck: '<rect x="2" y="7" width="13" height="9"/><path d="M15 10h4l3 3v3h-7z"/><circle cx="6.5" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/>',
  flame: '<path d="M12 3s-4 4-4 8a4 4 0 0 0 8 0c0-1.3-.6-2-1-2.5.4 2-1 3-2 2 1-2-1-3-1-5.5Z"/><path d="M7.5 14a4.5 4.5 0 0 0 9 0"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M21 20c0-2.6-1.7-4.8-4-5.6"/>',
  home: '<path d="m3 11 9-7 9 7"/><path d="M5 10v10h14V10"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  chevronLeft: '<path d="m14 6-6 6 6 6"/>',
  chevronRight: '<path d="m10 6 6 6-6 6"/>',
  share: '<circle cx="18" cy="5" r="2.2"/><circle cx="6" cy="12" r="2.2"/><circle cx="18" cy="19" r="2.2"/><path d="m8 10.8 8-4.6M8 13.2l8 4.6"/>',
  message: '<path d="M4 5h16v11H8l-4 4Z"/>',
  check: '<path d="m5 12 5 5 9-9"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15 9-2 6-6 2 2-6z"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>',
  facebook: '<path d="M14 8.5V7c0-1 .5-1.5 1.5-1.5H17V3h-2.5C12.5 3 11 4.5 11 7v1.5H9V11h2v10h3V11h2.2l.4-2.5H14Z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.7 2.5 15.3 0 18-2.5-2.7-2.5-15.3 0-18Z"/>',
  inbox: '<path d="M3 13h5l1.5 3h5L16 13h5"/><path d="M4.5 5h15l1.5 8v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Z"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  trendUp: '<path d="m3 16 5-5 4 4 8-8"/><path d="M15 7h5v5"/>',
  sparkles: '<path d="M12 3.5 13.6 8 18 9.5 13.6 11 12 15.5 10.4 11 6 9.5 10.4 8Z"/><path d="M18.5 15.5 19.3 18l2.2.8-2.2.8-.8 2.4-.8-2.4-2.2-.8 2.2-.8Z"/>',
  userCheck: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6 1.2 0 2.3.3 3.2.9"/><path d="m15.5 17 2 2 4-4"/>',
  bell: '<path d="M18 9a6 6 0 1 0-12 0c0 5-2 7-2 7h16s-2-2-2-7Z"/><path d="M10.5 20a2 2 0 0 0 3 0"/>',
  send: '<path d="m4 12 16-8-6 16-2.5-6.5L4 12Z"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4v4.5h-4.5"/>',
  filter: '<path d="M4 5h16l-6 7v6l-4 2v-8Z"/>',
  megaphone: '<path d="M4 10v4a1 1 0 0 0 1 1h3l6 4V5L8 9H5a1 1 0 0 0-1 1Z"/><path d="M18 9a3.5 3.5 0 0 1 0 6"/>',
  flower: '<circle cx="12" cy="12" r="2.4"/><path d="M12 9.6c0-2.5-1-4-2.5-4S7 7 7 8.8s1.5 2.6 3.2 2.6"/><path d="M14.4 12c2.5 0 4-1 4-2.5S17 7 15.2 7s-2.6 1.5-2.6 3.2"/><path d="M12 14.4c0 2.5 1 4 2.5 4s2.5-1.4 2.5-3.2-1.5-2.6-3.2-2.6"/><path d="M9.6 12c-2.5 0-4 1-4 2.5S7 17 8.8 17s2.6-1.5 2.6-3.2"/>',
  building: '<rect x="4" y="3" width="10" height="18" rx="1.5"/><path d="M14 9h5.5a.5.5 0 0 1 .5.5V21"/><path d="M7 7h4M7 11h4M7 15h4M17 13h1M17 17h1"/>',
};

function icon(name, className = "") {
  const content = ICONS[name] || "";
  return `<svg class="icon ${className}" viewBox="0 0 24 24" aria-hidden="true">${content}</svg>`;
}
