# 🏗️ Infraestructura Farutech Ecosystem

**TASK-000A**: Consolidación completada - 3 motores BD + Redis

## 📦 Servicios Incluidos

| Servicio | Versión | Propósito | Puerto |
|----------|---------|-----------|--------|
| **HAProxy Gateway** | 3.2 | Routing HTTP y puertos BD | 80, 3306, 5432, 27017, 6379 |
| **MySQL** | 8.4 | Website público (lectura) | 3306 |
| **PostgreSQL** | 17 | Apps transaccionales (Admin, API) | 5432 |
| **MongoDB** | 8 | Logs de auditoría Admin | 27017 |
| **Redis** | 7 | Colas, caché, workers | 6379 |
| **Mailhog** | latest | Email testing (dev) | 1025 (SMTP), 8025 (Web) |
| **phpMyAdmin** | 5 | Gestión MySQL | 5050 (vía proxy) |
| **pgAdmin** | latest | Gestión PostgreSQL | 5051 (vía proxy) |
| **Mongo Express** | 1.0.2 | Gestión MongoDB | 5052 (vía proxy) |

## 🚀 Inicio Rápido

```bash
# 1. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 2. Levantar toda la infraestructura
docker-compose up -d

# 3. Verificar estado
docker-compose ps

# 4. Ver logs
docker-compose logs -f

# 5. Detener
docker-compose down
```

## 🔐 Seguridad

- **Cero passwords hardcodeadas**: Todos los defaults son `CHANGE_ME_OR_SET_SECRET`
- **Jerarquía de secrets**: 
  1. Secrets manager (K3s/Kubernetes)
  2. `.env` local (gitignored)
  3. Placeholders (fallan en producción)
- **Validación automática**: Scripts `validate-env.*` verifican placeholders

## 🌐 Dominios Locales

Agregar al `/etc/hosts`:
```
127.0.0.1 api.farutech.local
127.0.0.1 admin.farutech.local
127.0.0.1 www.farutech.local
127.0.0.1 farutech.local
```

## 📊 Health Checks

Todos los servicios tienen health checks configurados:
- MySQL: `mysqladmin ping`
- PostgreSQL: `pg_isready`
- MongoDB: `db.adminCommand('ping')`
- Redis: `redis-cli ping`

## 🔄 Persistencia

Volúmenes Docker:
- `farutech-mysql-data`: `/var/lib/mysql`
- `farutech-postgres-data`: `/var/lib/postgresql/data`
- `farutech-mongodb-data`: `/data/db`
- `farutech-redis-data`: `/data`
- `farutech-pgadmin-data`: `/var/lib/pgadmin`

## 🛠️ Troubleshooting

### Verificar conexión a BDs
```bash
# MySQL
docker exec farutech-mysql mysql -u root -p

# PostgreSQL
docker exec farutech-postgres psql -U farutech -d farutech

# MongoDB
docker exec farutech-mongodb mongosh -u root -p
```

### Reiniciar servicio específico
```bash
docker-compose restart redis
```

### Reset completo (pierde datos)
```bash
docker-compose down -v
docker-compose up -d
```

## 📝 Próximos Pasos

1. **Backend API**: Migrar controllers desde `apps/web/apps/backend/`
2. **Workers**: Configurar colas Redis
3. **Admin App**: Conectar a PostgreSQL
4. **Website**: Conectar a MySQL

---

**© 2024 Farutech - Infraestructura Consolidada**
