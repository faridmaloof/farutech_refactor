# Dirección de arte para media en heroes

## Regla de experiencia

La imagen estática es el contenido inicial y el fallback permanente. El video nunca bloquea el LCP: debe cargarse después de la imagen, sin audio, `muted`, `playsinline`, con póster idéntico y respetando `prefers-reduced-motion`. Si no reproduce, se mantiene la imagen sin controles ni espacios vacíos.

La futura transición debe ser sutil: imagen visible 12–20 segundos, video 8–15 segundos, fundido cruzado de 600–900 ms y regreso a la imagen. No reproducir en conexiones lentas, ahorro de datos o movimiento reducido.

## Hero principal

- Mensaje: precisión, progreso y acompañamiento técnico; no mostrar interfaces genéricas ni código decorativo.
- Imagen: composición abstracta inspirada en las piezas cyan, verde y naranja del logo sobre fondo grafito; mucho espacio negativo para el titular.
- Video: ensamblaje lento de las piezas, flujos de luz o una transformación de arquitectura; no usar stock de oficinas ni personas tecleando.

## Servicios

| Servicio | Imagen y composición | Movimiento futuro |
| --- | --- | --- |
| Desarrollo a medida | Retícula técnica, producto en construcción y cyan dominante. | Módulos que se conectan con precisión. |
| Plataformas SaaS | Capas, nodos y profundidad con verde/cyan. | Organizaciones aisladas que se ordenan en una plataforma. |
| Soluciones empresariales | Plano operativo, conexiones y acento naranja. | Flujos dispersos que convergen en una fuente de verdad. |
| IA y automatización | Circuitos claros, pulsos y cyan eléctrico. | Señales que recorren el circuito sin efectos de “magia”. |
| Modernización | Arquitectura existente y capas renovadas, ámbar controlado. | Sustitución gradual de piezas, nunca una explosión o big-bang. |
| UX Engineering | Órbitas, contraste y tipografía, violeta como acento secundario. | Estados de interfaz que se ordenan con transiciones accesibles. |

## Entregables por medio

- Imagen WebP/AVIF, relación 4:3 para servicio y 16:9 para home, con versión móvil y texto alternativo contextual.
- Video WebM y MP4 de máximo 15 s, sin audio, optimizado para web y con el mismo encuadre del póster.
- Confirmar derechos de uso, compresión, contraste con texto y peso dentro del presupuesto de rendimiento antes de publicar.
