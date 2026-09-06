# TASK-023 — Corregir JSON-LD Ausente en HTML Prerenderizado (SEO)

**Fase:** FASE 14 — Corrección de Deuda Técnica (Auditoría 2026-09)
**Estado:** ⬜ BACKLOG
**Prioridad:** 🟡 HIGH (impacta directamente el requisito 2 — excelente SEO)
**Responsable:** Frontend Lead (Website)
**Fecha Creación:** 2026-09-05

---

## 🎯 Objetivo

Corregir que los datos estructurados (JSON-LD / schema.org) del componente `JsonLd.tsx` no queden incluidos en el HTML estático generado por `scripts/prerender.mjs`, ya que hoy se inyectan vía `useEffect`, el cual **no se ejecuta** durante `renderToString` (usado en `entry-server.tsx`).

## 📋 Evidencia de Auditoría

```tsx
// apps/website/src/frontend/src/components/JsonLd.tsx
useEffect(() => {
  // inyecta <script type="application/ld+json"> en document.head
}, [data]);
```

```tsx
// apps/website/src/frontend/src/entry-server.tsx
export function render(url: string): string {
  return renderToString(<StaticRouter location={url}><App .../></StaticRouter>);
  // renderToString NO ejecuta useEffect — el JSON-LD nunca llega al HTML estático
}
```

Resultado: los crawlers que leen el HTML servido directamente (sin ejecutar JS) no ven el schema.org, perdiendo la oportunidad de rich snippets en resultados de búsqueda.

## 📂 Solución Propuesta

Opción recomendada: mover la generación del JSON-LD fuera de `useEffect`, hacia un mecanismo que sí se capture en `renderToString` — por ejemplo, un Context o un array acumulado durante el render (similar a cómo `react-helmet-async` resuelve `<head>` dinámico en SSR), y que `scripts/prerender.mjs` extraiga ese JSON-LD acumulado e inyecte el `<script>` directamente en el HTML final (mismo patrón que ya usa para `title`/`description`/`canonical`, ver `prerender.mjs` líneas de inyección de meta tags).

Alternativa más simple: si el JSON-LD por página es estático y conocido en build-time (no depende de datos runtime), generarlo directamente en `scripts/prerender.mjs` desde el mismo mapa `routeMeta` que ya usa para title/description, sin pasar por un componente React en absoluto.

## ✅ Criterios de Aceptación

- [ ] El HTML generado por `npm run build:seo` incluye el `<script type="application/ld+json">` correspondiente a cada ruta, verificable con `curl` sin ejecutar JS
- [ ] Validación con [Google Rich Results Test](https://search.google.com/test/rich-results) sobre el HTML estático (no sobre el render final del navegador) pasa sin errores
- [ ] No se rompe el comportamiento actual de title/description/canonical/hreflang ya funcionando correctamente

## 🔗 Referencias

- Confirmar en TASK-016 que `npm run build:seo` (y no `npm run build`) es efectivamente el comando usado en el pipeline de despliegue real — si no lo es, este fix no tiene efecto en producción y hay que resolver eso primero

## 📆 Historial de Cambios

| Fecha | Estado | Cambio | Responsable |
|---|---|---|---|
| 2026-09-05 | BACKLOG | Creación tras hallazgo de auditoría (gap SEO, requisito 2) | Technical Lead |
