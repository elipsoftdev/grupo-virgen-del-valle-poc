/**
 * Cotizador guiado. Construye un mensaje de WhatsApp personalizado según
 * las respuestas del visitante. No genera precios ni condiciones: solo
 * estructura la solicitud para que un asesor humano la atienda.
 */

const QUOTE_TYPES = [
  { id: "servicio-ahora", label: "Necesito un servicio funerario ahora", icon: "clock" },
  { id: "prevision", label: "Quiero conocer planes de previsión", icon: "shield" },
  { id: "traslado", label: "Necesito un traslado", icon: "truck" },
  { id: "cremacion", label: "Estoy interesado en cremación", icon: "flame" },
  { id: "cementerio", label: "Necesito información sobre cementerio", icon: "leaf" },
  { id: "otro", label: "Otro servicio", icon: "message" },
];

const QUOTE_TYPE_LABELS = Object.fromEntries(QUOTE_TYPES.map((t) => [t.id, t.label]));

const CITIES = ["Caracas", "Cumaná", "Puerto La Cruz", "Anaco", "Otra ciudad"];

const quoteState = {
  step: 0,
  type: null,
  city: null,
  cityOther: "",
  origin: null,
  destination: null,
  urgency: null,
  modality: null,
  detail: "",
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
  quoteState.detail = "";
}

function cityLabel() {
  return quoteState.city === "Otra ciudad" && quoteState.cityOther ? quoteState.cityOther : quoteState.city;
}

function initQuoter() {
  const root = document.getElementById("quoter");
  if (!root) return;
  renderQuoter();
}

function renderQuoter() {
  const root = document.getElementById("quoter");
  const totalSteps = 4;
  const progress = Array.from({ length: totalSteps }, (_, i) => {
    const cls = i < quoteState.step ? "is-done" : i === quoteState.step ? "is-active" : "";
    return `<div class="quoter__progress-step ${cls}"></div>`;
  }).join("");

  root.innerHTML = `
    <div class="quoter__progress" role="progressbar" aria-valuenow="${quoteState.step + 1}" aria-valuemin="1" aria-valuemax="${totalSteps}">${progress}</div>
    <div class="quoter__body">${renderQuoterStepContent()}</div>
    ${quoteState.step < totalSteps - 1 ? renderQuoterNav() : ""}
  `;
  bindQuoterEvents();
}

function renderQuoterStepContent() {
  switch (quoteState.step) {
    case 0:
      return `
        <h3>¿Cómo podemos ayudarle?</h3>
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
        <h3>¿En qué ciudad se encuentra?</h3>
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
      return renderQuoteResult();
    default:
      return "";
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

function buildQuoteSummary() {
  const rows = [["Servicio solicitado", QUOTE_TYPE_LABELS[quoteState.type]]];
  rows.push(["Ciudad", cityLabel()]);
  if (quoteState.type === "traslado") {
    rows.push(["Origen", quoteState.origin || "—"]);
    rows.push(["Destino", quoteState.destination || "—"]);
    rows.push(["Atención", quoteState.urgency || "—"]);
  } else if (quoteState.type === "prevision") {
    rows.push(["Modalidad", quoteState.modality || "—"]);
  } else {
    if (quoteState.detail) rows.push(["Detalle", quoteState.detail]);
    rows.push(["Atención", quoteState.urgency || "—"]);
  }
  return rows;
}

function buildQuoteWhatsappMessage() {
  const lines = [`Hola, ${CONFIG.brandName}.`, ""];
  if (quoteState.type === "traslado") {
    lines.push("Estoy solicitando información sobre un traslado funerario.", "");
    lines.push(`Origen: ${quoteState.origin || "—"}`);
    lines.push(`Destino: ${quoteState.destination || "—"}`);
    lines.push(`Atención requerida: ${(quoteState.urgency || "—").toLowerCase()}`);
  } else if (quoteState.type === "prevision") {
    lines.push(`Me gustaría recibir información sobre sus planes de previsión funeraria ${quoteState.modality ? quoteState.modality.toLowerCase() : ""} en ${cityLabel()}.`);
  } else {
    lines.push(`Estoy solicitando información sobre: ${QUOTE_TYPE_LABELS[quoteState.type]}.`, "");
    lines.push(`Ciudad: ${cityLabel()}`);
    if (quoteState.detail) lines.push(`Detalle: ${quoteState.detail}`);
    if (quoteState.urgency) lines.push(`Atención requerida: ${quoteState.urgency.toLowerCase()}`);
  }
  lines.push("", "¿Podría comunicarse conmigo un asesor para conocer disponibilidad, proceso y cotización?");
  return lines.join("\n");
}

function renderQuoteResult() {
  const rows = buildQuoteSummary();
  const message = buildQuoteWhatsappMessage();
  const waUrl = buildWhatsappUrl(message);
  return `
    <h3>Resumen de su solicitud</h3>
    <p class="hint">Revise la información antes de contactar a un asesor.</p>
    <div class="quoter__summary">
      <dl>
        ${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}
      </dl>
    </div>
    <div class="quoter__result-cta">
      ${waUrl ? `<a class="btn btn-primary" href="${waUrl}" target="_blank" rel="noopener">${icon("whatsapp")} Hablar con un asesor</a>` : `<p>Configure un número de WhatsApp en <code>data/config.js</code> para habilitar este enlace.</p>`}
      <button type="button" class="btn btn-ghost" data-quote-restart>Nueva cotización</button>
    </div>
  `;
}

function renderQuoterNav() {
  const canAdvance = quoterCanAdvance();
  return `
    <div class="quoter__nav">
      <button type="button" class="btn btn-ghost btn-sm" data-quote-back ${quoteState.step === 0 ? "disabled" : ""}>${icon("chevronLeft")} Atrás</button>
      <button type="button" class="btn btn-primary btn-sm" data-quote-next ${canAdvance ? "" : "disabled"}>Continuar ${icon("chevronRight")}</button>
    </div>`;
}

function quoterCanAdvance() {
  if (quoteState.step === 0) return !!quoteState.type;
  if (quoteState.step === 1) return !!quoteState.city && (quoteState.city !== "Otra ciudad" || quoteState.cityOther.trim().length > 0);
  if (quoteState.step === 2) {
    if (quoteState.type === "traslado") return !!quoteState.origin && !!quoteState.destination && !!quoteState.urgency;
    if (quoteState.type === "prevision") return !!quoteState.modality;
    return true;
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
      document.querySelector('[data-quote-next]').disabled = !quoterCanAdvance();
    });
  }

  const origin = document.getElementById("quote-origin");
  if (origin) origin.addEventListener("change", (e) => (quoteState.origin = e.target.value || null));
  const destination = document.getElementById("quote-destination");
  if (destination) destination.addEventListener("change", (e) => (quoteState.destination = e.target.value || null));
  const detail = document.getElementById("quote-detail");
  if (detail) detail.addEventListener("input", (e) => (quoteState.detail = e.target.value));

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

  const nextBtn = root.querySelector("[data-quote-next]");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (!quoterCanAdvance()) return;
      quoteState.step = Math.min(quoteState.step + 1, 3);
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
  quoteState.type = typeId;
  quoteState.step = 1;
  renderQuoter();
  const el = document.getElementById("cotizador");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}
