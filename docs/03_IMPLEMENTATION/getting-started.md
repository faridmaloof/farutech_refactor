# 🚀 Guía de Inicio Rápido — Farutech

**Objetivo:** Configurar tu entorno de desarrollo local en menos de 15 minutos.

---

## 📋 Prerrequisitos

- Node.js 18+ y npm
- PHP 8.2+ y Composer
- Docker y Docker Compose
- Git

---

## 🏁 Primeros Pasos

### 1. Clonar el repositorio

```bash
git clone <repo-url>
cd farutech
git checkout audit-and-farutech-architecture-5be6a
```

### 2. Instalar dependencias

```bash
# Backend API
cd apps/api/src/backend
composer install

# Admin App
cd ../../../admin/src
npm install

# Design System
cd ../../../../packages/design-system/src
npm install
npm run build
```

### 3. Configurar variables de entorno

```bash
# Backend
cp .env.example .env
php artisan key:generate

# Admin
cp .env.example .env.local
```

### 4. Levantar infraestructura

```bash
cd infrastructure
docker-compose up -d
```

### 5. Ejecutar migraciones

```bash
cd apps/api/src/backend
php artisan migrate
php artisan db:seed
```

### 6. Verificar instalación

- Backend: http://localhost:8000/api/health
- Admin: http://localhost:3000
- phpMyAdmin: http://localhost:8080

---

## 🔗 Siguientes Pasos

- [Estándares de Código](coding-standards.md)
- [Estrategia de Testing](testing-strategy.md)
- [Tareas Disponibles](../04_TRACKING/master-plan.md)
