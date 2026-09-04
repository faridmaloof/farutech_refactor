# TASK-000D — Decisión: Multi-Database Strategy

**Fase:** FASE 3  
**Estado:** ✅ DONE  
**Prioridad:** 🟡 HIGH  
**Responsable:** Software Architect / DevOps Lead  
**Fecha Creación:** 2024-09-04  
**Última Actualización:** 2024-09-04  
**Fecha Completado:** 2024-09-04  

---

## 🎯 Objetivo

Determinar la estrategia óptima de bases de datos para el ecosistema Farutech, evaluando si se debe mantener la arquitectura actual de 3 motores (MySQL + PostgreSQL + MongoDB) o consolidar en una solución más simple que reduzca complejidad operativa y costos.

**Resultado:** ✅ **DECISIÓN TOMADA** — Alternativa D: PostgreSQL único + Redis

---

## 📋 Dependencias

| ID Tarea | Nombre | Estado Requerido |
|----------|--------|------------------|
| TASK-000A | Aprobación Auditoría | ✅ DONE |

---

## 📂 Archivos Afectados

### Modificados (por decisión)
- `infrastructure/docker-compose.yml` — Servicios de base de datos (pendiente implementación)
- `.env.*` — Variables de conexión a bases de datos (pendiente implementación)
- `apps/api/src/backend/config/database.php` — Configuración de conexiones (pendiente implementación)

### Nuevos
- [x] `docs/adr/ADR-004_multi_database_strategy.md` — Decisión arquitectónica documentada

### Eliminados (pendiente implementación)
- Servicios MySQL y MongoDB de Docker Compose
- Configuraciones de conexiones múltiples

---

## ✅ Criterios de Aceptación

- [x] Uso actual de cada base de datos documentado explícitamente
- [x] Justificación técnica para cada motor evaluada
- [x] Análisis de costos operativos cuantificado
- [x] Análisis de complejidad de mantenimiento completado
- [x] Alternativas evaluadas objetivamente con pros/contras
- [x] Decisión documentada formalmente en un ADR
- [x] Plan de migración definido (ver ADR-004)
- [x] Impacto en aplicaciones evaluado

---

## 🧪 Pruebas Requeridas

### Validaciones de Documento
- [x] ADR sigue formato establecido
- [x] Datos de uso real de cada BD documentados
- [x] Costos estimados (tiempo, infraestructura, mantenimiento)
- [x] Alternativas evaluadas con criterios objetivos

### Pruebas Técnicas (pendientes de implementación)
- [ ] Tests de integración con nueva configuración de BD
- [ ] Migración de datos probada en ambiente controlado
- [ ] Rollback plan probado
- [ ] Performance tests comparativos

---

## 🔍 Validaciones Obligatorias

- [x] **Auditoría de Código:** Todas las conexiones a BD identificadas
- [x] **Uso Real:** Qué tablas/colecciones existen actualmente en cada BD
- [x] **Justificación:** Por qué se eligió cada motor originalmente
- [x] **Documentación:** Todos los docs que mencionan bases de datos revisados
- [x] **Infraestructura:** Docker Compose y configs auditadas
- [x] **Impacto:** Apps afectadas por cambio identificadas
- [x] **Documentación:** ADR-004 creado con decisión fundamentada

---

## 📄 Documentación a Actualizar

- [x] `docs/adr/ADR-004_multi_database_strategy.md` — Nueva decisión arquitectónica
- [x] `docs/tracking/MASTER_TRACKING.md` — Estado de esta tarea actualizado
- [ ] `docs/06_DATABASE.md` — Pendiente implementación
- [ ] `infrastructure/README.md` — Pendiente implementación
- [ ] `README.md` — Pendiente implementación

---

## ⚠️ Riesgos Conocidos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Pérdida de datos durante migración | Media si hay consolidación | CRÍTICO | Backup completo antes de migrar, migración en ambiente controlado |
| Downtime extendido durante migración | Media si hay consolidación | Alto | Plan de migración paso a paso, ventana de mantenimiento definida |
| Performance degradation después del cambio | Media | Alto | Performance tests antes y después, rollback plan listo |
| Complejidad de migración subestimada | Alta | Medio | Auditoría detallada de datos actuales antes de decidir |
| Resistencia al cambio técnico | Media | Medio | Presentar datos objetivos de costos y beneficios |

---

## 🚧 Bloqueos Actuales

Ninguno — Decisión tomada y documentada. Implementación pendiente de planificación en fases siguientes.

---

## 📆 Historial de Cambios

| Fecha | Estado Anterior | Estado Nuevo | Cambio | Responsable |
|-------|-----------------|--------------|--------|-------------|
| 2024-09-04 | BACKLOG | IN_PROGRESS | Auditoría completada, alternativas evaluadas | Architect |
| 2024-09-04 | IN_PROGRESS | DONE | ADR-004 creado, decisión documentada | Architect |

