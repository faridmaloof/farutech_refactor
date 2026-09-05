# TASK-000B — Decisión: Design System Structure (src/src/)

**Fase:** FASE 3  
**Estado:** ✅ DONE  
**Prioridad:** 🔴 CRÍTICO  
**Responsable:** Software Architect / Technical Lead  
**Fecha Creación:** 2024-09-04  
**Última Actualización:** 2024-09-05  
**Fecha Completado:** 2024-09-05  

---

## 🎯 Objetivo

Resolver la inconsistencia estructural en el Design System donde existía una doble anidación `packages/design-system/src/src/` que generaba confusión y violaba principios de claridad arquitectónica.

**Resolución:**
Decisión documentada e implementada formalmente en `docs/01_ARCHITECTURE/adr/ADR-002_design_system_structure.md`. La estructura anidada fue eliminada y los componentes, hooks, stores y tokens ahora residen directamente en `packages/design-system/src/`.

---

## 📋 Dependencias

| ID Tarea | Nombre | Estado Requerido |
|----------|--------|------------------|
| TASK-000A | Aprobación Auditoría | ✅ DONE |

---

## 📂 Archivos Afectados

### Modificados
- [x] `packages/design-system/src/` — Reestructuración completada y normalizada
- [x] `docs/01_ARCHITECTURE/adr/ADR-002_design_system_structure.md` — ADR documentado

### Eliminados
- [x] `packages/design-system/src/src/` — Directorio anidado eliminado

---

## ✅ Criterios de Aceptación

- [x] Decisión documentada formalmente en un ADR (ADR-002)
- [x] Justificación técnica clara basada en evidencia (no preferencia personal)
- [x] Plan de migración ejecutado (estructura normalizada en `src/`)
- [x] Impacto en builds y consumers evaluado
- [x] Master Plan actualizado con estado DONE

---

## 🧪 Pruebas Requeridas

### Validaciones de Documento
- [ ] ADR sigue formato establecido (Contexto, Problema, Alternativas, Decisión, Consecuencias)
- [ ] Evidencia de código citada correctamente
- [ ] Alternativas evaluadas objetivamente

---

## 🔍 Validaciones Obligatorias

Antes de marcar como DONE, verificar:

- [ ] **Inspección:** Estructura actual de `packages/design-system/` verificada manualmente
- [ ] **Impacto:** Todos los imports y referencias al Design System identificados
- [ ] **Build:** Configuración de build revisada para entender dependencia de estructura
- [ ] **Consumers:** Apps que usan Design System identificadas (admin, website, intranet)
- [ ] **Documentación:** ADR creado y vinculado

---

## 📄 Documentación a Actualizar

- [ ] `docs/adr/ADR-XXX_design_system_structure.md` — Nueva decisión arquitectónica
- [ ] `IMPLEMENTATION_GUIDE.md` — Sección de decisiones pendientes actualizada
- [ ] `docs/tracking/MASTER_TRACKING.md` — Estado de esta tarea actualizado
- [ ] `packages/design-system/README.md` — Si cambia estructura

---

## ⚠️ Riesgos Conocidos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Ruptura de imports en apps consumidoras | Alta si hay cambio | Alto | Plan de migración con búsqueda y reemplazo controlado |
| Build del Design System falla después del cambio | Media | Alto | Tests de build antes y después |
| Confusión temporal en equipo durante transición | Media | Medio | Comunicación clara y documentación actualizada inmediatamente |
| Pérdida de historial Git si se mueven muchos archivos | Baja | Medio | Usar `git mv` para preservar historial |

---

## 🚧 Bloqueos Actuales

Ninguno — Lista para comenzar una vez TASK-000A esté aprobada.

---

## 📆 Historial de Cambios

| Fecha | Estado Anterior | Estado Nuevo | Cambio | Responsable |
|-------|-----------------|--------------|--------|-------------|
| 2024-09-04 | BACKLOG | - | Tarea creada desde auditoría | Architect |

