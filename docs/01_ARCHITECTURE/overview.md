# 🏛️ Visión General de Arquitectura — Farutech Website Ecosystem

**Última actualización:** 2026-09-05
**Estado:** 🟡 En Refactorización (ver `docs/04_TRACKING/master-plan.md`)

> ⚠️ **Alcance de este documento:** describe únicamente el **Website Ecosystem** (sitio público + su panel de administración bajo `/admin`). La futura plataforma multi-tenant (`platform`) es un sistema **separado**, con su propio stack y su propia arquitectura — ver [ADR-007 — Platform Scope Separation](adr/ADR-007_platform_scope_separation.md) y [SPEC-003 — Platform Vision](../02_SPECIFICATIONS/SPEC-003_Platform_Vision.md). No mezclar ambos alcances al leer este documento.

---

## 🎯 Propósito del Sistema

El Website Ecosystem de Farutech es un sitio público de marketing con captación y gestión activa de clientes potenciales:
- Presencia pública, SEO-first, con páginas de servicio independientes
- Gestión inteligente de leads y oportunidades comerciales (mini CRM)
- Búsqueda automatizada de oportunidades de negocio (scraping ético + señales de negocio, ver SPEC-002 v1.1)
- Administración de contenidos (Blog, Newsletter) desde `/admin`
- Cotizaciones y control tarifario (SPEC-006)

---

## 📊 Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────┐
│                    Usuarios Finales                      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Reverse Proxy / Gateway                     │
│      Routing por PATH (no por subdominio, ver ADR-006)   │
└─────────────────────────────────────────────────────────┘
        │                                    │
        ▼ (todo excepto /admin)              ▼ (path_beg /admin)
┌──────────────────────┐          ┌──────────────────────┐
│   Website Público     │          │     Admin Panel       │
│   farutech.com        │          │  farutech.com/admin   │
│   React + Vite + TS   │          │  React + Vite + TS    │
│  (contenedor propio)  │          │  (contenedor propio)  │
└──────────┬────────────┘          └──────────┬────────────┘
           │                                   │
           └───────────────┬───────────────────┘
                            ▼
                 ┌──────────────────────────┐
                 │       Backend API         │
                 │       Laravel 11          │
                 │      + Sanctum Auth       │
                 │  apps/website/src/backend │
                 └────────────┬──────────────┘
                              │
                 ┌────────────┴─────────────┐
                 ▼                          ▼
     ┌──────────────────────┐    ┌──────────────────────┐
     │    PostgreSQL         │    │       Redis 7         │
     │ (único, ver ADR-004,  │    │    (Colas/Caché)      │
     │  scope Website)       │    │                        │
     └──────────────────────┘    └──────────────────────┘
