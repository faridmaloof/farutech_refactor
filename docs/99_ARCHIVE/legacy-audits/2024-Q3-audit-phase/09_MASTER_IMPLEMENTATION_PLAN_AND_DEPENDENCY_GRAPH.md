# 09 — MASTER IMPLEMENTATION PLAN + TASK DEPENDENCY GRAPH

Consolida REQ-* del doc 07 en tareas ejecutables, ordenadas por dependencia real (prompt maestro sección 53-54). Cada tarea sigue el formato exigido: TASK-ID, TITLE, SOURCE, REPOSITORY, CURRENT STATE, TARGET STATE, OBJECTIVE, DEPENDENCIES, FILES/AREAS, IMPLEMENTATION, TESTING, SECURITY, PERFORMANCE, ACCESSIBILITY, DOCUMENTATION, VALIDATION, ROLLBACK, EVIDENCE, PRIORITY.

**Nota de alcance:** este documento planea, no ejecuta. Ninguna de estas tareas se ha corrido todavía (consistente con la regla del prompt maestro de no implementar sin especificación previa, y con la primera ejecución que sigue en modo Discovery/Plan).

---

## WAVE 0 — SIN DEPENDENCIAS, EJECUTABLES DE INMEDIATO

### TASK-001 — Corregir credenciales de administrador hardcodeadas
- **SOURCE:** REQ-BE-04 / R-09 (doc 05)
- **REPOSITORY:** `apps/backend` actual (hoy dentro del monorepo `website-farutech`; sobrevive el cambio sin importar si ya se migró o no)
- **CURRENT STATE:** `AdminUserSeeder.php` inserta 3 usuarios con password fija en texto plano en el código (`Admin@123456`, `Editor@123456`, `Viewer@123456`), hasheada en BD pero expuesta en el repo.
- **TARGET STATE:** El seeder genera contraseñas aleatorias al ejecutarse (o falla si no hay mecanismo de entrega segura configurado), sin ningún valor fijo en el código.
- **OBJECTIVE:** Eliminar el vector de acceso admin trivial.
- **DEPENDENCIES:** Ninguna.
- **FILES/AREAS:** `database/seeders/AdminUserSeeder.php`.
- **IMPLEMENTATION:** Generar password random criptográficamente segura por usuario; imprimir/loguear una sola vez en la salida del comando de seed (nunca en logs persistentes); documentar el procedimiento de primer acceso.
- **TESTING:** Test que confirme que el seeder no contiene ningún literal de password; test de que el hash generado corresponde a un valor no determinístico entre corridas.
- **SECURITY:** Verificar que el valor generado no quede en ningún log persistente ni en historial de shell.
- **PERFORMANCE:** N/A.
- **ACCESSIBILITY:** N/A.
- **DOCUMENTATION:** Actualizar cualquier guía de "primer despliegue" que hoy asuma estas credenciales fijas.
- **VALIDATION:** Ejecutar el seeder dos veces en ambientes distintos y confirmar passwords diferentes.
- **ROLLBACK:** Revertir el commit; no hay dato persistente que migrar.
- **EVIDENCE:** Captura de la salida del seed mostrando la generación, no el valor fijo en el diff.
- **PRIORITY:** CRÍTICA.

