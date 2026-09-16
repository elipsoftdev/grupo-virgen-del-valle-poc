/**
 * Centro de atención omnicanal (demo).
 *
 * Muestra cómo todas las conversaciones —WhatsApp, Instagram, Facebook y
 * web— llegan a una misma bandeja, ya clasificadas por el asistente
 * digital, con un resumen para que el asesor humano continúe la atención.
 *
 * Todo ocurre en memoria: no hay backend ni mensajería real.
 */

const INBOX_TABS = [
  { id: "todas", label: "Todas" },
  { id: "urgentes", label: "Urgentes" },
  { id: "sin-asignar", label: "Sin asignar" },
  { id: "en-atencion", label: "En atención" },
];

const inboxState = {
  conversations: [],
  activeId: null,
  tab: "todas",
};

/** Convierte la solicitud del cotizador en una conversación de la bandeja. */
function leadToConversation(lead) {
  const detailLines = [];
  if (lead.details) detailLines.push(lead.details);

  const messages = [
    {
      from: "client",
      time: "Ahora",
      text: `Completé una solicitud desde la web: ${lead.service}${lead.city ? ` en ${lead.city}` : ""}.`,
    },
    {
      from: "bot",
      time: "Ahora",
      text: `Gracias. Registré su solicitud con el número ${lead.id} y la clasifiqué con prioridad ${String(lead.priority || "normal").toLowerCase()}.`,
    },
    {
      from: "bot",
      time: "Ahora",
      text: "Un asesor continuará la atención para confirmar disponibilidad, proceso y cotización.",
    },
  ];

  return {
    id: lead.id,
    name: lead.name || "Solicitud web",
    initials: demoInitials(lead.name),
    source: lead.source || "Web",
    preview: `${lead.service}${lead.city ? ` · ${lead.city}` : ""}`,
    time: "Recién recibida",
    unread: 1,
    priority: lead.priority || "Normal",
    status: "Sin asignar",
    assignee: null,
    isNew: true,
    messages,
    intelligence: {
      need: lead.service || "Consulta",
      route: lead.route || lead.city || "—",
      urgency: lead.priority || "Normal",
      intent: lead.intent || "Contratación",
      origin: `${lead.source || "Web"} · Cotizador`,
      state: "Requiere asesor humano",
      summary: buildLeadSummary(lead),
      nextAction: "Asignar asesor",
    },
    contact: { phone: lead.phone, email: lead.email },
  };
}

function buildLeadSummary(lead) {
  const parts = [`Solicitud de ${String(lead.service || "servicio").toLowerCase()}`];
  if (lead.route) parts.push(`con ruta ${lead.route}`);
  else if (lead.city) parts.push(`en ${lead.city}`);
  if (lead.details) parts.push(`(${lead.details})`);
  const priority = String(lead.priority || "normal").toLowerCase();
  return `${parts.join(" ")}. Prioridad ${priority}; el cliente dejó sus datos de contacto y espera que un asesor continúe la atención.`;
}

function buildInbox() {
  const stored = getDemoLead();
  const base = DEMO_CONVERSATIONS.map((c) => ({ ...c, messages: [...c.messages] }));
  inboxState.conversations = stored ? [leadToConversation(stored), ...base] : base;
  inboxState.activeId = inboxState.conversations.length ? inboxState.conversations[0].id : null;
}

function filteredConversations() {
  const list = inboxState.conversations;
  if (inboxState.tab === "urgentes") return list.filter((c) => c.priority === "Alta");
  if (inboxState.tab === "sin-asignar") return list.filter((c) => !c.assignee);
  if (inboxState.tab === "en-atencion") return list.filter((c) => !!c.assignee);
  return list;
}

function tabCount(tabId) {
  const list = inboxState.conversations;
  if (tabId === "urgentes") return list.filter((c) => c.priority === "Alta").length;
  if (tabId === "sin-asignar") return list.filter((c) => !c.assignee).length;
  if (tabId === "en-atencion") return list.filter((c) => !!c.assignee).length;
  return list.length;
}

