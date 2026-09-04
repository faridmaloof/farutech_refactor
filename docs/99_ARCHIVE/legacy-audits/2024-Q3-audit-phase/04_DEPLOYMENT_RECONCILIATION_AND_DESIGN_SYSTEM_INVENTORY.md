# 04 — RECONCILIACIÓN DE DOCUMENTACIÓN DE DESPLIEGUE + INVENTARIO COMPLETO PARA EL DESIGN SYSTEM

**Ejecuta:** los dos ítems pendientes del "Next Action" del documento 03 (lectura a fondo de la documentación K3s/Raspberry Pi, e inventario de componentes).

---

## PARTE A — DEPLOYMENT / CI-CD (K3s / Raspberry Pi)

### A.1 Hallazgo principal: existen 3 documentos de despliegue, mutuamente inconsistentes, y **ninguno coincide con lo que hay realmente en el repositorio**

Se leyeron completos `docs/CI-CD-K3S-PI.md`, `docs/DEPLOY-PI-K3S.md` y se escaneó `docs/DEPLOYMENT.md`. Se cruzó cada uno contra `git log` y contra el filesystem real. Resultado:

| Documento | Qué describe | Estado real verificado |
|---|---|---|
| `docs/CI-CD-K3S-PI.md` (412 líneas, commit `49d0850`) | 1 sola Raspberry Pi, Gitea+Gitea Actions+act_runner corriendo en Docker del host, K3s con namespaces `hosting`/`infra`, manifiestos en `deploy/k3s/`, scripts en `scripts/` | **OBSOLETO.** Todos los archivos que describe (`deploy/k3s/*`, `ci/*`, `scripts/*`, `.gitea/workflows/deploy-dev.yml`, los Dockerfiles viejos) fueron **borrados** en el commit siguiente (`708bcb5`), 3 días después de haberse creado. El propio `DEPLOY-PI-K3S.md` lo confirma en su primera línea: *"Reemplaza a `docs/CI-CD-K3S-PI.md` (que quedó con secciones faltantes y dominios desactualizados)"* |
| `docs/DEPLOY-PI-K3S.md` (239 líneas, commit `708bcb5`, el más reciente de los tres) | Mismo concepto general (K3s + Gitea + registry local en 1 Pi), pero con scripts numerados e idempotentes (`00-setup-pi-host.sh` → `10-deploy-infra.sh` → `20-build-and-push.sh` → `30-deploy-app.sh`, orquestados por `deploy.sh`), dominio `*.farutech.rbp` vía `/etc/hosts` | **ES SOLO DOCUMENTACIÓN, AÚN NO IMPLEMENTADO.** Se verificó explícitamente: **ninguno** de los scripts que describe (`scripts/00-setup-pi-host.sh`, `10-deploy-infra.sh`, `20-build-and-push.sh`, `30-deploy-app.sh`, `deploy.sh`) ni los manifiestos `deploy/k3s/*` existen en el repositorio, ni en el working tree ni en ningún commit. Es la guía "objetivo" más reciente y mejor pensada de las tres, pero el código que describe todavía no se escribió |
| `docs/DEPLOYMENT.md` (505 líneas) | Un tercer enfoque completamente distinto: despliegue manual clásico sobre VPS — Nginx/Apache directo, LetsEncrypt manual, sin K3s ni contenedores en absoluto (`Paso 4: Configuración del Servidor Web`, `Paso 5: SSL/TLS`) | Parece un documento más antiguo/genérico, probablemente escrito antes del pivote a K3s, o pensado como plan B sin Kubernetes. No se verificó su fecha de commit exacta ni si sigue vigente como alternativa — **queda marcado `DOCUMENTED — NOT VERIFIED`**, pendiente de preguntar al owner si sigue teniendo vigencia o debe descartarse |

**Además, `DEPLOY-PI-K3S.md` (sección 9) confirma otro dato que ya sabíamos por el doc 01/02:** el camino de VPS/Hostinger actual usaba `docker-compose.prod.yml` + Nginx Proxy Manager — **ese archivo también fue eliminado** del working tree (ya lo habíamos detectado en el `git status` del doc 01). El propio documento recomienda, textualmente, migrar también el VPS a K3s para tener paridad con Dev — **esto coincide exactamente con lo que definiste en el doc 02** (QA/Staging/Prod en Hostinger con K3s). Buena noticia: no hay conflicto de dirección, solo falta ejecutarlo.

### A.2 Hallazgo nuevo de seguridad (encontrado dentro de la documentación, no en código — pendiente de confirmar en código real)

