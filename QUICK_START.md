# 🚀 Quick Start - Farutech Ecosystem

## En 5 Minutos

### 1. Configurar Hosts (1 minuto)

```bash
# Linux/Mac
echo "127.0.0.1 api.farutech.local" | sudo tee -a /etc/hosts
echo "127.0.0.1 admin.farutech.local" | sudo tee -a /etc/hosts
echo "127.0.0.1 farutech.local" | sudo tee -a /etc/hosts
echo "127.0.0.1 www.farutech.local" | sudo tee -a /etc/hosts
```

### 2. Levantar Infraestructura (2 minutos)

```bash
cd /workspace/infra
cp .env.example .env
docker-compose up -d
```

### 3. Verificar Servicios

```bash
docker-compose ps
# Todos deben estar en estado "Up"
```

### 4. Acceder a Aplicaciones

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| **API Docs** | http://api.farutech.local/docs | - |
| **Admin Panel** | http://admin.farutech.local | - |
| **Website** | http://farutech.local | - |
| **PGAdmin** | http://localhost:5050 | admin@farutech.local / FarutechAdmin2024! |
| **Mailhog** | http://localhost:8025 | - |

### 5. Probar API

```bash
# Buscar ciudades
curl "http://api.farutech.local/api/v1/locations/search?q=bog&limit=5"

# Buscar oportunidades
curl -X POST "http://api.farutech.local/api/v1/leads/opportunities/search" \
  -H "Content-Type: application/json" \
  -d '{"city":"Bogotá","service":"web","limit":5}'
```

---

## Desarrollo Local

### Backend API

```bash
cd apps/api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve --host=0.0.0.0 --port=8000
```

### Admin App

```bash
cd apps/admin
npm install
npm link ../../packages/design-system-source
npm run dev
# http://localhost:5173
```

### Website

```bash
cd apps/website
npm install
npm run dev
# http://localhost:3000
```

### Design System

```bash
cd packages/design-system-source
npm install
npm run build
npm link
```

---

## Comandos Esenciales

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Detener todo
docker-compose down

# Reiniciar servicios
docker-compose restart

# Entrar a PostgreSQL
docker exec -it farutech_postgres psql -U farutech -d farutech

# Ver colas Redis
docker exec -it farutech_redis redis-cli

# Backup DB
docker exec farutech_postgres pg_dump -U farutech farutech > backup.sql
```

---

## Troubleshooting Rápido

### Error: "Cannot connect to database"
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps postgres

# Ver logs
docker-compose logs postgres
```

### Error: "CORS blocked"
```bash
# Verificar configuración CORS en apps/api/config/cors.php
# Asegurarse que incluya los dominios correctos
```

### Error: "Module not found @farutech/design-system"
```bash
cd packages/design-system-source
npm link

cd ../../apps/admin
npm link @farutech/design-system
```

---

## Siguientes Pasos

1. Leer [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) para detalles completos
2. Revisar documentación en `docs/`
3. Personalizar variables de entorno en `.env`
4. Configurar SSL para producción

**¡Listo para desarrollar!** 🎉
