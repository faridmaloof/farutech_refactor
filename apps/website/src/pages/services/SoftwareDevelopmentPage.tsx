/**
 * SoftwareDevelopmentPage — landing única. Tema técnico: hero con terminal,
 * segmentos de tech stack y timeline de milestones. Identidad cian #3FC1FF + púrpura.
 */
import { ArrowRight, Boxes, GitCommitHorizontal, ShieldCheck } from "lucide-react";
import { useT } from "../../i18n";
import { useContact } from "../../components/contact";
import { Button, Reveal } from "../../components/primitives";
import { getService } from "../../content/servicesData";
import { ServiceScaffold } from "./ServiceScaffold";

const cap = getService("software-development")!;

const stack = [
  { group: "Frontend", items: "React · Next.js · Vue · TypeScript" },
  { group: "Backend", items: "Node.js · PHP · Python · Go" },
  { group: "Datos", items: "PostgreSQL · MySQL · MongoDB · Redis" },
  { group: "Infra", items: "Docker · AWS · CI/CD · Terraform" },
];

export function SoftwareDevelopmentPage() {
  const t = useT();
  const { open } = useContact();

  const hero = (
    <section className="noise relative overflow-hidden pb-16 pt-12 md:pb-24" aria-labelledby="svc-title">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-80" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-16 h-[440px] w-[680px] -translate-x-1/2 rounded-full bg-glow opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent-hex)]" aria-hidden="true" />
              {t(cap.flag!)}
            </span>
            <h1 id="svc-title" className="mt-6 font-display text-4xl font-semibold leading-[0.98] tracking-tight md:text-6xl">
              {t(cap.name)}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{t(cap.intro)}</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button onClick={open} size="lg">Empezar un proyecto <ArrowRight className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card/90 p-4 font-mono text-xs shadow-elevated backdrop-blur">
            <div className="flex items-center gap-1.5 border-b border-border pb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent-hex)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent2-hex)]" />
              <span className="ml-2 text-muted-foreground">farutech · build</span>
            </div>
            <div className="space-y-1.5 pt-4 leading-relaxed text-muted-foreground">
              <p><span className="text-[var(--accent-hex)]">$</span> git init production-ready</p>
              <p><span className="text-[var(--accent-hex)]">$</span> npm run ship --from=day-one</p>
              <p><span className="text-[var(--accent-hex)]">✓</span> <span className="text-[var(--color-emerald)]">ready to build → production</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const segments = [
    <section key="stack" className="relative py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-3">
          <Boxes className="h-5 w-5 text-[var(--accent-hex)]" />
          <h2 className="font-display text-3xl font-semibold tracking-tight">Stack probado</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stack.map((s, i) => (
            <Reveal key={s.group} delay={(i % 4) * 0.06}>
              <div className="rounded-2xl border border-border bg-surface/40 p-6">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent-hex)]">{s.group}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground">{s.items}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>,
    <section key="principles" className="relative bg-surface/40 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-[var(--accent-hex)]" />
          <h2 className="font-display text-3xl font-semibold tracking-tight">Garantías de ingeniería</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { icon: GitCommitHorizontal, title: "Producción desde el primer commit", desc: "CI/CD desde el día uno; el software se usa, no se espera." },
            { icon: ShieldCheck, title: "ADR documentados", desc: "Cada decisión de arquitectura queda escrita y justificada." },
            { icon: Boxes, title: "Código que hereda tu equipo", desc: "Estándares claros para que el sistema sobreviva a sus autores." },
          ].map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.06}>
              <div className="rounded-2xl border border-border bg-card p-6">
                <f.icon className="h-5 w-5 text-[var(--accent-hex)]" />
                <h3 className="mt-3 font-display text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>,
  ];

  return <ServiceScaffold cap={cap} hero={hero} segments={segments} />;
}
