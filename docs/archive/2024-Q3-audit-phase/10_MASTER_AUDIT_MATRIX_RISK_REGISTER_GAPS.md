# 10 — MATRIZ MAESTRA DE AUDITORÍA + RISK REGISTER + GAPS (CONSOLIDADO)

Este documento no agrega hallazgos nuevos — consolida en tablas únicas todo lo que quedó disperso entre los documentos 01-09, tal como exige el prompt maestro (secciones 61/65/13).

---

## A. MATRIZ MAESTRA DE AUDITORÍA

| ID | Domain | Element | Historical State | Current State | Evidence | Target Need | Risk | Action | Priority |
|---|---|---|---|---|---|---|---|---|---|
| F-01 | Frontend/Arch | Dos paneles admin (embebido en `apps/frontend` + `dashboard`) | UNKNOWN (sin auditoría histórica) | Confirmados en código, desconectados entre sí | Doc 01 §6 | Un solo `admin` real | HIGH | Construir `Farutech/admin` (TASK-301), retirar ambos orígenes | ALTA |
| F-02 | Security/Frontend | Demo-auth activo por defecto en `dashboard`, credenciales hardcodeadas en bundle | UNKNOWN | Confirmado en código (`demo-auth.service.ts`) | Doc 01 §6 | Sin modo demo en producción | CRITICAL | `dashboard` no se despliega como app (doc 02 §2); extraer componentes vía TASK-201 | CRÍTICA |
| F-03 / R-01 | Infra/Security | Credenciales débiles en `infrastructure/.env.example`, marcadas "no romper" | UNKNOWN | Confirmado en código | Jerarquía Secret→env→default | CRITICAL | TASK-002 | CRÍTICA |
| F-04 | Infra | 3 motores de BD (MySQL+Postgres+Mongo) sin justificación clara | UNKNOWN | Confirmado, sin evidencia de necesidad real | Doc 01 §6 | Justificar o simplificar | HIGH | Pendiente — no se investigó uso real por motor (GAP-01 abajo) | MEDIA |
| F-05 | Backend/Arch | Migración Laravel sin commitear, Sanctum instalado sin usar | UNKNOWN | Confirmado en `git diff` | Volver a Lumen | HIGH → RESUELTO EN DECISIÓN | Especificado en TASK-102 | ALTA |
| F-06 | Frontend/Build | Build de `dashboard` roto (`tsc -b` falla) | UNKNOWN | **Verificado por ejecución real**, no solo lectura | Doc 01 §6 | N/A — `dashboard` se retira como app | LOW (ya no aplica, doc 02 §2) | Ninguna — no se invierte en arreglarlo | — |
| F-07 | Testing | PHPUnit/`framework-automation`: estado real de ejecución no reproducible en este entorno | Reportado como "100% pass" / "producción" en docs propios de cada repo | `UNKNOWN` — no se pudo ejecutar (sin `vendor/`, sin `dotnet`) | Doc 01 §6 | Ejecutar en entorno con dependencias reales | MEDIUM | Pendiente — requiere Claude Code local o CI real | MEDIA |
| F-08 | Frontend | React 18 (`website`) vs React 19 (`dashboard`) | UNKNOWN | Confirmado | Definir rango compatible en Design System | LOW/MEDIUM | Doc 08 — decisión pendiente de alineación | MEDIA |
| F-09 (docs) | Infra/Deployment | 3 documentos de despliegue K3s/VPS mutuamente inconsistentes, ninguno coincide con el filesystem real | UNKNOWN | Confirmado leyendo los 3 documentos + `git log` | Un solo diseño vigente, multi-nodo | HIGH | TASK-401 | ALTA |
| F-10 (R-09) | Security | `AdminUserSeeder.php` con passwords fijas en texto plano | Auto-reportado en `DEPLOY-PI-K3S.md` | **Confirmado abriendo el archivo directamente** | Generación dinámica | CRITICAL | TASK-001 | CRÍTICA |
| F-11 | Repos/Github | Organización `Farutech` — inicialmente asumida inexistente | El prompt maestro original la daba por hecho | **Verificada en vivo:** existe, creada 2026-07-10, con repos propios (`website`, `Cloud-Platform`, `feks-docs`, `Engineering-Knowledge-System`) | Migrar los repos reales ahí | — (se convirtió en decisión, no riesgo) | TASK-101, TASK-003 | ALTA |
| F-12 | Repos | `Farutech/website` público ya existe, actualizado hace 14h — colisiona con el repo destino planeado | UNKNOWN | Confirmado por el owner vía `gh repo list` | Investigar contenido antes de decidir | MEDIUM (bloquea una tarea puntual, no todo el plan) | TASK-003 abierta | ALTA |

---

## B. RISK REGISTER (consolidado, con estado actualizado)

