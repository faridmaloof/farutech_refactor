/**
 * Primitives — componentes base del design system (Tailwind v4 + tokens FaruTech).
 */
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";

/* ---------- Button ---------- */
interface ButtonProps {
  to?: string;
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  external?: boolean;
}

export function Button({
  to,
  href,
  onClick,
  children,
  variant = "primary",
  size = "md",
  className,
  external,
}: ButtonProps) {
  const base = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
    size === "sm" && "h-9 px-4 text-sm",
    size === "md" && "h-11 px-5 text-sm",
    size === "lg" && "h-12 px-6 text-base",
    variant === "primary" &&
      "bg-foreground text-background shadow-[0_0_24px_-6px_rgba(255,255,255,0.3)] hover:bg-foreground/90",
    variant === "outline" &&
      "border border-border bg-surface/40 text-foreground hover:border-foreground/25 hover:bg-surface",
    variant === "ghost" && "text-muted-foreground hover:bg-surface hover:text-foreground",
    className
  );
  if (to) {
    return (
      <Link to={to} onClick={onClick} className={base}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={base} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={base}>
      {children}
    </button>
  );
}

/* ---------- Eyebrow (etiqueta mono tipo plano) ---------- */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-primary",
        className
      )}
    >
      <span className="h-px w-6 bg-primary/60" aria-hidden="true" />
      {children}
    </span>
  );
}

/* ---------- SectionHeading ---------- */
export function SectionHeading({
  eyebrow,
  title,
  index,
  lede,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  index?: string;
  lede?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between gap-4">
        <Eyebrow>{eyebrow}</Eyebrow>
        {index && (
          <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">{index}</span>
        )}
      </div>
      <h2 className="font-display text-3xl font-semibold leading-[1.05] tracking-tight md:text-5xl">{title}</h2>
      {lede && <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">{lede}</p>}
    </div>
  );
}

/* ---------- Tag ---------- */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface/50 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground",
        className
      )}
    >
      {children}
    </span>
  );
}

/* ---------- StatusBadge ---------- */
export function StatusBadge({ status, label }: { status: string; label: string }) {
  const styles: Record<string, { border: string; bg: string; text: string; dot: string }> = {
    live: { border: "border-accent/30", bg: "bg-accent/10", text: "text-accent", dot: "bg-accent" },
    wip: { border: "border-spark/30", bg: "bg-spark/10", text: "text-spark", dot: "bg-spark" },
    dev: { border: "border-primary/30", bg: "bg-primary/10", text: "text-primary", dot: "bg-primary" },
    success: { border: "border-accent/30", bg: "bg-accent/10", text: "text-accent", dot: "bg-accent" },
    error: { border: "border-spark/30", bg: "bg-spark/10", text: "text-spark", dot: "bg-spark" },
    warning: { border: "border-spark/30", bg: "bg-spark/10", text: "text-spark", dot: "bg-spark" },
    info: { border: "border-primary/30", bg: "bg-primary/10", text: "text-primary", dot: "bg-primary" },
  };
  const s = styles[status] ?? styles.info;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider",
        s.border, s.bg, s.text
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", s.dot)}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

/* ---------- Reveal (scroll reveal con framer-motion) ---------- */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}