`DEPLOY-PI-K3S.md` línea 185-188 dice textualmente: *"⚠️ Nota sobre el código de la app: `AdminUserSeeder.php` crea usuarios con contraseñas fijas en texto plano en el repositorio (`Admin@123456`, etc.)"*. Esto es una **auto-confirmación del propio equipo/agente que escribió el doc**, no una suposición mía. Se agrega al Risk Register como **R-09 — CRITICAL**: contraseña de administrador fija y en texto plano en el código fuente del backend (`AdminUserSeeder.php` — no fue leído directamente en esta sesión, pendiente de abrir el archivo y confirmarlo línea por línea antes de decidir la corrección).

### A.3 Lo que SÍ está alineado con tu dirección (doc 02) — no hay que rediseñar desde cero

- Dominio vía `/etc/hosts` en desarrollo → coincide con lo que describiste.
- Reconocimiento explícito en el propio doc de que falta llevar K3s también a Hostinger para tener paridad → coincide con tu plan de 3 ambientes.
- Generación de credenciales al primer despliegue, mostradas una sola vez, con archivo local en `.gitignore` → es prácticamente el mismo patrón de "Secret → fallback" que pediste diseñar en el doc 02 sección 3, solo que aplicado hoy únicamente al primer deploy manual, no a una jerarquía formal Secret-manager → `.env`. Es una base aprovechable, no hay que inventar de cero.
- Diseño de scripts numerados e idempotentes (`00-`, `10-`, `20-`, `30-`) es exactamente el tipo de "lo más claro y dummy posible" que pediste — es un buen patrón a **mantener y extender** al multi-nodo (Pi 2B + Pi 4B [+ laptops]), no a descartar.

### A.4 GAP que se mantiene abierto (no se resuelve en este documento)

```text
- Ninguno de los 3 documentos contempla un CLÚSTER MULTI-NODO (Pi 2B + Pi 4B +
  laptops opcionales) — todos asumen 1 sola Raspberry Pi. Falta diseñar cómo
  se unen los nodos adicionales a K3s (k3s en modo agente/worker apuntando al
  4B como server) y qué workloads son razonables en un Pi 2B (mucho más
  limitado en RAM/CPU que el 4B) — ej. probablemente el 2B no debería correr
  MySQL ni el backend, solo réplicas del frontend estático o un worker liviano.
- docs/DEPLOYMENT.md necesita que confirmes si sigue vigente o se descarta.
- Los scripts descritos en DEPLOY-PI-K3S.md (00 a 30 + deploy.sh) están
  documentados pero NO escritos — es trabajo de implementación real pendiente,
  no algo que ya exista y haya que "solo mejorar".
```

---

## PARTE B — INVENTARIO COMPLETO PARA EL DESIGN SYSTEM

### B.1 `projects/dashboard` — catálogo completo de `components/ui/` (45 archivos)

Componentes de control/formulario:
```text
Button · ButtonGroup · Checkbox · RadioGroup · Switch · Select · Input ·
Textarea · MaskedInput · PhoneInput · TagInput · DatePicker · DateControls ·
Form
```
Componentes de datos/listas:
```text
DataTable (+ DataTable.README.md — ya documentado) · Charts · StatsCard ·
ListBox · ListGroup · Scheduler · Stepper · ProgressBar
```
Componentes de feedback/overlay:
```text
Alert · Toast · Tooltip · Modal · Drawer · NotificationPanel · Skeleton ·
Spinner · Loading · GlobalLoading · LogoSpinner · EmptyState
```
Navegación/estructura:
```text
Breadcrumb · Tabs · Dropdown · CommandPalette · ModuleSwitcher · Carousel ·
Divider · Avatar · Badge · IconRenderer · FloatingActionButton · CodePreview ·
ImageUpload
```
CRUD compuesto (`components/crud/`):
```text
CrudActions · CrudFilters · CrudPagination · CrudTable
```
Layout (`components/layout/`):
```text
ContentSuspense · MainLayout · Navbar · PageTransition · RequireAuth ·
SearchBar · SearchModal · Sidebar   (← este es el "menú vertical" que
mencionaste; el "menú horizontal" pendiente que citaste no tiene equivalente
todavía en ningún lado del código auditado — confirmado GAP real, no solo
percepción)
```
**Dato importante encontrado, no mencionado antes:** el dashboard **ya tiene sus propias páginas de showcase de Design System** en `pages/design-system/`: `TokensPage`, `ColorsPage`, `ComponentsLibraryPage`, `ChartsLibraryPage`, `TypographyPage`. Esto es una base real y aprovechable — probablemente el punto de partida más rápido para documentar el paquete nuevo, en vez de crear un Storybook u otra herramienta desde cero (a evaluar en la fase de Specification).

Screens de autenticación ya construidas (coincide con lo que pediste llevar al Design System):
```text
pages/auth/LoginPage.tsx · pages/auth/ForgotPasswordPage.tsx
```
(No se encontró `RegisterPage` en `dashboard` — lo mencionaste como pendiente de incluir; hoy el registro solo existe en `apps/frontend` del lado del backend, `RegisterController.php`/`register/confirm` en `routes/api.php` — sin pantalla dedicada visible en ninguno de los dos frontends auditados. **GAP nuevo**: pantalla de registro de admin no tiene UI construida todavía en ningún lado.)

