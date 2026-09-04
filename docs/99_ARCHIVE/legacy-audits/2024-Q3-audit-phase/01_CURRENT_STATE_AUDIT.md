# FARUTECH — CURRENT STATE AUDIT (FASE 1: DISCOVERY + AUDIT)

**Fecha de ejecución:** 2026-08-26
**Fuente analizada:** `workspace.zip` subido por el usuario (equivalente a `D:\Projects\Farutech\workspace`)
**Auditoría histórica (`C:\Users\farid\Downloads\files (1)`):** NO fue proporcionada en esta sesión → **UNKNOWN**, no se pudo ejecutar la fase de Reconciliación Histórica. Todo lo "histórico" mencionado aquí proviene únicamente del prompt maestro, no de un documento auditado.
**Alcance:** Se investigó exclusivamente lo que existe en el zip. No se ejecutó ningún cambio, commit, push, build de producción ni despliegue.

> Regla aplicada en todo el documento: `EVIDENCE > ASSUMPTION`. Todo lo que no se pudo verificar directamente está marcado como `UNKNOWN`, `DOCUMENTED — NOT VERIFIED` o `IMPLEMENTED — NOT VERIFIED`.

---

## 0. LIMITACIONES DE ESTA EJECUCIÓN (léase antes que todo lo demás)

| Limitación | Efecto |
|---|---|
| No hay acceso al filesystem real `D:\Projects\Farutech\workspace`, solo al zip subido | Si el zip no es un espejo exacto y actualizado del workspace real, esta auditoría queda desactualizada |
| No se proporcionó la auditoría histórica (`files (1)`) | La Fase de Reconciliación Histórica **no se ejecutó**. Sección 47 del prompt maestro queda `BLOCKED` |
| `vendor/` de PHP está vacío (sin `composer install`) y `packagist.org` no está en la lista de dominios permitidos de este entorno | **No se pudo ejecutar PHPUnit**. El estado "10 tests / 25 assertions / 100% PASS" mencionado en el prompt es `UNKNOWN` — no reproducido |
| `dotnet` no está instalado en este entorno | **No se pudo compilar ni ejecutar** `framework-automation` (Framework.Core / Scaffolding.Tests) |
| `node_modules` de `dashboard` sí estaba presente → se pudo ejecutar un chequeo real de TypeScript | Ver hallazgo crítico F-DASH-01 |
| `api.github.com` devolvió `rate limit exceeded` (IP compartida del sandbox) | No se pudo confirmar en vivo el estado real de la organización/repos en GitHub. Ver sección 5 |
| No se ejecutaron pruebas de accesibilidad, performance (Lighthouse), ni escaneo de seguridad automatizado (no hay navegador ni backend corriendo en este entorno) | Accesibilidad, SEO runtime, performance y buena parte de seguridad dinámica quedan `UNKNOWN` — solo se auditó estáticamente el código |

---

## 1. CURRENT PHASE

```text
DISCOVERY + AUDIT (Fase 1 del prompt maestro, sección 78)
```

## 2. STATUS

```text
CONFLICTING
```
(Hay hallazgos verificados, pero también conflictos arquitectónicos reales sin resolver — ver sección 6 — que impiden declarar `READY` para pasar a Arquitectura Objetivo.)

---

## 3. WORKSPACE — ESTRUCTURA REAL VERIFICADA

```text
workspace/
├── infrastructure/         (464 MB — incluye volúmenes de datos reales de MySQL/Postgres/Mongo)
│   ├── docker-compose.yml
│   ├── .env.example
│   ├── gateway/haproxy.cfg
│   ├── mysql/data/         ← datos de base de datos reales, no deberían estar en el zip/workspace versionado
│   ├── postgres/data/
│   └── mongodb/data/
├── projects/
│   ├── web/                (repo git: farutech-web / "website-farutech")
│   │   ├── apps/frontend/  (React 18 + Vite — sitio público + panel admin propio)
│   │   ├── apps/backend/   (Laravel — API)
│   │   ├── deployment/docker/
│   │   └── docs/
│   └── dashboard/          (repo git independiente: "@farutech/dashboard")
│       ├── src/
│       └── docs/
└── tests/
    └── framework-automation/  (repo git independiente, .NET)
```

