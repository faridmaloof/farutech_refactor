# Plan de media para Heroes (imagen ↔ video) — pendiente de producción

> Este archivo es una especificación, NO implementación. Se implementa cuando
> haya video real disponible para cada página. Mientras tanto, todos los
> heroes usan solo `block.image` (poster estático).

## Comportamiento esperado

1. Se muestra la imagen estática (poster) entre 10–14 segundos.
2. Crossfade de 600–800ms hacia el video.
3. El video reproduce una sola vez (8–15s), sin audio, sin controles visibles.
4. Crossfade de regreso a la imagen estática.
5. Pausa y se repite el ciclo. El corte nunca debe sentirse abrupto.

## Por qué la imagen va primero

El poster es lo que Google mide para LCP (Largest Contentful Paint) y por lo
tanto para el score de Performance/SEO. El video se carga en segundo plano
(`preload="none"` + `IntersectionObserver`) y solo arranca cuando el
navegador está idle y el hero está en viewport.

## Especificación técnica

- Formatos: `.mp4` (H.264, compatibilidad amplia) + `.webm` (VP9, más liviano) vía múltiples `<source>`.
- Sin audio: atributos `muted`, `playsinline`, sin controles.
- Peso máximo por clip: ~2–3 MB a 1280px de ancho, 24–30fps. Si se supera, se recorta duración antes que resolución.
- Accesibilidad: `prefers-reduced-motion: reduce` → el video NUNCA se reproduce, se mantiene siempre en la imagen estática.
- El primer y último frame del video deben coincidir visualmente con la imagen estática para que el crossfade sea imperceptible.

## Brief de contenido por página (para quien grabe/edite)

| Página | Qué debe mostrar el video |
|---|---|
| Home | Equipo trabajando → transición abstracta hacia UI de producto real (no stock genérico) |
| Web + POS | Mano usando el POS / pantalla de checkout en acción real |
| Cloud + Security | Visualización abstracta de infraestructura (sin clichés de "candado" o "matrix") |
| SaaS Platforms | Scroll/interacción real dentro de un dashboard del producto |
| UX Engineering | Proceso de diseño en timelapse: wireframe → prototipo → producto final |
| Product Engineering | Código/terminal real con un build corriendo |
| Architecture Consulting | Diagrama de arquitectura dibujándose (pizarra o herramienta tipo Excalidraw) |

## Checklist antes de implementar

- [ ] Video final entregado en `.mp4` y `.webm`
- [ ] Poster (frame estático) exportado como `.jpg`/`.webp` optimizado
- [ ] Primer/último frame del video validado contra el poster
- [ ] Peso verificado (< 3MB por clip)
- [ ] Prueba en conexión lenta (throttling 3G) sin bloquear el LCP
