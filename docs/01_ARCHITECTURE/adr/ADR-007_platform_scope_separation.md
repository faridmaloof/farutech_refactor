# ADR-007 — Platform Scope Separation (Website Ecosystem vs. Future Multi-Tenant Platform)

**Fecha:** 2026-09-05
**Estado:** ✅ DECIDIDO
**Responsable:** Product Owner / Technical Lead
**Relacionado:** ADR-004 (Multi-Database Strategy), ADR-005 (Website Backend Consolidation), SPEC-003 (Platform Vision)

---

## Contexto

Durante la revisión del refactor del sitio web, el Product Owner comunicó una visión de largo plazo que **no existía en ninguna parte de la documentación previa** (verificado: cero menciones de "tenant", "control plane", "multi-tenant", "organización-cliente", "marketplace de aplicaciones" en `docs/`, `README.md` ni en el archivo histórico `99_ARCHIVE/`):

Farutech evolucionará hacia un ecosistema de **dos sistemas de naturaleza y stack completamente distintos**:

1. **Website Ecosystem** (alcance de este refactor, en curso): sitio público de marketing + panel de administración de ese sitio (leads, blog, newsletter, oportunidades comerciales). Aloja el proyecto en un **hosting con restricciones de inodes/recursos** — de ahí la elección de Laravel (liviano, maduro para proyectos web "estáticos-dinámicos") con workers simples para tareas asíncronas (scraping, envío de correos).

2. **Platform** (futuro, fuera de alcance de este refactor, pero que debe quedar habilitado): un control plane multi-tenant tipo "mini AWS/Azure para SaaS propio", donde clientes de Farutech (organizaciones) ingresan, crean su ambiente, y despliegan instancias de aplicaciones (ERP, POS, etc. — incluso desarrolladas a medida) sobre infraestructura dedicada o compartida. Vivirá en un dominio propio (ej. `platform.farutech.com`), sobre infraestructura cloud robusta (Azure/AWS), con backend en **.NET/C#** y workers en **Go**, contenedorización real de producción (no solo para pruebas locales, como es hoy el caso del website).

## Problema

Sin una decisión explícita, existe riesgo real de que decisiones tomadas *hoy* para el website (base de datos única, estructura de carpetas, stack, gateway) se conviertan accidentalmente en restricciones para `platform` mañana, o que se mezclen ambos sistemas en el mismo espacio de nombres, base de datos o infraestructura, dificultando su separación futura.

## Decisión

Se declaran **dos sistemas independientes** desde ya, aunque convivan en el mismo monorepo durante esta fase:

| Aspecto | Website Ecosystem (hoy) | Platform (futuro) |
|---|---|---|
| **Dominio** | `farutech.com` (+ `/admin`) | `platform.farutech.com` (o el que se defina) |
| **Frontend** | React + Vite + TypeScript (compilado a estático) | React + Vite + TypeScript (mismo stack de frontend, distinto dominio funcional) |
| **Backend** | Laravel 11 + PHP 8.2 (bajo `apps/website/src/backend`, ver ADR-005) | .NET / C# (control plane API) |
| **Workers** | Laravel Queue (Redis) | Go (procesos de aprovisionamiento, mensajería, gestión de infraestructura) |
| **Base de datos** | PostgreSQL único + Redis (ADR-004, **con el scope aclarado en este ADR**) | Motor(es) a definir en SPEC-003; **no comparte esquema ni instancia de BD con el website** |
| **Infraestructura** | Hosting con restricción de inodes; contenerización **solo para desarrollo local** | Infraestructura cloud (Azure/AWS) con contenerización real de producción |
| **Multi-tenencia** | No aplica (un solo "tenant": Farutech) | Sí — por organización/instancia, con aislamiento dedicado o compartido |
| **Design System** | `packages/design-system` (uso actual: website + admin) | Reutiliza `packages/design-system` (los componentes de dashboard ya presentes fueron extraídos con esta reutilización en mente — ver nota abajo) |
| **Estado del repo** | Monorepo (`apps/website`, `apps/admin`) | Aún no iniciado. Cuando nazca, será `apps/platform/{src/frontend, src/backend, test}` desde el día uno, sin repetir el error corregido en ADR-005 |

### Nota sobre el Design System compartido