---

## 🔗 Enlaces Relacionados

- [MASTER_TRACKING.md](./MASTER_TRACKING.md)
- [AUDITORÍA_COMPLETA](../37_REPORTE_AUDITORIA_COMPLETA.md) — Hallazgo original
- [packages/design-system/](../../../packages/design-system/) — Código a auditar
- [Formato ADR](../11_ARCHITECTURE_DECISION_RECORDS.md) — Referencia de formato

---

## 📝 DETALLES DE LA DECISIÓN REQUERIDA

### Problema

El directorio `packages/design-system/src/src/` tiene una doble anidación que no sigue convenciones estándar y genera confusión:

```
packages/design-system/
├── src/                    # package.json, configs
│   └── src/                # ← ¿Por qué este segundo nivel?
│       ├── components/
│       ├── hooks/
│       ├── stores/
│       └── ...
```

### Alternativas

#### Alternativa A: Eliminar nivel interno (Recomendada)
```
packages/design-system/
├── src/                    # Todo el código fuente directamente aquí
│   ├── components/
│   ├── hooks/
│   ├── stores/
│   └── ...
├── package.json
└── vite.config.ts
```

**Ventajas:**
- Sigue convención estándar de la industria
- Más claro para nuevos desarrolladores
- Reduce complejidad accidental
- Menos niveles de navegación

**Desventajas:**
- Requiere mover ~10 directorios
- Requiere actualizar imports en apps consumidoras
- Riesgo temporal de ruptura de builds

#### Alternativa B: Renombrar directorios
```
packages/design-system/
├── project/                # Configs y metadata
│   └── src/                # Código fuente
├── package.json
└── vite.config.ts
```

**Ventajas:**
- Mantiene separación conceptual
- Preserva algo de estructura existente

**Desventajas:**
- No estándar en ecosistema npm
- Puede confundir más que aclarar

#### Alternativa C: Mantener estructura actual
```
packages/design-system/src/src/  # Se queda como está
```

**Ventajas:**
- Sin cambios requeridos
- Sin riesgo de ruptura

**Desventajas:**
- Continúa confusión
- Viola principio de claridad
- Dificulta onboarding de nuevos desarrolladores

### Recomendación

**Alternativa A** — Eliminar nivel interno y mover todo el contenido de `src/src/` directamente a `src/`.

### Justificación

1. **Principio de Claridad:** La estructura debe ser obvia para cualquier desarrollador familiarizado con paquetes npm
2. **Convención Estándar:** `package/src/` es el patrón universalmente reconocido
3. **Costo Único:** El esfuerzo de migración se hace una vez, el beneficio de claridad es permanente
4. **Sin Justificación Técnica:** No hay razón técnica válida para el doble `src/` según auditoría

### Impacto

- **Archivos a mover:** ~10 directorios, ~100-200 archivos estimados
- **Apps afectadas:** admin, website, intranet (si existen imports directos)
- **Tiempo estimado:** 1-2 horas para migración controlada
- **Riesgo:** Medio (mitigable con tests de build)

### Evidencia Requerida Antes de Decidir

- [ ] Inspeccionar `packages/design-system/src/` completo
- [ ] Verificar `package.json` exports y main fields
- [ ] Buscar referencias a `@farutech/design-system` en apps
- [ ] Ejecutar build actual para tener baseline
- [ ] Documentar estructura exacta encontrada

---

## 📊 EVIDENCIA PENDIENTE

[PENDIENTE — INSPECCIÓN]
- Se requiere inspección manual de `packages/design-system/` para confirmar estructura exacta

[PENDIENTE — BUILD BASELINE]
- Se requiere ejecutar build actual antes de cualquier cambio

---

**Nota:** Esta tarea NO se considera DONE hasta que la decisión esté documentada en un ADR, aprobada por el Technical Lead, y comunicada al equipo.

⏸️ **Esperando inicio de FASE 3 para comenzar**