function renderInboxTabs() {
  const host = document.getElementById("inbox-tabs");
  if (!host) return;

  host.innerHTML = INBOX_TABS.map(
    (tab) => `
      <button type="button" class="inbox-tab ${inboxState.tab === tab.id ? "is-active" : ""}"
        data-inbox-tab="${tab.id}" aria-pressed="${inboxState.tab === tab.id}">
        ${tab.label}<span class="inbox-tab__count">${tabCount(tab.id)}</span>
      </button>`
  ).join("");

  host.querySelectorAll("[data-inbox-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      inboxState.tab = btn.getAttribute("data-inbox-tab");
      const visible = filteredConversations();
      if (visible.length && !visible.some((c) => c.id === inboxState.activeId)) {
        inboxState.activeId = visible[0].id;
      }
      renderInbox();
    });
  });
}

function renderConversationList() {
  const host = document.getElementById("conv-list");
  if (!host) return;

  const list = filteredConversations();
  if (!list.length) {
    host.innerHTML = `
      <div class="empty-state">
        ${icon("inbox")}
        <p>No hay conversaciones en esta vista.</p>
      </div>`;
    return;
  }

  host.innerHTML = list
    .map(
      (conv) => `
      <button type="button" class="conv-item ${conv.id === inboxState.activeId ? "is-active" : ""} ${conv.isNew ? "is-new" : ""}"
        data-conv="${conv.id}">
        <span class="avatar ${conv.isNew ? "avatar--gold" : ""}">${conv.initials}</span>
        <span>
          <span class="conv-item__top">
            <span class="conv-item__name">${conv.name}</span>
            <span class="conv-item__time">${conv.time}</span>
          </span>
          <span class="conv-item__preview">${conv.preview}</span>
          <span class="conv-item__meta">
            ${channelTag(conv.source)}
            ${conv.priority === "Alta" ? priorityBadge(conv.priority) : ""}
            ${conv.isNew ? '<span class="new-flag">Nuevo</span>' : ""}
            ${conv.unread ? `<span class="unread-dot">${conv.unread}</span>` : ""}
          </span>
        </span>
      </button>`
    )
    .join("");

  host.querySelectorAll("[data-conv]").forEach((btn) => {
    btn.addEventListener("click", () => {
      inboxState.activeId = btn.getAttribute("data-conv");
      const conv = activeConversation();
      if (conv) conv.unread = 0;
      renderInbox();
    });
  });
}

function activeConversation() {
  return inboxState.conversations.find((c) => c.id === inboxState.activeId) || null;
}

function renderThread() {
  const host = document.getElementById("chat-panel");
  if (!host) return;

  const conv = activeConversation();
  if (!conv) {
    host.innerHTML = `<div class="empty-state">${icon("message")}<p>Seleccione una conversación para verla aquí.</p></div>`;
    return;
  }

  host.innerHTML = `
    <div class="chat-header">
      <span class="avatar ${conv.isNew ? "avatar--gold" : ""}">${conv.initials}</span>
      <div class="chat-header__info">
        <h2>${conv.name}</h2>
        <div class="conv-item__meta">
          ${channelTag(conv.source)}
          ${priorityBadge(conv.priority)}
          ${statusPill(conv.assignee ? "En atención" : "Sin asignar")}
        </div>
      </div>
      <span class="demo-chip">Conversación simulada</span>
    </div>

    <div class="chat-thread" id="chat-thread">
      ${conv.messages
        .map(
          (msg, index) => `
        <div class="chat-msg chat-msg--${msg.from}" style="animation-delay:${Math.min(index * 60, 300)}ms">
          <div class="chat-msg__bubble">${msg.text}</div>
          <div class="chat-msg__meta">${msg.from === "client" ? conv.name : msg.from === "agent" ? "Asesor" : "Asistente digital"} · ${msg.time}</div>
        </div>`
        )
        .join("")}
    </div>

    <form class="chat-composer" id="chat-composer">
      <label class="sr-only" for="chat-input">Escribir respuesta</label>
      <input type="text" id="chat-input" placeholder="Escriba su respuesta..." autocomplete="off" />
      <button type="submit" class="chat-composer__send" aria-label="Enviar respuesta">${icon("send")}</button>
    </form>
  `;

  const thread = document.getElementById("chat-thread");
  if (thread) thread.scrollTop = thread.scrollHeight;

  const composer = document.getElementById("chat-composer");
  composer.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (!text) return;
    conv.messages.push({ from: "agent", time: "Ahora", text });
    renderInbox();
    showDemoToast("Respuesta enviada · demostración");
  });
}

