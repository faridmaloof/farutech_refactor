# TASK-000C — Decisión: Intranet Necesidad

**Fase:** FASE 3  
**Estado:** ⬜ BACKLOG  
**Prioridad:** 🟡 HIGH  
**Responsable:** Software Architect / Technical Lead  
**Fecha Creación:** 2024-09-04  
**Última Actualización:** 2024-09-04  

---

## 🎯 Objetivo

Determinar si la aplicación `apps/intranet/` debe mantenerse como aplicación independiente, fusionarse con Admin, eliminarse, o implementarse como módulo de Website, basándose en casos de uso reales y justificación técnica (no suposiciones).

---

## 📋 Dependencias

| ID Tarea | Nombre | Estado Requerido |
|----------|--------|------------------|
| TASK-000A | Aprobación Auditoría | DONE |

---

## 📂 Archivos Afectados

### Posibles Modificados (dependiendo de la decisión)
- `apps/intranet/src/` — Podría eliminarse o rellenarse
- `apps/admin/src/` — Podría absorber funcionalidades de intranet
- `apps/website/src/` — Podría tener módulo interno para empleados

### Posibles Nuevos
- `docs/adr/ADR-XXX_intranet_strategy.md` — Decisión arquitectónica documentada
- `docs/specifications/SPEC-XXX_intranet_features.md` — Si se decide implementar

### Posibles Eliminados
- `apps/intranet/` — Completo (si se decide eliminar)

---

## ✅ Criterios de Aceptación

- [ ] Casos de uso de Intranet documentados explícitamente
- [ ] Usuarios objetivo identificados (empleados, contractors, partners)
- [ ] Funcionalidades específicas requeridas listadas
- [ ] Análisis de superposición con Admin completado
- [ ] Análisis de superposición con Website completado
- [ ] Decisión documentada formalmente en un ADR
- [ ] Plan de acción definido (implementar, fusionar, o eliminar)

---

## 🧪 Pruebas Requeridas

### Validaciones de Documento
- [ ] ADR sigue formato establecido
- [ ] Casos de uso validados con stakeholders (si existen)
- [ ] Alternativas evaluadas objetivamente
- [ ] Impacto técnico y operativo cuantificado

---

## 🔍 Validaciones Obligatorias

Antes de marcar como DONE, verificar:

- [ ] **Auditoría de Código:** `apps/intranet/` inspeccionado completamente
- [ ] **Documentación Existente:** Todos los docs que mencionan "intranet" revisados
- [ ] **Requerimientos:** Documentos de requerimientos auditados para menciones de intranet
- [ ] **Superposición:** Features de Admin vs Intranet comparadas explícitamente
- [ ] **Seguridad:** Modelo de permisos para usuarios internos vs externos analizado
- [ ] **Documentación:** ADR creado con decisión fundamentada

---

## 📄 Documentación a Actualizar

- [ ] `docs/adr/ADR-XXX_intranet_strategy.md` — Nueva decisión arquitectónica
- [ ] `IMPLEMENTATION_GUIDE.md` — Sección de decisiones pendientes actualizada
- [ ] `docs/tracking/MASTER_TRACKING.md` — Estado de esta tarea actualizado
- [ ] `docs/04_APPLICATIONS.md` — Lista de aplicaciones (si cambia)
- [ ] `README.md` — Si se elimina o agrega aplicación

---

## ⚠️ Riesgos Conocidos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Eliminar intranet y descubrir necesidad posterior | Media | Alto | Documentar explícitamente qué NO se va a implementar |
| Mantener intranet sin justificación clara | Alta | Medio | Establecer revisión trimestral de uso real |
| Duplicar funcionalidades entre Admin e Intranet | Alta si se mantiene separado | Alto | Definir límites claros de responsabilidad |
| Confusión de usuarios entre Admin y Intranet | Media si coexisten | Medio | UX claramente diferenciada, dominios distintos |

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
- [apps/intranet/](../../../apps/intranet/) — Código a auditar
- [apps/admin/](../../../apps/admin/) — Comparación requerida
- [Formato ADR](../11_ARCHITECTURE_DECISION_RECORDS.md) — Referencia de formato

---

## 📝 DETALLES DE LA DECISIÓN REQUERIDA

### Problema

Existe un directorio `apps/intranet/src/` que según auditoría contiene solo scaffold vacío, pero no hay decisión documentada sobre:

1. **¿Para quién es?** — ¿Empleados? ¿Contractors? ¿Partners?
2. **¿Qué funcionalidades tiene?** — ¿Diferentes a Admin?
3. **¿Por qué separada?** — ¿No podría ser parte de Admin o Website?
4. **¿Cuándo se usa?** — ¿Casos de uso específicos no cubiertos por otras apps?

### Alternativas

#### Alternativa A: Eliminar Intranet (Recomendada si no hay casos de uso claros)

**Descripción:** Eliminar completamente `apps/intranet/` y consolidar todas las funcionalidades internas en Admin.

**Ventajas:**
- Reduce complejidad del ecosistema (una app menos que mantener)
- Evita duplicación de funcionalidades
- Clarifica que Admin es para usuarios internos
- Reduce costos de infraestructura y deployment
- Simplifica autenticación y autorización (un solo sistema)

**Desventajas:**
- Si surge necesidad futura de intranet, habría que recrearla
- Puede haber resistencia de stakeholders que "siempre han tenido intranet"

**Impacto Técnico:**
- Eliminar `apps/intranet/` completo (~archivos por determinar)
- Actualizar documentación que mencione intranet
- Actualizar Docker Compose si hay servicios específicos
- Actualizar HAProxy config si hay routing específico

