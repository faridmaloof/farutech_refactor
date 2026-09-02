/**
 * ServiceScaffold — armazón común de una landing de servicio.
 *
 * NO es un "template" repetido: provee el chrome compartido (data-service para
 * activar la identidad de color, SEO, breadcrumb y secciones base) y recibe por
 * props un `hero` ÚNICO y `segments` EXCLUSIVOS por servicio, de modo que el
 * resultado visual y de contenido difiere entre cada landing.
 */
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useT } from "../../i18n";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { useContact } from "../../components/contact";
import { Button, SectionHeading, Reveal } from "../../components/primitives";
import { servicesUI } from "../../content/servicesData";
import type { Service } from "../../content/servicesData";

export function ServiceScaffold({
  cap,
  hero,
  segments = [],
  showProblems = true,
  showApproach = true,
  showUseCases = true,
}: {
  cap: Service;
  hero: ReactNode;
  segments?: ReactNode[];
  showProblems?: boolean;
  showApproach?: boolean;
  showUseCases?: boolean;
}) {
  const t = useT();
  const { open } = useContact();
  const { pathname } = useLocation();
  const isEs = pathname.startsWith("/servicios");
  const routePath = isEs ? `/servicios/${cap.slugEs}` : `/services/${cap.slug}`;

  useDocumentMeta({
    title: t(cap.name),
    description: t(cap.intro),
    path: routePath,
    type: "service",
    keywords: [t(cap.name), ...cap.tags.map((g) => t(g))],
  });

  return (
    <div data-service={cap.slug} className="overflow-hidden">
      <nav aria-label="breadcrumb" className="relative z-10 mx-auto max-w-7xl px-6 pt-32 md:pt-36">
        <Link
          to={isEs ? "/servicios" : "/services"}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowUpRight className="h-3.5 w-3.5 -rotate-45" />
          <span className="text-foreground/70">~/farutech</span>
          <span className="text-muted-foreground">/ {isEs ? cap.slugEs : cap.slug}</span>
        </Link>
      </nav>

      {/* Hero único por servicio */}
      {hero}

      {/* Segmentos exclusivos por servicio */}
      {segments}

      {/* Qué resolvemos */}
      {showProblems && (
        <section className="relative py-20 md:py-24" aria-labelledby="svc-problems">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading
              eyebrow={t(servicesUI.problems)}
              index={`[${cap.index}.00]`}
              title={t(servicesUI.problems)}
              className="max-w-2xl"
            />
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {cap.problems.map((p, i) => (
                <Reveal key={p.title.es} delay={(i % 2) * 0.07}>
                  <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/50 p-6">
                    <span className="font-mono text-lg font-semibold text-[var(--accent-hex)]">
                      {cap.index}.{i + 1}
                    </span>
                    <h3 className="mt-3 font-display text-base font-semibold tracking-tight">{t(p.title)}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(p.desc)}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cómo lo hacemos */}
      {showApproach && (
        <section className="relative bg-surface/40 py-20 md:py-24" aria-labelledby="svc-approach">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading
              eyebrow={t(servicesUI.approach)}
              index={`[${cap.index}.0]`}
              title={t(servicesUI.approach)}
              className="max-w-2xl"
            />
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {cap.approach.map((a, i) => (
                <Reveal key={a.title.es} delay={(i % 4) * 0.07}>
                  <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6">
                    <span className="font-mono text-lg font-semibold text-[var(--accent-hex)]">
                      {cap.index}.{i + 1}
                    </span>
                    <h3 className="mt-3 font-display text-base font-semibold tracking-tight">{t(a.title)}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(a.desc)}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cuándo aplica */}
      {showUseCases && (
        <section className="relative py-20 md:py-24" aria-labelledby="svc-usecases">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading
              eyebrow={t(servicesUI.useCases)}
              index={`[${cap.index}.00]`}
              title={t(servicesUI.useCases)}
              className="max-w-2xl"
            />
            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {cap.useCases.map((uc) => (
                <Reveal key={t(uc)}>
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: "color-mix(in srgb, var(--accent-hex) 12%, transparent)" }}
                    >
                      <Check className="h-3.5 w-3.5" style={{ color: "var(--accent-hex)" }} />
                    </span>
                    <span className="text-sm text-foreground">{t(uc)}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="relative py-20 md:py-24" id="svc-cta" aria-labelledby="svc-cta-title">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="noise relative overflow-hidden rounded-3xl border border-border bg-card px-8 py-14 text-center md:px-16">
              <div className="pointer-events-none absolute inset-0 bg-mesh opacity-60" aria-hidden="true" />
              <div
                className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[560px] -translate-x-1/2 bg-glow opacity-60"
                aria-hidden="true"
              />
              <div className="relative mx-auto max-w-2xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  ~/farutech-services/{cap.slug}
                </p>
                <h2 id="svc-cta-title" className="mt-6 font-display text-3xl font-semibold tracking-tight">
                  {t(servicesUI.ctaTitle)}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t(servicesUI.ctaDesc)}</p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                  <Button onClick={open} size="lg">
                    {t(servicesUI.ctaButton)} <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

