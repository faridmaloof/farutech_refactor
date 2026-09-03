# 🚀 Farutech Ecosystem

> **Ecosistema digital completo** con Backend API, Admin Panel, Website público y Design System reutilizable.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4.svg?logo=php)](https://php.net)
 [![Laravel](https://img.shields.io/badge/Laravel-10-FF2D20.svg?logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)](https://react.dev)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características Principales](#-características-principales)
- [Arquitectura](#-arquitectura)
- [Estructura del Monorepo](#-estructura-del-monorepo)
- [Inicio Rápido](#-inicio-rápido)
- [Documentación](#-documentación)
- [Estado del Proyecto](#-estado-del-proyecto)
- [Licencia](#-licencia)

---

## 🎯 Descripción

Farutech Ecosystem es una plataforma integral que proporciona:

1. **Backend API (Laravel 11)**: RESTful API con documentación Scalar, autenticación Sanctum, y workers para procesos asíncronos
2. **Admin Panel (React 18)**: Dashboard completo para gestión de leads, newsletter, blog y búsqueda de oportunidades
3. **Website Público (Next.js 14)**: Sitio web moderno optimizado para SEO con blog integrado
4. **Design System (@farutech/design-system)**: Paquete NPM con 45+ componentes reutilizables para todas las aplicaciones

El sistema está diseñado para ser **escalable**, **modular** y **fácil de mantener**, siguiendo principios SOLID y las mejores prácticas de la industria.

---

## ✨ Características Principales

### 🔍 Búsqueda Inteligente de Leads
- Autocompletado jerárquico (país > estado > ciudad > municipio)
- Scraping automático de múltiples fuentes
- Quality scoring basado en datos encontrados
- Conversión a lead con un clic

### 📊 MiniCRM Integrado
- Gestión completa de leads con estados personalizables
- Historial de interacciones (llamadas, emails, reuniones)
- Seguimiento con recordatorios automáticos
- Scoring de calidad automático

### 📧 Newsletter Profesional
- Segmentación por tags y comportamiento
- Plantillas personalizables
- Tracking de opens y clicks
- Programación de envíos
- Unsubscribe automático

### 📝 Sistema de Blogs
- Editor WYSIWYG rico
- Programación de publicación
- Categorías y tags
- SEO metadata (title, description, keywords)
- Schema.org Article
- TOC automático
- Reading time estimado

### 🎨 Design System Enterprise
- 45+ componentes atómicos y compuestos
- 24 hooks personalizados
- Stores centralizados con Zustand
- Tokens de diseño configurables
- Psicología del color aplicada
- Accesibilidad WCAG 2.1 AA
- Tree-shaking habilitado

### 🏷️ UTM Tracking Completo
- Captura dinámica de todos los parámetros UTM
- Almacenamiento en sesión
- Asociación automática a leads y conversiones
- Dashboard de métricas por campaña

### ⚙️ Workers Asíncronos
- Búsqueda automática de oportunidades
- Envío masivo de newsletters
- Procesamiento de imágenes
- Generación de reportes PDF/Excel
- Sincronización y deduplicación de leads
- Limpieza programada de datos

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    GATEWAY (Nginx)                          │
│     api.farutech.local │ admin.farutech.local │ *.farutech  │
└──────────────┬────────────────────┬────────────────┬────────┘
               │                    │                │
    ┌──────────▼──────────┐ ┌───────▼────────┐ ┌────▼────────┐
    │   Backend API       │ │  Admin App     │ │  Website    │
    │   Laravel 11        │ │  React 18      │ │  Next.js 14 │
    │   + Scalar Docs     │ │  + Vite        │ │  + TSX      │
    │   + Sanctum Auth    │ │  + Design Sys  │ │             │
    │   + Queue Workers   │ │                │ │             │
    └──────────┬──────────┘ └────────────────┘ └─────────────┘
               │
    ┌──────────▼──────────────────────────────────────────────┐
    │                   INFRAESTRUCTURA                        │
    │  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
    │  │  PostgreSQL  │  │    Redis     │  │    Mailhog    │  │
    │  │  (Database)  │  │  (Colas)     │  │   (Emails)    │  │
    │  └──────────────┘  └──────────────┘  └───────────────┘  │
    └───────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura del Monorepo

```
/workspace/
├── infra/                      # Infraestructura base
│   ├── docker-compose.yml      # Servicios Docker
│   ├── nginx/                  # Configuración Gateway
│   ├── database/init/          # Scripts SQL
│   └── redis/                  # Config Redis
│
├── apps/
│   ├── api/                    # Backend Laravel 11
│   │   ├── app/
│   │   │   ├── Models/
│   │   │   ├── Http/Controllers/Api/V1/
│   │   │   ├── Services/
│   │   │   └── Jobs/
│   │   ├── routes/api.php
│   │   └── config/scalar.php
│   │
│   ├── admin/                  # Admin Panel React
│   │   ├── src/
│   │   │   ├── features/
│   │   │   │   ├── leads/
│   │   │   │   ├── opportunities/
│   │   │   │   ├── newsletter/
│   │   │   │   └── blog/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── stores/
│   │   └── package.json
│   │
│   └── website/                # Website Next.js
│       ├── app/
│       ├── components/
│       └── package.json
│
├── packages/
│   └── design-system-source/   # Design System Package
│       ├── src/
│       │   ├── components/     # 45+ componentes
│       │   ├── hooks/          # 24 hooks
│       │   ├── stores/         # Zustand stores
│       │   ├── tokens/
│       │   └── styles/
│       ├── dist/
│       └── package.json
│
├── workers/                    # Workers standalone
│
└── docs/                       # Documentación completa
    └── implementation-log/
        └── refactor-progress.md
```

---

## 🚀 Inicio Rápido

### Prerrequisitos

```bash
Docker >= 24.0
Docker Compose >= 2.20
Node.js >= 18.x
PHP >= 8.2
Composer >= 2.6
```

### 1. Configurar Hosts Locales

Agregar al `/etc/hosts`:
```bash
127.0.0.1  api.farutech.local
127.0.0.1  admin.farutech.local
127.0.0.1  farutech.local
127.0.0.1  www.farutech.local
```

### 2. Levantar Infraestructura

```bash
cd infrastructure
cp .env.example .env
# Editar .env y establecer contraseñas seguras (NO usar defaults)
docker-compose up -d
```

> **⚠️ IMPORTANTE**: El directorio `infra/` fue eliminado en TASK-000A. Todo está consolidado en `infrastructure/`.

### 3. Configurar Backend API

```bash
cd apps/api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve --host=0.0.0.0 --port=8000
```

> **⚠️ NOTA**: Los workers aún no están implementados (FASE 5 pendiente). El comando de queue:work se habilitará cuando se complete la implementación de workers.

### 4. Configurar Admin App

```bash
cd apps/admin
npm install
# npm link ../../packages/design-system-source # Pendiente: build del Design System
npm run dev
```

> **🔄 NOTA**: La Admin App incluye un scaffold funcional de React+Vite+TS+Tailwind
> (`apps/admin/src/` con auth y dashboard) y su suite de tests .NET
> (`apps/admin/test/`). Falta integrar el front con el API y publicar el
> design-system. Ver [`IMPLEMENTATION_GUIDE.md`](IMPLEMENTATION_GUIDE.md).

### 5. Configurar Website

```bash
cd apps/website
npm install
npm run dev
```

> **🔄 NOTA**: El Website está implementado en `apps/website/src/` con React 18 + Vite +
> TailwindCSS v4 (SSR/prerender incluido). El frontend público legacy
> (`apps/web/`) está archivado en `docs/archive/`.

### 6. Acceder a las Aplicaciones

| Aplicación | URL |
|------------|-----|
| API Docs | http://api.farutech.local/docs |
| Admin Panel | http://admin.farutech.local |
| Website | http://farutech.local |
| PGAdmin | http://localhost:5050 |
| Mailhog | http://localhost:8025 |

---

## 📚 Documentación

La documentación completa está disponible en el directorio [`docs/`](docs/):

- **[Guía de Implementación](IMPLEMENTATION_GUIDE.md)**: Instrucciones detalladas paso a paso
- **[Bitácora de Progreso](docs/implementation-log/refactor-progress.md)**: Estado actual y roadmap
- **[Decisiones Arquitectónicas](docs/11_ARCHITECTURE_DECISION_RECORDS.md)**: ADRs documentados
- **[Especificación Design System](docs/08_DESIGN_SYSTEM_SPECIFICATION.md)**: Componentes y tokens

---

## 📊 Estado del Proyecto

| Fase | Estado | Progreso Real | Documentado |
|------|--------|---------------|-------------|
| **FASE 0**: Checkpoint + limpieza | ✅ | 100% | ✅ |
| **FASE 1**: Scaffolding tests .NET | ✅ | 100% | ✅ |
| **FASE 2**: Backend API (Laravel 10) | ✅ | ~95% | ✅ |
| **FASE 3**: Design System | ✅ | estructura 100% · build pte. | ✅ |
| **FASE 4**: Admin App | 🔄 | scaffold + tests | ⚠️ parcial |
| **FASE 5**: Intranet App | 🔄 | scaffold + tests | ⚠️ parcial |
| **FASE 6**: Website cleanup | ⬜ | pendiente | ✅ plan |
| **FASE 7**: Infraestructura | ✅ | ~95% | ✅ |
| **FASE 8**: Test Automation | ✅ | build ✓ · runtime pte. | ✅ |
| **FASE 9**: Documentación | 🔄 | en curso | 🔄 |
| **TOTAL** | 🎯 **EN EJECUCIÓN** | **~75% estructura** | **100% plano** |

> **ℹ️ NOTA**: El estado real validado archivo por archivo está en
> [`IMPLEMENTATION_GUIDE.md`](IMPLEMENTATION_GUIDE.md). Esta sección resume la
> tabla de progreso; para detalle de tareas vea `docs/09_MASTER_IMPLEMENTATION_PLAN...md`
> y `docs/30_AUDITORIA_PROFUNDA_Y_ESTADO_REAL.md`.

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Laravel 11** - Framework PHP
- **PostgreSQL 16** - Base de datos
- **Redis 7** - Colas y caché
- **Scalar** - Documentación de API
- **Laravel Sanctum** - Autenticación

### Frontend
- **React 18** - Librería UI
- **Next.js 14** - Framework React
- **TypeScript 5** - Tipado estático
- **Vite** - Build tool
- **TailwindCSS** - Estilos

### Design System
- **Zustand** - State management
- **Storybook** - Documentación de componentes
- **Rollup** - Bundler para librería

### Infraestructura
- **Docker & Docker Compose** - Contenedores
- **Nginx** - Reverse proxy
- **Mailhog** - Testing de emails

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 📞 Contacto

- **Website**: https://farutech.local
- **Email**: info@farutech.com

---

**© 2024 Farutech. Todos los derechos reservados.**
