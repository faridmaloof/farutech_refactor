# 📁 Directorio de Tracking — Farutech

Este directorio contiene el **sistema maestro de seguimiento** de todas las tareas de implementación del ecosistema Farutech.

## 📖 Estructura

```
tracking/
├── MASTER_TRACKING.md          # Documento principal con estado consolidado
├── tasks/                       # Detalles individuales de cada tarea
│   ├── TASK-000A.md            # Aprobación Auditoría ✅ DONE
│   ├── TASK-000B.md            # Decisión Design System Structure ⬜ BACKLOG
│   ├── TASK-000C.md            # Decisión Intranet Necesidad ⬜ BACKLOG
│   ├── TASK-000D.md            # Decisión Multi-Database Strategy ⬜ BACKLOG
│   ├── TASK-001.md             # Normalizar estructura Design System ⬜ BACKLOG
│   └── ...                     # Más tareas según avance el proyecto
├── sprints/                     # Agrupación opcional por sprints
│   └── .gitkeep
├── metrics/                     # Métricas de avance y calidad
│   └── .gitkeep
└── change-log/                  # Registro de cambios al tracking
    └── CHANGELOG.md
```

## 🎯 Propósito

Este sistema de tracking garantiza que:

1. **Cada tarea tenga criterios de aceptación claros** — No hay ambigüedad sobre qué significa "terminado"
2. **Las pruebas sean obligatorias** — Ninguna tarea se marca DONE sin tests pasando
3. **La documentación se mantenga actualizada** — Cada cambio deja rastro documental
4. **Las dependencias sean explícitas** — Se sabe qué bloquea qué
5. **El progreso sea medible** — Estado visible en tiempo real

## 🔄 Cómo Usar Este Sistema

### Para Comenzar una Nueva Tarea

1. Verificar que todas las dependencias estén en estado DONE
2. Cambiar estado de BACKLOG → READY en `MASTER_TRACKING.md`
3. Cambiar estado de READY → IN_PROGRESS en `tasks/TASK-XXX.md`
4. Registrar fecha de inicio en "Historial de Cambios"
5. Actualizar `MASTER_TRACKING.md` tabla de estado

### Para Completar una Tarea

1. Implementar solución según criterios de aceptación
2. Ejecutar TODAS las pruebas requeridas (API, Integration, E2E, Unit)
3. Ejecutar validaciones obligatorias (lint, typecheck, build)
4. Actualizar documentación relacionada
5. Registrar evidencia en `tasks/TASK-XXX.md`
6. Cambiar estado: IN_PROGRESS → REVIEW → TESTING → DONE
7. Actualizar `MASTER_TRACKING.md` con % completado y fecha
8. Crear entrada en `change-log/CHANGELOG.md`

### Para Reportar un Bloqueo

1. Identificar dependencia o decisión pendiente
2. Cambiar estado a BLOCKED
3. Documentar bloqueo en sección "🚧 Bloqueos Actuales"
4. Identificar quién debe resolverlo
5. Actualizar `MASTER_TRACKING.md` columna "Bloqueo"

## 📊 Estados Permitidos

| Estado | Significado | ¿Permite avanzar dependencias? |
|--------|-------------|-------------------------------|
| ⬜ BACKLOG | Definida, no iniciada | ❌ No |
| 🔄 READY | Lista para comenzar | ✅ Sí |
| 🚧 IN_PROGRESS | En desarrollo activo | ❌ No |
| ⏸️ BLOCKED | Bloqueada externamente | ❌ No |
| 👁️ REVIEW | En revisión de código | ❌ No |
| 🧪 TESTING | En validación con pruebas | ❌ No |
| ✅ DONE | Completada, testeada, documentada | ✅ Sí |
| ❌ CANCELLED | Cancelada explícitamente | ❌ No |

## 📝 Formato de Tareas

Cada archivo `tasks/TASK-XXX.md` sigue esta plantilla:

```markdown
# TASK-XXX — Nombre

**Fase:** FASE X
**Estado:** [Estado]
**Prioridad:** [Prioridad]
**Responsable:** [Nombre]
**Fecha Creación:** YYYY-MM-DD
**Última Actualización:** YYYY-MM-DD

## 🎯 Objetivo
...

## 📋 Dependencias
...

## 📂 Archivos Afectados
...

## ✅ Criterios de Aceptación
- [ ] Criterio verificable 1
- [ ] Criterio verificable 2

## 🧪 Pruebas Requeridas
### API Tests
- [ ] ...
### Integration Tests
- [ ] ...
### E2E Tests
- [ ] ...

## 🔍 Validaciones Obligatorias
- [ ] Lint sin errores
- [ ] Type check sin errores
- [ ] Build exitoso
- [ ] Tests passing
- [ ] Documentación actualizada

## 📄 Documentación a Actualizar
- [ ] ...

## ⚠️ Riesgos Conocidos
...

## 🚧 Bloqueos Actuales
...

## 📆 Historial de Cambios
...

## 🔗 Enlaces Relacionados
...

## 📊 Evidencia de Completado
[VERIFICADO — CÓDIGO]
...
```

## 🚦 Gates Entre Fases

El `MASTER_TRACKING.md` define gates obligatorios entre fases. No se puede avanzar a la siguiente fase sin cumplir TODOS los criterios del gate correspondiente.

## 📈 Métricas

El directorio `metrics/` contendrá:

- Velocidad del equipo por sprint
- Cobertura de tests (API, E2E, Unit)
- Tasa de éxito de builds
- Deuda técnica acumulada

## 📞 Responsables

| Rol | Responsable | Contacto |
|-----|-------------|----------|
| Technical Lead | Por asignar | - |
| Architect | Por asignar | - |
| QA Lead | Por asignar | - |

## ⚠️ Reglas de Oro

1. **NUNCA** marcar DONE sin tests passing
2. **SIEMPRE** actualizar tracking al cambiar estado
3. **NUNCA** implementar tareas BLOCKED
4. **SIEMPRE** vincular con SPECs y ADRs
5. **MANTENER** trazabilidad completa

---

**© 2024 Farutech — Sistema de Tracking**  
**Versión:** 1.0  
**Última Actualización:** 2024-09-04
