# TASK-017 — Ejecutar Consolidación de Base de Datos en Infraestructura (ADR-004)

**Fase:** FASE 14 — Corrección de Deuda Técnica (Auditoría 2026-09)
**Estado:** ⬜ BACKLOG
**Prioridad:** 🟡 HIGH
**Responsable:** DevOps Engineer
**Fecha Creación:** 2026-09-05
**Implementa:** [ADR-004 — Multi-Database Strategy](../../01_ARCHITECTURE/adr/ADR-004_multi_database_strategy.md) (re-alcanzada por ADR-007)

---

## 🎯 Objetivo

Ejecutar en infraestructura la decisión ya aprobada en ADR-004 (PostgreSQL único + Redis para el Website Ecosystem), que nunca se llevó a la práctica.

## 📋 Evidencia de Auditoría

```yaml
# infrastructure/docker-compose.yml (estado actual, contradice ADR-004)
services:
  mysql: ...      # ❌ debería eliminarse
  postgres: ...   # ✅ se mantiene
  mongodb: ...    # ❌ debería eliminarse
  redis: ...      # ✅ se mantiene
```

Además, `infrastructure/gateway/haproxy.cfg` mantiene ACLs para `phpmyadmin.db.farutech.local` y `pgadmin.db.farutech.local` — al eliminar MySQL, `phpmyadmin` deja de tener sentido.

## 📂 Pasos de Ejecución

1. Confirmar con Backend Lead que ningún módulo activo depende de MySQL o MongoDB (auditar `apps/website/src/backend/config/database.php` y cualquier conexión hardcodeada)
2. Si hay datos existentes en MySQL/MongoDB de ambientes ya en uso, definir y ejecutar plan de migración de datos a PostgreSQL (fuera de alcance de esta tarea si no hay datos reales aún — verificar)
3. Eliminar servicios `mysql` y `mongodb` de `infrastructure/docker-compose.yml`
4. Eliminar el servicio `phpmyadmin` y su ACL en `infrastructure/gateway/haproxy.cfg`
5. Confirmar que `.env.example` del backend ya no referencia `DB_CONNECTION=mysql` como default
6. Actualizar `docs/01_ARCHITECTURE/overview.md` (ya reflejado en esta entrega) y remover la nota de "NO EJECUTADO" en ADR-004 una vez cerrada esta tarea

## ✅ Criterios de Aceptación

- [ ] `docker compose up -d` desde `infrastructure/` levanta únicamente `postgres`, `redis`, `pgadmin`, `backend`, `frontend`, `admin` (tras TASK-015)
- [ ] Ningún servicio del backend falla por ausencia de MySQL/MongoDB
- [ ] `ADR-004.md` actualizado: nota "NO EJECUTADO" removida, estado pasa a "✅ DECIDIDO Y EJECUTADO"

## ⚠️ Riesgos

| Riesgo | Mitigación |
|---|---|
| Datos reales existentes en MySQL/MongoDB que no se migren a tiempo | Confirmar con el equipo si hay ambientes con datos productivos antes de eliminar servicios |

## 📆 Historial de Cambios

| Fecha | Estado | Cambio | Responsable |
|---|---|---|---|
| 2026-09-05 | BACKLOG | Creación tras hallazgo de auditoría | Technical Lead |
