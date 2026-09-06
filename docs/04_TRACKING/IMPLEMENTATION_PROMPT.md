# 🤖 PROMPT DE IMPLEMENTACIÓN — Farutech Website Ecosystem (Auditoría 2026-09)

**Uso:** Este documento está diseñado para pegarse directamente como instrucción a un agente de codificación (ej. Claude Code) o para entregarse a un desarrollador humano como brief de trabajo. Cubre la ejecución ordenada de las correcciones y features identificadas en la auditoría del 2026-09-05.

---

## CÓMO USAR ESTE PROMPT

- **Con un agente de codificación:** copia una sección completa (ej. "FASE 14 — TASK-014") como instrucción única por sesión/tarea. No pegues el documento completo de una vez — estas tareas tienen dependencias secuenciales y deben ejecutarse y validarse una por una.
- **Con un desarrollador humano:** usa cada sección como el contenido de un ticket/issue, referenciando el archivo `TASK-XXX.md` y `SPEC/ADR` correspondiente para el detalle completo.
- **Contexto que el agente/desarrollador debe leer primero, siempre:** `docs/00_INDEX.md`, `docs/04_TRACKING/master-plan.md`, y el ADR/SPEC específico de la tarea a ejecutar. Nunca implementar sin haber leído el documento fuente completo — estas instrucciones son un resumen ejecutable, no el reemplazo del detalle funcional.

---

## PROMPT MAESTRO (contexto a incluir siempre)

```
Estás trabajando sobre el repositorio "Farutech Website Ecosystem", un monorepo compuesto por:
- apps/website (frontend React+Vite+TS, backend Laravel 11+PHP 8.2 — en migración desde apps/api, ver ADR-005)
- apps/admin (panel de administración, React+Vite+TS, debe servirse bajo el path /admin del mismo
  dominio del website — nunca por subdominio, ver ADR-006)
- apps/intranet (congelada, no tocar salvo tarea explícita)
- packages/design-system (componentes compartidos, React+TS+Tailwind v4)
- packages/framework-automation (framework de tests .NET/Reqnroll, patrón Screenplay)
- infrastructure/ (docker-compose, gateway HAProxy)

Reglas no negociables:
1. NO inventes requisitos ni tomes decisiones de producto por tu cuenta. Si algo no está definido
   en la SPEC/ADR/TASK correspondiente, detente y pregunta antes de asumir.
2. Toda la documentación vive en docs/ (01_ARCHITECTURE, 02_SPECIFICATIONS, 03_IMPLEMENTATION,
   04_TRACKING). Lee el documento fuente COMPLETO antes de escribir código.
3. El website es un sistema separado de la futura plataforma multi-tenant "platform" (ver ADR-007).
   No mezcles ambos alcances bajo ninguna circunstancia.
4. Cada apps/<nombre> debe permanecer independiente: clonable, compilable y desplegable por
   separado (salvo la fusión específica de apps/api -> apps/website/src/backend, que SÍ está
   decidida en ADR-005).
5. Al terminar una tarea, actualiza el archivo docs/04_TRACKING/tasks/TASK-XXX.md correspondiente
   (marca estado, agrega evidencia) y agrega una línea en docs/04_TRACKING/change-log/CHANGELOG.md.
6. Cero warnings, cero errores. `npm run build` y `dotnet build Framework.Automation.sln` deben
   terminar limpios antes de dar una tarea por cerrada.
7. No elimines ni modifiques Examples/tests/framework-automation/ (es material de referencia,
   no se ejecuta).
```

---

## ORDEN DE EJECUCIÓN

### 🔴 FASE 14 — Corrección de Deuda Técnica (ejecutar primero, en este orden exacto)

#### Paso 1 — TASK-014: Consolidar `apps/api` → `apps/website/src/backend`
```
Lee completo docs/01_ARCHITECTURE/adr/ADR-005_website_backend_consolidation.md y
docs/04_TRACKING/tasks/TASK-014.md.

Ejecuta la migración: mueve apps/api/src/backend a apps/website/src/backend usando git mv
(preserva historial), excluyendo vendor/. Actualiza infrastructure/docker-compose.yml
(build.context del servicio backend). Elimina apps/api/ al final. Actualiza toda referencia
a "apps/api" en README.md, docs/01_ARCHITECTURE/overview.md,
docs/03_IMPLEMENTATION/testing-strategy.md y docs/03_IMPLEMENTATION/coding-standards.md.

No toques todavía Framework.Automation.sln (eso es el siguiente paso, TASK-013).
```

#### Paso 2 — TASK-013: Corregir `Framework.Automation.sln`
```
Lee completo docs/04_TRACKING/tasks/TASK-013.md.

Corrige la ruta del proyecto Framework.Core en Framework.Automation.sln (raíz) de
"tests\framework-automation\..." a "packages\framework-automation\...". Además, dado que
TASK-014 ya se ejecutó, actualiza/renombra el proyecto Farutech.Api.Tests para que apunte a
la nueva ubicación de tests dentro de apps/website/test/. Verifica que TODAS las demás
referencias de proyecto en el .sln correspondan a rutas reales en el filesystem (no asumas,
verifica cada una con el filesystem). Confirma que `dotnet build Framework.Automation.sln`
compila sin errores.
```

