# 📚 Farutech Documentation — Índice Maestro

Bienvenido a la documentación técnica del ecosistema Farutech.

---

## 🧭 Mapa General

```
docs/
├── 00_INDEX.md                      # [Este documento] Índice maestro
├── README.md                        # Resumen ejecutivo y dashboard
│
├── 01_ARCHITECTURE/                 # Arquitectura de Alto Nivel y Decisiones
│   ├── overview.md                  # Visión general técnica del sistema
│   └── adr/                         # Architecture Decision Records (ADRs)
│       ├── ADR-001_admin_routing_strategy.md
│       ├── ADR-002_design_system_structure.md
│       ├── ADR-003_intranet_strategy.md
│       └── ADR-004_multi_database_strategy.md
│
├── 02_SPECIFICATIONS/               # Especificaciones Funcionales y de Dominio (SDD)
│   ├── SPEC-001_Lead_Management.md  # Especificación completa de Leads y MiniCRM
│   └── SPEC-002_Opportunity_Search.md # Búsqueda y scraping de oportunidades
│
├── 03_IMPLEMENTATION/               # Guías para Desarrolladores
│   ├── getting-started.md           # Setup local y primeros pasos
│   ├── coding-standards.md          # Estándares de TypeScript, React y PHP
│   └── testing-strategy.md          # Estrategia de testing (Unit, Integration, E2E)
│
├── 04_TRACKING/                     # Sistema de Gestión y Tareas
│   ├── master-plan.md               # Dashboard consolidado de avance
│   ├── guia-de-uso.md               # Ciclo de vida y reglas de tasks
│   ├── change-log/
│   │   └── CHANGELOG.md             # Registro cronológico de cambios
│   └── tasks/                       # Tareas individuales (TASK-000A a TASK-012)
│
└── 99_ARCHIVE/                      # Auditorías y documentos históricos
```

---

## 🔗 Enlaces Rápidos

- **Dashboard Principal de Tareas:** [Master Plan](04_TRACKING/master-plan.md)
- **Especificación de Leads:** [SPEC-001](02_SPECIFICATIONS/SPEC-001_Lead_Management.md)
- **Especificación de Oportunidades:** [SPEC-002](02_SPECIFICATIONS/SPEC-002_Opportunity_Search.md)
- **Registro de Decisiones (ADRs):** [Directorio ADR](01_ARCHITECTURE/adr/)
- **Historial de Cambios:** [CHANGELOG](04_TRACKING/change-log/CHANGELOG.md)
