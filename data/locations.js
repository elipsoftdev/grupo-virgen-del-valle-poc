/**
 * Sedes confirmadas públicamente por la empresa: Cumaná, Puerto La Cruz,
 * Anaco y Distrito Capital (Caracas). No se inventan sedes adicionales.
 *
 * Direcciones y teléfonos específicos no están confirmados localmente:
 * quedan en null / arreglo vacío y marcados como pendientes. El frontend
 * debe ocultar con elegancia cualquier campo vacío en lugar de mostrar
 * "null" o dejar huecos visuales.
 *
 * Preparado conceptualmente para evolucionar a rutas propias por sede
 * (/sedes/caracas, /sedes/cumana, /sedes/puerto-la-cruz, /sedes/anaco)
 * cuando el proyecto crezca más allá de una página única.
 */
const LOCATIONS = [
  {
    slug: "cumana",
    city: "Cumaná",
    name: "Sede Principal Cumaná",
    isMainOffice: true,
    address: null, // pendiente de confirmación
    phones: [],
    whatsapp: CONFIG.whatsapp,
    hours: "Atención 24 horas",
    is24h: true,
    photo: "assets/img/pasillo-cumana.jpg",
    services: ["velacion", "traslados", "cremacion", "inhumacion", "prevision"],
  },
  {
    slug: "puerto-la-cruz",
    city: "Puerto La Cruz",
    name: "Agencia Puerto La Cruz",
    isMainOffice: false,
    address: null,
    phones: [],
    whatsapp: CONFIG.whatsapp,
    hours: "Atención 24 horas",
    is24h: true,
    photo: "assets/img/fachada-pto-la-cruz.jpg",
    services: ["velacion", "traslados", "prevision"],
  },
  {
    slug: "anaco",
    city: "Anaco",
    name: "Agencia Anaco",
    isMainOffice: false,
    address: null,
    phones: [],
    whatsapp: CONFIG.whatsapp,
    hours: "Atención 24 horas",
    is24h: true,
    photo: "assets/img/fachada-anaco.jpg",
    services: ["velacion", "traslados", "prevision"],
  },
  {
    slug: "caracas",
    city: "Caracas (Distrito Capital)",
    name: "Atención Distrito Capital",
    isMainOffice: false,
    address: null,
    phones: [],
    whatsapp: CONFIG.whatsapp,
    hours: "Atención 24 horas",
    is24h: true,
    photo: "assets/img/fachada-historica.jpg",
    services: ["velacion", "traslados", "cremacion", "prevision"],
  },
];
