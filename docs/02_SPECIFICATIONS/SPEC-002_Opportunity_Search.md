# 📖 ESPECIFICACIÓN FUNCIONAL — OPPORTUNITY SEARCH (SPEC-002)

**ID:** SPEC-002  
**Versión:** 1.0  
**Estado:** ✅ APROBADA Y LISTA PARA IMPLEMENTACIÓN  
**Fecha Aprobación:** 2024-09-04  
**Prioridad:** 🔴 CRÍTICO  
**Relacionado a:** TASK-006, TASK-004

---

## 1. OBJETIVO

Proporcionar un sistema de búsqueda y descubrimiento de oportunidades de negocio que permita:
- Buscar oportunidades desde múltiples fuentes (LinkedIn, portales, scraping ético)
- Visualizar resultados con scoring de calidad automático
- Filtrar por fuente, ubicación, industria y score
- Convertir oportunidades en leads con un clic
- Monitorear estado de jobs de scraping asíncronos
- Prevenir duplicados antes de conversión

---

## 2. ALCANCE

### ✅ Incluye
- Buscador multifuento con selector de fuentes
- Algoritmo de Quality Score (A/B/C/D) basado en completitud y fuente
- Visualización de resultados en grid o lista
- Filtros combinables: fuente, ubicación, industria, score mínimo
- Panel de estado de scraping en tiempo real
- Conversión oportunidad → lead con mapeo de datos
- Detección de duplicados por email/teléfono/empresa
- Historial de búsquedas guardadas (futuro cercano)
- Tests E2E del flujo completo

### ❌ Fuera de Alcance (v1.0)
- Scraping en tiempo real (todo asíncrono via jobs)
- Integración directa con APIs de LinkedIn (solo scraping web público)
- Enriquecimiento automático con datos externos
- Alertas de nuevas oportunidades
- Machine Learning para predicción de conversión

---

## 3. ACTORES Y ROLES

| Rol | Permisos |
|-----|----------|
| **Admin** | Ver todas las oportunidades, ejecutar scraping, convertir cualquier opportunity |
| **Sales Manager** | Ver oportunidades del equipo, ejecutar scraping, convertir |
| **Sales Rep** | Ver oportunidades no asignadas, convertir a leads propios |
| **Viewer** | Solo lectura de oportunidades |

---

## 4. MODELO DE DATOS

### Opportunity Entity
```typescript
interface Opportunity {
  id: string;
  title: string; // Cargo o posición detectada
  personName: string;
  email?: string;
  phone?: string;
  company: string;
  industry?: string;
  location?: Location;
  source: 'linkedin' | 'portal' | 'direct' | 'scraping';
  url: string; // URL original de la oportunidad
  rawHtml: string; // HTML crudo para parsing futuro
  qualityScore: number; // 0-100
  qualityGrade: 'A' | 'B' | 'C' | 'D';
  isConverted: boolean;
  convertedLeadId?: string;
  scrapedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>; // Datos extra específicos de fuente
}
```

### ScrapingJob Entity
```typescript
interface ScrapingJob {
  id: string;
  source: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  totalItems: number;
  processedItems: number;
  successCount: number;
  errorCount: number;
  startedAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
  userId: string; // Quién ejecutó el job
}
```

---

## 5. ALGORITMO DE QUALITY SCORE

### Fórmula Oficial
```typescript
function calculateQualityScore(opportunity: Opportunity): number {
  const completenessScore = calculateCompleteness(opportunity) * 0.4;
  const sourceScore = getSourceScore(opportunity.source) * 0.35;
  const recencyScore = calculateRecencyScore(opportunity.scrapedAt) * 0.25;
  
  return Math.round(completenessScore + sourceScore + recencyScore);
}

function calculateCompleteness(opp: Opportunity): number {
  const requiredFields = ['personName', 'company', 'email', 'phone', 'location'];
  const filledFields = requiredFields.filter(field => opp[field] !== undefined);
  return filledFields.length / requiredFields.length;
}

function getSourceScore(source: string): number {
  const scores = {
    linkedin: 1.0,    // Fuente más confiable
    portal: 0.85,     // Portales de empleo
    direct: 0.75,     // Sitios directos de empresa
    scraping: 0.60    // Scraping genérico
  };
  return scores[source] || 0.5;
}

function calculateRecencyScore(scrapedAt: Date): number {
  const hoursSinceScraped = (Date.now() - scrapedAt.getTime()) / (1000 * 60 * 60);
  
  if (hoursSinceScraped < 24) return 1.0;
  if (hoursSinceScraped < 72) return 0.8;
  if (hoursSinceScraped < 168) return 0.6; // 1 semana
  return 0.4;
}
```

