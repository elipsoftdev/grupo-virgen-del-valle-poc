/**
 * Shell común de las pantallas demo (panel ejecutivo y centro de atención).
 * Evita duplicar la navegación en cada archivo HTML.
 *
 * Cada página define window.DEMO_PAGE antes de cargar este script.
 */

const DEMO_NAV = [
  { id: "resumen", label: "Resumen", icon: "grid", href: "dashboard-demo.html" },
  { id: "atencion", label: "Atención", icon: "inbox", href: "centro-atencion-demo.html", countKey: "atencion" },
  { id: "oportunidades", label: "Oportunidades", icon: "userCheck", href: "dashboard-demo.html#oportunidades" },
  { id: "marketing", label: "Marketing", icon: "chart", href: "dashboard-demo.html#marketing" },
];

function renderDemoSidebar() {
  const host = document.getElementById("app-sidebar");
  if (!host) return;

  const active = window.DEMO_PAGE || "resumen";
  const pendingCount = DEMO_CONVERSATIONS.filter((c) => c.status === "Sin asignar").length + (getDemoLead() ? 1 : 0);

  host.innerHTML = `
    <a class="app-brand" href="index.html">
      <img src="assets/img/logo.png" alt="" width="100" height="55" />
      <span class="app-brand__text">Centro Digital<small>Grupo Virgen del Valle</small></span>
    </a>

    <nav class="app-nav" aria-label="Navegación del centro digital">
      <span class="app-nav__label">Plataforma</span>
      ${DEMO_NAV.map((item) => {
        const isActive = item.id === active;
        const count = item.countKey === "atencion" && pendingCount > 0 ? `<span class="app-nav__count">${pendingCount}</span>` : "";
        return `<a class="app-nav__item ${isActive ? "is-active" : ""}" href="${item.href}" ${isActive ? 'aria-current="page"' : ""}>
          ${icon(item.icon)}<span>${item.label}</span>${count}
        </a>`;
      }).join("")}
    </nav>

    <div class="app-sidebar__footer">
      <div class="app-sidebar__note">
        <strong>Demostración</strong>
        Las cifras y conversaciones de esta vista son simuladas, para mostrar cómo funcionaría la plataforma en operación.
      </div>
      <a class="app-back-link" href="propuesta.html">${icon("arrowRight")} Volver a la propuesta</a>
      <a class="app-back-link" href="index.html">${icon("home")} Volver al sitio público</a>
    </div>
  `;
}

/** Botón discreto para limpiar la solicitud demo generada desde el cotizador. */
function renderDemoResetButton(hostId) {
  const host = document.getElementById(hostId);
  if (!host) return;
  if (!getDemoLead()) {
    host.innerHTML = "";
    return;
  }

  host.innerHTML = `<button type="button" class="btn btn-ghost btn-sm" id="demo-reset">${icon("refresh")} Restablecer datos demo</button>`;
  host.querySelector("#demo-reset").addEventListener("click", () => {
    clearDemoLead();
    showDemoToast("Datos demo restablecidos");
    window.setTimeout(() => window.location.reload(), 700);
  });
}

function channelClass(source) {
  const key = String(source || "").toLowerCase();
  if (key.includes("whatsapp")) return "whatsapp";
  if (key.includes("instagram")) return "instagram";
  if (key.includes("facebook")) return "facebook";
  return "web";
}

function channelIcon(source) {
  const key = channelClass(source);
  if (key === "whatsapp") return "whatsapp";
  if (key === "instagram") return "instagram";
  if (key === "facebook") return "facebook";
  return "globe";
}

function channelTag(source) {
  return `<span class="channel-tag channel-tag--${channelClass(source)}">${icon(channelIcon(source))}${source}</span>`;
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function priorityBadge(priority) {
  return `<span class="badge badge--${slugify(priority)}">${priority}</span>`;
}

function statusPill(status) {
  return `<span class="status-pill status-pill--${slugify(status)}">${status}</span>`;
}
