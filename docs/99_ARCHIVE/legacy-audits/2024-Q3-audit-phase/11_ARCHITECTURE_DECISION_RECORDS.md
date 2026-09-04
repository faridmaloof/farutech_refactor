# 11 — ARCHITECTURE DECISION RECORDS (ADR)

Formaliza en el formato exigido por el prompt maestro (sección 50: Context / Decision / Alternatives / Consequences / Reason) las decisiones ya tomadas a lo largo de los documentos 01-10. No se introduce ninguna decisión nueva aquí — solo se formaliza lo ya acordado.

---

## ADR-001 — Framework del backend: Lumen (no Laravel)

**Context:** El working tree actual tenía una migración completa y sin commitear a Laravel 10 (con Sanctum instalado pero nunca invocado en código real). El owner priorizó menor huella/overhead para una API pura.

**Decision:** El backend se construye/mantiene sobre Lumen. Se descartan `laravel/framework`, `laravel/sanctum`, `laravel/tinker`, `laravel/pint`, `laravel/sail`, `spatie/laravel-ignition`. La documentación de API se sirve con `zircote/swagger-php` (generador) + Scalar vía CDN (UI), no con `l5-swagger`.

**Alternatives considered:**
- *Mantener Laravel* (el trabajo ya estaba hecho y funcionando) — descartado por overhead innecesario para una API sin vistas, confirmado por el propio `routes/web.php` actual ("no hay rutas web propias").
- *Lumen + Sanctum vía paquete de comunidad* (`xaamin/sanctum`) — descartado: 1 star, 0 dependents en Packagist, no es una base razonable para un sistema "muy profesional".
- *Lumen + `swagger-lume`* para documentación — viable pero con más peso de Composer que la alternativa elegida.

**Consequences:** Se mantiene el auth custom HMAC ya implementado (no se gana nada estandarizado de Sanctum, pero tampoco se pierde nada porque nunca se usó). Los controllers/modelos/tests ya escritos migran sin reescritura funcional (verificado que no dependen de nada Laravel-only). Riesgo residual: si en el futuro se necesita algo que solo Laravel completo ofrece de forma madura, habría que revisitar esta decisión.

**Reason:** Evidencia técnica (doc 03 §1) + prioridad explícita de performance del owner.

---

## ADR-002 — Documentación de API: `zircote/swagger-php` + Scalar (sin `l5-swagger` ni `swagger-lume`)

**Context:** Se requiere documentación OpenAPI visible solo en local/dev/qa (staging opcional), minimizando peso de dependencias.

**Decision:** Generar el JSON de OpenAPI con `zircote/swagger-php` (dependencia liviana, sin UI) y servir la interfaz visual con Scalar cargado desde CDN en una sola ruta HTML estática — cero paquetes de Composer adicionales para la UI.

**Alternatives considered:**
- `l5-swagger` — descartado, es Laravel-only (incompatible con ADR-001).
- `swagger-lume` — viable, pero agrega un paquete completo con su propio service provider y assets de swagger-ui embebidos (~500KB); más peso del necesario.

**Consequences:** El gate por ambiente (`SwaggerGate.php` actual) debe reimplementarse de forma más simple sobre la nueva ruta, condicionado por `APP_ENV`. La documentación viva depende de un servicio de terceros (CDN de Scalar) — riesgo bajo pero real si el CDN cae; se puede mitigar auto-hospedando el bundle JS de Scalar más adelante si se vuelve un problema.

**Reason:** Investigación técnica solicitada explícitamente por el owner (doc 03 §2).

---

## ADR-003 — Design System como repositorio independiente, no carpeta dentro de un monorepo

**Context:** El owner necesita un paquete de componentes reutilizable, con dueño y ciclo de release propios, publicable y "encargable a un equipo".

**Decision:** `Farutech/design-system` vive como repo propio (privado), publicado como paquete con visibilidad **pública** en GitHub Packages.

**Alternatives considered:**
- `packages/design-system` dentro de un monorepo de apps — descartado porque generaría acoplamiento de CI/release entre el Design System y las apps que lo consumen, justo lo que se quiere evitar (doc 05 §2.5).

**Consequences:** Requiere gestionar versionado SemVer y compatibilidad de peer dependencies (ej. React 18 vs 19 entre consumidores, GAP-12) de forma más disciplinada que si viviera en el mismo repo que sus consumidores.

**Reason:** Cumple los criterios del prompt maestro sección 13 (reusabilidad, API estable, múltiples consumidores, versionado y ownership independientes) — todos verificados como aplicables en este caso.

---

## ADR-004 — Topología de repos: independientes por app/servicio, no monorepo

**Context:** Cada solución (website, admin, intranet, backend, design-system, infrastructure, framework-automation) será responsabilidad de un equipo distinto; se busca que nadie necesite clonar todo el ecosistema para tocar una parte.

**Decision:** 7 repositorios independientes bajo `github.com/Farutech`, todos privados: `website`, `backend`, `admin`, `intranet`, `design-system`, `infrastructure`, `framework-automation`.

