import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useT } from "../i18n";
import { studioPage } from "../content/studio";
import { Reveal, Eyebrow } from "../components/primitives";

export function AboutUsPage() {
  const t = useT();
  useDocumentMeta({
    title: t(studioPage.eyebrow),
    description: t(studioPage.lede),
    path: "/about-us",
  });
  return (
    <>
      <div className="relative overflow-hidden border-b border-border pb-16 pt-36 md:pt-44">
        <div className="pointer-events-none absolute inset-0 bg-mesh opacity-60" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            ~/farutech/studio
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight md:text-6xl">
            {t(studioPage.title)}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{t(studioPage.lede)}</p>
        </div>
      </div>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl space-y-5 text-muted-foreground">
            {studioPage.paragraphs.map((p, i) => (
              <p key={i} className="leading-relaxed">
                {t(p)}
              </p>
            ))}
          </div>

          <div className="mt-20">
            <Eyebrow>{t(studioPage.presence.eyebrow)}</Eyebrow>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight md:text-3xl">
              {t(studioPage.presence.title)}
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {studioPage.presence.items.map((item) => (
                <Reveal key={item.place.es} className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-display text-lg font-semibold tracking-tight">{t(item.place)}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t(item.note)}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-20">
            <Eyebrow>{t(studioPage.valuesTitle)}</Eyebrow>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {studioPage.values.map((v) => (
                <Reveal key={v.title.es} className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-display text-lg font-semibold tracking-tight">{t(v.title)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(v.desc)}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
