/**
 * Layout — Header (mega-menú de soluciones + selector de idioma), Footer y SiteLayout.
 * El CTA "Empezar un proyecto" abre el drawer de contacto (no navega a una página).
 */
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  Boxes,
  Layers,
  Building2,
  Sparkles,
  RefreshCw,
  Palette,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./primitives";
import { LanguageSwitcher, useT } from "../i18n";
import { useContact } from "./contact";
import { site } from "../content/site";
import { services } from "../content/servicesData";
import { cn } from "../lib/utils";

const CAP_ICONS: Record<string, LucideIcon> = {
  "software-development": Boxes,
  "saas-platforms": Layers,
  "enterprise-solutions": Building2,
  "ai-automation": Sparkles,
  modernization: RefreshCw,
  "ux-engineering": Palette,
};

const ui = {
  soluciones: { es: "Soluciones", en: "Solutions" },
  verTodas: { es: "Ver todas las soluciones", en: "View all solutions" },
};

function Header() {
  const t = useT();
  const { open } = useContact();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [solOpen, setSolOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openSol = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setSolOpen(true);
  };
  const scheduleCloseSol = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setSolOpen(false), 120);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled || solOpen ? "border-b border-border bg-background/85 backdrop-blur-xl" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-20">
        <Link to="/" className="flex items-center gap-2.5" aria-label="FaruTech">
          <Logo className="h-8 w-8" />
          <span className="font-display text-lg font-semibold tracking-tight">FaruTech</span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          <div className="relative" onMouseEnter={openSol} onMouseLeave={scheduleCloseSol}>
            <button
              onClick={() => setSolOpen((v) => !v)}
              aria-expanded={solOpen}
              className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(ui.soluciones)}
              <ChevronDown className={cn("h-4 w-4 transition-transform", solOpen && "rotate-180")} />
            </button>
            {solOpen && (
              <div className="absolute left-0 top-full w-[560px] pt-3">
                <div className="border-gradient overflow-hidden rounded-2xl border border-border bg-surface/95 p-3 shadow-elevated backdrop-blur-xl">
                  <div className="grid grid-cols-2 gap-1">
                    {services.map((c) => {
                      const Icon = CAP_ICONS[c.slug] ?? Boxes;
                      return (
                        <Link
                          key={c.slug}
                          to={`/services/${c.slug}`}
                          onClick={() => setSolOpen(false)}
                          className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-surface-elevated"
                        >
                          <span
                            className="mt-0.5 rounded-lg border border-border bg-background/60 p-2"
                            style={{ color: c.accent }}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span>
                            <span className="block text-sm font-medium group-hover:text-foreground">{t(c.name)}</span>
                            <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">{t(c.short)}</span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                  <Link
                    to="/services"
                    onClick={() => setSolOpen(false)}
                    className="mt-2 flex items-center justify-between rounded-xl border border-border bg-background/40 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t(ui.verTodas)} <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {site.nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(item.label)}
            </Link>
          ))}
          {site.flags.showEcosystemInNav && (
            <Link to="/ecosistema" className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
              Ecosistema
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden lg:inline-flex" />
          <Button onClick={open} size="sm" className="hidden lg:inline-flex">
            {t(site.ui.empezar)}
          </Button>
          <button
            className="rounded-md p-2 text-foreground lg:hidden"
            onClick={() => setOpenMenu((v) => !v)}
            aria-label={openMenu ? t(site.ui.cerrarMenu) : t(site.ui.abrirMenu)}
            aria-expanded={openMenu}
          >
            {openMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {openMenu && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col px-6 py-4" aria-label="Móvil">
            <div className="pb-1 pt-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              {t(ui.soluciones)}
            </div>
            {services.map((c) => {
              const Icon = CAP_ICONS[c.slug] ?? Boxes;
              return (
                <Link
                  key={c.slug}
                  to={`/services/${c.slug}`}
                  onClick={() => setOpenMenu(false)}
                  className="flex items-center gap-3 py-2.5 text-sm text-foreground"
                >
                  <Icon className="h-4 w-4" style={{ color: c.accent }} />
                  {t(c.name)}
                </Link>
              );
            })}
            <div className="mt-2 border-t border-border" />
            {site.nav.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setOpenMenu(false)} className="py-3 text-sm text-foreground">
                {t(item.label)}
              </Link>
            ))}
            <div className="mt-3 flex items-center justify-between gap-3">
              <Button
                onClick={() => {
                  setOpenMenu(false);
                  open();
                }}
                className="flex-1"
              >
                {t(site.ui.empezar)}
              </Button>
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const t = useT();
  const { open } = useContact();
  return (
    <footer className="relative mt-32 border-t border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo className="h-7 w-7" />
              <span className="font-display text-base font-semibold tracking-tight">FaruTech</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">{t(site.footer.blurb)}</p>
            <div className="mt-5">
              <LanguageSwitcher />
            </div>
          </div>

          <nav aria-label={t(site.footer.services)}>
            <h4 className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {t(site.footer.services)}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {services.map((c) => (
                <li key={c.slug}>
                  <Link to={`/services/${c.slug}`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {t(c.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t(site.footer.company)}>
            <h4 className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {t(site.footer.company)}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {site.nav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {t(item.label)}
                  </Link>
                </li>
              ))}
              {site.flags.showEcosystemInFooter && (
                <li>
                  <Link to="/ecosistema" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    Ecosistema <span className="ml-1 font-mono text-[10px] text-spark">{t(site.footer.proximamente)}</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <div>
            <h4 className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {t(site.footer.contact)}
            </h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href={`mailto:${site.email}`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {site.email}
                </a>
              </li>
              <li>
                <button onClick={open} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {t(site.ui.empezar)}
                </button>
              </li>
              <li className="text-sm text-muted-foreground">{t(site.location)}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 font-mono text-[11px] text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()} FaruTech. {t(site.footer.derechos)}
          </span>
          <span className="flex items-center gap-3">
            <Link to="/privacidad" className="transition-colors hover:text-foreground">{t(site.footer.privacidad)}</Link>
            <span aria-hidden="true">·</span>
            <Link to="/terminos" className="transition-colors hover:text-foreground">{t(site.footer.terminos)}</Link>
          </span>
          <span>{t(site.footer.hecho)}</span>
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">{children}</main>
      <Footer />
    </>
  );
}