### Grados de Calidad
```typescript
function getQualityGrade(score: number): 'A' | 'B' | 'C' | 'D' {
  if (score >= 85) return 'A'; // Excelente, priorizar contacto
  if (score >= 70) return 'B'; // Buena, contactar pronto
  if (score >= 50) return 'C'; // Regular, considerar
  return 'D';                  // Baja, descartar o validar manualmente
}
```

---

## 6. API CONTRACT

### GET /api/v1/admin/opportunities
**Descripción:** Buscar oportunidades con filtros

**Query Params:**
```
?page=1&limit=20
&source=linkedin,portal
&qualityGrade=A,B
&minScore=70
&location=colombia
&industry=technology
&search=gerente
&isConverted=false
&sortBy=qualityScore
&sortOrder=desc
```

**Response 200:**
```json
{
  "data": [Opportunity],
  "meta": {
    "currentPage": 1,
    "totalPages": 8,
    "totalItems": 156,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "stats": {
    "total": 156,
    "bySource": {
      "linkedin": 89,
      "portal": 45,
      "direct": 22
    },
    "byGrade": {
      "A": 23,
      "B": 67,
      "C": 48,
      "D": 18
    },
    "converted": 34,
    "available": 122
  }
}
```

### GET /api/v1/admin/opportunities/:id
**Descripción:** Obtener detalle de oportunidad

**Response 200:** Opportunity completa con metadata

### POST /api/v1/admin/opportunities/:id/convert
**Descripción:** Convertir oportunidad en lead

**Request:**
```json
{
  "mapFields": {
    "firstName": "personName.split(' ')[0]",
    "lastName": "personName.split(' ')[1]",
    "email": "email",
    "phone": "phone",
    "company": "company",
    "position": "title",
    "source": "opportunity_source"
  },
  "assignTo": "user-id", // opcional
  "addTags": ["from-scraping", "linkedin"] // opcional
}
```

**Response 201:** Lead creado con referencia a opportunity original

### GET /api/v1/admin/opportunities/scraping-jobs
**Descripción:** Listar jobs de scraping recientes

**Response 200:** Array de ScrapingJob

### POST /api/v1/admin/opportunities/scraping-jobs
**Descripción:** Ejecutar nuevo job de scraping

**Request:**
```json
{
  "source": "linkedin",
  "filters": {
    "location": "colombia",
    "industry": "technology",
    "keywords": ["gerente", "director"]
  }
}
```

**Response 202:** Job creado con ID para polling

### GET /api/v1/admin/opportunities/scraping-jobs/:id
**Descripción:** Obtener estado de job específico

**Response 200:** ScrapingJob actualizado

### DELETE /api/v1/admin/opportunities/:id
**Descripción:** Eliminar oportunidad (no convertible)

---

## 7. FRONTEND SPECIFICATION

### Componentes Requeridos

#### OpportunitySearchPage
- Layout con header, buscador, filtros, grid de resultados
- Toggle vista grid/lista
- Estado: loading, error, empty, success

#### SourceSelector
- Selector múltiple con iconos de fuentes (LinkedIn, Portal, etc.)
- Badge con count de oportunidades por fuente
- Tooltip con información de cada fuente

#### QualityScoreIndicator
- Visualización circular o barra con score 0-100
- Color dinámico según grade (A=verde, D=rojo)
- Tooltip explicativo con desglose del score

#### ScrapingStatusPanel
- Lista de jobs recientes con estado
- Progress bar para jobs en progreso
- Botón "Ejecutar Nuevo Scraping"
- Auto-refresh cada 10 segundos para jobs activos

#### OpportunityCard (Grid View)
- Foto/avatar si disponible
- Nombre, cargo, empresa
- Badges: fuente, calidad, ubicación
- Score visible
- Botón rápido "Convertir"
- Warning si es duplicado

#### OpportunityRow (List View)
- Mismos datos que card pero en formato tabla
- Más compacto para visualizar muchos resultados

#### ConvertModal
- Preview de datos a mapear
- Select para asignar usuario
- Checkboxes para tags
- Advertencia de duplicado si existe
- Confirmación antes de convertir

### Estados UI
- **Loading:** Skeleton cards o rows
- **Error:** AlertBanner con retry
- **Empty:** EmptyState "No hay oportunidades, ejecuta scraping"
- **NoResults:** "No se encontraron resultados con estos filtros"
- **Success:** Grid/Lista con resultados

---

## 8. REGLAS DE NEGOCIO

### RB001 — Prevención de Duplicados en Conversión
Antes de convertir, verificar existencia de lead por:
1. Email exact match
2. Teléfono normalizado match
3. Empresa + nombre fuzzy match (85% similar)

Si existe duplicado: mostrar advertencia con opción de ver lead existente o forzar creación.

