# 🎯 PLAN MAESTRO DE IMPLEMENTACIÓN - FARUTECH ECOSYSTEM

**Fecha**: 2024-09-03  
**Versión**: 1.0  
**Estado**: APROBADO PARA EJECUCIÓN INMEDIATA  
**Objetivo**: Llevar el proyecto del 42% real al 100% completado

---

## 📊 ESTADO ACTUAL VALIDADO (42% REAL)

| Componente | Estado Real | Archivos Existentes | Faltante |
|------------|-------------|---------------------|----------|
| **Backend API** | 60% | `apps/api/` con Laravel 11, 1 controller, 3 modelos | Migrar 11 controllers, 14 migraciones, 6 seeders desde legacy |
| **Admin App** | 0% | ❌ NO EXISTE `apps/admin/` | Crear desde cero |
| **Website** | 50% | `apps/web/apps/frontend/` (Next.js) | Split a `apps/website/`, eliminar admin embebido |
| **Workers** | 0% | ❌ NO EXISTE `workers/` | Crear desde cero |
| **Design System** | 95% | `packages/design-system-source/` con 67 componentes | Build, publicación npm |
| **Infraestructura** | 50% | DUPLICADO: `infra/` + `infrastructure/` | Consolidar en uno solo |

---

## 🚨 DECISIONES ARQUITECTÓNICAS CONFIRMADAS

### 1. Base de Datos - 3 MOTORES (confirmado por owner)
- **MySQL 8.4**: Website público (lectura principalmente)
- **PostgreSQL 16**: Aplicaciones transaccionales (Admin, Intranet, API)
- **MongoDB 8**: Logs de auditoría y actividad de Admin

### 2. Email - SMTP Dual
- **Desarrollo**: Mailhog (ya configurado en infra/)
- **Producción**: SMTP de Hostinger o Google Workspace
- **Futuro**: Posible migración a SendGrid/API

### 3. Autenticación - SSO Centralizado
- **Dominios permitidos**: `farutech.com`, `farutech.local`
- **Mecanismo**: Laravel Sanctum con cookies compartidas por subdominio
- **Website público**: Solo lectura, sin login requerido
- **Admin/Intranet**: Login obligatorio con dominio restringido

### 4. Framework Backend - Laravel 11 (NO Lumen)
- **Decisión**: Mantener Laravel 11 (estable, con soporte LTS)
- **Razón**: Owner confirma "versión más estable con soporte"
- **Optimización**: Remover paquetes innecesarios para reducir inodes

### 5. Infraestructura - CONSOLIDAR en `infrastructure/`
- **Eliminar**: `infra/` (solo PostgreSQL, incompleto)
- **Mantener**: `infrastructure/` (3 motores BD, ya corregido con TASK-002)
- **Gateway**: HAProxy (más flexible para múltiples protocolos)

---

## 📋 FASES DE IMPLEMENTACIÓN

### FASE 0: CONSOLIDACIÓN Y LIMPIEZA (1-2 días) ⚡ PRIORIDAD CRÍTICA

#### TASK-000A: Consolidar Infraestructura
**Objetivo**: Eliminar duplicidad, mantener 3 motores BD  
**Archivos**:
- ✅ MANTENER: `/workspace/infrastructure/` (docker-compose.yml, .env.example, gateway/, scripts/)
- ❌ ELIMINAR: `/workspace/infra/` completo
- ✅ MOVER: Configuración Redis de `infra/redis/` → `infrastructure/redis/`

**Criterio de aceptación**:
- [ ] Un solo directorio `infrastructure/` funcional
- [ ] Docker-compose levanta MySQL, PostgreSQL, MongoDB, Redis, HAProxy, Mailhog
- [ ] `.env.example` mantiene placeholders (TASK-002 ya aplicado)

---

#### TASK-000B: Corregir README Principal
**Objetivo**: Reflejar estado REAL (42%), no el documentado (100%)  
**Archivos**: `/workspace/README.md`

**Cambios**:
- Actualizar tabla de progreso a valores reales
- Eliminar afirmaciones falsas de "100% completado"
- Documentar roadmap restante

---

#### TASK-000C: Migrar Backend Legacy a apps/api/
**Objetivo**: Todo el backend en `apps/api/`, eliminar `apps/web/apps/backend/`  
**Origen**: `apps/web/apps/backend/`  
**Destino**: `apps/api/`

**Elementos a migrar**:
1. **Controllers** (11 archivos):
   - ContactController.php ✅ (ya tiene tests)
   - NewsletterController.php ✅ (ya tiene tests)
   - AuthController.php
   - LeadController.php
   - BlogController.php
   - BlogCategoryController.php
   - UserController.php
   - SettingsController.php
   - DashboardController.php
   - RegisterController.php
   - ExampleController.php

2. **Migraciones** (14 archivos):
   - Todas de `database/migrations/` → `apps/api/database/migrations/`

