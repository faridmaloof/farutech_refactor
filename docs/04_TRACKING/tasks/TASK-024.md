# TASK-024 — Resolver Estado de `apps/intranet` (Elemento Huérfano)

**Fase:** FASE 14 — Corrección de Deuda Técnica (Auditoría 2026-09)
**Estado:** ⬜ BACKLOG
**Prioridad:** 🟢 MEDIUM
**Responsable:** Technical Lead / Product Owner
**Fecha Creación:** 2026-09-05

---

## 🎯 Objetivo

`apps/intranet` está "congelada" según ADR-003 sin fecha de resolución. Es código presente en el monorepo sin uso activo — exactamente el tipo de elemento huérfano que el requisito 3 pide evitar. Se requiere una decisión explícita: retomar, archivar formalmente fuera de `apps/`, o eliminar.

## 📋 Opciones

1. **Retomar:** si hay un caso de uso vigente, mover a un sprint concreto y sacarla de estado "congelada".
2. **Archivar:** mover el código a `docs/99_ARCHIVE/` (mismo patrón ya usado para auditorías legacy) para dejar de contarla como aplicación activa del monorepo, preservando el código sin que aparezca como huérfano en `apps/`.
3. **Eliminar:** si no hay caso de uso previsible, eliminar del repositorio (el historial de Git preserva el código si se necesita recuperar).

## ✅ Criterio de Aceptación

- [ ] Decisión documentada (actualizar ADR-003 con la resolución final, cualquiera sea)
- [ ] `Framework.Automation.sln` actualizado si se elimina `Farutech.Intranet.Tests`
- [ ] `apps/` ya no contiene código sin propósito activo declarado

## 📆 Historial de Cambios

| Fecha | Estado | Cambio | Responsable |
|---|---|---|---|
| 2026-09-05 | BACKLOG | Creación tras hallazgo de auditoría (gap requisito 3) | Technical Lead |