### TASK-002 — Diseñar jerarquía de configuración Secret → `.env` → default
- **SOURCE:** REQ-INF-01
- **REPOSITORY:** Futuro `Farutech/infrastructure` (o donde viva hoy `infrastructure/` mientras no se migra)
- **CURRENT STATE:** `infrastructure/.env.example` tiene credenciales reales marcadas "no romper" — son las que están en uso.
- **TARGET STATE:** Cada variable sensible se resuelve primero desde Secret (K3s Secret en Dev/QA/Staging/Prod, o mecanismo equivalente en local), con fallback documentado a `.env`, y ningún valor real como default.
- **OBJECTIVE:** Cerrar R-01/R-03.
- **DEPENDENCIES:** Ninguna (es diseño, no requiere que los repos ya estén migrados).
- **FILES/AREAS:** `infrastructure/.env.example`, `docker-compose.yml`, futuros manifiestos K3s.
- **IMPLEMENTATION:** Documentar la jerarquía; reemplazar defaults reales por placeholders explícitos (`CHANGE_ME_OR_SET_SECRET`); script de arranque que valide y falle si detecta un placeholder en un ambiente no-local.
- **TESTING:** Test/script que verifique que ningún ambiente marcado como no-local arranca con un valor placeholder.
- **SECURITY:** Es la corrección misma del hallazgo — máxima prioridad de este bloque.
- **VALIDATION:** Simular arranque sin Secret definido y confirmar fallback correcto a `.env`; simular sin ninguno de los dos y confirmar que rechaza arrancar en ambientes no-local.
- **ROLLBACK:** Mantener `.env.example` viejo como referencia hasta confirmar el nuevo flujo en Local.
- **EVIDENCE:** Log de arranque mostrando el origen de cada variable (Secret/env/rechazado).
- **PRIORITY:** CRÍTICA.

### TASK-003 — Confirmar disposición de los 4 repos ya existentes en `github.com/Farutech`
- **SOURCE:** REQ-REPO-02
- **CURRENT STATE:** Confirmado por el owner vía `gh repo list Farutech`: `Farutech/website` (público, actualizado hace 14h — **colisiona con TASK-101**), `Farutech/Cloud-Platform` (público, visión futura, fuera de alcance actual), `Farutech/feks-docs` (privado), `Farutech/Engineering-Knowledge-System` (público, "single source of truth" de arquitectura/estándares).
- **TARGET STATE:** Decisión explícita por repo: `Farutech/website` — investigar qué contiene antes de decidir si se renombra/reemplaza/fusiona con la migración planeada (no se puede crear un repo con el mismo nombre sin resolver esto primero); los otros 3 quedan `NO APLICA` por confirmación directa del owner, sin acción.
- **OBJECTIVE:** Evitar colisión de nombres y pérdida accidental de trabajo ya existente.
- **DEPENDENCIES:** Ninguna.
- **IMPLEMENTATION:** `git clone`/`gh repo view Farutech/website` para inspeccionar contenido real antes de decidir.
- **VALIDATION:** Confirmación explícita del owner sobre qué hacer con `Farutech/website` antes de ejecutar TASK-101.
- **ROLLBACK:** N/A (es solo investigación).
- **EVIDENCE:** Resultado de la inspección, documentado en un doc 10 si aparece algo relevante.
- **PRIORITY:** ALTA — bloquea específicamente TASK-101, no el resto del plan.

---

## WAVE 1 — DEPENDEN SOLO DE WAVE 0 O DE NADA, PERO CONVIENE SECUENCIAR ASÍ

### TASK-101 — Crear/mover repositorios independientes bajo `Farutech`, privados
- **SOURCE:** REQ-REPO-01
- **CURRENT STATE:** 3 repos bajo cuenta personal `faridmaloof` (monorepo `website-farutech`, `dashboard`, `framework-automation`), públicos.
- **TARGET STATE:** `Farutech/website`, `Farutech/backend`, `Farutech/admin`, `Farutech/intranet`, `Farutech/design-system`, `Farutech/infrastructure`, `Farutech/framework-automation` — todos privados.
- **DEPENDENCIES:** TASK-003 (resolver colisión de `Farutech/website` primero).
- **IMPLEMENTATION:** Ver plan detallado en doc 06 §3 (`git filter-repo`/`subtree split` para website+backend preservando historial; transferencia nativa para `framework-automation`; repos nuevos vacíos para admin/intranet/design-system/infrastructure).
- **TESTING:** Clonar cada repo nuevo de forma aislada y confirmar que compila/instala sin necesitar ningún otro repo del ecosistema (criterio de independencia, prompt maestro sección 10).
- **SECURITY:** Confirmar visibilidad privada inmediatamente después de cada creación/transferencia, antes de cualquier push de contenido sensible.
- **DOCUMENTATION:** README por repo explicando su responsabilidad única (prompt maestro sección 11).
- **VALIDATION:** Repos viejos (`faridmaloof/*`) archivados, no borrados, solo después de confirmar que los nuevos están completos.
- **ROLLBACK:** Los repos originales siguen existiendo (archivados, no eliminados) mientras no se confirme el éxito de la migración.
- **EVIDENCE:** Historial de commits preservado y verificable en cada repo nuevo.
- **PRIORITY:** ALTA.

