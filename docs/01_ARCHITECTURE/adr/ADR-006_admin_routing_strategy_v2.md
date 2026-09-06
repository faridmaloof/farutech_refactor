# ADR-006 — Admin Routing Strategy v2: Path-Based `/admin` (Supersede ADR-001)

**Fecha:** 2026-09-05
**Estado:** ✅ DECIDIDO — Pendiente de ejecución (ver TASK-015)
**Responsable:** Technical Lead
**Supersede:** [ADR-001 — Admin Routing Strategy](ADR-001_admin_routing_strategy.md) (Alternativa A, subdominio)

---

## Contexto

ADR-001 decidió exponer el Admin Panel mediante subdominio independiente (`admin.farutech.local` / `admin.farutech.com`), priorizando aislamiento de cookies y despliegue independiente. Sin embargo:

1. **Nunca se implementó.** La auditoría de septiembre 2026 confirmó que `infrastructure/gateway/haproxy.cfg` no contiene ninguna regla de enrutamiento para `admin.*`, ni existe un contenedor `admin` definido en `infrastructure/docker-compose.yml`.
2. **El código ya se construyó asumiendo path, no subdominio.** `apps/admin/src/frontend/src/App.tsx` define rutas internas `/admin/login`, `/admin/dashboard`, `/admin/leads`, `/admin/settings` — un patrón típico de aplicación servida bajo un path, no bajo su propio host.
3. **Mandato explícito del Product Owner:** el panel de administración **debe** ser accesible obligatoriamente vía el path `/admin` sobre el mismo dominio del website (`farutech.com/admin`), y **no** debe existir una forma de acceder a él desde un dominio o subdominio distinto. Esto es una decisión de producto, no solo técnica: se busca que el admin sea percibido como parte de la misma superficie que el website, no como un servicio externo.

## Problema

¿Cómo servir el Admin Panel (proyecto Vite independiente, ver ADR-005 Alternativa C) bajo el path `/admin` del mismo dominio, sin perder la independencia del proyecto ni romper el build de Vite?

## Alternativas Consideradas

### Alternativa A: Subdominio (ADR-001 original)
- ❌ Descartada explícitamente por mandato de producto.

### Alternativa B: Fusionar el código de admin dentro del website como rutas lazy-loaded del mismo SPA
- ✅ Resolvería el path de forma trivial (mismo router, mismo dominio, mismo build)
- ❌ Elimina la independencia de despliegue del admin (contradice ADR-005 Alternativa C y el principio de "cada aplicación independiente")
- ❌ Acopla el ciclo de release del admin al del website público (un bug en admin bloquearía deploys del website y viceversa)
- ❌ El futuro dashboard de `platform` (ADR-007) reutilizará la base de este admin — fusionarlo ahora dificultaría esa extracción después

### Alternativa C: Admin como proyecto independiente, servido bajo `/admin` vía path-based routing en el gateway/reverse proxy (RECOMENDADA)
- ✅ Mantiene la independencia del proyecto (build, deploy, versión propios)
- ✅ Cumple el mandato de producto: una sola superficie de dominio, un solo punto de entrada (`farutech.com/admin`)
- ✅ El reverse proxy (nginx o HAProxy con `path_beg`) enruta `/admin/*` al contenedor del admin y todo lo demás al contenedor del website
- ⚠️ Requiere configurar Vite (`base: "/admin/"`) para que los assets compilados (`/admin/assets/*.js`) resuelvan correctamente bajo el subpath
- ⚠️ Requiere que el router de React (`react-router-dom`) use `basename="/admin"` para que las rutas internas no colisionen con el prefijo

## Decisión

**ALTERNATIVA C.** Admin sigue siendo un proyecto Vite independiente (`apps/admin`), pero se despliega y enruta bajo el path `/admin` del mismo dominio del website, mediante reglas de path en el gateway.

### Cambios Técnicos Requeridos

1. **`apps/admin/src/frontend/vite.config.ts`**
   ```typescript
   export default defineConfig({
     base: "/admin/",
     // ...resto de la config sin cambios
   });
   ```

2. **`apps/admin/src/frontend/src/main.tsx`** (o donde se monte el Router)
   ```tsx
   <BrowserRouter basename="/admin">
     <App />
   </BrowserRouter>
   ```
   El `App.tsx` actual ya define rutas como `/admin/login`, `/admin/dashboard`, etc. Al introducir `basename="/admin"`, estas rutas deben simplificarse a `/login`, `/dashboard`, etc. (el `basename` ya aporta el prefijo) — **ajuste requerido en `App.tsx`**, documentado en TASK-015.

3. **`infrastructure/gateway/haproxy.cfg`** — agregar regla de path (no de host):
   ```haproxy
   frontend http_frontend
       bind *:80
       acl is_admin_path path_beg /admin
       use_backend admin_backend if is_admin_path
       default_backend frontend_backend   # website público, catch-all
   ```
   Nota: HAProxy enruta por path aquí; alternativamente, si se migra a nginx como reverse proxy (evaluar en TASK-015 según lo que ya usa `infrastructure/`), la regla equivalente es un `location /admin/ { proxy_pass http://admin_backend/; }`.

4. **`infrastructure/docker-compose.yml`** — agregar el servicio `admin` (hoy no está definido; ver hallazgo de auditoría), con su propio `Dockerfile` de build estático (Nginx sirviendo el `dist/` de Vite).

5. **CORS / Backend API** — el backend (`apps/website/src/backend` tras ADR-005) debe seguir aceptando peticiones desde el mismo origen del website (ya no hay origen cruzado `admin.farutech.local` vs `farutech.com`, lo cual además **simplifica** la configuración CORS respecto al plan original de ADR-001).

## Justificación

1. **Cumple el mandato de producto sin sacrificar arquitectura limpia:** el aislamiento de proceso/deploy que buscaba ADR-001 se logra igual (admin sigue siendo un contenedor y un build separados), solo cambia el mecanismo de enrutamiento (path en vez de host).
2. **Menor complejidad operativa que un subdominio:** no requiere DNS adicional, ni certificado wildcard, ni gestión de cookies cross-subdominio.
3. **Consistente con el código ya escrito:** el router de admin ya asumía rutas tipo path; este ADR solo formaliza y completa esa intención con `basename` y `base` de Vite.

## Consecuencias

### Positivas
- Un solo dominio, una sola URL raíz para todo el ecosistema del sitio.
- Sesión/cookies del admin pueden restringirse con `path=/admin` si se desea aislamiento adicional sin necesidad de subdominio.

### Negativas / Riesgos
- Si en el futuro el admin necesita escalar de forma muy distinta al website (tráfico, recursos), el path-based routing sigue permitiéndolo (son contenedores distintos), pero un subdominio daría más flexibilidad de DNS/CDN. Se acepta este trade-off por mandato de producto.
- Cualquier ruta interna de admin que use URLs absolutas (`/dashboard` en vez de relativas) romperá bajo el nuevo `basename` — requiere auditoría de código en TASK-015.

## Robots.txt

El `apps/website/src/frontend/public/robots.txt` ya contiene `Disallow: /admin/`, lo cual es correcto y queda validado por este ADR (el admin no debe ser indexado).

## Referencias

- ADR-001 (superseded)
- ADR-005 — Website Backend Consolidation
- TASK-015 — Ejecución de esta migración

---

**Estado:** ✅ DECIDIDO — Pendiente de Implementación
**Próxima Revisión:** al cerrar TASK-015
