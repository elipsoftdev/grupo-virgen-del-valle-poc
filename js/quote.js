/**
 * Cotizador guiado. Construye un mensaje de WhatsApp personalizado según
 * las respuestas del visitante. No genera precios ni condiciones: solo
 * estructura la solicitud para que un asesor humano la atienda.
 */

const QUOTE_TYPES = [
  { id: "servicio-ahora", label: "Servicio funerario inmediato", icon: "clock" },
  { id: "prevision", label: "Plan de previsión", icon: "shield" },
  { id: "traslado", label: "Traslado", icon: "truck" },
  { id: "cremacion", label: "Cremación", icon: "flame" },
  { id: "cementerio", label: "Cementerio", icon: "leaf" },
  { id: "otro", label: "Otro servicio", icon: "message" },
];

const QUOTE_TYPE_LABELS = Object.fromEntries(QUOTE_TYPES.map((t) => [t.id, t.label]));

const CITIES = ["Caracas", "Cumaná", "Puerto La Cruz", "Anaco", "Otra ciudad"];

const CONTACT_METHODS = ["WhatsApp", "Llamada", "Correo"];

const STEP_LABELS = ["Servicio", "Ubicación", "Detalles", "Contacto"];

const quoteState = {
  step: 0,
  type: null,
  city: null,
  cityOther: "",
  origin: null,
  destination: null,
  urgency: null,
  modality: null,
  immediateContact: null,
  cremationMode: null,
  detail: "",
  contactName: "",
  contactPhone: "",
  contactMethod: null,
  contactEmail: "",
};

function resetQuoteState() {
  quoteState.step = 0;
  quoteState.type = null;
  quoteState.city = null;
  quoteState.cityOther = "";
  quoteState.origin = null;
  quoteState.destination = null;
  quoteState.urgency = null;
  quoteState.modality = null;
  quoteState.immediateContact = null;
  quoteState.cremationMode = null;
  quoteState.detail = "";
  quoteState.contactName = "";
  quoteState.contactPhone = "";
  quoteState.contactMethod = null;
  quoteState.contactEmail = "";
}

function cityLabel() {
  return quoteState.city === "Otra ciudad" && quoteState.cityOther ? quoteState.cityOther : quoteState.city;
}

function initQuoter() {
  const root = document.getElementById("quoter");
  if (!root) return;

  const params = new URLSearchParams(location.search);
  const presetType = params.get("tipo");
  if (presetType && QUOTE_TYPE_LABELS[presetType]) {
    quoteState.type = presetType;
    quoteState.step = 1;
  }

  renderQuoter();
}

function renderQuoter() {
  const root = document.getElementById("quoter");
  const isResult = quoteState.step >= STEP_LABELS.length;

  const progress = STEP_LABELS.map((label, i) => {
    const cls = isResult || i < quoteState.step ? "is-done" : i === quoteState.step ? "is-active" : "";
    return `<div class="quoter__progress-step ${cls}"><span>${i + 1}. ${label}</span></div>`;
  }).join("");

  root.innerHTML = `
    <div class="quoter__progress" role="progressbar" aria-valuenow="${Math.min(quoteState.step + 1, 4)}" aria-valuemin="1" aria-valuemax="4">${progress}</div>
    <div class="quoter__body">${renderQuoterStepContent()}</div>
    ${!isResult ? renderQuoterNav() : ""}
  `;
  bindQuoterEvents();
}

