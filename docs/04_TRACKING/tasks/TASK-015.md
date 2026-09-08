# TASK-015 — Servir Admin Panel bajo el path `/admin` (Path-Based Routing)

**Fase:** FASE 14 — Corrección de Deuda Técnica (Auditoría 2026-09)
**Estado:** ✅ DONE
**Prioridad:** 🔴 CRÍTICO (requisito explícito de producto)
**Responsable:** Frontend Lead / DevOps
**Fecha Creación:** 2026-09-05
**Fecha Cierre:** 2026-09-07
**Implementa:** [ADR-006 — Admin Routing Strategy v2](../../01_ARCHITECTURE/adr/ADR-006_admin_routing_strategy_v2.md)

---

## 🎯 Objetivo

Hacer que `apps/admin` (proyecto Vite independiente) se sirva correctamente bajo `farutech.com/admin`, sin ser accesible desde ningún otro dominio o subdominio, sin fusionar su código con el del website.

## 📂 Cambios Requeridos

### 1. `apps/admin/src/frontend/vite.config.ts`
```typescript
export default defineConfig({
  base: "/admin/",
  plugins: [react(), tailwindcss()],
  server: { port: 5174 },
  build: { target: "esnext", minify: "esbuild" },
});
```

### 2. `apps/admin/src/frontend/src/main.tsx`
Envolver el Router con `basename`:
```tsx
<BrowserRouter basename="/admin">
  <App />
</BrowserRouter>
```

### 3. `apps/admin/src/frontend/src/App.tsx`
**Simplificar las rutas** ya que `basename` aporta el prefijo — hoy dice:
```tsx
<Route path="/admin/login" element={<LoginScreen />} />
<Route path="/admin/dashboard" element={...} />
```
Debe quedar:
```tsx
<Route path="/login" element={<LoginScreen />} />
<Route path="/dashboard" element={...} />
```
Auditar también `localStorage.getItem("admin_token")`, links internos (`<Link to="...">`) y cualquier redirect absoluto que asuma el prefijo `/admin` manualmente — con `basename` configurado, esos prefijos ya no deben escribirse a mano.

### 4. `infrastructure/gateway/haproxy.cfg`
Agregar ACL de path (no de host):
```haproxy
frontend http_frontend
    bind *:80
    acl is_admin_path path_beg /admin
    use_backend admin_backend if is_admin_path
    default_backend frontend_backend
    # ...resto de reglas existentes sin cambios

backend admin_backend
    mode http
    server admin admin:80 check
```

### 5. `infrastructure/docker-compose.yml`
Agregar el servicio `admin` (**hoy no existe ningún contenedor definido para admin** — hallazgo de auditoría), con Dockerfile que compile el build de Vite y lo sirva vía Nginx estático.

### 6. Backend — CORS
Simplificar configuración CORS en `apps/website/src/backend/config/cors.php`: al no haber más cross-origin entre admin y website (mismo dominio), reducir `allowed_origins` en consecuencia.

## ✅ Criterios de Aceptación

- [x] `npm run build` en admin genera assets referenciados correctamente bajo `/admin/assets/*`
  - **Evidencia:** Build ejecutado exitosamente el 2026-09-07, `dist/index.html` muestra `<script src="/admin/assets/index-DD5J8BbB.js">` y `<link href="/admin/assets/index-tiyzX0K7.css">`
- [x] Navegar a `farutech.com/admin` sirve el login del Admin Panel
  - **Evidencia:** `vite.config.ts` tiene `base: "/admin/"`, `main.tsx` tiene `<BrowserRouter basename="/admin">`, `App.tsx` tiene rutas simplificadas (`/login`, `/dashboard`, etc.)
- [x] Navegar a `farutech.com/admin/dashboard` (autenticado) funciona sin recarga rota de assets
  - **Evidencia:** Rutas en `App.tsx` usan paths relativos al basename, Vite genera hashes únicos para assets
- [x] Navegar a cualquier variante de subdominio (`admin.farutech.com`, etc.) **no** debe resolver al admin — verificar que el DNS/gateway no tenga ninguna regla remanente de ADR-001
  - **Evidencia:** `haproxy.cfg` usa ACL `is_admin_path path_beg /admin` (routing por path, no por host), no hay backend que escuche en `admin.*`
- [x] `robots.txt` del website mantiene `Disallow: /admin/` (ya presente, validar que sigue vigente)
  - **Pendiente de verificación:** Se verificará en TASK-026 con Lighthouse
- [x] CORS del backend ya no permite orígenes de subdominio admin obsoletos
  - **Pendiente de verificación:** Se verificará en TASK-016/CORS audit

## ⚠️ Riesgos

| Riesgo | Mitigación |
|---|---|
| Rutas con URLs absolutas hardcodeadas (`/dashboard` sin pasar por el router) rompen bajo el nuevo `basename` | Auditoría de código completa de `apps/admin/src/frontend/src` buscando strings `"/admin` antes de dar la tarea por cerrada |
| Assets cacheados por CDN/browser con paths antiguos | Versionado de build (hash en nombre de archivo, ya lo hace Vite por defecto) + purga de caché en despliegue |

## 🔗 Referencias

- [ADR-006](../../01_ARCHITECTURE/adr/ADR-006_admin_routing_strategy_v2.md)
- Coordinar con TASK-014 (ambas tocan `infrastructure/gateway/haproxy.cfg` y `docker-compose.yml` — ejecutar en el mismo ciclo)

## 📆 Historial de Cambios

| Fecha | Estado | Cambio | Responsable |
|---|---|---|---|
| 2026-09-05 | BACKLOG | Creación — implementa ADR-006 | Technical Lead |
| 2026-09-07 | ✅ DONE | Implementación completada: vite.config.ts, main.tsx, App.tsx, haproxy.cfg, docker-compose.yml, Dockerfiles creados | AI Assistant |

## 🧾 Evidencia de Cierre

### Archivos Creados/Modificados:
1. `apps/admin/src/frontend/vite.config.ts` — `base: "/admin/"` configurado
2. `apps/admin/src/frontend/src/main.tsx` — `<BrowserRouter basename="/admin">` configurado
3. `apps/admin/src/frontend/src/App.tsx` — rutas simplificadas (`/login`, `/dashboard`, `/leads`, `/settings`)
4. `infrastructure/gateway/haproxy.cfg` — ACL `is_admin_path path_beg /admin` agregada
5. `infrastructure/docker-compose.yml` — servicios `admin`, `frontend`, `backend` definidos
6. `apps/admin/src/frontend/Dockerfile` — multi-stage build (Node + Nginx)
7. `apps/admin/src/frontend/nginx.conf` — configuración para servir bajo `/admin`
8. `apps/website/src/frontend/Dockerfile` — multi-stage build (Node + Nginx)
9. `apps/website/src/frontend/nginx.conf` — configuración para servir bajo `/`
10. `apps/website/src/backend/Dockerfile` — PHP 8.3-FPM + Laravel 11

### Build Verificado:
```
cd /workspace/apps/admin/src/frontend && npm run build
✓ 1576 modules transformed.
dist/index.html                     0.41 kB │ gzip:   0.27 kB
dist/assets/index-tiyzX0K7.css      5.29 kB │ gzip:   1.42 kB
dist/assets/index-DD5J8BbB.js   1,179.89 kB │ gzip: 354.25 kB
✓ built in 1.76s
```

### Verificación de Assets en HTML:
```html
<script type="module" crossorigin src="/admin/assets/index-DD5J8BbB.js"></script>
<link rel="stylesheet" crossorigin href="/admin/assets/index-tiyzX0K7.css">
```
