/**
 * Renderizado de contenido dinámico a partir de data/*.js.
 * Mantener la lógica de presentación aquí facilita conectar en el futuro
 * estos mismos bloques a un backend/CMS sin tocar el HTML base.
 */

const SERVICE_LABELS = {
  velacion: "Velación",
  traslados: "Traslados",
  cremacion: "Cremación",
  inhumacion: "Inhumación",
  prevision: "Previsión",
};

function renderCompanyContent() {
  document.querySelectorAll("[data-slogan]").forEach((el) => (el.textContent = COMPANY.slogan));
  document.querySelectorAll("[data-subtitle]").forEach((el) => (el.textContent = COMPANY.subtitle));
  document.querySelectorAll("[data-mission]").forEach((el) => (el.textContent = COMPANY.mission));
  document.querySelectorAll("[data-vision]").forEach((el) => (el.textContent = COMPANY.vision));
  document.querySelectorAll("[data-trayectoria-title]").forEach((el) => (el.textContent = COMPANY.trayectoria.title));
  document.querySelectorAll("[data-trayectoria-body]").forEach((el) => (el.textContent = COMPANY.trayectoria.body));
  document.querySelectorAll("[data-historic-tagline]").forEach((el) => (el.textContent = `“${COMPANY.historicTagline}”`));
}

function renderServices() {
  const grid = document.getElementById("services-grid");
  if (!grid) return;
  grid.innerHTML = SERVICE_CATEGORIES.map(
    (cat) => `
    <article class="card service-card reveal">
      <div class="icon-badge">${icon(cat.icon)}</div>
      <h3>${cat.title}</h3>
      <p class="service-desc">${cat.description}</p>
      <ul>${cat.items.map((item) => `<li>${item}</li>`).join("")}</ul>
    </article>`
  ).join("");
}

function renderLocations() {
  const grid = document.getElementById("locations-grid");
  if (!grid) return;
  grid.innerHTML = LOCATIONS.map((loc) => {
    const chips = loc.services.map((s) => `<span class="chip">${SERVICE_LABELS[s] || s}</span>`).join("");
    const waMsg = `Hola, Grupo Virgen del Valle.\n\nMe gustaría recibir información sobre sus servicios en ${loc.city}.\n\n¿Podría contactarme un asesor?`;
    const waUrl = buildWhatsappUrl(waMsg);
    return `
    <article class="card location-card reveal" id="sede-${loc.slug}">
      <div class="location-card__media">
        <img src="${loc.photo}" alt="Instalaciones de ${loc.name}" loading="lazy" width="640" height="400">
      </div>
      <div class="location-card__body">
        ${loc.is24h ? `<span class="badge-24h"><span class="dot"></span>Atención 24 horas</span>` : ""}
        <h3>${loc.name}${loc.isMainOffice ? " · Sede principal" : ""}</h3>
        <p class="location-card__pending">${loc.address ? loc.address : "Dirección: pendiente de confirmación con el cliente"}</p>
        <div class="location-card__services">${chips}</div>
        <div class="quoter__result-cta">
          ${waUrl ? `<a class="btn btn-primary btn-sm" href="${waUrl}" target="_blank" rel="noopener">${icon("whatsapp")} Escribir por WhatsApp</a>` : ""}
        </div>
      </div>
    </article>`;
  }).join("");
}

function renderGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;
  const items = [
    { src: "assets/img/fachada-historica.jpg", label: "Historia · Primera sede" },
    { src: "assets/img/pasillo-cumana.jpg", label: "Sede Cumaná · Pasillo de descanso" },
    { src: "assets/img/fachada-pto-la-cruz.jpg", label: "Agencia Puerto La Cruz" },
    { src: "assets/img/fachada-anaco.jpg", label: "Agencia Anaco" },
  ];
  grid.innerHTML = items
    .map(
      (it) => `
    <figure class="gallery-item reveal">
      <img src="${it.src}" alt="${it.label}" loading="lazy" width="480" height="360">
      <span>${it.label}</span>
    </figure>`
    )
    .join("");
}