### TASK-102 — Migrar backend de Laravel (working tree actual) a Lumen
- **SOURCE:** REQ-BE-01
- **REPOSITORY:** `Farutech/backend` (post TASK-101; puede hacerse antes de mover el repo si se prefiere, ya que es un cambio de código, no de ubicación)
- **CURRENT STATE:** Working tree con Laravel 10 completo (Sanctum instalado sin usar, `l5-swagger`, Contact/Newsletter/Auth ya reescritos, sin commitear).
- **TARGET STATE:** Lumen, mismos controllers/modelos/tests migrados tal cual (son compatibles, confirmado en doc 03 §1), sin Sanctum ni `l5-swagger`.
- **DEPENDENCIES:** Ninguna estricta, pero lógicamente antes de TASK-103 (Scalar depende del framework ya resuelto).
- **IMPLEMENTATION:** Reemplazar `composer.json` (quitar `laravel/*`, volver a `laravel/lumen-framework`); mover controllers/modelos/middleware sin reescritura funcional; adaptar `bootstrap/app.php` al estilo Lumen.
- **TESTING:** Ejecutar `ContactApiTest.php`/`NewsletterApiTest.php` (ya escritos) sobre Lumen y confirmar que pasan sin modificación de aserciones.
- **SECURITY:** Confirmar que el middleware `Authenticate` (auth custom HMAC) sigue funcionando igual.
- **PERFORMANCE:** Medir tiempo de arranque/respuesta antes/después como evidencia del beneficio esperado (no asumir la mejora sin medirla, prompt maestro sección 35).
- **DOCUMENTATION:** Actualizar cualquier referencia a "Laravel" en docs existentes.
- **VALIDATION:** Suite completa de tests pasando + endpoints probados manualmente (health check, contact, newsletter, admin/login).
- **ROLLBACK:** El working tree Laravel actual queda respaldado (branch aparte) hasta confirmar Lumen funcionando.
- **EVIDENCE:** Resultado de tests + comparación de tiempo de arranque.
- **PRIORITY:** ALTA.

### TASK-103 — Documentación de API con Scalar
- **SOURCE:** REQ-BE-02
- **DEPENDENCIES:** TASK-102.
- **CURRENT STATE:** Anotaciones `@OA\*` ya escritas en `ContactController`/`AuthController`, sin renderizador funcional (el actual, `l5-swagger`, se descarta con TASK-102).
- **TARGET STATE:** Ruta que sirve HTML con Scalar vía CDN, apuntando al JSON generado por `zircote/swagger-php`, visible en local/dev/qa, opcional en staging, ausente en prod — todo por `APP_ENV`.
- **IMPLEMENTATION:** Agregar `zircote/swagger-php` (generador, sin UI); crear ruta `/docs` con gate por ambiente (reemplaza conceptualmente `SwaggerGate.php` actual, adaptado a Lumen).
- **TESTING:** Verificar respuesta 200 en local/dev, 403/404 en producción.
- **SECURITY:** Confirmar que producción nunca expone el JSON ni el HTML, no solo uno de los dos.
- **VALIDATION:** Probar los 4 ambientes (o al menos local + un flag simulando producción).
- **ROLLBACK:** Quitar la ruta si algo falla; no afecta el resto de la API.
- **EVIDENCE:** Capturas de la doc renderizada + prueba de bloqueo en prod.
- **PRIORITY:** MEDIA.

