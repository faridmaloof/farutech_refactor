# TASK-003 — SPEC-001: Lead Management System

**Fase:** FASE 5 — SDD Specifications  
**Estado:** ⬜ BACKLOG  
**Prioridad:** 🔴 HIGH  
**Responsable:** Specification Architect / Product Owner  
**Fecha Creación:** 2024-09-04  
**Última Actualización:** 2024-09-04  
**Fecha Estimada Completado:** Pendiente asignación  

---

## 🎯 Objetivo

Crear la especificación detallada (SDD - Specification Driven Development) para el sistema de gestión de Leads del ecosistema Farutech, incluyendo CRUD completo, filtros avanzados, estados, calidad, asignación, historial, interacciones, notas, seguimiento y conversión a oportunidades.

Esta especificación servirá como **contrato único de verdad** para que los equipos de backend, frontend y testing implementen funcionalidades consistentes y verificables.

---

## 📋 Dependencias

| ID Tarea | Nombre | Estado Requerido |
|----------|--------|------------------|
| TASK-000A | Aprobación Auditoría | ✅ DONE |
| TASK-000D | Decisión Multi-Database Strategy | ✅ DONE |
| TASK-007 | Actualizar README con estado real | 🔄 READY |
| TASK-008 | Normalizar documentación | 🔄 READY |

---

## 📂 Archivos Afectados

### Nuevos
- [ ] `docs/specifications/SPEC-001_lead_management.md` — Especificación completa

### Modificados (post-implementación)
- [ ] `docs/tracking/MASTER_TRACKING.md` — Estado actualizado
- [ ] `docs/05_API_CONTRACT.md` — Endpoints de leads referenciados
- [ ] `apps/api/src/backend/routes/api.php` — Rutas validadas contra spec
- [ ] `apps/admin/src/` — Features de leads (pendiente implementación)

---

## ✅ Criterios de Aceptación para la Especificación

La especificación SPEC-001 debe incluir explícitamente:

### 1. Visión General
- [ ] Nombre claro: "Lead Management System"
- [ ] Objetivo de negocio medible
- [ ] Contexto dentro del ecosistema Farutech
- [ ] Problema que resuelve (pain points actuales)
- [ ] Alcance definido (qué incluye y qué NO incluye)

### 2. Actores y Roles
- [ ] Admin (acceso completo)
- [ ] Sales Rep (acceso a leads asignados)
- [ ] Manager (vista de equipo + reports)
- [ ] Sistema (automatizaciones)
- [ ] Permisos por rol documentados

### 3. Modelo de Datos
- [ ] Entidad `Lead` con todos los campos:
  - id, name, email, phone, company, position
  - source (website, scraping, referral, import)
  - status (new, contacted, qualified, proposal, negotiation, won, lost)
  - quality_score (0-100, calculado)
  - assigned_to (user_id)
  - location_id (geografía)
  - utm_source, utm_medium, utm_campaign (tracking)
  - created_at, updated_at, converted_at
- [ ] Entidad `LeadInteraction` (historial de contactos)
- [ ] Entidad `LeadNote` (notas internas)
- [ ] Entidad `LeadOpportunity` (conversión a oportunidad)
- [ ] Relaciones entre entidades diagramadas
- [ ] Reglas de validación por campo

### 4. API Contract (Backend)
- [ ] `GET /api/v1/leads` — Listado con paginación, filtros, ordenamiento
  - Query params: page, per_page, sort, order, status, quality_min, assigned_to, date_from, date_to, search
  - Response: { data: [], meta: { total, per_page, current_page, last_page } }
  - Auth requerida: Sí (Sanctum token)
  - Permisos: admin o sales_rep (solo propios)
- [ ] `GET /api/v1/leads/{id}` — Detalle de lead
  - Includes: interactions[], notes[], opportunities[]
  - Auth requerida: Sí
  - Permisos: admin o assigned_to
- [ ] `POST /api/v1/leads` — Crear lead
  - Request: { name, email, phone, company, source, ... }
  - Validaciones: email único, phone formato, required fields
  - Response: { data: { lead }, message: "Lead created successfully" }
  - Auth: admin o manager
- [ ] `PUT /api/v1/leads/{id}` — Actualizar lead
  - Partial update permitido
  - Validar ownership o admin
- [ ] `DELETE /api/v1/leads/{id}` — Eliminar lead (soft delete)
  - Solo admin o manager
  - Justificación requerida
