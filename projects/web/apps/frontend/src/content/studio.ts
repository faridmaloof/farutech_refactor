/** Studio (bilingüe). Quiénes somos, sin exageraciones. */
import type { L } from "../i18n";

export const studioPage = {
  eyebrow: { es: "Studio", en: "Studio" } satisfies L,
  title: { es: "Un colectivo de ingeniería, primero.", en: "An engineering collective, first." } satisfies L,
  lede: {
    es: "Somos un equipo pequeño de ingenieros, diseñadores y arquitectos que construye software serio para equipos que necesitan que funcione: en producción, a escala, el lunes por la mañana.",
    en: "We're a small team of engineers, designers and architects building serious software for teams that need it to work: in production, at scale, on Monday morning.",
  } satisfies L,
  paragraphs: [
    {
      es: "No somos una fábrica de código ni una agencia de marketing con desarrolladores. Somos ingenieros que se hacen cargo: del diagnóstico a la arquitectura, de la construcción a la operación.",
      en: "We're neither a code factory nor a marketing agency with developers. We're engineers who take ownership: from diagnosis to architecture, from build to operation.",
    },
    {
      es: "Trabajamos de forma distribuida por diseño, con presencia en Bogotá y Cali para los proyectos que requieren acompañamiento presencial. El resto del tiempo, operamos en remoto con la misma disciplina.",
      en: "We work distributed by design, with a presence in Bogotá and Cali for projects that need on-site support. The rest of the time, we operate remotely with the same discipline.",
    },
    {
      es: "Creemos en el software como un activo de largo plazo: por eso documentamos decisiones, controlamos la deuda técnica y construimos sistemas que tu equipo podrá mantener y evolucionar sin depender de nosotros para siempre.",
      en: "We believe in software as a long-term asset: that's why we document decisions, control technical debt and build systems your team can maintain and evolve without depending on us forever.",
    },
  ] satisfies L[],
  presence: {
    eyebrow: { es: "Presencia", en: "Presence" } satisfies L,
    title: { es: "Distribuidos por diseño.", en: "Distributed by design." } satisfies L,
    items: [
      { place: { es: "Bogotá", en: "Bogotá" } satisfies L, note: { es: "Presencial bajo demanda", en: "On-site on demand" } satisfies L },
      { place: { es: "Cali", en: "Cali" } satisfies L, note: { es: "Presencial bajo demanda", en: "On-site on demand" } satisfies L },
      { place: { es: "Remoto", en: "Remote" } satisfies L, note: { es: "Operación por defecto", en: "Default operation" } satisfies L },
    ],
  },
  valuesTitle: { es: "Lo que nos define", en: "What defines us" } satisfies L,
  values: [
    {
      title: { es: "Rigor", en: "Rigor" } satisfies L,
      desc: { es: "Cada afirmación técnica se sostiene con evidencia y se puede auditar.", en: "Every technical claim is backed by evidence and can be audited." } satisfies L,
    },
    {
      title: { es: "Cercanía", en: "Closeness" } satisfies L,
      desc: { es: "Hablamos claro, en tu idioma, sin jerga innecesaria ni letra pequeña.", en: "We speak clearly, in your language, with no unnecessary jargon or fine print." } satisfies L,
    },
    {
      title: { es: "Largo plazo", en: "Long term" } satisfies L,
      desc: { es: "Construimos para los próximos diez años, no para la próxima demo.", en: "We build for the next ten years, not the next demo." } satisfies L,
    },
  ],
};