### TASK-104 — Split de `apps/frontend` en `website` (público) sin el admin embebido
- **SOURCE:** REQ-FE-01 (parte 1 de 3)
- **DEPENDENCIES:** TASK-101.
- **CURRENT STATE:** `apps/frontend` mezcla páginas públicas y páginas admin (`AdminDashboardPage`, etc.).
- **TARGET STATE:** `Farutech/website` solo con las páginas públicas; las páginas admin quedan como referencia de extracción para TASK-107 (`admin`), no se copian tal cual.
- **IMPLEMENTATION:** Remover rutas/páginas `Admin*` del bundle de `website`; confirmar que `ContactForm`/`Newsletter`/`Logo`/`JsonLd` siguen intactos (son del sitio público, no del admin).
- **TESTING:** Build de producción exitoso sin referencias rotas a lo removido.
- **VALIDATION:** Smoke test de las páginas públicas principales.
- **ROLLBACK:** El repo original archivado sigue disponible como referencia.
- **PRIORITY:** ALTA.

---

## WAVE 2 — DEPENDEN DE WAVE 1

### TASK-201 — Construir Design System: inventario + reconciliación (Button/Badge) + tokens configurables
- **SOURCE:** REQ-DS-01
- **REPOSITORY:** `Farutech/design-system`
- **DEPENDENCIES:** TASK-101 (repo debe existir).
- **CURRENT STATE:** Componentes dispersos en `dashboard` (45 en `ui/` + CRUD + layout) y `apps/frontend` (`primitives.tsx`, `patterns.tsx`), con estilos hardcodeados en `dashboard`.
- **TARGET STATE:** Paquete único, catálogo completo (ver doc 08), tokens externalizados, sin duplicados de API entre Button/Badge de ambas fuentes.
- **IMPLEMENTATION:** Extraer componente por componente según la tabla del doc 08; para Button/Badge, diseñar una API nueva que cubra ambos casos de uso antes de eliminar cualquiera de las dos versiones originales.
- **TESTING:** Tests unitarios por componente (framework nativo JS/TS, no `framework-automation` — confirmado en REQ-QA-01 que ese framework es solo E2E/API/Performance/Integración).
- **ACCESSIBILITY:** Validar semántica/teclado en los componentes de control como mínimo (Input, Select, Checkbox).
- **PERFORMANCE:** Confirmar tree-shaking (import individual no arrastra el catálogo completo).
- **DOCUMENTATION:** Adaptar las páginas `pages/design-system/*` ya existentes en `dashboard` como base de la documentación viva del paquete.
- **VALIDATION:** Al menos un consumidor real (TASK-104/website o TASK-107/admin) importando y renderizando componentes del paquete.
- **ROLLBACK:** El paquete es aditivo — no rompe nada mientras ninguna app lo consuma todavía.
- **EVIDENCE:** Build del paquete + captura de la documentación viva funcionando.
- **PRIORITY:** ALTA.

### TASK-202 — Publicar Design System en GitHub Packages (público, repo privado)
- **SOURCE:** REQ-DS-02
- **DEPENDENCIES:** TASK-201.
- **IMPLEMENTATION:** Configurar `publishConfig` para visibilidad pública explícita en GitHub Packages, distinta de la visibilidad del repo (confirmado viable en doc 06 §4).
- **VALIDATION:** Instalar el paquete desde una máquina/proyecto sin ningún token configurado, confirmando acceso público real.
- **SECURITY:** Confirmar que no queda ningún dato del repo privado expuesto por accidente en el paquete publicado (ej. archivos de configuración interna).
- **ROLLBACK:** Despublicar versión si se detecta filtración.
- **PRIORITY:** MEDIA.

