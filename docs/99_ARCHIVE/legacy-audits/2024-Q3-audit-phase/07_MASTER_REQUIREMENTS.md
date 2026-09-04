# 07 — MASTER REQUIREMENTS

Consolida en formato formal (REQ-ID) todo lo confirmado en los documentos 01-06. Cada requisito indica su fuente real (no inventada) y su estado de verificación, siguiendo la regla del prompt maestro: `EVIDENCE > ASSUMPTION`.

Convención de ID: `REQ-<ÁREA>-<NÚMERO>`.

---

## ÁREA: BACKEND (BE)

### REQ-BE-01 — Framework del backend
**Descripción:** El backend debe correr sobre Lumen (no Laravel completo), priorizando menor huella de arranque para una API pura.
**Fuente:** Owner, doc 03 §1. **Evidencia:** Confirmado técnicamente viable — Sanctum no tiene soporte oficial en Lumen mientras que Swagger sí (vía `swagger-lume` o, mejor, Scalar sin paquete adicional). Sanctum hoy está instalado pero sin usarse en ningún controlador real (doc 01 F-05), así que revertir no tiene el costo alto que parecía.
**Prioridad:** ALTA (bloquea el resto del backend).
**Dependencias:** Ninguna.
**Criterio de aceptación:** `composer.json` usa `laravel/lumen-framework`; controllers/modelos ya escritos (Contact, Newsletter, Auth) migran sin reescritura funcional; tests `ContactApiTest`/`NewsletterApiTest` pasan sobre Lumen.

### REQ-BE-02 — Documentación de API
**Descripción:** Exponer documentación OpenAPI vía Scalar (HTML estático + CDN, sin paquete Composer adicional para la UI), generando el JSON con `zircote/swagger-php` a partir de las anotaciones `@OA\*` ya existentes.
**Fuente:** Owner + investigación técnica, doc 03 §2.
**Prioridad:** MEDIA.
**Dependencias:** REQ-BE-01.
**Criterio de aceptación:** Documentación visible en local/dev/qa; en staging disponible solo si se habilita explícitamente por configuración (`APP_ENV` + flag); en producción, no disponible.

### REQ-BE-03 — Newsletter: motor de campañas
**Descripción:** El admin debe poder componer y enviar comunicados a la lista de suscriptores del newsletter, vía un proveedor externo de email, en modo individual o por lotes (a evaluar cuál), con soporte de templates editables desde admin.
**Fuente:** Owner, doc 03 §3. **Estado:** `NUEVO — no existe implementación hoy` (verificado: `NewsletterController.php` actual solo tiene alta de suscriptor).
**Prioridad:** MEDIA (depende de decisión de negocio pendiente: proveedor de email).
**Dependencias:** REQ-BE-01, decisión de proveedor de email (no tomada), verificar soporte de colas en Lumen.
**Criterio de aceptación:** Definido en la fase de Specification detallada de esta feature (pendiente, no se especifica en este documento).

### REQ-BE-04 — Corrección de credenciales de administrador hardcodeadas
**Descripción:** Eliminar las contraseñas fijas en `AdminUserSeeder.php` (`Admin@123456`, etc.), reemplazando por generación de credenciales al momento del seed (mostradas una sola vez), siguiendo el mismo patrón ya diseñado conceptualmente para MySQL en `DEPLOY-PI-K3S.md`.
**Fuente:** Doc 05 §1 (R-09, confirmado en código).
**Prioridad:** CRÍTICA.
**Dependencias:** Ninguna, es independiente de Lumen/Laravel.
**Criterio de aceptación:** Ningún password en texto plano en el repositorio; el seeder genera y muestra la credencial una sola vez, o falla explícitamente si no hay mecanismo de entrega segura configurado.

### REQ-BE-05 — Registro de administrador (pantalla faltante)
**Descripción:** Construir la pantalla de registro de usuario admin — hoy solo existe el endpoint de backend (`register`/`register/confirm`), sin UI en ningún frontend auditado.
**Fuente:** Doc 04 Parte B.1. **Prioridad:** BAJA (no bloquea nada crítico).
**Dependencias:** REQ-DS-* (Design System, para no construir una pantalla suelta fuera del sistema de componentes).

---

## ÁREA: INFRAESTRUCTURA / SECRETS (INF)

### REQ-INF-01 — Jerarquía de configuración: Secret → `.env` → default
**Descripción:** Toda credencial/config sensible debe resolverse primero desde un mecanismo de Secrets (K3s Secret en Dev/QA/Staging/Prod), con fallback a `.env` si el Secret no está definido, y valor por defecto solo como última instancia documentada explícitamente como "no usar en ambientes reales".
**Fuente:** Owner, doc 02 §3. **Evidencia relacionada:** el propio `infrastructure/.env.example` actual tiene credenciales reales marcadas como "no romper" (doc 01 F-03/R-01) — este requisito es la corrección formal de ese hallazgo.
**Prioridad:** CRÍTICA.
**Dependencias:** Ninguna.
**Criterio de aceptación:** Ningún valor real de producción/dev vive como default en código; existe documentación de qué Secret corresponde a cada variable.