**VERIFIED FACTS:**
- Existen **3 repositorios Git independientes reales**, cada uno con su propio historial, no submódulos: `projects/web`, `projects/dashboard`, `tests/framework-automation`.
- **Ninguno** de los tres apunta a una organización `github.com/Farutech`. Los tres remotes son de una cuenta personal:
  - `projects/web` → `https://github.com/faridmaloof/website-farutech.git`
  - `projects/dashboard` → `https://github.com/faridmaloof/dashboard.git`
  - `tests/framework-automation` → `https://github.com/faridmaloof/framework-automation.git`
- Esto **contradice directamente** el supuesto del prompt maestro de que la organización a auditar es `github.com/Farutech`. → **CONFLICTING**, registrado como F-REPO-01.

---

## 4. GIT AUDIT (por repositorio)

### 4.1 `projects/web`
- Branch activo: `main` (up to date con `origin/main`).
- 9 branches locales + 13 remotas, muchas con nombres de sesiones de agentes de IA (`audit-and-initial-correction-baa44`, `qwen-code-f0cf3506...`, `professional-website-audit-and-optimization-6d0d0`, etc.) → indica **múltiples auditorías/refactors previos ya ejecutados por otros agentes**, no documentados de forma centralizada.
- **Working tree con cambios reales sin commitear** (no son artefactos de línea final, se verificó con `git diff` línea por línea):
  - `composer.json` modificado: **migración de Lumen 10 a Laravel 10 completa**, agregando `laravel/sanctum`, `darkaonline/l5-swagger`, `laravel/pint`, `laravel/sail`, `spatie/laravel-ignition`. Esto es un cambio arquitectónico de fondo, no un ajuste menor.
  - Archivos **untracked nuevos**: `ContactController.php`, `NewsletterController.php`, varios `app/Http/Middleware/*`, `routes/api.php`, `routes/web.php`, modelos (`ApplicationType`, `Location`, `NewsletterSubscriber`, `Service`), y todo `config/*.php`.
  - Archivos **eliminados** respecto al último commit: `tests/BlogApiTest.php`, `tests/ExampleTest.php` (viejos, estilo Lumen), `.styleci.yml`, `database/README_DATABASE_SETUP.md`, `docker-compose.prod.yml`.
- **Conclusión:** el último commit (`708bcb5`) documenta un backend Lumen sobre K3s/Raspberry Pi; el *working tree real* es un backend Laravel 10 completo, con Contact/Newsletter/Auth ya reescritos y tests nuevos (`ContactApiTest.php`, `NewsletterApiTest.php`) — **todavía sin commitear**. Esto es información crítica: cualquier decisión basada solo en `git log` sin mirar el working tree sería incorrecta.

### 4.2 `projects/dashboard`
- Branch: `main`, único remoto `origin/main`, sin desviación.
- El `git status` mostró decenas de "modified", pero se verificó con `git diff` que son **artefactos de normalización de fin de línea (CRLF↔LF)** producidos al extraer el zip en un entorno Linux — no hay cambios de contenido reales. (Confirmado línea por línea en `src/App.tsx`.)
- Historial: 18 commits, incluye un `first commit` seguido de un `Revert "first commit"` — indica al menos un evento de reinicio temprano del repo.

### 4.3 `tests/framework-automation`
- Branch: `master` (no `main`), único remoto `origin/master`.
- Mismo patrón que dashboard: los "modified" son en su totalidad diferencias CRLF/LF, no contenido real (verificado en `ScenarioActor.cs`).
- 12 commits, historial coherente y enfocado (Screenplay pattern, refactors incrementales, documentación).

---

## 5. GITHUB (ESTADO REAL — PARCIALMENTE VERIFICADO)

No se pudo consultar `api.github.com` en vivo (rate-limit del entorno sandbox). **No se puede confirmar** visibilidad (pública/privada), branch protections, Actions, Packages ni releases reales de los 3 repos → `UNKNOWN`, pendiente de reintento con las credenciales/entorno del propio usuario (ideal: `gh repo view`, `gh api`, o Claude Code corriendo localmente con `gh` autenticado).

Lo único verificable desde el propio código: los 3 repos existen bajo la cuenta `faridmaloof`, no bajo una organización `Farutech`.

---

## 6. HALLAZGOS CRÍTICOS (CONFLICTS / RISKS) — TODOS VERIFICADOS EN CÓDIGO

