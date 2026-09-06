# TASK-022 — Mini CRM: Cotizaciones, Minipos y Control Tarifario

**Fase:** FASE 15 — Cierre de Brechas Funcionales (Requisito 6.5)
**Estado:** ⬜ BACKLOG
**Prioridad:** 🔴 CRÍTICO (gap total — no existe ningún artefacto de código previo)
**Responsable:** Backend Lead + Frontend Lead (Admin)
**Fecha Creación:** 2026-09-05
**Implementa:** [SPEC-006 — Quotes & Tariff Management](../../02_SPECIFICATIONS/SPEC-006_Quotes_And_Tariff_Management.md)

---

## 🎯 Objetivo

Construir desde cero el módulo de cotizaciones y control tarifario ("minipos") que extiende el mini CRM (SPEC-001), cerrando por completo el requisito 6.5.

## 📋 Estado Actual (Auditoría)

Ningún modelo, migración, controller o mención previa existe en el código para tarifas o cotizaciones. Esta tarea parte de cero, siguiendo SPEC-006 íntegramente.

## 📂 Alcance (resumen — detalle completo en SPEC-006)

### Backend
- [ ] Migraciones: `tariff_items`, `tariff_item_versions`, `quotes`, `quote_lines`
- [ ] Generación de PDF (evaluar `dompdf` o `snappy`/wkhtmltopdf — decisión técnica a tomar antes de estimar)
- [ ] Endpoints admin: CRUD de tarifas + historial, CRUD de cotizaciones, envío, PDF
- [ ] Endpoints públicos (sin auth): vista de cotización por `publicToken`, registro de aceptación/rechazo
- [ ] Job programado: expiración automática de cotizaciones vencidas (SPEC-006 RB003)
- [ ] Job de notificación al responder (SPEC-006 RB006)

### Frontend (Admin)
- [ ] `TariffsPage`, `TariffFormModal` (con historial de precio)
- [ ] `QuotesPage`, `QuoteBuilder`, `QuoteTimelinePanel` (extiende `LeadDetailModal` de SPEC-001 con pestaña "Cotizaciones")
- [ ] `SendQuoteModal`

### Frontend (Público)
- [ ] `PublicQuoteView` — página pública sin layout de admin, con identidad de marca

## ✅ Criterios de Aceptación

Ver SPEC-006 §8 (CA001–CA008) — copiar íntegramente al tablero de tareas del equipo.

## 🔗 Dependencias

- SPEC-001 (Lead Management) — la cotización cuelga de un Lead existente
- Definir librería de generación de PDF antes de estimar esfuerzo

## ⚠️ Riesgos

Ver SPEC-006 §10 — especial atención al riesgo de descuentos sin control (mitigado con `audit_logs`, ya existente en el backend).

## 📆 Historial de Cambios

| Fecha | Estado | Cambio | Responsable |
|---|---|---|---|
| 2026-09-05 | BACKLOG | Creación — implementa SPEC-006 (gap total 6.5) | Technical Lead |