### RB002 — Límite de Conversiones por Usuario
Máximo 50 conversiones por usuario por día para evitar abuso.

### RB003 — Retención de Oportunidades
Oportunidades no convertidas se eliminan después de 90 días (GDPR compliance).

### RB004 — Scraping Ético
- Respetar robots.txt de cada fuente
- Rate limiting: máximo 1 request cada 3 segundos
- No hacer scraping de datos protegidos por login
- User-Agent identificable con contacto

### RB005 — Audit de Conversiones
Toda conversión queda registrada con:
- Usuario que convirtió
- Timestamp
- Datos originales vs datos mapeados
- Lead resultante ID

---

## 9. CRITERIOS DE ACEPTACIÓN

### Funcionales
- [ ] CA001: Búsqueda muestra resultados paginados (20 por página)
- [ ] CA002: Filtros se combinan correctamente (AND logic)
- [ ] CA003: Quality Score se calcula según fórmula oficial
- [ ] CA004: Grade visual corresponde al score numérico
- [ ] CA005: Conversión crea lead con datos mapeados correctamente
- [ ] CA006: Duplicados se detectan antes de crear lead
- [ ] CA007: Estado de scraping jobs se actualiza en tiempo real
- [ ] CA008: Stats resumen coinciden con datos reales

### No Funcionales
- [ ] CA009: Lighthouse Performance > 90
- [ ] CA010: Lighthouse Accessibility > 95 (WCAG AA)
- [ ] CA011: Búsqueda responde en < 500ms
- [ ] CA012: Soporta 500+ oportunidades sin lag

### Legales / Compliance
- [ ] CA013: Banner de política de scraping visible
- [ ] CA014: Robots.txt respetado en backend
- [ ] CA015: Rate limiting implementado (3s entre requests)
- [ ] CA016: Datos personales enmascarados para rol Viewer

---

## 10. TESTING REQUIREMENTS

### API Tests (10 casos)
1. GET /opportunities sin filtros → 200
2. GET /opportunities con filtro source=linkedin → 200 con subset
3. GET /opportunities con minScore=80 → solo grade A/B
4. POST /opportunities/:id/convert válido → 201 con lead
5. POST /opportunities/:id/convert duplicado → 409 con warning
6. POST /scraping-jobs → 202 con job ID
7. GET /scraping-jobs/:id → estado actualizado
8. DELETE /opportunities/:id → 204
9. GET sin autenticación → 401
10. GET con rol viewer → solo lectura

### Integration Tests (4 casos)
1. Ejecutar scraping job → opportunities creadas en DB
2. Convertir opportunity → lead creado + opportunity marcada isConverted=true
3. Duplicado detectado → lead no creado + respuesta 409
4. Job falla → error registrado + notificación enviada

### E2E Tests (6 flujos Gherkin)
```gherkin
Feature: Opportunity Search & Conversion

Scenario: Buscar oportunidades por fuente
  Given estoy autenticado como Sales Rep
  When navego a /admin/opportunities
  Y filtro por fuente "LinkedIn"
  Then veo solo oportunidades de LinkedIn
  
Scenario: Ver quality score visual
  Given hay oportunidades con diferentes scores
  Then las grade A se muestran en verde
  Y las grade D se muestran en rojo
  
Scenario: Convertir oportunidad sin duplicados
  Given selecciono una oportunidad no duplicada
  When hago clic en "Convertir"
  Y confirmo el modal
  Then se crea un lead nuevo
  Y la oportunidad marca isConverted=true
  
Scenario: Duplicado detectado en conversión
  Given selecciono oportunidad con email existente
  When intento convertir
  Then veo advertencia de duplicado
  Y puedo ver el lead existente
  
Scenario: Ejecutar scraping job
  Given soy Admin
  When ejecuto scraping para LinkedIn
  Then veo job en estado "running"
  Y el progress bar avanza
  Y al completar veo nuevas oportunidades
  
Scenario: Filtrar por quality grade
  Given tengo oportunidades A, B, C, D
  Cuando filtro por grade A y B
  Entonces solo veo oportunidades de alta calidad
```

### Unit Tests (>90% cobertura)
- calculateQualityScore function
- getQualityGrade function
- isDuplicate detection algorithm
- mapOpportunityToLead utility
- validation schemas

---

## 11. OBSERVABILIDAD

### Logging
- INFO: Búsqueda realizada, oportunidad convertida, job iniciado
- WARN: Duplicado detectado, rate limit alcanzado
- ERROR: Scraping fallido, conversión fallida, API externa error

### Métricas Prometheus
```
opportunities_searched_total{source, filters}
opportunities_converted_total{source, quality_grade}
scraping_jobs_started_total{source}
scraping_jobs_duration_seconds{source, quantile}
duplicate_detection_rate{type}
conversion_success_rate{quantile}
```

