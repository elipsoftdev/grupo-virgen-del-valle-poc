/**
 * Propuesta comercial interactiva.
 *
 * Todo es frontend: navegación con progreso, revelado al hacer scroll,
 * contadores, conversación animada del agente, simulador ilustrativo,
 * contacto y eventos preparados para analytics (sin datos personales).
 */

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* Eventos de analytics                                                */
/* ------------------------------------------------------------------ */

window.GVV_PROPOSAL_EVENTS = window.GVV_PROPOSAL_EVENTS || [];

/**
 * Registra un evento anónimo. Nunca incluye datos personales: solo el
 * nombre del evento y un detalle técnico (sección, destino, etc.).
 */
function trackProposalEvent(name, detail = {}) {
  const event = { name, detail, at: new Date().toISOString(), page: "propuesta" };
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
/* Revelado y contadores                                               */
/* ------------------------------------------------------------------ */

function staggerSiblings() {
  document.querySelectorAll(".reveal").forEach((el) => {
    const siblings = Array.from(el.parentElement.children).filter((c) => c.classList.contains("reveal"));
    const index = siblings.indexOf(el);
    if (index > 0) el.style.setProperty("--stagger", Math.min(index, 5));
  });
}

function animateCount(el) {
  const target = Number(el.getAttribute("data-count"));
  if (Number.isNaN(target) || REDUCED_MOTION) return;

  const duration = 1100;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString("es-VE");
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
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
        entry.target.querySelectorAll("[data-count]").forEach(animateCount);
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
        if (id === "pagos") trackProposalEvent("proposal_payment_view", {});
        observer.unobserve(entry.target);
      });
    },
    // Franja central de la pantalla: funciona igual con secciones más
    // altas que el viewport (frecuente en móvil), donde un umbral en %
    // podría no alcanzarse nunca.
    { threshold: 0, rootMargin: "-45% 0px -45% 0px" }
  );
  document.querySelectorAll("[data-section]").forEach((el) => observer.observe(el));
}

/* ------------------------------------------------------------------ */
/* Conversación animada del agente                                     */
/* ------------------------------------------------------------------ */

const AGENT_STEP_DELAY = 1100;
let agentTimers = [];

function setFlowStep(step) {
  document.querySelectorAll("#agent-flow [data-flow]").forEach((li) => {
    li.classList.toggle("is-active", Number(li.getAttribute("data-flow")) <= step);
  });
}

function showAllAgentMessages() {
  document.querySelectorAll("#agent-thread .p-msg").forEach((m) => m.classList.add("is-shown"));
  setFlowStep(99);
}

function playAgentConversation() {
  const thread = document.getElementById("agent-thread");
  if (!thread) return;

  agentTimers.forEach(clearTimeout);
  agentTimers = [];

  if (REDUCED_MOTION) {
    showAllAgentMessages();
    return;
  }

  const messages = Array.from(thread.querySelectorAll(".p-msg"));
  messages.forEach((m) => m.classList.remove("is-shown"));
  setFlowStep(-1);

  messages.forEach((msg, index) => {
    const timer = window.setTimeout(() => {
      msg.classList.add("is-shown");
      setFlowStep(Number(msg.getAttribute("data-step")));
    }, 350 + index * AGENT_STEP_DELAY);
    agentTimers.push(timer);
  });
}

function initAgentDemo() {
  const thread = document.getElementById("agent-thread");
  const replay = document.getElementById("agent-replay");
  if (!thread) return;

  // Sin JS los mensajes quedan visibles; con JS se animan al entrar en pantalla.
  thread.classList.add("is-animated");

  if (!("IntersectionObserver" in window)) {
    showAllAgentMessages();
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        playAgentConversation();
        observer.disconnect();
      },
      { threshold: 0.35 }
    );
    observer.observe(thread);
  }

  if (replay) {
    replay.addEventListener("click", () => {
      playAgentConversation();
      trackProposalEvent("proposal_agent_replay", {});
    });
  }
}

/* ------------------------------------------------------------------ */
/* Simulador ilustrativo                                               */
/* ------------------------------------------------------------------ */

const SIM_EXAMPLE_VALUE = 1000;

