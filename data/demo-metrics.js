/**
 * DEMO_DATA — Métricas simuladas del Centro Digital.
 *
 * Ningún dato aquí proviene de una fuente real: son cifras plausibles
 * usadas únicamente para demostrar cómo se vería el panel cuando la
 * plataforma esté operativa. Toda la interfaz que las consume las
 * identifica visualmente como "Datos simulados".
 */
const DEMO_KPIS = [
  {
    id: "solicitudes",
    icon: "inbox",
    value: 12,
    label: "Nuevas solicitudes hoy",
    delta: { direction: "up", text: "18% vs. ayer" },
  },
  {
    id: "inmediatas",
    icon: "clock",
    value: 3,
    label: "Atenciones inmediatas",
    delta: { direction: "flat", text: "Igual que ayer" },
    tone: "urgent",
  },
  {
    id: "cotizaciones",
    icon: "target",
    value: 7,
    label: "Cotizaciones iniciadas",
    delta: { direction: "up", text: "2 más que ayer" },
  },
  {
    id: "oportunidades",
    icon: "userCheck",
    value: 5,
    label: "Oportunidades activas",
    delta: { direction: "up", text: "1 nueva hoy" },
  },
  {
    id: "conversion",
    icon: "trendUp",
    value: "42%",
    label: "Conversión",
    delta: { direction: "up", text: "6 pts vs. período anterior" },
  },
  {
    id: "respuesta",
    icon: "sparkles",
    value: "3 min",
    label: "Primera respuesta",
    delta: { direction: "down", text: "2 min más rápido" },
    tone: "good",
  },
];

const DEMO_FUNNEL = [
  { label: "Visitas", value: 128, caption: "Personas que llegaron al sitio" },
  { label: "Conversaciones", value: 37, caption: "Iniciaron contacto por algún canal" },
  { label: "Solicitudes", value: 19, caption: "Dejaron su necesidad registrada" },
  { label: "Cotizaciones", value: 12, caption: "Completaron el cotizador" },
  { label: "Clientes", value: 5, caption: "Contrataron un servicio" },
];

const DEMO_CHANNELS = [
  { label: "WhatsApp", value: 46, icon: "whatsapp" },
  { label: "Instagram", value: 24, icon: "instagram" },
  { label: "Web", value: 18, icon: "globe" },
  { label: "Facebook", value: 12, icon: "facebook" },
];

const DEMO_TOP_SERVICES = [
  { label: "Previsión", value: 31 },
  { label: "Servicio inmediato", value: 26 },
  { label: "Cremación", value: 18 },
  { label: "Traslados", value: 15 },
  { label: "Cementerio", value: 10 },
];

const DEMO_BY_LOCATION = [
  { label: "Cumaná", value: 38 },
  { label: "Puerto La Cruz", value: 27 },
  { label: "Caracas", value: 21 },
  { label: "Anaco", value: 14 },
];

const DEMO_PERFORMANCE = [
  { label: "Conversión", value: "42%", caption: "De conversación a solicitud" },
  { label: "Primera respuesta", value: "3 min", caption: "Tiempo medio" },
  { label: "Canal principal", value: "WhatsApp", caption: "46% de las oportunidades" },
  { label: "Mayor interés", value: "Previsión", caption: "31% de las consultas" },
];