```

**Nota sobre el gateway:** ADR-001 (subdominio para admin) fue **descartado**. La decisión vigente es ADR-006 (path-based `/admin`, sobre el mismo dominio). El diagrama anterior de este documento mostraba `admin.farutech.local`, lo cual nunca se implementó y ya no es la dirección arquitectónica correcta.

---

## 🏗️ Componentes Principales

### 1. Website (`apps/website/`) — Frontend + Backend consolidados (ver ADR-005)

Desde ADR-005, `apps/website` es una unidad autocontenida:

```
apps/website/
├── src/
│   ├── frontend/     # React 18 + Vite + TypeScript + Tailwind v4
│   └── backend/      # Laravel 11 + PHP 8.2 (antes vivía en apps/api, ya fusionado)
└── test/             # BDD .NET (Framework.Core), cubre frontend y backend
```

#### 1.1 Frontend (`apps/website/src/frontend/`)

**Tecnología real:** React 18 + Vite + React Router 7 + Tailwind CSS v4 (**no Next.js** — corrección respecto a versiones previas de este documento, que describían incorrectamente Next.js 14).

**SEO:** el frontend es una SPA con un paso adicional de **prerender estático** (`npm run build:seo`) que genera HTML por ruta con `title`, `description`, canonical, hreflang ES/EN y Open Graph inyectados directamente en el HTML (no dependen de ejecución de JS). Ver limitación conocida: el JSON-LD (schema.org) se inyecta actualmente vía `useEffect` y **no** queda incluido en el HTML prerenderizado — pendiente de corrección (ver tracking).

**Páginas clave:**
- Home con hero section
- Hub de servicios + landings de servicio individuales (hero y contenido únicos por servicio; comparten un armazón de secciones común `ServiceScaffold` — ver nota de independencia parcial en tracking)
- Blog público
- Casos de éxito, Nosotros, Ecosistema, Legal
- Formulario/drawer de contacto interactivo, suscripción a newsletter

#### 1.2 Backend (`apps/website/src/backend/`)

**Tecnología:** Laravel 11 + PHP 8.2 + Sanctum. Elegido deliberadamente por ser liviano en consumo de inodes, adecuado para el hosting con restricciones donde se aloja el website (ver ADR-007 para el contraste con la infraestructura robusta que tendrá `platform`).

**Responsabilidades (acotadas — solo API y workers del website, sin lógica de aplicación pesada):**
- Autenticación y autorización del Admin Panel (Sanctum)
- CRUD de Leads, Oportunidades, Blog, Newsletter, Cotizaciones/Tarifas (SPEC-006)
- Jobs asíncronos (scraping ético de oportunidades, envío de emails, publicación programada de blog)
- API RESTful versionada (`/api/v1/`)

### 2. Admin Panel (`apps/admin/`)

**Tecnología:** React 18 + Vite + TypeScript. Proyecto **independiente** (build y deploy propios), servido bajo el path `/admin` del mismo dominio del website mediante reglas de path en el gateway (ADR-006) — no fusionado con el código del website, no accesible desde ningún otro dominio o subdominio.

**Features (según SPEC-001 a SPEC-006 — estado real en `master-plan.md`):**
- Dashboard con métricas
- Gestión de mensajes de contacto (Contáctenos)
- Gestión de Leads (mini CRM, SPEC-001)
- Búsqueda de Oportunidades con señales de negocio reales (SPEC-002 v1.1)
- Newsletter con editor visual/HTML (SPEC-004)
- Blog CMS con SEO completo (SPEC-005)
- Cotizaciones y control tarifario / "minipos" (SPEC-006)
- Configuración del sistema

**Arquitectura:** Feature-Sliced Design

### 3. Design System (`packages/design-system/`)

**Tecnología:** React + Rollup + TypeScript + Tailwind CSS v4.
**Propósito:** biblioteca de componentes compartidos entre `apps/website` (admin) y, a futuro, el dashboard de `platform` (reutilización formalizada en ADR-007 — los componentes de dashboard ya presentes fueron extraídos pensando en ese doble uso).

**Componentes:** 45+ componentes reutilizables (UI base, layouts, componentes de negocio como `LeadCard`, `DataTable`, `Scheduler`, `Sidebar`, `ModuleSwitcher`).

**Publicación:** `@farutech/design-system` como paquete local (`file:` reference); evaluar publicación a un registro npm privado cuando existan más de dos consumidores reales (website admin + platform).

### 4. Framework de Pruebas (`packages/framework-automation/`)

**Tecnología:** .NET + Reqnroll (BDD) + patrón Screenplay.
**Estructura:**
- `Framework.Core` — librería compartida (Actor, Task, Interaction, Question, helpers de BD, configuración). No es un test en sí mismo, es la base que consumen los proyectos de test de cada app.
- Cada app (`apps/website/test/`, `apps/admin/test/`) referencia `Framework.Core` e implementa solo sus propios `Features/`, `Steps/` y `POM/`.
- Existe una copia de referencia/plantilla original en `Examples/tests/framework-automation/` (con un proyecto de ejemplo `Scaffolding.Tests`), usada como origen del framework — no se ejecuta como parte del ecosistema real, es material de referencia.

> ⚠️ Ver hallazgo de tracking: `Framework.Automation.sln` (raíz) tiene actualmente una ruta de proyecto rota hacia `Framework.Core` — pendiente de corrección (ver `docs/04_TRACKING/tasks/TASK-013.md`).

---

## 🔐 Estrategia de Autenticación

**Herramienta:** Laravel Sanctum
**Flujo:**

1. Login desde `/admin` → POST `/api/v1/login`
2. Backend genera token Sanctum
3. Frontend admin almacena token (httpOnly cookie o localStorage)
4. Cada request incluye `Authorization: Bearer {token}`
5. Middleware valida token y retorna usuario

**Roles disponibles:**
- `admin` — Acceso completo al Admin Panel
- `editor` — Gestión de Blog y Newsletter
- `sales_manager` / `sales_rep` — Gestión de Leads, Oportunidades y Cotizaciones (ver SPEC-001/002/006)
- `viewer` — Solo lectura

**Nota CORS:** al quedar admin y website bajo el mismo dominio (ADR-006), la configuración CORS se simplifica respecto al plan original de ADR-001 (que asumía subdominios distintos).

---

## 🗄️ Estrategia de Datos

### PostgreSQL único + Redis (ADR-004, alcance Website Ecosystem — ver nota de re-alcance en ADR-004 y ADR-007)

| Base de Datos | Propósito | Estado real de ejecución |
|---------------|-----------|---------------------------|
| **PostgreSQL** | Toda la persistencia transaccional del Website Ecosystem (usuarios, leads, oportunidades, blog, newsletter, cotizaciones/tarifas) | ⚠️ Decidido pero no ejecutado — `infrastructure/docker-compose.yml` sigue con MySQL+PostgreSQL+MongoDB (ver TASK-017) |
| **Redis** | Colas, caché, sesiones | ✅ Ya en uso |

**Importante:** esta tabla aplica solo al Website Ecosystem. La futura `platform` definirá su propia estrategia de datos en su propio ADR (ver ADR-007).

---

## 🔄 Flujo de Datos Típico

### Ejemplo: Creación de Lead

```
1. Usuario llena formulario en Website
   ↓
