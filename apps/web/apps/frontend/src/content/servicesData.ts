/**
 * Capacidades (bilingüe) — data-driven, con los visuales del refactor (imagen, acento,
 * motif, forma y palabra firma). Las métricas infladas fueron eliminadas por no verificables.
 * Las imágenes se sirven desde /public (sin imports) para un build SSR limpio.
 *
 * Separación: los datos estructurales/visuales viven aquí; el texto es `{ es, en }`.
 */
import type { L } from "../i18n";

export type ServiceMotif = "grid" | "spectrum" | "blueprint" | "orbit" | "circuit";
export type ServiceShape = "arch" | "diagonal" | "hex" | "blob" | "tilt";

export interface Service {
  /** Slug canónico en inglés (ruta `/services/<slug>`). */
  slug: string;
  /** Slug en español (ruta `/servicios/<slugEs>`). */
  slugEs: string;
  index: string;
  name: L;
  short: L;
  fullDescription?: L;
  featured?: boolean;
  flag?: L;
  tags: L[];
  intro: L;
  problems: { title: L; desc: L }[];
  approach: { title: L; desc: L }[];
  benefits?: { title: L; desc: L }[];
  faq?: { question: L; answer: L }[];
  caseStudy?: { title: L; description: L; metrics?: { label: L; value: string }[] };
  useCases: L[];
  /** Visuales (identidad del refactor). `image` es opcional: algunas usan solo motif. */
  image?: string;
  accent: string;
  accent2: string;
  glow: string;
  layout: "left" | "right" | "centered";
  motif: ServiceMotif;
  shape: ServiceShape;
  signature: L;
}

