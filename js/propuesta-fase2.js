/**
 * Propuesta comercial Fase 2 — Plataforma Digital de Previsiones.
 *
 * Mismo patrón que js/propuesta.js: navegación con progreso, revelado al
 * hacer scroll, contacto vía WhatsApp/correo/diálogo y eventos de
 * analytics anónimos. Sin simulador ni descarga de PDF: esta propuesta
 * es una experiencia web, no un documento.
 */

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* Eventos de analytics                                                */
/* ------------------------------------------------------------------ */

window.GVV_PROPOSAL_EVENTS = window.GVV_PROPOSAL_EVENTS || [];

function trackProposalEvent(name, detail = {}) {
  const event = { name, detail, at: new Date().toISOString(), page: "propuesta-fase2" };
  window.GVV_PROPOSAL_EVENTS.push(event);
  document.dispatchEvent(new CustomEvent("proposal:event", { detail: event }));

  const endpoint = PROPOSAL_CONFIG.analytics && PROPOSAL_CONFIG.analytics.endpoint;
  if (!endpoint || !navigator.sendBeacon) return;
  try {
    navigator.sendBeacon(endpoint, new Blob([JSON.stringify(event)], { type: "application/json" }));
  } catch (error) {
    // El envío es opcional: un fallo no debe afectar la experiencia.
  }
}

function initTrackedLinks() {
  document.querySelectorAll("[data-track]").forEach((el) => {
    el.addEventListener("click", () => {
      trackProposalEvent(el.getAttribute("data-track"), {
        target: el.getAttribute("data-track-target") || el.getAttribute("href") || "",
      });
    });
  });
}

/* ------------------------------------------------------------------ */
/* Revelado                                                            */
/* ------------------------------------------------------------------ */

function staggerSiblings() {
  document.querySelectorAll(".reveal").forEach((el) => {
    const siblings = Array.from(el.parentElement.children).filter((c) => c.classList.contains("reveal"));
    const index = siblings.indexOf(el);
    if (index > 0) el.style.setProperty("--stagger", Math.min(index, 5));
  });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach((el) => observer.observe(el));
}

/* ------------------------------------------------------------------ */
/* Navegación: sección activa, progreso e índice móvil                 */
/* ------------------------------------------------------------------ */

function initNavigation() {
  const bar = document.getElementById("pnav-progress");
  const links = Array.from(document.querySelectorAll("[data-nav]"));
  const sections = links.map((a) => document.getElementById(a.getAttribute("data-nav"))).filter(Boolean);

  let ticking = false;
  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    if (bar) bar.style.transform = `scaleX(${ratio})`;

    const probe = window.scrollY + window.innerHeight * 0.3;
    let current = null;
    sections.forEach((section) => {
      if (section.offsetTop <= probe) current = section.id;
    });
    links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("data-nav") === current));
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );
  update();

  const toggle = document.getElementById("pnav-index");
  const sheet = document.getElementById("pnav-sheet");
  if (!toggle || !sheet) return;

  const close = () => {
    sheet.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const willOpen = sheet.hidden;
    sheet.hidden = !willOpen;
    toggle.setAttribute("aria-expanded", String(willOpen));
  });
  sheet.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/** Un evento por sección, la primera vez que se ve. */
function initSectionViews() {
  if (!("IntersectionObserver" in window)) return;
  const seen = new Set();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("data-section");
        if (!entry.isIntersecting || seen.has(id)) return;
        seen.add(id);
        trackProposalEvent("proposal_section_view", { section: id });
        if (id === "inversion") trackProposalEvent("proposal_payment_view", {});
      });
    },
    { threshold: 0, rootMargin: "-45% 0px -45% 0px" }
  );
  document.querySelectorAll("[data-section]").forEach((el) => observer.observe(el));
}

/* ------------------------------------------------------------------ */
/* Contacto                                                            */
/* ------------------------------------------------------------------ */

function contactUrl(message) {
  const { whatsapp, email } = PROPOSAL_CONFIG.contact || {};
  if (whatsapp) {
    const digits = String(whatsapp).replace(/\D/g, "");
    if (digits) return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
  }
  if (email) {
    const subject = encodeURIComponent("Plataforma Digital de Previsiones (Fase 2) · Grupo Virgen del Valle");
    return `mailto:${email}?subject=${subject}&body=${encodeURIComponent(message)}`;
  }
  return null;
}

function openContactDialog(message) {
  const dialog = document.getElementById("contact-dialog");
  const textarea = document.getElementById("contact-message");
  const status = document.getElementById("contact-status");
  textarea.value = message;
  status.textContent = "";

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
  textarea.focus();
  textarea.select();
}

async function copyContactMessage() {
  const textarea = document.getElementById("contact-message");
  const status = document.getElementById("contact-status");
  try {
    await navigator.clipboard.writeText(textarea.value);
    status.textContent = "Mensaje copiado.";
  } catch (error) {
    textarea.select();
    status.textContent = "Seleccione el texto y cópielo manualmente.";
  }
}

function initContact() {
  document.querySelectorAll("[data-contact]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const kind = btn.getAttribute("data-contact");
      const message = PROPOSAL_CONFIG.messages[kind] || PROPOSAL_CONFIG.messages.advance;
      const url = contactUrl(message);
      if (url) {
        window.open(url, "_blank", "noopener");
      } else {
        openContactDialog(message);
      }
    });
  });

  const copy = document.getElementById("contact-copy");
  if (copy) copy.addEventListener("click", copyContactMessage);
}

/* ------------------------------------------------------------------ */
/* Enlace configurable: sitio de Elipsoft                              */
/* ------------------------------------------------------------------ */

/** Solo rutas relativas del proyecto o URLs http(s): nunca javascript:, data:, etc. */
function safeUrl(value) {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[\w\-./]+$/.test(trimmed) && !trimmed.startsWith("//")) return trimmed;
  return null;
}

function initConfigurableLinks() {
  const site = safeUrl(PROPOSAL_CONFIG.elipsoft && PROPOSAL_CONFIG.elipsoft.url);
  if (site) {
    document.querySelectorAll("[data-elipsoft-link]").forEach((a) => {
      a.href = site;
      a.hidden = false;
    });
  }

  const hint = document.getElementById("contact-hint");
  const { whatsapp, email } = PROPOSAL_CONFIG.contact || {};
  if (hint && !whatsapp && !email) hint.hidden = false;
}

document.addEventListener("DOMContentLoaded", () => {
  staggerSiblings();
  initReveal();
  initNavigation();
  initSectionViews();
  initContact();
  initConfigurableLinks();
  initTrackedLinks();
  trackProposalEvent("proposal_open", { referrer: document.referrer ? "external" : "direct" });
});
