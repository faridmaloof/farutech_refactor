import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { caseStudies } from "../content/work";
import { useContact } from "../components/contact";
import { ArrowRight } from "lucide-react";

export function CaseStudiesPage() {
  const { open } = useContact();
  useDocumentMeta({
    title: "Casos de Éxito",
    description: "Proyectos reales donde hemos implementado soluciones clave.",
    path: "/casos-de-exito",
  });
  
  return (
    <>
      <div className="relative overflow-hidden border-b border-border pb-16 pt-36 md:pt-44">
        <div className="pointer-events-none absolute inset-0 bg-mesh opacity-60" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            ~/farutech/casos-de-exito
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight md:text-6xl">
            Resultados que hablan
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Proyectos reales donde hemos implementado soluciones clave.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-16">
          {caseStudies.map((caseStudy) => (
            <div key={caseStudy.id} className="grid md:grid-cols-2 gap-12 items-center bg-card p-8 md:p-12 rounded-3xl border border-border">
              <div>
                <span className="text-sm font-mono text-muted-foreground uppercase">{caseStudy.industry}</span>
                <h2 className="text-3xl font-display font-bold mt-2 mb-6">{caseStudy.client}</h2>
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">El Reto</h3>
                  <p className="text-muted-foreground">{caseStudy.challenge}</p>
                </div>
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">La Solución</h3>
                  <p className="text-muted-foreground">{caseStudy.solution}</p>
                </div>
                <div className="mb-8">
                  <h3 className="font-semibold mb-2">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {caseStudy.stack.map(tech => (
                      <span key={tech} className="px-3 py-1 bg-surface rounded-full text-xs font-mono">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-surface/50 rounded-2xl p-8">
                <h3 className="font-semibold mb-6">Impacto</h3>
                <div className="grid gap-6">
                  {caseStudy.metrics.map(metric => (
                    <div key={metric.label}>
                      <div className="text-4xl font-display font-bold text-primary mb-1">{metric.value}</div>
                      <div className="text-sm text-muted-foreground">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl font-display font-bold mb-6">¿Tu proyecto es el siguiente?</h2>
          <button onClick={open} className="inline-flex items-center px-8 py-4 rounded-full font-medium bg-primary text-white hover:opacity-90 transition-opacity">
            Hablemos <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </section>
    </>
  );
}
