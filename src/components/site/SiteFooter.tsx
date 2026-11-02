import { Link } from "@tanstack/react-router";
import { Linkedin, Phone, MessageCircle } from "lucide-react";
import { Wordmark } from "./Logo";
import { LINKEDIN_URL, CONTACT_PHONE, CONTACT_PHONE_TEL, WHATSAPP_URL } from "@/lib/seo";

const cols = [
  {
    title: "Products",
    links: [
      { to: "/products", label: "Overview" },
      { to: "/products/quietora-focus", label: "Quietora Focus" },
      { to: "/products/quietora-campus", label: "Quietora Campus" },
    ],
  },
  {
    title: "Work",
    links: [
      { to: "/projects", label: "All projects" },
      { to: "/projects/medique", label: "Medique (concept)" },
      { to: "/partners", label: "Partner with us" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/careers", label: "Careers" },
      { to: "/contact", label: "Contact" },
      { to: "/privacy", label: "Privacy" },
      { to: "/terms", label: "Terms" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-navy text-navy-foreground">
      <div className="pointer-events-none absolute inset-0 dot-grid-light opacity-40" />
      <div className="container-q relative grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Wordmark light />
          <p className="mt-5 text-sm leading-relaxed text-navy-foreground/65">
            An independent software product studio in India, building technology that gives people their focus back.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/20 px-3.5 py-1.5 text-xs text-navy-foreground/80 hover:border-mint hover:text-mint transition-colors"
            >
              <Linkedin className="h-3.5 w-3.5" /> LinkedIn
            </a>
            <a
              href={CONTACT_PHONE_TEL}
              className="inline-flex items-center gap-1.5 rounded-full border border-navy-foreground/20 px-3.5 py-1.5 text-xs text-navy-foreground/80 hover:border-mint hover:text-mint transition-colors"
            >
              <Phone className="h-3.5 w-3.5" /> {CONTACT_PHONE}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-navy-foreground/20 px-3.5 py-1.5 text-xs text-navy-foreground/80 hover:border-mint hover:text-mint transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </a>
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="eyebrow text-mint">{c.title}</p>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-navy-foreground/75 hover:text-navy-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-q relative flex flex-col gap-2 border-t border-navy-foreground/10 py-6 text-xs text-navy-foreground/50 md:flex-row md:justify-between">
        <p>© {new Date().getFullYear()} QuietoraLabs. Made in India.</p>
        <p>Products shown are in development or exploration. Nothing here is a live service yet.</p>
      </div>
    </footer>
  );
}
