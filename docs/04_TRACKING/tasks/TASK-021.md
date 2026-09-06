# TASK-021 — Opportunity Search: Señales de Negocio Reales + Modelo de Datos Faltante

**Fase:** FASE 15 — Cierre de Brechas Funcionales (Requisito 6.4)
**Estado:** ⬜ BACKLOG
**Prioridad:** 🔴 CRÍTICO (el job actual es un stub sin efecto real)
**Responsable:** Backend Lead
**Fecha Creación:** 2026-09-05
**Implementa:** [SPEC-002 v1.1 — Adendo](../../02_SPECIFICATIONS/SPEC-002_Opportunity_Search.md#16-adendo-v11--señales-de-negocio-reales-tipo-google-business-profile-y-corrección-de-modelo-de-datos)

---

## 🎯 Objetivo

Cerrar el gap más crítico detectado en auditoría del requisito 6.4: `FindOpportunitiesJob.php` es un stub (LinkedIn e industry directories retornan `[]`, Google Maps solo trae datos básicos), y las tablas `opportunities`/`scraping_jobs` que la propia SPEC-002 define nunca se crearon (los resultados se insertan directo como `Lead`, sin scoring ni revisión).

## 📂 Alcance

### 1. Modelo de Datos (bloqueante para todo lo demás)
- [ ] Migración `opportunities` (según interface `Opportunity`, SPEC-002 §4)
- [ ] Migración `scraping_jobs` (según interface `ScrapingJob`, SPEC-002 §4)
- [ ] Migrar el flujo de `FindOpportunitiesJob` para que inserte en `opportunities`, no directo en `leads`

### 2. Señales de Negocio (SPEC-002 §16.2)
- [ ] Agregar campos de `OpportunityBusinessSignals` al modelo `Opportunity`
- [ ] Lógica de `recommendedService` según señales detectadas

### 3. Fuentes de Datos (SPEC-002 §16.3)
- [ ] Extender `fetchFromGoogleMaps()` para consultar **Place Details** además de Nearby Search, poblando `hasWebsite`, `websiteUrl`, `contactChannels`
- [ ] Decisión de producto requerida: ¿se mantiene `fetchFromLinkedIn()` como fuente activa? Requiere revisión legal de Términos de Servicio de LinkedIn antes de implementar scraping real — **no implementar sin esa validación**
- [ ] `fetchFromIndustryDirectories()`: definir directorios objetivo según los servicios que se estén ofreciendo en la campaña de prospección vigente antes de implementar (no implementar genérico sin caso de uso concreto)

### 4. Frontend (Admin)
- [ ] `OpportunitySearchPage` (definida conceptualmente en SPEC-002, nunca construida) — formulario de búsqueda por criterios + resultados
- [ ] `OpportunityCard` mostrando `recommendedService` de forma prominente
- [ ] Flujo de revisión/conversión manual: Opportunity → Lead (con Quality Score visible antes de convertir)

## ✅ Criterios de Aceptación

Ver SPEC-002 §16.4 (CA017–CA020) más los criterios originales de SPEC-002 §11 aplicables.

## ⚠️ Riesgos

| Riesgo | Mitigación |
|---|---|
| Scraping de LinkedIn viola ToS | No implementar sin aprobación legal explícita; considerar eliminarlo de las fuentes activas si no se resuelve |
| Cuota/costo de Google Places API (Place Details tiene costo por llamada) | Cachear resultados por `place_id`, limitar frecuencia de refresco por zona geográfica |

## 📆 Historial de Cambios

| Fecha | Estado | Cambio | Responsable |
|---|---|---|---|
| 2026-09-05 | BACKLOG | Creación — implementa SPEC-002 v1.1 (gap 6.4) | Technical Lead |