---

## 🔗 Enlaces Relacionados

- [MASTER_TRACKING.md](./MASTER_TRACKING.md)
- [ADR-004](../../adr/ADR-004_multi_database_strategy.md) — Decisión final
- [infrastructure/docker-compose.yml](../../../infrastructure/docker-compose.yml) — Configuración actual
- [Formato ADR](../11_ARCHITECTURE_DECISION_RECORDS.md) — Referencia de formato

---

## 📝 DECISIÓN FINAL

### Problema Resuelto

La infraestructura actual define 3 motores de base de datos (MySQL + PostgreSQL + MongoDB), pero:
- MongoDB NO está implementado en el código backend
- No hay justificación técnica sólida para mantener 3 motores
- La complejidad operativa es alta innecesariamente

### Alternativa Seleccionada: **Alternativa D — PostgreSQL Único + Redis**

**Arquitectura Resultante:**
```yaml
services:
  postgresql-primary:  # PostgreSQL 17 — TODAS las bases de datos
    databases:
      - farutech_website   # Antes en MySQL
      - farutech_apps      # Transaccional (ya estaba aquí)
      - farutech_logs      # Antes en MongoDB (como tablas JSONB)
  redis:  # Se mantiene para colas y caché
```

### Justificación

1. **Principio de simplicidad:** Un solo motor de persistencia reduce complejidad operativa y de desarrollo
2. **Capacidad técnica:** PostgreSQL 17 puede manejar todos los casos de uso actuales
3. **Consistencia con el código:** El backend actual NO tiene implementación de MongoDB
4. **Optimización de inodes:** Menos contenedores, menos volúmenes, menos configuración
5. **Costo:** Menor consumo de recursos en desarrollo y producción

### Casos de Uso Asignados

| Caso de Uso | Motor | Justificación |
|-------------|-------|---------------|
| Usuarios, autenticación, tokens | PostgreSQL | Transaccional, ACID |
| Leads, interacciones, notas | PostgreSQL | Transaccional, relaciones complejas |
| Blog posts, categorías | PostgreSQL | Contenido con relaciones |
| Newsletter subscribers, campañas | PostgreSQL | Transaccional + analytics |
| Settings, configuración | PostgreSQL | Clave-valor relacional |
| Logs de auditoría | PostgreSQL (JSONB) | Flexibilidad + queries ocasionales |
| Caché | Redis | Alto rendimiento, TTL nativo |
| Colas (Jobs) | Redis | Laravel Queue driver |
| Sesiones | Redis | Alto rendimiento, expiración |

### Plan de Migración (Detallado en ADR-004)

1. **Fase 1:** Preparación (backup, auditoría de migraciones)
2. **Fase 2:** Infraestructura (modificar docker-compose)
3. **Fase 3:** Backend Configuration (actualizar .env y config/database.php)
4. **Fase 4:** Migraciones (ajustar sintaxis MySQL → PostgreSQL)
5. **Fase 5:** Testing (validar toda la funcionalidad)
6. **Fase 6:** Documentación (actualizar todos los documentos)

### Métricas de Éxito

- [ ] Docker-compose levanta solo PostgreSQL + Redis
- [ ] Backend se conecta exitosamente a PostgreSQL
- [ ] Todas las migraciones se ejecutan sin errores
- [ ] Tests de integración pasan
- [ ] Logs de auditoría se guardan en PostgreSQL (tabla `audit_logs`)
- [ ] Documentación actualizada refleja arquitectura simplificada

---

## ✅ EVIDENCIA DE COMPLETADO

[VERIFICADO — DOCUMENTO]
- ADR-004 creado en `docs/adr/ADR-004_multi_database_strategy.md`
- Análisis exhaustivo de 4 alternativas documentadas
- Plan de migración detallado en 6 fases
- Justificación técnica basada en principios de simplicidad y consistencia con código real

[VERIFICADO — AUDITORÍA]
- `infrastructure/docker-compose.yml` auditado → 3 motores identificados
- `apps/api/src/backend/.env.example` auditado → Conexiones MySQL, PostgreSQL, MongoDB definidas
- `apps/api/src/backend/config/database.php` auditado → Solo MySQL y PostgreSQL configurados, MongoDB NO implementado
- `apps/api/src/backend/composer.json` auditado → Driver MongoDB NO presente

[INFERENCIA — CÓDIGO]
- MongoDB está en infraestructura pero no en código → Decision histórica no justificada
- Consolidar en PostgreSQL reduce complejidad sin pérdida de funcionalidad

---

**Nota:** La IMPLEMENTACIÓN de esta decisión será planificada en fases posteriores (FASE 8+). Esta tarea de DECISIÓN está completa porque la alternativa fue seleccionada, justificada y documentada formalmente.

