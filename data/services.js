/**
 * Servicios mostrados en el Home: seis bloques comerciales simples, cada
 * uno con su detalle ampliado (mostrado en un modal ligero, sin necesidad
 * de una página aparte) y su tipo de cotización asociado.
 *
 * Algunos servicios se presentan como parte del concepto comercial de la
 * PoC y no deben interpretarse como una oferta contractual vigente: el
 * catálogo real debe ser validado por el cliente antes de producción.
 */
const SERVICES = [
  {
    id: "servicio-funerario",
    title: "Servicio funerario",
    icon: "heart",
    desc: "Atención inmediata, velación y acompañamiento completo en el momento que más lo necesita.",
    items: ["Atención funeraria 24/7", "Velación", "Preparación", "Carroza fúnebre", "Trámites y diligencias"],
    quoteType: "servicio-ahora",
  },
  {
    id: "traslados",
    title: "Traslados",
    icon: "truck",
    desc: "Traslados nacionales con unidades modernas, dentro y entre ciudades.",
    items: ["Traslado del fallecido", "Traslados nacionales", "Coordinación entre sedes"],
    quoteType: "traslado",
  },
  {
    id: "cremacion",
    title: "Cremación",
    icon: "flame",
    desc: "Acompañamiento claro en cada alternativa, con la información necesaria para decidir con calma.",
    items: ["Proceso de cremación", "Entrega de cenizas", "Alternativas de destino final"],
    quoteType: "cremacion",
  },
  {
    id: "cementerio",
    title: "Cementerio",
    icon: "leaf",
    desc: "Orientación sobre alternativas de cementerio municipal y privado según su ciudad.",
    items: ["Inhumación", "Cementerio municipal", "Cementerios privados"],
    quoteType: "cementerio",
  },
  {
    id: "prevision-funeraria",
    title: "Previsión funeraria",
    icon: "shield",
    desc: "Planifique hoy y proteja la tranquilidad de quienes más quiere.",
    items: ["Planes individuales", "Planes familiares", "Convenios corporativos"],
    quoteType: "prevision",
  },
  {
    id: "asesoria",
    title: "Asesoría y trámites",
    icon: "users",
    desc: "Acompañamiento en gestiones legales y apoyo profesional en cada paso.",
    items: ["Asesoría integral", "Servicios religiosos", "Atención a familiares"],
    quoteType: "otro",
  },
];
