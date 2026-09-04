# ADR-004 — Multi-Database Strategy

**Fecha:** 2024-09-04  
**Estado:** ✅ DECIDIDO  
**Responsable:** Software Architect / DevOps Engineer  

---

## Contexto

La infraestructura actual de Farutech define **tres motores de base de datos**:

1. **MySQL 8.4** — Website público (lectura principalmente)
2. **PostgreSQL 17** — Aplicaciones transaccionales (Admin, Intranet, API)
3. **MongoDB 8** — Logs de auditoría y actividad de Admin

Esta configuración está documentada en:
- `infrastructure/docker-compose.yml`
- `apps/api/src/backend/.env.example`

Sin embargo, el código del backend **NO tiene implementación real de MongoDB**:
- No existe el driver `mongodb` en `composer.json`
- No hay conexión `mongodb` configurada en `config/database.php`
- Solo hay una referencia condicional en `tests/TestCase.php`

---

## Problema

Mantener tres motores de base de datos introduce:

### Complejidad Operativa
- 3 sistemas que monitorear, hacer backup y mantener
- 3 herramientas de administración diferentes (phpMyAdmin, pgAdmin, Mongo Express)
- 3 conjuntos de credenciales y políticas de seguridad
- Mayor consumo de recursos (RAM, CPU, disco)

### Complejidad de Desarrollo
- Developers deben entender 3 modelos de datos diferentes
- Tests deben configurar 3 conexiones
- Migraciones distribuidas en múltiples sistemas
- Mayor superficie de errores

### Justificación Técnica Débil
- **MongoDB para logs**: Los logs de auditoría pueden almacenarse en PostgreSQL (JSONB) o incluso en archivos rotados
- **MySQL para website**: No hay justificación técnica sólida vs PostgreSQL para contenido público
- **PostgreSQL para transacciones**: Correcto, pero puede manejar también los otros casos de uso

---

## Alternativas Evaluadas

### Alternativa A: Consolidar todo en PostgreSQL (RECOMENDADA)

**Descripción:** Migrar toda la persistencia a PostgreSQL 17 único.

**Ventajas:**
- ✅ Simplificación operativa extrema (1 solo motor)
- ✅ PostgreSQL maneja perfectamente todos los casos de uso:
  - Datos relacionales (transaccionales)
  - Contenido semi-estructurado (JSONB para logs/auditoría)
  - Lecturas de alto volumen (website público)
  - Full-text search nativo
  - Particionamiento de tablas
- ✅ Reducción de inodes y archivos de configuración
- ✅ Menor curva de aprendizaje para nuevos developers
- ✅ Backups simplificados
- ✅ Menor costo de infraestructura en producción

**Desventajas:**
- ⚠️ Requiere migrar schema de MySQL a PostgreSQL (si ya hay datos)
- ⚠️ Requiere eliminar configuración MongoDB del docker-compose
- ⚠️ Cambio cultural (equipos acostumbrados a multi-BD)

**Impacto Técnico:**
- Modificar `infrastructure/docker-compose.yml` → Eliminar MySQL y MongoDB
- Modificar `apps/api/src/backend/.env.example` → Solo PostgreSQL
- Modificar `apps/api/src/backend/config/database.php` → Solo PostgreSQL + Redis
- Migrar migraciones existentes (sintaxis MySQL → PostgreSQL)
- Actualizar documentación

**Riesgo:** BAJO — PostgreSQL es maduro y compatible con todos los casos de uso

---

### Alternativa B: Mantener 3 motores con justificación explícita

**Descripción:** Conservar la arquitectura actual pero documentar claramente el propósito de cada motor.

**Ventajas:**
- ✅ Sin cambios requeridos en infraestructura
- ✅ Cada motor optimizado para su caso de uso específico

**Desventajas:**
- ❌ Complejidad operativa máxima
- ❌ MongoDB NO está implementado en el código actual
- ❌ Requiere justificación arquitectónica sólida (que no existe actualmente)
- ❌ Mayor costo de infraestructura

**Impacto Técnico:**
- Ninguno inmediato
- Requiere implementar MongoDB en el backend (driver, config, models)

**Riesgo:** MEDIO — Complejidad innecesaria sin beneficio claro

---

### Alternativa C: PostgreSQL + MySQL (eliminar MongoDB)

**Descripción:** Consolidar logs en PostgreSQL, mantener MySQL para website.

**Ventajas:**
- ✅ Reduce de 3 a 2 motores
- ✅ Elimina el motor menos utilizado (MongoDB)

**Desventajas:**
- ❌ Todavía mantiene complejidad de 2 motores
- ❌ No hay justificación clara para mantener MySQL vs PostgreSQL

**Impacto Técnico:**
- Eliminar MongoDB del docker-compose
- Migrar configuración de logs a PostgreSQL

**Riesgo:** BAJO — Pero no resuelve el problema de raíz

---

### Alternativa D: PostgreSQL único con Redis (RECOMENDACIÓN AJUSTADA)

**Descripción:** PostgreSQL para toda persistencia, Redis para caché/colas/logs temporales.