Módulos de negocio (NO son Design System, son features de aplicación — quedan fuera del paquete, son ejemplo de "cómo se usa" el Design System, no parte de él): `CRM (Clients/Leads/Dashboard)`, `Inventario`, `Ventas/Orders`, `Reportes`, `Users`, `Settings`, `Processes`. Vale la pena notar: varios de estos (Inventario, Ventas) no tienen relación evidente con "sitio corporativo" — refuerza tu propia descripción de que `dashboard` nació como plantilla genérica de admin, no como algo hecho a medida para Farutech.

### B.2 `apps/frontend` (sitio público) — inventario (independiente del anterior)

`components/primitives.tsx`: `Button`, `Eyebrow`, `SectionHeading`, `Tag`, `StatusBadge`, `Reveal` (animación de scroll-reveal).
`components/patterns.tsx` (362 líneas, no desglosado componente por componente en esta pasada — pendiente para la fase de Specification).
`components/layout.tsx` (313 líneas, layout del sitio público — header/footer probablemente, pendiente de desglosar).
Componentes de negocio ya construidos aquí (no genéricos, específicos del sitio): `ContactForm`, `Newsletter`, `LegalBanner`, `Logo`, `JsonLd` (SEO structured data).

### B.3 Comparación directa — qué se solapa y qué no

| Concepto | `dashboard` | `apps/frontend` | Decisión sugerida (a confirmar en Specification) |
|---|---|---|---|
| `Button` | Sí (`components/ui/Button.tsx`) | Sí (`primitives.tsx`) | **Reconciliar** — mismo nombre, dos implementaciones distintas, hay que comparar props/variantes antes de fusionar |
| `Badge` / `Tag` | `Badge.tsx` | `Tag.tsx` (+ `StatusBadge`) | **Reconciliar** — funciones parecidas, nombres distintos |
| `DataTable` / CRUD | Sí, completo | No existe | Se migra tal cual desde dashboard, sin conflicto |
| `Reveal` (animación scroll) | No existe | Sí | Se migra tal cual desde apps/frontend, sin conflicto |
| Login/Register/ForgotPassword screens | Login + Forgot sí, Register no | Ninguna (el admin embebido tiene su propio `AdminLoginPage`, distinto también) | **Hay que unificar 3 fuentes**, no 2: dashboard, apps/frontend/admin embebido, y construir Register desde cero |
| Menú vertical | Sí (`Sidebar.tsx`) | No aplica (sitio público no tiene sidebar) | Se migra desde dashboard |
| Menú horizontal | No existe en ningún lado | No existe en ningún lado | **Se construye nuevo**, no hay nada que migrar |

---

## PARTE C — ACTUALIZACIÓN DE RISK REGISTER Y GAPS

**Nuevo riesgo:**
| ID | Riesgo | Evidencia | Severidad |
|---|---|---|---|
| R-09 | Password de admin fija en texto plano en `AdminUserSeeder.php` (auto-reportado en `DEPLOY-PI-K3S.md`, no verificado directamente en código todavía) | Doc `DEPLOY-PI-K3S.md` línea 185-188 | CRITICAL — pendiente de confirmar en código |

**Nuevos GAPs:**
```text
- Diseño de K3s multi-nodo (Pi 2B + Pi 4B [+laptops]) — no existe en ningún documento
- Confirmar vigencia de docs/DEPLOYMENT.md (VPS manual sin K3s) — ¿descartar o mantener como plan B?
- Los scripts 00-30 + deploy.sh de DEPLOY-PI-K3S.md están documentados pero no escritos
- Menú horizontal — no existe ninguna base, se construye desde cero
- Pantalla de Registro de admin — no existe UI en ningún lado, solo backend
- AdminUserSeeder.php — abrir y confirmar directamente el hallazgo de password fija
```

---

## D — NEXT ACTION

```text
Con esto, ya hay evidencia suficiente (código + documentación propia del
repositorio) para redactar el documento 05: REPOSITORY TOPOLOGY ANALYSIS +
TARGET ARCHITECTURE — que cubre:
  - Estructura final de apps (website / admin / intranet) y si van en el
    monorepo actual o se separan
  - Dónde vive el paquete de Design System (packages/design-system o repo
    propio) y cómo se publica en GitHub Packages en modo público
  - Cómo se adapta framework-automation como plantilla dotnet new
  - Cómo se extiende el patrón de scripts 00-30 al multi-nodo

Antes de escribir ese documento, corresponde abrir AdminUserSeeder.php y
confirmar R-09 directamente en código (pendiente, no bloqueante para seguir).
```
