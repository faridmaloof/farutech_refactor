# 08 — SPECIFICATION: DESIGN SYSTEM (`Farutech/design-system`)

Cubre REQ-DS-01 a REQ-DS-05 del doc 07, con el formato que exige el prompt maestro (sección 52): Objective, Scope, Functional/Non-functional Requirements, Architecture, Dependencies, Data Model (N/A aquí), Security, Performance, Accessibility, Acceptance Criteria, DoD.

---

## OBJECTIVE

Un único sistema de componentes UI, versionado y publicado, consumido por `website`, `admin` e `intranet` (cuando exista), que permita que un cambio de diseño se aplique en un solo lugar en vez de repetirse — y que sirva de base a un futuro editor visual (WYSIWYG) para personas sin conocimiento técnico.

## SCOPE

**Incluye:** componentes de UI puros (controles, layout, feedback, CRUD compuesto), tokens de diseño (color/tipografía/espaciado), temas configurables, pantallas de autenticación reutilizables (Login/Register/ForgotPassword).

**No incluye (fuera de este paquete):** lógica de negocio específica de cada app (CRM, Inventario, Ventas — esos módulos de `dashboard` no se migran, son ejemplos de "cómo se usa" el sistema, no parte de él — doc 04 Parte B.1), el editor WYSIWYG en sí (es visión futura, doc 02 §8), la implementación de SSO (REQ-FE-02, se especifica aparte cuando esté decidido).

## FUNCTIONAL REQUIREMENTS

1. **Catálogo de componentes** (origen y destino, según inventario real del doc 04 Parte B):

| Categoría | Componentes | Origen |
|---|---|---|
| Controles/formulario | Button, ButtonGroup, Checkbox, RadioGroup, Switch, Select, Input, Textarea, MaskedInput, PhoneInput, TagInput, DatePicker, Form | `dashboard` |
| Datos/listas | DataTable, Charts, StatsCard, ListBox, ListGroup, Scheduler, Stepper, ProgressBar, + CrudActions/CrudFilters/CrudPagination/CrudTable | `dashboard` |
| Feedback/overlay | Alert, Toast, Tooltip, Modal, Drawer, NotificationPanel, Skeleton, Spinner, Loading, EmptyState | `dashboard` |
| Navegación/estructura | Breadcrumb, Tabs, Dropdown, CommandPalette, Carousel, Divider, Avatar, Badge, IconRenderer | `dashboard` |
| Layout | Sidebar (menú vertical), Navbar, MainLayout, RequireAuth | `dashboard` |
| Layout nuevo | **Menú horizontal** (no existe en ningún lado — REQ-DS-04, se construye desde cero) | — |
| Marketing/contenido | Reveal (scroll animation), Eyebrow, SectionHeading, StatusBadge | `apps/frontend` |
| Auth screens | Login, ForgotPassword (existen), Register (no existe, REQ-BE-05/DS-03) | `dashboard` (2 de 3) |

2. **Reconciliación obligatoria antes de migrar** (no copiar y pegar ambas versiones): `Button` y `Badge`/`Tag` existen en ambas fuentes con implementaciones distintas — se define una sola API que cubra los casos de uso de ambas, no dos componentes con el mismo nombre.

3. **Tokens configurables:** color, tipografía, espaciado, radios, sombras — expuestos como variables (CSS custom properties o equivalente), no valores fijos en cada componente (corrige el defecto actual de `dashboard`, confirmado por el propio owner: "los estilos están quemados").

4. **Sistema de temas:** al menos un mecanismo para que cada app consumidora (`website`, `admin`, `intranet`) pueda aplicar su propia paleta/tipografía sin fork del paquete.

5. **Documentación viva:** reutilizar como base las páginas ya existentes en `dashboard/pages/design-system/` (`TokensPage`, `ColorsPage`, `ComponentsLibraryPage`, `ChartsLibraryPage`, `TypographyPage`) en vez de introducir una herramienta nueva (Storybook u otra) sin evaluar antes si estas páginas ya cubren la necesidad — evita overengineering (prompt maestro sección 75).

## NON-FUNCTIONAL REQUIREMENTS

