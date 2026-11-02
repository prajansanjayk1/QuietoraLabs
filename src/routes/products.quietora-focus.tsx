import { createFileRoute, Link } from "@tanstack/react-router";
import { Ban, Timer, Layers, BarChart3, Lock, HardDrive, EyeOff, Trash2, Monitor, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, Reveal, SectionHeading, StatusBadge, HonestNote, Eyebrow } from "@/components/site/primitives";
import { HeroVisual } from "@/components/site/HeroVisual";
import { FocusTimer } from "@/components/site/FocusTimer";
import { FAQ } from "@/components/site/FAQ";
import { LeadForm } from "@/components/site/LeadForm";
import { FOCUS_ROLES } from "@/lib/lead-schema";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/products/quietora-focus")({
  head: () => pageMeta("Quietora Focus — Windows-first focus app (in development)", "Quietora Focus is a Windows-first distraction management app in development: planned app and website blocking, timed deep work, profiles and privacy-forward insights. Join early access."),
  component: Focus,
});

const features = [
  { icon: Ban, t: "Website & app blocking", d: "Pause the specific sites and Windows apps that pull you away — for a session, a schedule, or until you finish." },
  { icon: Timer, t: "Timed deep work", d: "Start a focus block in one click. Pomodoro, 50-minute deep work or long exam-prep sessions." },
  { icon: Layers, t: "Custom profiles", d: "Different rules for studying, coding, writing or winding down — switch without reconfiguring." },
  { icon: BarChart3, t: "Privacy-forward insights", d: "See when you focus best and what interrupts you, designed to stay with you rather than us." },
];

const steps = [
  { n: "1", t: "Choose a profile", d: "Pick “Exam study” or build your own list of what to pause." },
  { n: "2", t: "Set the session", d: "Choose a length. Focus quietly holds the line until time is up." },
  { n: "3", t: "Work without the pull", d: "Distractions stay paused. A gentle note appears if you try to reach them." },
  { n: "4", t: "Reflect, briefly", d: "A short summary shows what went well — no guilt, no leaderboard." },
];

const faqs = [
  { q: "Is Quietora Focus available to download?", a: "Not yet. It's in active development for Windows. Joining early access is the best way to hear when a test build is ready." },
  { q: "Does the timer on this page block anything?", a: "No. The timer is a browser-only demonstration of the session experience. It doesn't block websites or apps, and nothing is sent anywhere." },
  { q: "Why Windows first?", a: "Most students and working professionals we're designing for use Windows laptops. Starting there lets us do one platform properly before expanding." },
  { q: "What data will Focus collect?", a: "Our design intent is to keep activity insights on your device by default, collect no browsing content, and make any optional sync clearly opt-in. We'll publish a full privacy policy for the app before release." },
  { q: "How much will it cost?", a: "We haven't set pricing. When we do, we'll publish it clearly — early access members will hear first." },
  { q: "Will there be Mac, Linux or mobile versions?", a: "Possibly, later. We'd rather make the Windows experience excellent first; tell us your platform in the early access form so we can prioritise." },
];