### Alerts
- Scraping job falla 3 veces consecutivas
- Tasa de duplicados > 30%
- Error rate en conversiones > 10%

---

## 12. DEPENDENCIAS

### Internas
- Design System: Card, Badge, Modal, Select, Progress, Button
- API Client existente
- Auth context
- Types compartidos

### Externas
- Backend API endpoints
- Jobs de scraping implementados (FindOpportunitiesJob)
- Redis para colas de scraping
- Cheerio/Puppeteer para scraping (backend)

---

## 13. RIESGOS Y MITIGACIÓN

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Bloqueo por sitios scrapeados | Media | Alto | Rotación de user-agents, proxies, rate limiting estricto |
| Datos incorrectos en opportunities | Alta | Medio | Validación backend, flag de "requiere verificación" |
| Conversión masiva de baja calidad | Media | Bajo | Límite diario por usuario, aprobación manager para grade C/D |
| Problemas legales por scraping | Baja | Crítico | Revisión legal previa, respeto robots.txt, solo datos públicos |
| Performance con miles de opportunities | Media | Alto | Paginación server-side, índices DB en score y fuente |

---

## 14. REVISIÓN LEGAL (CRÍTICO)

### Checklist Legal Antes de Implementar
- [ ] Revisar términos de servicio de cada fuente (LinkedIn, portales)
- [ ] Verificar cumplimiento GDPR/Ley de Protección de Datos local
- [ ] Confirmar que solo se scrapean datos públicamente disponibles
- [ ] Incluir aviso de privacidad en UI
- [ ] Establecer proceso de opt-out para personas detectadas
- [ ] Documentar políticas internas de uso ético de scraping

### Aviso Legal en UI (Obligatorio)
```
⚠️ IMPORTANTE: Esta herramienta realiza scraping ético de fuentes públicas.
- Solo se recopilan datos disponibles públicamente
- Respetamos robots.txt y términos de servicio
- Uso exclusivo para fines comerciales legítimos
- No compartir datos con terceros sin consentimiento
- Cumplimiento GDPR y leyes locales de privacidad
```

---

## 15. PROMPT DE IMPLEMENTACIÓN PARA DEV

```markdown
## 🚀 IMPLEMENTAR TASK-006: ADMIN OPPORTUNITY SEARCH

### Contexto
Ya existe SPEC-002 aprobada con algoritmo de scoring, API contract y criterios de aceptación.

### Lo que debes hacer:
1. Crear estructura en `apps/admin/src/features/opportunities/`
2. Implementar componentes según especificación frontend
3. Conectar con API endpoints existentes
4. Agregar tests unitarios y E2E según sección 10
5. Incluir aviso legal obligatorio en UI
6. Validar criterios de aceptación sección 9

### Archivos a crear:
- features/opportunities/pages/OpportunitySearchPage.tsx
- features/opportunities/components/SourceSelector.tsx
- features/opportunities/components/QualityScoreIndicator.tsx
- features/opportunities/components/ScrapingStatusPanel.tsx
- features/opportunities/components/OpportunityCard.tsx
- features/opportunities/components/OpportunityRow.tsx
- features/opportunities/components/ConvertModal.tsx
- features/opportunities/hooks/useOpportunitySearch.ts
- features/opportunities/hooks/useScrapingJobs.ts
- features/opportunities/services/opportunityApi.ts
- features/opportunities/types/opportunity.types.ts
- features/opportunities/utils/calculateQualityScore.ts
- tests/e2e/admin/opportunity-to-lead.feature
- tests/unit/features/opportunities/scoring.test.ts

### Comandos útiles:
npm run dev              # Desarrollo local
npm run test:unit        # Tests unitarios
npm run test:e2e         # Tests E2E
npm run lint             # Validar código
npm run build            # Build de producción

### Criterios de DONE:
✅ Todos los componentes implementados
✅ Algoritmo de scoring funcionando exactamente según SPEC
✅ API integration completa
✅ Tests unitarios >90% cobertura
✅ Tests E2E pasando (6 escenarios)
✅ Aviso legal visible en UI
✅ Lighthouse >90 performance, >95 accessibility
✅ Code review aprobado
✅ Documentación actualizada

### ¡Importante!
- Reutilizar componentes del Design System
- NO hacer scraping desde frontend (solo backend jobs)
- Mostrar siempre aviso legal
- Respetar tipos TypeScript estrictos
```

---

## 16. HISTORIAL DE CAMBIOS

| Versión | Fecha | Cambio | Autor |
|---------|-------|--------|-------|
| 1.0 | 2024-09-04 | Creación inicial aprobada | Architect |

---

**© 2024 Farutech — SPEC-002 v1.0**
