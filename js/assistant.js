/**
 * Asistente digital 24/7 — simulado mediante un árbol conversacional.
 *
 * IMPORTANTE: esto es una demostración de experiencia, NO una integración
 * real de IA. No se usan API keys ni llamadas a modelos de lenguaje: el
 * frontend en GitHub Pages es contenido público y nunca debe exponer
 * credenciales. La arquitectura futura (documentada en el README) conecta
 * este widget a una API segura con un asistente IA real.
 */

const ASSISTANT_TREE = {
  root: {
    bot: "Hola. Estoy aquí para orientarte. ¿Necesitas asistencia inmediata o deseas cotizar un servicio?",
    options: [
      { label: "Necesito asistencia ahora", next: "urgent" },
      { label: "Cotizar un servicio", action: "quote", type: null },
      { label: "Planes de previsión", next: "prevision" },
      { label: "Traslados", next: "traslados" },
      { label: "Sedes", next: "sedes" },
      { label: "Obituarios", action: "link", href: "obituarios.html" },
      { label: "Hablar con una persona", next: "human" },
    ],
  },
  urgent: {
    bot: "Entiendo. Esto puede requerir atención inmediata. Puede escribirnos ahora por WhatsApp y un asesor le atenderá directamente, o completar el cotizador para darnos más contexto antes.",
    options: [
      { label: "Escribir por WhatsApp ahora", action: "whatsapp", key: "urgent" },
      { label: "Completar el cotizador", action: "quote", type: "servicio-ahora" },
      { label: "Volver al inicio", next: "root" },
    ],
  },
  prevision: {
    bot: "La previsión permite planificar con calma y evitar decisiones bajo presión, protegiendo la tranquilidad de su familia. ¿Qué desea hacer?",
    options: [
      { label: "Conocer planes", action: "scroll", target: "prevision" },
      { label: "Cotizar previsión", action: "quote", type: "prevision" },
      { label: "Hablar con un asesor", action: "whatsapp", key: "prevision" },
      { label: "Volver al inicio", next: "root" },
    ],
  },
  traslados: {
    bot: "Contamos con traslados nacionales. Indíquenos origen y destino en el cotizador y un asesor confirmará disponibilidad.",
    options: [
      { label: "Cotizar traslado", action: "quote", type: "traslado" },
      { label: "Volver al inicio", next: "root" },
    ],
  },
  sedes: {
    bot: "Tenemos presencia en Cumaná (sede principal), Puerto La Cruz, Anaco y Distrito Capital, con atención las 24 horas.",
    options: [
      { label: "Ver sedes", action: "scroll", target: "sedes" },
      { label: "Volver al inicio", next: "root" },
    ],
  },
  human: {
    bot: "Con gusto. Un asesor humano puede atenderle directamente por WhatsApp.",
    options: [
      { label: "Escribir por WhatsApp", action: "whatsapp", key: "generic" },
      { label: "Volver al inicio", next: "root" },
    ],
  },
};

const ASSISTANT_WHATSAPP_MESSAGES = {
  urgent: "Hola, Grupo Virgen del Valle.\n\nNecesito asistencia inmediata.\n\n¿Podría comunicarse conmigo un asesor lo antes posible?",
  prevision: "Hola, Grupo Virgen del Valle.\n\nMe gustaría recibir información sobre sus planes de previsión funeraria.\n\n¿Podría contactarme un asesor?",
  generic: "Hola, Grupo Virgen del Valle.\n\nMe gustaría hablar con un asesor.\n\n¿Podrían contactarme?",
};

let assistantStarted = false;

function initAssistant() {
  const launcher = document.getElementById("assistant-launcher");
  const panel = document.getElementById("assistant-panel");
  if (!launcher || !panel) return;

  upgradeAssistantChrome(panel);

  // El botón de cierre se re-crea al modernizar el encabezado.
  const closeBtn = document.getElementById("assistant-close");

  launcher.addEventListener("click", () => toggleAssistant());
  if (closeBtn) closeBtn.addEventListener("click", () => closeAssistantPanel());

  document.querySelectorAll("[data-open-assistant]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openAssistantPanel();
      const startNode = el.getAttribute("data-open-assistant");
      if (startNode && startNode !== "root") {
        goToAssistantNode(startNode);
      }
    });
  });
}

