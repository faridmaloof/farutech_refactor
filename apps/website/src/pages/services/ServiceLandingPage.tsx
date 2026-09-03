/**
 * ServiceLandingPage — resuelve el slug (EN/ES) y renderiza la landing ÚNICA de
 * cada servicio (cada una con su propia composición, segmentos y personalidad).
 * Si el slug no existe → NotFound.
 */
import { useParams } from "react-router-dom";
import { NotFoundPage } from "../NotFoundPage";
import { services } from "../../content/servicesData";
import { SoftwareDevelopmentPage } from "./SoftwareDevelopmentPage";
import { SaaSPlatformsPage } from "./SaaSPlatformsPage";
import { EnterpriseSolutionsPage } from "./EnterpriseSolutionsPage";
import { AIAutomationPage } from "./AIAutomationPage";
import { ModernizationPage } from "./ModernizationPage";
import { UXEngineeringPage } from "./UXEngineeringPage";

const PAGE_COMPONENTS: Record<string, () => JSX.Element> = {
  "software-development": SoftwareDevelopmentPage,
  "saas-platforms": SaaSPlatformsPage,
  "enterprise-solutions": EnterpriseSolutionsPage,
  "ai-automation": AIAutomationPage,
  modernization: ModernizationPage,
  "ux-engineering": UXEngineeringPage,
  // Mapeo de slugs en español
  "desarrollo-software": SoftwareDevelopmentPage,
  "plataformas-saas": SaaSPlatformsPage,
  "soluciones-empresariales": EnterpriseSolutionsPage,
  "automatizacion-ia": AIAutomationPage,
  modernizacion: ModernizationPage,
  "ingenieria-ux": UXEngineeringPage,
};

export function ServiceLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const cap = services.find((s) => s.slug === slug || s.slugEs === slug);
  if (!cap) return <NotFoundPage />;

  const Page = PAGE_COMPONENTS[cap.slug] ?? SoftwareDevelopmentPage;
  return <Page />;
}
