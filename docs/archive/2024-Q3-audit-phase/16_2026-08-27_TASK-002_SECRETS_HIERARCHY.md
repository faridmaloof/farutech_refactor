# 16 — EVIDENCE: TASK-002 — Jerarquía de configuración Secret → `.env` → default (REQ-INF-01 / R-01 corregido)

**Fecha:** 2026-08-27
**Riesgo cerrado:** R-01 (CRITICAL) — credenciales reales/débiles estaban como **default** en `infrastructure/.env.example` y `docker-compose.yml`, marcadas "no romper" y en uso.
**Ubicación:** `infrastructure/` (no es repo git todavía — se migrará a `Farutech/infrastructure` en TASK-101). Cambios **no versionados** en el workspace.

---

## 1. QUÉ CAMBIÓ (WHAT / WHERE)

| Archivo | Cambio |
|---|---|
| `.env.example` | De "credenciales reales marcadas no-romper" a **plantilla con placeholders `CHANGE_ME_OR_SET_SECRET`** (cero valores reales) + documentación de la jerarquía. |
| `.env` (**nuevo, gitignored**) | Valores **reales vigentes** de local, copiados del `.env.example` previo (para NO romper los volúmenes ya inicializados — rollback por `Local`). |
| `.gitignore` (**nuevo**) | Excluye `.env*local` y `data/` (no versionar credenciales reales ni datos binarios). |
| `docker-compose.yml` | Todos los `${VAR:-valor_real}` → `${VAR:-CHANGE_ME_OR_SET_SECRET}`; healthchecks que hardcodeaban credenciales (`pg_isready -U farutech`, `mongosh ...root:root_secret`) ahora referencian las variables. |
| `scripts/validate-env.ps1` (**nuevo**) | Validador por ambiente: imprime origen de cada variable (env/.env/default) y **falla** si un no-local termina en placeholder. |
| `scripts/validate-env.sh` (**nuevo**) | Mismo validador para hosts Linux/K3s (Dev/QA/Staging/Prod). |

**Jerarquía implementada (ADR-006):**
```
1) Secret / variable de entorno  (K3s Secret en dev/qa/staging/prod, env en shell)
2) .env                          (local; gitignored)
3) default                       → SOLO placeholder CHANGE_ME_OR_SET_SECRET
```

---

## 2. TESTING + VALIDATION (ejecución real, evidencia)

Se ejecutó `scripts/validate-env.ps1` en varios escenarios (env `local`/`prod`, con/sin `.env`, con Secret simulado):

| Caso | Setup | Resultado | Exit |
|---|---|---|---|
| (a) local + `.env` real | `-Env local` | **PASS** — todas las variables desde `.env` (passwords ocultas `********`) | 0 |
| (b) prod + `.env` real | `-Env prod` | **PASS** — resuelve desde `.env` (fallback documentado) | 0 |
| (c) prod **sin** `.env` ni Secret | copia de infra sin `.env` | **FAIL** — 13 variables en `default`/`CHANGE_ME_OR_SET_SECRET`, rechaza arranque | 1 |
| (d) local + Secret simulado (env) | `-Env local` + `MYSQL_PASSWORD` inyectada | **PASS** — esa variable con `ORIGEN=env` (prioridad 1, gana a `.env`) | 0 |

- **TESTING (docs/09):** "que ningún ambiente no-local arranca con un valor placeholder" → caso (c) lo demuestra: `prod` sin provisión = **FAIL (exit 1)**.
- **VALIDATION (docs/09):** 
  - "Simular arranque sin Secret → fallback correcto a `.env`" → casos (a)/(b) **PASS con fallback**.
  - "Simular sin ninguno de los dos y confirmar que rechaza arrancar en ambientes no-local" → caso (c) **FAIL exit 1**.
- **EVIDENCE (docs/09):** "Log de arranque mostrando el origen de cada variable (Secret/env/rechazado)" → el script imprime tabla `VARIABLE | ORIGEN(env/.env/default) | VALOR`. Capturas en §3.
- `docker compose config --quiet` → **exit 0** (YAML bien formado tras ediciones).

---

## 3. EVIDENCE DE LA EJECUCIÓN (capturas)

**(a) local + .env (origen .env, passwords enmascaradas) — exit 0:**
```text
== validate-env  (ambiente: local) ==
VARIABLE                         ORIGEN     VALOR
MYSQL_ROOT_PASSWORD              .env       ********
MYSQL_DATABASE                   .env       farutech
... 
VALIDACIÓN: PASS local — todas las variables resueltas.   (exit 0)
```

**(d) con Secret por entorno (MYSQL_PASSWORD) — ORIGEN=env, gana a .env:**
```text
MYSQL_PASSWORD                      env    ********
```

**(c) prod sin .env — FAIL (exit 1):**
```text
== validate-env  (ambiente: prod) ==
MYSQL_ROOT_PASSWORD                 default CHANGE_ME_OR_SET_SECRET
  !!! [MYSQL_ROOT_PASSWORD] sin valor real en ambiente no-local 'prod' -> REQUIERE provisión.
... (13 variables igual)
VALIDACIÓN: FAIL prod — hay variables en placeholder en ambiente no-local.   (exit 1)
```

---

## 4. SECURITY / COMPORTAMIENTO OBSERVADO

- ✅ `.env.example` **sin valores reales** (cero credenciales versionadas).
- ✅ `.env` **gitignored**; se excluyó del control de fuentes.
- ✅ `data/` (chips binarios de MySQL/Postgres/Mongo con hashes reales) **excluido** de versionado.
- ✅ No-local **rechaza** el start cuando falta provisión (exit 1).
- ✅ healthchecks ya no hardcodean credenciales (leen de las mismas variables).
- ⚠️ Comportamiento observado: para **Local**, placeholders NO detienen (exit 2=aviso), coherente con "fallback documentado a .env". Para no-local el exit 1 fuerza provisión.

---

## 5. ROLLBACK

- `.env.example` con los valores reales anteriores se mantiene **en historial git del workspace / en el `.env` local**. Revertir = volver a los `${VAR:-valores}` en `docker-compose.yml` y restaurar `.env.example` con los valores reales. No hay dato migrado (solo cambio de configuración/scripts).
- Los volúmenes de datos NO se tocaron (conservan las credenciales con que fueron inicializados → `.env` local las mantiene).

---

## 6. NOTA DE CONSISTENCIA

El objetivo de TASK-002 en `docs/09` dice "Cerrar R-01/R-03". **Cobertura:** este task cierra **R-01** (secrets/defaults) con evidencia. **R-03** ("dos sistemas de administración desconectados") NO pertenece a esta tarea (es de arquitectura/admin, F-01 → TASK-301/201); se registra como imprecisión de mapeo en `docs/09`, no como compromiso técnico pendiente de esta tarea.

---

## 7. STATE

- R-01 → **CERRADO** (remediación aplicada y probada).
- TASK-002 → **DONE** en `EXECUTION_LOG.md`.
- Commit: **N/A** (infrastructure/ no es repo git; se incorporará al crear `Farutech/infrastructure` en TASK-101).