### F-01 — CRITICAL — Dos paneles de administración distintos y no relacionados para el mismo producto
- `projects/web/apps/frontend/src/pages/` contiene `AdminDashboardPage.tsx`, `AdminLeadsPage.tsx`, `AdminLoginPage.tsx`, `AdminSettingsPage.tsx` — un panel admin **integrado en el sitio público**, consumiendo directamente la API Laravel (`/admin/login`, `/admin/leads`, etc. — confirmados en `routes/api.php`).
- `projects/dashboard` es una aplicación **completamente separada** ("Panel de administración empresarial"), con su propio sistema de auth, endpoints (`/auth/me`, `/auth/refresh` — que **no existen** en `routes/api.php` del backend actual), stores, design system y CRUD genérico (Users/Products/Orders).
- **No hay evidencia de que `dashboard` esté conectado al backend real de `web`.** Sus endpoints esperados no coinciden con los expuestos.
- **Estado:** `CONFLICTING`. Requiere decisión arquitectónica explícita (ADR): ¿cuál es el panel admin autoritativo del sitio corporativo? ¿`dashboard` es el reemplazo planeado del admin embebido en `web`, o es para un producto futuro no relacionado (la "plataforma core" futura)? El código actual no lo dice.

### F-02 — CRITICAL — Modo demo activado por defecto en `dashboard`, con credenciales hardcodeadas en el bundle cliente
- `src/services/demo-auth.service.ts`: `isDemoModeEnabled()` retorna `true` **a menos que** `VITE_ENABLE_DEMO_AUTH` esté explícitamente en `'false'`. Es decir: **habilitado por defecto**.
- Contiene usuarios hardcodeados en el código fuente (que termina en el bundle JS servido al navegador): `demo@farutech.com/demo123`, `admin@farutech.com/admin123` (rol admin, permisos `['*']`), y un tercer usuario.
- **Riesgo:** si este proyecto se compila y despliega sin fijar explícitamente `VITE_ENABLE_DEMO_AUTH=false`, cualquier visitante puede autenticarse como administrador con credenciales públicas visibles en el código fuente/bundle.
- No hay evidencia en `.env.example` del proyecto de que esta variable esté documentada como obligatoria para producción.

### F-03 — CRITICAL — Credenciales por defecto débiles y reutilizadas en infraestructura, marcadas explícitamente como "no romper"
- `infrastructure/.env.example` y `infrastructure/docker-compose.yml`: `root_secret`, `farutech_secret`, `admin_secret` como defaults para MySQL root, MySQL app user, Postgres, Mongo root, pgAdmin y Mongo Express.
- El propio comentario del archivo dice literalmente: *"Los defaults del compose son los valores históricos de local (NO romper volúmenes ya inicializados)"* — es decir, estas credenciales débiles **son las que están realmente en uso**, no solo placeholders de ejemplo.
- El `gateway` (HAProxy) expone directamente al host los puertos **3306 (MySQL), 5432 (Postgres) y 27017 (Mongo)**, además de 80/HTTP.
- **Estado:** `IMPLEMENTED — NOT VERIFIED` en cuanto a exposición real a internet (depende de dónde corre el host; no se pudo verificar el entorno real de despliegue), pero **CRITICAL por diseño** si este compose corre en cualquier host con IP pública o sin firewall adicional.

### F-04 — HIGH — Tres motores de base de datos (MySQL + PostgreSQL + MongoDB) para un sitio corporativo, sin justificación documentada
- Los tres están desplegados con interfaces admin completas (phpMyAdmin, pgAdmin, Mongo Express).
- El backend Laravel (`config/database.php`, `composer.json`) no muestra evidencia de usar más de un motor. No se encontró justificación de por qué se necesitan los tres para "sitio web corporativo".
- Contradice directamente la sección 75 del prompt maestro ("NO OVERENGINEERING"). Requiere investigación de uso real antes de decidir `KEEP`/`REMOVE` por motor.

### F-05 — HIGH — Backend: migración Lumen→Laravel completa hecha pero no commiteada
- Ver sección 4.1. Mecanismo de auth es un **JWT-like custom** (payload base64url + HMAC-SHA256 firmado con `APP_KEY`, sin usar Sanctum pese a tenerlo instalado como dependencia).
- Diseño verificado como razonablemente sólido: comparación de firma con `hash_equals` (timing-safe), expiración validada, chequeo `is_active`. **Pero:**
  - No existe mecanismo de revocación/logout server-side (un token robado es válido hasta su expiración, configurable vía `admin_settings.session_ttl_hours`).
  - No hay rate limiting específico para `/admin/login` más allá del límite genérico de 60 req/min (por usuario o IP) aplicado a **todas** las rutas `api.php` vía `RouteServiceProvider` — aceptable pero no defensa dedicada contra fuerza bruta de login.
  - `laravel/sanctum` está en `composer.json` pero no se usa en ningún lado — dependencia muerta o migración a medio terminar.

