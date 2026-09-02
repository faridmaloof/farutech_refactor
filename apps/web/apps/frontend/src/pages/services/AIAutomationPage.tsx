/**
 * AIAutomationPage — landing única. Tema de automatización: hero con flujo de
 * IA, segmentos de casos de IA y ahorro operativo. Identidad teal #36E0C0 + azul.
 */
import { ArrowRight, BrainCircuit, Bot, Cpu, Workflow } from "lucide-react";
import { useT } from "../../i18n";
import { useContact } from "../../components/contact";
import { Button, Reveal } from "../../components/primitives";
import { getService } from "../../content/servicesData";
import { ServiceScaffold } from "./ServiceScaffold";

const cap = getService("ai-automation")!;

const casos = [
  { icon: Bot, title: "Chatbots y asistentes", desc: "Atención 24/7 que entiende el contexto de tus clientes." },
  { icon: Cpu, title: "Documentos e imágenes", desc: "OCR y extracción automática de datos de facturas y contratos." },
  { icon: Workflow, title: "Flujos autónomos", desc: "Automatización de tareas repetitivas entre sistemas." },
];

export function AIAutomationPage() {
  const t = useT();
  const { open } = useContact();

  const hero = (
    <section className="noise relative overflow-hidden pb-16 pt-12 md:pb-24" aria-labelledby="svc-title">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-80" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-8 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-glow opacity-50" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
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
            <div className="flex items-center gap-3">
              <BrainCircuit className="h-8 w-8 text-[var(--accent-hex)]" />
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Flujo de IA aplicada</p>
                <p className="text-sm font-semibold">Dato → Modelo → Acción</p>
              </div>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p><span className="font-mono text-[var(--accent-hex)]">1.</span> Extraemos y limpiamos tus datos</p>
              <p><span className="font-mono text-[var(--accent-hex)]">2.</span> Entrenamos o seleccionamos el modelo correcto</p>
              <p><span className="font-mono text-[var(--accent-hex)]">3.</span> Lo integramos a tu operación con supervisión humana</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const segments = [
    <section key="casos" className="relative py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight">IA con impacto real</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Nada de IA por moda: automatizamos procesos donde el retorno se mide en horas ganadas y errores evitados.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {casos.map((c, i) => (
            <Reveal key={c.title} delay={(i % 3) * 0.06}>
              <div className="rounded-2xl border border-border bg-card p-6">
                <c.icon className="h-6 w-6 text-[var(--accent-hex)]" />
                <h3 className="mt-3 font-display text-base font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>,
    <section key="roi" className="relative bg-surface/40 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight">Lo que tu equipo recupera</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { v: "-80%", l: "tareas manuales repetitivas" },
            { v: "24/7", l: "disponibilidad de asistentes" },
            { v: "0", l: "errores en captura de datos" },
          ].map((m, i) => (
            <Reveal key={m.l} delay={(i % 3) * 0.06}>
              <div className="rounded-2xl border border-border bg-card p-8 text-center">
                <p className="font-display text-5xl font-semibold text-[var(--accent-hex)]">{m.v}</p>
                <p className="mt-2 text-sm text-muted-foreground">{m.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>,
  ];

  return <ServiceScaffold cap={cap} hero={hero} segments={segments} />;
}