La auditoría confirmó que `packages/design-system` ya contiene componentes de dashboard (`DataTable`, `Sidebar`, `ModuleSwitcher`, `Scheduler`, `NotificationPanel`, etc.) que, según indicó el Product Owner, fueron extraídos de un dashboard preexistente pensando explícitamente en reutilización futura para `platform`. **Esta decisión de reutilización queda formalizada aquí**, ya que antes no estaba documentada en ningún ADR: el Design System es y seguirá siendo un paquete compartido entre el admin del website y el futuro dashboard de `platform`, lo cual **no** implica que ambos backends, dominios o bases de datos se compartan — solo la capa visual/componentes.

## Re-alcance de ADR-004 (Multi-Database Strategy)

ADR-004 decidió consolidar a PostgreSQL único + Redis. **Esa decisión se re-confirma pero se acota explícitamente al Website Ecosystem** (usuarios del admin, leads, oportunidades, blog, newsletter). No debe interpretarse como una decisión válida para la base de datos de `platform`, que se definirá en su propio ADR cuando ese proyecto inicie (probablemente con necesidades de particionamiento por tenant que PostgreSQL único del website no está diseñado para soportar).

## Glosario Oficial (para uso en SPEC-003 y futuros documentos de Platform)

Para evitar ambigüedad en la documentación futura, se fija la siguiente terminología:

- **Organization (Organización):** el cliente de Farutech que contrata la plataforma. Es la entidad de facturación y de administración de usuarios.
- **Instance (Instancia):** un ambiente desplegado dentro de una Organization — por ejemplo, "ERP de Organización X" o "POS Veterinaria de Organización Y". Una Organization puede tener múltiples Instances.
- **Deployment Mode:** atributo de una Instance — `dedicated` (recursos de infraestructura exclusivos para esa instancia) o `shared` (infraestructura compartida entre múltiples instancias/organizaciones de bajo consumo).
- **Application (Aplicación del marketplace):** el catálogo de tipos de instancia disponibles para desplegar (ej. "ERP", "POS Veterinaria", "CRM a medida"). Una Application es la plantilla; una Instance es la materialización de esa Application para una Organization concreta.
- **Control Plane / Platform Core:** el sistema (`apps/platform`) que gestiona el ciclo de vida completo de Organizations, Instances y Applications — creación, aprovisionamiento, credenciales, enrutamiento por dominio/instancia.

Estos términos deben usarse de forma consistente en toda la documentación futura relacionada con `platform`, evitando sinónimos ambiguos ("cliente", "proyecto", "ambiente" usados indistintamente).

## Naming Propuesto (a validar por el equipo)

- Directorio de la app: `apps/platform`
- Backend/core: `Platform.Core` (.NET) — se evita nombrarlo solo "Core" para no colisionar en el vocabulario del equipo con `Framework.Core` (el core del framework de pruebas .NET, ya existente en `packages/framework-automation`, que es un concepto completamente distinto).
- Workers Go: `Platform.Workers.<Dominio>` (ej. `Platform.Workers.Provisioning`, `Platform.Workers.Billing`) — para diferenciarlos claramente de los jobs de Laravel del website.
- Dashboard frontend: `apps/platform/src/frontend` (React + Vite + TypeScript, consumiendo `@farutech/design-system`).

## Consecuencias

### Positivas
- Ninguna decisión tomada hoy para el website bloquea al futuro `platform`.
- Queda un glosario y una tabla de referencia que evita reinterpretar la visión de negocio cada vez que se retome.
- El Design System gana un propósito documentado de reutilización cross-producto, evitando que se le trate como "solo del website" en decisiones futuras.

### Negativas / Riesgos
- Ninguno inmediato: esta es una decisión puramente documental, no requiere cambios de código hoy.
- Riesgo a vigilar: que el equipo, sin este documento, vuelva a mezclar ambos alcances en el futuro. Mitigación: referenciar este ADR en el `README.md` principal y en cualquier documento de arranque de `platform`.

## Referencias

- SPEC-003 — Platform Vision (detalle funcional de esta visión, cuando se desarrolle)
- ADR-004 — Multi-Database Strategy (re-alcance)
- ADR-005 — Website Backend Consolidation

---

**Estado:** ✅ DECIDIDO
**Próxima Revisión:** al iniciar formalmente el proyecto `platform`
