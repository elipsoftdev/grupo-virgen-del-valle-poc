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

function applyStagger(container) {
  container.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.setProperty("--stagger", Math.min(i, 6));
  });
}

/* ---------- Servicios (Home) ---------- */

function renderServices() {
  const grid = document.getElementById("services-grid");
  if (!grid) return;
  grid.innerHTML = SERVICES.map(
    (svc) => `
    <article class="card service-card reveal">
      <div class="icon-badge">${icon(svc.icon)}</div>
      <h3>${svc.title}</h3>
      <p class="service-desc">${svc.desc}</p>
      <div class="service-card__actions">
        <button type="button" class="btn btn-arrow" data-service-detail="${svc.id}">Conocer servicio ${icon("arrowRight", "icon--arrow")}</button>
        <a class="service-card__quote" href="cotizar.html?tipo=${svc.quoteType}">Cotizar</a>
      </div>
    </article>`
  ).join("");
  applyStagger(grid);

  grid.querySelectorAll("[data-service-detail]").forEach((btn) => {
    btn.addEventListener("click", () => openServiceModal(btn.getAttribute("data-service-detail")));
  });
}

function openServiceModal(id) {
  const svc = SERVICES.find((s) => s.id === id);
  if (!svc) return;
  const overlay = document.getElementById("info-modal");
  const content = document.getElementById("info-modal-content");
  content.innerHTML = `
    <div class="icon-badge">${icon(svc.icon)}</div>
    <h3>${svc.title}</h3>
    <p>${svc.desc}</p>
    <ul class="modal-list">${svc.items.map((it) => `<li>${it}</li>`).join("")}</ul>
    <a class="btn btn-primary btn-block" href="cotizar.html?tipo=${svc.quoteType}">Cotizar este servicio</a>
  `;
  overlay.classList.add("is-open");
  overlay.querySelector(".modal").focus();
}

/* ---------- Sedes ---------- */

