# ADR-003 — Intranet Strategy

**Fecha:** 2024-09-04  
**Estado:** ✅ DECIDIDO  
**Responsable:** Software Architect / Technical Lead  
**Stakeholders:** Product Owner, Development Team

---

## 📋 Contexto

El ecosistema Farutech contempla la existencia de una aplicación llamada "Intranet" destinada a colaboradores internos. Sin embargo, existe ambigüedad sobre su alcance funcional, diferenciación con Admin, y necesidad real como aplicación independiente.

### Situación Actual

**[VERIFICADO — CÓDIGO]**
- `apps/intranet/src/frontend/` existe con scaffold React+Vite
- Login + Dashboard básicos implementados (2 páginas)
- Tests BDD configurados (.NET + Reqnroll)
- Consume endpoint `/admin/dashboard/stats` del backend

**[VERIFICADO — DOCUMENTACIÓN]**
- Docs 02, 03, 05 mencionan intranet pero indican "alcance TBD"
- Owner no ha definido funcionalidades específicas
- No hay casos de uso concretos documentados
- No hay diferenciación clara vs Admin Panel

**[CONFLICTO]**
- TASK-000C indica "pendiente decisión" pero el código ya tiene scaffold funcional
- Documentación dice "diferido" pero existen tests BDD implementados
- README.md no menciona estado real de Intranet

---

## 🎯 Problema a Resolver

¿Debe Intranet ser:
1. Una aplicación independiente con dominio propio?
2. Un módulo dentro de Admin Panel?
3. Eliminada completamente?

La decisión debe basarse en evidencia técnica y de negocio, no en suposiciones.

---

## 🔍 Análisis de Alternativas

### Alternativa A: Aplicación Independiente (`intranet.farutech.com`)

**Descripción:** Mantener Intranet como aplicación separada con subdominio propio.

**Ventajas:**
- ✅ Aislamiento completo de seguridad y permisos
- ✅ Escalabilidad independiente
- ✅ Deploy separado sin afectar Admin
- ✅ Branding diferenciado (interno vs administrativo)
- ✅ Ya existe scaffold y tests implementados

**Desventajas:**
- ❌ Duplicación de infraestructura (otro contenedor, otro deploy)
- ❌ Complejidad de autenticación cruzada (SSO requerido)
- ❌ Mantenimiento de dos codebases similares
- ❌ Costo adicional de certificados SSL
- ❌ Sin funcionalidades únicas definidas que justifiquen la separación

**Impacto Técnico:**
- Requiere configuración HAProxy para routing `intranet.farutech.local`
- Necesita SSO vía cookie de dominio padre `.farutech.com`
- Duplica esfuerzos de desarrollo de features comunes

**Costo Estimado:** Alto (infraestructura + mantenimiento continuo)

---

### Alternativa B: Módulo de Admin (`admin.farutech.com/intranet`)

**Descripción:** Fusionar Intranet como sección dentro de Admin Panel, accesible por rol.

**Ventajas:**
- ✅ Single codebase (menor mantenimiento)
- ✅ Autenticación unificada (mismo sistema de roles)
- ✅ Infraestructura simplificada (un solo deploy)
- ✅ Componentes y lógica compartidos naturalmente
- ✅ Menor superficie de ataque
- ✅ Experiencia consistente para usuarios con ambos roles

**Desventajas:**
- ❌ Requiere refactor de rutas actuales (`/intranet/*` → `/admin/intranet/*`)
- ❌ Puede haber confusión conceptual (Admin vs Intranet)
- ❌ Menor aislamiento si hay requisitos de seguridad estrictos

**Impacto Técnico:**
- Migrar componentes de `apps/intranet/src/` a `apps/admin/src/features/intranet/`
- Consolidar tests BDD bajo `apps/admin/test/BDD/Features/Intranet/`
- Actualizar HAProxy para eliminar routing de intranet subdomain
- Definir roles: `admin`, `collaborator`, `admin+collaborator`

**Costo Estimado:** Medio (refactor inicial, menor mantenimiento a largo plazo)

---

### Alternativa C: Eliminar Intranet

**Descripción:** Remover completamente la aplicación Intranet, distribuyendo sus funcionalidades entre Admin y Website según corresponda.

**Ventajas:**
- ✅ Máxima simplificación arquitectónica
- ✅ Cero duplicación de código o infraestructura
- ✅ Foco en aplicaciones core (Admin + Website)
- ✅ Menor deuda técnica desde el inicio
- ✅ Ahorro de costos de infraestructura y mantenimiento

**Desventajas:**
- ❌ Pérdida de trabajo ya realizado (scaffold + tests)
- ❌ Posible resistencia de stakeholders si había expectativa de intranet
- ❌ Requiere redefinir casos de uso "internos" en otros contextos

**Impacto Técnico:**
- Eliminar directorio `apps/intranet/`
- Eliminar tests BDD asociados
- Eliminar configuración Docker/HAProxy para intranet
- Documentar decisión y comunicar a stakeholders

**Costo Estimado:** Bajo (eliminación + comunicación)

---

### Alternativa D: Híbrida (Recomendada Condicionalmente)

**Descripción:** Mantener scaffold de Intranet pero CONGELAR implementación hasta que el Product Owner defina casos de uso específicos que NO puedan ser cubiertos por Admin.

**Ventajas:**
- ✅ Preserva inversión existente (scaffold + tests)
- ✅ Evita decisiones prematuras sin información completa
- ✅ Permite continuar con desarrollo de Admin y Website sin bloqueo
- ✅ Establece criterio claro para decisión futura
- ✅ Minimiza riesgo de construir algo innecesario

