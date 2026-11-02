import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Map, PenTool, HelpCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, Reveal, SectionHeading, StatusBadge, HonestNote } from "@/components/site/primitives";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/projects/medique")({
  head: () => pageMeta("Medique — healthcare technology concept", "Medique is an early-stage, concept-only QuietoraLabs exploration in healthcare technology. Scope is being defined; no clinical claims. Open to collaboration."),
  component: Medique,
});

const areas = [
  { icon: Search, t: "Project discovery", d: "Understanding where people struggle with health-related information and routines, before deciding what — if anything — to build." },
  { icon: Map, t: "Problem framing", d: "Mapping questions, constraints and responsibilities carefully. Healthcare demands more humility than most domains." },
  { icon: PenTool, t: "Experience design", d: "Sketching calm, accessible interface patterns that could reduce anxiety rather than add to it." },
];

const questions = [
  "Which problems are meaningful and appropriate for a small product team to work on?",
  "Who would need to be involved — clinicians, researchers, patients' advocates — to do this responsibly?",
  "What regulatory, privacy and safety obligations would apply in India and beyond?",
  "What should Medique explicitly not do?",
];

/** Illustrative, non-functional concept frame. Uses no real data. */
function ConceptFrame() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-4 rounded-[2rem] border border-dashed border-warning/50" aria-hidden />
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
        <div className="flex items-center justify-between border-b border-border bg-mist px-5 py-3">
          <span className="font-display font-semibold text-navy">Medique</span>
          <span className="rounded-full bg-warning-soft px-2 py-0.5 font-mono text-[0.6rem] uppercase text-charcoal">Concept sketch</span>
        </div>
        <div className="space-y-3 p-5">
          <div className="h-3 w-2/3 rounded-full bg-secondary" />
          <div className="h-3 w-1/2 rounded-full bg-secondary" />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-border p-3">
                <div className="h-6 w-6 rounded-full bg-mint-soft" />
                <div className="mt-3 h-2 w-3/4 rounded-full bg-secondary" />
                <div className="mt-1.5 h-2 w-1/2 rounded-full bg-secondary" />
              </div>
            ))}
          </div>
          <svg viewBox="0 0 300 60" className="mt-2 w-full" aria-hidden>
            <path d="M0 30h80l12-18 16 36 14-28 10 10h168" fill="none" stroke="var(--mint)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-q-ribbon" />
          </svg>
          <p className="text-center text-[0.7rem] text-muted-foreground">Wireframe placeholder — no functionality, no data</p>
        </div>
      </div>
    </div>
  );
}

function Medique() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Projects", to: "/projects" }, { label: "Medique" }]}
        eyebrow="Portfolio case study · Healthcare tech"
        title={<>Medique <span className="text-muted-foreground">— an exploration.</span></>}
        lead="An early-stage portfolio project asking how thoughtful experience design might help in healthcare. The scope is still being defined."
        aside={<ConceptFrame />}
      >
        <div className="flex w-full flex-wrap items-center gap-3">
          <StatusBadge status="Exploration" />
          <StatusBadge status="Concept" />
        </div>
        <Button asChild size="lg"><Link to="/contact" search={{ type: "Collaboration" }}>Request collaboration <ArrowRight /></Link></Button>
      </PageHero>

      <section className="container-q py-16">
        <HonestNote>
          <strong>Concept only.</strong> Medique is not a medical device, clinical tool or available product. It has no users, no
          clinical validation, no integrations and no regulatory approvals. Nothing on this page is medical advice.
        </HonestNote>
      </section>

      <section className="container-q pb-20">
        <SectionHeading eyebrow="Areas of exploration" title="What we're thinking about — not what we've achieved." />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {areas.map((a, i) => (
            <Reveal key={a.t} delay={i * 80} className="rounded-2xl border border-border bg-card p-7">
              <a.icon className="h-5 w-5 text-ocean" />
              <h3 className="mt-5 text-xl font-semibold text-navy">{a.t}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{a.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-mist py-20">
        <div className="container-q grid gap-12 lg:grid-cols-2">
          <SectionHeading eyebrow="Open questions" title="The questions that will shape the scope." lead="We'll only move forward where we can do so responsibly, with the right expertise involved." />
          <ul className="space-y-3">
            {questions.map((q) => (
              <li key={q} className="flex gap-3 rounded-xl border border-border bg-card p-4 text-charcoal">
                <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-ocean" /> {q}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-q py-20">
        <div className="rounded-3xl bg-navy-gradient p-10 text-navy-foreground md:p-14">
          <h2 className="max-w-2xl text-3xl font-semibold md:text-4xl">Work in health, research or design? Let's think together.</h2>
          <p className="mt-4 max-w-xl text-navy-foreground/70">We're especially interested in hearing from clinicians, health researchers and accessibility specialists.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="mint" size="lg"><Link to="/contact" search={{ type: "Collaboration" }}>Request collaboration</Link></Button>
            <Button asChild variant="outline-light" size="lg"><Link to="/projects">Back to projects</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}
