/**
 * DEMO_DATA — Conversaciones simuladas del centro de atención.
 *
 * Todos los mensajes, nombres y datos son ficticios. Muestran cómo se
 * vería una conversación entrante desde cualquier canal, ya clasificada
 * por el asistente digital antes de llegar a un asesor humano.
 */
const DEMO_CONVERSATIONS = [
  {
    id: "GVV-2026-0179",
    name: "María Rodríguez",
    initials: "MR",
    source: "WhatsApp",
    preview: "Necesito hacer un traslado desde Cumaná...",
    time: "Hace 2 min",
    unread: 2,
    priority: "Alta",
    status: "Sin asignar",
    assignee: null,
    messages: [
      { from: "client", time: "14:02", text: "Buenas tardes. Necesito trasladar a mi papá desde Cumaná hasta Caracas." },
      { from: "bot", time: "14:02", text: "Lamento mucho su pérdida. Puedo ayudarle a organizar la información inicial para que un asesor le atienda cuanto antes." },
      { from: "bot", time: "14:02", text: "¿El traslado necesita realizarse hoy?" },
      { from: "client", time: "14:03", text: "Sí, hoy mismo." },
      { from: "bot", time: "14:03", text: "Entendido. He marcado la solicitud como prioritaria y estoy preparando los datos para que un asesor continúe la atención." },
    ],
    intelligence: {
      need: "Traslado funerario",
      route: "Cumaná → Caracas",
      urgency: "Alta",
      intent: "Contratación",
      origin: "WhatsApp",
      state: "Requiere asesor humano",
      summary:
        "Cliente solicita traslado funerario desde Cumaná hacia Caracas para realizarse hoy. La solicitud requiere atención prioritaria y escalamiento inmediato a un asesor.",
      nextAction: "Asignar asesor",
    },
  },
  {
    id: "GVV-2026-0178",
    name: "José Mendoza",
    initials: "JM",
    source: "Instagram",
    preview: "Quisiera conocer los planes familiares...",
    time: "Hace 8 min",
    unread: 1,
    priority: "Normal",
    status: "En atención",
    assignee: "Laura Méndez",
    messages: [
      { from: "client", time: "13:56", text: "Hola, quisiera conocer los planes familiares de previsión." },
      { from: "bot", time: "13:56", text: "Con gusto. Los planes de previsión permiten organizar todo con anticipación y evitar decisiones bajo presión." },
      { from: "bot", time: "13:56", text: "¿La consulta es para usted o para su grupo familiar?" },
      { from: "client", time: "13:58", text: "Para mi familia, somos cuatro." },
      { from: "bot", time: "13:58", text: "Perfecto. Un asesor puede explicarle las alternativas disponibles en Puerto La Cruz." },
    ],
    intelligence: {
      need: "Previsión familiar",
      route: "Puerto La Cruz",
      urgency: "Normal",
      intent: "Información comercial",
      origin: "Instagram",
      state: "En atención",
      summary:
        "Cliente interesado en planes de previsión para un grupo familiar de cuatro personas en Puerto La Cruz. Sin urgencia inmediata; oportunidad comercial de seguimiento.",
      nextAction: "Enviar información de planes",
    },
  },
  {
    id: "GVV-2026-0177",
    name: "Ana Pérez",
    initials: "AP",
    source: "Facebook",
    preview: "¿Tienen servicio de cremación en Caracas?",
    time: "Hace 14 min",
    unread: 0,
    priority: "Media",
    status: "Sin asignar",
    assignee: null,
    messages: [
      { from: "client", time: "13:50", text: "¿Tienen servicio de cremación en Caracas?" },
      { from: "bot", time: "13:50", text: "Sí. Podemos orientarle sobre el proceso de cremación y las alternativas disponibles en el Distrito Capital." },
      { from: "bot", time: "13:51", text: "¿Necesita el servicio completo o desea información para evaluarlo con calma?" },
      { from: "client", time: "13:52", text: "Por ahora solo información." },
    ],
    intelligence: {
      need: "Cremación",
      route: "Caracas",
      urgency: "Media",
      intent: "Evaluación",
      origin: "Facebook",
      state: "Pendiente de asignación",
      summary:
        "Consulta informativa sobre cremación en Caracas, sin urgencia declarada. Conviene enviar material explicativo y mantener seguimiento.",
      nextAction: "Asignar asesor",
    },
  },
  {
    id: "GVV-2026-0176",
    name: "Carlos García",
    initials: "CG",
    source: "Web",
    preview: "Cotización completada",
    time: "Hace 20 min",
    unread: 0,
    priority: "Alta",
    status: "En atención",
    assignee: "Pedro Silva",
    messages: [
      { from: "client", time: "13:44", text: "Completé el formulario de cotización desde la web." },
      { from: "bot", time: "13:44", text: "Recibido. Su solicitud de traslado en Anaco quedó registrada con prioridad alta." },
      { from: "bot", time: "13:45", text: "Un asesor se comunicará con usted para confirmar disponibilidad y proceso." },
    ],
    intelligence: {
      need: "Traslado",
      route: "Anaco",
      urgency: "Alta",
      intent: "Contratación",
      origin: "Web · Cotizador",
      state: "En atención",
      summary:
        "Solicitud generada desde el cotizador web con prioridad alta en Anaco. Datos de contacto completos; requiere confirmación de disponibilidad.",
      nextAction: "Confirmar disponibilidad",
    },
  },
];
