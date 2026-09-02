/**
 * Prerender estático. Genera HTML indexable por ruta (SEO-first).
 *
 * Uso:  npm run build:seo
 *   = vite build                       (cliente)
 *   + vite build --ssr entry-server    (bundle SSR)
 *   + node scripts/prerender.mjs       (este script)
 *
 * Resultado: dist/<ruta>/index.html con el contenido ya renderizado + meta por ruta,
 * listo para servir desde cualquier hosting estático/CDN.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.resolve(root, "dist");

const template = fs.readFileSync(path.resolve(dist, "index.html"), "utf-8");
const serverBundlePath = path.resolve(dist, "server", "entry-server.js");
const serverBundleUrl = new URL(`file://${serverBundlePath.replace(/\\/g, "/")}`);
const { render } = await import(serverBundleUrl);

const SITE = "https://www.farutech.com";
const BRAND = "FaruTech";

/** Slugs oficiales de servicios (deben coincidir con servicesData.ts).
 *  Canonical EN vive en `/services/<slug>`; el alias ES en `/servicios/<slugEs>`.
 */
const services = [
  { slug: "software-development", slugEs: "desarrollo-software", nameEn: "Custom Software Development", nameEs: "Desarrollo de Software a Medida" },
  { slug: "saas-platforms", slugEs: "plataformas-saas", nameEn: "SaaS & Multi-Tenant Platforms", nameEs: "Plataformas SaaS y Multi-Tenant" },
  { slug: "enterprise-solutions", slugEs: "soluciones-empresariales", nameEn: "Enterprise Solutions", nameEs: "Soluciones Empresariales" },
  { slug: "ai-automation", slugEs: "ia-automatizacion", nameEn: "AI & Automation", nameEs: "IA y Automatización" },
  { slug: "modernization", slugEs: "modernizacion", nameEn: "Technology Modernization", nameEs: "Modernización Tecnológica" },
  { slug: "ux-engineering", slugEs: "ux-engineering", nameEn: "UX Engineering", nameEs: "UX Engineering" },
];

/** title + description por ruta (se inyectan en el HTML estático). */
const routeMeta = {
  "/": {
    title: `${BRAND} · Desarrollo de software a medida y plataformas SaaS`,
    description:
      "Desarrollo de software a medida, plataformas SaaS multi-tenant y soluciones empresariales. Ingeniería senior desde Colombia. Bogotá · Cali · Remoto.",
  },
  "/services": {
    title: `Services · ${BRAND}`,
    description:
      "Five engineering disciplines: custom development, multi-tenant SaaS, enterprise solutions, AI & automation, and UX Engineering.",
  },
  "/servicios": {
    title: `Servicios · ${BRAND}`,
    description:
      "Cinco disciplinas de ingeniería: desarrollo a medida, SaaS multi-tenant, soluciones empresariales, IA y automatización, y UX Engineering.",
  },
  "/case-studies": {
    title: `Case Studies · ${BRAND}`,
    description: "Real work with real clients: Afilamos Hermanos and Supraeventos. Technology stack and measurable impact.",
  },
  "/casos-exito": {
    title: `Casos de Éxito · ${BRAND}`,
    description: "Trabajo real con clientes reales: Afilamos Hermanos y Supraeventos. Stack tecnológico e impacto medible.",
  },
  "/about-us": {
    title: `About Us · ${BRAND}`,
    description: "An engineering collective first. Distributed by design, with presence in Bogotá and Cali.",
  },
  "/nosotros": {
    title: `Nosotros · ${BRAND}`,
    description: "Un colectivo de ingeniería, primero. Distribuidos por diseño, con presencia en Bogotá y Cali.",
  },
  "/ecosistema": {
    title: `Ecosistema · ${BRAND}`,
    description:
      "El front door de un ecosistema en construcción: plataforma multi-tenant, marketplace y portal de clientes.",
  },
  "/privacidad": {
    title: `Privacidad · ${BRAND}`,
    description: "Política de privacidad de FaruTech. Sin cookies de rastreo, sin venta de datos.",
  },
  "/terminos": {
    title: `Términos de uso · ${BRAND}`,
    description: "Términos de uso del sitio de FaruTech.",
  },
};