### TASK-203 — Pantallas de auth reutilizables (Login, Register, ForgotPassword)
- **SOURCE:** REQ-DS-03 / REQ-BE-05
- **DEPENDENCIES:** TASK-201, REQ-FE-02 (SSO — puede empezar sin resolver esto y ajustarse después, según doc 08).
- **CURRENT STATE:** Login+ForgotPassword existen en `dashboard` (a migrar); Register no existe en ningún frontend (solo endpoint de backend).
- **TARGET STATE:** 3 pantallas en el Design System, reciben endpoint/callback por props, sin backend fijo.
- **IMPLEMENTATION:** Migrar Login/ForgotPassword de `dashboard`; construir Register nuevo, conectado al endpoint ya existente en el backend (`register`/`register/confirm`).
- **TESTING:** Test de integración simulando éxito/error de cada pantalla contra un backend mock.
- **VALIDATION:** Conectar contra el backend real (Lumen, post TASK-102) en al menos un ambiente.
- **PRIORITY:** ALTA.

### TASK-204 — Menú horizontal (nuevo)
- **SOURCE:** REQ-DS-04. **DEPENDENCIES:** TASK-201 (mismo repo/convenciones de tokens).
- **CURRENT STATE:** No existe ningún equivalente.
- **IMPLEMENTATION:** Construir desde cero siguiendo las mismas convenciones de tokens/props que el resto del catálogo.
- **PRIORITY:** MEDIA.

---

## WAVE 3 — DEPENDEN DE DESIGN SYSTEM (WAVE 2)

### TASK-301 — Construir `Farutech/admin` desde cero sobre el Design System
- **SOURCE:** REQ-FE-01 (parte 2)
- **DEPENDENCIES:** TASK-201, TASK-203, TASK-102 (necesita el backend real para conectar).
- **CURRENT STATE:** No existe como app final; hay 2 fuentes de referencia (admin embebido en `apps/frontend` viejo, y `dashboard` completo) que se retiran una vez extraído lo útil.
- **TARGET STATE:** App nueva en `admin.farutech.com`, usando componentes del Design System, conectada al backend Lumen real (no demo-auth).
- **IMPLEMENTATION:** Módulos mínimos iniciales: login real, gestión de leads (Contact), gestión de suscriptores + campañas de newsletter (depende de REQ-BE-03, ver TASK-302), configuración de blog (para que `website` lo consuma).
- **SECURITY:** Sin modo demo activado por defecto (corrige F-02) — a diferencia de `dashboard`.
- **TESTING:** E2E con `framework-automation` (su alcance confirmado incluye E2E, REQ-QA-01) para los flujos críticos (login, gestión de leads).
- **VALIDATION:** Smoke test contra backend real en ambiente Dev.
- **ROLLBACK:** `dashboard` sigue disponible como referencia hasta confirmar `admin` funcionando.
- **PRIORITY:** ALTA.

### TASK-302 — Motor de campañas de newsletter (backend + UI en admin)
- **SOURCE:** REQ-BE-03
- **DEPENDENCIES:** TASK-102, TASK-301, **decisión de negocio pendiente: proveedor de email** (no tomada, bloquea el detalle final, no el diseño).
- **CURRENT STATE:** `NewsletterController` solo da de alta suscriptores.
- **TARGET STATE:** Composición de templates + envío individual/por lotes desde `admin`, vía proveedor externo.
- **IMPLEMENTATION:** Pendiente de Specification detallada (no cubierta en este documento — se especifica cuando haya proveedor elegido y se confirme soporte de colas en Lumen).
- **PRIORITY:** MEDIA — no bloquea el resto del plan.

### TASK-303 — `Farutech/intranet` (alcance diferido)
- **SOURCE:** REQ-FE-01 (parte 3)
- **DEPENDENCIES:** TASK-201 (Design System), y **definición de alcance funcional por el owner** (pendiente, doc 03 §4).
- **STATE:** `BLOCKED — esperando definición de alcance`. No se detalla más hasta esa definición.
- **PRIORITY:** BAJA (no bloquea nada del resto).

---

## WAVE 4 — INFRAESTRUCTURA (puede correr en paralelo a Wave 1-3, converge antes de cualquier despliegue real)