function mapsSearchUrl(loc) {
  const query = encodeURIComponent(`${CONFIG.brandName} ${loc.city}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function renderLocations(containerId = "locations-grid") {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = LOCATIONS.map((loc) => {
    const chips = loc.services.map((s) => `<span class="chip">${SERVICE_LABELS[s] || s}</span>`).join("");
    return `
    <article class="card location-card reveal" id="sede-${loc.slug}">
      <div class="location-card__media">
        <img src="${loc.photo}" alt="Instalaciones de ${loc.name}" loading="lazy" width="640" height="400">
      </div>
      <div class="location-card__body">
        ${loc.is24h ? `<span class="badge-24h"><span class="dot"></span>Atención 24 horas</span>` : ""}
        <h3>${loc.name}${loc.isMainOffice ? " · Sede principal" : ""}</h3>
        <div class="location-card__services">${chips}</div>
        <div class="location-card__actions">
          <button type="button" class="btn btn-ghost btn-sm" data-location-view="${loc.slug}">Ver sede</button>
          <a class="btn btn-ghost btn-sm" href="${mapsSearchUrl(loc)}" target="_blank" rel="noopener">Cómo llegar</a>
          <a class="btn btn-primary btn-sm" href="${buildWhatsappUrl(`Hola, ${CONFIG.brandName}.\n\nMe gustaría recibir información sobre sus servicios en ${loc.city}.\n\n¿Podría contactarme un asesor?`)}" target="_blank" rel="noopener">Contactar</a>
        </div>
      </div>
    </article>`;
  }).join("");
  applyStagger(grid);

  grid.querySelectorAll("[data-location-view]").forEach((btn) => {
    btn.addEventListener("click", () => openLocationModal(btn.getAttribute("data-location-view")));
  });
}

function openLocationModal(slug) {
  const loc = LOCATIONS.find((l) => l.slug === slug);
  if (!loc) return;
  const overlay = document.getElementById("info-modal");
  const content = document.getElementById("info-modal-content");
  const chips = loc.services.map((s) => `<span class="chip">${SERVICE_LABELS[s] || s}</span>`).join("");
  content.innerHTML = `
    <img src="${loc.photo}" alt="Instalaciones de ${loc.name}" class="modal-image" loading="lazy">
    <h3>${loc.name}</h3>
    ${loc.is24h ? `<span class="badge-24h"><span class="dot"></span>Atención 24 horas</span>` : ""}
    <p>${loc.address ? loc.address : "Dirección puntual pendiente de confirmación. Escríbanos y le orientamos de inmediato."}</p>
    <div class="location-card__services">${chips}</div>
    <a class="btn btn-primary btn-block" href="${buildWhatsappUrl(`Hola, ${CONFIG.brandName}.\n\nMe gustaría recibir información sobre sus servicios en ${loc.city}.\n\n¿Podría contactarme un asesor?`)}" target="_blank" rel="noopener" style="margin-top: var(--space-sm);">Contactar esta sede</a>
  `;
  overlay.classList.add("is-open");
  overlay.querySelector(".modal").focus();
}

/* ---------- Galería ---------- */

function renderGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;
  const items = [
    { src: "assets/img/fachada-historica.jpg", label: "Nuestra historia" },
    { src: "assets/img/pasillo-cumana.jpg", label: "Sede Cumaná" },
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
  applyStagger(grid);
}

/* ---------- Obituarios ---------- */

function renderObituaries(containerId = "obituaries-grid") {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  const limit = grid.dataset.limit ? Number(grid.dataset.limit) : null;
  const list = limit ? DEMO_OBITUARIES.slice(0, limit) : DEMO_OBITUARIES;
  grid.innerHTML = list
    .map(
      (ob) => `
    <article class="card obituary-card reveal">
      <div class="obituary-card__media">${icon("heart")}</div>
      <div class="obituary-card__body">
        <span class="demo-tag">Contenido demostrativo</span>
        <h3>${ob.name}</h3>
        <p class="obituary-card__meta">${ob.years} · ${ob.city}</p>
        <div class="obituary-card__actions">
          <button type="button" class="btn btn-ghost btn-sm" data-obituary-view="${ob.id}">Ver homenaje</button>
          <button type="button" class="btn btn-outline btn-sm" data-obituary-share="${ob.id}">${icon("share")} Compartir</button>
        </div>
      </div>
    </article>`
    )
    .join("");
  applyStagger(grid);

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
    <span class="demo-tag">Contenido demostrativo</span>
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
    announceAssistant(`Enlace del homenaje copiado al portapapeles.`);
  }
}

/* ---------- Atención inmediata ---------- */

function renderImmediateHelp() {
  const el = document.getElementById("immediate-help-actions");
  if (!el) return;
  const waUrl = buildWhatsappUrl(
    `Hola, ${CONFIG.brandName}.\n\nNecesito asistencia inmediata.\n\n¿Podría comunicarse conmigo un asesor lo antes posible?`
  );
  const callBtn = CONFIG.phone24h
    ? `<a class="btn btn-emergency" href="tel:${CONFIG.phone24h.replace(/\s+/g, "")}">${icon("phone")} Llamar ahora</a>`
    : "";
  el.innerHTML = `
    ${callBtn}
    <a class="btn btn-primary" href="${waUrl}" target="_blank" rel="noopener">${icon("whatsapp")} WhatsApp</a>
    <a class="btn btn-ghost" href="#" data-open-assistant="human">Solicitar contacto</a>
  `;
}

/* ---------- Contacto / footer ---------- */

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
  applyStagger(el);
}

function renderFooter() {
  const el = document.getElementById("footer-year");
  if (el) el.textContent = new Date().getFullYear();
  const waUrl = buildWhatsappUrl("Hola, Grupo Virgen del Valle. Necesito información.");
  const footerWa = document.getElementById("footer-whatsapp");
  if (footerWa && waUrl) footerWa.href = waUrl;
}
