# 📚 Farutech Documentation — Índice Maestro

Bienvenido a la documentación técnica del **Website Ecosystem** de Farutech.

> ⚠️ Esta documentación cubre el sitio web público + su panel de administración (`/admin`). La futura plataforma multi-tenant (`platform`) tiene su propio documento de visión ([SPEC-003](02_SPECIFICATIONS/SPEC-003_Platform_Vision.md)) y su propio ADR de separación de alcance ([ADR-007](01_ARCHITECTURE/adr/ADR-007_platform_scope_separation.md)) — no confundir ambos alcances.

---

## 🧭 Mapa General

```
docs/
├── 00_INDEX.md                      # [Este documento] Índice maestro
├── README.md                        # Resumen ejecutivo y dashboard
│
├── 01_ARCHITECTURE/                 # Arquitectura de Alto Nivel y Decisiones
│   ├── overview.md                  # Visión general técnica del sistema (Website Ecosystem)
│   └── adr/                         # Architecture Decision Records (ADRs)
│       ├── ADR-001_admin_routing_strategy.md         # ⚠️ SUPERSEDED por ADR-006
│       ├── ADR-002_design_system_structure.md
│       ├── ADR-003_intranet_strategy.md
│       ├── ADR-004_multi_database_strategy.md        # ⚠️ Decidido, no ejecutado (TASK-017)
│       ├── ADR-005_website_backend_consolidation.md  # 🆕 apps/api → apps/website/src/backend
│       ├── ADR-006_admin_routing_strategy_v2.md      # 🆕 Admin bajo path /admin (vigente)
│       └── ADR-007_platform_scope_separation.md      # 🆕 Website vs. futura Platform
│
├── 02_SPECIFICATIONS/               # Especificaciones Funcionales y de Dominio (SDD)
│   ├── SPEC-001_Lead_Management.md          # Mini CRM de Leads
│   ├── SPEC-002_Opportunity_Search.md       # Búsqueda de oportunidades (v1.1 con señales reales de negocio)
│   ├── SPEC-003_Platform_Vision.md          # 🆕 Visión futura de Platform (no ejecutable aún)
│   ├── SPEC-004_Newsletter_Management.md    # 🆕 Newsletter con editor Visual/HTML
│   ├── SPEC-005_Blog_CMS.md                 # 🆕 Blog CMS con SEO completo
│   └── SPEC-006_Quotes_And_Tariff_Management.md  # 🆕 Cotizaciones + control tarifario ("minipos")
│
├── 03_IMPLEMENTATION/               # Guías para Desarrolladores
│   ├── getting-started.md           # Setup local y primeros pasos (rutas corregidas)
│   ├── coding-standards.md          # Estándares de TypeScript, React y PHP
│   └── testing-strategy.md          # Estrategia de testing (Unit, Integration, E2E)
│
├── 04_TRACKING/                     # Sistema de Gestión y Tareas
│   ├── master-plan.md               # Dashboard consolidado de avance (actualizado con FASE 14-15)
│   ├── guia-de-uso.md               # Ciclo de vida y reglas de tasks
│   ├── SDD_MASTER_PROMPT.md         # 🆕 Prompt maestro de implementación (Spec-Driven Development) — VIGENTE
│   ├── IMPLEMENTATION_PROMPT.md     # ⚠️ SUPERSEDED por SDD_MASTER_PROMPT.md (referencia histórica)
│   ├── change-log/
│   │   └── CHANGELOG.md             # Registro cronológico de cambios
│   └── tasks/                       # Tareas individuales (TASK-000A a TASK-026)
│
└── 99_ARCHIVE/                      # Auditorías y documentos históricos
```

---

## 🔗 Enlaces Rápidos

- **Dashboard Principal de Tareas:** [Master Plan](04_TRACKING/master-plan.md)
- **Especificación de Leads:** [SPEC-001](02_SPECIFICATIONS/SPEC-001_Lead_Management.md)
- **Especificación de Oportunidades:** [SPEC-002 v1.1](02_SPECIFICATIONS/SPEC-002_Opportunity_Search.md)
- **Visión de Platform (futuro):** [SPEC-003](02_SPECIFICATIONS/SPEC-003_Platform_Vision.md)
- **Newsletter:** [SPEC-004](02_SPECIFICATIONS/SPEC-004_Newsletter_Management.md)
- **Blog CMS:** [SPEC-005](02_SPECIFICATIONS/SPEC-005_Blog_CMS.md)
- **Cotizaciones y Tarifas:** [SPEC-006](02_SPECIFICATIONS/SPEC-006_Quotes_And_Tariff_Management.md)
- **Registro de Decisiones (ADRs):** [Directorio ADR](01_ARCHITECTURE/adr/)
- **Historial de Cambios:** [CHANGELOG](04_TRACKING/change-log/CHANGELOG.md)
- **🚀 Prompt de Implementación (VIGENTE):** [SDD Master Prompt](04_TRACKING/SDD_MASTER_PROMPT.md)

---

## 🆕 Novedades de esta Actualización (2026-09-05)

Se incorporó una auditoría técnica completa que identificó brechas entre la documentación/decisiones previas y el código real, y brechas entre el código real y la definición completa de producto (los 6 puntos originales, incluidos sus 5 sub-puntos). Resultado:

- **3 ADRs nuevos** (ADR-005, ADR-006, ADR-007) que resuelven contradicciones detectadas (admin por subdominio vs. path; backend separado vs. consolidado; ausencia total de visión de plataforma futura)
- **1 ADR marcado como superseded** (ADR-001) y **1 ADR marcado como no ejecutado** (ADR-004)
- **4 especificaciones nuevas** (SPEC-003 a SPEC-006) que cubren brechas funcionales del requisito 6 (Newsletter, Blog, Cotizaciones/Tarifas, Visión de Platform)
- **1 adendo** a SPEC-002 (v1.1) corrigiendo el modelo de datos faltante y agregando señales reales de detección de negocio
- **14 tareas nuevas** (TASK-013 a TASK-026) organizadas en dos fases nuevas: FASE 14 (deuda técnica) y FASE 15 (cierre de brechas funcionales de los 6 requisitos, no solo del punto 6)
- **1 prompt maestro SDD** (`SDD_MASTER_PROMPT.md`) con metodología Spec-Driven Development explícita y matriz de trazabilidad que verifica que ningún punto de la definición de producto original quedó sin documento fuente ni tarea asociada

Usar `docs/04_TRACKING/SDD_MASTER_PROMPT.md` para retomar este trabajo con un equipo de desarrollo o un agente de codificación — es el documento vigente (el `IMPLEMENTATION_PROMPT.md` anterior queda como referencia histórica).
