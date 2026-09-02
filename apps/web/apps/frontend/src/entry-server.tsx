/** Entry server — renderiza cada ruta a HTML estático (usado por scripts/prerender.mjs). */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";
import { detectRouteLang } from "./i18n";

export function render(url: string): string {
  // El HTML estático de cada ruta sale en el idioma implícito de su URL
  // (EN para /services/*, /case-studies…; ES para el resto), para que los
  // crawlers reciban contenido y meta ya traducidos.
  const lang = detectRouteLang(url);
  return renderToString(
    <StaticRouter location={url}>
      <App initialLang={lang} />
    </StaticRouter>
  );
}