- [ ] `POST /api/v1/leads/{id}/interactions` — Registrar interacción
  - Request: { type (call, email, meeting), notes, scheduled_at, completed_at }
- [ ] `POST /api/v1/leads/{id}/notes` — Agregar nota interna
  - Request: { content, is_internal (default true) }
- [ ] `POST /api/v1/leads/{id}/assign` — Asignar lead
  - Request: { user_id, reason }
  - Notificación al usuario asignado
- [ ] `POST /api/v1/leads/{id}/convert` — Convertir a oportunidad
  - Request: { opportunity_value, currency, expected_close_date }
  - Cambia status a "won" o crea opportunity separada
- [ ] `GET /api/v1/leads/stats` — Estadísticas dashboard
  - Metrics: total_leads, by_status, by_source, conversion_rate, avg_quality_score
  - Filtros por fecha, usuario, source

### 5. Frontend Requirements (Admin Panel)
- [ ] Página `/admin/leads` — Listado con tabla
  - Columnas: nombre, email, empresa, status (badge), quality_score (progress bar), asignado, fecha creación, acciones
  - Filtros laterales o superiores: status (multi-select), quality range slider,assigned user dropdown, date range picker, search box
  - Paginación: 20/50/100 por página
  - Ordenamiento por columnas clickeables
- [ ] Página `/admin/leads/:id` — Detalle de lead
  - Sección información principal (editable inline)
  - Timeline de interacciones (orden cronológico inverso)
  - Lista de notas (agregar nueva con rich text)
  - Botón "Agregar Interacción" (modal con tipo, notas, fecha)
  - Botón "Asignar" (dropdown de usuarios)
  - Botón "Convertir a Oportunidad" (modal con valor, moneda, fecha esperada)
  - Breadcrumb de navegación
- [ ] Página `/admin/leads/create` — Formulario de creación
  - Campos required marcados con asterisco
  - Validación en tiempo real
  - Autoguardado como borrador (opcional)
  - Cancelar vuelve al listado
- [ ] Componentes reutilizables del Design System
  - LeadCard (para vista kanban opcional)
  - StatusBadge (colores por estado)
  - QualityIndicator (progress bar circular o lineal)
  - InteractionTimeline
  - NotesList
  - AssignModal
  - ConvertModal

### 6. Reglas de Negocio
- [ ] Quality Score calculation:
  - Email corporativo: +20 puntos
  - Phone válido: +10 puntos
  - Company name presente: +15 puntos
  - Position presente: +10 puntos
  - Source = referral: +25 puntos
  - UTM campaign presente: +10 puntos
  - Interactions > 3: +10 puntos
  - Máximo 100 puntos
- [ ] Auto-assignment rules (configurables):
  - Round-robin por defecto
  - Por geografía si hay asignación territorial
  - Por especialidad del sales rep
- [ ] SLA de respuesta:
  - Lead nuevo: contactar en < 2 horas hábiles
  - Lead calificado: propuesta en < 24 horas hábiles
  - Alertas si SLA vencido
- [ ] Duplicación:
  - Check por email (case insensitive)
  - Check por phone (normalizado)
  - Merge manual permitido (admin only)
- [ ] Retención de datos:
  - Leads inactivos > 1 año: archivar
  - Leads perdidos: mantener histórico 3 años
  - GDPR compliance: derecho a olvido

### 7. Seguridad
- [ ] Autenticación requerida: Sí (Sanctum token)
- [ ] Autorización por roles:
  - admin: CRUD completo, ver todos, asignar, eliminar
  - manager: CRUD leads de su equipo, reports de equipo
  - sales_rep: CRUD solo leads asignados, ver propios
- [ ] Rate limiting: 100 requests/min por usuario
- [ ] Audit log: todas las acciones registradas (quién, qué, cuándo, IP)
- [ ] Data isolation: sales_rep solo ve sus leads (row-level security)
- [ ] PII protection: email y phone encriptados en reposo (opcional)

### 8. Performance
- [ ] Listado de leads: < 500ms con 10,000 registros
- [ ] Detalle de lead: < 200ms
- [ ] Índices de base de datos:
  - status, assigned_to, created_at, quality_score, source
  - Composite index: (status, assigned_to, created_at)
- [ ] Caché de estadísticas: 5 minutos TTL
- [ ] Lazy loading para interacciones y notas (>10 elementos)