#### Paso 3 — TASK-015: Admin bajo path `/admin`
```
Lee completo docs/01_ARCHITECTURE/adr/ADR-006_admin_routing_strategy_v2.md y
docs/04_TRACKING/tasks/TASK-015.md.

Implementa en este orden:
1. apps/admin/src/frontend/vite.config.ts: agrega base: "/admin/"
2. apps/admin/src/frontend/src/main.tsx: envuelve el Router con basename="/admin"
3. apps/admin/src/frontend/src/App.tsx: simplifica las rutas internas quitando el prefijo
   /admin (ya lo aporta el basename). Audita TODO el código de apps/admin/src/frontend/src
   buscando strings "/admin" hardcodeados en Links, redirects o llamadas a localStorage que
   deban ajustarse.
4. infrastructure/gateway/haproxy.cfg: agrega ACL de path (path_beg /admin) enrutando al
   backend admin_backend, manteniendo el resto de reglas existentes intactas.
5. infrastructure/docker-compose.yml: agrega el servicio "admin" (no existe actualmente),
   con un Dockerfile que compile el build de Vite y lo sirva vía Nginx estático.
6. apps/website/src/backend/config/cors.php: simplifica allowed_origins ya que admin y
   website comparten el mismo origen ahora.

Verifica que robots.txt del website mantiene "Disallow: /admin/".
```

#### Paso 4 — TASK-017: Ejecutar consolidación de base de datos
```
Lee completo docs/01_ARCHITECTURE/adr/ADR-004_multi_database_strategy.md (incluye la nota
de re-alcance) y docs/04_TRACKING/tasks/TASK-017.md.

Confirma primero que ningún módulo activo del backend depende de MySQL o MongoDB
(busca en apps/website/src/backend/config/database.php y en cualquier conexión hardcodeada).
Si está confirmado, elimina los servicios mysql, mongodb y phpmyadmin de
infrastructure/docker-compose.yml y su ACL correspondiente en
infrastructure/gateway/haproxy.cfg. Actualiza el estado de ADR-004.md removiendo la nota
"NO EJECUTADO".
```

#### Paso 5 — TASK-016: Cerrar sincronización de documentación
```
Lee docs/04_TRACKING/tasks/TASK-016.md (checklist de pendientes).

Con TASK-014, TASK-015 y TASK-017 ya ejecutados, completa las actualizaciones pendientes de
README.md, docs/03_IMPLEMENTATION/testing-strategy.md y
docs/03_IMPLEMENTATION/coding-standards.md que quedaron marcadas como pendientes en ese
checklist, verificando contra el estado real del código (no copies textualmente el checklist
sin confirmar cada punto contra el filesystem).
```

#### Paso 6 (paralelo, sin dependencias) — TASK-023: Corregir JSON-LD ausente en prerender
```
Lee completo docs/04_TRACKING/tasks/TASK-023.md.

Corrige apps/website/src/frontend/src/components/JsonLd.tsx y/o
apps/website/src/frontend/scripts/prerender.mjs para que los datos estructurados
schema.org queden incluidos en el HTML estático generado por `npm run build:seo`, no solo
inyectados vía useEffect en el navegador. Valida el resultado con curl sobre el HTML generado
(sin ejecutar JS) y con Google Rich Results Test.
```

#### Paso 7 (paralelo, sin dependencias) — TASK-024: Resolver `apps/intranet`
```
Lee completo docs/04_TRACKING/tasks/TASK-024.md.

Esta tarea requiere una DECISIÓN DE PRODUCTO antes de tocar código (retomar / archivar /
eliminar). No ejecutes ninguna acción sobre apps/intranet sin que el Product Owner confirme
explícitamente cuál de las tres opciones aplica.
```

---

### 🟡 FASE 15 — Cierre de Brechas Funcionales (Requisito 6 completo)

> ⚠️ Antes de iniciar TASK-019 y TASK-020, resolver la decisión de `ContentBlockEditor` compartido (ver nota en ambas tareas) — no repartir a desarrolladores distintos sin esa decisión tomada.

#### TASK-018: Admin — Gestión de Mensajes de Contacto
```
Lee completo docs/04_TRACKING/tasks/TASK-018.md.

Implementa ContactMessagesPage en apps/admin/src/frontend siguiendo el patrón ya establecido
por las páginas existentes (Leads, Dashboard). Verifica primero si el ContactController del
backend expone los verbos necesarios (listado paginado, marcar como leído); si no, amplíalo
como parte de esta misma tarea. Reutiliza DataTable, Badge y NotificationPanel del Design
System — no crees componentes nuevos si el Design System ya cubre la necesidad.
```