### TASK-401 — Manifiestos K3s multi-nodo para Dev (Pi 2B + Pi 4B)
- **SOURCE:** REQ-INF-03. **DEPENDENCIES:** TASK-002 (jerarquía de secrets), TASK-101 (repos ya independientes, cada uno con su propio build/deploy).
- **CURRENT STATE:** Solo hay diseño documentado para 1 nodo (`DEPLOY-PI-K3S.md`), scripts `00-30` sin escribir.
- **TARGET STATE:** Pi 4B como control-plane, Pi 2B como worker con afinidad/límites de recursos ajustados a su capacidad (no correr MySQL ni backend ahí); scripts `00-30` extendidos al caso multi-nodo, uno por repo/servicio (consistente con TASK-101).
- **IMPLEMENTATION:** Unir Pi 2B al clúster K3s del 4B (modo agente); definir `nodeSelector`/`taints` para workloads pesados vs. livianos.
- **TESTING:** Desplegar un workload de prueba en cada nodo y confirmar que respeta los límites asignados.
- **VALIDATION:** Deploy real de `website`+`backend` con `website` con réplica en el Pi 2B.
- **PRIORITY:** ALTA.

### TASK-402 — Re-evaluar Gitea vs. GitHub Actions para CI/CD
- **SOURCE:** REQ-INF-05. **DEPENDENCIES:** TASK-101 (necesita los repos ya en GitHub para evaluar Actions realista).
- **STATE:** Decisión pendiente, no ejecución — este task es "producir la comparación y decidir", no implementar CI todavía.
- **PRIORITY:** MEDIA.

### TASK-403 — Paridad K3s en VPS Hostinger (QA/Staging/Prod)
- **SOURCE:** REQ-INF-04. **DEPENDENCIES:** TASK-401 (reusa el mismo patrón de manifiestos ya probado en Dev).
- **PRIORITY:** MEDIA — posterior a Dev funcionando end-to-end.

### TASK-404 — `framework-automation` como plantilla `dotnet new`
- **SOURCE:** REQ-QA-01. **DEPENDENCIES:** TASK-101 (transferencia del repo a la org).
- **PRIORITY:** MEDIA.

---

## TASK DEPENDENCY GRAPH (resumen visual)

```text
TASK-001 (creds admin) ─────────────────────────────────┐
TASK-002 (secrets)     ──────────────────┐               │
TASK-003 (repos existentes) → TASK-101 (repos nuevos)     │
                                  │                        │
                  ┌───────────────┼───────────────┬────────┴────┐
                  ▼               ▼               ▼             ▼
            TASK-102 (Lumen) TASK-104 (website) TASK-401 (K3s)  TASK-404 (dotnet template)
                  │               
                  ▼               
            TASK-103 (Scalar)     
                  │
    ┌─────────────┴─────────────────────┐
    ▼                                   ▼
TASK-201 (Design System) ──────► TASK-202 (publicar paquete)
    │
    ├──► TASK-203 (auth screens) ──┐
    ├──► TASK-204 (menú horizontal)│
    │                              ▼
    └──────────────────────► TASK-301 (admin) ──► TASK-302 (newsletter campañas)
                                                └─► TASK-303 (intranet, diferido)

TASK-401 ──► TASK-403 (paridad VPS)
TASK-101 ──► TASK-402 (CI/CD: Gitea vs Actions)
```

---

## NEXT ACTION

```text
Con el Master Implementation Plan y su grafo de dependencias listos, según
el prompt maestro lo que sigue es:
  - Quality Gates por tarea (sección 57) y
  - Preliminary GO/NO-GO (sección 78, punto 19) del set de documentos 01-09.

Antes de escribir eso: TASK-003 sigue abierta (qué hacer con el
`Farutech/website` público que ya existe) — no bloquea el resto del plan,
pero sí bloquea específicamente poder ejecutar TASK-101/TASK-104 el día que
decidan pasar de planeación a implementación real.

¿Reviso ya `Farutech/website` (si me compartes su contenido o lo hace
Claude Code con acceso real), o sigo con Quality Gates + GO/NO-GO
preliminar del paquete completo de documentos?
```
