import { ArrowUpRight } from "lucide-react";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useT } from "../i18n";
import { ecosystem } from "../content/home";
import { Button, Reveal, StatusBadge, Eyebrow } from "../components/primitives";
import { useContact } from "../components/contact";

const ecoExtra = {
  statusEyebrow: { es: "Estado real, sin humo", en: "Real status, no hype" },
  whyTitle: { es: "¿Por qué «en construcción»?", en: "Why «under construction»?" },
  why1: {
    es: "Porque preferimos decir la verdad. No vamos a anunciar un producto que aún no existe como si estuviera listo.",
    en: "Because we prefer to tell the truth. We won't announce a product that doesn't exist yet as if it were ready.",
  },
  why2: {
    es: "Cuando cada pieza entre en producción, la documentaremos aquí con datos reales, igual que hacemos con nuestro trabajo para clientes.",
    en: "As each piece reaches production, we'll document it here with real data, just as we do with our client work.",
  },
  earlyAccess: { es: "Quiero acceso anticipado", en: "I want early access" },
};

export function EcosystemPage() {
  const t = useT();
  const { open } = useContact();
  useDocumentMeta({
    title: t(ecosystem.eyebrow),
    description: t(ecosystem.lede),
    path: "/ecosistema",
  });
  return (
    <>
      <div className="relative overflow-hidden border-b border-border pb-16 pt-36 md:pt-44">
        <div className="pointer-events-none absolute inset-0 bg-mesh opacity-60" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            ~/farutech/ecosistema
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight md:text-6xl">
            {t(ecosystem.title)}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{t(ecosystem.lede)}</p>
        </div>
      </div>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Eyebrow>{t(ecoExtra.statusEyebrow)}</Eyebrow>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {ecosystem.items.map((item) => (
              <Reveal key={item.name.es} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold tracking-tight">{t(item.name)}</h3>
                  <StatusBadge status={item.tone} label={t(item.status)} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(item.desc)}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 max-w-2xl">
            <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">{t(ecoExtra.whyTitle)}</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{t(ecoExtra.why1)}</p>
            <p className="mt-3 leading-relaxed text-muted-foreground">{t(ecoExtra.why2)}</p>
          </div>

          <div className="mt-10">
            <Button onClick={open} size="lg">
              {t(ecoExtra.earlyAccess)} <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
