/**
 * Formulario de solicitud de publicación de obituario.
 *
 * Demostración: no existe backend real. El formulario se valida en el
 * frontend, se muestra un resumen y un estado de confirmación, y
 * opcionalmente el solicitante puede remitir esos mismos datos por
 * WhatsApp a un asesor real.
 */

function initObituaryRequestForm() {
  const form = document.getElementById("obituary-request-form");
  if (!form) return;

  const confirmation = document.getElementById("obituary-request-confirmation");
  const summaryEl = document.getElementById("obituary-request-summary");
  const waLink = document.getElementById("obituary-request-whatsapp");
  const resetBtn = document.getElementById("obituary-request-reset");
  const photoInput = document.getElementById("ob-photo");
  const photoPreview = document.getElementById("ob-photo-preview");

  if (photoInput) {
    photoInput.addEventListener("change", () => {
      const file = photoInput.files && photoInput.files[0];
      if (!file) {
        photoPreview.style.display = "none";
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        photoPreview.src = e.target.result;
        photoPreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form).entries());

    const rows = [
      ["Fallecido", data.deceasedName],
      ["Fecha", data.date],
      ["Ciudad", data.city],
      ["Sala", data.venue || "—"],
      ["Horario", data.schedule || "—"],
      ["Ceremonia", data.ceremony || "—"],
      ["Lugar", data.place || "—"],
      ["Mensaje de la familia", data.familyMessage || "—"],
      ["Solicitante", data.requesterName],
      ["Teléfono del solicitante", data.requesterPhone],
    ];
    if (data.requesterEmail) rows.push(["Correo del solicitante", data.requesterEmail]);

    summaryEl.innerHTML = rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("");

    const message = [
      `Hola, ${CONFIG.brandName}.`,
      "",
      "Quisiera solicitar la publicación de un obituario.",
      "",
      `Fallecido: ${data.deceasedName}`,
      `Fecha: ${data.date}`,
      `Ciudad: ${data.city}`,
      data.venue ? `Sala: ${data.venue}` : null,
      data.schedule ? `Horario: ${data.schedule}` : null,
      data.ceremony ? `Ceremonia: ${data.ceremony}` : null,
      data.place ? `Lugar: ${data.place}` : null,
      "",
      `Mi nombre es ${data.requesterName} y mi teléfono es ${data.requesterPhone}.`,
      "",
      "¿Podrían orientarme sobre el proceso de publicación?",
    ]
      .filter(Boolean)
      .join("\n");

    const url = buildWhatsappUrl(message);
    if (url) {
      waLink.href = url;
      waLink.style.display = "";
    } else {
      waLink.style.display = "none";
    }

    form.hidden = true;
    confirmation.hidden = false;
    confirmation.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      form.reset();
      photoPreview.style.display = "none";
      confirmation.hidden = true;
      form.hidden = false;
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

document.addEventListener("DOMContentLoaded", initObituaryRequestForm);
