/**
 * ModernizationPage — landing única. Tema de migración: hero con timeline legacy→moderno,
 * segmentos de riesgos y estrategia de migración. Identidad ámbar #FFB020 + naranja.
 */
import { ArrowRight, ArrowRightLeft, History, Rocket, ShieldAlert } from "lucide-react";
import { useT } from "../../i18n";
import { useContact } from "../../components/contact";
import { Button, Reveal } from "../../components/primitives";
import { getService } from "../../content/servicesData";
import { ServiceScaffold } from "./ServiceScaffold";

const cap = getService("modernization")!;

export function ModernizationPage() {
  const t = useT();
  const { open } = useContact();

  const hero = (
    <section className="noise relative overflow-hidden pb-16 pt-12 md:pb-24" aria-labelledby="svc-title">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-80" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-16 h-[420px] w-[640px] -translate-x-1/2 rounded-full bg-glow opacity-50" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
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
          <div className="rounded-2xl border border-border bg-card/90 p-5 shadow-elevated backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="rounded-lg border border-border bg-surface/50 px-3 py-2 text-center">
                <History className="mx-auto h-5 w-5 text-muted-foreground" />
                <p className="mt-1 font-mono text-xs">Legacy</p>
              </div>
              <ArrowRightLeft className="h-5 w-5 text-[var(--accent-hex)]" />
              <div className="rounded-lg border border-[var(--accent-hex)]/40 bg-[var(--accent-hex)]/10 px-3 py-2 text-center">
                <Rocket className="mx-auto h-5 w-5 text-[var(--accent-hex)]" />
                <p className="mt-1 font-mono text-xs">Moderno</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Migramos sin reescrituras totales: evolucionamos el sistema por partes, sin detener tu operación.
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  const segments = [
    <section key="riesgos" className="relative py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-[var(--accent-hex)]" />
          <h2 className="font-display text-3xl font-semibold tracking-tight">El riesgo de no modernizar</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { title: "Deuda que se acumula", desc: "Cada cambio en sistemas viejos es más caro y arriesgado." },
            { title: "Stack sin soporte", desc: "Lenguajes y plataformas obsoletos sin actualizaciones de seguridad." },
            { title: "Imposible escalar", desc: "La infraestructura antigua frena el crecimiento y los nuevos productos." },
          ].map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.06}>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>,
    <section key="estrategia" className="relative bg-surface/40 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight">Estrategia de migración</h2>
        <div className="mt-10 space-y-4">
          {[
            { n: "01", title: "Inventario del sistema", desc: "Mapa de módulos, dependencias y puntos de acoplamiento." },
            { n: "02", title: "Estrangulamiento gradual", desc: "Reemplazamos pieza por pieza mientras el resto sigue vivo." },
            { n: "03", title: "Modernización de stack e infra", desc: "Contenedores, CI/CD y cloud sin interrumpir el servicio." },
            { n: "04", title: "Observabilidad y validación", desc: "Métricas, pruebas y cortes controlados en cada etapa." },
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * 0.05}>
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
