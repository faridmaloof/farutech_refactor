# 12 — CURRENT ARCHITECTURE vs TARGET ARCHITECTURE

---

## A. CURRENT ARCHITECTURE (verificada en código, no supuesta)

```text
github.com/faridmaloof (cuenta personal, repos PÚBLICOS)
│
├── website-farutech/  (monorepo)
│   ├── apps/frontend/   → 1 sola app: sitio público + admin embebido
│   │                        (React 18.3.1, Vite, Tailwind)
│   ├── apps/backend/    → API (working tree: Laravel 10 sin commitear;
│   │                        último commit: Lumen — DOS estados en conflicto)
│   │                        Auth: token custom HMAC (no Sanctum, aunque
│   │                        instalado)
│   └── deployment/docker/, docs/ (3 guías de despliegue K3s/VPS
│         mutuamente inconsistentes, ninguna con scripts reales existentes)
│
├── dashboard/  (repo aparte, NO conectado al backend real)
│   → Admin genérico (CRM/Inventario/Ventas), React 19.2.8
│   → demo-auth activo por defecto, credenciales hardcodeadas en bundle
│   → 45 componentes UI + tokens hardcodeados (no configurables)
│
└── framework-automation/  (repo aparte, sano, sin conflictos)
    → .NET, Screenplay pattern, E2E/API/Performance (parcial)

infrastructure/  (fuera de cualquier repo Git de aplicación, vive suelto
                   en el workspace)
    → docker-compose.yml: MySQL + PostgreSQL + MongoDB + HAProxy gateway
    → Credenciales reales hardcodeadas como default, puertos DB expuestos

github.com/Farutech (organización YA EXISTENTE, con actividad propia,
                       independiente de lo anterior)
    → website (público, activo)
    → Cloud-Platform (público, visión futura)
    → feks-docs (privado)
    → Engineering-Knowledge-System (público)
```

**Lectura clave:** hoy existen **dos universos desconectados** — el trabajo hecho bajo la cuenta personal `faridmaloof` (lo que se auditó a fondo) y la organización `Farutech` real en GitHub, que ya tiene sus propios repos y actividad reciente (`website` actualizado hace 14h) sin relación confirmada con el primero. Esa es la brecha más importante que cierra la arquitectura objetivo.

---

## B. TARGET ARCHITECTURE (especificada en docs 02-11, no implementada todavía)

```text
github.com/Farutech (organización real, repos PRIVADOS)
│
├── website/          → website.farutech.com   (sitio público, Design
│                         System, sin admin embebido)
├── admin/             → admin.farutech.com     (nuevo, construido sobre
│                         el Design System, sin demo-auth, conectado al
│                         backend real; configura blog, recibe leads y
│                         suscriptores, gestiona campañas de newsletter)
├── intranet/          → intranet.farutech.com  (alcance diferido —
│                         solicitudes internas + panel propio o módulo
│                         de admin, TBD)
├── backend/           → api.farutech.com       (Lumen, no Laravel;
│                         auth custom HMAC mantenido; docs vía Scalar,
│                         gated por ambiente)
├── design-system/     → paquete público en GitHub Packages, repo privado;
│                         tokens configurables, catálogo unificado
│                         (Button/Badge reconciliados), pantallas de auth
│                         reutilizables, menú horizontal nuevo
├── infrastructure/    → manifiestos K3s (Dev multi-nodo Pi 2B+4B,
│                         paridad QA/Staging/Prod en VPS Hostinger),
│                         jerarquía Secret→env→default
└── framework-automation/ → transferido desde faridmaloof, alcance
                              E2E+API+Performance+Integración, empaquetado
                              como plantilla dotnet new

Relación funcional entre apps (no solo técnica):
  admin ──configura──> blog, templates de newsletter
  admin ──recibe──────> leads (Contact), suscriptores (Newsletter)
  website ──consume───> lo que admin configura (posts de blog)
  intranet ──consume──> lo que admin configura (alcance exacto TBD)

Todas las apps de frontend consumen el mismo paquete design-system,
así un cambio de diseño se propaga sin reescribir cada app por separado.
```

---

## C. GAPS ENTRE CURRENT Y TARGET (mapeado directo a las tareas del doc 09)

| Gap arquitectónico | Se cierra con |
|---|---|
| Repos públicos bajo cuenta personal → privados bajo `Farutech` | TASK-101 (bloqueada por TASK-003) |
| 1 app con admin embebido → 3 apps por subdominio | TASK-104, TASK-301, TASK-303 |
| Componentes dispersos y duplicados (dashboard vs. apps/frontend) → paquete único | TASK-201, TASK-202 |
| Laravel sin commitear / Lumen desactualizado → Lumen consolidado | TASK-102 |
| Documentación de API rota (l5-swagger, Laravel-only) → Scalar liviano | TASK-103 |
| Credenciales hardcodeadas (admin + infra) → generación dinámica + Secrets | TASK-001, TASK-002 |
| Despliegue K3s solo documentado (1 nodo) → multi-nodo real | TASK-401 |
| Newsletter solo alta de suscriptor → motor de campañas | TASK-302 (parcialmente especificado, depende de GAP-08) |
| `Farutech/website` público ya existente, de origen desconocido | TASK-003 (sin resolver) |

---

## NEXT ACTION

```text
13: QUALITY GATES + RELEASE ROADMAP + PRELIMINARY GO/NO-GO — cierre formal
    del paquete completo de documentos (01-13), tal como exige la sección 78
    del prompt maestro para esta primera ejecución.
```
