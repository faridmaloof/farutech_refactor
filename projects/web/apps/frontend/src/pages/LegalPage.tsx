import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useT } from "../i18n";
import { site } from "../content/site";

const legal = {
  privacidad: {
    title: { es: "Privacidad", en: "Privacy" },
    body: [
      {
        es: "Este sitio no usa cookies de rastreo ni vende datos. Solo guardamos tu preferencia de idioma en tu navegador (localStorage) para recordar el idioma que elegiste.",
        en: "This site doesn't use tracking cookies or sell data. We only store your language preference in your browser (localStorage) to remember the language you chose.",
      },
      {
        es: "El formulario de contacto abre tu propio cliente de correo con el mensaje listo; no almacenamos tus datos en nuestros servidores.",
        en: "The contact form opens your own mail client with the message ready; we don't store your data on our servers.",
      },
      {
        es: "Si en el futuro añadimos analítica, será una herramienta respetuosa con la privacidad, sin cookies de terceros ni rastreo entre sitios, y lo documentaremos aquí.",
        en: "If we add analytics in the future, it will be a privacy-respecting tool, with no third-party cookies or cross-site tracking, and we'll document it here.",
      },
    ],
  },
  terminos: {
    title: { es: "Términos de uso", en: "Terms of use" },
    body: [
      {
        es: "El contenido de este sitio es informativo. Los servicios y productos descritos se prestan bajo acuerdos específicos firmados con cada cliente.",
        en: "The content of this site is informational. The services and products described are provided under specific agreements signed with each client.",
      },
      {
        es: "Las marcas, textos y diseño de este sitio pertenecen a FaruTech. No está permitido su uso sin autorización.",
        en: "The brands, texts and design of this site belong to FaruTech. Use without authorization is not permitted.",
      },
      {
        es: "Este documento es una versión inicial y se actualizará a medida que el sitio y la plataforma evolucionen.",
        en: "This document is an initial version and will be updated as the site and platform evolve.",
      },
    ],
  },
};

export function LegalPage({ kind }: { kind: "privacidad" | "terminos" }) {
  const t = useT();
  const data = legal[kind];
  useDocumentMeta({
    title: t(data.title),
    description: t(data.body[0]),
    path: `/${kind}`,
  });
  return (
    <>
      <div className="relative overflow-hidden border-b border-border pb-16 pt-36 md:pt-44">
        <div className="pointer-events-none absolute inset-0 bg-mesh opacity-60" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            ~/farutech/{kind}
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-6xl">{t(data.title)}</h1>
        </div>
      </div>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="space-y-5 text-muted-foreground">
            {data.body.map((p, i) => (
              <p key={i} className="leading-relaxed">
                {t(p)}
              </p>
            ))}
          </div>
          <p className="mt-10 text-sm text-muted-foreground">
            {t({ es: "¿Dudas? Escríbenos a", en: "Questions? Write to us at" })}{" "}
            <a href={`mailto:${site.email}`} className="font-semibold text-primary hover:underline">
              {site.email}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
