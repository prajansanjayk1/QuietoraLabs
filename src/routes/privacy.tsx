import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/primitives";
import { pageMeta, CONTACT_PHONE, CONTACT_PHONE_TEL, WHATSAPP_URL } from "@/lib/seo";
import { ShieldCheck, Lock, EyeOff, UserCheck, Phone, Mail, MessageCircle, FileText } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageMeta(
      "Privacy Policy",
      "Official Privacy Policy of QuietoraLabs. How we collect, safeguard, and process contact details, waitlists, and job applications.",
    ),
  component: PrivacyPage,
});

function PrivacyPage() {
  const lastUpdated = "November 2, 2026";

  return (
    <>
      <PageHero
        crumbs={[{ label: "Legal" }, { label: "Privacy Policy" }]}
        eyebrow="Data Protection & Privacy · India"
        title="Privacy Policy"
        lead="QuietoraLabs exists to give people their focus back. We treat your personal data with that exact same level of respect and restraint."
      />

      <article className="container-q max-w-4xl py-14 leading-relaxed text-charcoal">
        <div className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-mono">
              <ShieldCheck className="h-4 w-4 text-mint-contrast" /> DPDP Act & Global Standards Aligned
            </span>
            <span>•</span>
            <span>Effective: {lastUpdated}</span>
            <span>•</span>
            <span className="rounded-full bg-secondary px-2.5 py-0.5 font-medium text-navy">
              QuietoraLabs (India)
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            This Privacy Policy explains how <strong className="text-navy">QuietoraLabs</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;)
            collects, uses, protects, and discloses personal information obtained through our website (<span className="font-mono text-xs">quietoralabs.com</span>),
            early-access waitlist forms, institutional partnership inquiries, general contact channels, and job application portals.
          </p>
        </div>

        <div className="space-y-12">
          {/* Section 1: Core Principles */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-navy">
              <span className="text-ocean">1.</span> Our Core Privacy Commitments
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <EyeOff className="h-5 w-5 text-ocean" />
                <p className="mt-2 font-semibold text-navy">Zero Data Selling</p>
                <p className="mt-1 text-xs text-muted-foreground leading-normal">
                  We never sell, rent, or trade your personal information to data brokers or third parties.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <Lock className="h-5 w-5 text-mint-contrast" />
                <p className="mt-2 font-semibold text-navy">Restricted Access</p>
                <p className="mt-1 text-xs text-muted-foreground leading-normal">
                  Protected by PostgreSQL Row Level Security; accessible only by authenticated QuietoraLabs operators.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <UserCheck className="h-5 w-5 text-ocean" />
                <p className="mt-2 font-semibold text-navy">No Ad Trackers</p>
                <p className="mt-1 text-xs text-muted-foreground leading-normal">
                  We run zero invasive behavioural advertising pixels or third-party tracking cookies on this website.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Data Collected */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-navy">
              <span className="text-ocean">2.</span> Categories of Personal Data We Collect
            </h2>
            <p>
              We collect information that you explicitly and voluntarily provide when interacting with our forms:
            </p>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="font-semibold text-navy">A. Quietora Focus Early Access Waitlist</p>
                <p className="mt-1 text-muted-foreground">
                  Your name, email address, profession or role category (e.g. Student, Working Professional, Educator),
                  explicit consent record, and timestamp.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="font-semibold text-navy">B. Institutional Partnership Inquiries</p>
                <p className="mt-1 text-muted-foreground">
                  Your name, business email, institution or organisation name, partner type (e.g. College, Bootcamp, Coaching Centre),
                  estimated cohort size or focus interest, message content, and consent.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="font-semibold text-navy">C. Career & Job Applications</p>
                <p className="mt-1 text-muted-foreground">
                  Your full name, email address, telephone/WhatsApp contact number, role applied for, resume/CV link,
                  portfolio/GitHub/LinkedIn profiles, location, availability/notice period, and cover statement.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="font-semibold text-navy">D. General Inquiries & Media Contact</p>
                <p className="mt-1 text-muted-foreground">
                  Your name, email address, inquiry topic, organization (optional), and message text.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Purpose & Legal Basis */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-navy">
              <span className="text-ocean">3.</span> Purposes and Legal Grounds for Processing
            </h2>
            <p>We process your personal information on the following legal bases:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-charcoal/90">
              <li>
                <strong className="text-navy">Consent:</strong> When you check our explicit consent box, you authorise us to
                store your details to communicate with you regarding your inquiry, invite you to Quietora Focus testing builds,
                or evaluate your job application.
              </li>
              <li>
                <strong className="text-navy">Pre-Contractual & Recruitment Evaluation:</strong> For career candidates, we process
                application details to evaluate qualifications, review portfolios, and conduct hiring discussions.
              </li>
              <li>
                <strong className="text-navy">Legitimate Interests:</strong> To protect our website from spam, automated bots,
                and malicious payloads using client honeypots and server-side rate limits.
              </li>
            </ul>
          </section>

          {/* Section 4: Data Security */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-navy">
              <span className="text-ocean">4.</span> Storage, Security & Access Controls
            </h2>
            <p>
              We implement comprehensive technical and operational security controls to safeguard your data:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm">
              <li>
                <strong className="text-navy">Row Level Security (RLS):</strong> Submissions are secured in PostgreSQL with
                strict Row Level Security policies. Public users cannot read database tables; only authenticated operators
                with an explicitly granted administrative role can access submissions.
              </li>
              <li>
                <strong className="text-navy">Encryption in Transit:</strong> All communications between your web browser and our
                servers occur exclusively over HTTPS (TLS 1.3).
              </li>
              <li>
                <strong className="text-navy">Service Role Isolation:</strong> Public forms write through server-side validated
                functions using isolated backend credentials, ensuring API keys are never exposed in browser bundles.
              </li>
            </ul>
          </section>

          {/* Section 5: Cookies & Local Storage */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-navy">
              <span className="text-ocean">5.</span> Cookies & Browser Storage
            </h2>
            <p>
              This website does not use third-party tracking or advertising cookies.
            </p>
            <p className="text-sm">
              We use standard browser <code className="rounded bg-secondary px-1.5 py-0.5 text-xs text-navy font-mono">localStorage</code> solely
              for authenticating authorized studio operators on <Link to="/admin" className="text-ocean underline underline-offset-2">/admin</Link>.
              The Focus Session Timer demo runs 100% in local browser memory and sends no timer logs or activity data to our servers.
            </p>
          </section>

          {/* Section 6: User Rights */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-navy">
              <span className="text-ocean">6.</span> Your Rights under the Indian DPDP Act & Global Standards
            </h2>
            <p>
              Under the Digital Personal Data Protection Act (DPDP Act, 2023) and recognized privacy frameworks, you have the following rights:
            </p>
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <div className="rounded-xl border border-border bg-card p-3.5">
                <p className="font-semibold text-navy">Right of Access & Confirmation</p>
                <p className="mt-1 text-xs text-muted-foreground">Request a copy of the personal data we hold about you.</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-3.5">
                <p className="font-semibold text-navy">Right to Correction & Erasure</p>
                <p className="mt-1 text-xs text-muted-foreground">Request correction of inaccurate information or deletion of your waitlist record.</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-3.5">
                <p className="font-semibold text-navy">Right to Withdraw Consent</p>
                <p className="mt-1 text-xs text-muted-foreground">Opt out of testing invitations or recruitment review at any time without penalty.</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-3.5">
                <p className="font-semibold text-navy">Right of Grievance Redressal</p>
                <p className="mt-1 text-xs text-muted-foreground">Directly reach out to our team to resolve any data privacy concern promptly.</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              To exercise any of these rights, simply submit a request through our{" "}
              <Link to="/contact" className="text-ocean underline underline-offset-2">contact form</Link> or reach out directly via telephone or WhatsApp.
            </p>
          </section>

          {/* Section 7: Contact & Grievance */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-navy">
              <span className="text-ocean">7.</span> Privacy Grievance & Operator Contact
            </h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy, please contact our team:
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <Mail className="h-5 w-5 text-ocean shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Inquiries & Privacy</p>
                  <Link to="/contact" className="text-xs font-medium text-navy hover:underline">
                    Online Contact Form
                  </Link>
                </div>
              </div>
              <a
                href={CONTACT_PHONE_TEL}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-ocean transition-colors"
              >
                <Phone className="h-5 w-5 text-ocean shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Direct Telephone</p>
                  <p className="truncate text-xs font-medium text-navy">{CONTACT_PHONE}</p>
                </div>
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-mint transition-colors"
              >
                <MessageCircle className="h-5 w-5 text-mint-contrast shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">WhatsApp Chat</p>
                  <p className="truncate text-xs font-medium text-navy">{CONTACT_PHONE}</p>
                </div>
              </a>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
