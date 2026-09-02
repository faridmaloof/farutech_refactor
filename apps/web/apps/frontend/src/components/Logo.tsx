/** Logo oficial de FaruTech (servido desde /public). */
export const LOGO_URL = "/logo.webp";

export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return <img src={LOGO_URL} alt="FaruTech" className={className} loading="eager" decoding="async" />;
}
