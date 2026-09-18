# Grupo Virgen del Valle — Prueba de concepto digital

Prueba de concepto (PoC) independiente que demuestra cómo el sitio de Grupo
Virgen del Valle puede evolucionar de una página informativa a un canal
digital de atención, orientación, cotización y captación, disponible
24/7 — y una propuesta comercial interactiva para la Junta Directiva.

Este proyecto **no modifica, redirige ni depende** del sitio institucional
actual de la empresa. Es un desarrollo completamente independiente pensado
para presentación interna/comercial.

## Objetivo

Mostrar, sobre la identidad actual de la marca, capacidades que el sitio
actual no explota: atención inmediata, cotización guiada, mensajes de
WhatsApp personalizados, presencia nacional, un
asistente digital 24/7 y un módulo de obituarios — dejando además el terreno
preparado para una futura arquitectura con backend, CRM e IA real.

## Alcance: Fase 1 y Fase 2

- **Fase 1 (esta PoC y la propuesta):** servicios de necesidad inmediata /
  venta directa — atención inmediata, velación, cremación, inhumación y
  traslados.
- **Fase 2 (fuera de alcance):** previsión funeraria. Será objeto de un
  análisis legal, comercial y operativo independiente, con su propia
  propuesta. En el sitio solo aparece como nota discreta "Próxima etapa";
  no hay cotización, planes ni CTA de contratación de previsión, y el
  asistente responde a esas consultas indicando que es una próxima etapa.

## Arquitectura

El Home es una landing comercial: convierte. El contenido institucional
extenso (historia completa, misión, visión) vive aparte, en `/nosotros.html`.

```text
index.html                → Home comercial: hero, servicios, teaser de
                             cotización, atención inmediata, ecosistema
                             omnicanal, nota "próxima etapa" (previsión),
                             obituarios + solicitar
                             obituario, sedes, instalaciones,
                             oportunidades digitales, CTA final
cotizar.html              → Cotizador guiado completo (soporta ?tipo=)
obituarios.html           → Listado completo de obituarios/homenajes
solicitar-obituario.html  → Formulario de solicitud de publicación
nosotros.html             → Historia, misión, visión, presencia nacional

dashboard-demo.html       → Centro Digital · Panel ejecutivo (demo)
centro-atencion-demo.html → Centro Digital · Atención omnicanal (demo)

propuesta.html            → Propuesta comercial interactiva (no está en
                             el menú público: se envía por enlace)
```

## Flujo de navegación

```text
propuesta.html ──► index.html (Explorar la PoC)
      │                 └─► cotizar.html ─► centro-atencion-demo.html
      ├──► centro-atencion-demo.html ◄──► dashboard-demo.html
      └──► dashboard-demo.html            (ambas con "Volver a la propuesta"
                                           y "Volver al sitio público")
```

## Propuesta comercial (`propuesta.html`)

Página independiente del sitio público, pensada para enviarse por enlace a
la Junta Directiva. Recorre: hoy vs. propuesta, qué gana el negocio,
agente digital 24/7 (conversación animada y flujo cliente → agente →
necesidad → datos → asesor humano), inteligencia de negocio (datos
demostrativos), preguntas de dirección, impacto esperado (escenarios
referenciales), simulador ilustrativo, alcance en cinco frentes, roadmap
de hasta 45 días, inversión (USD 3.890 financiado / USD 3.590 pago total
dentro de los 45 días), plan 30/30/20/20, nota de bolívares (tasa oficial
euro BCV vigente a la fecha de cada pago), Fase 2 y servicios que se cotizan
aparte.

- Archivos: `propuesta.html`, `css/propuesta.css`, `js/propuesta.js`,
  `data/proposal-config.js`.
- **Contacto comercial:** `PROPOSAL_CONFIG.contact` (`whatsapp`, `email`)
  está en `null` a propósito. Mientras no se complete, "Quiero avanzar" y
  "Tengo una consulta" muestran el mensaje redactado para copiarlo.
- **Impresión / PDF:** `@media print` oculta controles interactivos, abre
  todos los bloques de alcance y conserva precios, pagos, roadmap y
  términos (≈14 páginas A4).
