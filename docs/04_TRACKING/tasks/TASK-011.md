# TASK-011 — Capa de Servicios API (Client) para Admin

**Fase:** FASE 7 — Foundation  
**Estado:** 🔄 READY  
**Prioridad:** 🔴 CRÍTICO  
**Responsable:** Backend Lead / Frontend Lead  
**Fecha Creación:** 2024-09-04  
**Última Actualización:** 2024-09-04  

---

## 🎯 Objetivo

Implementar una capa de cliente API centralizada para la aplicación Admin, con interceptores de autenticación (Sanctum), manejo de errores global, reintentos inteligentes y tipos TypeScript para todos los endpoints del backend.

---

## 📋 Dependencias

| ID Tarea | Nombre | Estado Requerido |
|----------|--------|------------------|
| TASK-000A | Aprobación Auditoría | ✅ DONE |
| TASK-003 | SPEC-001 Lead Management | 🔄 READY |
| TASK-004 | SPEC-002 Opportunity Search | 🔄 READY |
| TASK-009 | Estructura de Directorios Base | 🔄 READY |

---

## 📂 Archivos Afectados

### Nuevos
```
apps/admin/src/shared/api/
├── client.ts                 # Instancia Axios base con interceptores
├── auth.ts                   # Interceptores de autenticación Sanctum
├── errors.ts                 # Manejo de errores global
├── types.ts                  # Tipos de respuesta API
└── index.ts                  # Export público

apps/admin/src/features/leads/services/
└── leadApi.ts                # Endpoints específicos de leads

apps/admin/src/features/opportunities/services/
└── opportunityApi.ts         # Endpoints específicos de oportunidades

apps/admin/src/features/newsletter/services/
└── newsletterApi.ts          # Endpoints específicos de newsletter

apps/admin/src/features/blog/services/
└── blogApi.ts                # Endpoints específicos de blog
```

### Modificados
- `apps/admin/package.json` — Agregar axios como dependencia
- `apps/admin/.env` — Agregar VITE_API_BASE_URL

---

## ✅ Criterios de Aceptación

### Cliente Base
- [ ] Instancia Axios configurada con baseURL desde variables de entorno
- [ ] Interceptor de request agrega header `X-XSRF-TOKEN` automáticamente
- [ ] Interceptor de response maneja errores 401 (redirigir a login)
- [ ] Interceptor de response maneja errores 403 (mostrar toast de permisos)
- [ ] Interceptor de response maneja errores 422 (validaciones de Laravel)
- [ ] Reintento automático para errores 5xx (máx 3 intentos, backoff exponencial)
- [ ] Timeout configurado (30s por defecto)
- [ ] Cancel token support para requests cancelables (ej: búsqueda en tiempo real)

### Autenticación
- [ ] CSRF cookie se obtiene automáticamente al montar la app
- [ ] Token Sanctum se incluye en cada request después de login
- [ ] Logout invalida sesión correctamente
- [ ] Refresh token mechanism implementado (si aplica)

### Tipos TypeScript
- [ ] Interface `ApiResponse<T>` genérica definida
- [ ] Interface `ApiError` con código, mensaje y detalles
- [ ] Tipos específicos para cada endpoint (request/response)
- [ ] Tipos exportados públicamente desde `@shared/api`

### Servicios por Feature
- [ ] `leadApi.ts`: getAll, getById, create, update, delete, search, getStats
- [ ] `opportunityApi.ts`: search, convertToLead, getSources, getQualityScore
- [ ] Cada servicio usa el client base, no crea instancias nuevas de Axios

---

## 🧪 Pruebas Requeridas

### Unit Tests
- [ ] Test de interceptor de auth (agrega headers correctamente)
- [ ] Test de interceptor de errores (maneja 401, 403, 422, 500)
- [ ] Test de retry logic (reintenta solo en casos correctos)
- [ ] Test de cada método en leadApi (mock de Axios)
- [ ] Test de cada método en opportunityApi (mock de Axios)

### Integration Tests
- [ ] Test de flujo completo: login → request → response
- [ ] Test de manejo de sesión expirada
- [ ] Test de cancelación de requests (búsqueda que cambia rápido)

### E2E Tests
- [ ] Flujo de autenticación completo
- [ ] Request fallido muestra error UI correctamente
- [ ] Request exitoso actualiza estado de la app

---

## 🔍 Validaciones Obligatorias

Antes de marcar como DONE, verificar:

