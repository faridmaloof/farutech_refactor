# TASK-013 — Corregir Referencia Rota en Framework.Automation.sln

**Fase:** FASE 14 — Corrección de Deuda Técnica (Auditoría 2026-09)
**Estado:** ⬜ BACKLOG
**Prioridad:** 🔴 CRÍTICO (bloquea `dotnet build` documentado como Quick Start)
**Responsable:** DevOps / QA Lead
**Fecha Creación:** 2026-09-05

---

## 🎯 Objetivo

Corregir la ruta de proyecto rota en `Framework.Automation.sln` (raíz del repo), que referencia `tests\framework-automation\src\Framework.Core\Framework.Core.csproj` cuando la ubicación real es `packages\framework-automation\src\Framework.Core\Framework.Core.csproj`.

## 📋 Evidencia (Auditoría)

```
$ grep "Framework.Core" Framework.Automation.sln
Project("...") = "Framework.Core", "tests\framework-automation\src\Framework.Core\Framework.Core.csproj", "..."

$ ls tests/framework-automation/src/Framework.Core/Framework.Core.csproj
# No existe

$ ls packages/framework-automation/src/Framework.Core/Framework.Core.csproj
# Existe
```

`dotnet build Framework.Automation.sln` falla hoy con esta referencia sin corregir.

## ✅ Criterios de Aceptación

- [ ] `Framework.Automation.sln` referencia `packages\framework-automation\src\Framework.Core\Framework.Core.csproj`
- [ ] `dotnet build Framework.Automation.sln` compila sin errores
- [ ] `dotnet test Framework.Automation.sln` ejecuta los 4 proyectos de test (`Farutech.Api.Tests` → renombrar según TASK-014, `Farutech.Website.Tests`, `Farutech.Admin.Tests`, `Farutech.Intranet.Tests`) sin errores de referencia
- [ ] Revisar si existen otras rutas rotas en el `.sln` (verificar cada `Project(...)` contra el filesystem real, no asumir)

## ⚠️ Nota de Coordinación

Ejecutar **después** de TASK-014 (consolidación de `apps/api`), ya que esa migración también modifica las rutas de `Farutech.Api.Tests` dentro del mismo `.sln`. Hacerlo en un solo cambio evita tocar el archivo dos veces.

## 🔗 Referencias

- `Examples/tests/framework-automation/` — copia de referencia del framework, no requiere corrección (es material de ejemplo, no se ejecuta)

## 📆 Historial de Cambios

| Fecha | Estado | Cambio | Responsable |
|---|---|---|---|
| 2026-09-05 | BACKLOG | Creación tras hallazgo de auditoría | Technical Lead |