- **Versionado independiente** vía SemVer, publicado en GitHub Packages (npm registry de GitHub) con visibilidad **pública** (REQ-DS-02), repo fuente privado.
- **Compatibilidad de versión de React:** hoy `apps/frontend` usa React 18.3.1 y `dashboard` usa React 19.2.8 (doc 01 F-08) — el paquete debe declarar un rango de peerDependency que cubra ambas, o forzar una decisión de alineación de versión en las apps consumidoras. **Se deja como decisión explícita pendiente para la fase de implementación**, no se resuelve aquí.
- **Sin dependencias de negocio:** el paquete no debe importar nada específico de Farutech (branding sí vía tokens, lógica de negocio no).

## ARCHITECTURE

```text
Farutech/design-system/
├── src/
│   ├── tokens/          (color, typography, spacing — configurables)
│   ├── components/      (catálogo de la tabla de arriba, uno por carpeta)
│   ├── auth-screens/     (Login, Register, ForgotPassword — reciben endpoint por props)
│   └── index.ts
├── docs/ (o reutilización de las páginas design-system ya existentes, adaptadas)
└── package.json  (publishConfig apuntando a GitHub Packages, público)
```

Las pantallas de auth (REQ-DS-03) **no llaman directamente a ningún backend fijo** — reciben la URL/función de submit por props, para que cada app (website/admin/intranet) las conecte a su propio endpoint sin fork.

## DEPENDENCIES

- REQ-REPO-01 (el repo debe existir antes de empezar el trabajo real).
- REQ-FE-02 (SSO vs. re-login) — no bloquea construir las pantallas de auth, pero sí define si llevan lógica de sesión compartida o no; se puede empezar sin esa respuesta y ajustar después.

## SECURITY

- Ningún dato sensible (tokens, credenciales) vive dentro del paquete — solo recibe callbacks/endpoints por configuración de cada app consumidora.
- Las pantallas de auth no deben asumir ningún mecanismo de almacenamiento de token específico (localStorage/cookie) — eso lo decide cada app, el componente solo expone el evento de éxito/error.

## PERFORMANCE

- Tree-shaking: cada componente debe poder importarse individualmente sin arrastrar el catálogo completo (evita que `website`, que es mucho más liviano que `admin`, cargue 45 componentes que no usa).

## ACCESSIBILITY

- Cada componente de control (Input, Select, Checkbox, etc.) debe cumplir semántica HTML + labels + soporte de teclado como mínimo — se valida formalmente cuando exista una versión navegable (no se puede validar accesibilidad de código estático sin ejecutar).

## ACCEPTANCE CRITERIA

```text
- Catálogo completo migrado y reconciliado (Button/Badge unificados, sin duplicados)
- Publicado en GitHub Packages con visibilidad pública verificada
- Al menos website y admin lo consumen (no queda como paquete sin consumidores reales)
- Documentación viva accesible (reutilizando o adaptando pages/design-system/*)
- Pantallas de auth funcionando con al menos un backend real conectado vía props
```

## DEFINITION OF DONE

Aplican: Specification (este documento) ✓, Implementation (pendiente), Testing (pendiente — a definir si con framework-automation vía E2E, dado su alcance confirmado en REQ-QA-01, o con testing nativo del lenguaje para componentes aislados), Documentation (pendiente), Evidence (pendiente).

---

## NEXT ACTION

```text
Con Master Requirements (07) y Specification del Design System (08) ya
redactados, lo que sigue formalmente según el prompt maestro es el
MASTER IMPLEMENTATION PLAN (sección 53) — tareas ordenadas por dependencia,
con TASK-ID, current/target state, testing, rollback, evidence.

Antes de escribirlo, dos cosas de las que dependo de ti (no bloquean seguir
documentando, pero sí bloquean que el plan de implementación tenga fechas/
orden realista):
  1. El inventario de los 8 repos públicos existentes en la organización
     (REQ-REPO-02) — para no chocar nombres ni dejar algo público sin querer.
  2. Confirmar si seguimos con Master Implementation Plan ahora, o si
     prefieres primero que especifique en detalle alguna de las áreas que
     quedaron con "Specification pendiente" (Newsletter-campañas, Intranet,
     SSO) antes de planear tareas de implementación.
```
