# 14 — EVIDENCE: TASK-003 — Inspección de repos existentes en `github.com/Farutech` (GAP-05 / R-10 / R-11)

**Fecha de ejecución:** 2026-08-27
**Objetivo (docs/09 TASK-003):** resolver la colisión documentada con `Farutech/website` antes de TASK-101/104.
**Método:** acceso real con `gh` autenticado (cuenta `faridmaloof`, scopes `repo`/`read:org`) + `git clone` + API REST de GitHub. Es decir, **ejecución real**, no lectura de docs.

---

## 1. RESULTADO CENTRAL (resuelve GAP-05, R-10, R-11)

**`Farutech/website` es un repositorio VACÍO (placeholder), creado 2026-08-26. No hay colisión de nombres con trabajo real, ni riesgo de pérdida de la migración planeada.**

Evidencia de la API (`gh api repos/Farutech/website`):

```text
"full_name": "Farutech/website"
"private":     false
"created_at":  "2026-08-26T19:51:24Z"   ← se creó hace <24h
"pushed_at":   "2026-08-26T19:51:25Z"   ← mismo instante que created → nunca se hizo push
"size":        0                        ← 0 KB de contenido
"default_branch": "main"
"has_pages":   false
```

Evidencia de prueba adicional:

- `gh api repos/Farutech/website/branches` → **sin branches** (respuesta vacía).
- `gh api repos/Farutech/website/tags` → `NONE`.
- `gh api repos/Farutech/website/releases` → `NONE`.
- `gh api repos/Farutech/website/contents/` → `"message": "This repository is empty."` (HTTP 404).
- `git clone --depth 1 https://github.com/Farutech/website.git` → `"You appear to have cloned an empty repository."`
- En el clon: `git log --oneline` → `fatal: your current branch 'main' does not have any commits yet`.
- `gh api repos/Farutech/website/events` → vacío (sin eventos).

**Interpretación:** la marca "actualizado hace ~19-20h" que aparece en los docs 01-13 es solo **la hora de creación del repositorio**, no actividad de contenido. Fue el instante en que se creó el repo vacío. No hubo commits, ni archivos, ni work de ningún agente anterior (esto descarta por completo la hipótesis R-11 de que alguien ya habría iniciado una migración por su cuenta en ese repo).

> **Seguridad:** como el repo es público y vacío, nadie más tiene acceso a código sensible ahí (no lo hay). Se recomienda volverlo **privado** antes de usarlo como destino de la migración (regla de seguridad de TASK-101: visibilidad privada antes de cualquier push de contenido sensible).

---

## 2. INVENTARIO REAL DE LA ORGANIZACIÓN `Farutech` (corrige la doc 01-06)

`gh repo list Farutech --limit 100` → **4 repos**, no 8:

| Repo | Visibilidad | Último update (observado) | Resolución TASK-003 |
|---|---|---|---|
| `Farutech/website` | público | 2026-08-26 (creado; SIN contenido) | **USES como destino de migración `website`** (TASK-101/104) — tras confirmación del owner |
| `Farutech/Cloud-Platform` | público | ~2026-08-04 | `NO APLICA` (visión futura, fuera de alcance, confirmado por owner en doc 06/09) |
| `Farutech/feks-docs` | privado | ~1 mes | `NO APLICA` |
| `Farutech/Engineering-Knowledge-System` | público | 2026-07-21 | `NO APLICA` (por instrucción directa del owner, GAP-06/GAP-05) |

**Conclusión de inventario:** los docs 06/07/12 mencionan "8 repos públicos" — eso provenía de un rate-limit histórico del sandbox y del conteo de `public_repos: 8` que incluía probablemente repos borrados/recreados. La observación viva muestra **4 repos**, y **3 de ellos son irrelevantes o ya relegados** para este proyecto. El único relevante es `website`, y está vacío.

---

## 3. VALIDACIÓN vs. campos de TASK-003 (docs/09)

| Campo | Resultado |
|---|---|
| CURRENT STATE | Confirmado: `Farutech/website` público, **vacío**, creado 26/08. Los otros 3 = `NO APLICA`. ✔ |
| OBJECTIVE | Evitar colisión de nombres y pérdida de trabajo existente → **no existe trabajo a perder** (repo vacío). ✔ |
| IMPLEMENTATION | `git clone` + `gh repo view` + API completa ejecutado. ✔ |
| TESTING | N/A (es investigación pura; no hay código que probar). ✔ |
| VALIDATION | **Pendiente confirmación explícita del owner** sobre el disposition de `Farutech/website` (usar directo vs renombrar) antes de TASK-101. Recomendación: usar directo y volverlo privado. |
| ROLLBACK | N/A — solo lectura, sin cambios. |
| EVIDENCE | Este documento. |
| PRIORITY | ALTA — bloqueaba TASK-101/104. **Bloqueo resuelto** (repo disponible como destino). |

---

## 4. SUGERENCIAS / ESTADO TRAS ESTA INSPECCIÓN

1. **Disposition aplicado (2026-08-27):** `Farutech/website` se pasó YA a **privado** (`gh repo edit Farutech/website --visibility private --accept-visibility-change-consequences`) — es el repo vacío que servirá como destino de `website`. TASK-003 queda `DONE` en el Execution Log.
2. Para los demás repos destino de TASK-101 (`backend`, `admin`, `intranet`, `design-system`, `infrastructure`) no hay colisión: no existen actualmente en la org **bajo ese nombre** — crearlos nuevos es seguro.
3. `framework-automation` se transfiere desde `faridmaloof/framework-automation` (transferencia nativa, sin conflicto de nombre en la org).

---

## 5. ESTADO DE ESTA TAREA

- Hallazgo de inspección: **COMPLETO** (nuevo findings documentado).
- Disposición final (uso de `Farutech/website`): **PENDIENTE de confirmación del owner** → `TASK-003` se marca `IN PROGRESS` en el Execution Log hasta ese OK, sin que esto bloquee avanzar el resto de Wave 0 (TASK-001/002, que no dependen de TASK-003).