function renderQuoterStepContent() {
  switch (quoteState.step) {
    case 0:
      return `
        <h3>¿Qué servicio necesita?</h3>
        <p class="hint">Seleccione la opción que mejor describe lo que necesita.</p>
        <div class="option-grid" role="radiogroup" aria-label="Tipo de necesidad">
          ${QUOTE_TYPES.map(
            (t) => `
            <button type="button" class="option-card ${quoteState.type === t.id ? "is-selected" : ""}" data-quote-type="${t.id}" role="radio" aria-checked="${quoteState.type === t.id}">
              <span class="icon-badge">${icon(t.icon)}</span>
              <strong>${t.label}</strong>
            </button>`
          ).join("")}
        </div>`;
    case 1:
      return `
        <h3>¿Dónde necesita el servicio?</h3>
        <p class="hint">Así podremos orientarle según la sede más cercana.</p>
        <div class="option-grid" role="radiogroup" aria-label="Ciudad">
          ${CITIES.map(
            (c) => `
            <button type="button" class="option-card ${quoteState.city === c ? "is-selected" : ""}" data-quote-city="${c}" role="radio" aria-checked="${quoteState.city === c}">
              <span class="icon-badge">${icon("pin")}</span>
              <strong>${c}</strong>
            </button>`
          ).join("")}
        </div>
        ${
          quoteState.city === "Otra ciudad"
            ? `<div class="field-group" style="margin-top: var(--space-md);">
                <label for="quote-city-other">Indique la ciudad</label>
                <input type="text" id="quote-city-other" value="${quoteState.cityOther}" placeholder="Ej. Maturín" />
              </div>`
            : ""
        }`;
    case 2:
      return renderDynamicQuestions();
    case 3:
      return renderContactStep();
    default:
      return renderQuoteResult();
  }
}

function renderDynamicQuestions() {
  if (quoteState.type === "traslado") {
    return `
      <h3>Detalles del traslado</h3>
      <p class="hint">Con esto el asesor puede coordinar la unidad adecuada.</p>
      <div class="field-group">
        <label for="quote-origin">Ciudad de origen</label>
        <select id="quote-origin">
          <option value="">Seleccione...</option>
          ${CITIES.filter((c) => c !== "Otra ciudad")
            .map((c) => `<option value="${c}" ${quoteState.origin === c ? "selected" : ""}>${c}</option>`)
            .join("")}
        </select>
      </div>
      <div class="field-group">
        <label for="quote-destination">Ciudad de destino</label>
        <select id="quote-destination">
          <option value="">Seleccione...</option>
          ${CITIES.filter((c) => c !== "Otra ciudad")
            .map((c) => `<option value="${c}" ${quoteState.destination === c ? "selected" : ""}>${c}</option>`)
            .join("")}
        </select>
      </div>
      <div class="field-group">
        <label>Nivel de urgencia</label>
        <div class="option-grid">
          ${["Inmediata", "Programada"]
            .map(
              (u) => `<button type="button" class="option-card ${quoteState.urgency === u ? "is-selected" : ""}" data-quote-urgency="${u}"><strong>${u}</strong></button>`
            )
            .join("")}
        </div>
      </div>`;
  }
  if (quoteState.type === "prevision") {
    return `
      <h3>¿Qué tipo de previsión le interesa?</h3>
      <p class="hint">Podremos enviarle la información más adecuada a su caso.</p>
      <div class="option-grid">
        ${["Individual", "Familiar", "Corporativa"]
          .map(
            (m) => `<button type="button" class="option-card ${quoteState.modality === m ? "is-selected" : ""}" data-quote-modality="${m}">
              <span class="icon-badge">${icon("users")}</span><strong>${m}</strong>
            </button>`
          )
          .join("")}
      </div>`;
  }
  if (quoteState.type === "servicio-ahora") {
    return `
      <h3>Cuéntenos un poco más</h3>
      <p class="hint">Este dato ayuda al asesor a prepararse antes de contactarle.</p>
      <div class="field-group">
        <label for="quote-detail">Tipo general de necesidad (opcional)</label>
        <input type="text" id="quote-detail" value="${quoteState.detail}" placeholder="Ej. velación, traslado, trámites..." />
      </div>
      <div class="field-group">
        <label>¿Desea contacto inmediato?</label>
        <div class="option-grid">
          ${["Sí", "No"]
            .map(
              (v) => `<button type="button" class="option-card ${quoteState.immediateContact === v ? "is-selected" : ""}" data-quote-immediate="${v}"><strong>${v}</strong></button>`
            )
            .join("")}
        </div>
      </div>`;
  }
  if (quoteState.type === "cremacion") {
    return `
      <h3>Sobre la cremación</h3>
      <p class="hint">Así sabremos cómo orientarle mejor.</p>
      <div class="option-grid">
        ${["Servicio completo", "Solo información"]
          .map(
            (v) => `<button type="button" class="option-card ${quoteState.cremationMode === v ? "is-selected" : ""}" data-quote-cremation="${v}"><strong>${v}</strong></button>`
          )
          .join("")}
      </div>`;
  }
  return `
    <h3>Cuéntenos un poco más</h3>
    <p class="hint">Este paso es opcional, pero ayuda al asesor a prepararse antes de contactarle.</p>
    <div class="field-group">
      <label for="quote-detail">Necesidad general (opcional)</label>
      <input type="text" id="quote-detail" value="${quoteState.detail}" placeholder="Ej. información sobre disponibilidad y proceso" />
    </div>
    <div class="field-group">
      <label>Nivel de urgencia</label>
      <div class="option-grid">
        ${["Inmediata", "Programada"]
          .map(
            (u) => `<button type="button" class="option-card ${quoteState.urgency === u ? "is-selected" : ""}" data-quote-urgency="${u}"><strong>${u}</strong></button>`
          )
          .join("")}
      </div>
    </div>`;
}

