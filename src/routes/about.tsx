import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero, Reveal, SectionHeading, Eyebrow } from "@/components/site/primitives";
import { QMark } from "@/components/site/Logo";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => pageMeta("About QuietoraLabs", "What we believe, why we started, and the principles — clarity, trust and real-world utility — behind every QuietoraLabs product."),
  component: About,
});

const principles = [
  { n: "01", t: "Clarity", d: "Software should be understandable at a glance. Fewer settings, plain language, no dark patterns. If we can't explain a feature simply, it isn't ready." },
  { n: "02", t: "Trust", d: "We collect the minimum, explain what we keep, and never sell attention or data. Trust is earned slowly and lost quickly, so we design for it from day one." },
  { n: "03", t: "Real-world utility", d: "We build for how people actually live — patchy internet, shared laptops, exam seasons, long commutes. Usefulness beats novelty." },
];

const roadmap = [
  { phase: "Now", t: "Build Quietora Focus for Windows", d: "Core blocking engine, timed sessions and profiles. Early access list open." },
  { phase: "Next", t: "Early access testing", d: "Put builds in the hands of students and professionals; learn and iterate." },
  { phase: "Then", t: "Shape Campus pilots", d: "Talk with interested institutions about responsible, opt-in pilots." },
  { phase: "Exploring", t: "Adjacent problems", d: "Concept work like Medique, where careful experience design could help." },
];

function About() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About" }]}
        eyebrow="About us"
        title={<>A young studio with a <span className="text-gradient-mark">quiet ambition.</span></>}
        lead="QuietoraLabs is an India-based software product company working on productivity, digital wellbeing and learning technology — and exploring where healthcare tech could benefit from the same care."
        aside={
          <div className="relative mx-auto grid aspect-square w-full max-w-xs place-items-center">
            <div className="absolute inset-0 rounded-full border border-dashed border-ocean/30 animate-q-spin" />
            <div className="absolute inset-8 rounded-full bg-card shadow-lift" />
            <QMark className="relative h-32 w-32" />
          </div>
        }
      />

      <section className="container-q grid gap-12 py-20 lg:grid-cols-[280px_1fr]">
        <div><Eyebrow>A letter from the founding team</Eyebrow></div>
        <Reveal>
          <article className="max-w-2xl space-y-5 font-display text-xl leading-relaxed text-charcoal">
            <p>We started QuietoraLabs because we kept noticing the same thing: brilliant people losing hours to tools built to keep them scrolling. Students opening a laptop to study and closing it ninety minutes later with nothing done. Professionals ending the day busy but unsatisfied.</p>
            <p className="text-muted-foreground">Most technology optimises for engagement. We want to optimise for something harder to measure — whether you got to spend your attention on what you actually care about.</p>
            <p>We're early. We haven't launched yet, we don't have customers to name, and we won't pretend otherwise. What we do have is a clear problem, a Windows-first product in development, and a commitment to building it the right way: privately, plainly and for real Indian users first.</p>
            <p className="text-muted-foreground">If that resonates — as a future user, an institution, a collaborator or a teammate — we'd genuinely like to hear from you.</p>
            <p className="pt-2 font-sans text-base text-navy">— The QuietoraLabs team</p>
          </article>
        </Reveal>
      </section>

      <section className="border-y border-border bg-mist py-20">
        <div className="container-q grid gap-6 md:grid-cols-2">
          <Reveal className="rounded-2xl border border-border bg-card p-8 shadow-soft">
            <Eyebrow>Mission</Eyebrow>
            <p className="mt-4 font-display text-2xl text-navy">Technology that gives people their focus back.</p>
          </Reveal>
          <Reveal delay={80} className="rounded-2xl bg-navy-gradient p-8 text-navy-foreground shadow-lift">
            <Eyebrow light>Vision</Eyebrow>
            <p className="mt-4 font-display text-2xl">A world where the software people use every day leaves them calmer and more capable — not more depleted.</p>
          </Reveal>
        </div>
      </section>

      <section className="container-q py-20">
        <SectionHeading eyebrow="Core principles" title="Three ideas we hold ourselves to." />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {principles.map((p, i) => (
            <Reveal key={p.t} delay={i * 80} className="rounded-2xl border border-border bg-card p-7">
              <span className="font-mono text-sm text-ocean">{p.n}</span>
              <h3 className="mt-6 text-2xl font-semibold text-navy">{p.t}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{p.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-q pb-24">
        <SectionHeading eyebrow="Approach & direction" title="Where we're heading." lead="Directional only — sequences, not dates. We'll share timelines when we can keep them." />
        <ol className="relative mt-12 grid gap-5 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-[18px] hidden h-px bg-border md:block" aria-hidden />
          {roadmap.map((r, i) => (
            <Reveal as="li" key={r.t} delay={i * 80} className="relative">
              <span className={`relative z-10 inline-flex h-9 items-center rounded-full border px-3 font-mono text-xs ${i === 0 ? "border-mint bg-mint-soft text-navy" : "border-border bg-card text-muted-foreground"}`}>{r.phase}</span>
              <h3 className="mt-4 text-lg font-semibold text-navy">{r.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r.d}</p>
            </Reveal>
          ))}
        </ol>
        <div className="mt-14 flex flex-wrap gap-3">
          <Button asChild size="lg"><Link to="/products">See our products</Link></Button>
          <Button asChild size="lg" variant="outline" className="rounded-full"><Link to="/contact" search={{ type: "Careers" }}>Talk to us about joining</Link></Button>
        </div>
      </section>
    </>
  );
}