**Ventajas:**
- ✅ Máxima simplificación (1 BD persistente + 1 cache)
- ✅ Redis ya está en la arquitectura (no es cambio nuevo)
- ✅ Logs de auditoría pueden ir a PostgreSQL (tabla `audit_logs` con JSONB)
- ✅ Caché y colas ya usan Redis (arquitectura actual)

**Desventajas:**
- ⚠️ Requiere migración de cualquier dato MySQL existente

**Impacto Técnico:**
- Eliminar MySQL y MongoDB del docker-compose
- Mantener Redis (ya existe)
- Crear tabla `audit_logs` en PostgreSQL con estructura JSONB

**Riesgo:** BAJO — Arquitectura limpia y común en la industria

---

## Decisión

**ALTERNATIVA D SELECCIONADA:** PostgreSQL único + Redis

### Justificación

1. **Principio de simplicidad:** Un solo motor de persistencia reduce complejidad operativa y de desarrollo
2. **Capacidad técnica:** PostgreSQL 17 puede manejar todos los casos de uso actuales:
   - Datos transaccionales (tablas relacionales)
   - Contenido website (tablas con índices optimizados para lectura)
   - Logs de auditoría (JSONB para flexibilidad)
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

---

## Consecuencias

### Positivas
- ✅ **Reducción de complejidad:** De 3 motores a 1 (+ Redis)
- ✅ **Menor costo operativo:** Menos contenedores, menos recursos
- ✅ **Simplificación de backups:** Un solo motor persistente
- ✅ **Mejor DX:** Developers trabajan con un solo modelo de datos
- ✅ **Consistencia:** Alinea infraestructura con código real

### Negativas
- ⚠️ **Migración requerida:** Si existen datos en MySQL, deben migrarse a PostgreSQL
- ⚠️ **Configuración inicial:** Ajustar docker-compose y variables de entorno
- ⚠️ **Testing:** Verificar que todas las migraciones funcionen en PostgreSQL

### Neutras
- ➖ Redis se mantiene (ya era parte de la arquitectura)
- ➖ HAProxy como gateway se mantiene

---

## Plan de Migración

### Fase 1: Preparación
- [ ] Crear backup de cualquier dato existente en MySQL
- [ ] Revisar migraciones Laravel en busca de sintaxis MySQL-específica
- [ ] Identificar queries raw que usen sintaxis MySQL

### Fase 2: Infraestructura
- [ ] Modificar `infrastructure/docker-compose.yml`:
  - Eliminar servicio `mysql`
  - Eliminar servicio `mongodb`
  - Eliminar `phpmyadmin`
  - Eliminar `mongo-express`
  - Mantener `postgres`, `redis`, `pgadmin`
- [ ] Actualizar `infrastructure/.env.example`
- [ ] Actualizar `infrastructure/gateway/haproxy.cfg` (quitar puertos MySQL/MongoDB)

### Fase 3: Backend Configuration
- [ ] Modificar `apps/api/src/backend/.env.example`:
  - Eliminar variables `DB_*` (MySQL)
  - Eliminar variables `DB_MONGO_*`
  - Mantener solo `DB_CONNECTION=pgsql` y variables `DB_*` estándar
- [ ] Limpiar `apps/api/src/backend/config/database.php`:
  - Eliminar conexión `mysql`
  - Eliminar referencias a MongoDB
  - Mantener solo `pgsql` y `redis`

### Fase 4: Migraciones
- [ ] Revisar todas las migraciones en `database/migrations/`
- [ ] Ajustar sintaxis MySQL-specific a PostgreSQL:
  - `ENGINE=InnoDB` → eliminar
  - `CHARSET=utf8mb4` → eliminar
  - Tipos específicos (ej. `tinyInteger` → `smallint`)
- [ ] Probar migraciones en ambiente limpio

### Fase 5: Testing
- [ ] Ejecutar tests de integración con PostgreSQL único
- [ ] Validar que Jobs funcionan con Redis
- [ ] Validar que autenticación funciona
- [ ] Validar CRUD de todas las entidades

### Fase 6: Documentación
- [ ] Actualizar `docs/06_DATABASE.md`
- [ ] Actualizar `docs/09_INFRASTRUCTURE.md`
- [ ] Actualizar README principal
- [ ] Actualizar este ADR con lecciones aprendidas

---

## Métricas de Éxito

- [ ] Docker-compose levanta solo PostgreSQL + Redis
- [ ] Backend se conecta exitosamente a PostgreSQL
- [ ] Todas las migraciones se ejecutan sin errores
- [ ] Tests de integración pasan
- [ ] Logs de auditoría se guardan en PostgreSQL (tabla `audit_logs`)
- [ ] Documentación actualizada refleja arquitectura simplificada

---

## Referencias

- PostgreSQL JSONB: https://www.postgresql.org/docs/current/datatype-json.html
- Laravel Database Config: https://laravel.com/docs/database
- Docker Compose Best Practices: https://docs.docker.com/compose/best-practices/

---

**Estados Permitidos:** PROPOSED → REVIEW → ACCEPTED → IMPLEMENTED → SUPERSEDED  
**Estado Actual:** ✅ ACCEPTED
