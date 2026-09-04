# 📖 ESPECIFICACIÓN FUNCIONAL — LEAD MANAGEMENT (SPEC-001)

**ID:** SPEC-001  
**Versión:** 1.0  
**Estado:** ✅ APROBADA Y LISTA PARA IMPLEMENTACIÓN  
**Fecha Aprobación:** 2024-09-04  
**Prioridad:** 🔴 CRÍTICO  
**Relacionado a:** TASK-005, TASK-003

---

## 1. OBJETIVO

Proporcionar un sistema completo de gestión de Leads (MiniCRM) que permita al equipo de ventas:
- Visualizar todos los leads en una tabla paginada con filtros avanzados
- Buscar leads por nombre, email, teléfono o empresa
- Filtrar por estado, calidad, fuente y fecha de creación
- Ver detalle completo de cada lead con historial de interacciones
- Cambiar estado de leads de forma rápida
- Agregar notas y registrar interacciones
- Asignar leads a usuarios del equipo
- Convertir oportunidades en leads

---

## 2. ALCANCE

### ✅ Incluye
- Listado de leads con paginación cursor-based (20 items por página)
- Filtros combinables: estado, calidad, fuente, rango de fechas
- Búsqueda global con debounce 300ms
- Modal de detalle con pestañas (Info, Interacciones, Notas, Historial)
- Acciones rápidas desde la tabla (cambiar estado, asignar, editar)
- Estadísticas resumen (total, nuevos hoy, por estado, por calidad)
- Exportación a CSV (futuro cercano)
- Tests E2E completos del flujo CRUD

### ❌ Fuera de Alcance (v1.0)
- Automatización de email marketing
- Integración con WhatsApp API
- Scoring predictivo con ML
- Pipeline de ventas avanzado (kanban)
- Reportes PDF automatizados

---

## 3. ACTORES Y ROLES

| Rol | Permisos |
|-----|----------|
| **Admin** | CRUD completo, ver todos los leads, asignar a cualquier usuario |
| **Sales Manager** | CRUD completo, ver leads asignados a su equipo, reasignar |
| **Sales Rep** | Ver/editar leads asignados, cambiar estado, agregar notas |
| **Viewer** | Solo lectura de leads asignados |

---

## 4. MODELO DE DATOS

### Lead Entity
```typescript
interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  quality: 'A' | 'B' | 'C' | 'D';
  source: 'website' | 'linkedin' | 'referral' | 'scraping' | 'manual';
  assignedTo?: User;
  location?: Location;
  score: number; // 0-100
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  interactions: LeadInteraction[];
  notes: LeadNote[];
}
```

### LeadInteraction
```typescript
interface LeadInteraction {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'whatsapp' | 'other';
  description: string;
  date: Date;
  userId: string;
  leadId: string;
}
```

### LeadNote
```typescript
interface LeadNote {
  id: string;
  content: string;
  userId: string;
  leadId: string;
  createdAt: Date;
  isPinned: boolean;
}
```

---

## 5. API CONTRACT

### GET /api/v1/admin/leads
**Descripción:** Listar leads con paginación y filtros

**Query Params:**
```
?page=1&limit=20
&status=new,contacted
&quality=A,B
&source=website,linkedin
&search=juan
&dateFrom=2024-01-01
&dateTo=2024-12-31
&assignedTo=user-id
&sortBy=createdAt
&sortOrder=desc
```

**Response 200:**
```json
{
  "data": [Lead],
  "meta": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 98,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextCursor": "eyJpZCI6MjB9",
    "prevCursor": null
  },
  "stats": {
    "total": 98,
    "new": 12,
    "contacted": 34,
    "qualified": 28,
    "converted": 18,
    "lost": 6
  }
}
```

### GET /api/v1/admin/leads/:id
**Descripción:** Obtener detalle completo de un lead

**Response 200:** Lead completo con relaciones (interactions, notes, assignedUser)

### POST /api/v1/admin/leads
**Descripción:** Crear nuevo lead manualmente