function formatUsd(value) {
  return `USD ${Math.round(value).toLocaleString("es-VE")}`;
}

function initSimulator() {
  const services = document.getElementById("sim-services");
  const servicesOut = document.getElementById("sim-services-out");
  const value = document.getElementById("sim-value");
  const example = document.getElementById("sim-example");
  const month = document.getElementById("sim-month");
  const year = document.getElementById("sim-year");
  const hint = document.getElementById("sim-hint");
  if (!services || !value) return;

  let interacted = false;
  let usingExample = false;

  const render = () => {
    const count = Number(services.value);
    const amount = Number(value.value);
    servicesOut.textContent = String(count);
    services.style.setProperty("--fill", `${(count / Number(services.max)) * 100}%`);

    if (!value.value || Number.isNaN(amount) || amount < 0) {
      month.textContent = "—";
      year.textContent = "—";
      hint.textContent = "Ingrese un valor por servicio para ver el escenario.";
      return;
    }

    const monthly = count * amount;
    month.textContent = formatUsd(monthly);
    year.textContent = formatUsd(monthly * 12);
    hint.textContent = usingExample
      ? "Ejemplo ilustrativo: el valor por servicio no representa precios de la empresa."
      : "Escenario ilustrativo calculado con los valores ingresados.";
  };

  const markInteraction = (source) => {
    if (interacted) return;
    interacted = true;
    trackProposalEvent("proposal_roi_interaction", { source });
  };

  services.addEventListener("input", () => {
    markInteraction("services");
    render();
  });
  value.addEventListener("input", () => {
    usingExample = false;
    markInteraction("value");
    render();
  });
  example.addEventListener("click", () => {
    value.value = String(SIM_EXAMPLE_VALUE);
    usingExample = true;
    markInteraction("example");
    render();
  });

  document.getElementById("sim-form").addEventListener("submit", (e) => e.preventDefault());
  render();
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
    const subject = encodeURIComponent("Propuesta de transformación digital · Grupo Virgen del Valle");
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
/* Enlaces configurables: PDF y sitio de Elipsoft                      */
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
  const pdf = safeUrl(PROPOSAL_CONFIG.pdfUrl);
  if (pdf) {
    document.querySelectorAll("[data-pdf-link]").forEach((a) => {
      a.href = pdf;
      a.setAttribute("download", "");
    });
    document.querySelectorAll("[data-pdf-wrap]").forEach((el) => (el.hidden = false));
  }

  const site = safeUrl(PROPOSAL_CONFIG.elipsoft && PROPOSAL_CONFIG.elipsoft.url);
  if (site) {
    document.querySelectorAll("[data-elipsoft-link]").forEach((a) => {
      a.href = site;
      a.hidden = false;
    });
  }

  // Sin canal comercial configurado, se explica qué hará el botón.
  const hint = document.getElementById("contact-hint");
  const { whatsapp, email } = PROPOSAL_CONFIG.contact || {};
  if (hint && !whatsapp && !email) hint.hidden = false;
}

/* ------------------------------------------------------------------ */
/* Impresión                                                           */
/* ------------------------------------------------------------------ */

function initPrint() {
  let closedDetails = [];
  window.addEventListener("beforeprint", () => {
    closedDetails = Array.from(document.querySelectorAll("details:not([open])"));
    closedDetails.forEach((d) => d.setAttribute("open", ""));
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
    // Un contador a medio animar no debe llegar al PDF con una cifra incorrecta.
    document.querySelectorAll("[data-count]").forEach((el) => {
      el.textContent = Number(el.getAttribute("data-count")).toLocaleString("es-VE");
    });
    showAllAgentMessages();
  });
  window.addEventListener("afterprint", () => {
    closedDetails.forEach((d) => d.removeAttribute("open"));
    closedDetails = [];
  });
}

document.addEventListener("DOMContentLoaded", () => {
  staggerSiblings();
  initReveal();
  initNavigation();
  initSectionViews();
  initAgentDemo();
  initSimulator();
  initContact();
  initConfigurableLinks();
  initTrackedLinks();
  initPrint();
  trackProposalEvent("proposal_open", { referrer: document.referrer ? "external" : "direct" });
});
