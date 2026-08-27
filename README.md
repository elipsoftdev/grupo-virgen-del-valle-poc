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

## Funcionalidades demostradas

- **Header y navegación responsive** con acceso permanente a "Atención 24/7".
- **Hero** con CTAs diferenciados: asistencia inmediata, conocer servicios,
  solicitar cotización.
- **Trayectoria institucional** (+70 años) con fotografía histórica.
- **Misión y visión oficiales**, presentadas tal como están publicadas por la
  empresa (no reescritas).
- **Servicios** organizados en cuatro bloques: inmediatos, destino final,
  complementarios y previsión.
- **Previsión funeraria**, con enfoque en planificación anticipada (sin
  precios ni condiciones inventadas).
- **Cotizador guiado** de 4 pasos que genera un resumen y un mensaje de
  WhatsApp personalizado según las respuestas.
- **Presencia nacional**: sedes en Cumaná (principal), Puerto La Cruz, Anaco
  y Distrito Capital.
- **Galería de instalaciones.**
- **Obituarios y homenajes** (módulo demostrativo, datos 100% ficticios).
- **Asistente digital 24/7** simulado mediante árbol conversacional, con
  escalamiento a WhatsApp/asesor humano.
- Diseño responsive verificado en móvil (360–412px) y desktop
  (1366–1920px), con foco en accesibilidad básica (`prefers-reduced-motion`,
  navegación por teclado, contraste, `aria-label`s).

## Tecnologías

HTML, CSS y JavaScript vanilla — sin frameworks ni build step. Elegido
deliberadamente para minimizar complejidad y garantizar una publicación
simple y confiable en GitHub Pages.

```text
index.html
css/
  tokens.css       → design tokens (colores, tipografía, espaciado)
  main.css         → layout base, header, hero, footer
  components.css   → cards, cotizador, asistente, modales, galería
data/
  config.js            → configuración centralizada (WhatsApp, correo, etc.)
  company.js           → contenido institucional (misión, visión, trayectoria)
  locations.js         → sedes
  services.js          → catálogo de servicios
  demo-obituaries.js   → DEMO_DATA — obituarios ficticios
js/
  icons.js         → set de iconos SVG en línea
  render.js        → renderizado de contenido dinámico desde data/
  quote.js         → lógica del cotizador guiado
  assistant.js     → árbol conversacional del asistente digital
  main.js          → navegación, scroll reveal, inicialización
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