#### Alternativa B: Mantener como Aplicación Independiente

**Descripción:** Implementar `apps/intranet/` como aplicación separada con propósito específico.

**Requisitos para esta alternativa:**
- Definir casos de uso EXPLÍCITOS que justifiquen aplicación separada
- Definir usuarios objetivo (diferentes a Admin)
- Definir funcionalidades únicas (no presentes en Admin)
- Justificar dominio separado (intranet.domain vs admin.domain)

**Ventajas:**
- Aislamiento completo de funcionalidades
- Puede tener modelo de seguridad independiente
- Escalabilidad independiente
- Claridad de propósito si está bien definida

**Desventajas:**
- Mayor complejidad operativa (otra app que deployar, monitorear, mantener)
- Posible duplicación de componentes con Admin
- Mayor superficie de ataque
- Más certificados SSL, más configuración de dominios

**Impacto Técnico:**
- Implementar features completos de intranet
- Configurar dominio/subdominio separado
- Implementar autenticación específica
- Crear tests E2E específicos
- Documentar casos de uso exhaustivamente

#### Alternativa C: Fusionar con Admin como Módulo

**Descripción:** Mover funcionalidades de intranet dentro de Admin bajo rutas `/intranet/*`.

**Ventajas:**
- Mantiene separación lógica de funcionalidades
- Comparte infraestructura de Admin
- Unifica autenticación y autorización
- Menor complejidad que aplicación separada

**Desventajas:**
- Puede mezclar conceptos (admin vs empleado)
- Requiere refactor de Admin para aceptar módulos

**Impacto Técnico:**
- Implementar como feature/module dentro de Admin
- Routing: `admin.domain/intranet/*`
- Compartir componentes de Design System
- Unificar permisos y roles

#### Alternativa D: Módulo de Website con Acceso Restringido

**Descripción:** Implementar como sección protegida del Website público.

**Ventajas:**
- Aprovecha infraestructura existente de Website
- Simple de implementar técnicamente

**Desventajas:**
- Mezcla contenido público con privado (riesgo de seguridad)
- Confusión arquitectónica
- No recomendado por principios de separación de responsabilidades

**Impacto Técnico:**
- Implementar middleware de autenticación en Website
- Routes protegidas bajo `website.com/intranet/*`
- Separar layouts público vs interno

### Recomendación Preliminar

**Alternativa A (Eliminar)** — A MENOS QUE se identifiquen casos de uso específicos y válidos que justifiquen una aplicación separada.

**Justificación:**
1. **Principio de Mínima Complejidad:** No crear aplicaciones sin justificación técnica clara
2. **Auditado:** `apps/intranet/` está vacío, no hay inversión significativa que proteger
3. **Admin Existe:** Ya hay una aplicación para gestión interna (Admin)
4. **Sin Requerimientos:** No hay documentación de casos de uso específicos de intranet
5. **Costo Operativo:** Una app menos que mantener, desplegar, monitorear

### Casos de Uso que PODRÍAN Justificar Intranet Separada

Si existe ALGUNO de estos casos, reconsiderar Alternativa B:

- [ ] Portal de empleados con funcionalidades HR específicas (vacaciones, nómina, beneficios)
- [ ] Acceso para contractors con permisos muy diferentes a admin
- [ ] Contenido interno masivo diferente al contenido público del website
- [ ] Flujos de trabajo internos complejos no relacionados con administración del sistema
- [ ] Requisitos de compliance que exigen aislamiento físico/lógico completo
- [ ] Integraciones con sistemas internos de la empresa no accesibles desde internet

### Preguntas a Responder Antes de Decidir

1. **¿Quiénes son los usuarios de Intranet?** (nombres, roles, cantidad estimada)
2. **¿Qué funcionalidades específicas necesitan?** (lista concreta)
3. **¿Por qué esas funcionalidades no pueden estar en Admin?**
4. **¿Hay requisitos de seguridad que exijan aislamiento?**
5. **¿Hay integraciones con sistemas internos?**
6. **¿Cuál es el volumen esperado de usuarios concurrentes?**
7. **¿Hay deadlines o eventos que dependan de esta funcionalidad?**

### Evidencia Requerida Antes de Decidir

- [ ] Entrevistar stakeholders sobre necesidad real de intranet
- [ ] Revisar documentación de requerimientos originales
- [ ] Auditar `apps/intranet/` para ver si hay código no documentado
- [ ] Buscar menciones de "intranet" en todos los documentos
- [ ] Comparar features planeadas para Admin vs Intranet
- [ ] Evaluar modelos de autenticación/autorización requeridos

---

## 📊 EVIDENCIA PENDIENTE

[PENDIENTE — AUDITORÍA]
- Se requiere inspección completa de `apps/intranet/`

[PENDIENTE — STAKEHOLDERS]
- Se requiere validar casos de uso con Product Owner / Stakeholders

[PENDIENTE — DOCUMENTACIÓN]
- Se requiere revisar todos los docs que mencionan "intranet"

---

## 🎯 CRITERIO DE DECISIÓN FINAL

**Se recomienda ELIMINAR intranet a MENOS QUE:**

✅ Exista al menos UN caso de uso válido y específico  
✅ Que NO pueda ser cubierto por Admin  
✅ Con usuarios claramente identificados  
✅ Y funcionalidades concretas definidas  

**Si no se cumple lo anterior → Alternativa A (Eliminar)**

---

**Nota:** Esta tarea NO se considera DONE hasta que la decisión esté documentada en un ADR, aprobada por el Technical Lead y stakeholders, y el plan de acción (eliminar o implementar) esté definido.

⏸️ **Esperando inicio de FASE 3 para comenzar**
