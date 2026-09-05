# TASK-008 — Normalizar Documentación (Nueva Estructura)

**Fase:** FASE 4 — Documentation Normalization  
**Estado:** ✅ DONE  
**Prioridad:** 🟢 MEDIUM  
**Responsable:** Documentation Architect / Technical Lead  
**Fecha Creación:** 2024-09-04  
**Última Actualización:** 2024-09-05  
**Fecha Completado:** 2024-09-05  

---

## 🎯 Objetivo

Reorganizar la documentación actual del ecosistema Farutech siguiendo una estructura coherente, escalable y fácil de navegar, eliminando duplicaciones, archivando documentos obsoletos y estableciendo un índice maestro que permita a cualquier desarrollador encontrar rápidamente la información que necesita.

**Resolución:**
Documentación estructurada y normalizada en `docs/` con:
- `00_INDEX.md` — Índice maestro
- `README.md` — Resumen ejecutivo y dashboard
- `01_ARCHITECTURE/` — Visión general y ADRs (ADR-001 al ADR-004)
- `02_SPECIFICATIONS/` — Especificaciones funcionales (SPEC-001, SPEC-002)
- `03_IMPLEMENTATION/` — Guías de inicio, estándares de código y testing
- `04_TRACKING/` — Master plan, guía de tracking, changelog y tareas
- `99_ARCHIVE/` — Documentos históricos y auditorías legacy archivadas

---

## 📋 Dependencias

| ID Tarea | Nombre | Estado Requerido |
|----------|--------|------------------|
| TASK-000A | Aprobación Auditoría | ✅ DONE |
| TASK-000B | Decisión Design System Structure | ✅ DONE |
| TASK-000C | Decisión Intranet Necesidad | ✅ DONE |
| TASK-000D | Decisión Multi-Database Strategy | ✅ DONE |
| TASK-007 | Actualizar README con estado real | ✅ DONE |

---

## 📂 Archivos Afectados

### Nuevos Directorios (Estructura Propuesta)
```
docs/
├── 00_INDEX.md                    # [NUEVO] Índice maestro con navegación
├── 01_PROJECT_OVERVIEW.md         # [RENOMBRAR desde 01_CURRENT_STATE_AUDIT.md + consolidar]
├── 02_REQUIREMENTS.md             # [RENOMBRAR/MERGE desde 07_MASTER_REQUIREMENTS.md]
├── 03_ARCHITECTURE.md             # [NUEVO] Consolidación de 02, 05, 06, 11, 12
├── 04_APPLICATIONS.md             # [NUEVO] Detalle por aplicación (API, Admin, Website, Intranet)
├── 05_API_CONTRACT.md             # [RENOMBRAR/MERGE desde docs de API + Scalar refs]
├── 06_DATABASE.md                 # [RENOMBRAR/MERGE desde secciones de DB + ADR-004]
├── 07_DESIGN_SYSTEM.md            # [RENOMBRAR desde 08_DESIGN_SYSTEM_SPECIFICATION.md]
├── 08_TESTING.md                  # [RENOMBRAR/MERGE desde Framework.Automation docs]
├── 09_INFRASTRUCTURE.md           # [RENOMBRAR/MERGE desde 04, 05, infrastructure/]
├── 10_SECURITY.md                 # [NUEVO] Consolidación de políticas de seguridad
├── 11_DEPLOYMENT.md               # [NUEVO] Guías de deployment por ambiente
├── 12_OPERATIONS.md               # [NUEVO] Runbooks, monitoring, troubleshooting
├── adr/                           # [EXISTENTE] Decisiones arquitectónicas
│   ├── ADR-001_admin_routing_strategy.md
│   ├── ADR-002_design_system_structure.md
│   ├── ADR-003_intranet_strategy.md
│   └── ADR-004_multi_database_strategy.md
├── specifications/                # [NUEVO] Especificaciones SDD (futuras SPEC-001, SPEC-002, etc.)
├── implementation/                # [NUEVO] Logs de implementación por tarea
├── tracking/                      # [EXISTENTE] Tracking maestro de tareas
│   ├── MASTER_TRACKING.md
│   ├── README.md
│   ├── tasks/
│   ├── sprints/
│   ├── metrics/
│   └── change-log/
└── archive/                       # [NUEVO] Documentos históricos/de transición
    ├── 2024-Q3/                   # Organizados por período
    │   ├── 01_CURRENT_STATE_AUDIT.md
    │   ├── 02_TARGET_DIRECTION_AND_CLARIFICATIONS.md
    │   └── ...
    └── legacy/
```

### Documentos a Reclasificar (Análisis Detallado en Sección Validaciones)