function renderContactStep() {
  return `
    <h3>¿Cómo le contactamos?</h3>
    <p class="hint">Solo lo necesario para que un asesor le escriba o le llame.</p>
    <div class="field-group">
      <label for="quote-name">Nombre</label>
      <input type="text" id="quote-name" value="${quoteState.contactName}" placeholder="Su nombre" autocomplete="name" />
    </div>
    <div class="field-group">
      <label for="quote-phone">Teléfono</label>
      <input type="text" id="quote-phone" value="${quoteState.contactPhone}" placeholder="Ej. 0412-1234567" autocomplete="tel" />
    </div>
    <div class="field-group">
      <label>Método preferido de contacto</label>
      <div class="option-grid">
        ${CONTACT_METHODS.map(
          (m) => `<button type="button" class="option-card ${quoteState.contactMethod === m ? "is-selected" : ""}" data-quote-method="${m}"><strong>${m}</strong></button>`
        ).join("")}
      </div>
    </div>
    <div class="field-group">
      <label for="quote-email">Correo (opcional)</label>
      <input type="text" id="quote-email" value="${quoteState.contactEmail}" placeholder="correo@ejemplo.com" autocomplete="email" />
    </div>`;
}

function buildQuoteSummary() {
  const rows = [["Servicio", QUOTE_TYPE_LABELS[quoteState.type]]];
  rows.push(["Ciudad", cityLabel()]);
  if (quoteState.type === "traslado") {
    rows.push(["Origen", quoteState.origin || "—"]);
    rows.push(["Destino", quoteState.destination || "—"]);
    rows.push(["Atención", quoteState.urgency || "—"]);
  } else if (quoteState.type === "prevision") {
    rows.push(["Modalidad", quoteState.modality || "—"]);
  } else if (quoteState.type === "servicio-ahora") {
    if (quoteState.detail) rows.push(["Detalle", quoteState.detail]);
    rows.push(["Contacto inmediato", quoteState.immediateContact || "—"]);
  } else if (quoteState.type === "cremacion") {
    rows.push(["Modalidad", quoteState.cremationMode || "—"]);
  } else {
    if (quoteState.detail) rows.push(["Detalle", quoteState.detail]);
    rows.push(["Atención", quoteState.urgency || "—"]);
  }
  rows.push(["Nombre", quoteState.contactName]);
  rows.push(["Teléfono", quoteState.contactPhone]);
  rows.push(["Contacto preferido", quoteState.contactMethod || "—"]);
  if (quoteState.contactEmail) rows.push(["Correo", quoteState.contactEmail]);
  return rows;
}

