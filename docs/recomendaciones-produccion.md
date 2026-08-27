# Recomendaciones para producción

Este documento resume lo que debe resolverse antes de convertir esta prueba de
concepto (PoC) en el sitio definitivo de Grupo Virgen del Valle.

## 1. Identidad gráfica

Solicitar al cliente el manual de identidad corporativa oficial: colores
exactos (códigos HEX/Pantone), tipografías con licencia de uso web, versión
vectorial del logo (SVG) y lineamientos de uso. Esta PoC usa como referencia
provisional los colores y tipografías detectados en el sitio institucional
público actual (azul profundo `#1A2A3A`, acento dorado `#C5A059`, Playfair
Display + Inter). Todo vive en [`css/tokens.css`](../css/tokens.css) para que
el cambio sea inmediato.

## 2. Banco fotográfico

Realizar una nueva sesión fotográfica profesional de: fachadas, recepción,
capillas, salas de velación, interiores, vehículos, personal, sedes y
detalles de instalaciones. Las fotografías actuales (reutilizadas de forma
provisional del sitio institucional vigente) cumplen su función demostrativa,
pero no reflejan el estándar visual que esta propuesta busca proyectar.

## 3. Servicios

Validar con el área comercial el catálogo vigente de servicios agrupado en
[`data/services.js`](../data/services.js). Ningún servicio listado debe
interpretarse como oferta contractual hasta su confirmación.

## 4. Sedes

Confirmar direcciones físicas, teléfonos directos y horarios específicos de
cada sede en [`data/locations.js`](../data/locations.js). Actualmente solo
están confirmadas las ciudades (Cumaná, Puerto La Cruz, Anaco, Distrito
Capital) y el WhatsApp general.

## 5. WhatsApp

Definir si cada sede debe tener su propio número o si toda la demanda se
enruta a un único canal central, y las reglas de distribución/horario de
atención. Hoy todo el sitio usa un único número centralizado en
[`data/config.js`](../data/config.js).

## 6. Cotizador

Definir con el equipo comercial las reglas reales detrás de cada flujo del
cotizador (qué información se prioriza, a quién se enruta cada tipo de
solicitud, SLA de respuesta esperado).

## 7. Planes funerarios

Validar los planes de previsión vigentes, condiciones, coberturas y
cualquier información contractual antes de publicarla. Esta PoC
deliberadamente no muestra precios ni condiciones específicas.

## 8. Inteligencia artificial

El asistente digital de esta PoC es un árbol conversacional simulado, sin
integración real de IA ni API keys en el frontend. Para producción se
recomienda la arquitectura:

```text
Web
 ↓
API segura
 ↓
Asistente IA
 ↓
Base de conocimiento Grupo Virgen del Valle
 ↓
CRM / WhatsApp / asesor humano
```

El asistente productivo debe responder únicamente con información
institucional validada y escalar de inmediato a un humano ante: necesidad
inmediata, fallecimiento reciente, servicio urgente, intención de
contratación, traslado inmediato, dudas administrativas complejas,
información fuera de su base de conocimiento, o solicitud expresa de hablar
con una persona.

## 9. CRM

Definir la integración futura entre el cotizador/asistente y un CRM real
para dar seguimiento a cada lead generado, hoy simulado únicamente como un
mensaje de WhatsApp prellenado.

## 10. Obituarios

Definir el flujo administrativo del módulo de obituarios: quién carga la
información, con qué permisos, qué datos de la familia se solicitan, y qué
consideraciones de privacidad aplican antes de publicar información real de
personas fallecidas.