function renderObituaries() {
  const grid = document.getElementById("obituaries-grid");
  if (!grid) return;
  grid.innerHTML = DEMO_OBITUARIES.map(
    (ob) => `
    <article class="card obituary-card reveal">
      <div class="obituary-card__media">${icon("heart")}</div>
      <div class="obituary-card__body">
        <span class="demo-tag">Demo</span>
        <h3>${ob.name}</h3>
        <p class="obituary-card__meta">${ob.years} · ${ob.city}</p>
        <div class="obituary-card__actions">
          <button type="button" class="btn btn-ghost btn-sm" data-obituary-view="${ob.id}">Ver homenaje</button>
          <button type="button" class="btn btn-outline btn-sm" data-obituary-share="${ob.id}">${icon("share")} Compartir</button>
        </div>
      </div>
    </article>`
  ).join("");

  grid.querySelectorAll("[data-obituary-view]").forEach((btn) => {
    btn.addEventListener("click", () => openObituaryModal(btn.getAttribute("data-obituary-view")));
  });
  grid.querySelectorAll("[data-obituary-share]").forEach((btn) => {
    btn.addEventListener("click", () => shareObituary(btn.getAttribute("data-obituary-share")));
  });
}

function openObituaryModal(id) {
  const ob = DEMO_OBITUARIES.find((o) => o.id === id);
  if (!ob) return;
  const overlay = document.getElementById("obituary-modal");
  const content = document.getElementById("obituary-modal-content");
  content.innerHTML = `
    <span class="demo-tag">Demo</span>
    <h3>${ob.name}</h3>
    <p class="obituary-card__meta">${ob.years} · ${ob.city}</p>
    <p><strong>${icon("pin")} Sala:</strong> ${ob.venue}</p>
    <p><strong>${icon("calendar")} Ceremonia:</strong> ${ob.ceremony}</p>
    <p>${ob.summary}</p>
  `;
  overlay.classList.add("is-open");
  overlay.querySelector(".modal").focus();
}

function shareObituary(id) {
  const ob = DEMO_OBITUARIES.find((o) => o.id === id);
  if (!ob) return;
  const shareData = {
    title: `Homenaje a ${ob.name} — ${CONFIG.brandName}`,
    text: `Acompañemos con cariño a la familia de ${ob.name}.`,
    url: `${location.origin}${location.pathname}#homenaje-${ob.id}`,
  };
  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(shareData.url);
    announceAssistant(`Enlace del homenaje copiado al portapapeles (demostración).`);
  }
}

function renderContact() {
  const el = document.getElementById("contact-info");
  if (!el) return;
  const waUrl = buildWhatsappUrl("Hola, Grupo Virgen del Valle. Necesito información.");
  el.innerHTML = `
    <div class="card contact-item reveal">
      <div class="icon-badge">${icon("phone")}</div>
      <div>
        <h3>Asistencia inmediata 24h</h3>
        <p>${waUrl ? `<a href="${waUrl}" target="_blank" rel="noopener">Escribir por WhatsApp</a>` : "Canal de WhatsApp pendiente de confirmación"}</p>
      </div>
    </div>
    <div class="card contact-item reveal">
      <div class="icon-badge">${icon("mail")}</div>
      <div>
        <h3>Correo</h3>
        <p><a href="mailto:${CONFIG.email}">${CONFIG.email}</a></p>
      </div>
    </div>
    <div class="card contact-item reveal">
      <div class="icon-badge">${icon("pin")}</div>
      <div>
        <h3>Presencia nacional</h3>
        <p>${LOCATIONS.map((l) => l.city).join(" · ")}</p>
      </div>
    </div>
  `;
}

function renderFooter() {
  const el = document.getElementById("footer-year");
  if (el) el.textContent = new Date().getFullYear();
  const waUrl = buildWhatsappUrl("Hola, Grupo Virgen del Valle. Necesito información.");
  const footerWa = document.getElementById("footer-whatsapp");
  if (footerWa && waUrl) footerWa.href = waUrl;
}
