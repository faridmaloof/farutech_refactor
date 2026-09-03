/** Metodología (bilingüe). Proceso verificable por método, no por métrica. */
import type { L } from "../i18n";

export const methodPage = {
  eyebrow: { es: "Metodología", en: "Methodology" } satisfies L,
  title: {
    es: "Cómo trabajamos: un proceso de ingeniería, no un acto de fe.",
    en: "How we work: an engineering process, not an act of faith.",
  } satisfies L,
  lede: {
    es: "Cada proyecto sigue el mismo ciclo disciplinado. No prometemos milagros: prometemos un método que produce software en producción y se hace cargo de él.",
    en: "Every project follows the same disciplined cycle. We don't promise miracles: we promise a method that ships software to production and stands behind it.",
  } satisfies L,
  conocer: { es: "Conocer el método completo", en: "See the full method" } satisfies L,
  aplicar: { es: "Aplicar el método a tu proyecto", en: "Apply the method to your project" } satisfies L,
};

export const methodSteps: { num: string; title: L; desc: L; tag: L }[] = [
  {
    num: "01",
    title: { es: "Diagnóstico", en: "Diagnosis" },
    desc: {
      es: "Leemos el código, hablamos con el equipo y te decimos qué está mal de verdad. Sin rodeos y sin vender humo.",
      en: "We read the code, talk to the team and tell you what's really wrong. No detours, no hype.",
    },
    tag: { es: "1 a 2 semanas", en: "1 to 2 weeks" },
  },
  {
    num: "02",
    title: { es: "Arquitectura", en: "Architecture" },
    desc: {
      es: "Decidimos cómo se construye y lo dejamos por escrito: ADRs, límites del sistema y plan de evolución.",
      en: "We decide how it's built and write it down: ADRs, system boundaries and an evolution plan.",
    },
    tag: { es: "Documentado", en: "Documented" },
  },
  {
    num: "03",
    title: { es: "Construcción", en: "Build" },
    desc: {
      es: "Producción desde el primer commit. Pruebas en CI, deuda técnica controlada y entregas continuas.",
      en: "Production from the first commit. Tests in CI, controlled technical debt and continuous delivery.",
    },
    tag: { es: "Iterativo", en: "Iterative" },
  },
  {
    num: "04",
    title: { es: "Producción", en: "Production" },
    desc: {
      es: "Runbooks, observabilidad y soporte. El software se queda en producción, y nosotros también.",
      en: "Runbooks, observability and support. The software stays in production, and so do we.",
    },
    tag: { es: "Continuo", en: "Continuous" },
  },
];

export const principlesTitle = { es: "Principios", en: "Principles" } satisfies L;

export const principles: { title: L; desc: L }[] = [
  {
    title: { es: "Producción desde el primer commit", en: "Production from the first commit" },
    desc: {
      es: "Un proyecto que no se despliega desde el inicio acumula riesgo en silencio. Desplegamos siempre.",
      en: "A project that isn't deployed from the start silently piles up risk. We always deploy.",
    },
  },
  {
    title: { es: "Decisiones documentadas", en: "Documented decisions" },
    desc: {
      es: "Cada elección técnica queda registrada como ADR: qué se decidió, por qué y qué alternativas se descartaron.",
      en: "Every technical choice is recorded as an ADR: what was decided, why, and which alternatives were discarded.",
    },
  },
  {
    title: { es: "Deuda técnica bajo control", en: "Technical debt under control" },
    desc: {
      es: "La deuda existe; el problema es esconderla. La registramos, la presupuestamos y la pagamos.",
      en: "Debt exists; the problem is hiding it. We log it, budget it and pay it down.",
    },
  },
  {
    title: { es: "El stack es una herramienta", en: "The stack is a tool" },
    desc: {
      es: "No vendemos tecnologías: elegimos la herramienta correcta para cada problema y lo justificamos.",
      en: "We don't sell technologies: we pick the right tool for each problem and justify it.",
    },
  },
];
