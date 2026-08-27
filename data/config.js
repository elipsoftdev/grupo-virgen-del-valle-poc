/**
 * Configuración centralizada del sitio.
 * Todo dato que dependa de confirmación del cliente vive aquí,
 * nunca disperso en el resto del código.
 */

// Datos operativos: se usan para generar enlaces de WhatsApp, tel:, mailto:, etc.
// El WhatsApp y el correo provienen del sitio institucional público actual de la
// empresa (grupovirgendelvalle.com) y se consideran confirmados. El resto de
// datos marcados como "null" o dentro de CLIENT_CONFIG.pending deben ser
// validados por el cliente antes de producción.
const CONFIG = {
  brandName: "Grupo Virgen del Valle",
  legalName: "Funeraria Virgen del Valle C.A.",
  rif: "J-08000861-8",
  whatsapp: "584121188062", // confirmado: publicado en grupovirgendelvalle.com
  phone24h: null, // no se encontró un número de línea fija 24h publicado; validar con el cliente
  email: "ventas@grupovirgendelvalle.com",
  instagram: "https://www.instagram.com/grupovirgendelvalle/",
  yearsOfService: "más de siete décadas",
};

/**
 * Estructura pensada para exponer, de forma explícita, qué información de esta
 * PoC es real/confirmada y cuál está pendiente de validación por el cliente.
 * Ver docs/recomendaciones-produccion.md para el detalle completo.
 */
const CLIENT_CONFIG = {
  brandName: CONFIG.brandName,
  whatsapp: CONFIG.whatsapp,
  phone24h: CONFIG.phone24h,
  locationsConfirmed: ["Cumaná", "Puerto La Cruz", "Anaco", "Caracas (Distrito Capital)"],
  socialNetworks: [CONFIG.instagram],
  identityManualReceived: false,
  pending: [
    "Manual de identidad gráfica oficial (colores exactos, tipografías, logo vectorial)",
    "Banco fotográfico profesional actualizado",
    "Direcciones y teléfonos específicos de cada sede",
    "Confirmación de reglas de distribución de WhatsApp por sede",
    "Catálogo vigente de servicios y planes de previsión con condiciones actuales",
  ],
};

function buildWhatsappUrl(message) {
  const digits = (CONFIG.whatsapp || "").replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
