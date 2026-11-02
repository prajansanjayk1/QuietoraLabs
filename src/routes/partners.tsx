import { createFileRoute } from "@tanstack/react-router";
import { School, FlaskConical, Handshake, Check } from "lucide-react";
import { PageHero, Reveal, SectionHeading, HonestNote } from "@/components/site/primitives";
import { LeadForm } from "@/components/site/LeadForm";
import { PARTNER_TYPES } from "@/lib/lead-schema";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/partners")({
  head: () => pageMeta("Partner with QuietoraLabs", "Partnerships for educational institutions, researchers and collaborators interested in focus, digital wellbeing and learning technology. Start a conversation."),
  component: Partners,
});

const tracks = [
  { icon: School, t: "Educational institutions", d: "Colleges, coding bootcamps and coaching centres interested in shaping responsible Quietora Campus pilots.", points: ["Customised pilot scope", "Opt-in student participation", "Aggregated, anonymised insight"] },
  { icon: FlaskConical, t: "Researchers", d: "Academics studying attention, digital wellbeing or learning who want to explore ethical collaboration.", points: ["Study design conversations", "Privacy-first methods", "Shared learning"] },
  { icon: Handshake, t: "Collaborators", d: "Designers, engineers, domain experts and organisations aligned with building calmer software.", points: ["Product feedback", "Domain expertise", "Co-exploration (e.g. Medique)"] },
];

function Partners() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Partners" }]}
        eyebrow="Partnerships"
        title={<>Build calmer technology <span className="text-gradient-mark">with us.</span></>}
        lead="We're early, which means partners genuinely shape what we build. If you care about focus, learning or wellbeing, let's talk."
      />
      <section className="container-q py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {tracks.map((t, i) => (
            <Reveal key={t.t} delay={i * 80} className="flex flex-col rounded-2xl border border-border bg-card p-7 shadow-soft">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-mint-soft text-navy"><t.icon className="h-5 w-5" /></span>
              <h2 className="mt-5 text-xl font-semibold text-navy">{t.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.d}</p>
              <ul className="mt-5 space-y-2 border-t border-border pt-5">
                {t.points.map((p) => <li key={p} className="flex gap-2 text-sm text-charcoal"><Check className="h-4 w-4 text-success" />{p}</li>)}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="border-t border-border bg-hero py-20">
        <div className="container-q grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <SectionHeading eyebrow="Start a conversation" title="Tell us what you have in mind." lead="We reply personally. Expect a thoughtful response rather than an automated sequence." />
            <ul className="mt-8 space-y-4 text-sm text-charcoal">
              <li><strong className="text-navy">What happens next:</strong> we review your note and reply if we can offer a useful conversation.</li>
              <li><strong className="text-navy">What we won't do:</strong> add you to marketing lists or share your details.</li>
            </ul>
            <HonestNote className="mt-8">We haven't announced any partnerships yet. Submitting this form doesn't create an agreement of any kind.</HonestNote>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-lift md:p-8">
            <LeadForm
              kind="partnership"
              submitLabel="Send partnership enquiry"
              fields={[
                { name: "organization", label: "Organisation", required: true },
                { name: "enquiryType", label: "I'm reaching out as", required: true, options: PARTNER_TYPES },
                { name: "roleTitle", label: "Your role" },
                { name: "message", label: "What would you like to explore?", required: true },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
