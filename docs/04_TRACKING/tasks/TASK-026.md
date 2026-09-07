# TASK-026 — Auditoría Formal de Performance, Accesibilidad y SEO (Lighthouse)

**Fase:** FASE 15 — Cierre de Brechas Funcionales
**Estado:** ⬜ BACKLOG
**Prioridad:** 🟡 HIGH
**Responsable:** Frontend Lead (Website + Admin)
**Fecha Creación:** 2026-09-05
**Relacionado:** Requisitos 2, 3 y 5 de la definición de producto

---

## 🎯 Objetivo

Todas las specs (SPEC-001 a SPEC-006) definen criterios de aceptación tipo "Lighthouse Performance > 90, Accessibility > 95" pero la auditoría confirmó que **nunca se ha ejecutado una auditoría Lighthouse real** — son checkboxes de intención, no resultados verificados. Esta tarea cierra esa brecha de forma transversal a todo el sitio (no por módulo aislado).

## 📋 Alcance

- [ ] Ejecutar Lighthouse CI (o equivalente) sobre las rutas principales del website público: Home, Hub de Servicios, cada landing de servicio, Blog, Casos de Éxito, Nosotros
- [ ] Ejecutar Lighthouse sobre el Admin Panel bajo `/admin` (tras TASK-015) en sus vistas principales: Login, Dashboard, Leads, Newsletter, Blog, Cotizaciones
- [ ] Documentar resultados reales (no proyectados) en una tabla dentro de este archivo
- [ ] Para cualquier puntaje por debajo del umbral definido en la spec correspondiente, crear una sub-tarea puntual de optimización (no una tarea genérica "mejorar performance")
- [ ] Integrar Lighthouse CI al pipeline (si existe CI/CD activo) para que la regresión de performance/accesibilidad se detecte automáticamente en cada PR, no solo en auditorías manuales puntuales

## ✅ Criterios de Aceptación

- [ ] CA001: Reporte real de Lighthouse (no proyectado) para las 7+ rutas del website público
- [ ] CA002: Reporte real de Lighthouse para las vistas principales del Admin Panel
- [ ] CA003: Todo puntaje por debajo del umbral tiene una sub-tarea de remediación registrada
- [ ] CA004: Lighthouse CI (o equivalente) corriendo en el pipeline, si existe

## 🔗 Referencias

- Ejecutar después de TASK-015 (admin bajo `/admin`) y TASK-023 (JSON-LD), ya que ambos afectan directamente los puntajes de SEO/Performance que esta auditoría debe medir de forma definitiva

## 📆 Historial de Cambios

| Fecha | Estado | Cambio | Responsable |
|---|---|---|---|
| 2026-09-05 | BACKLOG | Creación tras hallazgo de auditoría (criterios de aceptación nunca verificados) | Technical Lead |