### REQ-INF-02 — Despliegue Local (Docker)
**Descripción:** `docker compose up` con solo ajuste de variables, sin pasos manuales adicionales.
**Fuente:** Owner, doc 02 §4. **Prioridad:** ALTA.
**Estado:** Ya existe una base (`infrastructure/docker-compose.yml`) — requiere corrección de REQ-INF-01, no reconstrucción completa.

### REQ-INF-03 — Despliegue Dev (K3s multi-nodo, Raspberry Pi 2B + 4B [+laptops opcionales])
**Descripción:** Clúster K3s real sobre hardware heterogéneo, Pi 4B como control-plane/cabeza. Acceso vía `/etc/hosts` hoy, con evolución futura a DNS/Pi-hole propio.
**Fuente:** Owner, doc 02 §4. **Evidencia:** `DEPLOY-PI-K3S.md` da una base de diseño (scripts `00-30` idempotentes) pero **solo para 1 nodo** — el multi-nodo no está documentado en ningún lado (doc 04 GAP).
**Prioridad:** ALTA.
**Dependencias:** REQ-INF-01, REQ-REPO-01 (repos separados — cada repo necesita su propio pipeline de build/deploy).
**Criterio de aceptación:** Definido en Specification pendiente (diseño de qué workloads corren en qué nodo, dado que el Pi 2B es mucho más limitado).

### REQ-INF-04 — Despliegue QA/Staging/Prod (VPS Hostinger, K3s, paridad con Dev)
**Descripción:** Mismo patrón de despliegue que Dev, con URLs públicas accesibles desde internet.
**Fuente:** Owner, doc 02 §4. **Evidencia de alineación:** el propio `DEPLOY-PI-K3S.md` (sección 9) ya recomendaba esto mismo antes de que el owner lo confirmara — no hay conflicto de dirección.
**Prioridad:** MEDIA (posterior a Dev funcionando).
**Dependencias:** REQ-INF-03.

### REQ-INF-05 — Re-evaluación de la herramienta de CI/CD (Gitea vs. GitHub Actions)
**Descripción:** Ahora que existe `github.com/Farutech` real (doc 06), evaluar si conviene reemplazar el Gitea local propuesto en `DEPLOY-PI-K3S.md` por GitHub Actions con runner self-hosted en la Pi.
**Fuente:** Doc 06 §5/6 (GAP nuevo). **Prioridad:** MEDIA. **Estado:** Pendiente de decisión, no de implementación — se resuelve en Specification.

---

## ÁREA: DESIGN SYSTEM (DS)

### REQ-DS-01 — Paquete de componentes publicable
**Descripción:** Extraer y unificar componentes de `dashboard` (45 en `components/ui/` + CRUD + layout) y de `apps/frontend` (`primitives.tsx`, `patterns.tsx`) en un único paquete versionado, con estilos/tokens configurables (no hardcodeados como hoy en `dashboard`).
**Fuente:** Owner, doc 02 §2 + doc 03 §5. **Evidencia:** inventario completo en doc 04 Parte B, incluyendo tabla de solapamientos (Button, Badge/Tag) a reconciliar.
**Prioridad:** ALTA (bloquea `Farutech/admin` y la uniformidad entre frontends).
**Criterio de aceptación:** Componentes con API de props consistente; documentado (aprovechando las páginas `pages/design-system/*` ya existentes en `dashboard` como base, doc 04).

### REQ-DS-02 — Publicación pública en GitHub Packages, repo privado
**Descripción:** El paquete se publica con visibilidad pública en GitHub Packages (sin requerir token para instalarlo), aunque el repositorio fuente (`Farutech/design-system`) sea privado.
**Fuente:** Owner (doc 02 §2) + confirmación técnica de que ambas cosas son compatibles (doc 06 §4).
**Prioridad:** MEDIA.
**Dependencias:** REQ-DS-01, REQ-REPO-01.

### REQ-DS-03 — Pantallas de autenticación reutilizables
**Descripción:** Login, Register, ForgotPassword como componentes del Design System — cada app solo indica/personaliza el endpoint a llamar.
**Fuente:** Owner, doc 02 §2. **Evidencia:** hoy existen Login+ForgotPassword en `dashboard`, ninguna Register en ningún lado (doc 04 Parte B.1 — GAP real).
**Prioridad:** ALTA.

