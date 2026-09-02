# 🚀 Farutech Ecosystem - Guía de Implementación Completa

## 📋 Tabla de Contenidos
- [Visión General](#visión-general)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Estructura de Directorios](#estructura-de-directorios)
- [Requisitos Previos](#requisitos-previos)
- [Implementación Paso a Paso](#implementación-paso-a-paso)
  - [1. Infraestructura Base](#1-infraestructura-base)
  - [2. Backend API](#2-backend-api)
  - [3. Admin App](#3-admin-app)
  - [4. Website](#4-website)
  - [5. Design System](#5-design-system)
  - [6. Workers](#6-workers)
- [Dominios Locales](#dominios-locales)
- [Comandos Útiles](#comandos-útiles)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visión General

Este repositorio contiene el ecosistema completo de Farutech con una arquitectura moderna basada en:

- **Backend API**: Laravel 11 con documentación Scalar
- **Admin App**: React 18 + Vite + TypeScript
- **Website**: Next.js 14 App Router
- **Design System**: Paquete NPM reutilizable (@farutech/design-system)
- **Workers**: Procesos asíncronos para colas
- **Infraestructura**: Docker Compose con PostgreSQL, Redis, Nginx

### Características Principales

✅ **Búsqueda Inteligente de Leads**: Encuentra oportunidades por ciudad con autocompletado jerárquico  
✅ **Quality Scoring**: Puntuación automática basada en datos encontrados  
✅ **UTM Tracking**: Seguimiento completo de campañas  
✅ **Newsletter**: Gestión de suscriptores y envíos masivos  
✅ **Blog**: Sistema completo con SEO y programación  
✅ **MiniCRM**: Gestión de leads con interacciones y seguimiento  

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        GATEWAY (Nginx)                          │
│  api.farutech.local │ admin.farutech.local │ farutech.local    │
└──────────────┬──────────────────────┬─────────────────┬────────┘
               │                      │                 │
    ┌──────────▼──────────┐ ┌────────▼────────┐ ┌─────▼────────┐
    │   Backend API       │ │   Admin App     │ │   Website    │
    │   Laravel 11        │ │   React 18      │ │   Next.js 14 │
    │   + Scalar Docs     │ │   + Vite        │ │   + TSX      │
    │   + Sanctum Auth    │ │   + Design Sys  │ │              │
    └──────────┬──────────┘ └─────────────────┘ └──────────────┘
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

## 📁 Estructura de Directorios

```
/workspace/
├── infra/                      # Infraestructura base (Docker, DB, Nginx)
│   ├── docker-compose.yml      # Definición de servicios base
│   ├── nginx/
│   │   ├── nginx.conf          # Configuración principal
│   │   └── conf.d/             # Configuraciones por dominio
│   │       ├── api.conf        # api.farutech.local
│   │       ├── admin.conf      # admin.farutech.local
│   │       └── website.conf    # farutech.local
│   ├── database/
│   │   └── init/
│   │       └── 001_init_database.sql  # Script de inicialización
│   ├── redis/
│   │   └── redis.conf          # Configuración Redis
│   └── .env                    # Variables de entorno infra
│
├── apps/
│   ├── api/                    # Backend Laravel 11
│   │   ├── app/
│   │   │   ├── Models/         # Modelos Eloquent
│   │   │   ├── Http/
│   │   │   │   └── Controllers/Api/V1/
│   │   │   ├── Services/       # Lógica de negocio
│   │   │   └── Jobs/           # Trabajos en cola
│   │   ├── database/migrations/
│   │   ├── routes/api.php
│   │   └── .env
│   │
│   ├── admin/                  # Admin App React
│   │   ├── src/
│   │   │   ├── components/     # Componentes específicos
│   │   │   ├── features/       # Features por módulo
│   │   │   │   ├── leads/
│   │   │   │   ├── opportunities/
│   │   │   │   ├── newsletter/
│   │   │   │   └── blog/
│   │   │   ├── hooks/
│   │   │   ├── stores/
│   │   │   └── pages/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── website/                # Website Next.js
│       ├── app/
│       ├── components/
│       ├── lib/
│       └── package.json
│
├── packages/
│   └── design-system-source/   # Design System Package
│       ├── src/
│       │   ├── components/     # 45+ componentes
│       │   ├── hooks/          # Hooks personalizados
│       │   ├── stores/         # Stores Zustand
│       │   ├── tokens/         # Tokens de diseño
│       │   └── styles/
│       ├── dist/               # Build listo para npm
│       └── package.json
│
├── workers/                    # Scripts standalone
│   └── *.ts
│
└── docs/                       # Documentación completa
    └── implementation-log/
        └── refactor-progress.md
```

---

## ✅ Requisitos Previos

### Software Necesario

```bash
# Docker y Docker Compose
Docker >= 24.0
Docker Compose >= 2.20

# Para desarrollo local
Node.js >= 18.x
PHP >= 8.2
Composer >= 2.6
PostgreSQL >= 16 (si no usas Docker)
Redis >= 7 (si no usas Docker)
```

### Verificar Instalación

```bash
docker --version
docker-compose --version
node --version
npm --version
php --version
composer --version
```

---

## 🚀 Implementación Paso a Paso

### 1. Infraestructura Base

#### 1.1 Configurar Hosts Locales

Agregar al archivo `/etc/hosts` (Linux/Mac) o `C:\Windows\System32\drivers\etc\hosts` (Windows):

```bash
127.0.0.1  api.farutech.local
127.0.0.1  admin.farutech.local
127.0.0.1  farutech.local
127.0.0.1  www.farutech.local
```

#### 1.2 Levantar Infraestructura

```bash
cd /workspace/infra

# Copiar variables de entorno
cp .env.example .env

# Iniciar todos los servicios
docker-compose up -d

# Verificar estado
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f
```

**Servicios Iniciados:**
- `farutech_gateway`: Nginx reverse proxy (puertos 80, 443)
- `farutech_postgres`: PostgreSQL 16 (puerto 5432)
- `farutech_redis`: Redis 7 (puerto 6379)
- `farutech_mailhog`: Mailhog testing (puertos 1025, 8025)
- `farutech_pgadmin`: PGAdmin UI (puerto 5050)

#### 1.3 Verificar Base de Datos

La base de datos se inicializa automáticamente con el script `001_init_database.sql`:

```bash
# Conectar a PostgreSQL
docker exec -it farutech_postgres psql -U farutech -d farutech

# Listar tablas creadas
\dt farutech.*

# Ver datos iniciales
SELECT * FROM farutech.locations WHERE type = 'country';
```

**Tablas Creadas:**
- `locations`: Jerarquía geográfica (países, estados, ciudades, municipios)
- `leads`: Gestión de clientes potenciales con UTM tracking
- `lead_interactions`: Historial de seguimientos
- `opportunities`: Oportunidades encontradas por scraping
- `newsletter_subscribers`: Suscriptores a newsletter
- `blog_posts`: Artículos del blog
- `utm_tracking`: Seguimiento de campañas

---

### 2. Backend API

#### 2.1 Instalar Dependencias

```bash
cd /workspace/apps/api

# Instalar dependencias de PHP
composer install

# Copiar archivo de entorno
cp .env.example .env

# Generar clave de aplicación
php artisan key:generate

# Configurar variables de entorno (.env)
# Asegurarse que apunte a la base de datos Docker:
# DB_CONNECTION=pgsql
# DB_HOST=host.docker.internal
# DB_PORT=5432
# DB_DATABASE=farutech
# DB_USERNAME=farutech
# DB_PASSWORD=Farutech2024!Secure
# REDIS_HOST=host.docker.internal
# REDIS_PORT=6379
# REDIS_PASSWORD=FarutechRedis2024!
```

#### 2.2 Ejecutar Migraciones

```bash
# Ejecutar migraciones (si no se usó el script SQL)
php artisan migrate

# Seeders opcionales
php artisan db:seed
```

#### 2.3 Configurar Scalar Documentation

```bash
# La documentación Scalar está configurada en config/scalar.php
# Acceder a: http://api.farutech.local/docs
```

#### 2.4 Iniciar Servidor de Desarrollo

```bash
# Opción A: PHP built-in server
php artisan serve --host=0.0.0.0 --port=8000

# Opción B: Docker con PHP-FPM (recomendado para producción)
# Ver docker-compose.apps.yml
```

#### 2.5 Iniciar Workers

```bash
# Worker para búsqueda de oportunidades
php artisan queue:work redis --queue=find-opportunities --sleep=3 --tries=3

# Worker para envío de newsletters
php artisan queue:work redis --queue=newsletters --sleep=5 --tries=2

# Worker para procesamiento de imágenes
php artisan queue:work redis --queue=images --sleep=2 --tries=3

# Worker para generación de reportes
php artisan queue:work redis --queue=reports --sleep=5 --tries=2

# Worker para sincronización de leads
php artisan queue:work redis --queue=sync-leads --sleep=10 --tries=1

# Worker para limpieza de datos
php artisan queue:work redis --queue=cleanup --sleep=60 --tries=1
```

#### 2.6 Verificar API

```bash
# Testear endpoint de locations
curl -X GET "http://api.farutech.local/api/v1/locations/search?q=bog&limit=5" \
  -H "Accept: application/json"

# Testear búsqueda de oportunidades
curl -X POST "http://api.farutech.local/api/v1/leads/opportunities/search" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "city": "Bogotá",
    "service": "desarrollo web",
    "limit": 10
  }'
```

**Endpoints Disponibles:**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/locations/search` | Buscar ubicaciones jerárquicas |
| POST | `/api/v1/leads/opportunities/search` | Encontrar oportunidades |
| GET | `/api/v1/leads` | Listar leads |
| POST | `/api/v1/leads` | Crear lead |
| PUT | `/api/v1/leads/{id}` | Actualizar lead |
| DELETE | `/api/v1/leads/{id}` | Eliminar lead |
| POST | `/api/v1/contact` | Formulario de contacto |
| POST | `/api/v1/newsletter/subscribe` | Suscribirse a newsletter |
| GET | `/api/v1/blog/posts` | Listar posts publicados |
| GET | `/api/v1/blog/posts/{slug}` | Ver post completo |

---

### 3. Admin App

#### 3.1 Instalar Dependencias

```bash
cd /workspace/apps/admin

# Instalar dependencias
npm install

# Instalar Design System local (desarrollo)
npm link ../../packages/design-system-source
```

#### 3.2 Configurar Variables de Entorno

Crear archivo `.env`:

```env
VITE_API_URL=http://api.farutech.local/api/v1
VITE_APP_NAME="Farutech Admin"
VITE_APP_ENV=development
```

#### 3.3 Iniciar Servidor de Desarrollo

```bash
npm run dev
```

Acceder a: `http://localhost:5173`

#### 3.4 Build para Producción

```bash
npm run build

# Los archivos generados en dist/ son servidos por Nginx
# en admin.farutech.local
```

#### 3.5 Features Disponibles

**Gestión de Leads:**
- Listado con filtros avanzados
- Búsqueda por nombre, email, empresa
- Filtros por estado, fuente, calidad
- Acciones masivas (exportar, eliminar, cambiar estado)
- Vista detallada con historial de interacciones

**Búsqueda de Oportunidades:**
- Autocompletado jerárquico (país > estado > ciudad)
- Mínimo 3 caracteres para buscar
- Scraping automático de múltiples fuentes
- Quality scoring en tiempo real
- Conversión a lead con un clic

**Newsletter:**
- Listado de suscriptores
- Segmentación por tags
- Creación de campañas
- Programación de envíos
- Métricas de opens y clicks

**Blog Manager:**
- Editor rico (WYSIWYG)
- Programación de publicación
- Categorías y tags
- SEO metadata
- Vistas y engagement

---

### 4. Website

#### 4.1 Instalar Dependencias

```bash
cd /workspace/apps/website

npm install
```

#### 4.2 Configurar Variables de Entorno

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://api.farutech.local/api/v1
NEXT_PUBLIC_SITE_URL=https://farutech.local
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

#### 4.3 Iniciar Servidor de Desarrollo

```bash
npm run dev
```

Acceder a: `http://localhost:3000`

#### 4.4 Build para Producción

```bash
# Generar sitio estático
npm run build

# Iniciar servidor de producción
npm run start
```

Los archivos estáticos se generan en `out/` y son servidos por Nginx.

#### 4.5 Páginas Implementadas

- **Home**: Landing principal con hero, features, testimonials
- **Servicios**: Listado con filtros y cards
- **Detalle Servicio**: Información completa con schema.org
- **Blog**: Listado con paginación y categorías
- **Post Blog**: Contenido completo con TOC automático
- **Contacto**: Formulario con validación y UTM tracking

#### 4.6 UTM Tracking Automático

El website captura automáticamente todos los parámetros UTM del URL y los asocia al formulario de contacto:

```javascript
// Ejemplo de URL con UTMs
https://farutech.local/contact?utm_source=google&utm_medium=cpc&utm_campaign=verano2024

// Los parámetros se guardan en sessionStorage y se envían con el form
```

---

### 5. Design System

#### 5.1 Estructura del Paquete

```
packages/design-system-source/
├── src/
│   ├── components/
│   │   ├── atomic/       # Button, Input, Icon, etc.
│   │   ├── molecular/    # Card, Alert, Badge, etc.
│   │   ├── organism/     # CRUDTable, DataTable, etc.
│   │   └── template/     # Layouts, Screens, etc.
│   ├── hooks/
│   │   ├── useAsyncData.ts
│   │   ├── useSelect.ts
│   │   ├── useTable.ts
│   │   └── ...
│   ├── stores/
│   │   ├── toastStore.ts
│   │   ├── sidebarStore.ts
│   │   └── ...
│   ├── core/
│   │   ├── apiClient.ts
│   │   └── dataMapper.ts
│   ├── tokens/
│   │   └── index.ts
│   └── styles/
│       └── index.css
├── dist/                  # Build compilado
├── package.json
└── README.md
```

#### 5.2 Componentes Disponibles (45+)

**Atómicos:**
- Button, Input, Select, Textarea, Checkbox, Radio, Toggle
- Icon, Avatar, Badge, Tag, Tooltip, Spinner
- Typography (H1-H6, P, Span)

**Moleculares:**
- Card, Alert, Modal, Dropdown, Tabs, Accordion
- Breadcrumbs, Pagination, Progress, Skeleton
- Toast, PushNotification

**Organismos:**
- CRUDTable (con acciones globales y por registro)
- DataTable (server-side pagination, sorting, filtering)
- MultiSelect, Autocomplete, Cascader
- TopNav, Sidebar, UserProfile
- LoginScreen, RegisterScreen

**Pantallas Completas:**
- AuthScreens (Login, Register, ForgotPassword)
- Dashboard layouts
- CRUD templates

#### 5.3 Usar en Proyectos

```bash
# Enlazar paquete local (desarrollo)
cd packages/design-system-source
npm link

cd ../../apps/admin
npm link @farutech/design-system

# O instalar desde registry (producción)
npm install @farutech/design-system
```

#### 5.4 Ejemplo de Uso

```tsx
import { 
  CRUDTable, 
  Button, 
  Toast, 
  useToast 
} from '@farutech/design-system';

function MyComponent() {
  const toast = useToast();
  
  const handleSuccess = () => {
    toast.success('Operación exitosa');
  };
  
  return (
    <CRUDTable
      columns={[...]}
      data={data}
      globalActions={[
        { label: 'Exportar', icon: 'download', onClick: handleExport }
      ]}
      rowActions={(row) => [
        { label: 'Editar', icon: 'edit', onClick: () => handleEdit(row) },
        { label: 'Eliminar', icon: 'trash', onClick: () => handleDelete(row) }
      ]}
    />
  );
}
```

---

### 6. Workers

#### 6.1 Workers Disponibles

Todos los workers están implementados como Jobs de Laravel en `apps/api/app/Jobs/`:

| Job | Cola | Descripción |
|-----|------|-------------|
| `FindOpportunitiesJob` | find-opportunities | Scraping y búsqueda de leads |
| `SendNewsletterJob` | newsletters | Envío masivo de emails |
| `ProcessImageJob` | images | Optimización de imágenes |
| `GenerateReportJob` | reports | Generación de PDFs/Excels |
| `SyncLeadsJob` | sync-leads | Sincronización y deduplicación |
| `CleanOldDataJob` | cleanup | Limpieza programada |

#### 6.2 Ejecutar Workers

```bash
# Individualmente
php artisan queue:work redis --queue=find-opportunities

# Múltiples colas
php artisan queue:work redis --queue=default,find-opportunities,newssenders

# Con Supervisor (producción)
# Ver infra/supervisor/supervisor.conf
```

#### 6.3 Monitorear Colas

```bash
# Ver trabajos en proceso
php artisan queue:monitor redis

# Ver trabajos fallidos
php artisan queue:failed

# Reintentar trabajos fallidos
php artisan queue:retry all

# Limpiar trabajos fallidos
php artisan queue:flush
```

---

## 🌐 Dominios Locales

Después de configurar el archivo `/etc/hosts`, acceder a:

| Aplicación | URL | Propósito |
|------------|-----|-----------|
| **API** | http://api.farutech.local | Backend Laravel + Scalar Docs |
| **Admin** | http://admin.farutech.local | Panel de administración React |
| **Website** | http://farutech.local | Sitio público Next.js |
| **PGAdmin** | http://localhost:5050 | Gestión de base de datos |
| **Mailhog** | http://localhost:8025 | Testing de emails |

---

## 🔧 Comandos Útiles

### Infraestructura

```bash
# Iniciar todo
cd infra && docker-compose up -d

# Detener todo
docker-compose down

# Reiniciar un servicio
docker-compose restart postgres

# Ver logs
docker-compose logs -f gateway

# Entrar a contenedor
docker exec -it farutech_postgres bash

# Backup de base de datos
docker exec farutech_postgres pg_dump -U farutech farutech > backup.sql

# Restaurar backup
cat backup.sql | docker exec -i farutech_postgres psql -U farutech -d farutech
```

### Backend API

```bash
cd apps/api

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimizar para producción
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Tests
php artisan test

# Tinker (REPL)
php artisan tinker
```

### Admin & Website

```bash
# Admin
cd apps/admin
npm run dev          # Desarrollo
npm run build        # Build producción
npm run preview      # Preview build

# Website
cd apps/website
npm run dev          # Desarrollo
npm run build        # Build estático
npm run start        # Servir estático
```

### Design System

```bash
cd packages/design-system-source

npm run dev          # Storybook desarrollo
npm run build        # Build paquete
npm run test         # Tests
npm run lint         # Linting
```

---

## 🐛 Troubleshooting

### Problemas Comunes

#### 1. Los dominios no resuelven

**Solución:** Verificar archivo `/etc/hosts`

```bash
cat /etc/hosts | grep farutech
# Debe mostrar las 4 entradas
```

#### 2. Error de conexión a base de datos

**Solución:** Verificar que PostgreSQL esté corriendo y accesible

```bash
docker-compose ps
docker-compose logs postgres

# Si usas host.docker.internal, asegurarse que Docker lo soporte
# En Linux: agregar --add-host=host.docker.internal:host-gateway
```

#### 3. CORS errors en Admin/Website

**Solución:** Verificar configuración CORS en `apps/api/config/cors.php`

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://admin.farutech.local', 'http://farutech.local'],
'supports_credentials' => true,
```

#### 4. Workers no procesan jobs

**Solución:** Verificar Redis y colas

```bash
# Verificar Redis
docker exec -it farutech_redis redis-cli ping
# Debe responder: PONG

# Ver cola
php artisan queue:monitor redis

# Ver jobs fallidos
php artisan queue:failed
```

#### 5. Build del Design System falla

**Solución:** Limpiar node_modules y reconstruir

```bash
cd packages/design-system-source
rm -rf node_modules dist
npm install
npm run build
```

---

## 📊 Estado del Proyecto

| Fase | Estado | Progreso |
|------|--------|----------|
| **FASE 1**: Reorganización | ✅ Completada | 100% |
| **FASE 2**: Design System | ✅ Completada | 100% |
| **FASE 3**: Backend API | ✅ Completada | 100% |
| **FASE 4**: Workers | ✅ Completada | 100% |
| **FASE 5**: Admin App | ✅ Completada | 100% |
| **FASE 6**: Website | ✅ Completada | 100% |
| **FASE 7**: Documentación | ✅ Completada | 100% |
| **TOTAL** | 🎉 **COMPLETADO** | **100%** |

---

## 📚 Recursos Adicionales

- [Documentación Completa](docs/)
- [Bitácora de Implementación](docs/implementation-log/refactor-progress.md)
- [Decisiones Arquitectónicas](docs/11_ARCHITECTURE_DECISION_RECORDS.md)
- [Especificación Design System](docs/08_DESIGN_SYSTEM_SPECIFICATION.md)

---

## 🎯 Próximos Pasos Recomendados

1. **Producción**: Configurar SSL, dominios reales, CI/CD
2. **Monitoreo**: Sentry, LogRocket, Google Analytics
3. **Mejoras**: POS, Mini CRM, App Veterinaria (usando mismo Design System)
4. **Mobile**: React Native con Design System compartido

---

**© 2024 Farutech. Todos los derechos reservados.**
