import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useT, useLang } from "../i18n";
import { services, servicesUI } from "../content/servicesData";
import { CapabilityCard } from "../components/patterns";

export function ServicesHubPage() {
  const t = useT();
  const { lang } = useLang();
  const isEs = lang === "es";
  const base = isEs ? "/servicios" : "/services";

  useDocumentMeta({
    title: t(servicesUI.eyebrow),
    description: t(servicesUI.lede),
    path: base,
  });
  return (
    <>
      <div className="relative overflow-hidden border-b border-border pb-16 pt-36 md:pt-44">
        <div className="pointer-events-none absolute inset-0 bg-mesh opacity-60" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            ~/farutech/{isEs ? "capacidades" : "capabilities"}
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-6xl">
            {t(servicesUI.titleA)} <span className="text-gradient">{t(servicesUI.titleB)}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{t(servicesUI.lede)}</p>
        </div>
      </div>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((c, i) => (
              <CapabilityCard key={c.slug} cap={c} delay={(i % 3) * 0.06} base={base} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
