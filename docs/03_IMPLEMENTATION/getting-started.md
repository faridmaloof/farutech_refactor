# 🚀 Guía de Inicio Rápido — Farutech Website Ecosystem

**Objetivo:** Configurar tu entorno de desarrollo local en menos de 15 minutos.

> ⚠️ Esta guía cubre el **Website Ecosystem** (`apps/website`, `apps/admin`). No cubre la futura `platform` (ver [ADR-007](../01_ARCHITECTURE/adr/ADR-007_platform_scope_separation.md)), que aún no tiene proyecto iniciado.

---

## 📋 Prerrequisitos

- Node.js 18+ y npm
- PHP 8.2+ y Composer
- Docker y Docker Compose
- Git
- .NET SDK 8.0+ (para el framework de pruebas BDD)

---

## 🏁 Primeros Pasos

### 1. Clonar el repositorio

```bash
git clone <repo-url>
cd farutech
```

### 2. Instalar dependencias

```bash
# Backend del Website (Laravel) — vive dentro de apps/website desde ADR-005
cd apps/website/src/backend
composer install

# Frontend del Website
cd ../frontend
npm install

# Admin App (proyecto independiente, servido bajo /admin — ver ADR-006)
cd ../../../admin/src/frontend
npm install

# Design System (dependencia local de Admin y, a futuro, de Platform)
cd ../../../../packages/design-system/src
npm install
npm run build
```

### 3. Configurar variables de entorno

```bash
# Backend del Website
cd apps/website/src/backend
cp .env.example .env
php artisan key:generate

# Frontend del Website
cd ../frontend
cp .env.example .env.local   # si aplica

# Admin
cd ../../../admin/src/frontend
cp .env.example .env.local
# VITE_API_BASE_URL debe apuntar al mismo origen del website (ver ADR-006, ya no hay CORS cross-domain)
```

### 4. Levantar infraestructura local

```bash
cd infrastructure
docker compose up -d
```

> ⚠️ Ver `docs/04_TRACKING/tasks/TASK-017.md`: el `docker-compose.yml` actual todavía levanta MySQL + MongoDB además de PostgreSQL, pendiente de ejecutar la consolidación decidida en ADR-004.

### 5. Ejecutar migraciones

```bash
cd apps/website/src/backend
php artisan migrate
php artisan db:seed
```

### 6. Levantar los frontends

```bash
# Website público
cd apps/website/src/frontend
npm run dev          # puerto por defecto de Vite (revisar vite.config.ts)

# Admin (en otra terminal)
cd apps/admin/src/frontend
npm run dev          # puerto 5174
```

> En local, Admin corre en su propio puerto (no bajo `/admin` todavía) — el path-based routing bajo `/admin` es una capa del **gateway/reverse proxy** (ADR-006), que solo aplica cuando se sirve todo detrás del mismo proxy (ver `infrastructure/gateway/`). Para probar el flujo completo bajo `/admin` localmente, levantar también el gateway de `infrastructure/`.

### 7. Verificar instalación

- Backend: http://localhost:8000/api/health
- Website: puerto de Vite del frontend (ver consola de `npm run dev`)
- Admin (directo, sin gateway): http://localhost:5174
- Admin (vía gateway, path `/admin`): según configuración de `infrastructure/gateway/`
- pgAdmin: puerto configurado en `infrastructure/docker-compose.yml`

---

## 🧪 Framework de Pruebas (.NET / BDD)

```bash
# Compilar la solución de pruebas
dotnet build Framework.Automation.sln

# Ejecutar pruebas BDD
dotnet test Framework.Automation.sln --logger "console;verbosity=normal"
```

> ⚠️ Ver `docs/04_TRACKING/tasks/TASK-013.md`: la referencia de proyecto a `Framework.Core` dentro de `Framework.Automation.sln` está rota (apunta a una ruta que no existe) — corregir antes de asumir que `dotnet build` funciona de inmediato.

---

## 🔗 Siguientes Pasos

- [Estándares de Código](coding-standards.md)
- [Estrategia de Testing](testing-strategy.md)
- [Tareas Disponibles](../04_TRACKING/master-plan.md)
- [ADR-005 — Website Backend Consolidation](../01_ARCHITECTURE/adr/ADR-005_website_backend_consolidation.md)
- [ADR-006 — Admin Routing Strategy v2](../01_ARCHITECTURE/adr/ADR-006_admin_routing_strategy_v2.md)
