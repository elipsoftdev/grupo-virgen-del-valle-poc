/**
 * Puente entre el cotizador público y las pantallas demo internas.
 *
 * GitHub Pages no tiene backend: la "solicitud" generada en el cotizador
 * se guarda en localStorage del propio navegador para poder demostrar el
 * recorrido completo (cliente -> solicitud -> centro de atención -> panel).
 * Nada de esto viaja a ningún servidor.
 */

const DEMO_LEAD_KEY = "gvv_demo_lead";

/** localStorage puede no estar disponible (modo privado, cookies bloqueadas). */
function demoStorageAvailable() {
  try {
    const probe = "__gvv_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch (error) {
    return false;
  }
}

function generateDemoLeadId() {
  const year = new Date().getFullYear();
  const sequence = String(Math.floor(Math.random() * 400) + 180).padStart(4, "0");
  return `GVV-${year}-${sequence}`;
}

function saveDemoLead(lead) {
  if (!demoStorageAvailable()) return false;
  try {
    window.localStorage.setItem(DEMO_LEAD_KEY, JSON.stringify(lead));
    return true;
  } catch (error) {
    return false;
  }
}

function getDemoLead() {
  if (!demoStorageAvailable()) return null;
  try {
    const raw = window.localStorage.getItem(DEMO_LEAD_KEY);
    if (!raw) return null;
    const lead = JSON.parse(raw);
    if (!lead || typeof lead !== "object" || !lead.id) return null;
    return lead;
  } catch (error) {
    return null;
  }
}

function clearDemoLead() {
  if (!demoStorageAvailable()) return false;
  try {
    window.localStorage.removeItem(DEMO_LEAD_KEY);
    return true;
  } catch (error) {
    return false;
  }
}

function demoInitials(name) {
  if (!name) return "··";
  const parts = String(name).trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p.charAt(0).toUpperCase()).join("") || "··";
}

/** Aviso flotante discreto, siempre marcado como demostración. */
function showDemoToast(message) {
  const existing = document.querySelector(".demo-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "demo-toast";
  toast.setAttribute("role", "status");
  toast.innerHTML = `
    <span class="demo-toast__icon">${icon("check")}</span>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("is-visible"));
  window.setTimeout(() => {
    toast.classList.remove("is-visible");
    window.setTimeout(() => toast.remove(), 400);
  }, 3200);
}
