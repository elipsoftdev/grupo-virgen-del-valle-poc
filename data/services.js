/**
 * Servicios del Home — Fase 1: necesidad inmediata / venta directa.
 * Cada bloque tiene su detalle ampliado (modal) y su tipo de cotización.
 *
 * Previsión funeraria queda fuera de la Fase 1: será una segunda etapa
 * independiente, con su propio análisis y propuesta.
 *
 * El catálogo real debe ser validado por el cliente antes de producción.
 */
const SERVICES = [
  {
    id: "atencion-inmediata",
    title: "Atención inmediata",
    icon: "clock",
    desc: "Disponibles las 24 horas para orientarle y activar el servicio que su familia necesita.",
    items: ["Atención funeraria 24/7", "Orientación inicial", "Trámites y diligencias"],
    quoteType: "servicio-ahora",
  },
  {
    id: "velacion",
    title: "Velación",
    icon: "heart",
    desc: "Salas y espacios pensados para despedir con serenidad y acompañar a la familia.",
    items: ["Salas de velación", "Preparación", "Salas y espacios de descanso"],
    quoteType: "velacion",
  },
  {
    id: "cremacion",
    title: "Cremación",
    icon: "flame",
    desc: "Acompañamiento claro en cada paso, con la información necesaria para decidir con calma.",
    items: ["Proceso de cremación", "Entrega de cenizas", "Alternativas de destino final"],
    quoteType: "cremacion",
  },
  {
    id: "inhumacion",
    title: "Inhumación",
    icon: "leaf",
    desc: "Orientación sobre cementerios municipales y privados según su ciudad.",
    items: ["Inhumación", "Cementerio municipal", "Cementerios privados"],
    quoteType: "cementerio",
  },
  {
    id: "traslados",
    title: "Traslados",
    icon: "truck",
    desc: "Traslados dentro de la ciudad y entre ciudades, con unidades modernas.",
    items: ["Traslado del fallecido", "Traslados nacionales", "Carroza fúnebre"],
    quoteType: "traslado",
  },
  {
    id: "asesoria",
    title: "Asesoría y trámites",
    icon: "users",
    desc: "Acompañamiento en gestiones y apoyo profesional en cada paso.",
    items: ["Asesoría integral", "Servicios religiosos", "Atención a familiares"],
    quoteType: "otro",
  },
];
