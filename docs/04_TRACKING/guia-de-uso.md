# 📖 Guía de Uso del Sistema de Tracking — Farutech

**Propósito:** Definir el estándar para la gestión, actualización y seguimiento de tareas en el ecosistema Farutech.

---

## 🏷️ Ciclo de Vida de una Tarea

Cada tarea pasa por los siguientes estados:

```
[ ⬜ BACKLOG ] ──> [ 🔄 READY ] ──> [ ⏳ IN PROGRESS ] ──> [ 🧪 TESTING ] ──> [ ✅ DONE ]
                                           │
                                           └──> [ ⏸️ BLOCKED ]
```

1. **⬜ BACKLOG**: Tarea identificada y priorizada, pendiente de dependencias o asignación.
2. **🔄 READY**: Todas las dependencias están cumplidas (DONE), criterios de aceptación claros, lista para implementar.
3. **⏳ IN PROGRESS**: El desarrollador está trabajando activamente en los entregables.
4. **⏸️ BLOCKED**: Bloqueada por una decisión de arquitectura, PO o bug crítico externo.
5. **🧪 TESTING**: Código completado, en proceso de validación (tests unitarios/E2E/build sin warnings).
6. **✅ DONE**: Criterios de aceptación verificados, build exitoso (`npm run build`), documentación actualizada.

---

## 📋 Reglas de Oro

1. **No suponer ni inventar:** Cada cambio debe tener justificación en un requerimiento (SPEC), decisión (ADR) o reporte de auditoría verificado.
2. **Verificación continua de build:** Todo cambio de código debe compilar con `npm run build` sin errores ni warnings.
3. **Actualización en cascada:** Al completar una tarea:
   - Actualizar el archivo de la tarea (`docs/04_TRACKING/tasks/TASK-XXX.md`).
   - Actualizar el `master-plan.md` y registrar el hito en `CHANGELOG.md`.
   - Validar que las tareas dependientes pasen de `BACKLOG` a `READY`.
