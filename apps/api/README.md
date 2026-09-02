# Farutech API

Backend Laravel 11 para la plataforma Farutech con documentación Scalar.

## 🚀 Características

- **Laravel 11** - Última versión del framework
- **Scalar Documentation** - Documentación interactiva de API
- **Autenticación Sanctum** - API tokens seguros
- **Búsqueda de Leads** - Motor de búsqueda de oportunidades
- **Geolocalización** - Sistema de ubicaciones jerárquico
- **Workers Asíncronos** - Procesamiento en segundo plano
- **UTM Tracking** - Seguimiento completo de campañas

## 📦 Instalación

```bash
# Clonar repositorio
cd /workspace/apps/api

# Instalar dependencias
composer install

# Copiar archivo de entorno
cp .env.example .env

# Generar clave de aplicación
php artisan key:generate

# Migrar base de datos
php artisan migrate

# Ejecutar servidor
php artisan serve
```

## 🔗 Endpoints Principales

### Ubicaciones (Público)
- `GET /api/v1/locations/search?q={query}` - Buscar ubicaciones
- `GET /api/v1/locations/{id}` - Obtener ubicación
- `GET /api/v1/locations/{id}/hierarchy` - Jerarquía completa

### Leads (Requiere Auth)
- `GET /api/v1/leads` - Listar leads
- `POST /api/v1/leads` - Crear lead
- `POST /api/v1/leads/opportunities/search` - Buscar oportunidades
- `GET /api/v1/leads/stats` - Estadísticas

## 📚 Documentación

La documentación completa está disponible en:
- **Local**: http://localhost:8000/docs
- **Producción**: https://api.farutech.com/docs

## 🔐 Autenticación

```bash
# Registrar usuario
POST /api/v1/auth/register

# Login
POST /api/v1/auth/login

# Logout
POST /api/v1/auth/logout (Bearer token)
```

## ⚙️ Configuración

### Variables de Entorno

```env
APP_NAME="Farutech API"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
QUEUE_CONNECTION=redis
CACHE_STORE=redis

SCALAR_URL=/docs
```

## 🧪 Tests

```bash
# Ejecutar tests
php artisan test

# Tests con coverage
php artisan test --coverage
```

## 📊 Estructura del Proyecto

```
apps/api/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/V1/
│   │   ├── Middleware/
│   │   └── Requests/
│   ├── Models/
│   ├── Services/
│   └── Jobs/
├── config/
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   └── api.php
└── tests/
```

## 🛠️ Comandos Útiles

```bash
# Limpiar cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Optimizar para producción
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Cola de trabajos
php artisan queue:work
php artisan queue:listen
```

## 📝 Licencia

Propietario - Farutech © 2024
