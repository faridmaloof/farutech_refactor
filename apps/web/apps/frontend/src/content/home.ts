/** Contenidos de la home (bilingüe). Todo el copy vive aquí, no en los componentes. */
import type { L } from "../i18n";

export const hero = {
  badge: { es: "Ingeniería de software · Bogotá, Cali y remoto", en: "Software engineering · Bogotá, Cali & remote" } satisfies L,
  title1: { es: "Software a medida", en: "Custom software" } satisfies L,
  title2: { es: "que llega a producción", en: "that ships to production" } satisfies L,
  title3: { es: "y se queda.", en: "and stays there." } satisfies L,
  sub: {
    es: "Diseñamos y construimos plataformas, SaaS multi-tenant y sistemas críticos para equipos que no pueden permitirse reescribir. Ingeniería senior, desde el primer commit hasta el runbook.",
    en: "We design and build platforms, multi-tenant SaaS and critical systems for teams that can't afford to rewrite. Senior engineering, from the first commit to the runbook.",
  } satisfies L,
  primary: { es: "Empezar un proyecto", en: "Start a project" } satisfies L,
  secondary: { es: "Ver cómo trabajamos", en: "See how we work" } satisfies L,
  note: { es: "~/ diagnóstico honesto, no un pitch de ventas", en: "~/ honest diagnosis, not a sales pitch" } satisfies L,
};

/** Manifiesto que se escribe solo en el terminal del hero (método verificable, no métricas). */
export const manifesto: L[] = [
  { es: "$ farutech principios", en: "$ farutech principles" },
  { es: " ", en: " " },
  { es: "# FaruTech, principios de ingeniería", en: "# FaruTech, engineering principles" },
  { es: "01 · Producción desde el primer commit", en: "01 · Production from the first commit" },
  { es: "02 · Cada decisión de arquitectura, documentada", en: "02 · Every architecture decision, documented" },
  { es: "03 · La deuda técnica se paga, no se acumula", en: "03 · Technical debt gets paid, not piled up" },
  { es: "04 · Sin reescrituras: diseñamos para evolucionar", en: "04 · No rewrites: we design to evolve" },
  { es: "05 · El stack es una herramienta, no el producto", en: "05 · The stack is a tool, not the product" },
  { es: " ", en: " " },
  { es: "✓ listo para construir", en: "✓ ready to build" },
];

export const tickerItems: L[] = [
  { es: "Desarrollo a medida", en: "Custom development" },
  { es: "Plataformas SaaS", en: "SaaS platforms" },
  { es: "Multi-tenant", en: "Multi-tenant" },
  { es: "IA y Automatización", en: "AI & Automation" },
  { es: "Modernización", en: "Modernization" },
  { es: "UX Engineering", en: "UX Engineering" },
  { es: "Soluciones empresariales", en: "Enterprise solutions" },
];

/** Banner de confianza - empresas que confían en nosotros */
export const trustBanner = {
  eyebrow: { es: "Confían en nosotros", en: "Trusted by" } satisfies L,
  companies: [
    {
      name: "Afilamos Hermanos S.A.S.",
      sector: { es: "Industrial", en: "Industrial" } satisfies L,
      logo: "/afilamos-logo.png", // Placeholder - usar logo real si disponible
      description: {
        es: "Empresa líder en afilado industrial de herramientas con soluciones digitales integrales.",
        en: "Leading industrial tool sharpening company with comprehensive digital solutions.",
      } satisfies L,
    },
    {
      name: "Supraeventos",
      sector: { es: "Eventos Corporativos", en: "Corporate Events" } satisfies L,
      logo: "/supraeventos-logo.png", // Placeholder - usar logo real si disponible
      description: {
        es: "Producción de eventos corporativos con infraestructura cloud y seguridad enterprise.",
        en: "Corporate event production with cloud infrastructure and enterprise security.",
      } satisfies L,
    },
  ],
};

export const ecosystem = {
  eyebrow: { es: "Ecosistema", en: "Ecosystem" } satisfies L,
  title: { es: "El front door de un ecosistema en construcción.", en: "The front door to an ecosystem under construction." } satisfies L,
  lede: {
    es: "Este sitio es la entrada a algo más grande: una plataforma de productos digitales. Sin humo. Esto es lo que estamos construyendo, no lo que ya existe.",
    en: "This site is the entrance to something bigger: a digital products platform. No hype. This is what we're building, not what already exists.",
  } satisfies L,
  items: [
    {
      name: { es: "Plataforma multi-tenant", en: "Multi-tenant platform" } satisfies L,
      status: { es: "En construcción", en: "Under construction" } satisfies L,
      tone: "wip" as const,
      desc: {
        es: "Instancias aisladas por organización, con autenticación única (SSO) y datos separados.",
        en: "Instances isolated per organization, with single sign-on (SSO) and separate data.",
      } satisfies L,
    },
    {
      name: { es: "Marketplace de aplicaciones", en: "App marketplace" } satisfies L,
      status: { es: "Planificado", en: "Planned" } satisfies L,
      tone: "dev" as const,
      desc: {
        es: "Catálogo de apps y soluciones listas para activar en cada instancia.",
        en: "Catalog of apps and solutions ready to activate in each instance.",
      } satisfies L,
    },
    {
      name: { es: "Portal de clientes", en: "Client portal" } satisfies L,
      status: { es: "Planificado", en: "Planned" } satisfies L,
      tone: "dev" as const,
      desc: {
        es: "Seguimiento de proyectos y solicitudes en un solo lugar.",
        en: "Track projects and requests in one place.",
      } satisfies L,
    },
  ],
  cta: { es: "Conocer la visión", en: "See the vision" } satisfies L,
};

/** Textos del CTA final de la home. */
export const finalCta = {
  title1: { es: "¿Tienes un proyecto que", en: "Have a project that" } satisfies L,
  title2: { es: "no puede fallar?", en: "can't fail?" } satisfies L,
  desc: {
    es: "Cuéntanos qué necesitas. Respondemos con un diagnóstico honesto y una propuesta concreta, no con un pitch de ventas.",
    en: "Tell us what you need. We reply with an honest diagnosis and a concrete proposal, not a sales pitch.",
  } satisfies L,
};