### REQ-DS-04 — Menú horizontal
**Descripción:** Construir un componente de navegación horizontal — no existe ningún equivalente hoy en ningún lado del código auditado (el menú vertical/`Sidebar.tsx` sí existe y se migra).
**Fuente:** Owner, doc 02 §2 / doc 04 Parte B.3 (confirmado GAP real, no solo percepción).
**Prioridad:** MEDIA.

### REQ-DS-05 — Componentes pensados para editor visual (futuro)
**Descripción:** Diseñar props serializables a JSON y nombres/comportamiento predecibles, pensando en el futuro editor WYSIWYG (doc 02 §8) — no se implementa el editor ahora, pero el Design System debe construirse teniendo esto en mente.
**Fuente:** Owner, doc 02 §8 (FUTURE ARCHITECTURAL CONTEXT — no se implementa ahora, solo condiciona el diseño).
**Prioridad:** BAJA (restricción de diseño, no una entrega en sí).

---

## ÁREA: FRONTEND / TOPOLOGÍA DE APPS (FE)

### REQ-FE-01 — Separación de `apps/frontend` en 3 apps por subdominio
**Descripción:** `website.farutech.com` (público), `admin.farutech.com` (gestión, recibe leads/newsletter, configura blog), `intranet.farutech.com` (alcance diferido, gestión de solicitudes internas).
**Fuente:** Owner, doc 02 §7. **Prioridad:** ALTA.
**Dependencias:** REQ-DS-01 (para no construir `admin`/`intranet` sin el Design System de base), REQ-REPO-01.

### REQ-FE-02 — Autenticación compartida entre subdominios (SSO real vs. re-login)
**Descripción:** Definir si admin/intranet/website comparten sesión vía cookie de dominio padre `.farutech.com`, dado que comparten datos funcionalmente (blog, leads, newsletter).
**Fuente:** Doc 02 §7 (pregunta abierta, no bloqueante). **Estado:** `PENDIENTE DE DECISIÓN`, se resuelve en Specification del Design System (REQ-DS-03 depende de esto).

---

## ÁREA: REPOSITORIOS (REPO)

### REQ-REPO-01 — Migración a repos independientes bajo `github.com/Farutech`, privados
**Descripción:** Cada app/servicio en su propio repositorio (website, admin, intranet, backend, design-system, infrastructure, framework-automation), todos privados, permitiendo clonar/modificar cada uno sin bajar el resto del ecosistema.
**Fuente:** Owner, doc 06 §2 (verificado: la organización existe realmente, `created_at: 2026-07-10`, `public_repos: 8`).
**Prioridad:** ALTA — bloquea la asignación de responsabilidad por equipo que es el objetivo de negocio de fondo.
**Criterio de aceptación:** Ver plan de migración detallado en doc 06 §3 (filter-repo/subtree para preservar historial, no copy-paste de archivos).

### REQ-REPO-02 — Inventario y disposición de los 8 repos públicos ya existentes en la organización
**Descripción:** Antes de crear los repos nuevos, identificar qué son los 8 repos públicos que ya existen en `github.com/Farutech` y decidir KEEP/RENAME/MERGE/REMOVE para cada uno.
**Fuente:** Doc 06 §1/§6 (GAP, no se pudo listar por rate-limit del entorno).
**Prioridad:** ALTA (riesgo de colisión de nombres o de dejar repos públicos indeseados si no se revisa antes de migrar).
**Estado:** `BLOCKED — requiere que el owner comparta el listado, o verificación con `gh` autenticado`.

---

## ÁREA: TESTING (QA)

### REQ-QA-01 — `framework-automation` como plantilla instalable
**Descripción:** Empaquetar como `dotnet new <template>` para adopción sin clonar el repo completo, según alcance confirmado (E2E, API, Performance, Integración — no unitarias).
**Fuente:** Owner, doc 03 §6. **Prioridad:** MEDIA. **Dependencias:** REQ-REPO-01 (transferencia del repo a la org).

---

## RESUMEN — REQS BLOQUEANTES PARA CONTINUAR A SPECIFICATION DETALLADA

```text
CRÍTICOS, sin decisión de negocio pendiente (se puede especificar ya):
  REQ-BE-04 (passwords hardcoded)
  REQ-INF-01 (jerarquía secrets)

ALTOS, listos para especificar:
  REQ-BE-01, REQ-DS-01, REQ-DS-03, REQ-FE-01, REQ-REPO-01

PENDIENTES DE DECISIÓN DE NEGOCIO (no bloquean seguir con el resto):
  REQ-BE-03 (proveedor de email)
  REQ-REPO-02 (inventario de los 8 repos públicos existentes)
  REQ-INF-05 (Gitea vs GitHub Actions)
  REQ-FE-02 (SSO vs re-login)
```
