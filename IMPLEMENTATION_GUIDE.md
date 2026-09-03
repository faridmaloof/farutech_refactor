# Farutech Ecosystem — Guía de Implementación (estado 2026-09-03)

Monorepo consolidado. Backend API en **`apps/api/src/`** (Laravel 10); tests automatizados en
.**NET** en `apps/<app>/test/` sobre un `Framework.Core` compartido.
Solución maestra raíz: **`Framework.Automation.sln`** (Framework.Core + 4 apps de test).

> ✅ Última validación (03-09-2026): `dotnet build Framework.Automation.sln` compila los 5 proyectos con **0 errores** (solo warnings de vulnerabilidades transitivas). API contract restaurado: `logout`, `/user`, `/tokens`, `/tokens/{id}`, CRUD `/admin/users`, rutas `/locations` y CRUD `/admin/leads`.

---

## Estado por fase

| 0 | Checkpoint + limpieza (apps/api→src, apps/web→docs/archive/) | ✅ | 100% |
| 1 | Scaffolding .NET tests → 4 apps (namespaces renombrados) | ✅ | 100% |
| 2 | Backend API (Laravel 10, Sanctum, modelos, rutas) | ✅ | ~95% |
| 3 | Design System (@farutech/design-system; sin dist/ build) | ✅ | estructura 100% · build pte. |
| 4 | Admin App — scaffold React+Vite creado + tests | 🔄 | scaffold ✓ · tests ✓ |
| 5 | Intranet App — scaffold React+Vite creado + tests | 🔄 | scaffold ✓ · tests ✓ |
| 6 | Website cleanup (doble src/src/ + pages admin dentro de web) | ⬜ | pendiente |
| 7 | Infraestructura (Docker Compose + HAProxy) | ✅ | ~95% |
| 8 | Test Automation (27 features+steps, hooks, ScreenPlay) | ✅ | build ✓ · runtime pte. |
| 9 | Documentación | 🔄 | en curso |

## Stack

- **Backend**: Laravel 10.10 / PHP 8.1+ / Sanctum 3.3 / l5-swagger / MySQL·Postgres·Mongo.
- **Tests**: .NET 10 / Reqnroll / ScreenPlay / RestSharp / Playwright / xUnit / FluentAssertions / Allure.
- **Frontend**: React 18 / TS 5 / Vite 8 / TailwindCSS v4.
- **Infra**: Docker Compose / HAProxy / Postgres 16 / Redis 7 / MySQL / Mongo / Mailhog / PgAdmin.

## Árbol de carpetas (referencia)

```
farutech_refactor/
├── apps/
│   ├── api/        ├── src/  (Laravel: app/, routes/, config/, database/, bootstrap/, artisan, composer.json, .env.example, phpunit.xml)
│   │               └── test/ (.NET: Farutech.Api.Tests.csproj → Framework.Core)
│   ├── admin/      ├── src/  (React+Vite scaffold)
│   │               └── test/ (.NET)
│   ├── intranet/   ├── src/  (React+Vite scaffold)
│   │               └── test/ (.NET)
│   └── website/    ├── src/  (React+Vite + SSR/prerender)
│                   └── test/ (.NET)
├── packages/design-system/        # @farutech/design-system (fuente; dist/ no publicado)
├── infrastructure/                # docker-compose.yml, gateway/haproxy.cfg, .env.example
├── tests/framework-automation/    # Framework.Core (src/) — único, referenciado por las apps
├── Framework.Automation.sln       # 🔗 Solución maestra raíz
├── docs/                          # tasks/, archive/, implementation-log/, *.md de planificación
├── IMPLEMENTATION_GUIDE.md        # ← este archivo
├── README.md
└── QUICK_START.md
```

## Test Automation (.NET / Reqnroll)
- `Framework.Core` es único y compartido (no se copia): `ProjectReference` a
  `tests/framework-automation/src/Framework.Core/Framework.Core.csproj`.
- Patrón ScreenPlay: `Actor.AttemptsToAsync(...)` + preguntas `Is*`
  (`Framework.Core.ScreenPlay.{Api,Web}`). Hooks globales gestionan browser y cleanup.