2. Website → POST /api/v1/contact
   ↓
3. Backend valida datos + crea Lead en PostgreSQL
   ↓
4. Backend dispara evento LeadCreated
   ↓
5. Listener envía email de notificación (Job en cola, Redis)
   ↓
6. Lead aparece en Admin Panel (/admin/leads) automáticamente
   ↓
7. Sistema de scoring calcula calidad del lead
   ↓
8. Equipo comercial puede generar una Cotización (SPEC-006) directamente desde el Lead
```

---

## 🚦 Infraestructura de Deployment

**Local Development:** Docker Compose (todos los servicios en localhost, Mailhog para testing de emails). **Esta contenerización es únicamente para desarrollo/pruebas locales** — no representa la infraestructura de producción real del website, que se aloja en un hosting con restricciones de inodes (ver ADR-007).

**Production (planificado):**
- Reverse proxy con routing por **path** (no por host) para `/admin` — ver ADR-006
- Un solo dominio: `www.farutech.com` (+ `/admin`)
- `api.farutech.com` para el backend si se opta por exponerlo en subdominio propio (evaluar en TASK-015 junto con la migración de gateway)
- SSL con Let's Encrypt
- Frontend compilado como estático, backend Laravel desplegado de forma liviana acorde a las restricciones de inodes del hosting

---

## 🔗 Documentos Relacionados

- [ADR-001 (superseded)](adr/ADR-001_admin_routing_strategy.md) / [ADR-006 (vigente)](adr/ADR-006_admin_routing_strategy_v2.md) — Admin Routing
- [ADR-002](adr/ADR-002_design_system_structure.md) — Design System Structure
- [ADR-003](adr/ADR-003_intranet_strategy.md) — Intranet Strategy
- [ADR-004](adr/ADR-004_multi_database_strategy.md) — Multi-Database Strategy (re-alcanzado)
- [ADR-005](adr/ADR-005_website_backend_consolidation.md) — Website Backend Consolidation
- [ADR-007](adr/ADR-007_platform_scope_separation.md) — Platform Scope Separation
- [Especificaciones Funcionales](../02_SPECIFICATIONS/)
- [Master Plan / Tracking](../04_TRACKING/master-plan.md)

---

**© 2024-2026 Farutech — Documentación oficial de arquitectura**
