import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles, Compass, Lock, Users, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "@/components/site/HeroVisual";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal, SectionHeading, Eyebrow } from "@/components/site/primitives";
import { PORTFOLIO } from "@/lib/portfolio";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageMeta(
      "QuietoraLabs — Technology that makes room for what matters",
      "An independent software product studio in India building focus, learning and digital wellbeing products. Quietora Focus for Windows is in development.",
    ),
  component: Index,
});

const insights = [
  { k: "01", t: "Products, not projects", d: "We build and own our software rather than selling hours." },
  { k: "02", t: "Windows-first", d: "Focus starts where most Indian students and professionals work." },
  { k: "03", t: "Privacy by default", d: "Insights designed to inform the person, not watch them." },
  { k: "04", t: "Built in India", d: "For Indian realities first, with the wider world in view." },
];

function Index() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-50 [mask-image:radial-gradient(ellipse_at_70%_30%,black,transparent_70%)]" />
        <div className="container-q relative grid items-center gap-12 pb-16 pt-12 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:pb-24">
          <div>
            <Reveal><Eyebrow>Independent software studio · India</Eyebrow></Reveal>
            <Reveal delay={80}>
              <h1 className="mt-5 text-[2.7rem] font-semibold leading-[1.02] text-navy sm:text-6xl lg:text-[4.4rem]">
                Technology that makes room for{" "}
                <span className="relative whitespace-nowrap">
                  <span className="text-gradient-mark">what matters.</span>
                  <svg viewBox="0 0 300 12" className="absolute -bottom-2 left-0 w-full" aria-hidden>
                    <path d="M2 9c70-6 160-8 296-3" stroke="var(--mint)" strokeWidth="3" fill="none" strokeLinecap="round" className="animate-q-ribbon" />
                  </svg>
                </span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-7 max-w-lg text-lg leading-relaxed text-muted-foreground">
                QuietoraLabs builds calm, honest software for focus, learning and digital wellbeing — starting with
                Quietora Focus, a Windows-first app for people who want their attention back.
              </p>
            </Reveal>
            <Reveal delay={240} className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg"><Link to="/projects">Explore our work <ArrowRight /></Link></Button>
              <Button asChild size="lg" variant="outline" className="rounded-full"><Link to="/partners">Partner with us</Link></Button>
              <Link to="/products/quietora-focus" hash="early-access" className="px-2 text-sm font-medium text-ocean underline-offset-4 hover:underline">
                Join Focus early access →
              </Link>
            </Reveal>
          </div>
          <Reveal delay={200}><HeroVisual /></Reveal>
        </div>
        {/* Insight strip */}
        <div className="relative border-y border-border bg-card/70 backdrop-blur">
          <div className="container-q grid divide-border sm:grid-cols-2 lg:grid-cols-4 lg:divide-x">
            {insights.map((i) => (
              <div key={i.k} className="flex gap-4 py-6 lg:px-6 lg:first:pl-0">
                <span className="font-mono text-xs text-ocean">{i.k}</span>
                <div>
                  <p className="font-display font-semibold text-navy">{i.t}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{i.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="container-q grid gap-10 py-20 md:py-28 lg:grid-cols-[1fr_1.3fr]">
        <Reveal><Eyebrow>Our mission</Eyebrow></Reveal>
        <Reveal delay={80}>
          <p className="font-display text-2xl leading-snug text-navy md:text-[2.1rem] md:leading-[1.25]">
            Attention is the most contested resource of our time. Most software is designed to take more of it.
            <span className="text-muted-foreground"> We want to build the opposite: technology that gives people their focus back — and respects them while doing it.</span>
          </p>
        </Reveal>
      </section>

      {/* PRODUCTS */}
      <section className="border-t border-border bg-mist py-20 md:py-24">
        <div className="container-q">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="What we're building" title="A small, deliberate portfolio." lead="Every status here is real. We'd rather show you honest progress than a polished promise." />
            <Button asChild variant="outline" className="rounded-full"><Link to="/products">All products <ArrowRight /></Link></Button>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PORTFOLIO.map((p, i) => (
              <Reveal key={p.slug} delay={i * 90} className="h-full"><ProductCard item={p} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CAMPUS FEATURE */}
      <section className="relative overflow-hidden bg-navy-gradient py-20 text-navy-foreground md:py-28">
        <div className="pointer-events-none absolute inset-0 dot-grid-light opacity-40" />
        <div className="container-q relative grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              light
              eyebrow="For institutions · Proposed"
              title={<>Focus support for campuses — <span className="text-mint">without surveillance.</span></>}
              lead="Quietora Campus is a proposed partnership offering for colleges, coding bootcamps and coaching centres. Students opt in. Institutions see aggregated, anonymised patterns — never an individual's browsing."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="mint" size="lg"><Link to="/products/quietora-campus">How Campus would work</Link></Button>
              <Button asChild variant="outline-light" size="lg"><Link to="/partners">Discuss a pilot</Link></Button>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Users, t: "Opt-in only", d: "Students choose to join. Leaving is one click." },
                { icon: Eye, t: "Aggregates, not individuals", d: "Cohort-level trends with minimum group sizes." },
                { icon: Lock, t: "No content collected", d: "No URLs, messages, screenshots or keystrokes." },
                { icon: ShieldCheck, t: "Pilot-first", d: "Customised pilots, discussed one institution at a time." },
              ].map((c) => (
                <div key={c.t} className="glass-dark rounded-2xl p-5">
                  <c.icon className="h-5 w-5 text-mint" />
                  <p className="mt-4 font-display font-semibold">{c.t}</p>
                  <p className="mt-1 text-sm text-navy-foreground/65">{c.d}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* STORY */}
      <section className="container-q py-20 md:py-28">
        <SectionHeading eyebrow="Where we are" title="Early, honest, and building in the open." />
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          {[
            { icon: Compass, t: "Why we started", d: "We watched students and young professionals lose hours to tools designed to distract them — and saw few products built for Indian users that took focus seriously." },
            { icon: Sparkles, t: "What we're doing now", d: "Building Quietora Focus for Windows, shaping how Campus pilots could work responsibly, and exploring adjacent problems like healthcare experience design." },
            { icon: ShieldCheck, t: "What we won't do", d: "Invent traction, sell attention, or ship surveillance dressed as productivity. If something isn't live, we'll say so — like we're doing here." },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 80} className="bg-card p-7">
              <c.icon className="h-5 w-5 text-ocean" />
              <h3 className="mt-5 text-xl font-semibold text-navy">{c.t}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{c.d}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-8"><Link to="/about" className="text-sm font-medium text-ocean hover:underline">Read our founding letter →</Link></div>
      </section>

      {/* CTA */}
      <section className="container-q pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-hero p-8 md:p-14">
            <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" />
            <div className="relative grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
              <div>
                <h2 className="text-3xl font-semibold text-navy md:text-4xl">Want to build something quieter with us?</h2>
                <p className="mt-3 max-w-xl text-lg text-muted-foreground">
                  Institutions, researchers, collaborators and future teammates — we read every message ourselves.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <Button asChild size="lg"><Link to="/contact">Get in touch</Link></Button>
                <Button asChild size="lg" variant="outline" className="rounded-full"><Link to="/partners">Partner with us</Link></Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