**Request:**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@empresa.com",
  "phone": "+57 300 123 4567",
  "company": "Empresa SAS",
  "position": "Gerente",
  "source": "manual",
  "quality": "B"
}
```

**Response 201:** Lead creado

### PUT /api/v1/admin/leads/:id
**Descripción:** Actualizar lead completo

### PATCH /api/v1/admin/leads/:id/status
**Descripción:** Cambiar solo el estado (acción rápida)

**Request:**
```json
{
  "status": "contacted",
  "reason": "Primera llamada realizada"
}
```

### POST /api/v1/admin/leads/:id/interactions
**Descripción:** Registrar nueva interacción

### POST /api/v1/admin/leads/:id/notes
**Descripción:** Agregar nota

### DELETE /api/v1/admin/leads/:id
**Descripción:** Eliminar lead (soft delete)

### GET /api/v1/admin/leads/stats/summary
**Descripción:** Obtener estadísticas resumen para dashboard

---

## 6. FRONTEND SPECIFICATION

### Componentes Requeridos

#### LeadsPage (Feature Component)
- Layout principal con header, filtros, tabla y stats
- Estado: loading, error, success, empty
- Refetch automático cada 5 minutos

#### LeadsTable
- Columnas: Nombre, Email, Empresa, Estado, Calidad, Fuente, Asignado, Fecha, Acciones
- Ordenamiento por columnas clickeables
- Checkbox para selección múltiple (futuro)
- Row actions dropdown (ver, editar, cambiar estado, eliminar)

#### LeadFilters
- Select múltiple para Estados
- Select múltiple para Calidades
- Select múltiple para Fuentes
- DateRangePicker para fecha creación
- Input de búsqueda global
- Botones: "Aplicar Filtros", "Limpiar Filtros"

#### LeadDetailModal
- Pestañas: Información, Interacciones, Notas, Historial
- Formulario editable en pestaña Información
- Timeline de interacciones
- Lista de notas con pinning
- Botones de acción rápida

#### QualityScoreBadge
- Visualización circular con color según score (A=verde, D=rojo)
- Tooltip explicativo

#### StatusBadge
- Badge con color según estado
- Dropdown rápido para cambio de estado

### Estados UI
- **Loading:** Skeleton en tabla
- **Error:** AlertBanner con mensaje y botón retry
- **Empty:** EmptyState ilustrado con CTA "Crear primer lead"
- **Success:** Tabla con datos

---

## 7. REGLAS DE NEGOCIO

### RB001 — Quality Score Calculation
```
Score = (CompletitudDatos * 0.3) + (FuenteCalificada * 0.4) + (InteraccionesRecientes * 0.3)

CompletitudDatos: % campos obligatorios llenos
FuenteCalificada: website=100, linkedin=80, referral=90, scraping=60, manual=50
InteraccionesRecientes: +10 puntos si hay interacción en últimos 7 días
```

### RB002 — Auto-Assignment (Futuro)
Leads nuevos se asignan round-robin al equipo de ventas disponible.

### RB003 — SLA de Contacto
Leads en estado "new" por más de 24 horas generan alerta al manager.

### RB004 — Prevención de Duplicados
Al crear lead, verificar existencia por email y teléfono. Mostrar advertencia si existe.

### RB005 — Audit Log
Todo cambio de estado o asignación queda registrado en audit_log table.

---

## 8. CRITERIOS DE ACEPTACIÓN

### Funcionales
- [ ] CA001: Listado muestra exactamente 20 items por página
- [ ] CA002: Paginación funciona correctamente (next, prev, saltar a página)
- [ ] CA003: Filtros se combinan con lógica AND
- [ ] CA004: Búsqueda tiene debounce de 300ms
- [ ] CA005: Detalle modal carga en menos de 500ms
- [ ] CA006: Cambio de estado se refleja inmediatamente sin recargar
- [ ] CA007: Notas se guardan con timestamp y usuario actual
- [ ] CA008: Stats resumen coinciden con conteo real de leads

### No Funcionales
- [ ] CA009: Lighthouse Performance > 90
- [ ] CA010: Lighthouse Accessibility > 95 (WCAG AA)
- [ ] CA011: Tiempo de carga inicial < 2 segundos
- [ ] CA012: Soporta 1000+ leads sin degradación (virtual scrolling si necesario)

### Seguridad
- [ ] CA013: Usuarios solo ven leads asignados (excepto Admin/Manager)
- [ ] CA014: Rate limiting en endpoints de creación (10/min)
- [ ] CA015: CSRF protection habilitado
- [ ] CA016: PII (email, teléfono) enmascarado para rol Viewer

---

## 9. TESTING REQUIREMENTS

### API Tests (12 casos mínimos)
1. GET /leads sin filtros → 200 con data
2. GET /leads con filtro status=new → 200 con subset
3. GET /leads con filtros combinados → 200 con intersección correcta
4. GET /leads?page=2 → 200 con siguiente página
5. GET /leads/:id existente → 200 con lead completo
6. GET /leads/:id inexistente → 404
7. POST /leads con datos válidos → 201
8. POST /leads con email duplicado → 409
9. PATCH /leads/:id/status → 200 con estado actualizado
10. DELETE /leads/:id → 204
11. GET /leads sin autenticación → 401
12. GET /leads con rol viewer → 200 solo leads asignados

### Integration Tests (4 casos)
1. Crear lead → verificar evento disparado → verificar email enviado
2. Cambiar estado → verificar audit log creado
3. Agregar nota → verificar notificación a asignado
4. Filtro por fecha → verificar query SQL correcto

### E2E Tests (8 flujos Gherkin)
```gherkin
Feature: Lead Management

