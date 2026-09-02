/**
 * Sections — bloques de la home, fieles a la estética del refactor
 * (mesh + glow + noise, texto con gradiente, botones rounded-full).
 */
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { hero, ecosystem, tickerItems, trustBanner, finalCta } from "../content/home";
import { services, servicesUI } from "../content/servicesData";
import { methodSteps, methodPage } from "../content/methodology";
import { site } from "../content/site";
import { LOGO_URL } from "../components/Logo";
import { Button, SectionHeading, Reveal, StatusBadge } from "../components/primitives";
import { CapabilityCard, Marquee } from "../components/patterns";
import { useContact } from "../components/contact";
import { useT, useLang } from "../i18n";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Spans del mosaico de capacidades (cierra la cuadrícula sin huecos en desktop). */
const SPANS: Record<string, string> = {
  "software-development": "md:col-span-2",
  modernization: "lg:row-span-2",
  "ux-engineering": "md:col-span-2",
};

/* ---------- Hero ---------- */
export function Hero() {
  const t = useT();
  const { open } = useContact();
  return (
    <section className="noise relative overflow-hidden pb-24 pt-32 md:pb-32 md:pt-44" aria-labelledby="hero-title">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-80" aria-hidden="true" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 bg-glow opacity-60"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" aria-hidden="true" />
          {t(hero.badge)}
        </motion.div>

        <div className="mt-8 grid items-center gap-12 md:grid-cols-[1.4fr_1fr]">
          <div>
            <motion.h1
              id="hero-title"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
              className="font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl lg:text-[5.5rem]"
            >
              {t(hero.title1)}
              <br />
              <span className="text-gradient">{t(hero.title2)}</span>
              <br />
              <span className="text-gradient">{t(hero.title3)}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              {t(hero.sub)}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <Button onClick={open} size="lg">
                {t(hero.primary)} <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="#metodologia" size="lg" variant="outline">
                {t(hero.secondary)}
              </Button>
            </motion.div>

            <p className="mt-6 font-mono text-xs text-muted-foreground">{t(hero.note)}</p>
          </div>

          {/* Visual: logo oficial con glow + chips flotantes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="relative hidden items-center justify-center md:flex"
            aria-hidden="true"
          >
            <div className="border-gradient relative rounded-3xl bg-surface/40 p-12 backdrop-blur-sm">
              <div className="absolute inset-0 rounded-3xl bg-glow opacity-50" />
              <img src={LOGO_URL} alt="" className="relative h-40 w-40 animate-float" />
            </div>
            <span className="absolute -left-4 top-10 animate-float rounded-full border border-border bg-surface/80 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-primary backdrop-blur" style={{ animationDelay: "0.5s" }}>
              Multi-tenant
            </span>
            <span className="absolute -right-2 bottom-12 animate-float rounded-full border border-border bg-surface/80 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-accent backdrop-blur" style={{ animationDelay: "1.2s" }}>
              SSO · OIDC
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Marquee de disciplinas ---------- */
export function MarqueeSection() {
  return <Marquee items={tickerItems} />;
}

/* ---------- Banner de Confianza (Trust Banner) ---------- */
export function TrustBannerSection() {
  const t = useT();
  return (
    <section className="relative py-16 md:py-24" aria-labelledby="trust-title">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="text-center">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
            >
              {t(trustBanner.eyebrow)}
            </motion.span>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {trustBanner.companies.map((company, i) => (
                <motion.div
                  key={company.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-elevated"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-semibold tracking-tight">{company.name}</h3>
                      <p className="mt-1 font-mono text-xs uppercase tracking-wider text-accent">{t(company.sector)}</p>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(company.description)}</p>
                    </div>
                    {/* Placeholder para logo - reemplazar con imagen real */}
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-border bg-surface/50">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Logo</span>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-success" aria-hidden="true" />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      Cliente verificado
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Capacidades (mosaico) ---------- */
export function CapabilitiesSection() {
  const t = useT();
  const { lang } = useLang();
  const base = lang === "es" ? "/servicios" : "/services";
  return (
    <section className="relative py-24 md:py-32" id="capacidades" aria-labelledby="cap-title">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow={t(servicesUI.eyebrow)}
            index="[ 01 ]"
            title={
              <>
                {t(servicesUI.titleA)} <span className="text-gradient">{t(servicesUI.titleB)}</span>
              </>
            }
            lede={t(servicesUI.lede)}
            className="max-w-2xl"
          />
          <Button to={base} variant="outline" className="shrink-0 self-start lg:self-auto">
            {t(servicesUI.verTodos)} <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((c, i) => (
            <CapabilityCard
              key={c.slug}
              cap={c}
              delay={(i % 3) * 0.06}
              className={SPANS[c.slug]}
              tall={c.slug === "modernization"}
              base={base}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Trabajo (caso real - integrado en capacidades) ---------- */
// Nota: La sección WorkSection se elimina del home ya que los casos de éxito
// ahora aparecen en el TrustBanner. Los detalles completos están en /casos-exito

/* ---------- Metodología ---------- */
export function MethodSection() {
  const t = useT();
  const { open } = useContact();
  return (
    <section className="relative py-24 md:py-32" id="metodologia" aria-labelledby="method-title">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={t(methodPage.eyebrow)} index="[ 03 ]" title={t(methodPage.title)} lede={t(methodPage.lede)} />
        <Reveal className="mt-12">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
            {methodSteps.map((s) => (
              <div key={s.num} className="group bg-card p-7 transition-colors hover:bg-surface">
                <span className="font-mono text-sm font-semibold text-spark">{s.num}</span>
                <h3 className="mt-3 font-display text-lg font-semibold tracking-tight">{t(s.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(s.desc)}</p>
                <span className="mt-4 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {t(s.tag)}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
        <div className="mt-8">
          <Button onClick={open} variant="outline">
            {t(methodPage.aplicar)} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ---------- Ecosistema (teaser honesto) ---------- */
export function EcosystemSection() {
  const t = useT();
  return (
    <section className="relative py-24 md:py-32" id="ecosistema" aria-labelledby="eco-title">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="border-gradient relative overflow-hidden rounded-3xl border border-border bg-surface/40 p-8 md:p-14">
            <div className="pointer-events-none absolute inset-0 bg-mesh opacity-60" aria-hidden="true" />
            <div className="relative">
              <SectionHeading eyebrow={t(ecosystem.eyebrow)} index="[ 04 ]" title={t(ecosystem.title)} lede={t(ecosystem.lede)} />
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {ecosystem.items.map((item) => (
                  <div key={item.name.es} className="rounded-2xl border border-border bg-background/50 p-5 backdrop-blur-sm">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold">{t(item.name)}</h3>
                      <StatusBadge status={item.tone} label={t(item.status)} />
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(item.desc)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button to="/ecosistema" variant="outline">
                  {t(ecosystem.cta)} <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- CTA final ---------- */
export function FinalCTA() {
  const t = useT();
  const { open } = useContact();
  return (
    <section className="relative py-24 md:py-32" id="contacto" aria-labelledby="cta-title">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="noise relative overflow-hidden rounded-3xl border border-border bg-card px-8 py-16 text-center md:px-16 md:py-24">
            <div className="pointer-events-none absolute inset-0 bg-mesh opacity-70" aria-hidden="true" />
            <div
              className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 bg-glow opacity-60"
              aria-hidden="true"
            />
            <div className="relative mx-auto max-w-2xl">
              <h2 id="cta-title" className="font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
                {t(finalCta.title1)} <span className="text-gradient">{t(finalCta.title2)}</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{t(finalCta.desc)}</p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Button onClick={open} size="lg">
                  {t(site.ui.empezar)} <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href={`mailto:${site.email}`} size="lg" variant="outline">
                  {site.email}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
