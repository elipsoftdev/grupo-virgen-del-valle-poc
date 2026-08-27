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
    bot: "Hola. Estoy aquí para orientarte. ¿Necesitas asistencia inmediata o deseas información sobre nuestros servicios?",
    options: [
      { label: "Necesito asistencia ahora", next: "urgent" },
      { label: "Planes de previsión", next: "prevision" },
      { label: "Cremación", next: "cremacion" },
      { label: "Traslados", next: "traslados" },
      { label: "Sedes", next: "sedes" },
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
  cremacion: {
    bot: "Podemos orientarle sobre el proceso de cremación y las alternativas disponibles según su ciudad.",
    options: [
      { label: "Cotizar cremación", action: "quote", type: "cremacion" },
      { label: "Ver servicios", action: "scroll", target: "servicios" },
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
  const closeBtn = document.getElementById("assistant-close");
  if (!launcher || !panel) return;

  launcher.addEventListener("click", () => toggleAssistant());
  closeBtn.addEventListener("click", () => closeAssistantPanel());

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
    appendChatBubble("Perfecto, le llevo al cotizador con esa opción preseleccionada.", "bot");
    startQuoterWithType(opt.type);
    return;
  }
  if (opt.action === "scroll") {
    const el = document.getElementById(opt.target);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    appendChatOptions([{ label: "Volver al inicio", next: "root" }]);
  }
}

function announceAssistant(text) {
  openAssistantPanel();
  appendChatBubble(text, "bot");
}
