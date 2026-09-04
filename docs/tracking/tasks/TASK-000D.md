# TASK-000D — Decisión: Multi-Database Strategy

**Fase:** FASE 3  
**Estado:** ⬜ BACKLOG  
**Prioridad:** 🟡 HIGH  
**Responsable:** Software Architect / DevOps Lead  
**Fecha Creación:** 2024-09-04  
**Última Actualización:** 2024-09-04  

---

## 🎯 Objetivo

Determinar la estrategia óptima de bases de datos para el ecosistema Farutech, evaluando si se debe mantener la arquitectura actual de 3 motores (MySQL + PostgreSQL + MongoDB) o consolidar en una solución más simple que reduzca complejidad operativa y costos.

---

## 📋 Dependencias

| ID Tarea | Nombre | Estado Requerido |
|----------|--------|------------------|
| TASK-000A | Aprobación Auditoría | DONE |

---

## 📂 Archivos Afectados

### Posibles Modificados (dependiendo de la decisión)
- `infrastructure/docker-compose.yml` — Servicios de base de datos
- `.env.*` — Variables de conexión a bases de datos
- `apps/api/src/backend/config/database.php` — Configuración de conexiones
- Migraciones existentes — Posible migración de schema

### Posibles Nuevos
- `docs/adr/ADR-XXX_database_strategy.md` — Decisión arquitectónica documentada
- Scripts de migración de datos (si se consolida)

### Posibles Eliminados
- Servicios de Docker no necesarios
- Configuraciones de conexiones múltiples

---

## ✅ Criterios de Aceptación

- [ ] Uso actual de cada base de datos documentado explícitamente
- [ ] Justificación técnica para cada motor evaluada
- [ ] Análisis de costos operativos cuantificado
- [ ] Análisis de complejidad de mantenimiento completado
- [ ] Alternativas evaluadas objetivamente con pros/contras
- [ ] Decisión documentada formalmente en un ADR
- [ ] Plan de migración definido (si aplica consolidación)
- [ ] Impacto en aplicaciones evaluado

---

## 🧪 Pruebas Requeridas

### Validaciones de Documento
- [ ] ADR sigue formato establecido
- [ ] Datos de uso real de cada BD documentados
- [ ] Costos estimados (tiempo, infraestructura, mantenimiento)
- [ ] Alternativas evaluadas con criterios objetivos

### Pruebas Técnicas (si hay cambio)
- [ ] Tests de integración con nueva configuración de BD
- [ ] Migración de datos probada en ambiente controlado
- [ ] Rollback plan probado
- [ ] Performance tests comparativos

---

## 🔍 Validaciones Obligatorias

Antes de marcar como DONE, verificar:

- [ ] **Auditoría de Código:** Todas las conexiones a BD identificadas
- [ ] **Uso Real:** Qué tablas/colecciones existen actualmente en cada BD
- [ ] **Justificación:** Por qué se eligió cada motor originalmente
- [ ] **Documentación:** Todos los docs que mencionan bases de datos revisados
- [ ] **Infraestructura:** Docker Compose y configs auditadas
- [ ] **Impacto:** Apps afectadas por cambio identificadas
- [ ] **Documentación:** ADR creado con decisión fundamentada

---

## 📄 Documentación a Actualizar

- [ ] `docs/adr/ADR-XXX_database_strategy.md` — Nueva decisión arquitectónica
- [ ] `IMPLEMENTATION_GUIDE.md` — Sección de decisiones pendientes actualizada
- [ ] `docs/tracking/MASTER_TRACKING.md` — Estado de esta tarea actualizado
- [ ] `docs/06_DATABASE.md` — Documento de base de datos actualizado
- [ ] `infrastructure/README.md` — Si cambia infraestructura
- [ ] `README.md` — Si cambia arquitectura significativamente

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
- [infrastructure/docker-compose.yml](../../../infrastructure/docker-compose.yml) — Configuración actual
- [docs/06_DATABASE.md](../06_DATABASE.md) — Documentación existente
- [Formato ADR](../11_ARCHITECTURE_DECISION_RECORDS.md) — Referencia de formato

---

## 📝 DETALLES DE LA DECISIÓN REQUERIDA

### Problema