### 9. Testing Requirements
- [ ] API Tests:
  - GET /leads retorna 200 con estructura correcta
  - GET /leads?page=2 retorna paginación correcta
  - GET /leads?status=qualified filtra correctamente
  - POST /leads con datos válidos crea lead (201)
  - POST /leads con email duplicado falla (422)
  - PUT /leads/:id actualiza campos correctos
  - DELETE /leads/:id hace soft delete (204)
  - POST /leads/:id/interactions crea interacción
  - GET /leads/stats retorna métricas correctas
  - Auth: request sin token retorna 401
  - Permissions: sales_rep intentando ver lead ajeno retorna 403
- [ ] Integration Tests:
  - Calidad de lead se calcula correctamente al crear
  - Asignación envía notificación al usuario
  - Conversión a oportunidad actualiza status
  - Duplicados detectados por email normalizado
- [ ] E2E Tests:
  - Admin puede crear lead desde UI
  - Admin puede filtrar por status y quality
  - Admin puede abrir detalle y ver timeline
  - Admin puede agregar interacción y nota
  - Admin puede asignar lead a otro usuario
  - Admin puede convertir lead a oportunidad
  - Sales rep ve solo sus leads asignados
  - SLA alertas visibles cuando vencen

### 10. Observabilidad
- [ ] Logging:
  - Info: lead creado, actualizado, asignado
  - Warning: SLA próximo a vencer (< 30 min)
  - Error: fallo en cálculo de quality score, duplicado no detectado
- [ ] Métricas:
  - leads_created_total (counter, por source)
  - leads_converted_total (counter)
  - lead_conversion_rate (gauge)
  - avg_response_time_seconds (histogram)
  - sla_breach_count (counter, por usuario)
- [ ] Alerts:
  - SLA breach rate > 10% en últimas 24h
  - Quality score promedio < 30 (posible problema en fuentes)
  - Tasa de conversión < 5% (revisar proceso)

### 11. Criterios de Aceptación Funcionales
- [ ] Usuario autenticado puede listar leads con paginación
- [ ] Usuario puede filtrar por status (múltiple selección)
- [ ] Usuario puede filtrar por rango de quality score (slider 0-100)
- [ ] Usuario puede buscar por nombre, email, empresa (search full-text)
- [ ] Usuario puede ordenar por cualquier columna (asc/desc)
- [ ] Usuario puede ver detalle completo de lead
- [ ] Usuario puede crear lead nuevo con validaciones
- [ ] Usuario puede actualizar lead (campos permitidos)
- [ ] Usuario puede registrar interacción (tipo, notas, fecha)
- [ ] Usuario puede agregar nota interna
- [ ] Admin puede asignar lead a otro usuario
- [ ] Admin/Manager puede convertir lead a oportunidad
- [ ] Quality score se calcula automáticamente al crear/actualizar
- [ ] Duplicados detectados antes de crear
- [ ] Notificaciones enviadas al asignar lead
- [ ] SLA alerts visibles cuando corresponda
- [ ] Dashboard muestra estadísticas en tiempo real

### 12. Dependencias Externas
- [ ] Backend API: Laravel 11, Sanctum, MySQL/PostgreSQL
- [ ] Frontend: React 18, Design System @farutech/design-system
- [ ] Email service: SMTP o provider externo (SendGrid, SES)
- [ ] Tracking: Google Analytics 4 (UTM params)
- [ ] Geocoding: API externa para validar locations (opcional)

### 13. Riesgos Conocidos
- [ ] Duplicación de leads de diferentes fuentes → Mitigación: algoritmo de matching fuzzy
- [ ] Calidad de datos inconsistente → Mitigación: validaciones estrictas + scoring
- [ ] Sobrecarga de leads sin asignar → Mitigación: auto-assignment round-robin
- [ ] SLA incumplimiento → Mitigación: alerts tempranas + dashboard de performance
- [ ] Resistencia de equipo comercial → Mitigación: capacitación + UX intuitivo

### 14. Estado de la Especificación
- [ ] Borrador inicial
- [ ] Revisión con stakeholders
- [ ] Aprobación de Product Owner
- [ ] Revisión técnica (backend + frontend + QA)
- [ ] Versión final aprobada
- [ ] Lista para implementación

---

## 🧪 Pruebas Requeridas para la Implementación (futuras)

Una vez implementada, esta especificación requerirá:

### API Tests
- [ ] 100% endpoints cubiertos
- [ ] Casos de éxito y error validados
- [ ] Auth y permissions testeados
- [ ] Validaciones de input verificadas

### Integration Tests
- [ ] DB queries optimizadas
- [ ] Events y listeners funcionando
- [ ] Jobs asíncronos (emails, notificaciones)
- [ ] Caching strategy validada

### E2E Tests
- [ ] Flujos principales cubiertos (crear, filtrar, asignar, convertir)
- [ ] Roles y permisos validados en UI
- [ ] Performance visual (loading states, errores)

---

## 🔍 Validaciones Obligatorias para la Especificación

Antes de marcar SPEC-001 como completada:

- [ ] **Revisión con Stakeholders:** Product Owner valida reglas de negocio
- [ ] **Revisión Técnica:** Tech Lead valida viabilidad arquitectónica
- [ ] **Revisión QA:** QA Lead valida criterios de aceptación testeables
- [ ] **Consistencia con ADRs:** No contradice decisiones arquitectónicas
- [ ] **Consistencia con API existente:** Endpoints alineados con estándares
- [ ] **Design System:** Componentes requeridos existen o están planificados
- [ ] **Base de Datos:** Schema alineado con migraciones existentes
- [ ] **Seguridad:** Auth y authorization revisados por security champion

---

## 📄 Documentación a Actualizar (post-implementación)

- [ ] `docs/specifications/SPEC-001_lead_management.md` — Especificación creada
- [ ] `docs/05_API_CONTRACT.md` — Endpoints agregados
- [ ] `docs/04_APPLICATIONS.md` — Admin app actualizada
- [ ] `docs/tracking/MASTER_TRACKING.md` — Estado actualizado
- [ ] `README.md` — Features list actualizado

---

## ⚠️ Riesgos Conocidos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Especificación demasiado ambiciosa | Media | ALTO | Priorizar MVP (CRUD + filtros + asignación) |
| Reglas de negocio cambian durante implementación | Alta | MEDIO | Mantener spec versionada, comunicación constante con PO |
| Dependencias con otras specs no mapeadas | Media | MEDIO | Revisar SPEC-002 (Opportunities) para alineación |
| Performance issues con grandes volúmenes | Baja | ALTO | Incluir requirements de performance explícitos |

---

## 📊 Métricas de Éxito de la Especificación

- [ ] 100% criterios de aceptación son verificables mediante tests
- [ ] Zero ambigüedades detectadas en revisión técnica
- [ ] Todos los stakeholders firman aprobación
- [ ] Equipos de backend/frontend/QA pueden estimar esfuerzo sin dudas

---

## 📝 Historial de Cambios

| Fecha | Cambio | Autor | Evidencia |
|-------|--------|-------|-----------|
| 2024-09-04 | Tarea creada | Architect | docs/tracking/MASTER_TRACKING.md |
| - | - | - | - |

---

## 🔗 Referencias

- [AUDITORÍA DE LEADS EXISTENTES](../30_AUDITORIA_PROFUNDA_Y_ESTADO_REAL.md) — Sección Mini CRM
- [BACKEND MODELS](../../apps/api/src/backend/app/Models/Lead.php) — Modelo actual
- [BACKEND ROUTES](../../apps/api/src/backend/routes/api.php) — Rutas existentes
- [ADR-001](../adr/ADR-001_admin_routing_strategy.md) — Admin routing
- [DESIGN SYSTEM COMPONENTS](../../packages/design-system/src/src/components/) — Componentes disponibles

---

## ✉️ Notas para el Spec Writer

1. **Sé específico:** Evita adjetivos vagos ("rápido", "fácil"). Usa números ("< 500ms", "< 3 clicks")
2. **Incluye ejemplos:** Para cada endpoint, muestra request/response reales
3. **Define "Done":** Cada feature debe tener criterios binarios (pasa/no pasa)
4. **Considera edge cases:** ¿Qué pasa si el lead no tiene email? ¿Si está duplicado?
5. **Alinea con negocio:** Cada regla debe tener un "por qué" de negocio detrás
6. **Mantén versionado:** Si cambia, incrementa versión (SPEC-001 v1.0, v1.1, etc.)

---

**Estado Actual:** ⬜ BACKLOG (Dependencias listas, pendiente inicio)  
**Bloqueos:** Ninguno  
**Estimado de Esfuerzo:** 6-8 horas para escribir especificación completa  