| Risk ID | Riesgo | Evidencia | Severidad | Estado actual |
|---|---|---|---|---|
| R-01 | Credenciales de infraestructura débiles/reutilizadas | Doc 01 F-03 | CRITICAL | Plan definido (TASK-002), no ejecutado |
| R-02 | Login demo activo por defecto en `dashboard` | Doc 01 F-02 | CRITICAL | Mitigado por decisión de no desplegar `dashboard` (doc 02) — persiste solo si alguien lo despliega igual antes de retirarlo |
| R-03 | Dos admins desconectados | Doc 01 F-01 | HIGH | Plan definido (TASK-301), no ejecutado |
| R-04 | Build de `dashboard` roto | Doc 01 F-06 | LOW | Sin acción — ya no se usa como app final |
| R-05 | Migración Laravel sin commitear, riesgo de pérdida de trabajo | Doc 01 F-05 | HIGH | Plan definido (TASK-102), no ejecutado — **sigue siendo riesgo real hasta que se commitee o migre**, el working tree puede perderse por accidente en cualquier momento |
| R-06 | Sanctum instalado sin usar | Doc 01 F-05 | LOW | Se resuelve junto con TASK-102 |
| R-07 | 3 motores de BD sin justificación | Doc 01 F-04 | HIGH | **Sin plan todavía** — GAP-01 |
| R-08 | Sin revocación server-side del token admin custom | Doc 01 F-05 | MEDIUM | Sin plan — no se ha especificado si se requiere en esta fase |
| R-09 | Passwords admin hardcodeadas | Doc 05 | CRITICAL | Plan definido (TASK-001), no ejecutado |
| R-10 (nuevo) | `Farutech/website` público ya existe con actividad reciente (14h), naturaleza desconocida | Este documento, doc 09 TASK-003 | MEDIUM | Sin resolver — bloquea TASK-101/104 específicamente |
| R-11 (nuevo) | El working tree Laravel (R-05) y el repo público `Farutech/website` recién actualizado (R-10) podrían estar relacionados — no se ha confirmado si alguien ya empezó a migrar por su cuenta | Inferencia razonable, no evidencia directa — marcado explícitamente como **hipótesis, no hecho** | — | `UNKNOWN`, a confirmar revisando el contenido real de `Farutech/website` |

---

## C. GAPS CONSOLIDADOS

```text
GAP-01 — Uso real de los 3 motores de BD (MySQL/Postgres/Mongo) no investigado;
         no se sabe si Lumen usa los 3 o si 2 de ellos son residuales.
GAP-02 — Ejecución real de PHPUnit y de dotnet build/test — no reproducible
         en este entorno (sin vendor/, sin dotnet instalado, sin acceso a
         Packagist/NuGet).
GAP-03 — Auditoría de accesibilidad, performance real (Core Web Vitals) y SEO
         en runtime — no ejecutada, requiere sitio desplegado o navegador
         headless, no disponible en este entorno.
GAP-04 — Auditoría histórica real (C:\Users\farid\Downloads\files (1)) —
         nunca fue proporcionada en ninguna sesión; la Fase de Reconciliación
         Histórica del prompt maestro (sección 47) sigue sin ejecutarse.
GAP-05 — Contenido real de Farutech/website (público, actualizado hace 14h) —
         no inspeccionado, bloquea TASK-003/101/104.
GAP-06 — Contenido de Farutech/Engineering-Knowledge-System — el owner indicó
         que no aplica a este trabajo, se deja constancia pero sin
         investigar más, por instrucción directa.
GAP-07 — Alcance funcional de intranet.farutech.com — diferido por el owner.
GAP-08 — Proveedor de email para newsletter — decisión de negocio pendiente.
GAP-09 — Soporte de colas (queues) en Lumen para envío de newsletter en
         background — no verificado.
GAP-10 — Decisión SSO vs. re-login entre website/admin/intranet — pendiente.
GAP-11 — Gitea vs. GitHub Actions para CI/CD — pendiente de decisión
         (TASK-402).
GAP-12 — Alineación de versión de React (18 vs 19) entre apps consumidoras
         del Design System — pendiente.
```

---

## D. LO QUE ESTE PAQUETE DE DOCUMENTOS **NO** CUBRE (honestidad explícita, no se inventa)

Siguiendo la regla `NO SUPONGAS` del prompt maestro, se deja constancia explícita de lo que **no se ejecutó en ninguna sesión** y por tanto no puede aparecer como "verificado" en ningún documento de este paquete:

```text
- UX/UI FINDINGS runtime (jerarquía visual, CTAs, journeys reales del sitio
  en vivo) — solo se auditó código estático, no la experiencia real navegando
  el sitio desplegado.
- PERFORMANCE BASELINE real (LCP/CLS/INP, latencia P95 de API) — no hay
  entorno corriendo para medir.
- ACCESSIBILITY audit real (lectores de pantalla, contraste real renderizado).
- SEO audit runtime (robots.txt real, sitemap real, resultado de Search
  Console).
- OBSERVABILITY (logging estructurado, métricas, alertas) — no auditado.
- HISTORICAL RECONCILIATION (GAP-04) — bloqueada por falta de insumo.
```

Estos quedan como trabajo pendiente explícito, no como "aprobado" ni "no aplica" — simplemente no se hizo, y este documento lo declara así en vez de omitirlo.

---

## NEXT ACTION

```text
Sigo con:
  11: ARCHITECTURE DECISION RECORDS (formalizando las decisiones ya tomadas
      en formato ADR: Context/Decision/Alternatives/Consequences/Reason)
  12: CURRENT ARCHITECTURE vs TARGET ARCHITECTURE (consolidado visual)
  13: QUALITY GATES + RELEASE ROADMAP + PRELIMINARY GO/NO-GO (cierre del
      paquete de 13 documentos)
```