function toggleAssistant() {
  const panel = document.getElementById("assistant-panel");
  if (panel.classList.contains("is-open")) {
    closeAssistantPanel();
  } else {
    openAssistantPanel();
  }
}

function openAssistantPanel() {
  const panel = document.getElementById("assistant-panel");
  panel.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");
  if (!assistantStarted) {
    assistantStarted = true;
    goToAssistantNode("root");
  }
  const firstOption = panel.querySelector(".chat-option-btn");
  if (firstOption) firstOption.focus();
}

function closeAssistantPanel() {
  const panel = document.getElementById("assistant-panel");
  panel.classList.remove("is-open");
  panel.setAttribute("aria-hidden", "true");
  document.getElementById("assistant-launcher").focus();
}

/**
 * Moderniza el encabezado del panel y añade la caja de escritura.
 * Se hace desde JS para no duplicar el mismo bloque en cada página.
 */
function upgradeAssistantChrome(panel) {
  const header = panel.querySelector(".assistant-panel__header");
  if (header && !header.querySelector(".assistant-status")) {
    header.innerHTML = `
      <div class="assistant-panel__identity">
        <span class="assistant-avatar">${icon("sparkles")}</span>
        <div>
          <h3 id="assistant-title">Asistente Virtual</h3>
          <p>Grupo Virgen del Valle</p>
          <span class="assistant-status"><span class="dot"></span>Disponible 24/7</span>
        </div>
      </div>
      <div class="assistant-panel__head-actions">
        <span class="assistant-demo-tag">DEMO</span>
        <button id="assistant-close" class="assistant-panel__close" aria-label="Cerrar asistente">✕</button>
      </div>
    `;
  }

  const footer = panel.querySelector(".assistant-panel__footer");
  if (footer && !panel.querySelector("#assistant-form")) {
    const form = document.createElement("form");
    form.className = "assistant-composer";
    form.id = "assistant-form";
    form.innerHTML = `
      <label class="sr-only" for="assistant-input">Escriba su consulta</label>
      <input type="text" id="assistant-input" placeholder="Escriba aquí su consulta..." autocomplete="off" />
      <button type="submit" class="assistant-composer__send" aria-label="Enviar consulta">${icon("send")}</button>
    `;
    panel.insertBefore(form, footer);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("assistant-input");
      const text = input.value.trim();
      if (!text) return;
      input.value = "";
      handleAssistantInput(text);
    });
  }
}

const ASSISTANT_CITIES = ["Caracas", "Cumaná", "Puerto La Cruz", "Anaco", "Maturín", "Barcelona", "Margarita"];

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Detección de intención por palabras clave: sin modelos ni servicios externos. */
function detectAssistantIntent(text) {
  const normalized = normalizeText(text);

  const cities = ASSISTANT_CITIES.map((city) => ({ city, index: normalized.indexOf(normalizeText(city)) }))
    .filter((c) => c.index >= 0)
    .sort((a, b) => a.index - b.index)
    .map((c) => c.city);

  if (/trasl|llevar|mover|traer|desde .* (hasta|a) /.test(normalized)) {
    return { intent: "traslado", cities };
  }
  if (/previs|plan familiar|planes familiares|anticipad|plan funerario/.test(normalized)) {
    return { intent: "prevision", cities };
  }
  if (/crema/.test(normalized)) {
    return { intent: "cremacion", cities };
  }
  if (/fallec|murio|falle|acaba de|urgente|ahora mismo|inmediato|servicio ahora|necesito un servicio/.test(normalized)) {
    return { intent: "urgente", cities };
  }
  if (/sede|direccion|donde estan|ubicad|agencia/.test(normalized)) {
    return { intent: "sedes", cities };
  }
  if (/obituario|homenaje|velacion|velatorio/.test(normalized)) {
    return { intent: "obituarios", cities };
  }
  if (/precio|costo|cuanto/.test(normalized)) {
    return { intent: "precio", cities };
  }
  return { intent: "desconocido", cities };
}

function handleAssistantInput(text) {
  const body = document.getElementById("assistant-body");
  const optionsBlock = body.querySelector(".chat-options:last-child");
  if (optionsBlock) optionsBlock.remove();

  appendChatBubble(text, "user");

  const { intent, cities } = detectAssistantIntent(text);
  showAssistantTyping(() => respondToIntent(intent, cities));
}