export const services: Service[] = [
  {
    slug: "software-development",
    slugEs: "desarrollo-software",
    index: "01",
    name: { es: "Desarrollo de Software a Medida", en: "Custom Software Development" },
    short: {
      es: "Sistemas diseñados y construidos para tu operación: desde el primer commit hasta producción, sin atajos ni deuda escondida.",
      en: "Systems designed and built for your operation: from the first commit to production, with no shortcuts and no hidden debt.",
    },
    featured: true,
    flag: { es: "Servicio principal", en: "Core service" },
    tags: [
      { es: "Web", en: "Web" },
      { es: "APIs", en: "APIs" },
      { es: "Integraciones", en: "Integrations" },
      { es: "Arquitectura", en: "Architecture" },
    ],
    intro: {
      es: "Es el corazón de FaruTech. Diseñamos y construimos el software que tu operación necesita: aplicaciones web, APIs e integraciones, con ingeniería senior y sin atajos. El objetivo no es entregar código, es entregar software que llega a producción y se mantiene ahí.",
      en: "This is the heart of FaruTech. We design and build the software your operation needs: web apps, APIs and integrations, with senior engineering and no shortcuts. The goal isn't to deliver code, it's to deliver software that reaches production and stays there.",
    },
    problems: [
      {
        title: { es: "Software genérico que no encaja", en: "Generic software that doesn't fit" },
        desc: { es: "Los paquetes comerciales obligan a adaptar tu operación a sus límites.", en: "Off-the-shelf packages force your operation to adapt to their limits." },
      },
      {
        title: { es: "Desarrollos que no llegan a producción", en: "Projects that never reach production" },
        desc: { es: "Prototipos eternos y proyectos que se estancan antes de generar valor.", en: "Endless prototypes and projects that stall before creating value." },
      },
      {
        title: { es: "Deuda técnica acumulada", en: "Accumulated technical debt" },
        desc: { es: "Código frágil que frena cada nuevo cambio y encarece el futuro.", en: "Fragile code that slows every change and makes the future more expensive." },
      },
      {
        title: { es: "Decisiones sin documentar", en: "Undocumented decisions" },
        desc: { es: "Conocimiento que vive en la cabeza de una persona y se pierde.", en: "Knowledge that lives in one person's head and gets lost." },
      },
    ],
    approach: [
      {
        title: { es: "Producción desde el primer commit", en: "Production from the first commit" },
        desc: { es: "CI/CD, pruebas y despliegue continuo desde el inicio; el software se usa, no se espera.", en: "CI/CD, tests and continuous deployment from day one; the software is used, not waited for." },
      },
      {
        title: { es: "Decisiones documentadas (ADR)", en: "Documented decisions (ADR)" },
        desc: { es: "Cada elección de arquitectura queda registrada: qué, por qué y qué se descartó.", en: "Every architecture choice is recorded: what, why, and what was discarded." },
      },
      {
        title: { es: "Deuda técnica controlada", en: "Controlled technical debt" },
        desc: { es: "Se identifica, se presupuesta y se paga; no se acumula en silencio.", en: "It's identified, budgeted and paid down; never silently accumulated." },
      },
      {
        title: { es: "Código que tu equipo puede heredar", en: "Code your team can inherit" },
        desc: { es: "Estándares claros y documentación para que el sistema sobreviva a sus autores.", en: "Clear standards and documentation so the system outlives its authors." },
      },
    ],
    useCases: [
      { es: "Aplicaciones web internas y de cara al cliente", en: "Internal and customer-facing web apps" },
      { es: "APIs y servicios para integrar sistemas existentes", en: "APIs and services to integrate existing systems" },
      { es: "Productos digitales desde cero (MVP a producción)", en: "Digital products from scratch (MVP to production)" },
      { es: "Sistemas críticos que no pueden fallar", en: "Critical systems that can't fail" },
    ],
    image: "/images/services/software-hero.webp",
    accent: "#3FC1FF",
    accent2: "#7C5CFF",
    glow: "rgba(63,193,255,0.45)",
    layout: "left",
    motif: "grid",
    shape: "arch",
    signature: { es: "CONSTRUIR", en: "BUILD" },
  },
  {
    slug: "saas-platforms",
    slugEs: "plataformas-saas",
    index: "02",
    name: { es: "Plataformas SaaS y Multi-Tenant", en: "SaaS & Multi-Tenant Platforms" },
    short: {
      es: "Productos multi-tenant listos para escalar: aislamiento por organización, autenticación única y una sola base de código para todos tus clientes.",
      en: "Multi-tenant products ready to scale: per-organization isolation, single sign-on and one codebase for all your customers.",
    },
    tags: [
      { es: "Multi-tenant", en: "Multi-tenant" },
      { es: "SSO", en: "SSO" },
      { es: "Escala", en: "Scale" },
    ],
    intro: {
      es: "Diseñamos plataformas SaaS donde cada cliente (tenant) opera aislado y seguro sobre una sola base de código. Desde el modelo de datos hasta la facturación, pensamos la plataforma para que crecer no signifique reescribir.",
      en: "We design SaaS platforms where each customer (tenant) operates isolated and secure on a single codebase. From the data model to billing, we design the platform so growth doesn't mean rewriting.",
    },
    problems: [
      {
        title: { es: "Un despliegue por cliente", en: "One deployment per customer" },
        desc: { es: "Cada cliente nuevo implica más infraestructura, más costo y más riesgo.", en: "Every new customer means more infrastructure, more cost and more risk." },
      },
      {
        title: { es: "Datos sin aislamiento", en: "Data without isolation" },
        desc: { es: "El riesgo de que un tenant vea datos de otro es inaceptable.", en: "The risk of one tenant seeing another's data is unacceptable." },
      },
      {
        title: { es: "Provisioning manual", en: "Manual provisioning" },
        desc: { es: "Dar de alta un cliente toma días y depende de una persona.", en: "Onboarding a customer takes days and depends on one person." },
      },
      {
        title: { es: "Autenticación repetida", en: "Repeated authentication" },
        desc: { es: "Usuarios que deben iniciar sesión en cada instancia por separado.", en: "Users forced to log in to each instance separately." },
      },
    ],
    approach: [
      {
        title: { es: "Aislamiento por diseño", en: "Isolation by design" },
        desc: { es: "Row-Level Security y scopes por organización: el aislamiento lo garantiza la base de datos.", en: "Row-Level Security and per-organization scopes: isolation enforced by the database." },
      },
      {
        title: { es: "Autenticación única (SSO)", en: "Single sign-on (SSO)" },
        desc: { es: "OIDC con un IdP central: entras una vez y accedes a tus instancias sin re-autenticarte.", en: "OIDC with a central IdP: sign in once and access your instances without re-authenticating." },
      },
      {
        title: { es: "Provisioning automatizado", en: "Automated provisioning" },
        desc: { es: "Alta de tenants en minutos, no en días, con configuración por organización.", en: "Tenant onboarding in minutes, not days, with per-organization configuration." },
      },
      {
        title: { es: "Una base de código", en: "One codebase" },
        desc: { es: "Todos los clientes sobre la misma versión: menos bugs, más velocidad.", en: "All customers on the same version: fewer bugs, more speed." },
      },
    ],
    useCases: [
      { es: "SaaS B2B con múltiples organizaciones", en: "B2B SaaS with multiple organizations" },
      { es: "Plataformas con instancias por cliente", en: "Platforms with per-customer instances" },
      { es: "Productos que requieren aislamiento de datos", en: "Products requiring data isolation" },
      { es: "Ecosistemas con portal y marketplace", en: "Ecosystems with portal and marketplace" },
    ],
    image: "/images/services/saas-hero.webp",
    accent: "#22E07C",
    accent2: "#14B8A6",
    glow: "rgba(34,224,124,0.4)",
    layout: "right",
    motif: "spectrum",
    shape: "diagonal",
    signature: { es: "ESCALAR", en: "SCALE" },
  },
  {
    slug: "enterprise-solutions",
    slugEs: "soluciones-empresariales",
    index: "03",
    name: { es: "Soluciones Empresariales", en: "Enterprise Solutions" },
    short: {
      es: "Sistemas internos, integraciones ERP/CRM y automatización de la operación crítica de tu empresa, con rigor de ingeniería.",
      en: "Internal systems, ERP/CRM integrations and automation of your company's critical operations, with engineering rigor.",
    },
    tags: [
      { es: "Integraciones", en: "Integrations" },
      { es: "ERP/CRM", en: "ERP/CRM" },
      { es: "Operación", en: "Operations" },
    ],
    intro: {
      es: "Conectamos y automatizamos la operación de tu empresa: sistemas internos, integraciones con ERP/CRM y flujos que hoy dependen de hojas de cálculo y esfuerzo manual. Software serio para operaciones que no pueden detenerse.",
      en: "We connect and automate your company's operations: internal systems, ERP/CRM integrations and workflows that today depend on spreadsheets and manual effort. Serious software for operations that can't stop.",
    },
    problems: [
      {
        title: { es: "Sistemas que no se hablan", en: "Systems that don't talk to each other" },
        desc: { es: "ERP, CRM y herramientas internas que no comparten datos.", en: "ERP, CRM and internal tools that don't share data." },
      },
      {
        title: { es: "Procesos manuales", en: "Manual processes" },
        desc: { es: "Operaciones críticas que dependen de personas y hojas de cálculo.", en: "Critical operations that depend on people and spreadsheets." },
      },
      {
        title: { es: "Datos duplicados", en: "Duplicated data" },
        desc: { es: "La misma información en varios lugares, sin fuente única de verdad.", en: "The same information in several places, with no single source of truth." },
      },
      {
        title: { es: "Falta de trazabilidad", en: "Lack of traceability" },
        desc: { es: "No se sabe quién hizo qué ni cuándo en los procesos clave.", en: "No one knows who did what and when in key processes." },
      },
    ],
    approach: [
      {
        title: { es: "Integraciones robustas", en: "Robust integrations" },
        desc: { es: "Conectores y APIs que mantienen tus sistemas sincronizados, con monitoreo.", en: "Connectors and APIs that keep your systems in sync, with monitoring." },
      },
      {
        title: { es: "Automatización de flujos", en: "Workflow automation" },
        desc: { es: "Los procesos repetitivos se automatizan; las personas deciden.", en: "Repetitive processes are automated; people make the decisions." },
      },
      {
        title: { es: "Fuente única de verdad", en: "Single source of truth" },
        desc: { es: "Modelos de datos claros para que la información sea confiable.", en: "Clear data models so information is trustworthy." },
      },
      {
        title: { es: "Auditoría y trazabilidad", en: "Audit and traceability" },
        desc: { es: "Cada acción queda registrada para cumplir y mejorar.", en: "Every action is logged for compliance and improvement." },
      },
    ],
    useCases: [
      { es: "Integración ERP/CRM con sistemas internos", en: "ERP/CRM integration with internal systems" },
      { es: "Automatización de operaciones repetitivas", en: "Automation of repetitive operations" },
      { es: "Sistemas de gestión a medida", en: "Custom management systems" },
      { es: "Digitalización de procesos manuales", en: "Digitization of manual processes" },
    ],
    image: "/images/services/enterprise-hero.webp",
    accent: "#FF7A1A",
    accent2: "#FF3D71",
    glow: "rgba(255,122,26,0.4)",
    layout: "left",
    motif: "blueprint",
    shape: "tilt",
    signature: { es: "INTEGRAR", en: "INTEGRATE" },
  },
  {
    slug: "ai-automation",
    slugEs: "ia-automatizacion",
    index: "04",
    name: { es: "IA y Automatización", en: "AI & Automation" },
    short: {
      es: "IA aplicada y automatización de procesos con resultados concretos. Sin humo: solo casos de uso que generan valor real.",
      en: "Applied AI and process automation with concrete results. No hype: only use cases that create real value.",
    },
    tags: [
      { es: "LLMs", en: "LLMs" },
      { es: "Workflows", en: "Workflows" },
      { es: "Datos", en: "Data" },
    ],
    intro: {
      es: "Aplicamos IA donde genera valor real: automatización de flujos, asistencia sobre tus datos y procesos que hoy consumen horas. Nada de promesas mágicas: casos de uso concretos, medibles y mantenibles.",
      en: "We apply AI where it creates real value: workflow automation, assistance over your data and processes that consume hours today. No magical promises: concrete, measurable, maintainable use cases.",
    },
    problems: [
      {
        title: { es: "Tareas repetitivas que consumen horas", en: "Repetitive tasks that eat hours" },
        desc: { es: "Equipos dedicados a trabajo que una máquina puede hacer mejor.", en: "Teams stuck doing work a machine can do better." },
      },
      {
        title: { es: "Datos sin explotar", en: "Untapped data" },
        desc: { es: "Información valiosa atrapada en documentos y sistemas dispersos.", en: "Valuable information trapped in scattered documents and systems." },
      },
      {
        title: { es: "IA sin rumbo", en: "AI without direction" },
        desc: { es: "Proyectos de IA que no conectan con un objetivo de negocio claro.", en: "AI projects that don't connect to a clear business goal." },
      },
      {
        title: { es: "Miedo a la caja negra", en: "Fear of the black box" },
        desc: { es: "Soluciones que nadie entiende ni puede auditar.", en: "Solutions nobody understands or can audit." },
      },
    ],
    approach: [
      {
        title: { es: "Casos de uso primero", en: "Use cases first" },
        desc: { es: "Empezamos por el problema de negocio, no por la tecnología.", en: "We start from the business problem, not the technology." },
      },
      {
        title: { es: "IA explicable y auditable", en: "Explainable, auditable AI" },
        desc: { es: "Cada automatización se puede revisar, probar y corregir.", en: "Every automation can be reviewed, tested and corrected." },
      },
      {
        title: { es: "Integración con tus sistemas", en: "Integration with your systems" },
        desc: { es: "La IA se conecta a tus datos y flujos existentes.", en: "AI connects to your existing data and workflows." },
      },
      {
        title: { es: "Medición de resultados", en: "Measuring results" },
        desc: { es: "Definimos qué significa éxito y lo verificamos.", en: "We define what success means and verify it." },
      },
    ],
    useCases: [
      { es: "Automatización de flujos documentales", en: "Document workflow automation" },
      { es: "Asistentes sobre datos internos", en: "Assistants over internal data" },
      { es: "Clasificación y extracción de información", en: "Information classification and extraction" },
      { es: "Workflows con intervención humana", en: "Workflows with human oversight" },
    ],
    image: "/images/services/ai-hero.webp",
    accent: "#36E0C0",
    accent2: "#3F9BFF",
    glow: "rgba(54,224,192,0.4)",
    layout: "centered",
    motif: "circuit",
    shape: "hex",
    signature: { es: "AUTOMATIZAR", en: "AUTOMATE" },
  },
  {
    slug: "modernization",
    slugEs: "modernizacion",
    index: "05",
    name: { es: "Modernización Tecnológica", en: "Technology Modernization" },
    short: {
      es: "Evoluciona sistemas legacy sin congelar la operación: migración incremental (strangler fig) y modernización pragmática.",
      en: "Evolve legacy systems without freezing operations: incremental migration (strangler fig) and pragmatic modernization.",
    },
    tags: [
      { es: "Legacy", en: "Legacy" },
      { es: "Migración", en: "Migration" },
      { es: "Performance", en: "Performance" },
    ],
    intro: {
      es: "Los sistemas que sostienen tu operación no se pueden apagar para reescribirlos. Los modernizamos por partes, con la estrategia strangler-fig: entregas incrementales, riesgo controlado y la operación siempre en marcha.",
      en: "The systems that run your operation can't be shut down to be rewritten. We modernize them piece by piece, with a strangler-fig strategy: incremental delivery, controlled risk and operations always running.",
    },
    problems: [
      {
        title: { es: "Legacy que frena el negocio", en: "Legacy holding the business back" },
        desc: { es: "Cada cambio es lento, caro y riesgoso.", en: "Every change is slow, expensive and risky." },
      },
      {
        title: { es: "Miedo a la reescritura total", en: "Fear of a full rewrite" },
        desc: { es: "Los proyectos de reescritura suelen fracasar y congelan la operación.", en: "Rewrite projects often fail and freeze operations." },
      },
      {
        title: { es: "Costos que crecen", en: "Growing costs" },
        desc: { es: "Infraestructura y mantenimiento cada vez más caros.", en: "Ever more expensive infrastructure and maintenance." },
      },
      {
        title: { es: "Equipos que no conocen el sistema", en: "Teams that don't know the system" },
        desc: { es: "Conocimiento perdido y dependencia de pocos.", en: "Lost knowledge and dependence on a few people." },
      },
    ],
    approach: [
      {
        title: { es: "Strangler fig", en: "Strangler fig" },
        desc: { es: "Reemplazamos el sistema por partes, sin big-bang ni congelamiento.", en: "We replace the system piece by piece, no big-bang and no freeze." },
      },
      {
        title: { es: "Diagnóstico honesto", en: "Honest diagnosis" },
        desc: { es: "Leemos el código y te decimos qué vale la pena salvar y qué no.", en: "We read the code and tell you what's worth saving and what isn't." },
      },
      {
        title: { es: "Entregas incrementales", en: "Incremental delivery" },
        desc: { es: "Cada fase aporta valor y reduce riesgo.", en: "Each phase adds value and reduces risk." },
      },
      {
        title: { es: "Documentación del camino", en: "Documenting the journey" },
        desc: { es: "El proceso queda registrado para tu equipo.", en: "The process is recorded for your team." },
      },
    ],
    useCases: [
      { es: "Migración de monolitos a servicios", en: "Monolith to services migration" },
      { es: "Modernización de sistemas legacy", en: "Legacy system modernization" },
      { es: "Reducción de costos de infraestructura", en: "Infrastructure cost reduction" },
      { es: "Recuperación de sistemas críticos", en: "Critical system recovery" },
    ],
    accent: "#FFB020",
    accent2: "#FF7A1A",
    glow: "rgba(255,176,32,0.4)",
    layout: "right",
    motif: "blueprint",
    shape: "tilt",
    signature: { es: "EVOLUCIONAR", en: "EVOLVE" },
  },
  {
    slug: "ux-engineering",
    slugEs: "ux-engineering",
    index: "06",
    name: { es: "UX Engineering", en: "UX Engineering" },
    short: {
      es: "Interfaces usables, accesibles (WCAG 2.2 AA) y rápidas. Design systems y experiencia de usuario con rigor de ingeniería.",
      en: "Usable, accessible (WCAG 2.2 AA) and fast interfaces. Design systems and user experience with engineering rigor.",
    },
    tags: [
      { es: "Accesibilidad", en: "Accessibility" },
      { es: "Design Systems", en: "Design Systems" },
      { es: "Performance", en: "Performance" },
    ],
    intro: {
      es: "La mejor ingeniería también se ve y se siente. Construimos interfaces rápidas, accesibles y consistentes, con design systems que tu equipo puede mantener. WCAG 2.2 AA desde el primer componente, en nuestro propio sitio y en el tuyo.",
      en: "Great engineering also looks and feels great. We build fast, accessible and consistent interfaces, with design systems your team can maintain. WCAG 2.2 AA from the first component, on our own site and on yours.",
    },
    problems: [
      {
        title: { es: "Interfaces lentas", en: "Slow interfaces" },
        desc: { es: "Cada segundo de carga pierde usuarios y confianza.", en: "Every second of load time loses users and trust." },
      },
      {
        title: { es: "Accesibilidad ignorada", en: "Ignored accessibility" },
        desc: { es: "Productos que excluyen a personas con discapacidad y arriesgan cumplimiento.", en: "Products that exclude people with disabilities and risk compliance." },
      },
      {
        title: { es: "Inconsistencia visual", en: "Visual inconsistency" },
        desc: { es: "Cada pantalla parece de un producto distinto.", en: "Every screen looks like a different product." },
      },
      {
        title: { es: "Diseño y código desconectados", en: "Design and code disconnected" },
        desc: { es: "Lo que se diseña no es lo que se construye.", en: "What gets designed isn't what gets built." },
      },
    ],
    approach: [
      {
        title: { es: "Design systems", en: "Design systems" },
        desc: { es: "Tokens y componentes reutilizables que mantienen la consistencia.", en: "Reusable tokens and components that keep consistency." },
      },
      {
        title: { es: "Accesibilidad desde el inicio", en: "Accessibility from the start" },
        desc: { es: "WCAG 2.2 AA: semántica, contraste, foco y lectores de pantalla.", en: "WCAG 2.2 AA: semantics, contrast, focus and screen readers." },
      },
      {
        title: { es: "Performance como requisito", en: "Performance as a requirement" },
        desc: { es: "Presupuestos de carga y Core Web Vitals en verde.", en: "Load budgets and Core Web Vitals in the green." },
      },
      {
        title: { es: "Diseño implementable", en: "Implementable design" },
        desc: { es: "Trabajamos con tu equipo para que lo diseñado sea lo construido.", en: "We work with your team so what's designed is what's built." },
      },
    ],
    useCases: [
      { es: "Auditoría y remediación de accesibilidad", en: "Accessibility audit and remediation" },
      { es: "Construcción de design systems", en: "Design system construction" },
      { es: "Optimización de Core Web Vitals", en: "Core Web Vitals optimization" },
      { es: "Interfaces complejas de producto", en: "Complex product interfaces" },
    ],
    image: "/images/services/ux-hero.webp",
    accent: "#B66BFF",
    accent2: "#FF6BD6",
    glow: "rgba(182,107,255,0.42)",
    layout: "right",
    motif: "orbit",
    shape: "blob",
    signature: { es: "DISEÑAR", en: "CRAFT" },
  },
];