3. **Seeders** (6 archivos):
   - AdminUserSeeder.php ✅ (ya corregido TASK-001)
   - ApplicationTypeSeeder.php
   - ServiceSeeder.php
   - BlogCategorySeeder.php
   - BlogPostSeeder.php
   - DefaultSettingsSeeder.php

4. **Tests**:
   - ContactApiTest.php
   - NewsletterApiTest.php
   - Demás tests de controllers

**Acciones post-migración**:
- Actualizar namespaces de `Database\\` a `App\\`
- Ejecutar `composer dump-autoload`
- Validar que todos los tests pasan
- Eliminar `apps/web/apps/backend/`

---

### FASE 1: BACKEND API COMPLETO (3-4 días) 🔥

#### TASK-101: Configurar Scalar Documentation
**Dependencias**: TASK-000B completada  
**Paquetes**: `zircote/swagger-php`

**Implementación**:
```bash
cd apps/api
composer require zircote/swagger-php
```

**Ruta**: `/docs` (solo local/dev/qa, bloqueado en prod)

---

#### TASK-102: Implementar Autenticación Sanctum
**Endpoints**:
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout` (auth required)
- `GET /api/v1/auth/me` (auth required)

**Middleware**:
- `auth:sanctum` para rutas protegidas
- Rate limiting: 60 req/min IP, 10 req/min usuario no auth

---

#### TASK-103: Configurar CORS Multi-Dominio
**Dominios permitidos**:
- `*.farutech.com`
- `*.farutech.local`
- `localhost` (desarrollo)

**Headers**:
- `Authorization`
- `Content-Type`
- `X-Requested-With`

---

#### TASK-104: Ejecutar Migraciones y Seeders
**Comandos**:
```bash
cd apps/api
php artisan migrate --seed
```

**Validación**:
- [ ] 15 tablas creadas
- [ ] Usuario admin creado con password aleatoria
- [ ] Datos seed aplicados

---

### FASE 2: WORKERS (2-3 días) ⚙️

#### TASK-201: Crear Estructura de Workers
**Directorio**: `/workspace/workers/`

**Estructura**:
```
workers/
├── app/
│   ├── Jobs/
│   │   ├── FindOpportunitiesJob.php
│   │   ├── SendNewsletterJob.php
│   │   ├── ProcessImageJob.php
│   │   ├── GenerateReportJob.php
│   │   └── CleanOldDataJob.php
│   └── Workers/
│       └── WorkerServiceProvider.php
├── config/
├── composer.json
└── artisan
```

**Dependencias**: Redis configurado en infrastructure/

---

#### TASK-202: Implementar Jobs Específicos

**FindOpportunitiesJob**:
- Scraping de fuentes predefinidas
- Quality scoring automático
- Conversión opcional a lead

**SendNewsletterJob**:
- Envío por lotes (batch de 50)
- Tracking de opens/clicks
- Manejo de rebotes

**ProcessImageJob**:
- Resize múltiple (thumbnail, medium, large)
- Optimización WebP
- Upload a S3/local

**GenerateReportJob**:
- PDF: DomPDF o Snappy
- Excel: Laravel Excel
- Envío por email

**CleanOldDataJob**:
- Leads > 90 días sin interacción
- Logs > 365 días
- Sesiones expiradas

---

#### TASK-203: Configurar Supervisor
**Archivo**: `infrastructure/supervisor/supervisord.conf`

**Programas**:
- `worker-find-opportunities`
- `worker-newsletter`
- `worker-image-processor`
- `worker-report-generator`
- `worker-cleanup`

---

### FASE 3: ADMIN APP (5-7 días) 🎨

#### TASK-301: Setup Inicial
**Directorio**: `/workspace/apps/admin/`

**Stack**:
- Vite + React 18 + TypeScript
- Design System (@farutech/design-system)
- React Router v6
- Axios para API calls
- Zustand para estado global

**Estructura**:
```
apps/admin/
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── leads/
│   │   ├── newsletter/
│   │   ├── blog/
│   │   └── settings/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   └── App.tsx
├── package.json
└── vite.config.ts
```

---

#### TASK-302: Auth Screens (usando Design System)
**Pantallas**:
- Login (`/login`)
- Register (`/register`) - **FALTA en Design System**
- Forgot Password (`/forgot-password`)
- Reset Password (`/reset/:token`)

**Flujo**:
1. Usuario ingresa credenciales
2. POST a `/api/v1/auth/login`
3. Guardar token en cookie httpOnly
4. Redirect a `/dashboard`

**Seguridad**:
- CSRF protection
- Rate limiting (5 intentos/hora)
- Bloqueo por IP después de 10 intentos fallidos

---

#### TASK-303: Dashboard y Módulos

**Dashboard** (`/dashboard`):
- Métricas clave (leads totales, conversiones, suscriptores)
- Gráficos de tendencias (últimos 30 días)
- Actividad reciente
- Accesos rápidos

**Módulo Leads** (`/leads`):
- Listado con filtros (estado, fuente, fecha)
- CRUD completo
- Historial de interacciones
- Scoring visual
- Exportar a CSV/Excel

**Módulo Newsletter** (`/newsletter`):
- Suscriptores (listado, tags, segmentación)
- Campañas (crear, programar, enviar)
- Plantillas (editor WYSIWYG)
- Analytics (opens, clicks, rebotes)

**Módulo Blog** (`/blog`):
- Posts (CRUD, programación, categorías)
- Categorías y tags
- Comentarios (aprobar/rechazar)
- SEO metadata

**Módulo Configuración** (`/settings`):
- UTM Tracking
- Analytics (Google, Facebook Pixel)
- Dominios permitidos
- SMTP configuration

---

### FASE 4: WEBSITE (3-4 días) 🌐

#### TASK-401: Split de Frontend
**Origen**: `apps/web/apps/frontend/`  
**Destino**: `/workspace/apps/website/`

**Acciones**:
1. Crear `apps/website/` con Next.js 14
2. Mover páginas PÚBLICAS desde frontend legacy:
   - Home (`/`)
   - Servicios (`/servicios`)
   - Blog (`/blog`, `/blog/[slug]`)
   - Contacto (`/contacto`)
   - Newsletter (`/newsletter`)
3. **NO MOVER**: Páginas admin (`/admin/*`)
4. Integrar Design System

---

#### TASK-402: SEO y Optimización
**Metadata**:
- Title templates por página
- Description única por página
- Open Graph tags
- Twitter Cards
- Schema.org (Organization, Article, LocalBusiness)

**Performance**:
- Imágenes optimizadas (WebP, lazy loading)
- Code splitting automático
- Static generation donde aplique
- Core Web Vitals > 90

**Sitemap**:
- Generación automática
- Robots.txt configurado

---

### FASE 5: DESIGN SYSTEM BUILD (1 día) 📦

#### TASK-501: Build y Publicación
**Comandos**:
```bash
cd packages/design-system-source
npm install
npm run build
npm run test:coverage
npm publish --registry https://npm.pkg.github.com
```

**Validación**:
- [ ] `dist/` generado
- [ ] Tests pasan (>90% cobertura)
- [ ] Paquete publicado en GitHub Packages
- [ ] Versión: `@farutech/design-system@1.0.0`

---

## 🗓️ CRONOGRAMA ESTIMADO

| Fase | Días | Total Acumulado |
|------|------|-----------------|
| FASE 0: Consolidación | 2 | 2 |
| FASE 1: Backend API | 4 | 6 |
| FASE 2: Workers | 3 | 9 |
| FASE 3: Admin App | 7 | 16 |
| FASE 4: Website | 4 | 20 |
| FASE 5: Design System | 1 | 21 |

**Total estimado**: 21 días hábiles (~4 semanas calendario)

---

## ✅ CRITERIOS DE ACEPTACIÓN GLOBAL

### Seguridad
- [ ] Cero passwords hardcodeadas
- [ ] Todos los `.env.example` con placeholders
- [ ] Sanctum configurado correctamente
- [ ] CORS restrictivo a dominios específicos
- [ ] Rate limiting activo en todas las APIs
- [ ] HTTPS forzado en producción

### Funcionalidad
- [ ] Backend API: 20+ endpoints funcionales
- [ ] Admin App: 5 módulos completos
- [ ] Website: 5+ páginas públicas optimizadas
- [ ] Workers: 5 jobs procesando colas
- [ ] Tests unitarios: >80% cobertura
- [ ] Tests E2E: Flujos críticos cubiertos

### Infraestructura
- [ ] Docker Compose: 1 archivo funcional
- [ ] 3 bases de datos operativas
- [ ] Redis conectado y funcional
- [ ] Gateway HAProxy enruta tráfico
- [ ] Supervisor monitorea workers

### Documentación
- [ ] README actualizado (estado real)
- [ ] API docs en `/docs` (Scalar)
- [ ] Guías de deployment
- [ ] CHANGELOG mantenido
- [ ] ADRs actualizados

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

1. **HOY**: Ejecutar FASE 0 (TASK-000A, TASK-000B, TASK-000C)
2. **DÍA 2-3**: FASE 1 completa (Backend API 100%)
3. **DÍA 4-6**: FASE 2 (Workers operativos)
4. **DÍA 7-13**: FASE 3 (Admin App funcional)
5. **DÍA 14-17**: FASE 4 (Website en producción)
6. **DÍA 18**: FASE 5 (Design System publicado)
7. **DÍA 19-21**: Testing integral, ajustes finales, deployment

---

**© 2024 Farutech - Plan Maestro de Implementación**
