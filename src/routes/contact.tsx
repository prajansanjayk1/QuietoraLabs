import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Linkedin, MessageSquare, Newspaper, Briefcase, Users, Phone, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/site/primitives";
import { LeadForm } from "@/components/site/LeadForm";
import { CONTACT_TYPES } from "@/lib/lead-schema";
import { LINKEDIN_URL, CONTACT_PHONE, CONTACT_PHONE_TEL, WHATSAPP_URL, pageMeta } from "@/lib/seo";

const search = z.object({ type: z.enum(CONTACT_TYPES).optional().catch(undefined) });

export const Route = createFileRoute("/contact")({
  validateSearch: (s) => search.parse(s),
  head: () => pageMeta("Contact QuietoraLabs", "Get in touch with QuietoraLabs about partnerships, general enquiries, media, careers or collaboration. We read every message personally."),
  component: Contact,
});

const reasons = [
  { icon: Users, t: "Partnerships", d: "Institutions and organisations" },
  { icon: MessageSquare, t: "General", d: "Questions about our work" },
  { icon: Newspaper, t: "Media", d: "Press and interviews" },
  { icon: Briefcase, t: "Careers", d: "Future teammates" },
];

function Contact() {
  const { type } = Route.useSearch();
  return (
    <>
      <PageHero
        crumbs={[{ label: "Contact" }]}
        eyebrow="Contact"
        title="Say hello."
        lead="Use the form below — it reaches our team directly. We don't use chatbots or auto-replies."
      />
      <section className="container-q grid gap-12 py-16 lg:grid-cols-[1fr_1.5fr]">
        <aside className="space-y-4">
          {reasons.map((r) => (
            <div key={r.t} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
              <r.icon className="h-5 w-5 text-ocean" />
              <div><p className="font-medium text-navy">{r.t}</p><p className="text-sm text-muted-foreground">{r.d}</p></div>
            </div>
          ))}

          {/* Direct phone call & WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={CONTACT_PHONE_TEL}
              className="flex items-center gap-3.5 rounded-xl border border-border bg-card p-4 transition-colors hover:border-ocean hover:bg-secondary/40"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ocean/10 text-ocean">
                <Phone className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-navy">Direct call</p>
                <p className="truncate text-xs text-muted-foreground">{CONTACT_PHONE}</p>
              </div>
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 rounded-xl border border-border bg-card p-4 transition-colors hover:border-mint hover:bg-mint-soft/30"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-mint-soft text-navy">
                <MessageCircle className="h-5 w-5 text-mint-contrast" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-navy">WhatsApp</p>
                <p className="truncate text-xs text-muted-foreground">{CONTACT_PHONE}</p>
              </div>
            </a>
          </div>

          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-xl border border-border bg-navy p-4 text-navy-foreground hover:bg-navy-soft">
            <Linkedin className="h-5 w-5 text-mint" />
            <div><p className="font-medium">QuietoraLabs on LinkedIn</p><p className="text-sm text-navy-foreground/60">Follow our progress</p></div>
          </a>
          <p className="text-sm text-muted-foreground">
            Institution looking at a pilot? The <Link to="/products/quietora-campus" hash="pilot-interest" className="text-ocean hover:underline">Campus interest form</Link> asks the right questions.
          </p>
        </aside>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-lift md:p-8">
          <LeadForm
            key={type ?? "none"}
            kind="contact"
            submitLabel="Send message"
            initial={type ? { enquiryType: type } : undefined}
            fields={[
              { name: "enquiryType", label: "Enquiry type", required: true, options: CONTACT_TYPES },
              { name: "organization", label: "Organisation" },
              { name: "message", label: "Message", required: true, placeholder: "How can we help?" },
            ]}
          />
        </div>
      </section>
    </>
  );
}
