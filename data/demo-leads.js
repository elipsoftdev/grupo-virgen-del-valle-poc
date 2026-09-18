/**
 * DEMO_DATA — Oportunidades simuladas.
 *
 * Nombres, teléfonos y datos completamente ficticios. No representan a
 * ninguna persona real. Sirven para mostrar cómo luciría la bandeja de
 * oportunidades del equipo comercial.
 */
const DEMO_LEADS = [
  {
    id: "GVV-2026-0179",
    name: "María Rodríguez",
    initials: "MR",
    source: "WhatsApp",
    service: "Servicio inmediato",
    city: "Cumaná",
    priority: "Alta",
    status: "Atendiendo",
    time: "Hace 2 min",
    assignee: null,
  },
  {
    id: "GVV-2026-0178",
    name: "José Mendoza",
    initials: "JM",
    source: "Instagram",
    service: "Velación",
    city: "Puerto La Cruz",
    priority: "Normal",
    status: "Cotización",
    time: "Hace 8 min",
    assignee: "Laura Méndez",
  },
  {
    id: "GVV-2026-0177",
    name: "Ana Pérez",
    initials: "AP",
    source: "Web",
    service: "Cremación",
    city: "Caracas",
    priority: "Media",
    status: "Nuevo",
    time: "Hace 14 min",
    assignee: null,
  },
  {
    id: "GVV-2026-0176",
    name: "Carlos García",
    initials: "CG",
    source: "Facebook",
    service: "Traslado",
    city: "Anaco",
    priority: "Alta",
    status: "Asignado",
    time: "Hace 26 min",
    assignee: "Pedro Silva",
  },
  {
    id: "GVV-2026-0175",
    name: "Rosa Villarroel",
    initials: "RV",
    source: "WhatsApp",
    service: "Cremación",
    city: "Cumaná",
    priority: "Normal",
    status: "Seguimiento",
    time: "Hace 1 h",
    assignee: "Laura Méndez",
  },
  {
    id: "GVV-2026-0174",
    name: "Luis Bermúdez",
    initials: "LB",
    source: "Web",
    service: "Cementerio",
    city: "Puerto La Cruz",
    priority: "Media",
    status: "En conversación",
    time: "Hace 2 h",
    assignee: "Pedro Silva",
  },
];

/** Asesores ficticios disponibles para la simulación de asignación. */
const DEMO_ADVISORS = [
  { name: "Laura Méndez", role: "Asesora" },
  { name: "Pedro Silva", role: "Asesor" },
];