### F-06 — MEDIUM — Build de `dashboard` roto (verificado por ejecución real, no por lectura de código)
Se ejecutó `npx tsc -b --noEmit` (el mismo compilador que usa el script `"build": "tsc -b && vite build"` del `package.json`). Resultado real:
```text
tsconfig.app.json(12,5): error TS5101: Option 'baseUrl' is deprecated...
vite.config.ts(18,11): error TS2769: No overload matches this call. (manualChunks / OutputOptions)
```
**El build de producción documentado (`npm run build`) fallaría hoy tal como está el código.** Esto es evidencia directa de ejecución, no una suposición.

### F-07 — MEDIUM — PHPUnit y tests de `framework-automation`: existen y parecen bien escritos, pero **no ejecutables en este entorno**
- `apps/backend/tests/Feature/ContactApiTest.php` y `NewsletterApiTest.php` (untracked, nunca commiteados) contienen casos reales y razonables: creación exitosa, validación de campos requeridos, rechazo por `privacy_accepted=false`, honeypot. Bien alineados con el controlador real (`ContactController.php`).
- No se pudo ejecutar (`vendor/` vacío, sin acceso a Packagist en este sandbox). Su estado de ejecución real es `UNKNOWN` — el número "10 tests / 25 assertions / 100% PASS" citado como histórico en el prompt **no fue reproducido ni puede compararse**, porque además los archivos de test actuales (`ContactApiTest.php`, `NewsletterApiTest.php`) son distintos a los que existían en el último commit (`BlogApiTest.php`, `ExampleTest.php`, ahora eliminados del working tree).
- `framework-automation` se autodescribe en `docs/ESTADO_ACTUAL.md` (fechado 2026-03-14) como "✅ PRODUCCIÓN", "4/4 tests, 0 warnings, 0 errors" — esto es **DOCUMENTED — NOT VERIFIED**, ya que no hay `dotnet` disponible en este entorno para reproducirlo, y es autoreportado por el propio repo, no una fuente externa.

### F-08 — LOW/INFO — Inconsistencia de versiones entre las dos apps frontend
- `apps/frontend` (sitio público): React 18.3.1, Vite 8, Tailwind 4.
- `dashboard`: React 19.2.8, Vite (via `rolldown`), Tailwind no confirmado en dependencias directas.
- Si ambos deben compartir un Design System futuro, esta divergencia de versiones mayor de React (18 vs 19) es relevante para esa decisión — no es un error en sí, pero es un dato que la Fase de Arquitectura Objetivo necesita.

---

## 7. VERIFIED FACTS (resumen positivo — lo que sí está bien evidenciado)

- El endpoint `POST /contact` implementa correctamente: honeypot (`website_url`), validación server-side completa, captura de UTM (5 campos), transacción atómica creando `ContactMessage` + `Lead`, manejo de errores con logging, sin loggear datos sensibles.
- Documentación OpenAPI (`@OA\Post` annotations vía `darkaonline/l5-swagger`) presente y bien detallada en `ContactController` y `AuthController`, con ejemplos y códigos de respuesta.
- Existe un middleware dedicado `SwaggerGate.php` para controlar la exposición de la documentación por ambiente (`SWAGGER_UI_ENABLED` flag visto en `docker-compose.yml`) — comportamiento real no verificado (no se pudo levantar el backend), pero el mecanismo existe en código.
- Las rutas API están correctamente agrupadas bajo el middleware `api` (rate limiting 60/min aplicado globalmente) vía `RouteServiceProvider`, consistente con Laravel 10 clásico (`Kernel.php` explícito, no el nuevo `bootstrap/app.php` de Laravel 11) — el código es internamente coherente en cuanto a versión de framework.
- Tests Feature nuevos para Contact/Newsletter son sustantivos y cubren casos de negocio reales, no solo happy-path.

---

## 8. GAPS (lo que falta investigar — próxima sesión / próximas herramientas)

```text
- Auditoría histórica real (files (1)) — no proporcionada, reconciliación pendiente
- Estado real en GitHub (visibilidad, Actions, branch protection, Packages, releases) — rate-limited
- Ejecución real de PHPUnit (requiere composer install con acceso a Packagist)
- Ejecución real de dotnet build/test para framework-automation
- Runtime real del backend (no se pudo levantar Docker/Laravel para probar endpoints en caliente)
- Auditoría de accesibilidad, performance (Core Web Vitals) y SEO en runtime — requiere sitio desplegado o navegador headless
- Base de datos: esquema real, migraciones, si sqlite (usado en tests) es realmente equivalente al MySQL de producción
- Confirmar si `dashboard` está pensado para reemplazar el admin embebido en `web`, o es un producto separado (visión futura "core platform")
- Confirmar entorno real de despliegue de `infrastructure/` (¿local dev, VPS, Raspberry Pi/K3s como sugieren los commits, o mixto?) para calificar correctamente la severidad de F-03
```

