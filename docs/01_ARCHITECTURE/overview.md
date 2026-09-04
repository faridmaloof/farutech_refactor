# 🏛️ Visión General de Arquitectura — Farutech

**Última actualización:** Septiembre 2024  
**Estado:** ✅ Estable

---

## 🎯 Propósito del Sistema

Farutech es un ecosistema digital integral para:
- Gestión inteligente de leads y oportunidades
- Búsqueda automatizada de oportunidades de negocio
- Administración de contenidos (Blog, Newsletter)
- Analytics y seguimiento de conversiones

---

## 📊 Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────┐
│                    Usuarios Finales                      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   HAProxy Gateway                        │
│              (Routing por dominio/host)                  │
└─────────────────────────────────────────────────────────┘
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Website    │    │    Admin     │    │   Intranet   │
│  (Público)   │    │  (MiniCRM)   │    │  (Interno)   │
│   Next.js    │    │  React + DS  │    │   React      │
└──────────────┘    └──────────────┘    └──────────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             ▼
                  ┌──────────────────┐
                  │   Backend API    │
                  │   Laravel 11     │
                  │   + Sanctum Auth │
                  └──────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   MySQL 8    │    │ PostgreSQL 17│    │   Redis 7    │
│  (Website)   │    │ (Transacc.)  │    │ (Colas/Caché)│
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## 🏗️ Componentes Principales

### 1. Backend API (`apps/api/src/backend/`)

**Tecnología:** Laravel 11 + PHP 8.2  
**Propósito:** Capa transversal de negocio y datos

**Responsabilidades:**
- Autenticación y autorización (Sanctum)
- CRUD de Leads, Oportunidades, Blog, Newsletter
- Jobs asíncronos (scraping, emails, reportes)
- API RESTful versionada (`/api/v1/`)

**Estructura clave:**
```
app/
├── Http/Controllers/Api/V1/
├── Models/
├── Services/
├── Jobs/
└── Events/
```

### 2. Admin Panel (`apps/admin/src/`)

**Tecnología:** React 18 + Vite + TypeScript  
**Propósito:** MiniCRM para gestión interna

**Features principales:**
- Dashboard con métricas
- Gestión de Leads (CRUD + filtros)
- Búsqueda de Oportunidades
- Administración de Blog y Newsletter
- Configuración del sistema

**Arquitectura:** Feature-Sliced Design

### 3. Website Público (`apps/website/src/frontend/`)

**Tecnología:** Next.js 14 + React  
**Propósito:** Presencia pública y captación de leads

**Páginas clave:**
- Home con hero section
- Blog público
- Formulario de contacto
- Landing pages de servicios

### 4. Design System (`packages/design-system/src/`)

**Tecnología:** React + Rollup  
**Propósito:** Biblioteca de componentes compartidos

**Componentes:** 45+ componentes reutilizables
- UI Base (Button, Input, Modal, etc.)
- Layouts (Container, Grid, etc.)
- Componentes de negocio (LeadCard, OpportunityTable, etc.)

**Publicación:** @farutech/ui en NPM

---

## 🔐 Estrategia de Autenticación

**Herramienta:** Laravel Sanctum  
**Flujo:**

1. Login desde frontend → POST `/api/v1/login`
2. Backend genera token Sanctum
3. Frontend almacena token (httpOnly cookie o localStorage)
4. Cada request incluye `Authorization: Bearer {token}`
5. Middleware valida token y retorna usuario

**Roles disponibles:**
- `admin` — Acceso completo al Admin Panel
- `editor` — Gestión de Blog y Newsletter
- `viewer` — Solo lectura de dashboard

---

## 🗄️ Estrategia de Datos

### Multi-Database (Decisión ADR-004)

| Base de Datos | Propósito | Aplicación |
|---------------|-----------|------------|
| **MySQL 8.4** | Website público + Blog | `apps/website` |
| **PostgreSQL 17** | Admin, Leads, Oportunidades | `apps/api`, `apps/admin` |
| **Redis 7** | Colas, caché, sesiones | Todos |

**Nota:** Existe decisión pendiente de consolidar a PostgreSQL único (ver TASK-000D).

---

## 🔄 Flujo de Datos Típico

### Ejemplo: Creación de Lead

```
1. Usuario llena formulario en Website
   ↓
2. Website → POST /api/v1/contact
   ↓
3. API valida datos + crea Lead en PostgreSQL
   ↓
4. API dispara evento LeadCreated
   ↓
5. Listener envía email de notificación (Job en cola)
   ↓
6. Lead aparece en Admin Panel automáticamente
   ↓
7. Sistema de scoring calcula calidad del lead
   ↓
8. Lead se asigna automáticamente según reglas
```

---

## 🚦 Infraestructura de Deployment

**Herramienta:** Docker Compose  
**Entornos:**

### Local Development
- Todos los servicios en localhost
- Puertos expuestos para debugging
- Mailhog para testing de emails

### Production (Planificado)
- HAProxy como reverse proxy
- Dominios separados:
  - `www.farutech.com` → Website
  - `admin.farutech.com` → Admin Panel
  - `api.farutech.com` → Backend API
- SSL con Let's Encrypt
- CI/CD con GitHub Actions o Gitea

---

## 📈 Métricas de Calidad

| Métrica | Objetivo | Actual |
|---------|----------|--------|
| Cobertura de Tests | > 80% | ~35% |
| Tiempo de Respuesta API | < 200ms | ~150ms |
| Uptime | > 99.9% | N/A (dev) |
| Debt Técnico | < 5% | ~12% |

---

## 🔗 Documentos Relacionados

- [Decisiones Arquitectónicas](adr/)
- [Especificaciones Funcionales](../../02_SPECIFICATIONS/)
- [Guía de Inicio Rápido](../../03_IMPLEMENTATION/getting-started.md)
- [Estándares de Código](../../03_IMPLEMENTATION/coding-standards.md)

---

**© 2024 Farutech — Documentación oficial de arquitectura**
