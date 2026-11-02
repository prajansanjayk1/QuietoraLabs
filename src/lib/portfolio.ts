import type { Status } from "@/components/site/primitives";

export type Category = "Productivity" | "Education" | "Healthcare tech";

export type PortfolioItem = {
  slug: string;
  name: string;
  to: "/products/quietora-focus" | "/products/quietora-campus" | "/projects/medique";
  category: Category;
  kind: "Product" | "Partnership offering" | "Portfolio exploration";
  status: Status;
  tagline: string;
  summary: string;
  platform: string;
  stage: string;
};

export const PORTFOLIO: PortfolioItem[] = [
  {
    slug: "focus",
    name: "Quietora Focus",
    to: "/products/quietora-focus",
    category: "Productivity",
    kind: "Product",
    status: "In development",
    tagline: "Distraction management for deep work.",
    summary:
      "A Windows-first focus app with planned website and app blocking, timed deep-work sessions, custom profiles and privacy-forward insights.",
    platform: "Windows (first)",
    stage: "Building core blocking engine; early access list open",
  },
  {
    slug: "campus",
    name: "Quietora Campus",
    to: "/products/quietora-campus",
    category: "Education",
    kind: "Partnership offering",
    status: "Proposed",
    tagline: "Focus support for learning institutions.",
    summary:
      "A proposed partnership offering for colleges, bootcamps and coaching centres, built on opt-in, aggregated insight — never individual surveillance.",
    platform: "Built on Quietora Focus",
    stage: "Shaping pilot model; no pilots announced",
  },
  {
    slug: "medique",
    name: "Medique",
    to: "/projects/medique",
    category: "Healthcare tech",
    kind: "Portfolio exploration",
    status: "Concept",
    tagline: "An early exploration in healthcare technology.",
    summary:
      "A concept-stage portfolio project. We're doing problem framing and experience design; scope is still being defined.",
    platform: "To be defined",
    stage: "Discovery and problem framing",
  },
];
