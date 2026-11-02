import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, X, GraduationCap, Code2, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, Reveal, SectionHeading, StatusBadge, HonestNote } from "@/components/site/primitives";
import { FAQ } from "@/components/site/FAQ";
import { LeadForm } from "@/components/site/LeadForm";
import { PARTNER_TYPES } from "@/lib/lead-schema";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/products/quietora-campus")({
  head: () => pageMeta("Quietora Campus — focus partnerships for institutions (proposed)", "A proposed, privacy-first partnership offering for colleges, coding bootcamps and coaching centres. Opt-in, aggregated insight — not surveillance. Register pilot interest."),
  component: Campus,
});

const measure = [
  "Aggregate focus-session minutes per cohort, per week",
  "Share of opted-in students who complete planned sessions",
  "Self-reported focus and stress check-ins (optional, anonymous)",
  "Time-of-day patterns at cohort level, with minimum group sizes",
];
const never = [
  "Which websites or apps an individual student visits",
  "Screenshots, keystrokes, messages or page content",
  "Location, contacts or camera/microphone access",
  "Individual rankings, leaderboards or disciplinary reports",
];

const pilot = [
  { t: "Conversation", d: "We learn your context — programme, cohort size, goals and constraints." },
  { t: "Pilot design", d: "Together we agree scope, consent flow, what's measured and how long it runs." },
  { t: "Opt-in rollout", d: "Students are invited, not enrolled. Clear explanations; leaving is simple." },
  { t: "Review together", d: "We share aggregated findings and decide jointly whether to continue." },
];

const faqs = [
  { q: "Is Quietora Campus available now?", a: "No. It's a proposed offering. We're speaking with interested institutions to shape how pilots should work. No pilots have been announced." },
  { q: "Can staff see what an individual student is doing?", a: "No. Campus is designed around aggregated, anonymised insight with minimum group sizes. Individual activity is not shown to institutions." },
  { q: "Is participation mandatory for students?", a: "It should never be. Our proposed model requires explicit student opt-in and a simple way to leave at any time." },
  { q: "What does it cost?", a: "There's no fixed price. Any pilot would be customised and discussed directly with your institution." },
  { q: "What do you need from us to start a conversation?", a: "Just an interest form. Tell us about your institution and what you hope to improve; we'll reply personally." },
];

function Campus() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Products", to: "/products" }, { label: "Quietora Campus" }]}
        eyebrow="Partnership offering · For institutions"
        title={<>Quietora <span className="text-gradient-mark">Campus</span></>}
        lead="Helping colleges, coding bootcamps and coaching centres support student focus — through opt-in, aggregated insight that respects every learner's privacy."
        aside={
          <div className="grid gap-3">
            {[
              { icon: GraduationCap, t: "Colleges & universities" },
              { icon: Code2, t: "Coding bootcamps" },
              { icon: BookOpen, t: "Coaching centres" },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 80} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint-soft text-navy"><c.icon className="h-5 w-5" /></span>
                <span className="font-display font-medium text-navy">{c.t}</span>
              </Reveal>
            ))}
          </div>
        }
      >
        <div className="flex w-full flex-wrap items-center gap-3">
          <StatusBadge status="Proposed" />
          <span className="text-sm text-muted-foreground">Pilot model in design · No pilots announced</span>
        </div>
        <Button asChild size="lg"><a href="#pilot-interest">Register pilot interest <ArrowRight /></a></Button>
      </PageHero>

      <section className="container-q grid gap-10 py-20 lg:grid-cols-3">
        {[
          { t: "For students", d: "A private tool that helps them protect study time, on their own terms." },
          { t: "For educators", d: "Cohort-level signals about when focus is hardest, to inform timetables and support." },
          { t: "For leadership", d: "A responsible, measurable wellbeing initiative — without creating a monitoring culture." },
        ].map((v, i) => (
          <Reveal key={v.t} delay={i * 80}>
            <p className="eyebrow text-ocean">{v.t}</p>
            <p className="mt-3 font-display text-xl leading-snug text-navy">{v.d}</p>
          </Reveal>
        ))}
      </section>

      <section className="border-y border-border bg-mist py-20">
        <div className="container-q">
          <SectionHeading eyebrow="Student privacy safeguards" title="What we propose to measure — and what we never would." />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-mint/50 bg-card p-7">
              <h3 className="text-lg font-semibold text-navy">We propose to measure</h3>
              <ul className="mt-5 space-y-3">
                {measure.map((m) => <li key={m} className="flex gap-3 text-sm text-charcoal"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />{m}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-destructive/25 bg-card p-7">
              <h3 className="text-lg font-semibold text-navy">We will not collect</h3>
              <ul className="mt-5 space-y-3">
                {never.map((m) => <li key={m} className="flex gap-3 text-sm text-charcoal"><X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />{m}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container-q py-20">
        <SectionHeading eyebrow="Pilot process" title="Start small. Decide together." />
        <ol className="mt-12 grid gap-5 md:grid-cols-4">
          {pilot.map((p, i) => (
            <Reveal as="li" key={p.t} delay={i * 70} className="rounded-2xl border border-border bg-card p-6">
              <span className="font-mono text-xs text-ocean">Step {i + 1}</span>
              <h3 className="mt-3 text-lg font-semibold text-navy">{p.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
            </Reveal>
          ))}
        </ol>
        <HonestNote className="mt-8">Pricing for institutions is customised during pilot discussions. We don't have a standard published offer yet.</HonestNote>
      </section>

      <section id="pilot-interest" className="scroll-mt-20 border-t border-border bg-hero py-20">
        <div className="container-q grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading eyebrow="Pilot interest" title="Tell us about your institution." lead="This isn't a contract or a sales funnel — just the start of a conversation." />
            <div className="mt-10"><FAQ items={faqs} /></div>
          </div>
          <div className="h-fit rounded-2xl border border-border bg-card p-6 shadow-lift md:p-8">
            <LeadForm
              kind="partnership"
              submitLabel="Send pilot interest"
              initial={{ "details.interest": "Quietora Campus pilot" }}
              fields={[
                { name: "organization", label: "Institution name", required: true },
                { name: "enquiryType", label: "Institution type", required: true, options: PARTNER_TYPES },
                { name: "roleTitle", label: "Your role", placeholder: "e.g. Director, Dean, Programme lead" },
                { name: "details.cohort", label: "Approx. student count", options: ["Under 100", "100–500", "500–2,000", "2,000+"] },
                { name: "message", label: "What would you like to improve?", required: true },
              ]}
            />
          </div>
        </div>
      </section>
      <div className="container-q py-8 text-sm"><Link to="/products" className="text-ocean hover:underline">← All products</Link></div>
    </>
  );
}