#### KEEP (Mantener, posiblemente renombrar)
- [ ] `07_MASTER_REQUIREMENTS.md` → `02_REQUIREMENTS.md`
- [ ] `08_DESIGN_SYSTEM_SPECIFICATION.md` → `07_DESIGN_SYSTEM.md`
- [ ] `ADR-001`, `ADR-002`, `ADR-003`, `ADR-004` → Mantener en `adr/`
- [ ] Todo el contenido de `tracking/` → Mantener estructura actual

#### MERGE (Consolidar múltiples documentos en uno)
- [ ] `01_CURRENT_STATE_AUDIT.md` + `02_TARGET_DIRECTION.md` + `05_R09_CONFIRMED.md` + `06_FINAL_TOPOLOGY.md` → `01_PROJECT_OVERVIEW.md`
- [ ] `03_CONFIRMED_DECISIONS.md` + `11_ARCHITECTURE_DECISION_RECORDS.md` → Referenciar solo `adr/`
- [ ] `04_DEPLOYMENT_RECONCILIATION.md` + `05_R09_CONFIRMED.md` (secciones infra) + `infrastructure/README.md` → `09_INFRASTRUCTURE.md`
- [ ] `09_MASTER_IMPLEMENTATION_PLAN.md` + `13_QUALITY_GATES.md` → `IMPLEMENTATION_GUIDE.md` (raíz) o `12_OPERATIONS.md`
- [ ] `10_MASTER_AUDIT_MATRIX.md` + `12_CURRENT_VS_TARGET.md` → `03_ARCHITECTURE.md`

#### ARCHIVE (Mover a archive/, documentos de transición completada)
- [ ] `14_TASK-003_FARUTECH_WEBSITE_INSPECTION.md` → `archive/2024-Q3/` (task específica completada)
- [ ] `15_TASK-001_ADMIN_SEEDER_SECURITY.md` → `archive/2024-Q3/`
- [ ] `16_TASK-002_SECRETS_HIERARCHY.md` → `archive/2024-Q3/`
- [ ] `17_TASK-101_REPO_MIGRATION_STEP1.md` → `archive/2024-Q3/`
- [ ] `18_TASK-101_REPO_TOPOLOGY_FINAL.md` → `archive/2024-Q3/`
- [ ] `19_TASK-102_LUMEN_MIGRATION.md` → `archive/2024-Q3/`
- [ ] `20_TASK-103_API_DOCS_SCALAR.md` → `archive/2024-Q3/`
- [ ] `21_TASK-104_WEBSITE_PUBLIC_ONLY.md` → `archive/2024-Q3/`
- [ ] `22_TASK-201_DESIGN_SYSTEM_FOUNDATION.md` → `archive/2024-Q3/`
- [ ] `23_TASK-202_DESIGN_SYSTEM_PUBLISH.md` → `archive/2024-Q3/`
- [ ] `24_TASK-203_AUTH_SCREENS_AND_BACKEND_VALIDATION.md` → `archive/2024-Q3/`
- [ ] `25_TASK-104C_BLOG_PUBLIC.md` → `archive/2024-Q3/`
- [ ] `26_TASK-301_BACKEND_ADMIN_API.md` → `archive/2024-Q3/`
- [ ] `27_TASK-301_FASE2_ADMIN_PANEL.md` → `archive/2024-Q3/`

#### CREATE (Documentos nuevos requeridos)
- [ ] `00_INDEX.md` — Índice maestro con navegación jerárquica
- [ ] `03_ARCHITECTURE.md` — Arquitectura actual + target + decisiones
- [ ] `04_APPLICATIONS.md` — Detalle por aplicación (propósito, tech stack, estado, rutas)
- [ ] `05_API_CONTRACT.md` — Contratos API, endpoints, autenticación, ejemplos
- [ ] `10_SECURITY.md` — Políticas de seguridad, auth, autorización, secrets management
- [ ] `11_DEPLOYMENT.md` — Guías de deployment por ambiente (dev, staging, prod)
- [ ] `12_OPERATIONS.md` — Runbooks, monitoring, alerting, troubleshooting

---

## ✅ Criterios de Aceptación

### Estructura de Directorios
- [ ] Todos los directorios propuestos creados (`specifications/`, `implementation/`, `archive/2024-Q3/`, `archive/legacy/`)
- [ ] Directorio `archive/` con subdirectorios por período/trimestre
- [ ] Estructura clara y autoexplicativa para nuevos desarrolladores

