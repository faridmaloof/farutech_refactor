import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useT } from "../i18n";
import { Button } from "../components/primitives";

const nf = {
  title: { es: "Esta ruta no existe.", en: "This route doesn't exist." },
  desc: {
    es: "Puede que el enlace haya cambiado o que la página nunca haya existido. El resto del sitio sí está en producción.",
    en: "The link may have changed or the page may never have existed. The rest of the site is in production.",
  },
  back: { es: "Volver al inicio", en: "Back to home" },
};

export function NotFoundPage() {
  const t = useT();
  useDocumentMeta({ title: "404", description: t(nf.desc) });
  return (
    <section className="relative overflow-hidden py-32 md:py-44">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-50" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-6">
        <span className="font-mono text-6xl font-semibold text-spark md:text-8xl">404</span>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-5xl">{t(nf.title)}</h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">{t(nf.desc)}</p>
        <div className="mt-8">
          <Button to="/" size="lg">
            {t(nf.back)}
          </Button>
        </div>
      </div>
    </section>
  );
}