---

## 9. RISK REGISTER

| ID | Riesgo | Evidencia | Severidad | Estado |
|----|--------|-----------|-----------|--------|
| R-01 | Credenciales admin de BD hardcodeadas y débiles, marcadas como "no cambiar" | `infrastructure/.env.example`, `docker-compose.yml` | CRITICAL | Confirmado en código; impacto real depende de exposición de red (no verificado) |
| R-02 | Panel `dashboard` con login demo activo por defecto | `demo-auth.service.ts` | CRITICAL | Confirmado en código |
| R-03 | Dos sistemas de administración desconectados para el mismo producto | Rutas API vs. `ENDPOINTS.auth` de dashboard | HIGH | Confirmado, requiere decisión ADR |
| R-04 | Build de producción de `dashboard` roto | Ejecución real de `tsc -b` | MEDIUM | Confirmado por ejecución |
| R-05 | Migración Lumen→Laravel sin commitear — riesgo de pérdida de trabajo | `git status`/`git diff` | HIGH | Confirmado |
| R-06 | `laravel/sanctum` instalado pero no usado (auth custom paralela) | `composer.json` vs. código real | LOW/MEDIUM | Confirmado, deuda técnica |
| R-07 | 3 motores de BD sin justificación de necesidad actual | `infrastructure/docker-compose.yml` | HIGH | Confirmado, pendiente de justificación de negocio |
| R-08 | Sin mecanismo de revocación de token admin (logout no invalida server-side) | `AuthController.php` / `Authenticate.php` | MEDIUM | Confirmado |

---

## 10. DECISIONS (lo único que se puede decidir con evidencia suficiente en esta fase)

```text
1. NO se debe asumir el estado del último commit como "estado actual" en ninguno de
   los repos sin revisar el working tree — la diferencia es sustancial en `web`.
2. NO usar `infrastructure/.env.example` como fuente de verdad de contraseñas seguras
   en ningún ambiente que no sea local aislado, hasta confirmar el entorno real de despliegue.
3. `dashboard` NO debe considerarse production-ready ni conectado al backend real de
   `web` hasta que exista evidencia de integración (hoy no la hay).
4. La organización "Farutech" en GitHub, asumida en el prompt maestro, NO existe en
   los remotes reales encontrados — cualquier plan de reorganización de repos debe
   partir de la cuenta `faridmaloof`, no de una org inexistente (o se debe crear/migrar
   explícitamente como decisión aparte, con ADR).
```

Todo lo demás (KEEP/RENAME/SPLIT/MERGE de repos, arquitectura objetivo, roadmap, ADRs completos) requiere primero cerrar los GAPS de la sección 8 — por eso el `STATUS` general es `CONFLICTING`, no `READY`.

---

## 11. NEXT ACTION (la única siguiente acción válida, según el prompt maestro)

```text
1. El usuario decide y resuelve, en orden de bloqueo:
   a) Proporcionar la auditoría histórica real (files (1)) para poder ejecutar
      la Fase de Reconciliación Histórica (sección 47 del prompt maestro).
   b) Aclarar la relación real entre `projects/dashboard` y `projects/web`
      (F-01): ¿mismo producto, producto futuro, o panel a deprecar?
   c) Confirmar el entorno real de despliegue de `infrastructure/` para calificar
      correctamente R-01/F-03 (¿local, VPS público, Raspberry Pi/K3s?).
   d) Decidir si esta auditoría continúa desde este zip estático, o si se conecta
      Claude Code directamente a `D:\Projects\Farutech\workspace` para poder:
        - ejecutar `composer install` / `dotnet build` / `dotnet test` realmente,
        - consultar GitHub en vivo sin rate limit,
        - levantar Docker y probar endpoints reales.

2. Mientras no se resuelva (a)-(c), NO se debe avanzar a Fase 3 (Reconciliación),
   Fase 4 (Topología de Repositorios) ni Fase 5 (Arquitectura Objetivo) del
   prompt maestro, porque decisiones de KEEP/MERGE/SPLIT de repos y de boundary
   arquitectónico dependerían de supuestos no verificados.
```
