# 🚀 Farutech Ecosystem

> **Ecosistema digital empresarial**: Backend API (Laravel 11), Admin Panel (React 18), Website público (React 18 + Vite) y Design System unificado.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4.svg?logo=php)](https://php.net)
[![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20.svg?logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)](https://react.dev)
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

Farutech Ecosystem es una plataforma integral modular diseñada para captación, procesamiento y gestión proactiva de clientes potenciales, servicios tecnológicos e inteligencia de oportunidades comerciales.

- **[Índice Maestro de Documentación](docs/00_INDEX.md)**: Navegación completa del repositorio.
- **[Master Tracking Plan](docs/04_TRACKING/master-plan.md)**: Seguimiento en tiempo real de fases, tareas y estados.
- **[Guía de Uso del Tracking](docs/04_TRACKING/guia-de-uso.md)**: Ciclo de vida y reglas de desarrollo.

---

## 2. Estado Real por Aplicación

> **Auditoría Verificada**: Basado en evidencia física de código, sin supuestos ni afirmaciones infladas (Progreso Global Real: **~45%**).

| Aplicación / Módulo | Ubicación | Stack Técnico | Estado Real | Progreso | Notas Verificadas |
|---------------------|-----------|---------------|-------------|----------|-------------------|
| **Website Público** | `apps/website/src/frontend/` | React 18, Vite, Tailwind v4, React Router 7 | ✅ Funcional | 100% | Páginas públicas operativas, drawer de contacto interactivo, newsletter, code-splitting con lazy loading. |
| **Backend API** | `apps/api/src/backend/` | Laravel 11, PHP 8.2, Sanctum, PostgreSQL | ✅ Funcional | 90% | API RESTful versionada, autenticación Sanctum, migraciones y endpoints para leads y newsletter. |
| **Design System** | `packages/design-system/` | React, TypeScript, Tailwind CSS | ✅ Estructurado | 80% | Estructura normalizada sin anidación errónea (ADR-002), 45+ componentes exportados. |
| **Admin Panel** | `apps/admin/src/frontend/` | React 18, Vite, TypeScript | 🟡 En Desarrollo | 45% | Autenticación y dashboard base operativos; integración con SPEC-001 (Leads) y SPEC-002 (Oportunidades) en progreso. |
| **Intranet** | `apps/intranet/` | React 18, Vite | ⏸️ Congelada | 20% | Scaffold base preservado. Congelado por decisión estratégica (ADR-003 Alternativa D) hasta definición formal de PO. |
| **Infraestructura** | `infrastructure/` | Docker, Docker Compose, Nginx, PostgreSQL, Redis | ✅ Listo | 90% | Contenedores Docker listos para base de datos, caché y servicios locales. |

---

## 3. Arquitectura y Decisiones (ADRs)

El sistema implementa una arquitectura desacoplada por subdominios, con servicios y responsabilidades aisladas:

```
                          ┌───────────────────────────┐
                          │    Usuarios / Clientes    │
                          └─────────────┬─────────────┘
                                        │
                                        ▼
                          ┌───────────────────────────┐
                          │      Reverse Proxy        │
                          └─────────────┬─────────────┘
                                        │
            ┌───────────────────────────┼───────────────────────────┐
            ▼                           ▼                           ▼
 ┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
 │   Website Público    │    │     Admin Panel      │    │   Intranet (Freeze)  │
 │    farutech.com      │    │ admin.farutech.local │    │                      │
 └──────────┬───────────┘    └──────────┬───────────┘    └──────────────────────┘
            │                           │
            └─────────────┬─────────────┘
                          ▼
             ┌──────────────────────────┐
             │       Backend API        │
             │     api.farutech.com     │
             └────────────┬─────────────┘
                          │
             ┌────────────┴─────────────┐
             ▼                          ▼
 ┌──────────────────────┐    ┌──────────────────────┐
 │    PostgreSQL 16     │    │       Redis 7        │
 │     (Datos Core)     │    │    (Colas/Caché)     │
 └──────────────────────┘    └──────────────────────┘
```

### Decisiones de Arquitectura Registradas (ADRs)

- **[ADR-001: Admin Routing Strategy](docs/01_ARCHITECTURE/adr/ADR-001_admin_routing_strategy.md)**: Adopción de subdominio dedicado `admin.farutech.local` para máximo aislamiento de sesión, seguridad y deploys independientes.
- **[ADR-002: Design System Structure](docs/01_ARCHITECTURE/adr/ADR-002_design_system_structure.md)**: Normalización del directorio del Design System, eliminando la redundancia anidada `src/src/` hacia `src/`.
- **[ADR-003: Intranet Strategy](docs/01_ARCHITECTURE/adr/ADR-003_intranet_strategy.md)**: Alternativa D seleccionada: congelamiento del desarrollo de Intranet preservando su scaffold hasta recepción de casos de uso formales.
- **[ADR-004: Multi-Database Strategy](docs/01_ARCHITECTURE/adr/ADR-004_multi_database_strategy.md)**: Consolidación hacia PostgreSQL transaccional único y Redis para rendimiento y colas.

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
# Instalar dependencias del monorepo
npm install

# Instalar dependencias de website
cd apps/website/src/frontend && npm install && cd ../../../

# Instalar dependencias de admin
cd apps/admin/src/frontend && npm install && cd ../../../
```

### Comandos de Desarrollo y Compilación

```bash
# Iniciar servidor de desarrollo del Website (puerto 3000)
npm run dev

# Compilar producción y verificar tipos (DEBE terminar sin errores ni warnings)
npm run build

# Typecheck estático TypeScript
npm run typecheck
```

### Levantar Infraestructura Local

```bash
cd infrastructure
docker compose up -d
```

---

## 5. Framework de Tests

El repositorio cuenta con una suite de pruebas de automatización basada en **.NET 8** y **Reqnroll** (BDD) localizada en:
- `Framework.Automation.sln`
- `apps/admin/test/BDD/`
- `apps/website/test/BDD/`
- `apps/intranet/test/BDD/`

### Ejecución de Pruebas Automatizadas

```bash
# Compilar la solución de pruebas .NET
dotnet build Framework.Automation.sln

# Ejecutar pruebas BDD
dotnet test Framework.Automation.sln --logger "console;verbosity=normal"
```

---

## 6. Documentación y Especificaciones

Toda la documentación técnica está normalizada bajo la carpeta [`docs/`](docs/):

- **[Índice Maestro](docs/00_INDEX.md)**: Mapa general de navegación.
- **[Visión General de Arquitectura](docs/01_ARCHITECTURE/overview.md)**: Detalle del sistema y componentes.
- **[SPEC-001: Lead Management System](docs/02_SPECIFICATIONS/SPEC-001_Lead_Management.md)**: MiniCRM, scoring, ciclo de vida de leads y endpoints.
- **[SPEC-002: Opportunity Search System](docs/02_SPECIFICATIONS/SPEC-002_Opportunity_Search.md)**: Búsqueda, scraping, geolocalización y conversión a leads.
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