La infraestructura actual define 3 motores de base de datos:

```yaml
# infrastructure/docker-compose.yml
services:
  mysql-website:    # MySQL 8.4 — Website público
  postgresql-apps:  # PostgreSQL 17 — Apps transaccionales
  mongodb-logs:     # MongoDB 8 — Logs de auditoría
  redis:            # Redis 7 — Colas y caché
```

**Preguntas críticas:**

1. **¿Es necesaria esta complejidad?** — 3 motores diferentes aumentan:
   - Costos de infraestructura (3 servicios que mantener)
   - Complejidad operativa (backups, monitoring, updates)
   - Curva de aprendizaje para desarrolladores
   - Superficie de ataque de seguridad

2. **¿Hay justificación técnica válida?** — Cada motor tiene casos de uso específicos:
   - **MySQL:** Tradicional para websites, buen rendimiento lecturas
   - **PostgreSQL:** Features avanzadas, transaccional, JSONB
   - **MongoDB:** Documentos flexibles, logs, alta escritura

3. **¿Podría PostgreSQL cubrir todos los casos de uso?** — PostgreSQL moderno puede:
   - Manejar carga web convencional
   - Almacenar documentos JSON (JSONB)
   - Gestionar logs eficientemente
   - Reemplazar MySQL y MongoDB en la mayoría de casos

### Alternativas

#### Alternativa A: Consolidar en PostgreSQL Único (Recomendada)

**Descripción:** Migrar todo a PostgreSQL como única base de datos relacional/documental.

**Arquitectura Resultante:**
```yaml
services:
  postgresql-primary:  # PostgreSQL 17 — TODAS las bases de datos
    databases:
      - farutech_website   # Antes en MySQL
      - farutech_apps      # Transaccional (ya estaba aquí)
      - farutech_logs      # Antes en MongoDB (como colecciones)
  redis:  # Se mantiene para colas y caché
```

**Ventajas:**
- ✅ **Simplificación Operativa:** Un solo motor que mantener, monitorear, hacer backup
- ✅ **Reducción de Costos:** Menos recursos de infraestructura (RAM, CPU, almacenamiento)
- ✅ **Menor Complejidad:** Desarrolladores trabajan con un solo SQL dialect
- ✅ **Herramientas Unificadas:** pgAdmin para todo, scripts de backup únicos
- ✅ **PostgreSQL es Poderoso:** JSONB reemplaza MongoDB, performance excelente
- ✅ **Inodes:** Menos archivos de sistema (importante según limitación del proyecto)

**Desventajas:**
- ❌ **Migración Requiere Esfuerzo:** Mover datos de MySQL y MongoDB a PostgreSQL
- ❌ **Riesgo Temporal:** Durante migración puede haber inconsistencias
- ❌ **Single Point of Failure:** Una sola BD (mitigable con replication)
- ❌ **Pérdida de Optimizaciones Específicas:** MySQL puede ser ligeramente mejor para ciertos casos web

**Impacto Técnico:**
- Migrar schema MySQL → PostgreSQL (sintaxis similar pero no idéntica)
- Migrar colecciones MongoDB → Tablas PostgreSQL con JSONB
- Actualizar configuraciones de conexión en backend Laravel
- Actualizar Docker Compose (eliminar MySQL y MongoDB services)
- Actualizar variables de entorno (.env files)
- Re-escribir queries específicos de MySQL/MongoDB si los hay
- Tests de integración con nueva configuración

**Esfuerzo Estimado:**
- Auditoría de datos existentes: 4-8 horas
- Plan de migración detallado: 4 horas
- Ejecución migración (ambiente controlado): 8-16 horas
- Tests y validación: 8 horas
- **Total: 24-36 horas**

**Costo Infraestructura (Estimado):**
- **Actual:** 3 motores × ~512MB RAM mínimo = ~1.5GB RAM solo para BDs
- **Propuesto:** 1 motor × ~1GB RAM = ~1GB RAM para toda la BD
- **Ahorro:** ~33% RAM, menos CPU, menos almacenamiento

#### Alternativa B: Mantener 3 Motores (Status Quo)

**Descripción:** Continuar con MySQL + PostgreSQL + MongoDB tal como está.