**Desventajas:**
- ⚠️ Deja ambigüedad temporal (debe ser time-boxed)
- ⚠️ Requiere disciplina para no implementar "por si acaso"

**Impacto Técnico:**
- Documentar estado como "CONGELADO - Pendiente definición de PO"
- Actualizar MASTER_TRACKING.md con estado BLOCKED
- Establecer deadline para decisión (ej: 2 semanas)
- Continuar con otras tareas no bloqueadas

**Costo Estimado:** Mínimo (documentación + seguimiento)

---

## 🏆 Decisión Tomada

**ALTERNATIVA D SELECCIONADA** — Híbrida (Congelar hasta definición de PO)

### Justificación

1. **Evidencia Insuficiente:** No hay casos de uso concretos que justifiquen separación ni fusión
2. **Trabajo Existente:** Ya hay scaffold y tests implementados (no son despreciables)
3. **Sin Bloqueo:** Las tareas críticas (Admin Leads, Opportunity Search) no dependen de esta decisión
4. **Flexibilidad:** Mantiene opciones abiertas hasta tener información completa
5. **Pragmatismo:** Evita pérdida de trabajo pero previene desarrollo innecesario

### Criterios para Descongelar

La decisión se revisará cuando el Product Owner proporcione:

✅ **Lista de usuarios específicos** de Intranet (roles, cantidad, perfiles)  
✅ **Funcionalidades concretas** que necesitan (no genéricas como "ver anuncios")  
✅ **Justificación de por qué** no pueden estar en Admin Panel  
✅ **Requisitos de seguridad/aislamiento** documentados  
✅ **Timeline o eventos** que dependan de estas funcionalidades  

**Si después de 2 semanas no hay respuesta → Alternativa C (Eliminar)**

---

## 📊 Plan de Acción Inmediato

### Fase 1: Congelamiento (Semana 1)

- [x] Documentar esta decisión en ADR-003
- [ ] Actualizar `MASTER_TRACKING.md` con estado BLOCKED para TASK-000C
- [ ] Agregar nota en `README.md` sobre estado de Intranet
- [ ] Comunicar decisión al equipo (evitar trabajo en intranet)
- [ ] Etiquetar issues/tareas relacionadas con "blocked-intranet"

### Fase 2: Seguimiento (Semanas 1-2)

- [ ] Reunión con Product Owner para definir alcance
- [ ] Documentar casos de uso si existen
- [ ] Evaluar si justifican aplicación separada
- [ ] Tomar decisión final (A, B o C)

### Fase 3: Ejecución (Semana 3)

**Si Alternativa A (Independiente):**
- [ ] Definir funcionalidades MVP
- [ ] Priorizar backlog de Intranet
- [ ] Configurar infraestructura completa
- [ ] Comenzar desarrollo de features

**Si Alternativa B (Módulo Admin):**
- [ ] Plan de migración de componentes
- [ ] Refactor de rutas y imports
- [ ] Consolidar tests BDD
- [ ] Actualizar documentación
- [ ] Eliminar configuración subdominio

**Si Alternativa C (Eliminar):**
- [ ] Backup de código útil (si existe)
- [ ] Eliminar `apps/intranet/`
- [ ] Eliminar configuración asociada
- [ ] Actualizar documentación
- [ ] Comunicar oficialmente a stakeholders

---

## 🔗 Dependencias

| ID | Tarea | Estado | Impacto |
|----|-------|--------|---------|
| TASK-000C | Decisión Intranet Necesidad | ✅ DONE (decisión tomada) | Habilita planificación |
| TASK-005 | Admin Leads Page | 🔄 READY | No bloqueada |
| TASK-006 | Admin Opportunity Search | 🔄 READY | No bloqueada |
| TASK-008 | Normalizar Documentación | 🔄 READY | Debe incluir nota sobre Intranet |

---

## ⚠️ Riesgos y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| PO no define alcance en 2 semanas | Alta | Medio | Auto-eliminar (Alternativa C) |
| Equipo trabaja en intranet sin autorización | Media | Alto | Comunicación clara + tags en issues |
| Stakeholders insisten en intranet sin justificación | Media | Medio | Presentar este ADR con análisis de costo/beneficio |
| Pérdida de contexto si se elimina y luego se requiere | Baja | Bajo | Documentar decisión y mantener backup temporal |

---

## 📈 Métricas de Éxito

- [ ] Decisión comunicada a todo el equipo en < 48 horas
- [ ] Cero horas invertidas en Intranet durante congelamiento
- [ ] Respuesta de PO obtenida en ≤ 2 semanas
- [ ] Decisión final ejecutada en ≤ 3 semanas
- [ ] Documentación actualizada reflejando estado real

---

## 📝 Historial de Cambios

| Fecha | Cambio | Responsable |
|-------|--------|-------------|
| 2024-09-04 | Creación de ADR-003 con decisión Alternativa D | Software Architect |
| - | - | - |

---

## 🔗 Referencias

- [TASK-000C](../tracking/tasks/TASK-000C.md) — Tarea de decisión original
- [Docs 02](02_TARGET_DIRECTION_AND_CLARIFICATIONS.md) — Contexto inicial
- [Docs 03](03_CONFIRMED_DECISIONS_AND_NEW_REQUIREMENTS.md) — Decisiones confirmadas
- [Docs 05](05_R09_CONFIRMED_AND_REPOSITORY_TOPOLOGY.md) — Topología de repositorio
- [MASTER_TRACKING](../tracking/MASTER_TRACKING.md) — Estado general del proyecto

---

**© 2024 Farutech — Architectural Decision Record**  
**Estado:** ✅ DECIDIDO (Alternativa D — Congelar hasta definición de PO)  
**Próxima Revisión:** 2024-09-18 (2 semanas desde creación)
