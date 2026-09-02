# FaruTech Web (monorepo)

Sitio corporativo: **API Laravel 10 (PHP-FPM 8.3 + nginx + supervisor)** y
**SPA React 18 + TypeScript + Vite (sirve `dist` con nginx, sin dev-server en Docker)**.

> Operación global (infraestructura, dominios, agregar proyectos/servicios,
> ambientes y Jenkins) → `..\..\..\README.md` (raíz del workspace).

## Estructura

```
web/
├── apps/
│   ├── backend/        # Laravel 10 API (antes Lumen; migrado en esta reorganización)
│   │   └── .env        # NO versionado; montado en el container (rw) para artisan
│   └── frontend/       # React/Vite
├── deployment/
│   └── docker/{backend,frontend}/   # Dockerfiles + configs nginx/supervisor
├── docker-compose.yml  # servicios de la app (redes external de infraestructura)
└── docs/               # documentación técnica histórica
```

## Dominios y contrato API

| URL | Destino |
|---|---|
| `http://farutech.local` | SPA |
| `http://api.farutech.local` | API. Las rutas viven sin prefijo `/api` |

Rutas principales: `/blog/posts*`, `/admin/login`, `/admin/dashboard/stats`,
`/admin/leads*`, `/admin/settings`, `/admin/users*`, `/settings/public`,
`/register`, `/register/confirm`.

Autenticación: token stateless HMAC-SHA256 firmado con APP_KEY, enviado como
`Authorization: Bearer <payload>.<sig>` (24 h por defecto, configurable en
`admin_settings.session_ttl_hours`).

## Swagger / OpenAPI

Documentación interactiva profesional de la API:

| URL | Contenido |
|---|---|
| `http://api.farutech.local/documentation` | Swagger UI interactivo |
| `http://api.farutech.local/docs` | Spec OpenAPI 3.0 (`api-docs.json`) |

Para probar endpoints protegidos desde la UI: **Authorize** → pegar el token
emitido por `POST /admin/login` (sin la palabra Bearer; el esquema ya la añade).

- Stack: `darkaonline/l5-swagger` con anotaciones `@OA\...` sobre los controladores
  (single source of truth: el código documenta su propio contrato).
- Regenerar tras cambiar anotaciones:
  `docker exec farutech-backend php artisan l5-swagger:generate`
  y ajustar ownership si se generó como root:
  `docker exec farutech-backend sh -c 'chown -R www-data:www-data storage/api-docs'`
- Config específica del proyecto: `apps/backend/config/l5-swagger.php`
  (UI en `/documentation`, JSON en `/docs`, sin prefijo `/api` redundante).
- Rutas documentadas: 16 (Auth, Blog público/admin, Settings, Dashboard, Leads).

## Arranque

```powershell
# 1) Infraestructura arriba (ver README del workspace)
# 2) App
docker compose up -d --build
# 3) Primera vez / reset controlado de datos semilla
docker exec farutech-backend php artisan migrate --seed
```

Frontend: `VITE_API_URL` se inyecta como build-arg (default
`http://api.farutech.local`) y alimenta `src/lib/api.ts`. Cambios en código
frontend requieren `--build` (no hay hot-reload por diseño).

## Notas del backend

- El `.env` de `apps/backend` está bind-montado para que comandos como
  `key:generate` persistan en el host. En `docker-compose.yml` además se fija
  `APP_KEY` como atajo de desarrollo local.
- Seeds incluidos: `AdminUserSeeder` (genera credenciales admin/editor/viewer
  **aleatorias en cada corrida** e imprime las contraseñas una sola vez en la
  salida del comando — ya no existen usuarios demo con contraseña fija),
  servicios, tipos de aplicación, settings default, blog. Para el primer
  acceso: ejecutar `php artisan db:seed --class=AdminUserSeeder` y conservar
  las credenciales que imprime (no se guardan en código, logs ni BD).

## Pendientes funcionales conocidos (preexistentes)

- Los endpoints públicos `POST /contact` y `POST /newsletter` **nunca existieron
  en el servidor** (tampoco en Lumen). Existe `LeadController@store` con
  `StoreLeadRequest` para cablearlos más adelante: requiere corregir reglas de
  validación heredadas (`phone`, sintaxis `email:max`, `default:`) y mapear
  `service_interest` → `application_types.id`.
- Modelos `ApplicationType` y `Location` fueron recreados mínimos (faltaban en
  el repo y en el historial) siguiendo fielmente sus migraciones.