export function getService(slug: string | undefined) {
  return services.find((c) => c.slug === slug);
}

/** Etiquetas compartidas de las páginas de capacidades. */
export const servicesUI = {
  eyebrow: { es: "Servicios", en: "Services" } satisfies L,
  titleA: { es: "Lo que", en: "What we" } satisfies L,
  titleB: { es: "construimos.", en: "build." } satisfies L,
  lede: {
    es: "Seis disciplinas de ingeniería para llevar tu operación al siguiente nivel, del software a la plataforma multi-tenant.",
    en: "Six engineering disciplines to take your operation to the next level, from custom software to a multi-tenant platform.",
  } satisfies L,
  verMas: { es: "Ver más", en: "Learn more" } satisfies L,
  verTodos: { es: "Ver todos los servicios", en: "See all services" } satisfies L,
  volver: { es: "Todos los servicios", en: "All services" } satisfies L,
  problems: { es: "Qué resolvemos", en: "What we solve" } satisfies L,
  approach: { es: "Cómo lo hacemos", en: "How we do it" } satisfies L,
  useCases: { es: "Cuándo aplica", en: "When it applies" } satisfies L,
  ctaTitle: { es: "¿Tienes un proyecto así?", en: "Have a project like this?" } satisfies L,
  ctaDesc: {
    es: "Cuéntanos y te decimos con honestidad si podemos ayudarte, y cómo.",
    en: "Tell us and we'll honestly tell you if we can help, and how.",
  } satisfies L,
  ctaButton: { es: "Hablemos", en: "Let's talk" } satisfies L,
  notFound: { es: "Servicio no encontrado", en: "Service not found" } satisfies L,
  notFoundDesc: { es: "Este servicio no existe o cambió de nombre.", en: "This service doesn't exist or was renamed." } satisfies L,
};