function buildQuoteWhatsappMessage(mode) {
  const lines = [`Hola, ${CONFIG.brandName}.`, ""];
  lines.push(`Mi nombre es ${quoteState.contactName || "—"}.`, "");

  if (quoteState.type === "traslado") {
    lines.push("Estoy solicitando información sobre un traslado funerario.", "");
    lines.push(`Origen: ${quoteState.origin || "—"}`);
    lines.push(`Destino: ${quoteState.destination || "—"}`);
    lines.push(`Atención requerida: ${(quoteState.urgency || "—").toLowerCase()}.`);
  } else if (quoteState.type === "prevision") {
    lines.push(`Me gustaría recibir información sobre sus planes de previsión funeraria ${quoteState.modality ? quoteState.modality.toLowerCase() : ""} en ${cityLabel()}.`);
  } else if (quoteState.type === "servicio-ahora") {
    lines.push("Necesito un servicio funerario.", "");
    lines.push(`Ciudad: ${cityLabel()}`);
    if (quoteState.detail) lines.push(`Detalle: ${quoteState.detail}`);
    lines.push(`Contacto inmediato: ${quoteState.immediateContact || "—"}.`);
  } else if (quoteState.type === "cremacion") {
    lines.push("Estoy solicitando información sobre cremación.", "");
    lines.push(`Ciudad: ${cityLabel()}`);
    lines.push(`Modalidad: ${quoteState.cremationMode || "—"}.`);
  } else {
    lines.push(`Estoy solicitando información sobre: ${QUOTE_TYPE_LABELS[quoteState.type]}.`, "");
    lines.push(`Ciudad: ${cityLabel()}`);
    if (quoteState.detail) lines.push(`Detalle: ${quoteState.detail}`);
    if (quoteState.urgency) lines.push(`Atención requerida: ${quoteState.urgency.toLowerCase()}.`);
  }

  lines.push("");
  if (mode === "call") {
    lines.push(`Preferiría que me llamen al ${quoteState.contactPhone || "número que indiqué"} para coordinar.`);
  } else {
    lines.push(`Mi teléfono es ${quoteState.contactPhone || "—"}. Método de contacto preferido: ${quoteState.contactMethod || "—"}.`);
    lines.push("", "¿Podría comunicarse conmigo un asesor para conocer disponibilidad, proceso y cotización?");
  }
  return lines.join("\n");
}

