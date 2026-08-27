/**
 * Punto de entrada: navegación, revelado al hacer scroll, modales y
 * llamado a los renderizadores de contenido dinámico.
 */

function initNav() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  const scrim = document.getElementById("nav-scrim");
  if (!toggle || !nav) return;

  const closeNav = () => {
    nav.classList.remove("is-open");
    scrim.classList.remove("is-visible");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú de navegación");
    toggle.innerHTML = icon("menu");
    document.body.style.overflow = "";
  };

  const openNav = () => {
    nav.classList.add("is-open");
    scrim.classList.add("is-visible");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Cerrar menú de navegación");
    toggle.innerHTML = icon("close");
    document.body.style.overflow = "hidden";
  };

  toggle.addEventListener("click", () => {
    if (nav.classList.contains("is-open")) closeNav();
    else openNav();
  });

  scrim.addEventListener("click", closeNav);
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });
}

function initScrollTo() {
  document.querySelectorAll("[data-scroll-to]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const targetId = el.getAttribute("data-scroll-to");
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || items.length === 0) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((el) => observer.observe(el));
}

function observeNewReveals() {
  // Los bloques renderizados dinámicamente (servicios, sedes, obituarios)
  // se marcan con .reveal después de insertarse en el DOM.
  initReveal();
}

function initObituaryModal() {
  const overlay = document.getElementById("obituary-modal");
  if (!overlay) return;
  const closeBtn = overlay.querySelector(".modal__close");

  const close = () => overlay.classList.remove("is-open");

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCompanyContent();
  renderServices();
  renderLocations();
  renderGallery();
  renderObituaries();
  renderContact();
  renderFooter();

  initNav();
  initScrollTo();
  initObituaryModal();
  initQuoter();
  initAssistant();

  observeNewReveals();
});
