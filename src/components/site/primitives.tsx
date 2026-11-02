import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return setVisible(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref as never}
      data-visible={visible}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", className)}
    >
      {children}
    </Tag>
  );
}

export type Status = "In development" | "Proposed" | "Concept" | "Exploration";

const statusStyles: Record<Status, string> = {
  "In development": "bg-mint-soft text-navy border-mint/50",
  Proposed: "bg-secondary text-ocean border-ocean/25",
  Concept: "bg-warning-soft text-charcoal border-warning/40",
  Exploration: "bg-warning-soft text-charcoal border-warning/40",
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.68rem] uppercase tracking-wider",
        statusStyles[status],
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {status === "In development" && (
          <span className="absolute inset-0 rounded-full bg-success animate-q-pulse" />
        )}
        <span className="relative h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      {status}
    </span>
  );
}

export function Eyebrow({ children, className, light }: { children: ReactNode; className?: string | undefined; light?: boolean | undefined }) {
  return (
    <p className={cn("eyebrow flex items-center gap-2", light ? "text-mint" : "text-ocean", className)}>
      <span className={cn("h-px w-6", light ? "bg-mint/60" : "bg-ocean/50")} />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  className,
  light,
}: {
  eyebrow?: string | undefined;
  title: ReactNode;
  lead?: ReactNode | undefined;
  className?: string | undefined;
  light?: boolean | undefined;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          "mt-3 text-3xl font-semibold leading-[1.08] md:text-[2.6rem]",
          light ? "text-navy-foreground" : "text-navy",
        )}
      >
        {title}
      </h2>
      {lead && (
        <p className={cn("mt-4 text-lg leading-relaxed", light ? "text-navy-foreground/70" : "text-muted-foreground")}>
          {lead}
        </p>
      )}
    </div>
  );
}

export type Crumb = { label: string; to?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-muted-foreground">
        <li>
          <Link to="/" className="hover:text-navy">Home</Link>
        </li>
        {items.map((c, i) => (
          <li key={c.label} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden />
            {c.to && i < items.length - 1 ? (
              <Link to={c.to} className="hover:text-navy">{c.label}</Link>
            ) : (
              <span aria-current="page" className="text-navy">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
  children,
  aside,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-hero">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="container-q relative grid gap-10 pb-14 pt-10 md:pb-20 md:pt-14 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div>
          <Breadcrumbs items={crumbs} />
          <Eyebrow className="mt-8">{eyebrow}</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.04] text-navy md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">{lead}</p>
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
        {aside && <div>{aside}</div>}
      </div>
    </section>
  );
}

export function HonestNote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex gap-3 rounded-xl border border-warning/40 bg-warning-soft p-4 text-sm text-charcoal", className)}>
      <span aria-hidden className="mt-0.5 font-mono text-xs font-bold text-warning">i</span>
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