/** Indicador de escritura para que la respuesta no aparezca de golpe. */
function showAssistantTyping(callback) {
  const body = document.getElementById("assistant-body");
  const typing = document.createElement("div");
  typing.className = "chat-typing";
  typing.innerHTML = "<span></span><span></span><span></span>";
  body.appendChild(typing);
  body.scrollTop = body.scrollHeight;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.setTimeout(
    () => {
      typing.remove();
      callback();
    },
    reduce ? 120 : 650
  );
}

function respondToIntent(intent, cities) {
  if (intent === "traslado") {
    assistantTransferState.origin = cities[0] || null;
    assistantTransferState.destination = cities[1] || null;
    const route =
      assistantTransferState.origin && assistantTransferState.destination
        ? ` desde ${assistantTransferState.origin} hasta ${assistantTransferState.destination}`
        : "";
    appendChatBubble(
      `Entiendo. Puedo ayudarle con el traslado${route}. Por la naturaleza de su solicitud voy a tratarla como prioritaria.`,
      "bot"
    );
    appendChatBubble("¿El traslado necesita realizarse hoy?", "bot");
    appendChatOptions([
      { label: "Sí, es urgente", action: "transfer-urgency", urgency: "urgente" },
      { label: "No, puede programarse", action: "transfer-urgency", urgency: "programado" },
      { label: "Hablar con un asesor", action: "whatsapp", key: "urgent" },
    ]);
    return;
  }

  if (intent === "prevision") {
    appendChatBubble(
      "Con gusto. Los planes de previsión permiten organizar todo con anticipación y evitar decisiones bajo presión.",
      "bot"
    );
    appendChatOptions(ASSISTANT_TREE.prevision.options);
    return;
  }

  if (intent === "cremacion") {
    appendChatBubble(
      "Podemos orientarle sobre el proceso de cremación y las alternativas disponibles según su ciudad.",
      "bot"
    );
    appendChatOptions([
      { label: "Cotizar cremación", action: "quote", type: "cremacion" },
      { label: "Hablar con un asesor", action: "whatsapp", key: "generic" },
      { label: "Volver al inicio", next: "root" },
    ]);
    return;
  }

  if (intent === "urgente") {
    appendChatBubble(
      "Lamento mucho lo que está atravesando. Estamos disponibles las 24 horas y puedo comunicarle de inmediato con un asesor.",
      "bot"
    );
    appendChatOptions(ASSISTANT_TREE.urgent.options);
    return;
  }

  if (intent === "sedes") {
    appendChatBubble(ASSISTANT_TREE.sedes.bot, "bot");
    appendChatOptions(ASSISTANT_TREE.sedes.options);
    return;
  }

  if (intent === "obituarios") {
    appendChatBubble("Puede consultar los homenajes publicados o solicitar la publicación de uno nuevo.", "bot");
    appendChatOptions([
      { label: "Ver obituarios", action: "link", href: "obituarios.html" },
      { label: "Solicitar publicación", action: "link", href: "solicitar-obituario.html" },
      { label: "Volver al inicio", next: "root" },
    ]);
    return;
  }

  if (intent === "precio") {
    appendChatBubble(
      "Cada servicio se ajusta a la necesidad de la familia, por eso un asesor le indica las alternativas según su caso. Puedo preparar su solicitud para que le contacten.",
      "bot"
    );
    appendChatOptions([
      { label: "Cotizar un servicio", action: "quote", type: null },
      { label: "Hablar con un asesor", action: "whatsapp", key: "generic" },
      { label: "Volver al inicio", next: "root" },
    ]);
    return;
  }

  appendChatBubble(
    "Gracias por escribirnos. Para orientarle mejor, ¿cuál de estas opciones se acerca más a lo que necesita?",
    "bot"
  );
  appendChatOptions(ASSISTANT_TREE.root.options);
}

const assistantTransferState = { origin: null, destination: null, urgency: null };

