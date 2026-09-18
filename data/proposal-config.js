/**
 * Configuración de la propuesta comercial (propuesta.html).
 *
 * CONTACTO COMERCIAL: no se inventan datos. Mientras whatsapp y email
 * estén en null, los botones "Quiero avanzar" / "Tengo una consulta"
 * muestran el mensaje redactado para copiarlo. Completar antes de enviar
 * la propuesta al cliente.
 *
 * ANALYTICS: los eventos se registran solo en memoria del navegador y se
 * emiten como CustomEvent("proposal:event"). Si se define endpoint, se
 * envían con navigator.sendBeacon (pensado para un webhook de n8n). No se
 * recolectan datos personales.
 */
const PROPOSAL_CONFIG = {
  client: "Grupo Virgen del Valle",
  developer: "Elipsoft",
  implementationDays: 45,

  contact: {
    whatsapp: null, // p. ej. "58412XXXXXXX" — pendiente de definir por Elipsoft
    email: null, // p. ej. "comercial@dominio.com" — pendiente de definir por Elipsoft
  },

  messages: {
    advance:
      "Hola. Revisamos la propuesta de transformación digital para Grupo Virgen del Valle y queremos conversar sobre el inicio de la Fase 1.",
    question:
      "Hola. Revisamos la propuesta de transformación digital para Grupo Virgen del Valle y tenemos una consulta:",
  },


  analytics: {
    endpoint: null, // p. ej. URL de webhook n8n; null = no se envía nada
  },
};