**Requisitos para esta alternativa:**
- Justificar EXPLÍCITAMENTE por qué cada motor es necesario
- Documentar casos de uso específicos que requieren cada motor
- Establecer revisión trimestral de necesidad real

**Ventajas:**
- ✅ Sin migración requerida
- ✅ Sin riesgo de pérdida de datos
- ✅ Cada motor optimizado para su caso de uso específico

**Desventajas:**
- ❌ Complejidad operativa alta (3 sistemas que mantener)
- ❌ Mayor costo de infraestructura
- ❌ Más superficie de ataque de seguridad
- ❌ Más certificados SSL, más configuraciones
- ❌ Más backups que gestionar
- ❌ Más monitoring que configurar
- ❌ Más actualizaciones de seguridad que aplicar
- ❌ Más inodes consumidos

**Impacto Técnico:**
- Ninguno inmediato
- Deuda técnica acumulativa (complejidad crece con el tiempo)

**Costo Infraestructura (Estimado):**
- **Actual:** ~1.5GB RAM mínimo, 3 servicios, ~3x inodes
- **Mantenimiento:** Requiere expertise en 3 motores diferentes

#### Alternativa C: MySQL + PostgreSQL (Eliminar MongoDB)

**Descripción:** Consolidar logs en PostgreSQL, mantener MySQL para website.

**Arquitectura Resultante:**
```yaml
services:
  mysql-website:       # MySQL 8.4 — Website público
  postgresql-apps:     # PostgreSQL 17 — Apps + Logs (antes en MongoDB)
  redis:              # Redis 7 — Colas y caché
```

**Ventajas:**
- ✅ Reduce de 3 a 2 motores
- ✅ MongoDB es el menos justificado (logs pueden ir en PostgreSQL)
- ✅ Menor esfuerzo que consolidación completa

**Desventajas:**
- ❌ Todavía mantiene complejidad de 2 motores relacionales diferentes
- ❌ No resuelve pregunta fundamental: ¿MySQL vs PostgreSQL?

**Impacto Técnico:**
- Migrar colecciones MongoDB → Tablas PostgreSQL con JSONB
- Eliminar servicio MongoDB de Docker Compose
- Actualizar configuración de logging

**Esfuerzo Estimado:** 12-16 horas

#### Alternativa D: PostgreSQL + MongoDB (Eliminar MySQL)

**Descripción:** Migrar website a PostgreSQL, mantener MongoDB para logs.

**Arquitectura Resultante:**
```yaml
services:
  postgresql-primary:  # PostgreSQL 17 — Website + Apps
  mongodb-logs:        # MongoDB 8 — Logs de auditoría
  redis:              # Redis 7 — Colas y caché
```

**Ventajas:**
- ✅ PostgreSQL puede manejar carga web sin problemas
- ✅ Reduce de 3 a 2 motores
- ✅ MySQL → PostgreSQL es migración relativamente simple

**Desventajas:**
- ❌ Todavía mantiene MongoDB (¿realmente necesario?)
- ❌ No maximiza simplificación posible

**Esfuerzo Estimado:** 16-24 horas

### Recomendación

**Alternativa A (PostgreSQL Único)** — Máxima simplificación, menor costo operativo, tecnología capaz de cubrir todos los casos de uso.

**Justificación:**

1. **Principio de Mínima Complejidad:** Un solo motor reduce puntos de falla, costos y esfuerzo de mantenimiento
2. **PostgreSQL es Suficientemente Poderoso:** 
   - Maneja carga web convencional sin problemas
   - JSONB permite almacenar documentos como MongoDB
   - Excelente para transaccionalidad
   - Buen soporte para logs y auditoría
3. **Limitación de Inodes:** El prompt explícitamente menciona limitación de inodes — menos servicios = menos archivos
4. **Costo-Beneficio:** Esfuerzo de migración (24-36h) se recupera en meses de mantenimiento simplificado
5. **Tendencia de Industria:** PostgreSQL está siendo adoptado como "default database" en muchos proyectos nuevos

### Casos de Uso que PODRÍAN Justificar Mantener 3 Motores

Si existe ALGUNO de estos casos, reconsiderar:

- [ ] Volumen masivo de escrituras en MongoDB (>1M/día) que PostgreSQL no pueda manejar
- [ ] Requisitos de compliance que exijan separación física de datos
- [ ] Legacy systems que solo funcionan con MySQL específicamente
- [ ] Team ya tiene expertise profundo en los 3 motores y no hay curva de aprendizaje
- [ ] Ya hay inversión significativa en herramientas específicas por motor

### Preguntas a Responder Antes de Decidir

1. **¿Cuántos datos hay actualmente en cada BD?** (tablas, colecciones, volumen en MB/GB)
2. **¿Cuál es el workload de cada BD?** (lecturas/escrituras por día, picos de carga)
3. **¿Hay queries específicos de cada motor que sean críticos?**
4. **¿Existen backups automatizados para cada BD?**
5. **¿Cuál es el costo mensual de infraestructura actual?**
6. **¿Hay ventanas de mantenimiento disponibles para migración?**
7. **¿Existe equipo con capacidad para ejecutar migración?**

### Evidencia Requerida Antes de Decidir

- [ ] Auditar `infrastructure/docker-compose.yml` completamente
- [ ] Identificar todas las conexiones a BD en el código backend
- [ ] Listar tablas/colec ciones existentes en cada BD (si hay datos)
- [ ] Buscar referencias a MySQL, PostgreSQL, MongoDB en documentación
- [ ] Evaluar queries específicos que usen features de cada motor
- [ ] Calcular volumen de datos actual (si existe ambiente running)
- [ ] Estimar esfuerzo de migración con precisión

---

## 📊 EVIDENCIA PENDIENTE

[PENDIENTE — AUDITORÍA INFRAESTRUCTURA]
- Se requiere inspección completa de `infrastructure/docker-compose.yml`

[PENDIENTE — AUDITORÍA CÓDIGO]
- Se requieren identificar todas las conexiones a BD en backend

[PENDIENTE — DATOS REALES]
- Se requiere saber si hay datos en producción/staging y cuánto volumen

---

## 🎯 CRITERIO DE DECISIÓN FINAL

**Se recomienda CONSOLIDAR EN POSTGRESQL ÚNICO a MENOS QUE:**

✅ Exista evidencia de workload que PostgreSQL no pueda manejar  
✅ Hay requisitos de compliance que exijan separación física  
✅ El costo de migración exceda el beneficio proyectado (requiere números reales)  

**Si no se cumple lo anterior → Alternativa A (PostgreSQL Único)**

---

## 📋 PLAN DE MIGRACIÓN PRELIMINAR (Si se elige Alternativa A)

### Fase 1: Preparación (8 horas)
- [ ] Backup completo de todas las BDs
- [ ] Documentar schema actual de MySQL
- [ ] Documentar colecciones actuales de MongoDB
- [ ] Crear script de migración MySQL → PostgreSQL
- [ ] Crear script de migración MongoDB → PostgreSQL (JSONB)
- [ ] Configurar ambiente de testing con nueva arquitectura

### Fase 2: Migración en Testing (8 horas)
- [ ] Ejecutar migración en ambiente controlado
- [ ] Validar integridad de datos migrados
- [ ] Ejecutar tests de integración
- [ ] Performance tests comparativos
- [ ] Ajustar queries si es necesario

### Fase 3: Migración en Producción (16 horas + ventana de mantenimiento)
- [ ] Notificar downtime programado
- [ ] Backup final pre-migración
- [ ] Ejecutar migración
- [ ] Validar datos en producción
- [ ] Ejecutar smoke tests
- [ ] Monitorear performance post-migración
- [ ] Tener rollback plan listo

### Fase 4: Limpieza (4 horas)
- [ ] Eliminar servicios MySQL y MongoDB de Docker Compose
- [ ] Actualizar documentación
- [ ] Actualizar .env files
- [ ] Eliminar configs obsoletas
- [ ] Actualizar runbooks de operaciones

---

**Nota:** Esta tarea NO se considera DONE hasta que la decisión esté documentada en un ADR, aprobada por el Technical Lead y DevOps, y el plan de acción (consolidar o mantener) esté definido con timeline estimado.

⏸️ **Esperando inicio de FASE 3 para comenzar**
