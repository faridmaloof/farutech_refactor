# TASK-020 — Admin: Blog CMS con SEO Completo

**Fase:** FASE 15 — Cierre de Brechas Funcionales (Requisito 6.3)
**Estado:** ⬜ BACKLOG
**Prioridad:** 🟡 HIGH
**Responsable:** Frontend Lead (Admin) + Backend Lead
**Fecha Creación:** 2026-09-05
**Implementa:** [SPEC-005 — Blog CMS](../../02_SPECIFICATIONS/SPEC-005_Blog_CMS.md)

---

## 🎯 Objetivo

Implementar el módulo completo de Blog descrito en SPEC-005: editor de artículos (visual + HTML), panel de SEO completo por artículo, publicación programada y categorización.

## ⚠️ Decisión Previa Requerida (bloqueante)

Misma decisión que TASK-019 sobre `ContentBlockEditor` compartido — **coordinar ambas tareas antes de iniciar desarrollo**, no repartirlas a desarrolladores distintos sin esta decisión tomada primero.

## ⚠️ Riesgo Abierto a Resolver Antes de Estimar

SPEC-005 RB004 señala una dependencia técnica no resuelta: cómo un artículo recién publicado llega al HTML prerenderizado del website público (`scripts/prerender.mjs` genera HTML estático por build, no dinámicamente). Definir una de estas rutas antes de estimar el esfuerzo real:

- (a) Mover las rutas de blog a SSR real en vez de prerender estático
- (b) Disparar un rebuild/re-prerender automático al publicar un artículo (webhook backend → CI)
- (c) Servir el detalle de artículo individual del blog vía client-side rendering puro, aceptando el trade-off de SEO (no recomendado dado el requisito 2 de "excelente SEO")

## 📂 Alcance (resumen — detalle completo en SPEC-005)

### Backend
- [ ] Migración: agregar campos SEO (`meta_title`, `meta_description`, `canonical_url`, `og_image`, `no_index`, `focus_keyword`) y `content_blocks`/`html_content` a `blog_posts`
- [ ] Endpoint `check-slug` para validación en tiempo real
- [ ] Conectar `publish`/`schedule` con `PublishScheduledBlogPost` (ya existe)

### Frontend
- [ ] `BlogPostsPage`, `PostEditor`, `SeoPanel` (con preview de Google/Open Graph), `CategoryTagManager`, `PublishControls`

## ✅ Criterios de Aceptación

Ver SPEC-005 §8 (CA001–CA006) — copiar íntegramente al tablero de tareas del equipo.

## 📆 Historial de Cambios

| Fecha | Estado | Cambio | Responsable |
|---|---|---|---|
| 2026-09-05 | BACKLOG | Creación — implementa SPEC-005 (gap 6.3) | Technical Lead |
