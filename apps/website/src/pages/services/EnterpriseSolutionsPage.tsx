/**
 * EnterpriseSolutionsPage — landing única. Tema de integración: hero con flujo
 * ERP→CRM→Web, segmentos de romper silos y procesos conectados. Identidad naranja #FF7A1A + rosa.
 */
import { ArrowRight, Boxes, GitMerge, Workflow } from "lucide-react";
import { useT } from "../../i18n";
import { useContact } from "../../components/contact";
import { Button, Reveal } from "../../components/primitives";
import { getService } from "../../content/servicesData";
import { ServiceScaffold } from "./ServiceScaffold";

const cap = getService("enterprise-solutions")!;

const nodes = ["ERP", "CRM", "Web", "POS", "Bodega"];

export function EnterpriseSolutionsPage() {
  const t = useT();
  const { open } = useContact();

  const hero = (
    <section className="noise relative overflow-hidden pb-16 pt-12 md:pb-24" aria-labelledby="svc-title">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-80" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-10 h-[400px] w-[660px] -translate-x-1/2 rounded-full bg-glow opacity-50" aria-hidden="true" />
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
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Flujo de integración</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {nodes.map((n, i) => (
                <div key={n} className="flex items-center gap-2">
                  <div className="rounded-lg border border-border bg-surface/60 px-3 py-2 font-mono text-xs">{n}</div>
                  {i < nodes.length - 1 && <GitMerge className="h-4 w-4 text-[var(--accent-hex)]" />}
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg bg-[var(--accent-hex)]/10 px-4 py-3 text-sm text-foreground">
              Un solo origen de datos. El inventario, los precios y los pedidos siempre sincronizados.
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const segments = [
    <section key="silos" className="relative py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-3">
          <Boxes className="h-5 w-5 text-[var(--accent-hex)]" />
          <h2 className="font-display text-3xl font-semibold tracking-tight">Fuera los silos</h2>
        </div>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Cuando cada área usa una herramienta distinta sin conexión, la operación entera se ralentiza y comete errores. Lo conectamos todo.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { title: "Inventario unificado", desc: "Stock en tiempo real entre físico y digital." },
            { title: "Pedidos sin pérdidas", desc: "Se sincronizan entre turnos, canales y tiendas." },
            { title: "Decisiones con datos", desc: "Reportes consolidados sobre una sola fuente." },
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
    <section key="workflow" className="relative bg-surface/40 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-3">
          <Workflow className="h-5 w-5 text-[var(--accent-hex)]" />
          <h2 className="font-display text-3xl font-semibold tracking-tight">Procesos que se hacen cargo</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            { n: "01", title: "Auditamos tu operación", desc: "Mapeamos los puntos donde se pierde información." },
            { n: "02", title: "Diseñamos la integración", desc: "APIs, colas y sincronización entre sistemas." },
            { n: "03", title: "Capacitamos al equipo", desc: "Adopción en mostrador y en campo sin fricción." },
            { n: "04", title: "Monitoreamos", desc: "Observabilidad y soporte continuo post-lanzamiento." },
          ].map((s, i) => (
            <Reveal key={s.n} delay={(i % 2) * 0.06}>
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