function renderIntelligence() {
  const host = document.getElementById("ai-panel-body");
  if (!host) return;

  const conv = activeConversation();
  if (!conv) {
    host.innerHTML = `<div class="empty-state">${icon("sparkles")}<p>Sin conversación seleccionada.</p></div>`;
    return;
  }

  const ai = conv.intelligence;
  const facts = [
    ["Necesidad", ai.need],
    ["Ruta", ai.route],
    ["Urgencia", ai.urgency],
    ["Intención", ai.intent],
    ["Origen", ai.origin],
    ["Estado", ai.state],
  ];

  host.innerHTML = `
    <div class="ai-facts">
      ${facts
        .map(
          ([label, value]) => `
        <div class="ai-fact">
          <span class="ai-fact__label">${label}</span>
          <span class="ai-fact__value">${value}</span>
        </div>`
        )
        .join("")}
    </div>

    <div class="ai-summary">
      <h3>Resumen generado</h3>
      <p>${ai.summary}</p>
    </div>

    <div class="ai-next">
      <h3>Siguiente acción sugerida</h3>
      <div class="ai-next__action">${icon("sparkles")} ${ai.nextAction}</div>
    </div>

    <div class="assign-card ${conv.assignee ? "is-assigned" : ""}" id="assign-card">
      ${
        conv.assignee
          ? `<span class="avatar">${demoInitials(conv.assignee)}</span>
             <span><small>Asignado a</small><strong>${conv.assignee}</strong><small>Asesora</small></span>`
          : `${icon("userCheck")} <span>Sin asignar</span>`
      }
    </div>

    <div class="ai-actions">
      <button type="button" class="btn btn-primary btn-block" id="assign-btn" ${conv.assignee ? "disabled" : ""}>
        ${icon("userCheck")} ${conv.assignee ? "Ya asignada" : "Asignar a asesor"}
      </button>
      <button type="button" class="btn btn-ghost btn-block" id="create-opp-btn">Crear oportunidad</button>
      <button type="button" class="btn btn-ghost btn-block" id="history-btn">Ver historial</button>
    </div>
  `;

  const assignBtn = document.getElementById("assign-btn");
  if (assignBtn && !conv.assignee) {
    assignBtn.addEventListener("click", () => {
      const advisor = DEMO_ADVISORS[0];
      conv.assignee = advisor.name;
      conv.status = "En atención";
      conv.intelligence.state = "Asignada a asesor";
      conv.intelligence.nextAction = "Contactar al cliente";
      conv.messages.push({
        from: "agent",
        time: "Ahora",
        text: `Hola, soy ${advisor.name}. Continúo su atención personalmente.`,
      });
      renderInbox();
      showDemoToast("Solicitud asignada correctamente · DEMO");
    });
  }

  const oppBtn = document.getElementById("create-opp-btn");
  if (oppBtn) {
    oppBtn.addEventListener("click", () => showDemoToast("Oportunidad creada en el panel · DEMO"));
  }

  const historyBtn = document.getElementById("history-btn");
  if (historyBtn) {
    historyBtn.addEventListener("click", () => showDemoToast("Historial disponible en la versión productiva · DEMO"));
  }
}

function renderInbox() {
  renderInboxTabs();
  renderConversationList();
  renderThread();
  renderIntelligence();
}

document.addEventListener("DOMContentLoaded", () => {
  renderDemoSidebar();
  buildInbox();
  renderInbox();
  renderDemoResetButton("demo-reset-host");
});