function renderQuoteResult() {
  const rows = buildQuoteSummary();
  const waMessage = buildQuoteWhatsappMessage("whatsapp");
  const callMessage = buildQuoteWhatsappMessage("call");
  const waUrl = buildWhatsappUrl(waMessage);
  const callUrl = buildWhatsappUrl(callMessage);
  return `
    <div class="quoter__result-header">
      <span class="icon-badge">${icon("check")}</span>
      <div>
        <h3>Tu solicitud está lista</h3>
        <p class="hint">Revise la información antes de continuar.</p>
      </div>
    </div>
    <div class="quoter__summary">
      <dl>
        ${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v || "—"}</dd>`).join("")}
      </dl>
    </div>
    <div class="quoter__result-cta">
      ${waUrl ? `<a class="btn btn-primary btn-lg" href="${waUrl}" target="_blank" rel="noopener">${icon("whatsapp")} Enviar por WhatsApp</a>` : ""}
      ${callUrl ? `<a class="btn btn-outline" href="${callUrl}" target="_blank" rel="noopener">Solicitar llamada de un asesor</a>` : ""}
    </div>
    <p class="quoter__result-note">"Enviar por WhatsApp" abre una conversación con su mensaje ya redactado. "Solicitar llamada" le envía por el mismo canal, indicando que prefiere que le llamen.</p>
    <button type="button" class="btn btn-ghost btn-sm" data-quote-restart>Nueva cotización</button>
  `;
}

function renderQuoterNav() {
  const canAdvance = quoterCanAdvance();
  const isFirst = quoteState.step === 0;
  return `
    <div class="quoter__nav">
      <button type="button" class="btn btn-ghost btn-sm" data-quote-back ${isFirst ? "disabled" : ""}>${icon("chevronLeft")} Atrás</button>
      <button type="button" class="btn btn-primary" data-quote-next ${canAdvance ? "" : "disabled"}>Continuar ${icon("chevronRight")}</button>
    </div>`;
}

function quoterCanAdvance() {
  if (quoteState.step === 0) return !!quoteState.type;
  if (quoteState.step === 1) return !!quoteState.city && (quoteState.city !== "Otra ciudad" || quoteState.cityOther.trim().length > 0);
  if (quoteState.step === 2) {
    if (quoteState.type === "traslado") return !!quoteState.origin && !!quoteState.destination && !!quoteState.urgency;
    if (quoteState.type === "prevision") return !!quoteState.modality;
    if (quoteState.type === "servicio-ahora") return !!quoteState.immediateContact;
    if (quoteState.type === "cremacion") return !!quoteState.cremationMode;
    return true;
  }
  if (quoteState.step === 3) {
    return quoteState.contactName.trim().length > 0 && quoteState.contactPhone.trim().length > 0 && !!quoteState.contactMethod;
  }
  return true;
}

function bindQuoterEvents() {
  const root = document.getElementById("quoter");

  root.querySelectorAll("[data-quote-type]").forEach((btn) => {
    btn.addEventListener("click", () => {
      quoteState.type = btn.getAttribute("data-quote-type");
      renderQuoter();
    });
  });

  root.querySelectorAll("[data-quote-city]").forEach((btn) => {
    btn.addEventListener("click", () => {
      quoteState.city = btn.getAttribute("data-quote-city");
      renderQuoter();
    });
  });

  const cityOtherInput = document.getElementById("quote-city-other");
  if (cityOtherInput) {
    cityOtherInput.addEventListener("input", (e) => {
      quoteState.cityOther = e.target.value;
      const nextBtn = document.querySelector("[data-quote-next]");
      if (nextBtn) nextBtn.disabled = !quoterCanAdvance();
    });
  }

  const origin = document.getElementById("quote-origin");
  if (origin) origin.addEventListener("change", (e) => (quoteState.origin = e.target.value || null));
  const destination = document.getElementById("quote-destination");
  if (destination) destination.addEventListener("change", (e) => (quoteState.destination = e.target.value || null));
  const detail = document.getElementById("quote-detail");
  if (detail) detail.addEventListener("input", (e) => (quoteState.detail = e.target.value));

  const name = document.getElementById("quote-name");
  if (name) name.addEventListener("input", (e) => {
    quoteState.contactName = e.target.value;
    const nextBtn = document.querySelector("[data-quote-next]");
    if (nextBtn) nextBtn.disabled = !quoterCanAdvance();
  });
  const phone = document.getElementById("quote-phone");
  if (phone) phone.addEventListener("input", (e) => {
    quoteState.contactPhone = e.target.value;
    const nextBtn = document.querySelector("[data-quote-next]");
    if (nextBtn) nextBtn.disabled = !quoterCanAdvance();
  });
  const email = document.getElementById("quote-email");
  if (email) email.addEventListener("input", (e) => (quoteState.contactEmail = e.target.value));

  root.querySelectorAll("[data-quote-urgency]").forEach((btn) => {
    btn.addEventListener("click", () => {
      quoteState.urgency = btn.getAttribute("data-quote-urgency");
      renderQuoter();
    });
  });

  root.querySelectorAll("[data-quote-modality]").forEach((btn) => {
    btn.addEventListener("click", () => {
      quoteState.modality = btn.getAttribute("data-quote-modality");
      renderQuoter();
    });
  });

  root.querySelectorAll("[data-quote-immediate]").forEach((btn) => {
    btn.addEventListener("click", () => {
      quoteState.immediateContact = btn.getAttribute("data-quote-immediate");
      renderQuoter();
    });
  });

  root.querySelectorAll("[data-quote-cremation]").forEach((btn) => {
    btn.addEventListener("click", () => {
      quoteState.cremationMode = btn.getAttribute("data-quote-cremation");
      renderQuoter();
    });
  });

  root.querySelectorAll("[data-quote-method]").forEach((btn) => {
    btn.addEventListener("click", () => {
      quoteState.contactMethod = btn.getAttribute("data-quote-method");
      renderQuoter();
    });
  });

  const nextBtn = root.querySelector("[data-quote-next]");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (!quoterCanAdvance()) return;
      quoteState.step = Math.min(quoteState.step + 1, STEP_LABELS.length);
      renderQuoter();
      root.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const backBtn = root.querySelector("[data-quote-back]");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      quoteState.step = Math.max(quoteState.step - 1, 0);
      renderQuoter();
    });
  }

  const restartBtn = root.querySelector("[data-quote-restart]");
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      resetQuoteState();
      renderQuoter();
      root.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

function startQuoterWithType(typeId) {
  resetQuoteState();
  if (typeId && QUOTE_TYPE_LABELS[typeId]) {
    quoteState.type = typeId;
    quoteState.step = 1;
  }
  renderQuoter();
  const el = document.getElementById("cotizador") || document.getElementById("quoter");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}