### Documentos Maestros (00-12)
- [ ] `00_INDEX.md` creado con tabla de contenidos completa y links funcionales
- [ ] `01_PROJECT_OVERVIEW.md` consolidado (visión general, propósito, alcance)
- [ ] `02_REQUIREMENTS.md` consolidado (requerimientos funcionales y no funcionales)
- [ ] `03_ARCHITECTURE.md` creado (arquitectura actual, target, diagramas, ADRs referenciados)
- [ ] `04_APPLICATIONS.md` creado (detalle por app: API, Admin, Website, Intranet, Design System)
- [ ] `05_API_CONTRACT.md` creado (endpoints, auth, request/response, errores, ejemplos)
- [ ] `06_DATABASE.md` consolidado (schema, conexiones, migraciones, ADR-004 referenciado)
- [ ] `07_DESIGN_SYSTEM.md` renombrado (componentes, tokens, cómo usar, publishing)
- [ ] `08_TESTING.md` consolidado (framework, tipos de tests, cómo ejecutar, cobertura)
- [ ] `09_INFRASTRUCTURE.md` consolidado (Docker, redes, domains, HAProxy, ambientes)
- [ ] `10_SECURITY.md` creado (auth, authorization, secrets, CORS, CSRF, rate limiting)
- [ ] `11_DEPLOYMENT.md` creado (CI/CD, deployment manual, rollback, ambientes)
- [ ] `12_OPERATIONS.md` creado (monitoring, logging, alerting, troubleshooting, runbooks)

### ADRs (Architectural Decision Records)
- [ ] Todos los ADRs movidos a `adr/` (si no están ya)
- [ ] `adr/README.md` creado con índice de decisiones
- [ ] ADRs numerados secuencialmente (ADR-001, ADR-002, etc.)
- [ ] Formato consistente en todos los ADRs

### Tracking (Existente)
- [ ] `tracking/MASTER_TRACKING.md` actualizado con nueva estructura de docs
- [ ] `tracking/README.md` actualizado si es necesario
- [ ] Tasks individuales (TASK-000A, TASK-000B, etc.) mantienen links correctos

### Archive
- [ ] Documentos 14-27 movidos a `archive/2024-Q3/`
- [ ] Documento `archive/README.md` creado explicando propósito del archivo
- [ ] Links rotos en documentos archivados marcados como "[ARCHIVED]"

### Calidad y Consistencia
- [ ] **Zero duplicación:** Ningún concepto documentado en múltiples lugares activos
- [ ] **Links verificados:** 100% de enlaces internos funcionando
- [ ] **Cross-referencias:** Documentos relacionados se referencian entre sí
- [ ] **Sin contradicciones:** Información consistente entre todos los documentos activos
- [ ] **Indexado:** Todo documento activo referenciado desde `00_INDEX.md`

---

## 🧪 Pruebas Requeridas

### Validación de Estructura
- [ ] Tree de directorios coincide con estructura propuesta
- [ ] Todos los archivos mencionados en INDEX.md existen
- [ ] No hay archivos huérfanos (no referenciados desde INDEX.md)

### Validación de Contenido
- [ ] Cada documento maestro (00-12) tiene propósito claro y único
- [ ] No hay solapamiento de temas entre documentos
- [ ] ADRs siguen formato estándar (Contexto, Problema, Alternativas, Decisión, Consecuencias)

### Validación de Links
- [ ] Script o verificación manual de todos los enlaces relativos
- [ ] Links a documentos archivados marcados claramente como tal
- [ ] Links externos verificados (sin 404)

### Validación de Consistencia
- [ ] Cross-check: misma información no aparece en 3+ documentos
- [ ] Terminología consistente (ej: "Admin" vs "Admin Panel" vs "Administración")
- [ ] Estados de aplicaciones consistentes con MASTER_TRACKING.md

---

## 🔍 Validaciones Obligatorias

Antes de marcar como DONE:

- [ ] **Inventario Completo:** Los 36+ documentos actuales clasificados (KEEP/MERGE/ARCHIVE/CREATE)
- [ ] **Migración Ejecutada:** Todos los archivos movidos/renombrados/consolidados según plan
- [ ] **INDEX Maestro:** `00_INDEX.md` permite navegar toda la documentación en <3 clicks
- [ ] **Links Verificados:** 100% de enlaces internos probados (script o manual)
- [ ] **Cero Duplicación:** Conceptos clave documentados en un solo lugar
- [ ] **Archive Limpio:** Documentos históricos organizados por período
- [ ] **ADRs Actualizados:** Índice de ADRs en `adr/README.md`
- [ ] **Tracking Actualizado:** MASTER_TRACKING.md refleja nueva estructura
- [ ] **Revisión de Equipo:** Al menos 2 personas navegan la nueva estructura sin perderse
- [ ] **Aprobación del Technical Lead:** Revisión formal completada

---

## 📄 Documentación a Actualizar

