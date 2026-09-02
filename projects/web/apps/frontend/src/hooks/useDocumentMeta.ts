import { useEffect } from "react";

const SITE_NAME = "FaruTech";
const ORIGIN = "https://www.farutech.com";

interface MetaInput {
  /** Título de la página (sin el sufijo del sitio). */
  title?: string;
  description: string;
  /** Ruta interna, p. ej. "/services". Se usa para canonical y og:url. */
  path?: string;
  /** Imagen para Open Graph / Twitter Card. */
  ogImage?: string;
  /** Tipo de página para og:type. */
  type?: "website" | "article" | "service";
  /** Keywords adicionales. */
  keywords?: string[];
}

/**
 * SEO por ruta en el cliente: title, description, Open Graph, Twitter Cards y canonical.
 * Nota: esto cubre crawlers que ejecutan JS. El prerender estático
 * (scripts/prerender.mjs) genera HTML indexable sin JS.
 */
export function useDocumentMeta({
  title,
  description,
  path,
  ogImage = "/og-image.jpg",
  type = "website",
  keywords = [],
}: MetaInput) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} · ${SITE_NAME}`
      : `${SITE_NAME} · Desarrollo de software a medida y plataformas SaaS`;

    const canonicalUrl = path ? `${ORIGIN}${path}` : window.location.href;
    const fullOgImage = ogImage.startsWith("http") ? ogImage : `${ORIGIN}${ogImage}`;

    document.title = fullTitle;

    // Meta básicos
    upsertMeta("name", "description", description);
    if (keywords.length > 0) {
      upsertMeta("name", "keywords", keywords.join(", "));
    }
    upsertMeta("name", "author", SITE_NAME);

    // Canonical
    upsertLink("canonical", canonicalUrl);

    // Open Graph
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", fullOgImage);
    upsertMeta("property", "og:site_name", SITE_NAME);

    // Twitter Card
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", fullOgImage);
  }, [title, description, path, ogImage, type, keywords]);
}

function upsertMeta(kind: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${kind}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(kind, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}