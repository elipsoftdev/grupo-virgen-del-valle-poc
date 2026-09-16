# Grupo Virgen del Valle — Prueba de concepto digital

Prueba de concepto (PoC) independiente que demuestra cómo el sitio de Grupo
Virgen del Valle puede evolucionar de una página informativa a un canal
digital de atención, orientación, cotización, previsión y captación,
disponible 24/7.

Este proyecto **no modifica, redirige ni depende** del sitio institucional
actual de la empresa. Es un desarrollo completamente independiente pensado
para presentación interna/comercial.

## Objetivo

Mostrar, sobre la identidad actual de la marca, capacidades que el sitio
actual no explota: atención inmediata, cotización guiada, mensajes de
WhatsApp personalizados, planes de previsión, presencia nacional, un
asistente digital 24/7 y un módulo de obituarios — dejando además el terreno
preparado para una futura arquitectura con backend, CRM e IA real.

## Arquitectura

El Home es una landing comercial: convierte. El contenido institucional
extenso (historia completa, misión, visión) vive aparte, en `/nosotros.html`.

```text
index.html                → Home comercial: hero, servicios, teaser de
                             cotización, atención inmediata, ecosistema
                             omnicanal, previsión, obituarios + solicitar
                             obituario, sedes, instalaciones,
                             oportunidades digitales, CTA final
cotizar.html              → Cotizador guiado completo (soporta ?tipo=)
obituarios.html           → Listado completo de obituarios/homenajes
solicitar-obituario.html  → Formulario de solicitud de publicación
nosotros.html             → Historia, misión, visión, presencia nacional

dashboard-demo.html       → Centro Digital · Panel ejecutivo (demo)
centro-atencion-demo.html → Centro Digital · Atención omnicanal (demo)
```

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

- **Header y navegación responsive** (Inicio, Servicios, Previsión,
  Obituarios, Sedes, Cotizar, Nosotros) con acceso permanente a
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
- **Previsión funeraria**, resumida en tres pilares (sin precios ni
  condiciones inventadas).
- **Obituarios y homenajes**: teaser en el Home, listado completo, y un
  flujo de solicitud de publicación con validación, resumen y confirmación
  simulada (sin backend).
- **Presencia nacional**: sedes en Cumaná (principal), Puerto La Cruz, Anaco
  y Distrito Capital, cada una con "Ver sede", "Cómo llegar" y "Contactar".
- **Misión y visión oficiales**, presentadas tal como están publicadas por la
  empresa (no reescritas), en `/nosotros.html`.
- **Asistente digital 24/7** simulado: árbol conversacional + caja de
  escritura con detección de intención por palabras clave (traslados,
  previsión, cremación, urgencias, sedes, obituarios), enlace directo al
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
- Catálogo vigente de servicios y condiciones de los planes de previsión.
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
