# ADR-008 — Admin integrado al Website y servido bajo `/admin`

**Fecha:** 2026-09-07  
**Estado:** ✅ ACEPTADO — reemplaza la interpretación arquitectónica de ADR-006  
**Responsable:** Technical Lead / Product Owner

## Contexto

La decisión de producto vigente establece que el panel administrativo debe formar parte de la misma superficie del Website y ser accesible exclusivamente mediante `<dominio>/admin`.

Durante la reconciliación documental se detectó una contradicción importante: ADR-006 formalizaba `/admin`, pero mantenía `apps/admin` como aplicación Vite independiente y proponía enrutarla desde un gateway. Esa solución cumple la URL, pero **no cumple la decisión posterior de ownership arquitectónico**: el Admin debe vivir dentro de `apps/website`, no como una aplicación objetivo separada.

## Decisión

El Admin será un módulo del Website Ecosystem y su código fuente vivirá dentro de `apps/website`.

La arquitectura objetivo es:

```text
apps/
└── website/
    ├── src/
    │   ├── frontend/       # Website público + módulo/rutas Admin
    │   └── backend/        # Laravel API para Website + Admin
    └── ...

packages/
├── design-system/
└── framework-automation/
```

La entrada pública será:

```text
https://<dominio>/
https://<dominio>/admin
```

No existirá `admin.<dominio>` como ruta arquitectónica soportada.

## Implicaciones

### Frontend

- El Admin debe integrarse en el frontend de `apps/website` mediante rutas `/admin/*`.
- No crear un segundo SPA objetivo bajo `apps/admin`.
- El router, lazy loading, guards y componentes administrativos deben pertenecer al frontend del Website.
- El Design System compartido seguirá viviendo en `packages/design-system`.
- Las rutas Admin deben quedar claramente separadas a nivel de módulo (`features/admin`, `routes/admin` o estructura equivalente), sin mezclar responsabilidades de dominio con las páginas públicas.

### Backend

- Toda funcionalidad backend del Admin permanece dentro de `apps/website/src/backend`.
- No crear `apps/admin/src/backend` ni un backend separado para el panel.
- La autenticación/autorización debe tratarse como capacidad del backend del Website, con controles de rol/permiso explícitos.

### Infraestructura

- El gateway debe enrutar el Website completo al servicio de `apps/website`.
- No es necesario un backend/container independiente para Admin únicamente por el hecho de usar `/admin`.
- Si en el futuro se requiere separación de despliegue por razones de escala o seguridad, deberá existir un ADR nuevo que justifique el cambio y preserve la URL pública `/admin`.

### Legacy

`apps/admin` y los documentos históricos que lo describen pueden conservarse temporalmente como evidencia de migración, pero **no forman parte de la arquitectura objetivo**.

La migración debe:

1. identificar código reutilizable;
2. trasladar/integrar el módulo en `apps/website`;
3. adaptar imports, rutas, configuración y tests;
4. validar `/admin` end-to-end;
5. eliminar la dependencia operativa de `apps/admin`;
6. mantener los documentos históricos en `docs/99_ARCHIVE` con estado explícito de legacy/superseded.

## Relación con ADRs anteriores

- **ADR-001:** permanece `SUPERSEDED`; la estrategia de subdominio queda descartada.
- **ADR-005:** permanece vigente; el backend está consolidado en `apps/website/src/backend`.
- **ADR-006:** queda **SUPERSEDED por este ADR** respecto a la decisión de ownership/topología del Admin. La parte histórica de `/admin` se conserva para trazabilidad.
- **ADR-007:** permanece vigente para separar el futuro `platform` del Website Ecosystem.

## Criterios de arquitectura

Una implementación solo se considera alineada cuando:

- [ ] `/admin` funciona en el mismo dominio.
- [ ] El código objetivo del Admin está dentro de `apps/website`.
- [ ] El backend Admin está dentro de `apps/website/src/backend`.
- [ ] No existe dependencia operativa de `apps/admin`.
- [ ] No existe routing objetivo por `admin.<dominio>`.
- [ ] Tests E2E/API/integration cubren el flujo administrativo relevante.
- [ ] Documentación, tareas y changelog reflejan la topología real.

## Motivo

Esta decisión reduce duplicación de aplicaciones, evita mantener dos ciclos de frontend para la misma superficie de producto y mantiene coherencia entre la URL, el ownership del código y el backend consolidado.

---

**Próxima acción:** ejecutar TASK-025 — Integración/migración del Admin al Website.