**Alternatives considered:**
- *Monorepo* (`apps/website`, `apps/admin`, `apps/intranet` dentro de un solo repo, que era la organización ya existente en el código actual) — era la recomendación inicial con la evidencia disponible en el doc 05, pero quedó descartada al confirmar el owner la necesidad real de acceso Git granular por equipo (doc 06 §2).

**Consequences:** Más repos que mantener (más CI/CD, más superficie de configuración), mitigado porque el Design System ya resuelve la reutilización de UI entre ellos, que era el principal argumento a favor de mantenerlos juntos. La migración requiere `git filter-repo`/`subtree split` para preservar historial (doc 06 §3), no un simple copy-paste.

**Reason:** Confirmación explícita del owner + verificación real de que la organización destino existe (`github.com/Farutech`, creada 2026-07-10).

---

## ADR-005 — `dashboard` no se despliega como app; se usa solo como fuente de extracción

**Context:** `dashboard` tiene modo demo activado por defecto con credenciales hardcodeadas en el bundle cliente (hallazgo CRITICAL, F-02) y no está conectado al backend real, pero contiene el catálogo más completo de componentes UI existente.

**Decision:** No se invierte en arreglar `dashboard` como aplicación. Se extraen sus componentes hacia `Farutech/design-system` (doc 04 Parte B) y luego se archiva el repo original.

**Alternatives considered:**
- *Arreglar las credenciales demo y desplegar `dashboard` tal cual como el admin definitivo* — descartado explícitamente por el owner: el objetivo es extraer y reemplazar, no mantener esta app con su alcance actual de CRM/Inventario/Ventas genérico, que no corresponde al sitio corporativo de Farutech.

**Consequences:** F-02 (CRITICAL) se resuelve por retiro, no por remediación directa — pero solo mientras nadie despliegue `dashboard` en el ínterin; se documenta como riesgo residual en el Risk Register (doc 10, R-02).

**Reason:** Decisión explícita del owner (doc 02 §2).

---

## ADR-006 — Jerarquía de configuración: Secret → `.env` → default explícito

**Context:** `infrastructure/.env.example` actual tiene credenciales reales marcadas como "no romper", es decir, en uso real, no solo de ejemplo.

**Decision:** Toda variable sensible se resuelve primero desde un mecanismo de Secrets (K3s Secret en Dev/QA/Staging/Prod), con fallback documentado a `.env`, y ningún valor real como default — los defaults se dejan solo como placeholders que fuerzan fallo explícito fuera de Local.

**Alternatives considered:**
- *Mantener defaults reales "por si acaso"* (estado actual) — descartado, es exactamente el hallazgo de seguridad que se corrige.

**Consequences:** Requiere disciplina operativa: cualquier ambiente nuevo debe tener su Secret/`.env` configurado antes de arrancar, o el sistema debe rechazar arrancar (comportamiento a implementar en TASK-002).

**Reason:** Confirmación del owner (doc 02 §3), consistente con la sección 24 del prompt maestro (seguridad de secretos/defaults).

---

## ADR-007 — Despliegue en 3 ambientes con K3s como denominador común (Local Docker / Dev Pi multi-nodo / QA-Staging-Prod VPS)

**Context:** Existen 3 realidades de infraestructura distintas y ya en uso: Docker local, un servidor propio (Raspberry Pi 2B+4B), y un VPS de Hostinger.

**Decision:** Local se mantiene en Docker Compose (más simple para ese caso). Dev y QA/Staging/Prod usan K3s, buscando el mismo patrón de despliegue en ambos para minimizar "funciona en Dev pero no en Prod".

**Alternatives considered:** Ninguna alternativa reemplaza esto — es una decisión de negocio basada en infraestructura física ya existente, no una elección de arquitectura en abstracto.

**Consequences:** Los documentos de despliegue K3s existentes (`DEPLOY-PI-K3S.md`) solo cubrían 1 nodo — se requiere trabajo adicional real (TASK-401) para el caso multi-nodo con hardware heterogéneo (Pi 2B mucho más limitado que el 4B).

**Reason:** Confirmación del owner (doc 02 §4), con alineación verificada con la documentación ya existente en el propio repo (doc 04 Parte A.3).

---

## RESUMEN — DECISIONES QUE QUEDAN PENDIENTES DE ADR (no se puede formalizar todavía)

```text
- SSO vs. re-login entre website/admin/intranet (GAP-10) — falta la decisión
  misma antes de poder documentarla como ADR.
- Gitea vs. GitHub Actions para CI/CD (GAP-11) — TASK-402 aún no produce
  la comparación final.
- Proveedor de email para newsletter (GAP-08) — decisión de negocio, no
  arquitectónica en sí, pero condiciona el ADR de "motor de campañas".
- Qué hacer con Farutech/website (público, ya existente) — GAP-05/TASK-003,
  bloquea saber si hace falta un ADR de "reconciliación" adicional.
```
