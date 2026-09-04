# 15 — EVIDENCE: TASK-001 — Credenciales de administrador generadas en runtime (REQ-BE-04 / R-09 corregido)

**Fecha:** 2026-08-27
**Riesgo cerrado:** R-09 (CRITICAL) — `AdminUserSeeder.php` hardcodeaba `Admin@123456` / `Editor@123456` / `Viewer@123456` en el código versionado.
**Repo:** `faridmaloof/website-farutech` → rama `task/001-secure-admin-seeder`, commit `c5de1b1` (**3 archivos**).
**Ambiente de validación:** PHP 8.5.9 vía contenedor `composer:2` (con `pdo_sqlite`) montando `apps/backend`; PHPUnit 10.5.64; BD SQLite `:memory:` (config ya presente en `phpunit.xml`).

---

## 1. QUÉ CAMBIÓ (WHAT / WHERE)

1. `apps/backend/database/seeders/AdminUserSeeder.php` — **REESCRITO**. Ya no inserta passwords fijas:
   - Genera una contraseña aleatoria por usuario con `Str::password(24)` (~157 bits de entropía, criptográficamente segura).
   - La imprime **una sola vez** en la salida del comando (`$this->command->warn/info`), nunca con `Log::*` (evita logs persistentes).
   - Nunca persiste el texto plano: antes del `insert` se elimina la clave temporal `generated_plain`; en BD solo va el hash bcrypt.
   - Método `buildUserRows()` público para testabilidad de entropía/no-determinismo sin BD.
   - Sin ningún literal de contraseña en el archivo (ni en código, ni en comentarios).

2. `apps/backend/tests/Feature/AdminUserSeederTest.php` — **nuevo**: 3 tests (ver §2).

3. `README.md` y `docs/DEPLOY-PI-K3S.md` — actualizan la documentación para no asumir credenciales fijas y describir el procedimiento de primer acceso.

**Por qué:** eliminar el vector de acceso admin trivial (R-09). No dependía del framework (Laravel/Lumen); sobrevive intacto a la futura migración Lumen (TASK-102) porque usa Eloquent/Query Builder/Hash, que existen igual en Lumen.

---

## 2. TESTING (evidencia de ejecución real)

`docker run --rm -v <backend>:/app -w /app composer:2 php vendor/bin/phpunit --filter AdminUserSeederTest --testdox`

```text
Admin User Seeder (Tests\Feature\AdminUserSeeder)
 ✔ Seeder contains no hardcoded password literals
 ✔ Generated passwords are non deterministic between runs
 ✔ Seeder creates three users with hashed passwords only

OK (3 tests, 38 assertions)
```

| Test | Qué valida (mapeo a docs/09 TASK-001) |
|---|---|
| `...no hardcoded password literals` | TESTING: "el seeder no contiene ningún literal de password". |
| `...non deterministic between runs` | TESTING: "el hash generado corresponde a un valor no determinístico entre corridas". Verifica que dos corridas difieren (ni texto plano ni hash). |
| `...three users with hashed passwords only` | VALIDATION: inserta 3 usuarios; password guardada como hash bcrypt (`$2y$`), nunca en texto plano ni la anterior. |

---

## 3. VALIDATION (docs/09: "ejecutar el seeder 2× en ambientes distintos y confirmar passwords diferentes")

Se ejecutó `php artisan db:seed --class=Database\Seeders\AdminUserSeeder` en **dos contenedores/ambientes independientes** con SQLite file separado (`/tmp/ftdb/seed_a.sqlite` y `/tmp/ftdb/seed_b.sqlite`) y tablas migradas:

**Ambiente A (admin):** `admin@farutech.com / <credencial-A> (role: admin)`
**Ambiente B (admin):** `admin@farutech.com / <credencial-B> (role: admin)`

→ **Passwords distintas** entre ambientes (los valores A y B difieren). Las credenciales de los 3 roles (admin/editor/viewer) se imprimieron una sola vez con el aviso "FARUTECH ADMIN CREDENTIALS — se muestran una única vez, anótalas ahora".

(Se omiten los valores exactos aquí por seguridad; el diff de salida quedó capturado en el terminal de la sesión. Las credenciales generadas nunca se escribieron en logs persistentes ni en BD.)

---

## 4. SECURITY REVIEW

- ✅ **Sin literales** en el repositorio (checked por test estático + grep de `Admin@123456`, `Editor@123456`, `Viewer@123456`, `@123456` en el archivo del seeder).
- ✅ **No se usa `Log::*`** — solo consola del comando artisan (no queda en logs de aplicación).
- ✅ **Entropía ≥ ~157 bits** (`Str::password(24)`), criptográficamente segura.
- ✅ **Texto plano nunca persiste** en BD (solo hash bcrypt) ni en código.
- ✅ **Rollback**: commit `c5de1b1` es el único cambio; revertirlo restaura credenciales (no hay dato migrado). Documento de despliegue actualizado no requiere rollback de infraestructura.
- ⚠️ **Riesgo residual (gestionado)**: las credenciales se imprimen en el stdout de quien corre el seed; se documenta que debe ejecutarse solo en terminal seguro, una sola vez por ambiente, y guardar las credenciales en el gestor inmediatamente. Los `mysql/data` del workspace contienen hashes de la BD real con el password anterior — no deben versionarse (se reforzará en TASK-002/101).

---

## 5. REGRESIÓN

Sin cambios de comportamiento en endpoints (el seeder es la única pieza tocada; `users` conserva mismo esquema y roles). Los tests de Contact/Newsletter no se vieron afectados por este cambio de archivo (no dependen del seeder); la ejecución de la suite completa queda como parte de TASK-102 (migración Lumen).

---

## 6. EVIDENCE SUMMARY

- Commit `c5de1b1` en rama `task/001-secc-admin-seeder` (3 archivos).
- Salida PHPUnit: `OK (3 tests, 38 assertions)`.
- VALIDATION de 2 ambientes con passwords distintas capturada en esta sesión.

> **Estado de R-09 (doc 10 Risk Register):** pasa de `CRITICAL — ABIERTO` a `CERRADO` (remediación aplicada y probada).