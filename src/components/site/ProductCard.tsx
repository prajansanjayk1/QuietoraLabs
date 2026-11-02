import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Timer, GraduationCap, HeartPulse } from "lucide-react";
import { StatusBadge } from "./primitives";
import type { PortfolioItem } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

const icons = { focus: Timer, campus: GraduationCap, medique: HeartPulse } as const;

export function ProductCard({ item, className }: { item: PortfolioItem; className?: string }) {
  const Icon = icons[item.slug as keyof typeof icons] ?? Timer;
  return (
    <Link
      to={item.to}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift focus-visible:-translate-y-1",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-ocean ring-1 ring-border">
          <Icon className="h-5 w-5" />
        </span>
        <StatusBadge status={item.status} />
      </div>
      <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
        {item.kind} · {item.category}
      </p>
      <h3 className="mt-1.5 text-2xl font-semibold text-navy">{item.name}</h3>
      <p className="mt-1 font-medium text-ocean">{item.tagline}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
      <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs">
        <div><dt className="text-muted-foreground">Platform</dt><dd className="mt-0.5 text-charcoal">{item.platform}</dd></div>
        <div><dt className="text-muted-foreground">Where it is</dt><dd className="mt-0.5 text-charcoal">{item.stage}</dd></div>
      </dl>
      <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-navy">
        View details <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
