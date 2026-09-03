/**
 * i18n — internacionalización ligera (es/en), sin dependencias externas.
 *
 * - es-first: el prerender SSR genera español; el cliente detecta el idioma y cambia.
 * - Cada texto traducible es un objeto `{ es, en }` (ver src/content/*).
 * - `useT()` devuelve una función `t()` que resuelve un texto al idioma actual.
 */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";

export type L = { es: string; en: string };
export type Lang = "es" | "en";

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const I18nContext = createContext<I18nValue>({ lang: "es", setLang: () => {} });

function applyLang(l: Lang) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = l === "es" ? "es-CO" : "en";
  }
}

/**
 * Detecta el idioma implícito de una ruta bilingüe.
 * Las rutas EN usan prefijos ingleses (/services, /case-studies, /about-us…);
 * todo lo demás es español. Se usa en el prerender/SSR y en el primer render
 * del cliente para que el HTML estático y la hidratación coincidan.
 */
export function detectRouteLang(pathname: string): Lang {
  const EN_PREFIXES = ["/services", "/case-studies", "/about-us", "/privacy", "/terms"];
  const hit = EN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  return hit ? "en" : "es";
}

export function I18nProvider({ children, initialLang }: { children: ReactNode; initialLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(initialLang ?? "es");

  useEffect(() => {
    let detected: Lang = "es";
    try {
      const stored = window.localStorage.getItem("ft.lang");
      if (stored === "es" || stored === "en") {
        detected = stored;
      } else {
        const nav = (window.navigator.language || "es").slice(0, 2).toLowerCase();
        detected = nav === "en" ? "en" : "es";
      }
    } catch {
      detected = "es";
    }
    setLangState(detected);
    applyLang(detected);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem("ft.lang", l);
    } catch {
      /* noop */
    }
    applyLang(l);
  }, []);

  return <I18nContext.Provider value={{ lang, setLang }}>{children}</I18nContext.Provider>;
}

export function useLang() {
  return useContext(I18nContext);
}

/** Resuelve un texto `{ es, en }` (o un string plano) al idioma actual. */
export function useT() {
  const { lang } = useLang();
  return useCallback(
    (l: L | string): string => {
      if (typeof l === "string") return l;
      if (!l) return "";
      return l[lang] ?? l.es;
    },
    [lang]
  );
}

/* ---------- LanguageSwitcher (ES / EN) ---------- */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  const langs: Lang[] = ["es", "en"];
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface/50 p-0.5 font-mono text-[11px]",
        className
      )}
      role="group"
      aria-label="Language / Idioma"
    >
      {langs.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            "rounded-full px-2.5 py-1 uppercase tracking-wider transition-colors",
            lang === l ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
