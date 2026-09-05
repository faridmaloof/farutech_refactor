/**
 * ServiceLandingPage — resuelve el slug (EN/ES) y renderiza la landing ÚNICA de
 * cada servicio (cada una con su propia composición, segmentos y personalidad).
 * Si el slug no existe → NotFound.
 */
import { lazy, Suspense } from "react";
import type { ComponentType } from "react";
import { useParams } from "react-router-dom";
import { NotFoundPage } from "../NotFoundPage";
import { services } from "../../content/servicesData";

const SoftwareDevelopmentPage = lazy(() =>
  import("./SoftwareDevelopmentPage").then((m) => ({ default: m.SoftwareDevelopmentPage }))
);
const SaaSPlatformsPage = lazy(() =>
  import("./SaaSPlatformsPage").then((m) => ({ default: m.SaaSPlatformsPage }))
);
const EnterpriseSolutionsPage = lazy(() =>
  import("./EnterpriseSolutionsPage").then((m) => ({ default: m.EnterpriseSolutionsPage }))
);
const AIAutomationPage = lazy(() =>
  import("./AIAutomationPage").then((m) => ({ default: m.AIAutomationPage }))
);
const ModernizationPage = lazy(() =>
  import("./ModernizationPage").then((m) => ({ default: m.ModernizationPage }))
);
const UXEngineeringPage = lazy(() =>
  import("./UXEngineeringPage").then((m) => ({ default: m.UXEngineeringPage }))
);

const PAGE_COMPONENTS: Record<string, ComponentType> = {
  "software-development": SoftwareDevelopmentPage,
  "saas-platforms": SaaSPlatformsPage,
  "enterprise-solutions": EnterpriseSolutionsPage,
  "ai-automation": AIAutomationPage,
  modernization: ModernizationPage,
  "ux-engineering": UXEngineeringPage,
};

export function ServiceLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const cap = services.find(
    (s) =>
      s.slug === slug ||
      s.slugEs === slug ||
      (s.slug === "ai-automation" && slug === "automatizacion-ia") ||
      (s.slug === "ux-engineering" && slug === "ingenieria-ux")
  );
  if (!cap) return <NotFoundPage />;

  const Page = PAGE_COMPONENTS[cap.slug] ?? SoftwareDevelopmentPage;
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <Page />
    </Suspense>
  );
}
