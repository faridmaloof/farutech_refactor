# 17 — EVIDENCE: TASK-101 (parte 1) — Topología de repos destino creada y privada (REQ-REPO-01)

**Fecha:** 2026-08-27
**Estado:** IN PROGRESS — **paso 1 (aditivo/reversible)** ejecutado con evidencia. El resto de TASK-101 (ingesta de historial, transferencia y archivado) son pasos **irreversibles / gate-por-confirmación** según `docs/09` y quedan explícitamente anclados al final de este documento.

---

## 1. QUÉ SE HIZO (paso aditivo, reversible)

Se crearon los repositorios destino bajo `github.com/Farutech`, todos **privados** y **vacíos**, con `gh` autenticado (`faridmaloof`):

| Repo | Visibilidad | Estado | Comentario |
|---|---|---|---|
| `Farutech/backend` | PRIVATE | vacío | destino para la extracción de `apps/backend` (TASK-101/102) |
| `Farutech/admin` | PRIVATE | vacío | nuevo, construido sobre Design System (TASK-301) |
| `Farutech/intranet` | PRIVATE | vacío | placeholder; alcance diferido (GAP-07) |
| `Farutech/design-system` | PRIVATE | vacío | paquete a publicar en GitHub Packages público (TASK-202) |
| `Farutech/infrastructure` | PRIVATE | vacío | manifiestos K3s + (la carpeta `infrastructure/` local se incorporará aquí) |
| `Farutech/website` | PRIVATE | vacío | pasó a **private** en TASK-003 (era público); destino del split de `apps/web` |

**Seguridad RD-01/REQ-REPO-01:** se confirmó visibilidad **privada en el acto de creación**, ANTES de cualquier push de contenido sensible. Comando: `gh repo list Farutech --json name,visibility,isEmpty` → los 6 destinos = `PRIVATE` + `isEmpty:true`.

Los repos preexistentes de la org quedan intactos y `NO APLICA` (confirmado TASK-003): `feks-docs` (privado), `Cloud-Platform` y `Engineering-Knowledge-System` (públicos, fuera de alcance).

---

## 2. ESTADO REAL RELEVANTE DEL MONOREPO FUENTE (verificado)

- `github.com/faridmaloof.../website-farutech` (monorepo) sigue **PUBLIC** con rama `main` en `708bcb5`.
- Working tree **SUCIO** (no commitearla íntegra por error): migración a Laravel a medias sin commitear, `vendor/` untracked (~megabytes, se reconstruye con `composer install`), borrados de `docker-compose.prod.yml` y `apps/backend/Backend.zip`.
- `git subtree split -P apps/frontend` **funciona** en este entorno (probado local en rama temporal throwaway, eliminada). Herramienta disponible para el split preservando historial.

---

## 3. VALIDACIÓN / TESTING / EVIDENCE de este paso

- **TESTING (`gh repo list`)**: 6 repos destino listados, todos `isEmpty: true` y `PRIVATE`. ✔
- **EVIDENCE**: la creación real en GitHub (URLs + `✓ Created repository Farutech/*`) + el listado JSON de visibilidad/estado.
- **SECURITY**: privados desde el primer segundo; ningún dato sensible pusheado todavía (repos vacíos). ✔
- **ROLLBACK**: repos vacíos pueden eliminarse con `gh repo delete` sin pérdida de trabajo (no contienen nada). ✔

---

## 4. LO QUE QUEDA DE TASK-101 (pasos irreversibles / gate por confirmación)

Regla de `docs/09` TASK-101: *"Repos viejos (faridmaloof/*) archivados, no borrados, SOLO después de confirmar que los nuevos están completos"* y *"NO avances a la siguiente Wave si una tarea CRITICAL/BLOCKED sigue"*. Por eso **no** se ejecuta sin confirmación explícita del owner:

```text
Paso 2 — Split preservando historial:
   - git subtree split -P apps/frontend → rama → push a Farutech/website (private)
   - git subtree split -P apps/backend  → rama → push a Farutech/backend
   (fecha: requiere deshacerse del working tree sucio sin perder TASK-102 Lumen;
    conviene hacer el split desde el HEAD LIMPIO, no desde el working tree)

Paso 3 — Transferencia nativa de ownership:
   - Farutech/framework-automation  ← faridmaloof/framework-automation (GitHub Transfer)
   - NO recrear; transferir guarda 100% historial.

Paso 4 — README por repo (responsabilidad única).

Paso 5 — Validación de independencia:
   - clonar cada repo nuevo aislado y confirmar que compila/instala sin el resto
     (criterio de independencia del prompt maestro sección 10).

Paso 6 — Archivado de repos personales (SOLO tras confirmar Paso 5):
   - website-farutech, dashboard (personal), framework pasa a org
   - archive (no delete), manteniendo historial de respaldo.
```

---

## 5. DECISIONES A CONFIRMAR (pregunta al owner antes de este paso irreversible)

1. Autorizar la **ingesta de historial** (git subtree split) y el **push** a los repos `Farutech/website` y `Farutech/backend` — es la excepción explícita del appendix de historia, requiere OK.
2. Autorizar la **transferencia de ownership** de `faridmaloof/framework-automation` → orga `Farutech`.
3. Nombre de convencion final: website/backend confirmado (2 repos), o se prefiere api/web (cambio ahora es mas barato que despues).
4. Qué hacer con el working tree sucio del monorepo (TASK-102 Laravel): ¿se commitea/descarta ese trabajo antes del split?

---

## 6. RESUMEN

- **Hecho:** destinos creados y privados (parte reversible). Evidencia documentada épica.
- **Pendiente (gate por confirmación):** ingesta de historial, transferencia, archivado — NO ejecutados en esta sesión por ser irreversibles y requerir OK según la propia regla del plan.

NOTA: la referencia a "Cerrar R-01" en docs/09 TASK-101 es un remanente; R-01 (secrets) se cerro en TASK-002 (docs/16). No hay conflicto.