/**
 * Configuración de la propuesta comercial (propuesta.html).
 *
 * No se inventan datos: todo lo que aún no está confirmado queda en null
 * y la página se adapta sola (oculta o reemplaza el elemento afectado).
 *
 * DÓNDE CONFIGURAR CADA COSA
 * --------------------------
 * contact.whatsapp  → WhatsApp comercial de Elipsoft (solo dígitos con código
 *                     de país, p. ej. "58XXXXXXXXXX"). Si es null, "Quiero
 *                     avanzar" / "Tengo una consulta" muestran el mensaje
 *                     redactado para copiarlo.
 * contact.email     → Correo comercial de Elipsoft. Se usa si no hay WhatsApp.
 * pdfUrl            → Ruta del PDF definitivo de la propuesta (p. ej.
 *                     "assets/docs/propuesta-gvv.pdf" una vez agregado al
 *                     repositorio). Si es null, el botón "Descargar propuesta
 *                     en PDF" permanece oculto.
 * elipsoft.url      → Sitio web de Elipsoft. Si es null, el enlace "Conocer
 *                     Elipsoft" permanece oculto y la marca se muestra solo
 *                     como texto.
 * analytics.endpoint→ Webhook (p. ej. n8n) para los eventos anónimos de la
 *                     propuesta. Si es null, no se envía nada.
 */
const PROPOSAL_CONFIG = {
  client: "Grupo Virgen del Valle",
  developer: "Elipsoft",
  implementationDays: 45,

  contact: {
    whatsapp: null, // pendiente: WhatsApp comercial de Elipsoft
    email: null, // pendiente: correo comercial de Elipsoft
  },

  pdfUrl: null, // pendiente: PDF definitivo de la propuesta

  elipsoft: {
    url: null, // pendiente: sitio web oficial de Elipsoft
  },

  messages: {
    advance:
      "Hola. Revisamos la propuesta de transformación digital para Grupo Virgen del Valle y queremos conversar sobre el inicio de la Fase 1.",
    question:
      "Hola. Revisamos la propuesta de transformación digital para Grupo Virgen del Valle y tenemos una consulta:",
  },

  analytics: {
    endpoint: null,
  },
};
