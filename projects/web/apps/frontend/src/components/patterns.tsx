/**
 * Patterns — composiciones reutilizables: motifs de capacidad, cards, caso y marquee.
 * Los motifs replican la personalidad visual del refactor (grid/spectrum/blueprint/orbit/circuit).
 */
import { useId } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Service, ServiceMotif as MotifKind } from "../content/servicesData";
import { servicesUI } from "../content/servicesData";
import caseStudies from "../content/work";
import type { L } from "../i18n";
import { useT } from "../i18n";
import { Button, StatusBadge, Tag } from "./primitives";
import { cn } from "../lib/utils";

// Case study data for TrustBanner - using first two cases from the list
const afilamos = caseStudies[0];
const supraeventos = caseStudies[1];

// UI labels for case studies (bilingual)
const workUi = {
  casoReal: { es: "Caso real", en: "Real case" } satisfies L,
  visitar: { es: "Visitar sitio", en: "Visit site" } satisfies L,
};

/* ---------- CapabilityMotif (patrón decorativo) ---------- */
export function CapabilityMotif({
  motif,
  accent,
  className,
}: {
  motif: MotifKind;
  accent: string;
  className?: string;
}) {
  const id = useId().replace(/[:]/g, "");
  const common = { className, "aria-hidden": true as const };

  switch (motif) {
    case "grid":
      return (
        <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" {...common}>
          <defs>
            <pattern id={`g${id}`} width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M24 0H0V24" fill="none" stroke={accent} strokeOpacity="0.28" strokeWidth="1" />
            </pattern>
            <radialGradient id={`gf${id}`} cx="50%" cy="40%">
              <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
              <stop offset="100%" stopColor={accent} stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="400" height="200" fill={`url(#g${id})`} />
          <rect width="400" height="200" fill={`url(#gf${id})`} />
        </svg>
      );
    case "spectrum":
      return (
        <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" {...common}>
          {Array.from({ length: 28 }).map((_, i) => {
            const h = 20 + Math.abs(Math.sin(i * 0.7)) * 130;
            return (
              <rect
                key={i}
                x={i * 14 + 4}
                y={200 - h}
                width="7"
                height={h}
                rx="2"
                fill={accent}
                fillOpacity={0.14 + (i % 5) * 0.06}
              />
            );
          })}
        </svg>
      );
    case "blueprint":
      return (
        <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" {...common}>
          <defs>
            <pattern id={`b${id}`} width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke={accent} strokeOpacity="0.22" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="400" height="200" fill={`url(#b${id})`} />
          <circle cx="200" cy="100" r="52" fill="none" stroke={accent} strokeOpacity="0.5" strokeWidth="1.2" />
          <circle cx="200" cy="100" r="86" fill="none" stroke={accent} strokeOpacity="0.25" strokeWidth="1" strokeDasharray="4 6" />
          <path d="M200 30v140M130 100h140" stroke={accent} strokeOpacity="0.35" strokeWidth="1" />
        </svg>
      );
    case "orbit":
      return (
        <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" {...common}>
          {[28, 52, 78, 104].map((r, i) => (
            <ellipse key={r} cx="200" cy="100" rx={r + 40} ry={r} fill="none" stroke={accent} strokeOpacity={0.4 - i * 0.08} strokeWidth="1.2" />
          ))}
          <circle cx="200" cy="100" r="6" fill={accent} fillOpacity="0.9" />
          <circle cx="292" cy="62" r="4" fill={accent} fillOpacity="0.7" />
          <circle cx="118" cy="140" r="3" fill={accent} fillOpacity="0.6" />
        </svg>
      );
    case "circuit":
      return (
        <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" {...common}>
          <g stroke={accent} strokeOpacity="0.4" strokeWidth="1.4" fill="none">
            <path d="M20 160h80v-60h70v-40h60" />
            <path d="M40 40h60v50h90v70" />
            <path d="M380 60h-70v50h-60v50" />
          </g>
          {[
            [100, 100], [170, 60], [230, 60], [190, 160], [310, 110], [250, 160], [100, 40],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" fill={accent} fillOpacity={0.5 + (i % 3) * 0.18} />
          ))}
        </svg>
      );
  }
}

/* ---------- CapabilityCard ----------
 * `className` permite los spans del mosaico (col-span-2 / row-span-2).
 * `tall` hace que la banda visual crezca para llenar tarjetas de 2 filas.
 * Tarjeta data-driven: acento/signature/motif desde el servicio (tema claro).
 */
