/**
 * App — providers (i18n + drawer de contacto) + rutas + layout.
 * El router lo pone el entrypoint: BrowserRouter en cliente, StaticRouter en el prerender SSR.
 * El contacto ya no es una página: es un drawer que se abre desde cualquier CTA.
 */
import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { I18nProvider } from "./i18n";
import type { Lang } from "./i18n";
import { ContactProvider } from "./components/contact";
import { SiteLayout } from "./components/layout";
import { HomePage } from "./pages/HomePage";

const ServicesHubPage = lazy(() => import("./pages/ServicesHubPage").then(m => ({ default: m.ServicesHubPage })));
const ServiceLandingPage = lazy(() => import("./pages/services/ServiceLandingPage").then(m => ({ default: m.ServiceLandingPage })));
const CaseStudiesPage = lazy(() => import("./pages/CaseStudiesPage").then(m => ({ default: m.CaseStudiesPage })));
const AboutUsPage = lazy(() => import("./pages/AboutUsPage").then(m => ({ default: m.AboutUsPage })));
const EcosystemPage = lazy(() => import("./pages/EcosystemPage").then(m => ({ default: m.EcosystemPage })));
const LegalPage = lazy(() => import("./pages/LegalPage").then(m => ({ default: m.LegalPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App({ initialLang }: { initialLang?: Lang }) {
  return (
    <I18nProvider initialLang={initialLang}>
      <ContactProvider>
        <SiteLayout>
          <ScrollToTop />
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />

              {/* Servicios — rutas EN canónicas (slugs en inglés) */}
              <Route path="/services" element={<ServicesHubPage />} />
              <Route path="/services/:slug" element={<ServiceLandingPage />} />

              {/* Servicios — rutas ES alternas (slugs en español) */}
              <Route path="/servicios" element={<ServicesHubPage />} />
              <Route path="/servicios/:slug" element={<ServiceLandingPage />} />

              {/* Casos de éxito y Nosotros */}
              <Route path="/case-studies" element={<CaseStudiesPage />} />
              <Route path="/casos-exito" element={<CaseStudiesPage />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/nosotros" element={<AboutUsPage />} />

              {/* Otras páginas con soporte bilingüe EN / ES */}
              <Route path="/ecosistema" element={<EcosystemPage />} />
              <Route path="/ecosystem" element={<EcosystemPage />} />
              <Route path="/privacidad" element={<LegalPage kind="privacidad" />} />
              <Route path="/privacy" element={<LegalPage kind="privacidad" />} />
              <Route path="/terminos" element={<LegalPage kind="terminos" />} />
              <Route path="/terms" element={<LegalPage kind="terminos" />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </SiteLayout>
      </ContactProvider>
    </I18nProvider>
  );
}