Scenario: Ver listado de leads con filtros
  Given estoy autenticado como Sales Rep
  When navego a /admin/leads
  Then veo tabla con 20 leads
  When filtro por estado "new"
  Then veo solo leads nuevos
  
Scenario: Crear lead manualmente
  Given estoy en /admin/leads
  When hago clic en "Nuevo Lead"
  Y completo formulario con datos válidos
  Y guardo
  Entonces veo modal de detalle del lead creado
  
Scenario: Cambiar estado rápidamente
  Given estoy viendo listado de leads
  When selecciono un lead "new"
  Y cambio estado a "contacted" desde dropdown
  Then el badge se actualiza inmediatamente
  
Scenario: Buscar lead por email
  Given tengo 100 leads cargados
  Cuando escribo "juan@empresa" en buscador
  Entonces la tabla filtra en tiempo real
  Y veo solo leads que matchean
```

### Unit Tests (>90% cobertura)
- useLeads hook (filtrado, paginación, búsqueda)
- scoringAlgorithm function
- validation schemas (zod/yup)
- utils (formatPhone, formatDate, maskEmail)

---

## 10. OBSERVABILIDAD

### Logging
- INFO: Lead creado, estado cambiado, nota agregada
- WARN: Intento de acceso no autorizado, duplicado detectado
- ERROR: Fallo en creación, fallo en envío de email

### Métricas Prometheus
```
leads_created_total{source, quality}
leads_status_changed_total{from_status, to_status}
leads_assigned_total{user_id}
lead_search_duration_seconds{quantile}
lead_page_load_duration_seconds{quantile}
```

### Alerts
- Lead nuevo sin asignar por > 24 horas
- Tasa de conversión < 10% en última semana
- Error rate en API > 5%

---

## 11. DEPENDENCIAS

### Internas
- Design System componentes: DataTable, Badge, Modal, Select, Input, Button
- API Client configurado con interceptores
- Auth context con usuario actual
- Types compartidos (@farutech/types)

### Externas
- Backend API endpoints implementados
- Database migrations ejecutadas
- Redis para caché (opcional)

---

## 12. RIESGOS Y MITIGACIÓN

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| API lenta con muchos leads | Media | Alto | Virtual scrolling, server-side pagination |
| Duplicación de leads | Alta | Medio | Validación backend + frontend, warning UI |
| Pérdida de datos en edición | Baja | Alto | Auto-save draft, confirmación antes de salir |
| Confusión en estados | Media | Bajo | Tooltips, documentación inline, colores distintivos |

---

## 13. PROMPT DE IMPLEMENTACIÓN PARA DEV

```markdown
## 🚀 IMPLEMENTAR TASK-005: ADMIN LEADS PAGE

### Contexto
Ya existe SPEC-001 aprobada con todos los detalles funcionales, API contract y criterios de aceptación.

### Lo que debes hacer:
1. Crear estructura de carpetas en `apps/admin/src/features/leads/`
2. Implementar componentes según especificación frontend
3. Conectar con API endpoints existentes (ver SPEC-001 sección 5)
4. Agregar tests unitarios y E2E según sección 9
5. Validar criterios de aceptación sección 8

### Archivos a crear:
- features/leads/pages/LeadsPage.tsx
- features/leads/components/LeadsTable.tsx
- features/leads/components/LeadFilters.tsx
- features/leads/components/LeadDetailModal.tsx
- features/leads/components/QualityScoreBadge.tsx
- features/leads/components/StatusBadge.tsx
- features/leads/hooks/useLeads.ts
- features/leads/services/leadApi.ts
- features/leads/types/lead.types.ts
- tests/e2e/admin/leads-crud.feature
- tests/unit/features/leads/useLeads.test.ts

### Comandos útiles:
npm run dev              # Desarrollo local
npm run test:unit        # Tests unitarios
npm run test:e2e         # Tests E2E
npm run lint             # Validar código
npm run build            # Build de producción

### Criterios de DONE:
✅ Todos los componentes implementados
✅ API integration funcionando
✅ Tests unitarios >90% cobertura
✅ Tests E2E pasando (8 escenarios)
✅ Lighthouse >90 performance, >95 accessibility
✅ Code review aprobado
✅ Documentación actualizada en IMPLEMENTATION_GUIDE.md

### ¡Importante!
- Reutilizar componentes del Design System
- Seguir patrones Feature-Sliced Design
- No duplicar lógica HTTP (usar client existente)
- Mantener tipos TypeScript estrictos
```

---

## 14. HISTORIAL DE CAMBIOS

| Versión | Fecha | Cambio | Autor |
|---------|-------|--------|-------|
| 1.0 | 2024-09-04 | Creación inicial aprobada | Architect |

---

**© 2024 Farutech — SPEC-001 v1.0**
