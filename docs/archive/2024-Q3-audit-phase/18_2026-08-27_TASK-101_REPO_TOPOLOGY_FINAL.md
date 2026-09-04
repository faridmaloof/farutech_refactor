# 18 — EVIDENCE: TASK-101 (cierre) — Topología final de repos bajo `Farutech`, todos nuevos y validados (REQ-REPO-01)

**Fecha:** 2026-08-27
**Estado:** DONE (núcleo de la tarea). El archivado de repos personales `faridmaloof/*` queda **deferido por diseño** a la regla ya existente en `docs/09` (solo tras confirmar que los repos nuevos están completos — TASK-102/104/201/301 pendientes).

---

## 1. DECISIÓN DEL OWNER (modificación autorizada de TASK-101)

El owner autorizó TASK-101 **con modificaciones**:

1. **Repos totalmente nuevos** — NO se migra historial (`git subtree split` descartado). Cada repo arranca con **1 commit de bootstrap** limpio. El contenido es un **baseline funcional reciente** (working tree validado), no una excavación arqueológica de historia.
2. **Validar la mejor organización** — los repos deben "entenderse a dónde pertenecen": README por repo con responsabilidad única + descripción a nivel org + estado de TASK vinculada.

## 2. TOPOLOGÍA FINAL (verificada con `gh repo list`, 2026-08-27)

| Repo | Visibilidad | Commit | Archivos | Contenido / Propósito declarado |
|---|---|---|---|---|
| `Farutech/website` | PRIVATE | `5c9b0ed` | 83 | Sitio público (React 18 + Vite) — `farutech.com` |
| `Farutech/backend` | PRIVATE | bootstrap | 130 | API (Laravel 10 baseline; TASK-001/002 de seguridad ya aplicados; Lumen pendiente TASK-102) — `api.farutech.com` |
| `Farutech/admin` | PRIVATE | bootstrap | 1 | **Placeholder** (README); se construye en TASK-301 sobre design-system — `admin.farutech.com` |
| `Farutech/design-system` | PRIVATE | bootstrap | 1 | **Placeholder** (README); fuente única de UI (TASK-201, spec docs/08) |
| `Farutech/infrastructure` | PRIVATE | `02e3813` | 7 | docker-compose + jerarquía Secret→`.env`→placeholder (TASK-002) + validación de env |
| `Farutech/framework-automation` | PRIVATE | `604b49c` | 82 | Framework QA .NET Screenplay (TASK-404: plantilla `dotnet new`) |
| `Farutech/intranet` | PRIVATE | bootstrap | 1 | **Placeholder** (README); **BLOCKED GAP-07** (alcance sin definir por owner) |

Los 7 repos llevan **descripción a nivel org** (verificada vía API) que declara propósito, dominio y TASK pendiente. Repos preexistentes fuera de alcance (`Cloud-Platform`, `feks-docs`, `Engineering-Knowledge-System`) intactos — `NO APLICA` (TASK-003, docs/14).

## 3. SECURITY REVIEW (aplicado — los repos tocan config/secrets)

- **Sweep de credenciales pre-push** sobre el staging completo: **cero** ocurrencias de `Admin@123456` / `Editor@123456` / `Viewer@123456`. Se eliminó del baseline la credencial de ejemplo que figuraba en `AuthController.php` (OpenAPI example) y en el README.
- **Verificación post-clone de todos los repos**: `git ls-files` confirma que **ningún `.env` real está versionado** — solo `.env.example` con valores vacíos (backend) o placeholders `CHANGE_ME_OR_SET_SECRET` (infrastructure). Cumple la jerarquía de TASK-002 (docs/16).
- **Visibilidad**: los 7 repos nacieron **PRIVATE en el acto de creación** (docs/17) y permanecen privados; ningún cambio de visibilidad ni publicación de paquetes (límites respetados).
- `.gitignore` del backend excluye `.env`, `vendor/`, `storage/*.key`, `auth.json`.

## 4. VALIDACIÓN DE INDEPENDENCIA (criterio del plan maestro)

Los 7 repos fueron **clonados frescos a `d:\tmp\ft-validate`** y verificados de forma aislada: cada uno tiene exactamente **1 commit**, sin dependencia de rutas del monorepo (`apps/backend` / `apps/frontend`) en código, y sin `.env` versionado. Los 4 repos con código real (website, backend, infrastructure, framework-automation) traen su baseline completo y self-contained; los 3 placeholders declaran su estado y TASK de desbloqueo en su README.

## 5. REGRESSION / ROLLBACK

- **Nada se borró ni archivó**: el monorepo `faridmaloof/website-farutech` y los repos personales permanecen **intactos y públicos** como respaldo hasta que los repos nuevos estén completos (regla ROLLBACK de docs/09 TASK-101).
- Rollback de esta fase: eliminar cualquiera de los 7 repos con `gh repo delete` no destruye trabajo (los 4 con código provienen del working tree preservado; los 3 placeholders son READMEs de 20 líneas).

## 6. PENDIENTE EXPLÍCITO (fuera del alcance de esta tarea)

1. **Archivado de `faridmaloof/*`** — solo cuando los repos nuevos estén completos y probados (TASK-102/104/201/301 DONE).
2. **TASK-102** (Lumen) sobre el baseline de `Farutech/backend`.
3. **TASK-104**: el admin embebido del website fue excluido del split; la extracción real del sitio público y su limpieza continúan en TASK-104 sobre `Farutech/website`.
4. **GAP-07 / GAP-08** (intranet, proveedor de email): requieren decisión de owner — no se inventa especificación.