// Add service routes in both languages (canonical EN in /services, ES alias in /servicios)
for (const s of services) {
  routeMeta[`/services/${s.slug}`] = {
    title: `${s.nameEn} · ${BRAND}`,
    description: `${s.nameEn} at ${BRAND}. Senior engineering, from the first commit to the runbook.`,
  };
  routeMeta[`/servicios/${s.slugEs}`] = {
    title: `${s.nameEs} · ${BRAND}`,
    description: `${s.nameEs} en ${BRAND}. Ingeniería senior, desde el primer commit hasta el runbook.`,
  };
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/**
 * Construye pares de URLs canónicas y alternas para hreflang.
 * Cada ruta EN tiene su equivalente ES y viceversa.
 */
function getHreflangPairs(url) {
  const pairs = [];
  
  // Mapeo de rutas EN ↔ ES
  const langMap = {
    "/": { es: "/", en: "/" },
    "/services": { es: "/servicios", en: "/services" },
    "/servicios": { es: "/servicios", en: "/services" },
    "/case-studies": { es: "/casos-exito", en: "/case-studies" },
    "/casos-exito": { es: "/casos-exito", en: "/case-studies" },
    "/about-us": { es: "/nosotros", en: "/about-us" },
    "/nosotros": { es: "/nosotros", en: "/about-us" },
    "/ecosistema": { es: "/ecosistema", en: "/ecosistema" },
    "/privacidad": { es: "/privacidad", en: "/privacidad" },
    "/terminos": { es: "/terminos", en: "/terminos" },
  };
  
  // Servicios
  for (const s of services) {
    langMap[`/services/${s.slug}`] = { es: `/servicios/${s.slugEs}`, en: `/services/${s.slug}` };
    langMap[`/servicios/${s.slugEs}`] = { es: `/servicios/${s.slugEs}`, en: `/services/${s.slug}` };
  }
  
  const mapping = langMap[url];
  if (mapping) {
    pairs.push({ lang: "es", url: `${SITE}${mapping.es}` });
    pairs.push({ lang: "en", url: `${SITE}${mapping.en}` });
    pairs.push({ lang: "x-default", url: `${SITE}${mapping.en}` }); // default = inglés (canónico)
  }
  
  return pairs;
}

function buildHtml(url) {
  const appHtml = render(url);
  const meta = routeMeta[url] || routeMeta["/"];
  const canonical = `${SITE}${url}`;
  const hreflangPairs = getHreflangPairs(url);

  let html = template.replace(`<div id="root"></div>`, `<div id="root">${appHtml}</div>`);
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`);
  html = html.replace(/<meta[^>]*name="description"[^>]*>/, `<meta name="description" content="${esc(meta.description)}" />`);
  
  // Hreflang tags
  const hreflangTags = hreflangPairs
    .map(({ lang, url }) => `<link rel="alternate" hreflang="${lang}" href="${url}" />`)
    .join("\n    ");
  
  // Canonical + Hreflang (reemplazar todo el bloque de canonical e insertar hreflang después)
  const canonicalLine = `<link rel="canonical" href="${canonical}" />`;
  const canonicalBlock = hreflangPairs.length > 0
    ? `${canonicalLine}\n    ${hreflangTags}`
    : canonicalLine;
    
  html = html.replace(/<link[^>]*rel="canonical"[^>]*>/, canonicalBlock);
  
  // Open Graph
  html = html.replace(/<meta[^>]*property="og:url"[^>]*>/, `<meta property="og:url" content="${canonical}" />`);
  html = html.replace(/<meta[^>]*property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(meta.title)}" />`);
  html = html.replace(/<meta[^>]*property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(meta.description)}" />`);
  return html;
}

let count = 0;
for (const url of Object.keys(routeMeta)) {
  const html = buildHtml(url);
  const dir = url === "/" ? dist : path.resolve(dist, url.slice(1));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.resolve(dir, "index.html"), html);
  count++;
  console.log(`  ✓ ${url}`);
}

console.log(`\nPrerender completado: ${count} rutas con HTML estático → dist/`);
