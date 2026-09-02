/**
 * SaaSPlatformsPage — landing única. Tema de arquitectura: hero con diagrama de
 * multi-tenant, segmentos de arquitectura y escalado. Identidad esmeralda #22E07C + teal.
 */
import { ArrowRight, Cloud, Database, Layers, Scale } from "lucide-react";
import { useT } from "../../i18n";
import { useContact } from "../../components/contact";
import { Button, Reveal } from "../../components/primitives";
import { getService } from "../../content/servicesData";
import { ServiceScaffold } from "./ServiceScaffold";

const cap = getService("saas-platforms")!;

const layers = [
  { icon: Cloud, title: "Presentación", desc: "Web apps y APIs por tenant con aislamiento real." },
  { icon: Database, title: "Datos", desc: "Bases por inquilino o sharding por región según tu modelo." },
  { icon: Scale, title: "Escala", desc: "Autoescalado horizontal en picos de demanda sin downtime." },
];

export function SaaSPlatformsPage() {
  const t = useT();
  const { open } = useContact();

  const hero = (
    <section className="noise relative overflow-hidden pb-16 pt-12 md:pb-24" aria-labelledby="svc-title">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-80" aria-hidden="true" />
      <div className="pointer-events-none absolute right-0 top-24 h-[420px] w-[560px] -translate-y-1/2 rounded-full bg-glow opacity-50" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="order-2 lg:order-1">
            {/* Diagrama de nubes de tenants */}
            <div className="grid grid-cols-3 gap-3">
              {["Tenant A", "Tenant B", "Tenant C"].map((tenant) => (
                <div key={tenant} className="rounded-xl border border-border bg-card p-4 text-center shadow-elevated">
                  <Cloud className="mx-auto h-6 w-6 text-[var(--accent-hex)]" />
                  <p className="mt-2 font-mono text-xs">{tenant}</p>
                  <div className="mt-3 h-1.5 w-full rounded bg-surface/80">
                    <div className="h-full w-3/4 rounded bg-[var(--accent-hex)]/70" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent-hex)]" aria-hidden="true" />
              {t(cap.name)}
            </span>
            <h1 id="svc-title" className="mt-6 font-display text-4xl font-semibold leading-[0.98] tracking-tight md:text-6xl">
              {t(cap.name)}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{t(cap.intro)}</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button onClick={open} size="lg">Empezar un proyecto <ArrowRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const segments = [
    <section key="layers" className="relative py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight">Arquitectura multi-tenant</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Aislamiento por organización, autenticación única (SSO) y datos separados. Diseñamos el modelo que mejor encaja con tu producto.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {layers.map((l, i) => (
            <Reveal key={l.title} delay={(i % 3) * 0.06}>
              <div className="rounded-2xl border border-border bg-card p-6">
                <l.icon className="h-6 w-6 text-[var(--accent-hex)]" />
                <h3 className="mt-3 font-display text-base font-semibold">{l.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{l.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>,
    <section key="escala" className="relative bg-surface/40 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-3">
          <Layers className="h-5 w-5 text-[var(--accent-hex)]" />
          <h2 className="font-display text-3xl font-semibold tracking-tight">Del MVP al multicliente</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { n: "01", title: "Onboarding", desc: "Autoservicio y aprovisionamiento de instancias por cliente." },
            { n: "02", title: "Facturación", desc: "Planes, licencias y cobros integrados a tu pasarela." },
            { n: "03", title: "Clusters", desc: "Varios tenants por clúster para optimizar coste sin sacrificar aislamiento." },
          ].map((s, i) => (
            <Reveal key={s.n} delay={(i % 3) * 0.06}>
              <div className="rounded-2xl border border-border bg-card p-6">
                <span className="font-mono text-2xl font-semibold text-[var(--accent-hex)]">{s.n}</span>
                <h3 className="mt-2 font-display text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>,
  ];

  return <ServiceScaffold cap={cap} hero={hero} segments={segments} />;
}
