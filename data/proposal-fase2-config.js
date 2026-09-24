/**
 * Configuración de la propuesta comercial Fase 2 (propuesta-fase2.html).
 *
 * Mismo patrón que data/proposal-config.js (Fase 1): los canales de
 * contacto y el enlace de Elipsoft ya están confirmados y en uso en la
 * propuesta Fase 1; se reutilizan aquí porque son el mismo canal
 * comercial de Elipsoft, no un dato nuevo o inventado para esta página.
 *
 * analytics.endpoint queda en null: no hay webhook configurado todavía.
 */
const PROPOSAL_CONFIG = {
  client: "Grupo Virgen del Valle",
  developer: "Elipsoft",

  contact: {
    whatsapp: "584142564848",
    email: "info@elipsoft.us",
  },

  elipsoft: {
    url: "https://www.elipsoft.us",
  },

  messages: {
    advance:
      "Hola. Revisamos la propuesta de la Plataforma Digital de Previsiones (Fase 2) para Grupo Virgen del Valle y queremos avanzar con la formalización del proyecto.",
    meeting:
      "Hola. Nos gustaría coordinar una reunión para conversar sobre la propuesta de la Plataforma Digital de Previsiones (Fase 2) de Grupo Virgen del Valle.",
  },

  analytics: {
    endpoint: null,
  },
};
