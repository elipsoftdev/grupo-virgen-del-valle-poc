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

/* ------------------------------------------------------------------ */
/* PoC funcional: panel comercial de previsiones                       */
/*                                                                      */
/* Demostración conceptual, 100% frontend, con datos ficticios en      */
/* memoria (sin localStorage ni backend). Muestra solo capacidad       */
/* comercial: 4 etapas genéricas, sin exponer el workflow operativo    */
/* real que tendrá la plataforma.                                      */
/* ------------------------------------------------------------------ */

const POC_STAGES = [
  { key: "nuevos", label: "Nuevos" },
  { key: "atencion", label: "En atención" },
  { key: "interesados", label: "Interesados" },
  { key: "contratacion", label: "Contratación" },
];

const POC_SEED = [
  { id: "s1", name: "María González", origin: "Instagram", interest: "Previsión Familiar", owner: "Ana", activity: "Solicitó información sobre cobertura familiar.", stage: "nuevos" },
  { id: "s2", name: "Beatriz Salazar", origin: "Web", interest: "Previsión Familiar", owner: "José", activity: "Completó el formulario de contacto del sitio.", stage: "nuevos" },
  { id: "s3", name: "Carlos Pérez", origin: "Web", interest: "Previsión Individual", owner: "José", activity: "Solicitó una cotización individual.", stage: "atencion" },
  { id: "s4", name: "Jorge Marcano", origin: "Instagram", interest: "Previsión Individual", owner: "Ana", activity: "Escribió preguntando por los planes disponibles.", stage: "atencion" },
  { id: "s5", name: "Andrea Rodríguez", origin: "WhatsApp", interest: "Previsión Familiar", owner: "Ana", activity: "Pidió más detalles sobre el plan familiar.", stage: "interesados" },
  { id: "s6", name: "Luis Fernández", origin: "Facebook", interest: "Previsión Individual", owner: "José", activity: "Confirmó interés en avanzar con la contratación.", stage: "contratacion" },
];

const POC_SIM_NAMES = ["Carmen Rodríguez", "Daniela Torres", "Miguel Ángel Silva", "Valentina Ríos", "Rafael Gómez", "Estefanía Blanco"];
const POC_OWNERS = ["Ana", "José"];
const POC_INTERESTS = ["Previsión Familiar", "Previsión Individual"];

let pocLeads = [];
let pocSimIndex = 0;
let pocSimSeq = 0;
let pocDrawerLeadId = null;
let pocLastFocused = null;

function pocEscapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function clonePocSeed() {
  return POC_SEED.map((lead) => ({ ...lead }));
}

function pocStageIndex(stage) {
  return POC_STAGES.findIndex((s) => s.key === stage);
}

function pocAnnounce(message) {
  const el = document.getElementById("poc-announcer");
  if (!el) return;
  el.textContent = "";
  window.setTimeout(() => {
    el.textContent = message;
  }, 30);
}

function renderPocBoard() {
  POC_STAGES.forEach((stage) => {
    const list = document.getElementById(`poc-list-${stage.key}`);
    const colCount = document.getElementById(`poc-col-${stage.key}`);
    const kpi = document.getElementById(`poc-kpi-${stage.key}`);
    const leads = pocLeads.filter((l) => l.stage === stage.key);

    if (colCount) colCount.textContent = String(leads.length);
    if (kpi) kpi.textContent = String(leads.length);
    if (!list) return;

    list.innerHTML = "";
    leads.forEach((lead) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "f2-poc__card";
      if (lead._justMoved && !REDUCED_MOTION) card.classList.add("f2-poc__card--enter");
      card.innerHTML = `<strong>${pocEscapeHtml(lead.name)}</strong><span>${pocEscapeHtml(lead.origin)} · ${pocEscapeHtml(lead.interest)}</span><small>Resp. ${pocEscapeHtml(lead.owner)}</small>`;
      card.addEventListener("click", () => openPocDrawer(lead.id));
      list.appendChild(card);
    });
  });

  pocLeads.forEach((lead) => {
    delete lead._justMoved;
  });
}

function openPocDrawer(id) {
  const lead = pocLeads.find((l) => l.id === id);
  const drawer = document.getElementById("poc-drawer");
  if (!lead || !drawer) return;

  pocDrawerLeadId = id;
  document.getElementById("poc-drawer-name").textContent = lead.name;
  document.getElementById("poc-drawer-origen").textContent = lead.origin;
  document.getElementById("poc-drawer-interes").textContent = lead.interest;
  document.getElementById("poc-drawer-responsable").textContent = lead.owner;
  document.getElementById("poc-drawer-actividad").textContent = lead.activity;

  const stageInfo = POC_STAGES[pocStageIndex(lead.stage)];
  document.getElementById("poc-drawer-stage").textContent = stageInfo ? stageInfo.label : lead.stage;

  const isLast = pocStageIndex(lead.stage) === POC_STAGES.length - 1;
  document.getElementById("poc-advance-btn").hidden = isLast;
  document.getElementById("poc-drawer-note").hidden = !isLast;

  if (drawer.hidden) pocLastFocused = document.activeElement;
  drawer.hidden = false;
  document.getElementById("poc-drawer-close").focus();
  trackProposalEvent("poc_open_lead", { stage: lead.stage });
}

