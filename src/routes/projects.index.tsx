import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Reveal } from "@/components/site/primitives";
import { ProductCard } from "@/components/site/ProductCard";
import { PORTFOLIO, type Category } from "@/lib/portfolio";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects/")({
  head: () => pageMeta("Projects", "Browse QuietoraLabs work by category — productivity, education and healthcare technology — with every project's real status visible."),
  component: Projects,
});

const FILTERS: ("All" | Category)[] = ["All", "Productivity", "Education", "Healthcare tech"];

function Projects() {
  const [f, setF] = useState<(typeof FILTERS)[number]>("All");
  const items = PORTFOLIO.filter((p) => f === "All" || p.category === f);
  return (
    <>
      <PageHero
        crumbs={[{ label: "Projects" }]}
        eyebrow="Our work"
        title="Projects, in every stage."
        lead="From an app in active development to an early concept, here's the full picture of what QuietoraLabs is working on."
      />
      <section className="container-q py-14">
        <div role="toolbar" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {FILTERS.map((c) => {
            const n = c === "All" ? PORTFOLIO.length : PORTFOLIO.filter((p) => p.category === c).length;
            return (
              <button
                key={c}
                aria-pressed={f === c}
                onClick={() => setF(c)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  f === c ? "border-navy bg-navy text-navy-foreground" : "border-border bg-card text-charcoal hover:border-ocean/50",
                )}
              >
                {c} <span className="ml-1 font-mono text-xs opacity-60">{n}</span>
              </button>
            );
          })}
        </div>
        <p className="sr-only" aria-live="polite">{items.length} projects shown</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <Reveal key={p.slug} delay={i * 60} className="h-full"><ProductCard item={p} /></Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
