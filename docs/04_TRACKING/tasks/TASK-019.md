# TASK-019 — Admin: Newsletter con Editor Visual/HTML

**Fase:** FASE 15 — Cierre de Brechas Funcionales (Requisito 6.2)
**Estado:** ⬜ BACKLOG
**Prioridad:** 🟡 HIGH
**Responsable:** Frontend Lead (Admin) + Backend Lead
**Fecha Creación:** 2026-09-05
**Implementa:** [SPEC-004 — Newsletter Management](../../02_SPECIFICATIONS/SPEC-004_Newsletter_Management.md)

---

## 🎯 Objetivo

Implementar el módulo completo de Newsletter descrito en SPEC-004: creación de campañas con editor visual (bloques del Design System) y modo HTML, envío de pruebas, programación y envío masivo.

## ⚠️ Decisión Previa Requerida (bloqueante)

Antes de iniciar, decidir junto con TASK-020 (Blog) si se construye un componente compartido `ContentBlockEditor` en `packages/design-system` reutilizado por ambos módulos, o si se implementan por separado. **Se recomienda fuertemente la opción compartida** (ver SPEC-005 §9) para no duplicar el editor de bloques dos veces. Esta decisión debe tomarse antes de repartir esta tarea a desarrollo.

## 📂 Alcance (resumen — detalle completo en SPEC-004)

### Backend
- [ ] Migración: agregar `content_blocks` (JSON), `html_content`, `preview_text`, `segment`, `stats` a `newsletter_campaigns`
- [ ] Endpoints: CRUD de campañas, `preview`, `send-test`, `schedule`, `send`
- [ ] Endpoint de suscriptores: listado, exportación, baja manual

### Frontend
- [ ] `NewsletterCampaignsPage`, `CampaignEditor` (Visual + HTML), `BlockPalette`, `BlockEditorPanel`, `PreviewModal`, `SendTestModal`, `SubscribersPage`

## ✅ Criterios de Aceptación

Ver SPEC-004 §8 (CA001–CA007) — copiar íntegramente al tablero de tareas del equipo.

## 🔗 Dependencias

- `SendNewsletterJob` (backend, ya existe — extender para modo single-recipient de prueba)
- Editor de código embebible (nueva dependencia npm, evaluar CodeMirror vs Monaco por tamaño de bundle antes de elegir)

## 📆 Historial de Cambios

| Fecha | Estado | Cambio | Responsable |
|---|---|---|---|
| 2026-09-05 | BACKLOG | Creación — implementa SPEC-004 (gap 6.2) | Technical Lead |