export function CapabilityCard({
  cap,
  delay = 0,
  className,
  tall = false,
  base = "/services",
}: {
  cap: Service;
  delay?: number;
  className?: string;
  tall?: boolean;
  /** Prefijo de ruta ("/services" o "/servicios"). El slug se elige según el idioma. */
  base?: string;
}) {
  const t = useT();
  const reduce = useReducedMotion();
  const serviceSlug = base === "/servicios" ? cap.slugEs : cap.slug;
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300",
        "hover:-translate-y-1 hover:border-foreground/20 hover:shadow-elevated",
        className
      )}
    >
      {/* Hairline superior con el acento (se ilumina al hover) */}
      <span
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${cap.accent}, transparent)` }}
        aria-hidden="true"
      />

      {/* Banda visual: imagen o motif, con glow del acento */}
      <div
        className={cn("relative overflow-hidden", tall ? "min-h-52 flex-1" : "h-44 shrink-0")}
        style={{ background: `linear-gradient(135deg, ${cap.accent}1f, transparent 70%)` }}
      >
        {cap.image ? (
          <img
            src={cap.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <CapabilityMotif motif={cap.motif} accent={cap.accent} className="h-full w-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

        {/* Firma en vertical, al margen derecho */}
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[9px] font-semibold tracking-[0.4em]"
          style={{ writingMode: "vertical-rl", color: `${cap.accent}cc` }}
        >
          {t(cap.signature)}
        </span>

        <span className="absolute left-4 top-4 font-mono text-xs" style={{ color: `${cap.accent}bb` }}>
          {cap.index}
        </span>

        <div
          className="absolute inset-x-0 bottom-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${cap.accent}, transparent)` }}
          aria-hidden="true"
        />
      </div>

      <div className={cn("relative flex flex-col p-6", !tall && "flex-1")}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
            {t(cap.name)}
          </h3>
          {cap.flag && (
            <span
              className="shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider"
              style={{ borderColor: `${cap.accent}40`, backgroundColor: `${cap.accent}14`, color: cap.accent }}
            >
              {t(cap.flag)}
            </span>
          )}
        </div>
        <p className={cn("mt-2 text-sm leading-relaxed text-muted-foreground", !tall && "flex-1")}>{t(cap.short)}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {cap.tags.map((tag: L) => (
            <Tag key={tag.es}>{t(tag)}</Tag>
          ))}
        </div>
        <Link
          to={`${base}/${serviceSlug}`}
          className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-surface/40 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors hover:border-foreground/25 hover:bg-surface"
          style={{ color: cap.accent }}
        >
          {t(servicesUI.verMas)}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
        </Link>
      </div>
    </motion.article>
  );
}

/* ---------- CaseCard (Afilamos Hermanos) ---------- */
export function CaseCard() {
  const t = useT();
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-10">
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary to-accent" aria-hidden="true" />
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="text-accent">{t(workUi.casoReal)}</span>
            <span>{t(afilamos.sector)}</span>
          </div>
          <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight">{afilamos.client}</h3>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">{t(afilamos.summary)}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button href={afilamos.url} external variant="outline" size="sm">
              {t(workUi.visitar)} <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="mt-4 font-mono text-[11px] leading-relaxed text-muted-foreground">{t(afilamos.impact)}</p>
        </div>
        <div className="flex flex-col gap-3 self-center">
          {afilamos.items.map((item) => (
            <div
              key={item.label.es}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface/50 px-4 py-3 transition-transform duration-200 hover:translate-x-1"
            >
              <span className="text-sm font-medium">{t(item.label)}</span>
              <StatusBadge status={item.status} label={t(item.statusLabel)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- TrustBanner (banner de confianza con casos reales) ---------- */
export function TrustBanner() {
  const t = useT();
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Afilamos Hermanos */}
      <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-elevated">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" aria-hidden="true" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-accent">{t(workUi.casoReal)}</span>
            </div>
            <h3 className="mt-2 font-display text-lg font-semibold tracking-tight">{afilamos.client}</h3>
            <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">{t(afilamos.sector)}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(afilamos.summary)}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {afilamos.tags.slice(0, 3).map((tag) => (
                <Tag key={tag.es}>{t(tag)}</Tag>
              ))}
            </div>
          </div>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-border bg-surface/50 p-2">
            <img
              src="/images/clients/afilamos-hermanos.webp"
              alt="Afilamos Hermanos Logo"
              loading="lazy"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Button href={afilamos.url} external variant="outline" size="sm">
            {t(workUi.visitar)} <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
          <span className="font-mono text-[10px] text-muted-foreground">Live since 2024</span>
        </div>
      </div>

      {/* Supraeventos */}
      <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-elevated">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" aria-hidden="true" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-accent">{t(workUi.casoReal)}</span>
            </div>
            <h3 className="mt-2 font-display text-lg font-semibold tracking-tight">{supraeventos.client}</h3>
            <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">{t(supraeventos.sector)}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(supraeventos.summary)}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {supraeventos.tags.slice(0, 3).map((tag) => (
                <Tag key={tag.es}>{t(tag)}</Tag>
              ))}
            </div>
          </div>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-border bg-surface/50 p-2">
            <img
              src="/images/clients/supraeventos.webp"
              alt="Supraeventos Logo"
              loading="lazy"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono text-[10px] text-muted-foreground">Infraestructura Cloud</span>
          <span className="font-mono text-[10px] text-muted-foreground">99.9% uptime</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Marquee (cinta de disciplinas) ---------- */
export function Marquee({ items }: { items: L[] }) {
  const t = useT();
  const row = (hidden: boolean) => (
    <div className="flex items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <span key={item.es} className="flex items-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {t(item)}
          <span className="mx-6 text-spark" aria-hidden="true">▸</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative overflow-hidden border-y border-border bg-surface/30 py-4">
      <div className="marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
