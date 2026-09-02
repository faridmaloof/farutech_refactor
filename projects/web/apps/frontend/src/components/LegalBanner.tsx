/**
 * LegalBanner — banner de consentimiento legal (cookies / privacidad).
 * Requisitos del plan:
 *  - Aparece al primer load de página (si no hay consentimiento previo).
 *  - Visible mínimo 10 segundos con barra de progreso.
 *  - Botones: "Aceptar todo" y "Personalizar" (requiere aceptar privacidad).
 *  - La aceptación se guarda en localStorage → `ft.legalAccepted` (timestamp).
 *  - El envío de datos del formulario de contacto requiere consentimiento previo.
 */
import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import { useT } from "../i18n";
import type { L } from "../i18n";

const copy = {
  title: {
    es: "Este sitio usa cookies y datos de navegación",
    en: "This site uses cookies and browsing data",
  } satisfies L,
  body: {
    es: "Usamos cookies funcionales y de preferencia (idioma) para que el sitio funcione y para recordar tu elección. No usamos cookies de rastreo ni vendemos datos. Consulta nuestra Política de privacidad y Términos de uso.",
    en: "We use functional and preference cookies (language) for the site to work and to remember your choice. We do not use tracking cookies or sell data. See our Privacy Policy and Terms of use.",
  } satisfies L,
  acceptAll: { es: "Aceptar todo", en: "Accept all" } satisfies L,
  customize: { es: "Personalizar", en: "Customize" } satisfies L,
  privacy: { es: "Privacidad", en: "Privacy" } satisfies L,
  terms: { es: "Términos", en: "Terms" } satisfies L,
  close: { es: "Cerrar", en: "Close" } satisfies L,
  countdown: { es: "Cerrando automáticamente en", en: "Closing automatically in" } satisfies L,
};

const MIN_VISIBLE_SECONDS = 10;

export function LegalBanner() {
  const t = useT();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const dismissed = localStorage.getItem("ft.legalDismissed") === "true";
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (dismissed) return;
    const stored = localStorage.getItem("ft.legalAccepted");
    const acceptedBefore = stored ? JSON.parse(stored).accepted === true : false;
    if (acceptedBefore) return;

    setVisible(true);
    startRef.current = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / (MIN_VISIBLE_SECONDS * 1000)) * 100, 100);
      setProgress(pct);
    }, 100);
    timerRef.current = interval;

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [dismissed]);

  const saveAcceptance = (all: boolean) => {
    const payload = all
      ? { accepted: true, timestamp: Date.now(), choices: { all: true } }
      : { accepted: true, timestamp: Date.now(), choices: { all: false, analytics: false } };
    localStorage.setItem("ft.legalAccepted", JSON.stringify(payload));
    if (timerRef.current) clearInterval(timerRef.current);
    setVisible(false);
  };

  const handleDismiss = () => {
    if (progress < 100) return;
    localStorage.setItem("ft.legalDismissed", "true");
    if (timerRef.current) clearInterval(timerRef.current);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 backdrop-blur-xl shadow-elevated"
      role="dialog"
      aria-live="polite"
      aria-label={t(copy.title)}
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              ~/legal
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">{t(copy.title)}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {t(copy.body)}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => saveAcceptance(false)}
              className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t(copy.customize)}
            </button>
            <button
              type="button"
              onClick={() => saveAcceptance(true)}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-all hover:bg-foreground/90"
            >
              {t(copy.acceptAll)}
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              disabled={progress < 100}
              className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
              aria-label={t(copy.close)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Barra de progreso mínima 10 segundos */}
        <div className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{ width: `${progress}%`, backgroundColor: "var(--color-accent)" }}
            aria-hidden="true"
          />
        </div>
        <p className="mt-1 font-mono text-[10px] text-muted-foreground">
          {t(copy.countdown)} {Math.ceil((100 - progress) / 10)}s
        </p>
      </div>
    </div>
  );
}
