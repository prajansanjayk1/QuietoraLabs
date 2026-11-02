import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero, Reveal, HonestNote, StatusBadge } from "@/components/site/primitives";
import { ProductCard } from "@/components/site/ProductCard";
import { PORTFOLIO } from "@/lib/portfolio";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/products/")({
  head: () => pageMeta("Products", "QuietoraLabs products and offerings with their real statuses: Quietora Focus (in development), Quietora Campus (proposed) and Medique (concept)."),
  component: Products,
});

function Products() {
  const rows = PORTFOLIO;
  return (
    <>
      <PageHero
        crumbs={[{ label: "Products" }]}
        eyebrow="Product portfolio"
        title="Owned products, honestly labelled."
        lead="We're a product company, not an agency. Here's everything we're working on and exactly where each one stands today."
      >
        <Button asChild size="lg"><Link to="/products/quietora-focus" hash="early-access">Join Focus early access</Link></Button>
        <Button asChild size="lg" variant="outline" className="rounded-full"><Link to="/partners">Partner with us</Link></Button>
      </PageHero>

      <section className="container-q py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {rows.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80} className="h-full"><ProductCard item={p} /></Reveal>
          ))}
        </div>

        <h2 className="mt-20 text-2xl font-semibold text-navy">Status at a glance</h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-5 py-3 font-medium">Name</th><th className="px-5 py-3 font-medium">Type</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3 font-medium">Current stage</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((p) => (
                <tr key={p.slug}>
                  <td className="px-5 py-4"><Link to={p.to} className="font-medium text-navy hover:text-ocean">{p.name}</Link></td>
                  <td className="px-5 py-4 text-muted-foreground">{p.kind}</td>
                  <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-4 text-muted-foreground">{p.stage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <HonestNote className="mt-6">
          None of these products is publicly available yet. We don't publish prices, launch dates or user numbers until they're real.
        </HonestNote>
      </section>
    </>
  );
}
