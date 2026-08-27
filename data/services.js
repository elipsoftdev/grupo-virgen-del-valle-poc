/**
 * Catálogo de servicios organizado conceptualmente en cuatro bloques.
 * Algunos servicios se presentan como parte del concepto comercial de la
 * PoC y no deben interpretarse como una oferta contractual vigente: el
 * catálogo real debe ser validado por el cliente antes de producción.
 */
const SERVICE_CATEGORIES = [
  {
    id: "inmediatos",
    title: "Servicios inmediatos",
    description: "Disponibles las 24 horas, los 365 días del año.",
    icon: "clock",
    items: [
      "Atención funeraria 24/7",
      "Velación",
      "Traslado del fallecido",
      "Traslados nacionales",
      "Preparación",
      "Carroza fúnebre",
      "Trámites y diligencias",
    ],
  },
  {
    id: "destino-final",
    title: "Destino final",
    description: "Acompañamiento en cada alternativa, con la información clara para decidir con calma.",
    icon: "leaf",
    items: ["Inhumación", "Cremación", "Cementerio municipal", "Cementerios privados"],
  },
  {
    id: "complementarios",
    title: "Servicios complementarios",
    description: "Todo lo que rodea a la despedida, cuidado al detalle.",
    icon: "heart",
    items: [
      "Asesoría integral",
      "Servicios religiosos",
      "Arreglos florales",
      "Atención a familiares",
      "Salas y espacios de descanso",
    ],
  },
  {
    id: "prevision",
    title: "Previsión",
    description: "Planificar hoy para proteger la tranquilidad de quienes más queremos.",
    icon: "shield",
    items: ["Planes funerarios", "Previsión familiar", "Convenios", "Atención corporativa"],
  },
];