- [ ] **Lint:** `npm run lint` sin errores
- [ ] **Type Check:** `npm run typecheck` sin errores de tipos
- [ ] **Build:** `npm run build` exitoso
- [ ] **Tests:** `npm run test` con >90% cobertura en servicios API
- [ ] **Documentación:** Guía de uso de API client creada
- [ ] **Changelog:** IMPLEMENTATION_GUIDE.md actualizado
- [ ] **Variables de Entorno:** `.env.example` actualizado con VITE_API_BASE_URL

---

## 📄 Documentación a Actualizar

- [ ] `docs/implementation/api-client-setup.md` — Nueva documentación
- [ ] `docs/tracking/MASTER_TRACKING.md` — Estado de esta tarea
- [ ] `IMPLEMENTATION_GUIDE.md` — Sección FASE 7
- [ ] `apps/admin/README.md` — Ejemplos de uso del API client
- [ ] `apps/admin/.env.example` — Variables requeridas

---

## ⚠️ Riesgos Conocidos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| CORS mal configurado en backend | Alta | Alto | Verificar config CORS en Laravel antes de empezar |
| CSRF token no se propaga | Media | Alto | Seguir documentación oficial de Laravel Sanctum |
| Memory leaks con cancel tokens | Baja | Medio | Usar AbortController correctamente, limpiar en useEffect |
| Tipos desactualizados vs backend | Media | Medio | Generar tipos desde OpenAPI/Scalar si es posible |

---

## 🚧 Bloqueos Actuales

Ninguno

---

## 📆 Historial de Cambios

| Fecha | Estado Anterior | Estado Nuevo | Cambio | Responsable |
|-------|-----------------|--------------|--------|-------------|
| 2024-09-04 | BACKLOG | READY | Dependencias TASK-003, TASK-004, TASK-009 completadas | Architect |

---

## 🔗 Enlaces Relacionados

- [SPEC-001](../specifications/SPEC-001_Lead_Management.md) — Endpoints de Leads
- [SPEC-002](../specifications/SPEC-002_Opportunity_Search.md) — Endpoints de Oportunidades
- [TASK-009](./TASK-009.md) — Estructura de directorios
- [Laravel Sanctum Docs](https://laravel.com/docs/sanctum) — Autenticación SPA
- [Axios Interceptors](https://axios-http.com/docs/interceptors) — Documentación oficial

---

## 📊 Evidencia de Completado

[VERIFICADO — CÓDIGO]
- `client.ts` instancia Axios con interceptores configurados
- `auth.ts` maneja CSRF y tokens Sanctum
- `errors.ts` clasifica errores por tipo (Auth, Validation, Server)
- Servicios por feature implementados con tipos específicos

[VERIFICADO — TEST]
- Unit tests para interceptores passing (>90% cobertura)
- Integration tests de flujo auth pasando
- E2E tests de requests HTTP pasando

[VERIFICADO — BUILD]
- Build exitoso sin warnings de tipos
- Tree-shaking funciona (solo se incluye lo usado)

[VERIFICADO — DOCUMENTACIÓN]
- `docs/implementation/api-client-setup.md` creada con ejemplos
- `.env.example` actualizado
- README de Admin con guía de uso

---

## 💻 EJEMPLOS DE USO

### Configuración Básica
```typescript
// apps/admin/src/shared/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});
```

### Uso en un Servicio
```typescript
// apps/admin/src/features/leads/services/leadApi.ts
import { apiClient } from '@shared/api/client';
import type { Lead, LeadFilters, LeadResponse } from '../types/lead.types';

export const leadApi = {
  async getAll(filters: LeadFilters): Promise<LeadResponse> {
    const { data } = await apiClient.get<LeadResponse>('/api/v1/admin/leads', { params: filters });
    return data;
  },

  async getById(id: number): Promise<Lead> {
    const { data } = await apiClient.get<Lead>(`/api/v1/admin/leads/${id}`);
    return data;
  },

  async create(leadData: Partial<Lead>): Promise<Lead> {
    const { data } = await apiClient.post<Lead>('/api/v1/admin/leads', leadData);
    return data;
  },
};
```

### Uso en un Hook
```typescript
// apps/admin/src/features/leads/hooks/useLeads.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { leadApi } from '../services/leadApi';

export function useLeads(filters: LeadFilters) {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: () => leadApi.getAll(filters),
  });
}
```

---

**Nota:** Esta capa es CRÍTICA para toda la comunicación con el backend. Un mal diseño aquí generará duplicación de código, errores de autenticación y dificultades de mantenimiento en todas las features.