#### TASK-019: Admin — Newsletter (SPEC-004)
```
Lee completo docs/02_SPECIFICATIONS/SPEC-004_Newsletter_Management.md y
docs/04_TRACKING/tasks/TASK-019.md.

Implementa el módulo completo según la spec: migración de campos faltantes en
newsletter_campaigns, endpoints de campañas/preview/send-test/schedule/send, y el frontend
completo (CampaignEditor con modos Visual/HTML, BlockPalette, PreviewModal, SendTestModal,
SubscribersPage). Sigue al pie de la letra las Reglas de Negocio RB001-RB004 de la spec.
```

#### TASK-020: Admin — Blog CMS (SPEC-005)
```
Lee completo docs/02_SPECIFICATIONS/SPEC-005_Blog_CMS.md y docs/04_TRACKING/tasks/TASK-020.md.

Antes de estimar, resuelve el riesgo abierto de la spec (RB004: cómo un artículo publicado
llega al HTML prerenderizado del website — SSR real vs. rebuild disparado vs. CSR puro).
Escala esta decisión al Technical Lead si no está resuelta; no la tomes unilateralmente dado
su impacto en SEO (requisito 2 del producto).

Implementa el módulo completo: migración de campos SEO en blog_posts, endpoint check-slug,
conexión con PublishScheduledBlogPost existente, y frontend completo (PostEditor, SeoPanel
con preview de Google/OG, CategoryTagManager, PublishControls).
```

#### TASK-021: Opportunity Search — Señales Reales de Negocio (SPEC-002 v1.1)
```
Lee completo docs/02_SPECIFICATIONS/SPEC-002_Opportunity_Search.md (secciones 1-11 originales
Y la sección 16 "Adendo v1.1") y docs/04_TRACKING/tasks/TASK-021.md.

Primero crea las migraciones faltantes: opportunities y scraping_jobs (según las interfaces
definidas en la sección 4 de la spec). Migra FindOpportunitiesJob para que inserte en
opportunities, no directo en leads. Extiende fetchFromGoogleMaps() para consultar también
Place Details (no solo Nearby Search) y poblar hasWebsite/websiteUrl/contactChannels. NO
implementes scraping de LinkedIn sin aprobación legal explícita del equipo — deja
fetchFromLinkedIn() documentado como pendiente de esa decisión si no se ha resuelto. Construye
OpportunitySearchPage y OpportunityCard en el frontend admin, mostrando recommendedService de
forma prominente.
```

#### TASK-022: Mini CRM — Cotizaciones y Tarifas / "Minipos" (SPEC-006)
```
Lee completo docs/02_SPECIFICATIONS/SPEC-006_Quotes_And_Tariff_Management.md y
docs/04_TRACKING/tasks/TASK-022.md.

Este módulo parte de cero. Antes de escribir código, decide la librería de generación de PDF
(dompdf vs snappy/wkhtmltopdf) y documenta la decisión en el propio archivo TASK-022.md.
Implementa las migraciones (tariff_items, tariff_item_versions, quotes, quote_lines), los
endpoints admin y públicos (el endpoint público NO lleva autenticación, usa publicToken
criptográficamente aleatorio — ver RB005), y el frontend completo: TariffsPage,
TariffFormModal, QuotesPage, QuoteBuilder, QuoteTimelinePanel (como pestaña nueva dentro del
detalle de Lead ya existente de SPEC-001), SendQuoteModal, y la vista pública PublicQuoteView.
Sigue estrictamente las Reglas de Negocio RB001-RB006 de la spec, en particular RB001 (control
tarifario auditable) y RB006 (notificación al responder).
```

---

## 🔵 FUERA DE ESTE CICLO (no ejecutar todavía)

La visión de `platform` (SPEC-003) está documentada pero **no es ejecutable aún**. No inicies ningún desarrollo de `apps/platform` a partir de este prompt — requiere primero: stack técnico final confirmado, modelo de datos de Organization/Instance/Application, mecanismo de resolución de tenant, y un ADR de seguridad multi-tenant, todos pendientes según SPEC-003 §9.

---

## ✅ CHECKLIST DE CIERRE GLOBAL (usar al final de cada tarea)

- [ ] `npm run build` (en cada app frontend tocada) termina sin errores ni warnings
- [ ] `dotnet build Framework.Automation.sln` compila
- [ ] Criterios de Aceptación de la SPEC/TASK correspondiente marcados y verificados uno por uno
- [ ] `docs/04_TRACKING/tasks/TASK-XXX.md` actualizado (estado + evidencia)
- [ ] Línea nueva en `docs/04_TRACKING/change-log/CHANGELOG.md`
- [ ] `docs/04_TRACKING/master-plan.md` actualizado si el estado de la fase cambió
- [ ] Ningún requisito de la definición de producto original (los 6 puntos + sub-puntos 6.1-6.5) quedó parcialmente resuelto sin dejarlo documentado explícitamente como riesgo abierto

---

**© 2026 Farutech — Prompt de Implementación v1.0 (2026-09-05)**
