import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/primitives";
import { pageMeta, CONTACT_PHONE, CONTACT_PHONE_TEL, WHATSAPP_URL } from "@/lib/seo";
import { ShieldCheck, FileText, Scale, AlertTriangle, Phone, Mail, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () =>
    pageMeta(
      "Terms & Conditions",
      "Terms and Conditions governing the use of QuietoraLabs website, pre-release products, waitlists, and career applications.",
    ),
  component: TermsPage,
});

function TermsPage() {
  const lastUpdated = "November 2, 2026";

  return (
    <>
      <PageHero
        crumbs={[{ label: "Legal" }, { label: "Terms & Conditions" }]}
        eyebrow="Legal Agreement · India"
        title="Terms & Conditions"
        lead="Please read these terms carefully before accessing or using the QuietoraLabs website, pre-release waitlists, or candidate application portals."
      />

      <article className="container-q max-w-4xl py-14 leading-relaxed text-charcoal">
        <div className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-mono">
              <FileText className="h-4 w-4 text-ocean" /> Version 2.1
            </span>
            <span>•</span>
            <span>Effective: {lastUpdated}</span>
            <span>•</span>
            <span className="rounded-full bg-secondary px-2.5 py-0.5 font-medium text-navy">
              QuietoraLabs (India)
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you and{" "}
            <strong className="text-navy">QuietoraLabs</strong> (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;),
            an independent software product studio headquartered in India.
          </p>
        </div>

        <div className="space-y-12">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-navy">
              <span className="text-ocean">1.</span> Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or using this website (<span className="font-mono text-xs">quietoralabs.com</span>),
              submitting forms (including early access waitlists, institutional partnership inquiries, general contact,
              or career applications), you acknowledge that you have read, understood, and agree to be bound by these Terms and our{" "}
              <Link to="/privacy" className="text-ocean underline underline-offset-2 hover:text-navy">
                Privacy Policy
              </Link>. If you do not agree to these Terms, you must not access or use this website.
            </p>
            <p>
              If you represent an educational institution, company, or other legal entity, you represent and warrant that
              you have the authority to bind such entity to these Terms.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-navy">
              <span className="text-ocean">2.</span> Studio & Pre-Release Product Disclosures
            </h2>
            <div className="rounded-xl border border-warning/40 bg-warning-soft/30 p-4 text-sm">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-navy">Honest Product Status Disclosure</p>
                  <p className="text-muted-foreground">
                    QuietoraLabs builds proprietary software products. The products described on this website are at various
                    stages of research and development:
                  </p>
                </div>
              </div>
            </div>
            <ul className="list-disc pl-6 space-y-2 text-sm text-charcoal/90">
              <li>
                <strong className="text-navy">Quietora Focus</strong> is a Windows-first software application currently{" "}
                <em>in active development</em>. Information regarding features, architecture, and roadmaps is directional.
                Early access registration grants consideration for pre-release testing builds but does not guarantee immediate access or commercial availability.
              </li>
              <li>
                <strong className="text-navy">Quietora Campus</strong> represents a proposed institutional offering for colleges,
                coding bootcamps, and coaching centres. Pilot inquiries are exploratory discussions, not binding contractual commitments.
              </li>
              <li>
                <strong className="text-navy">Medique</strong> is an early-stage portfolio concept and exploratory case study in
                healthcare experience design. It does not provide medical services, clinical diagnosis, treatment recommendations,
                or regulatory certifications.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-navy">
              <span className="text-ocean">3.</span> Interactive Browser Demonstrations
            </h2>
            <p>
              Interactive components provided on this website—such as the Focus Session Timer demonstration—operate solely within
              your web browser client using client-side JavaScript. They do not intercept OS processes, block native software, or transmit
              usage telemetry to our servers. They are provided purely for experiential visualization.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-navy">
              <span className="text-ocean">4.</span> Intellectual Property Rights
            </h2>
            <p>
              All content on this website—including but not limited to text, graphics, logos, the official QuietoraLabs Q emblem,
              wordmarks, user interface mockups, illustrations, code snippets, documentation, and audio-visual presentations—is the exclusive
              property of QuietoraLabs and is protected by applicable Indian and international copyright, trademark, and intellectual property laws.
            </p>
            <p>
              You may not copy, reproduce, distribute, reverse-engineer, modify, create derivative works from, or publicly display any portion of our
              content or proprietary software without prior written authorization from QuietoraLabs.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-navy">
              <span className="text-ocean">5.</span> User Submissions & Career Applications
            </h2>
            <p>
              When submitting forms through our website (including contact inquiries, early-access waitlists, and career applications):
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm">
              <li>You agree to provide true, accurate, current, and complete information about yourself.</li>
              <li>You agree not to submit spam, promotional advertisements, abusive language, or automated crawler payloads.</li>
              <li>You acknowledge that our forms incorporate abuse mitigation protections (such as bot honeypots and rate limiting).</li>
              <li>
                For <strong className="text-navy">Career Applications</strong>: Submitted resumes, portfolios, contact details, and work
                samples are processed strictly for recruitment evaluation and will be handled in accordance with our Privacy Policy.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-navy">
              <span className="text-ocean">6.</span> Disclaimer of Warranties
            </h2>
            <p className="text-sm">
              THIS WEBSITE AND ALL INFORMATION, MATERIALS, AND DEMONSTRATIONS CONTAINED HEREIN ARE PROVIDED ON AN &ldquo;AS IS&rdquo;
              AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
              TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. QUIETORALABS DOES NOT
              WARRANT THAT THE SITE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-navy">
              <span className="text-ocean">7.</span> Limitation of Liability
            </h2>
            <p className="text-sm">
              TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, IN NO EVENT SHALL QUIETORALABS, ITS FOUNDERS, EMPLOYEES, OR
              AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR IN
              CONNECTION WITH YOUR ACCESS TO OR USE OF (OR INABILITY TO USE) THIS WEBSITE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-navy">
              <span className="text-ocean">8.</span> Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms and any dispute or claim arising out of or related to them shall be governed by and construed in accordance
              with the laws of the Republic of India, without regard to its conflict of law principles. Any legal suit, action, or
              proceeding shall be instituted exclusively in the competent courts situated in India.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-navy">
              <span className="text-ocean">9.</span> Contact & Operator Communications
            </h2>
            <p>
              If you have any questions or legal inquiries regarding these Terms, please contact us directly:
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <Mail className="h-5 w-5 text-ocean shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">General & Legal</p>
                  <Link to="/contact" className="text-xs font-medium text-navy hover:underline">
                    Contact Form
                  </Link>
                </div>
              </div>
              <a
                href={CONTACT_PHONE_TEL}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-ocean transition-colors"
              >
                <Phone className="h-5 w-5 text-ocean shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Telephone Call</p>
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