- Solución maestra `Framework.Automation.sln` referencia: Framework.Core,
  Farutech.Api.Tests, Farutech.Website.Tests, Farutech.Admin.Tests, Farutech.Intranet.Tests.
- **Build** (valida T8-10/T8-11/T8-12): `dotnet build Framework.Automation.sln` → **0 errores**.
- **Gherkin (T8-11)**: keywords en inglés (`Feature:`, `Scenario:`, `Given/When/Then/And`)
  y steps en español → bindeo por texto (evita el bug del dialecto `#language: es` de Reqnroll).
- **Cobertura** (27 features): API (Auth, UsersApi, BlogApi, ContactNewsletterApi, SettingsApi, LeadsApi);
  Website (Home, Services, Newsletter); Admin (Login, Dashboard); Intranet (Login, Dashboard).

## Backend API (Laravel 10)
Arranque local:
```bash
cd apps/api/src
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate          # testing: SQLite :memory: (phpunit.xml)
php artisan serve --host=0.0.0.0 --port=8000
```

**Contrato REST (Sanctum) — Auth:** `POST /login` (rate-limit, email-confirmation gate, role=admin) ·
`POST /logout` · `GET /user` · `POST /tokens` · `DELETE /tokens/{id}`.

| Recurso | Endpoints | Auth |
|---------|-----------|------|
| Users | `GET /users`, `GET /users/{u}`, `POST /users`, `PUT /users/{u}`, `DELETE /users/{u}`, `PATCH /users/{u}/status` | admin (store: registration_enabled) |
| Leads | `GET/POST /admin/leads`, `GET/PUT/DELETE /admin/leads/{l}`, `GET /admin/leads/stats` | admin |
| Locations | `GET /locations/search`, `GET /locations/{id}`, `GET /locations/{id}/hierarchy` | público |
| Blog | `GET /blog/posts`, `GET /blog/posts/{slug}`, `GET /blog/categories`, `GET /blog/categories/{slug}` (+ CRUD admin) | parcial admin |
| Contact/Newsletter | `POST /contact`, `POST /newsletter` | público |
| Settings | `GET /settings/public`, `GET/PUT /admin/settings`, `GET /admin/dashboard/stats` | mixto |

**Fixes aplicados en esta sesión (FASE 2):** `AuthController` → `logout`, `user`, `createToken`,
`revokeToken`; `UserController` → `show`, `update`, `destroy` (guardas de auto-edición/auto-borrado
y feature-flag `registration_enabled`); en `routes/api.php` → rutas `/locations/{search|id|hierarchy}`
y CRUD completo de `/admin/leads` (orden correcto respeto a wildcards).

## Frontend (React+Vite)
```bash
cd apps/admin/src    && npm install && npm run dev   # :5174
cd apps/intranet/src && npm install && npm run dev   # :5175
cd apps/website/src  && npm install && npm run dev   # :3000
```
Los tres consumen `http://api.farutech.local` (config. vía `.env`).

## Infraestructura
```bash
cd infrastructure
cp .env.example .env
docker compose up -d
```
Exponemos: `api.farutech.local`, `admin.farutech.local`, `farutech.local`, PgAdmin `:5050`, MailHog `:8025`.

## Deuda técnica
- ⚠️ `packages/framework-automation/` es una **copia no trackeada** de Framework.Core (vs. la
  canónica `tests/framework-automation/`). Consolidar a una sola copia.
- ⚠️ `apps/website/src/` tiene doble anidación `src/src/` y páginas `/admin/*` dentro del website →
  pendiente FASE 6 (limpieza/website).
- ℹ️ `@farutech/design-system` sin `dist/` publicado (`npm install && npm run build` pendiente).
- ℹ️ Warnings de vulnerabilidad transitiva (`OpenTelemetry.Api`, `SharpCompress`, `Snappier`) en
  dependencias de Framework.Core; actualizar en próxima ronda de paquetes.

## Cómo validar
```bash
dotnet build Framework.Automation.sln                              # ✓ 0 errores
cd apps/api/src && composer install && php artisan test          # PHP (runtime)
```
Ver también: `docs/README.md` (índice) y `docs/implementation-log/refactor-progress.md`.

---
© 2026 Farutech — refactor checkpoint 2026-09-03.

