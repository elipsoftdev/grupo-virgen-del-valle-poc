/**
 * Panel ejecutivo (demo). Renderiza KPIs, embudo, oportunidades y
 * métricas de marketing a partir de data/demo-*.js.
 *
 * Si el visitante completó el cotizador, su solicitud aparece arriba de
 * las oportunidades recientes marcada como nueva.
 */

const DONUT_COLORS = ["#1a2a3a", "#c5a059", "#3f6688", "#d3b378"];

function deltaIcon(direction) {
  if (direction === "up") return "trendUp";
  if (direction === "down") return "check"; // menos tiempo de respuesta = mejora
  return "arrowRight";
}

function renderKpis() {
  const host = document.getElementById("kpi-grid");
  if (!host) return;

  host.innerHTML = DEMO_KPIS.map((kpi) => {
    const tone = kpi.tone ? `kpi-card--${kpi.tone}` : "";
    const delta = kpi.delta
      ? `<span class="kpi-card__delta kpi-card__delta--${kpi.delta.direction}">${icon(deltaIcon(kpi.delta.direction))}${kpi.delta.text}</span>`
      : "";
    return `
      <article class="kpi-card ${tone}">
        <span class="kpi-card__icon">${icon(kpi.icon)}</span>
        <span class="kpi-card__value" data-count-to="${typeof kpi.value === "number" ? kpi.value : ""}">${kpi.value}</span>
        <span class="kpi-card__label">${kpi.label}</span>
        ${delta}
      </article>`;
  }).join("");

  animateCounters(host);
}

/** Pequeña animación de conteo; se desactiva si el usuario reduce el movimiento. */
function animateCounters(scope) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  scope.querySelectorAll("[data-count-to]").forEach((el) => {
    const target = Number(el.getAttribute("data-count-to"));
    if (!target || Number.isNaN(target)) return;

    const duration = 900;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(step);
    };
    el.textContent = "0";
    requestAnimationFrame(step);
  });
}

function renderFunnel() {
  const host = document.getElementById("funnel");
  if (!host) return;

  const max = Math.max(...DEMO_FUNNEL.map((s) => s.value));
  host.innerHTML = DEMO_FUNNEL.map((step) => {
    // Rango 48-100%: mantiene la forma de embudo sin dejar barras ilegibles.
    const width = 48 + (step.value / max) * 52;
    return `
      <div class="funnel__step">
        <div class="funnel__meta">
          <strong>${step.value}</strong>
          <span>${step.label}</span>
        </div>
        <div class="funnel__bar" style="width: ${width}%">${step.caption}</div>
      </div>`;
  }).join("");
}

/** Convierte la solicitud guardada por el cotizador al formato de la lista. */
function demoLeadAsRow(lead) {
  return {
    id: lead.id,
    name: lead.name || "Solicitud web",
    initials: demoInitials(lead.name),
    source: lead.source || "Web",
    service: lead.service || "Consulta",
    city: lead.city || "—",
    priority: lead.priority || "Normal",
    status: lead.status || "Nuevo",
    time: "Recién recibida",
    assignee: lead.assignee || null,
    isNew: true,
  };
}

function renderLeads() {
  const host = document.getElementById("lead-list");
  if (!host) return;

  const stored = getDemoLead();
  const rows = stored ? [demoLeadAsRow(stored), ...DEMO_LEADS] : [...DEMO_LEADS];

  host.innerHTML = rows
    .map(
      (lead) => `
      <article class="lead-row ${lead.isNew ? "is-new" : ""}">
        <span class="avatar ${lead.isNew ? "avatar--gold" : ""}">${lead.initials}</span>
        <div class="lead-row__name">
          ${lead.name} ${lead.isNew ? '<span class="new-flag">Nueva</span>' : ""}
          <small>${lead.id} · ${lead.time}</small>
        </div>
        <div class="lead-row__cell lead-row__cell--service">
          ${lead.service}
          <small>${lead.city}</small>
        </div>
        <div class="lead-row__cell lead-row__cell--channel">${channelTag(lead.source)}</div>
        ${priorityBadge(lead.priority)}
        ${statusPill(lead.status)}
      </article>`
    )
    .join("");

  const counter = document.getElementById("lead-count");
  if (counter) counter.textContent = `${rows.length} oportunidades`;
}

function renderChannelDonut() {
  const host = document.getElementById("channel-donut");
  if (!host) return;

  const total = DEMO_CHANNELS.reduce((sum, c) => sum + c.value, 0);
  const leader = DEMO_CHANNELS.reduce((top, c) => (c.value > top.value ? c : top), DEMO_CHANNELS[0]);
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  const segments = DEMO_CHANNELS.map((channel, index) => {
    const length = (channel.value / total) * circumference;
    const dash = `${length} ${circumference - length}`;
    const segment = `<circle class="donut__segment" cx="84" cy="84" r="${radius}"
        stroke="${DONUT_COLORS[index % DONUT_COLORS.length]}"
        stroke-dasharray="${dash}" stroke-dashoffset="${-offset}"
        style="animation-delay: ${index * 90}ms" />`;
    offset += length;
    return segment;
  }).join("");

  host.innerHTML = `
    <div class="donut">
      <svg viewBox="0 0 168 168" role="img" aria-label="Distribución de oportunidades por canal">
        ${segments}
      </svg>
      <div class="donut__center">
        <strong>${leader.value}%</strong>
        <span>${leader.label}</span>
      </div>
    </div>
    <div class="donut-legend">
      ${DEMO_CHANNELS.map(
        (channel, index) => `
        <div class="donut-legend__item">
          <span class="donut-legend__dot" style="background:${DONUT_COLORS[index % DONUT_COLORS.length]}"></span>
          ${icon(channel.icon)} ${channel.label}
          <span class="donut-legend__value">${channel.value}%</span>
        </div>`
      ).join("")}
    </div>
  `;
}

function renderBarList(hostId, data, options = {}) {
  const host = document.getElementById(hostId);
  if (!host) return;

  const max = Math.max(...data.map((d) => d.value));
  const suffix = options.suffix || "";

  host.innerHTML = data
    .map(
      (row, index) => `
      <div class="bar-list__row">
        <span class="bar-list__label">${row.icon ? icon(row.icon) : ""}${row.label}</span>
        <span class="bar-list__track">
          <span class="bar-list__fill" style="width:${(row.value / max) * 100}%; animation-delay:${index * 70}ms"></span>
        </span>
        <span class="bar-list__value">${row.value}${suffix}</span>
      </div>`
    )
    .join("");
}

function renderPerformance() {
  const host = document.getElementById("performance-list");
  if (!host) return;

  host.innerHTML = DEMO_PERFORMANCE.map(
    (metric) => `
      <div class="metric-row">
        <span class="metric-row__label">${metric.label}<small>${metric.caption}</small></span>
        <span class="metric-row__value">${metric.value}</span>
      </div>`
  ).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderDemoSidebar();
  renderKpis();
  renderFunnel();
  renderLeads();
  renderChannelDonut();
  renderBarList("top-services", DEMO_TOP_SERVICES, { suffix: "%" });
  renderBarList("by-location", DEMO_BY_LOCATION, { suffix: "%" });
  renderPerformance();
  renderDemoResetButton("demo-reset-host");
});