- **Elipsoft:** aparece como texto discreto en el pie ("Tecnología y
  desarrollo: Elipsoft"). No hay logo de Elipsoft en el repositorio; si se
  agrega, reemplazar ese texto en `propuesta.html` (`.p-footer__dev`).

### Eventos preparados para analytics / n8n

`js/propuesta.js` registra eventos anónimos (sin datos personales ni
fingerprinting) en `window.GVV_PROPOSAL_EVENTS` y los emite como
`CustomEvent("proposal:event")`. Si se define
`PROPOSAL_CONFIG.analytics.endpoint`, se envían con `navigator.sendBeacon`.

| Evento | Cuándo |
| --- | --- |
| `proposal_open` | Carga de la página |
| `proposal_section_view` | Primera vez que se ve cada sección |
| `proposal_demo_click` | "Explorar la PoC" / "Volver a explorar la demo" |
| `proposal_center_click` | "Ver Centro de Atención" |
| `proposal_dashboard_click` | "Explorar Dashboard" |
| `proposal_roi_interaction` | Primer uso del simulador |
| `proposal_payment_view` | Se ve el plan de pagos |
| `proposal_cta_advance` | "Quiero avanzar" |
| `proposal_cta_question`, `proposal_agent_replay` | Consulta / repetir conversación |

## Centro Digital (pantallas demo)

Dos pantallas internas muestran el otro lado del ecosistema: qué ocurre
con una solicitud después de que la familia la envía. **Todos sus datos
son simulados** y así se identifican en pantalla ("DEMO · Datos
simulados").

- **Panel ejecutivo** (`dashboard-demo.html`): indicadores del día, embudo
  digital, oportunidades recientes, origen de los contactos por canal,
  servicios más consultados y solicitudes por sede.
- **Atención omnicanal** (`centro-atencion-demo.html`): bandeja única con
  conversaciones de WhatsApp, Instagram, Facebook y web; la conversación
  seleccionada; y un panel de resumen con la necesidad ya clasificada,
  la acción sugerida y la asignación a un asesor (simulada).

### Cómo se conectan con el sitio público

Al terminar el cotizador, la solicitud se guarda **en el navegador del
visitante** (`localStorage`, clave `gvv_demo_lead`) y aparece marcada como
nueva en ambas pantallas. Nada se envía a ningún servidor: es el recurso
que permite demostrar el recorrido completo sin backend. El botón
"Restablecer datos demo" (visible solo cuando existe esa solicitud) la
elimina.

## Funcionalidades demostradas

- **Header y navegación responsive** (Inicio, Servicios, Obituarios,
  Sedes, Cotizar, Nosotros) con acceso permanente a
  "Atención 24/7".
- **Hero comercial** con jerarquía de CTAs: Cotizar un servicio (dominante),
  Necesito asistencia ahora, Ver nuestros servicios.
- **Servicios** en seis bloques con detalle ampliado en modal y acceso
  directo a cotizar cada uno.
- **Cotizador guiado** en página propia: Servicio → Ubicación → Detalles →
  Contacto → Resultado, con preguntas dinámicas por tipo de servicio y dos
  CTAs de WhatsApp (enviar solicitud / solicitar llamada).
- **Atención inmediata** diferenciada del cotizador, para saltar directo a
  WhatsApp o pedir contacto.
- **Previsión funeraria**: solo como nota "Próxima etapa" (Fase 2).
- **Obituarios y homenajes**: teaser en el Home, listado completo, y un
  flujo de solicitud de publicación con validación, resumen y confirmación
  simulada (sin backend).
- **Presencia nacional**: sedes en Cumaná (principal), Puerto La Cruz, Anaco
  y Distrito Capital, cada una con "Ver sede", "Cómo llegar" y "Contactar".
- **Misión y visión oficiales**, presentadas tal como están publicadas por la
  empresa (no reescritas), en `/nosotros.html`.
- **Asistente digital 24/7** simulado: árbol conversacional + caja de
  escritura con detección de intención por palabras clave (traslados,
  cremación, urgencias, sedes, obituarios; previsión → "próxima etapa"),
  enlace directo al
  cotizador y escalamiento a WhatsApp/asesor humano desde cualquier página.
- **Ecosistema omnicanal** explicado en el Home: los cuatro canales, el
  asistente que clasifica y escala, el centro de atención y el seguimiento,
  con acceso a las dos pantallas demo del Centro Digital.
- Sistema de botones e iconografía propios, con microinteracciones
  (elevación, desplazamiento de ícono) y revelado progresivo al hacer scroll,
  respetando `prefers-reduced-motion`.
- Diseño responsive verificado en móvil (360–412px) y desktop
  (1366–1920px), con foco en accesibilidad básica (navegación por teclado,
  contraste, `aria-label`s).

## Tecnologías

HTML, CSS y JavaScript vanilla — sin frameworks ni build step. Cada página
es un archivo HTML independiente que comparte los mismos `css/` y `js/`.
Elegido deliberadamente para minimizar complejidad y garantizar una
publicación simple y confiable en GitHub Pages.

```text
css/
  tokens.css       → design tokens (colores, tipografía, espaciado, motion)
  main.css         → layout base, header, hero, botones, footer
  components.css   → cards, cotizador, asistente, modales, formularios
  demo-dashboard.css → shell de aplicación del Centro Digital (demo)
data/
  config.js            → configuración centralizada (WhatsApp, correo, etc.)
  company.js           → contenido institucional (misión, visión, trayectoria)
  locations.js         → sedes
  services.js          → catálogo de servicios (Home)
  demo-obituaries.js   → DEMO_DATA — obituarios ficticios
  demo-leads.js        → DEMO_DATA — oportunidades y asesores simulados
  demo-conversations.js→ DEMO_DATA — conversaciones omnicanal simuladas
  demo-metrics.js      → DEMO_DATA — KPIs, embudo y métricas simuladas
js/
  icons.js             → set de iconos SVG en línea
  render.js            → renderizado de contenido dinámico desde data/
  quote.js             → lógica del cotizador guiado
  assistant.js         → árbol conversacional del asistente digital
  obituary-request.js  → validación y confirmación del formulario de obituario
  demo-store.js        → puente localStorage entre cotizador y pantallas demo
  demo-shell.js        → navegación y componentes comunes del Centro Digital
  dashboard.js         → panel ejecutivo (demo)
  centro-atencion.js   → centro de atención omnicanal (demo)
  main.js              → navegación, scroll reveal, inicialización
docs/
  recomendaciones-produccion.md
```

## Cómo ejecutar localmente

No requiere instalación de dependencias. Basta con servir la carpeta como
archivos estáticos, por ejemplo:

```bash
python -m http.server 5173
```

Y abrir `http://localhost:5173`.

## Cómo desplegar

El sitio es 100% estático y se publica directamente en GitHub Pages desde la
rama principal (carpeta raíz), sin paso de build.

## Elementos que requieren validación del cliente

- Manual de identidad gráfica oficial (colores exactos, tipografías con
  licencia, logo vectorial).
- Banco fotográfico profesional actualizado.
- Direcciones y teléfonos específicos de cada sede (hoy solo la ciudad está
  confirmada).
- Reglas de distribución de WhatsApp por sede (hoy se usa un único número
  centralizado, confirmado desde el sitio institucional público).
- Catálogo vigente de servicios de Fase 1 y servicios disponibles por sede.
- Contacto comercial de Elipsoft para la propuesta (`data/proposal-config.js`).
- Flujo administrativo, permisos y consideraciones de privacidad para el
  módulo de obituarios antes de usar datos reales.
- Integración futura con un asistente de IA real, CRM, y automatización de
  WhatsApp.

Ver el detalle completo en
[`docs/recomendaciones-produccion.md`](docs/recomendaciones-produccion.md).

## Nota sobre el asistente digital

El asistente de esta PoC es un árbol conversacional simulado (reglas +
navegación contextual), **no una integración real de inteligencia
artificial**. No se usan API keys de ningún proveedor en el frontend: GitHub
Pages es contenido público y nunca debe exponer credenciales. La
arquitectura futura recomendada está documentada en
[`docs/recomendaciones-produccion.md`](docs/recomendaciones-produccion.md).

---

Prueba de concepto desarrollada para Grupo Virgen del Valle. No sustituye al
sitio institucional oficial de la empresa.
