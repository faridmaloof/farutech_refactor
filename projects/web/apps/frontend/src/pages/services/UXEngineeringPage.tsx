/**
 * UXEngineeringPage — landing única. Tema de diseño/creativo: hero con tokens de
 * design system, segmentos de principios y antes/después. Identidad violeta #B66BFF + rosa.
 */
import { ArrowRight, Contrast, Layers, Palette, SwatchBook } from "lucide-react";
import { useT } from "../../i18n";
import { useContact } from "../../components/contact";
import { Button, Reveal } from "../../components/primitives";
import { getService } from "../../content/servicesData";
import { ServiceScaffold } from "./ServiceScaffold";

const cap = getService("ux-engineering")!;

export function UXEngineeringPage() {
  const t = useT();
  const { open } = useContact();

  const hero = (
    <section className="noise relative overflow-hidden pb-16 pt-12 md:pb-24" aria-labelledby="svc-title">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-80" aria-hidden="true" />
      <div className="pointer-events-none absolute right-0 top-16 h-[420px] w-[560px] rounded-full bg-glow opacity-50" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="order-2 lg:order-1">
            {/* Paleta de tokens */}
            <div className="rounded-2xl border border-border bg-card/90 p-5 shadow-elevated backdrop-blur">
              <SwatchBook className="h-6 w-6 text-[var(--accent-hex)]" />
              <div className="mt-4 flex gap-3">
                {["var(--accent-hex)", "var(--accent2-hex)", "var(--color-primary)", "var(--color-emerald)"].map((c, i) => (
                  <div key={i} className="flex-1">
                    <div className="h-14 rounded-lg" style={{ backgroundColor: c }} />
                    <p className="mt-1 text-center font-mono text-[10px] text-muted-foreground">Token {i + 1}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Design system con tokens compartidos: consistencia en cada pantalla y producto.
              </p>
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
    <section key="principios" className="relative py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight">Diseño con rigor de ingeniería</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { icon: Contrast, title: "Accesible", desc: "WCAG 2.2 AA: contraste, foco y lectores de pantalla." },
            { icon: Layers, title: "Consistente", desc: "Design systems que tu equipo puede mantener." },
            { icon: Palette, title: "Rápido", desc: "Core Web Vitals en verde como requisito, no meta." },
          ].map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.06}>
              <div className="rounded-2xl border border-border bg-card p-6">
                <f.icon className="h-6 w-6 text-[var(--accent-hex)]" />
                <h3 className="mt-3 font-display text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>,
    <section key="proceso" className="relative bg-surface/40 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight">De lo diseñado a lo construido</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            { n: "01", title: "Auditoría de UX y accesibilidad", desc: "Identificamos lo que frena conversión y cumple." },
            { n: "02", title: "Design system", desc: "Tokens y componentes reutilizables documentados." },
            { n: "03", title: "Implementación fiel", desc: "Diseñamos para que lo visto sea lo construido." },
            { n: "04", title: "Validación continua", desc: "Pruebas con usuarios y métricas de rendimiento." },
          ].map((s, i) => (
            <Reveal key={s.n} delay={(i % 2) * 0.06}>
              <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
                <span className="font-mono text-xl font-semibold text-[var(--accent-hex)]">{s.n}</span>
                <div>
                  <h3 className="font-display text-base font-semibold">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>,
  ];

  return <ServiceScaffold cap={cap} hero={hero} segments={segments} />;
}
