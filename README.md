# 🚀 Farutech Website Ecosystem

> **Sitio web público + panel de administración**: Website público (React 18 + Vite), su Backend API (Laravel 11), Admin Panel (React 18 + Vite, servido bajo `/admin`) y Design System unificado.
>
> ⚠️ Este repositorio cubre el **Website Ecosystem**. La futura plataforma multi-tenant (`platform`) es un sistema separado, aún no iniciado — ver [ADR-007](docs/01_ARCHITECTURE/adr/ADR-007_platform_scope_separation.md) y [SPEC-003](docs/02_SPECIFICATIONS/SPEC-003_Platform_Vision.md).

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4.svg?logo=php)](https://php.net)
[![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20.svg?logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg?logo=vite)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com)

---

## 📋 Tabla de Contenidos

- [1. Visión General](#1-visión-general)
- [2. Estado Real por Aplicación](#2-estado-real-por-aplicación)
- [3. Arquitectura y Decisiones (ADRs)](#3-arquitectura-y-decisiones-adrs)
- [4. Quick Start y Comandos](#4-quick-start-y-comandos)
- [5. Framework de Tests](#5-framework-de-tests)
- [6. Documentación y Especificaciones](#6-documentación-y-especificaciones)
- [7. Guía de Contribución y Definición de Done](#7-guía-de-contribución-y-definición-de-done)
- [8. Contacto y Soporte](#8-contacto-y-soporte)

---

## 1. Visión General

Farutech Website Ecosystem es la plataforma de captación, procesamiento y gestión proactiva de clientes potenciales, contenidos (blog/newsletter) y cotizaciones comerciales, construida alrededor del sitio web público de Farutech.

- **[Índice Maestro de Documentación](docs/00_INDEX.md)**: Navegación completa del repositorio.
- **[Master Tracking Plan](docs/04_TRACKING/master-plan.md)**: Seguimiento en tiempo real de fases, tareas y estados.
- **[Guía de Uso del Tracking](docs/04_TRACKING/guia-de-uso.md)**: Ciclo de vida y reglas de desarrollo.
- **[Prompt de Implementación](docs/04_TRACKING/IMPLEMENTATION_PROMPT.md)**: Prompt consolidado para retomar el trabajo pendiente (correctivo + funcional) con un equipo o un agente de codificación.

---

## 2. Estado Real por Aplicación

> **Auditoría Verificada 2026-09-05**: Basado en evidencia física de código, sin supuestos ni afirmaciones infladas. El porcentaje global reportado anteriormente (~45%) no contemplaba el alcance funcional completo del panel de administración (Newsletter, Blog, Contacto, Cotizaciones/Tarifas) ni el estado real de Opportunity Search — ver `docs/04_TRACKING/master-plan.md` para el detalle corregido.

| Aplicación / Módulo | Ubicación | Stack Técnico | Estado Real | Notas Verificadas |
|---------------------|-----------|---------------|-------------|-------------------|
| **Website Público** | `apps/website/src/frontend/` | React 18, Vite, Tailwind v4, React Router 7 | 🟡 Funcional con gaps de SEO | Páginas públicas operativas; JSON-LD no se incluye en el HTML prerenderizado (TASK-023); páginas de servicio comparten un armazón (`ServiceScaffold`) parcialmente template. |
| **Backend** | `apps/website/src/backend/` (migrado desde `apps/api/src/backend/` — ver [ADR-005](docs/01_ARCHITECTURE/adr/ADR-005_website_backend_consolidation.md), TASK-014 ✅ DONE) | Laravel 11, PHP 8.2, Sanctum, PostgreSQL | 🟡 Funcional para endpoints existentes | `/contact`, `/newsletter`, `/leads` operativos. `FindOpportunitiesJob` es un stub sin fuentes de datos reales (TASK-021). Sin ningún artefacto de Cotizaciones/Tarifas (TASK-022). |
| **Design System** | `packages/design-system/` | React, TypeScript, Tailwind CSS | ✅ Estructurado | Estructura normalizada (ADR-002), 45+ componentes exportados. Confirmado como paquete de reutilización dual (admin + futuro dashboard de Platform, ver ADR-007). |
| **Admin Panel** | `apps/admin/src/frontend/` | React 18, Vite, TypeScript | 🟡 En Desarrollo temprano | Login y dashboard base operativos. Sin módulos de Newsletter, Blog, Contacto ni Cotizaciones. **Servido bajo `/admin`** (TASK-015 ✅ DONE). |
| **Intranet** | `apps/intranet/` | React 18, Vite | ⏸️ Congelada — elemento huérfano a resolver | Scaffold preservado, sin caso de uso activo (ADR-003). Ver TASK-024. |
| **Infraestructura** | `infrastructure/` | Docker, Docker Compose, HAProxy, PostgreSQL, Redis | 🟡 Parcial | Contenedores de MySQL y MongoDB aún presentes pese a que ADR-004 decidió consolidar a PostgreSQL único (TASK-017). Gateway con regla de enrutamiento para admin configurada (TASK-015 ✅ DONE). |

---

## 3. Arquitectura y Decisiones (ADRs)

```
                          ┌───────────────────────────┐
                          │    Usuarios / Clientes    │
                          └─────────────┬─────────────┘
                                        │
                                        ▼
                          ┌───────────────────────────┐
                          │  Gateway (routing por PATH,│
                          │   no por subdominio)       │
                          └─────────────┬─────────────┘
                                        │
                  ┌─────────────────────┴─────────────────────┐
                  ▼ (todo excepto /admin)                      ▼ (path_beg /admin)
       ┌──────────────────────┐                     ┌──────────────────────┐
       │   Website Público    │                     │     Admin Panel      │
       │    farutech.com      │                     │  farutech.com/admin  │
       └──────────┬───────────┘                     └──────────┬───────────┘
                  │                                             │
                  └─────────────────────┬───────────────────────┘
                                        ▼
                          ┌──────────────────────────┐
                          │  Backend (Laravel 11)     │
                          │  apps/website/src/backend │
                          └────────────┬─────────────┘
                                        │
                          ┌────────────┴─────────────┐
                          ▼                          ▼
              ┌──────────────────────┐    ┌──────────────────────┐
              │    PostgreSQL 16     │    │       Redis 7        │
              │     (Datos Core)     │    │    (Colas/Caché)     │
              └──────────────────────┘    └──────────────────────┘
```

> Nota: el diagrama anterior de este README mostraba `admin.farutech.local` (subdominio). Esa decisión (ADR-001) fue descartada — ver ADR-006 para la estrategia vigente (routing por path).

### Decisiones de Arquitectura Registradas (ADRs)

- **[ADR-001: Admin Routing Strategy](docs/01_ARCHITECTURE/adr/ADR-001_admin_routing_strategy.md)** — ⚠️ *SUPERSEDED por ADR-006*. Decisión original de subdominio, nunca implementada.
- **[ADR-002: Design System Structure](docs/01_ARCHITECTURE/adr/ADR-002_design_system_structure.md)** — Normalización del directorio del Design System (`src/src/` → `src/`).
- **[ADR-003: Intranet Strategy](docs/01_ARCHITECTURE/adr/ADR-003_intranet_strategy.md)** — Congelamiento de Intranet hasta definición de casos de uso.
- **[ADR-004: Multi-Database Strategy](docs/01_ARCHITECTURE/adr/ADR-004_multi_database_strategy.md)** — ⚠️ *Decidido, no ejecutado en infraestructura* (TASK-017). Re-alcanzado por ADR-007 (aplica solo al Website Ecosystem).
- **[ADR-005: Website Backend Consolidation](docs/01_ARCHITECTURE/adr/ADR-005_website_backend_consolidation.md)** — 🆕 `apps/api` se fusiona dentro de `apps/website/src/backend`.
- **[ADR-006: Admin Routing Strategy v2](docs/01_ARCHITECTURE/adr/ADR-006_admin_routing_strategy_v2.md)** — 🆕 Admin servido bajo el path `/admin` del mismo dominio (vigente).
- **[ADR-007: Platform Scope Separation](docs/01_ARCHITECTURE/adr/ADR-007_platform_scope_separation.md)** — 🆕 Separación formal entre el Website Ecosystem (este repo) y la futura plataforma multi-tenant.

---

## 4. Quick Start y Comandos

### Requisitos Previos

- **Node.js**: v18.0 o superior
- **npm**: v9.0 o superior
- **PHP**: v8.2+ (para Backend Laravel)
- **Composer**: v2.5+
- **Docker & Docker Compose** (para base de datos y servicios auxiliares)
- **.NET SDK**: v8.0+ (para framework de pruebas BDD)

### Instalación de Dependencias

```bash
# Backend del Website (vive dentro de apps/website desde ADR-005)
cd apps/website/src/backend && composer install && cd ../../../../

# Frontend del Website
cd apps/website/src/frontend && npm install && cd ../../../../

# Admin App (proyecto independiente, servido bajo /admin — ver ADR-006)
cd apps/admin/src/frontend && npm install && cd ../../../../

# Design System
cd packages/design-system/src && npm install && npm run build && cd ../../../
```

### Comandos de Desarrollo y Compilación

```bash
# Website (dentro de apps/website/src/frontend)
npm run dev            # servidor de desarrollo
npm run build           # build estático SPA
npm run build:seo       # build + prerender SSG (usar este para producción, ver TASK-016)

# Admin (dentro de apps/admin/src/frontend)
npm run dev
npm run build
```

### Levantar Infraestructura Local

```bash
cd infrastructure
docker compose up -d
```

> ⚠️ Ver `docs/04_TRACKING/tasks/TASK-017.md`: el compose actual todavía levanta MySQL y MongoDB pese a que ADR-004 decidió consolidar a PostgreSQL único.

---

## 5. Framework de Tests

El repositorio cuenta con una suite de pruebas de automatización basada en **.NET 8** y **Reqnroll** (BDD), con un core compartido (`Framework.Core`) consumido por cada aplicación:

- `Framework.Automation.sln` (raíz)
- `packages/framework-automation/src/Framework.Core/` — librería compartida (Screenplay, POM, helpers BDD)
- `apps/website/test/BDD/`
- `apps/admin/test/BDD/`
- `apps/intranet/test/BDD/` (congelada, ver ADR-003/TASK-024)
- `Examples/tests/framework-automation/` — copia de referencia/plantilla original del framework, no forma parte del ecosistema ejecutable

> ⚠️ `Framework.Automation.sln` tiene actualmente una referencia de proyecto rota hacia `Framework.Core` — ver `docs/04_TRACKING/tasks/TASK-013.md` antes de asumir que compila de inmediato.

### Ejecución de Pruebas Automatizadas

```bash
dotnet build Framework.Automation.sln
dotnet test Framework.Automation.sln --logger "console;verbosity=normal"
```

---

## 6. Documentación y Especificaciones

Toda la documentación técnica está normalizada bajo la carpeta [`docs/`](docs/):

- **[Índice Maestro](docs/00_INDEX.md)**: Mapa general de navegación.
- **[Visión General de Arquitectura](docs/01_ARCHITECTURE/overview.md)**: Detalle del sistema y componentes (Website Ecosystem).
- **[SPEC-001: Lead Management System](docs/02_SPECIFICATIONS/SPEC-001_Lead_Management.md)**: MiniCRM, scoring, ciclo de vida de leads.
- **[SPEC-002: Opportunity Search System](docs/02_SPECIFICATIONS/SPEC-002_Opportunity_Search.md)** (v1.1): Búsqueda, señales reales de negocio, conversión a leads.
- **[SPEC-003: Platform Vision](docs/02_SPECIFICATIONS/SPEC-003_Platform_Vision.md)**: Visión de la futura plataforma multi-tenant (no ejecutable aún).
- **[SPEC-004: Newsletter Management](docs/02_SPECIFICATIONS/SPEC-004_Newsletter_Management.md)**: Editor Visual/HTML de campañas.
- **[SPEC-005: Blog CMS](docs/02_SPECIFICATIONS/SPEC-005_Blog_CMS.md)**: CMS de blog con SEO completo por artículo.
- **[SPEC-006: Quotes & Tariff Management](docs/02_SPECIFICATIONS/SPEC-006_Quotes_And_Tariff_Management.md)**: Cotizaciones y control tarifario ("minipos").
- **[Estándares de Código](docs/03_IMPLEMENTATION/coding-standards.md)**: Buenas prácticas, naming conventions y tipado.
- **[Estrategia de Testing](docs/03_IMPLEMENTATION/testing-strategy.md)**: Niveles de prueba y fixtures.

---

## 7. Guía de Contribución y Definición de Done

Para mantener la integridad y calidad del proyecto:

1. **Sin invenciones ni supuestos:** Todo desarrollo debe corresponder estrictamente a una especificación (`SPEC`) o tarea registrada (`TASK`).
2. **Cero Warnings / Cero Errors:** Todo commit debe compilar limpiamente con `npm run build`.
3. **Definición de Done (DoD):**
   - [ ] Implementación funcional completa según los criterios de aceptación.
   - [ ] Tipos TypeScript estrictos (sin `any` injustificado).
   - [ ] Build limpio (`npm run build`).
   - [ ] Tarea en `docs/04_TRACKING/tasks/TASK-XXX.md` actualizada con evidencia.
   - [ ] Registro en `docs/04_TRACKING/change-log/CHANGELOG.md`.

---

## 8. Contacto y Soporte

- **Organización:** Farutech Engineering Team
- **Sitio Web:** [farutech.com](https://farutech.com)
- **Reporte de Issues:** Registrar tarea en `docs/04_TRACKING/tasks/` siguiendo la plantilla oficial.

---

**© 2024-2026 Farutech. Todos los derechos reservados.**
