/** Configuración global del sitio + feature flags (contenido oculto pero habilitable). */
import type { L } from "../i18n";

export const site = {
  name: "FaruTech",
  domain: "https://www.farutech.com",
  email: "contacto@farutech.com",
  location: { es: "Bogotá · Cali · Remoto", en: "Bogotá · Cali · Remote" } satisfies L,
  claim: { es: "Ingeniería de software a medida", en: "Custom software engineering" } satisfies L,
  /**
   * Feature flags: el contenido futuro existe (rutas) pero no se expone hasta su
   * lanzamiento. Cambia a `true` para habilitar.
   */
  flags: {
    showEcosystemInNav: false,
    showEcosystemInFooter: true,
    showCareers: false,
    showStack: false,
  },
  nav: [
    { label: { es: "Servicios", en: "Services" } satisfies L, to: "/servicios" },
    { label: { es: "Nosotros", en: "About Us" } satisfies L, to: "/nosotros" },
  ],
  ui: {
    empezar: { es: "Empezar un proyecto", en: "Start a project" } satisfies L,
    menu: { es: "Menú", en: "Menu" },
    cerrar: { es: "Cerrar", en: "Close" },
    abrirMenu: { es: "Abrir menú", en: "Open menu" },
    cerrarMenu: { es: "Cerrar menú", en: "Close menu" },
  },
  footer: {
    blurb: {
      es: "Construimos plataformas que tienen que escalar, de verdad. Ingeniería de software a medida desde Colombia para el mundo.",
      en: "We build platforms that actually have to scale. Custom software engineering from Colombia to the world.",
    } satisfies L,
    services: { es: "Servicios", en: "Services" } satisfies L,
    company: { es: "Compañía", en: "Company" } satisfies L,
    contact: { es: "Contacto", en: "Contact" } satisfies L,
    derechos: { es: "Ingeniería de software a medida.", en: "Custom software engineering." } satisfies L,
    hecho: { es: "Hecho con ingeniería en Colombia.", en: "Engineered in Colombia." } satisfies L,
    privacidad: { es: "Privacidad", en: "Privacy" } satisfies L,
    terminos: { es: "Términos", en: "Terms" } satisfies L,
    proximamente: { es: "próximamente", en: "coming soon" } satisfies L,
  },
};