function Focus() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Products", to: "/products" }, { label: "Quietora Focus" }]}
        eyebrow="Product · Windows-first"
        title={<>Quietora <span className="text-gradient-mark">Focus</span></>}
        lead="A calm, Windows-first app for blocking distractions and protecting deep work — designed for Indian students and professionals, and built to travel."
        aside={<HeroVisual />}
      >
        <div className="flex w-full flex-wrap items-center gap-3">
          <StatusBadge status="In development" />
          <span className="text-sm text-muted-foreground">Not yet released · Early access list open</span>
        </div>
        <Button asChild size="lg"><a href="#early-access">Join early access <ArrowRight /></a></Button>
        <Button asChild size="lg" variant="outline" className="rounded-full"><a href="#demo">Try the session demo</a></Button>
      </PageHero>

      <section className="container-q py-20">
        <SectionHeading eyebrow="Proposed features" title="Everything you need to stay with one thing." lead="These are the capabilities we're building. Details may change as we test with real users." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.t} delay={i * 70} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint-soft text-navy"><f.icon className="h-5 w-5" /></span>
              <h3 className="mt-5 text-lg font-semibold text-navy">{f.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-mist py-20">
        <div className="container-q">
          <SectionHeading eyebrow="How it will work" title="Four steps. No setup marathon." />
          <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
            {steps.map((s) => (
              <li key={s.n} className="bg-card p-6">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-navy font-mono text-sm text-navy-foreground">{s.n}</span>
                <h3 className="mt-5 font-semibold text-navy">{s.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="demo" className="container-q grid scroll-mt-24 items-center gap-12 py-20 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Interactive demo" title="Feel what a session is like." lead="Pick a length and press start. This is a browser-only demonstration of the timer experience — it doesn't block anything on your device." />
          <ul className="mt-8 space-y-3 text-sm text-charcoal">
            <li className="flex gap-3"><Monitor className="h-4 w-4 shrink-0 text-ocean" /> The real app will run natively on Windows.</li>
            <li className="flex gap-3"><Ban className="h-4 w-4 shrink-0 text-ocean" /> Blocking is not active in this demo.</li>
            <li className="flex gap-3"><Lock className="h-4 w-4 shrink-0 text-ocean" /> No data is collected from the demo.</li>
          </ul>
        </div>
        <FocusTimer />
      </section>

      <section className="relative overflow-hidden bg-navy-gradient py-20 text-navy-foreground">
        <div className="pointer-events-none absolute inset-0 dot-grid-light opacity-30" />
        <div className="container-q relative">
          <SectionHeading light eyebrow="Privacy by design" title="Focus that doesn't watch you." lead="These are commitments in our design, which we'll formalise in the app's privacy policy before release." />
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {[
              { icon: HardDrive, t: "On-device by default", d: "Activity insights are intended to be stored locally." },
              { icon: EyeOff, t: "No content capture", d: "No screenshots, keystrokes or page contents." },
              { icon: Lock, t: "Opt-in sync only", d: "Anything leaving your device will be your explicit choice." },
              { icon: Trash2, t: "Easy to erase", d: "Clear your history at any time, completely." },
            ].map((c) => (
              <div key={c.t} className="glass-dark rounded-2xl p-5">
                <c.icon className="h-5 w-5 text-mint" />
                <p className="mt-4 font-display font-semibold">{c.t}</p>
                <p className="mt-1 text-sm text-navy-foreground/65">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-q grid gap-12 py-20 lg:grid-cols-[1fr_1.2fr]">
        <SectionHeading eyebrow="FAQ" title="Straight answers." />
        <FAQ items={faqs} />
      </section>

      <section id="early-access" className="scroll-mt-20 border-t border-border bg-hero py-20">
        <div className="container-q grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <Eyebrow>Early access</Eyebrow>
            <h2 className="mt-3 text-4xl font-semibold text-navy">Be among the first to try Focus.</h2>
            <p className="mt-4 text-lg text-muted-foreground">Join the list and we'll contact you when there's a Windows test build. One email address, no spam, unsubscribe any time by writing to us.</p>
            <HonestNote className="mt-8">Joining doesn't guarantee a release date or place in a test cohort — we'll be upfront about timing as it firms up.</HonestNote>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-lift md:p-8">
            <LeadForm
              kind="early_access"
              submitLabel="Join early access"
              fields={[
                { name: "roleTitle", label: "I am a", options: FOCUS_ROLES },
                { name: "details.platform", label: "Main device", options: ["Windows laptop/PC", "Mac", "Linux", "Mostly phone"] },
                { name: "message", label: "What distracts you most?", placeholder: "e.g. YouTube during exam prep, chat apps while coding" },
              ]}
            />
          </div>
        </div>
      </section>
      <div className="container-q py-8 text-sm"><Link to="/products" className="text-ocean hover:underline">← All products</Link></div>
    </>
  );
}