function closePocDrawer() {
  const drawer = document.getElementById("poc-drawer");
  if (!drawer || drawer.hidden) return;
  drawer.hidden = true;
  pocDrawerLeadId = null;
  if (pocLastFocused && typeof pocLastFocused.focus === "function") pocLastFocused.focus();
  pocLastFocused = null;
}

function advancePocLead() {
  const lead = pocLeads.find((l) => l.id === pocDrawerLeadId);
  if (!lead) return;
  const idx = pocStageIndex(lead.stage);
  if (idx >= POC_STAGES.length - 1) return;

  lead.stage = POC_STAGES[idx + 1].key;
  lead._justMoved = true;
  renderPocBoard();
  trackProposalEvent("poc_advance_lead", { stage: lead.stage });
  pocAnnounce(`Oportunidad movida a ${POC_STAGES[idx + 1].label}.`);
  openPocDrawer(lead.id);
}

function simulatePocLead(channel) {
  pocSimSeq += 1;
  const name = POC_SIM_NAMES[pocSimIndex % POC_SIM_NAMES.length];
  pocSimIndex += 1;

  const lead = {
    id: `sim-${Date.now()}-${pocSimSeq}`,
    name,
    origin: channel,
    interest: POC_INTERESTS[pocSimSeq % POC_INTERESTS.length],
    owner: POC_OWNERS[pocSimSeq % POC_OWNERS.length],
    activity: `Escribió por ${channel} preguntando por información de previsión.`,
    stage: "nuevos",
    _justMoved: true,
  };

  pocLeads.unshift(lead);
  renderPocBoard();
  trackProposalEvent("poc_simulate_lead", { channel });
  pocAnnounce("Nuevo interesado recibido.");
  setPocActiveTab("nuevos");

  const menu = document.getElementById("poc-simulate-menu");
  const btn = document.getElementById("poc-simulate-btn");
  menu.hidden = true;
  btn.setAttribute("aria-expanded", "false");
}

function setPocActiveTab(stage) {
  const board = document.getElementById("poc-board");
  if (board) board.dataset.active = stage;
  document.querySelectorAll(".f2-poc__tab").forEach((tab) => {
    tab.setAttribute("aria-selected", String(tab.getAttribute("data-stage") === stage));
  });
}

function resetPocDemo() {
  pocLeads = clonePocSeed();
  pocSimIndex = 0;
  pocSimSeq = 0;
  closePocDrawer();
  setPocActiveTab("nuevos");
  renderPocBoard();
  trackProposalEvent("poc_reset", {});
  pocAnnounce("Demostración reiniciada.");
}

function openPocDialog() {
  const dialog = document.getElementById("poc-dialog");
  if (!dialog) return;
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}

function closePocDialog() {
  const dialog = document.getElementById("poc-dialog");
  if (!dialog) return;
  closePocDrawer();
  if (typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
}

function initPocDemo() {
  const openBtn = document.getElementById("poc-open-btn");
  const dialog = document.getElementById("poc-dialog");
  if (!openBtn || !dialog) return;

  pocLeads = clonePocSeed();
  renderPocBoard();

  openBtn.addEventListener("click", () => {
    openPocDialog();
    trackProposalEvent("poc_open", {});
  });

  document.getElementById("poc-close-btn").addEventListener("click", closePocDialog);
  dialog.addEventListener("close", closePocDrawer);
  document.getElementById("poc-drawer-close").addEventListener("click", closePocDrawer);
  document.getElementById("poc-advance-btn").addEventListener("click", advancePocLead);
  document.getElementById("poc-reset-btn").addEventListener("click", resetPocDemo);

  const simBtn = document.getElementById("poc-simulate-btn");
  const simMenu = document.getElementById("poc-simulate-menu");
  simBtn.addEventListener("click", () => {
    const willOpen = simMenu.hidden;
    simMenu.hidden = !willOpen;
    simBtn.setAttribute("aria-expanded", String(willOpen));
  });
  simMenu.querySelectorAll("[data-channel]").forEach((btn) => {
    btn.addEventListener("click", () => simulatePocLead(btn.getAttribute("data-channel")));
  });
  document.addEventListener("click", (e) => {
    if (simMenu.hidden || simBtn.contains(e.target) || simMenu.contains(e.target)) return;
    simMenu.hidden = true;
    simBtn.setAttribute("aria-expanded", "false");
  });

  document.querySelectorAll(".f2-poc__tab").forEach((tab) => {
    tab.addEventListener("click", () => setPocActiveTab(tab.getAttribute("data-stage")));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  staggerSiblings();
  initReveal();
  initNavigation();
  initSectionViews();
  initContact();
  initConfigurableLinks();
  initTrackedLinks();
  initPocDemo();
  trackProposalEvent("proposal_open", { referrer: document.referrer ? "external" : "direct" });
});