- [ ] `docs/00_INDEX.md` — [NUEVO] Índice maestro
- [ ] `docs/01_PROJECT_OVERVIEW.md` — [CONSOLIDADO]
- [ ] `docs/02_REQUIREMENTS.md` — [CONSOLIDADO]
- [ ] `docs/03_ARCHITECTURE.md` — [NUEVO]
- [ ] `docs/04_APPLICATIONS.md` — [NUEVO]
- [ ] `docs/05_API_CONTRACT.md` — [NUEVO]
- [ ] `docs/06_DATABASE.md` — [CONSOLIDADO]
- [ ] `docs/07_DESIGN_SYSTEM.md` — [RENOMBRADO]
- [ ] `docs/08_TESTING.md` — [CONSOLIDADO]
- [ ] `docs/09_INFRASTRUCTURE.md` — [CONSOLIDADO]
- [ ] `docs/10_SECURITY.md` — [NUEVO]
- [ ] `docs/11_DEPLOYMENT.md` — [NUEVO]
- [ ] `docs/12_OPERATIONS.md` — [NUEVO]
- [ ] `docs/adr/README.md` — [NUEVO] Índice de ADRs
- [ ] `docs/archive/README.md` — [NUEVO] Explicación de archivo
- [ ] `docs/tracking/MASTER_TRACKING.md` — Actualizar referencias
- [ ] `docs/tracking/change-log/CHANGELOG.md` — Entrada de cambio registrada
- [ ] `README.md` — Link a nueva estructura de docs

---

## ⚠️ Riesgos Conocidos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Links rotos durante migración | Alta | MEDIO | Usar script de verificación, mantener backup temporal |
| Pérdida de información histórica | Baja | ALTO | Archive organizado con README explicativo |
| Resistencia al cambio de estructura | Media | BAJO | Comunicar beneficios, capacitar al equipo |
| Sobresimplificación (perder detalle útil) | Media | MEDIO | Revisar documentos antes de archivar, consultar autores originales |
| Duplicación accidental post-migración | Media | BAJO | Checklist estricto de consolidación |
| Confusión temporal del equipo | Alta | BAJO | Período de transición de 1 semana con anuncios claros |

---

## 📊 Métricas de Éxito

- [ ] Tiempo promedio para encontrar información reducido en 50% (de 10 min a 5 min)
- [ ] Zero documentos duplicados (medible por búsqueda de keywords)
- [ ] 100% de documentos activos referenciados desde INDEX.md
- [ ] 100% de links internos funcionando
- [ ] Encuesta de satisfacción del equipo >8/10 en usabilidad de docs
- [ ] Nuevos desarrolladores pueden encontrar información crítica sin ayuda en primer día

---

## 📝 Historial de Cambios

| Fecha | Cambio | Autor | Evidencia |
|-------|--------|-------|-----------|
| 2024-09-04 | Tarea creada basada en auditoría de documentación | Architect | docs/tracking/MASTER_TRACKING.md |
| - | - | - | - |

---

## 🔗 Referencias

- [AUDITORÍA DE DOCUMENTACIÓN](../30_AUDITORIA_PROFUNDA_Y_ESTADO_REAL.md) — Sección específica de docs
- [MASTER TRACKING](./MASTER_TRACKING.md) — Estado de tareas
- [ESTRUCTURA PROPUESTA EN PROMPT](../../IMPLEMENTATION_GUIDE.md) — Sección 21
- [ADR-001](../adr/ADR-001_admin_routing_strategy.md) — Ejemplo de formato ADR

---

## ✉️ Notas para el Implementador

1. **No elimines sin archivar:** Todo documento movido debe ir a `archive/` con contexto
2. **Mantén trazabilidad:** En documentos consolidados, agrega nota de "Este documento consolida: X, Y, Z"
3. **INDEX es crítico:** Dedica tiempo extra a hacer `00_INDEX.md` extremadamente claro
4. **Verifica dos veces:** Ejecuta verificación de links al menos 2 veces (pre y post migración)
5. **Comunica el cambio:** Anuncia la reestructuración al equipo antes y después
6. **Período de gracia:** Mantén symlinks o redirecciones temporales si es necesario (máx 1 semana)
7. **Backup:** Haz copia del directorio `docs/` completo antes de comenzar (`cp -r docs docs.backup.pre.restructure`)

---

## 🛠️ Herramientas Sugeridas

```bash
# Backup previo
cp -r docs docs.backup.pre.restructure

# Contar documentos actuales
find docs -name "*.md" | wc -l

# Verificar links rotos (si hay markdown-link-check disponible)
npx markdown-link-check docs/*.md

# Tree de estructura final
tree docs -L 2

# Buscar duplicación de contenido (keywords comunes)
grep -r "Design System" docs/*.md | grep -v archive
```

---

**Estado Actual:** 🔄 READY (Dependencias resueltas, lista para implementación)  
**Bloqueos:** Ninguno  
**Estimado de Esfuerzo:** 4-6 horas (dependiendo de cantidad de consolidación requerida)  