function handleTransferUrgency(urgency) {
  assistantTransferState.urgency = urgency;
  const isUrgent = urgency === "urgente";

  appendChatBubble("Perfecto. Estoy preparando la información para nuestro equipo.", "bot");

  const requestId = typeof generateDemoLeadId === "function" ? generateDemoLeadId() : "GVV-2026-0185";
  const origin = assistantTransferState.origin || "Ciudad de origen";
  const destination = assistantTransferState.destination || "Ciudad de destino";

  appendAssistantRequestCard({
    id: requestId,
    service: "Traslado",
    route: `${origin} → ${destination}`,
    priority: isUrgent ? "Prioridad alta" : "Programado",
  });

  appendChatBubble("Un asesor puede continuar esta conversación.", "bot");
  appendChatOptions([
    { label: "Hablar con un asesor", action: "whatsapp", key: isUrgent ? "urgent" : "generic" },
    { label: "Completar la cotización", action: "quote", type: "traslado" },
    { label: "Volver al inicio", next: "root" },
  ]);
}

/** Tarjeta resumen dentro del chat, como la vería el visitante. */
function appendAssistantRequestCard(request) {
  const body = document.getElementById("assistant-body");
  const card = document.createElement("div");
  card.className = "chat-request-card";
  card.innerHTML = `
    <span class="chat-request-card__id">Solicitud ${request.id}</span>
    <strong>${request.service}</strong>
    <span class="chat-request-card__route">${request.route}</span>
    <span class="chat-request-card__priority">${request.priority}</span>
  `;
  body.appendChild(card);
  body.scrollTop = body.scrollHeight;
}

function goToAssistantNode(nodeKey) {
  const node = ASSISTANT_TREE[nodeKey];
  if (!node) return;
  appendChatBubble(node.bot, "bot");
  appendChatOptions(node.options);
}

function appendChatBubble(text, from) {
  const body = document.getElementById("assistant-body");
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble chat-bubble--${from}`;
  bubble.textContent = text;
  body.appendChild(bubble);
  body.scrollTop = body.scrollHeight;
}

function appendChatOptions(options) {
  const body = document.getElementById("assistant-body");
  const existing = body.querySelector(".chat-options:last-child");
  if (existing) existing.remove();

  const wrap = document.createElement("div");
  wrap.className = "chat-options";
  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chat-option-btn";
    btn.textContent = opt.label;
    btn.addEventListener("click", () => handleAssistantOption(opt));
    wrap.appendChild(btn);
  });
  body.appendChild(wrap);
  body.scrollTop = body.scrollHeight;
}

function handleAssistantOption(opt) {
  const body = document.getElementById("assistant-body");
  const optionsBlock = body.querySelector(".chat-options:last-child");
  if (optionsBlock) optionsBlock.remove();

  appendChatBubble(opt.label, "user");

  if (opt.next) {
    goToAssistantNode(opt.next);
    return;
  }
  if (opt.action === "whatsapp") {
    const msg = ASSISTANT_WHATSAPP_MESSAGES[opt.key] || ASSISTANT_WHATSAPP_MESSAGES.generic;
    const url = buildWhatsappUrl(msg);
    if (url) {
      window.open(url, "_blank", "noopener");
      appendChatBubble("Le redirigí a WhatsApp para que un asesor le atienda directamente.", "bot");
    } else {
      appendChatBubble("El canal de WhatsApp aún no está configurado en esta demostración.", "bot");
    }
    appendChatOptions([{ label: "Volver al inicio", next: "root" }]);
    return;
  }
  if (opt.action === "quote") {
    const hasQuoter = !!document.getElementById("quoter");
    if (hasQuoter) {
      appendChatBubble("Perfecto, le llevo al cotizador.", "bot");
      startQuoterWithType(opt.type);
    } else {
      appendChatBubble("Perfecto, le llevo al cotizador.", "bot");
      window.location.href = opt.type ? `cotizar.html?tipo=${opt.type}` : "cotizar.html";
    }
    return;
  }
  if (opt.action === "transfer-urgency") {
    showAssistantTyping(() => handleTransferUrgency(opt.urgency));
    return;
  }
  if (opt.action === "link") {
    window.location.href = opt.href;
    return;
  }
  if (opt.action === "scroll") {
    const el = document.getElementById(opt.target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      appendChatOptions([{ label: "Volver al inicio", next: "root" }]);
    } else {
      window.location.href = `index.html#${opt.target}`;
    }
  }
}

function announceAssistant(text) {
  openAssistantPanel();
  appendChatBubble(text, "bot");
}
