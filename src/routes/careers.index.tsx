import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Briefcase,
  Code2,
  Cpu,
  Palette,
  Sparkles,
  Users2,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Clock,
  MapPin,
  Laptop,
  Compass,
  HeartHandshake,
  ShieldCheck,
  Building,
  RefreshCw,
  Search,
  Check,
  HelpCircle,
} from "lucide-react";
import { PageHero, SectionHeading, Reveal, Eyebrow } from "@/components/site/primitives";
import { listJobPostings, type JobPosting, DEFAULT_JOB_POSTINGS } from "@/lib/jobs.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/careers/")({
  head: () =>
    pageMeta(
      "Careers at QuietoraLabs",
      "Join our independent software studio in India. We build focus, learning, and digital wellbeing products with high autonomy and calm craft.",
    ),
  component: CareersPage,
});

function CareersPage() {
  const getJobsFn = useServerFn(listJobPostings);
  const [jobs, setJobs] = useState<JobPosting[]>(DEFAULT_JOB_POSTINGS);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function fetchJobs() {
      try {
        const data = await getJobsFn();
        if (active && data && data.length > 0) {
          setJobs(data);
        }
      } catch (err) {
        console.warn("Failed to load jobs list from server, using fallback:", err);
      } finally {
        if (active) setLoadingJobs(false);
      }
    }
    fetchJobs();
    return () => {
      active = false;
    };
  }, []);

  const departments = [
    { key: "all", label: "All Roles" },
    { key: "Core Desktop Engine", label: "Core Systems" },
    { key: "Design & Experience", label: "Design" },
    { key: "Web & Studio Platform", label: "Web Platform" },
    { key: "Quietora Product Lab", label: "Product Lab" },
    { key: "other", label: "✨ Other / Custom Role" },
  ];

  const filteredJobs = jobs.filter((job) => {
    if (departmentFilter === "other") return false;
    if (departmentFilter !== "all" && job.department !== departmentFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        job.title.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.summary.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="relative min-h-screen bg-sand/30 text-navy pb-24">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Hero Section */}
      <PageHero
        crumbs={[{ label: "Careers" }]}
        eyebrow="Careers at QuietoraLabs"
        title="Software craft for people who care about focus."
        lead="QuietoraLabs is an independent software product studio in India. We build desktop-first tools and institutional learning environments that help people protect their cognitive autonomy."
      />

      <div className="mx-auto max-w-6xl px-6 space-y-24">
        {/* Studio Values / Manifesto Ribbon */}
        <Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-lift">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ocean/10 text-ocean mb-4">
                <Laptop className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-navy">High Autonomy, Async-First</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                We believe uninterrupted blocks of time are where great code and great design come from. We minimize
                standups, write thorough RFCs, and give you ownership of whole systems.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-lift">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mint-soft text-mint-contrast mb-4">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-navy">Honest, Calm Products</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                We never monetize engagement, dark patterns, or private surveillance. Our software is deliberately
                restrained, beautiful, and engineered to respect the human brain.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-lift">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sand text-navy mb-4">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-navy">Meaningful Equity & Freedom</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Founding team members receive meaningful equity and competitive cash compensation. Work from anywhere
                in India with top-tier hardware, ergonomics, and health allowances.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Open Roles Section */}
        <div id="open-roles" className="space-y-8 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-border/80 pb-6">
            <div>
              <Eyebrow>Live Openings</Eyebrow>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy">Open Roles at the Studio</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                All roles report directly to studio founders with rapid 3-day review timelines.
              </p>
            </div>

            {/* Live Count Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-ocean/30 bg-card px-4 py-1.5 shadow-xs">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-medium text-navy">
                {jobs.length} Active {jobs.length === 1 ? "Opening" : "Openings"}
              </span>
            </div>
          </div>

          {/* Department Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-2">
              {departments.map((dep) => (
                <button
                  key={dep.key}
                  type="button"
                  onClick={() => setDepartmentFilter(dep.key)}
                  className={cn(
                    "rounded-xl px-3 py-1.5 text-xs font-medium transition-all",
                    departmentFilter === dep.key
                      ? "bg-navy text-white shadow-soft"
                      : "bg-card border border-border text-muted-foreground hover:text-navy hover:bg-sand/60",
                  )}
                >
                  {dep.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by skill or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-card pl-9 pr-3 py-1.5 text-xs text-navy placeholder:text-muted-foreground/70 focus:border-ocean focus:outline-none"
              />
            </div>
          </div>

          {/* Job Cards Feed */}
          {loadingJobs ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="h-6 w-6 animate-spin text-ocean" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => {
                const isExpanded = expandedJobId === job.id;
                return (
                  <Reveal key={job.id}>
                    <div className="group rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft transition-all hover:border-ocean/40 hover:shadow-lift">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        {/* Title & Metadata */}
                        <div className="space-y-3 max-w-2xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-0.5 text-xs font-medium text-navy">
                              <Building className="h-3 w-3 text-muted-foreground" /> {job.department}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-0.5 text-xs font-medium text-navy">
                              <MapPin className="h-3 w-3 text-muted-foreground" /> {job.location}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-0.5 text-xs font-medium text-navy">
                              <Clock className="h-3 w-3 text-muted-foreground" /> {job.type}
                            </span>
                            {job.salary_range && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-xs font-medium border border-emerald-200/60">
                                {job.salary_range}
                              </span>
                            )}
                          </div>

                          <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-navy group-hover:text-ocean transition-colors">
                            {job.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{job.summary}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                          <button
                            type="button"
                            onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                            className="text-xs font-medium text-muted-foreground hover:text-navy underline underline-offset-4 px-2 py-1"
                          >
                            {isExpanded ? "Hide Details" : "View Responsibilities & Perks"}
                          </button>

                          <Link to="/careers/apply" search={{ role: job.slug || job.id }}>
                            <Button className="gap-2 rounded-xl bg-navy text-white hover:bg-navy-soft shadow-soft text-xs font-semibold px-5 py-2">
                              Apply for Role <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {/* Expandable Details Drawer */}
                      {isExpanded && (
                        <div className="mt-6 border-t border-border/60 pt-6 space-y-6 animate-fade-in text-xs">
                          {job.description && (
                            <div>
                              <h4 className="font-semibold text-navy font-display text-sm mb-1.5">About the Role</h4>
                              <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {job.responsibilities && job.responsibilities.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-navy font-display mb-2">Key Responsibilities</h4>
                                <ul className="space-y-1.5 text-muted-foreground">
                                  {job.responsibilities.map((r, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                      <Check className="h-3.5 w-3.5 text-ocean shrink-0 mt-0.5" />
                                      <span>{r}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {job.requirements && job.requirements.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-navy font-display mb-2">What We Look For</h4>
                                <ul className="space-y-1.5 text-muted-foreground">
                                  {job.requirements.map((req, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                      <Check className="h-3.5 w-3.5 text-mint-contrast shrink-0 mt-0.5" />
                                      <span>{req}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {job.perks && job.perks.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-navy font-display mb-2">What We Offer</h4>
                                <ul className="space-y-1.5 text-muted-foreground">
                                  {job.perks.map((p, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                      <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                                      <span>{p}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-end pt-2">
                            <Link to="/careers/apply" search={{ role: job.slug || job.id }}>
                              <Button className="gap-2 rounded-xl bg-ocean text-white hover:bg-ocean/90 text-xs">
                                Proceed to Application Form <ArrowRight className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </Reveal>
                );
              })}

              {/* "Other / Custom Role" Card - Always Visible for Candidates who want to propose their own role */}
              {(departmentFilter === "all" || departmentFilter === "other") && (
                <Reveal>
                  <div className="rounded-3xl border-2 border-dashed border-ocean/30 bg-card p-6 sm:p-8 shadow-soft transition-all hover:border-ocean/60">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="space-y-3 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-ocean/10 text-ocean px-2.5 py-0.5 text-xs font-semibold">
                            <Sparkles className="h-3 w-3" /> Custom Proposal
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-0.5 text-xs font-medium text-navy">
                            <MapPin className="h-3 w-3 text-muted-foreground" /> Remote (India) / Flexible
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-0.5 text-xs font-medium text-navy">
                            <Clock className="h-3 w-3 text-muted-foreground" /> Full-time / Fellowship / Contract
                          </span>
                        </div>

                        <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-navy">
                          Other / Propose a Custom Role
                        </h3>

                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          Don't see your exact role or discipline listed above? If you have deep craft in systems engineering,
                          reverse engineering, security, sound design, human ergonomics, or developer community, propose
                          your role. We build roles for exceptional talent.
                        </p>
                      </div>

                      <div className="shrink-0">
                        <Link to="/careers/apply" search={{ role: "other" }}>
                          <Button className="gap-2 rounded-xl bg-ocean text-white hover:bg-ocean/90 shadow-soft text-xs font-semibold px-6 py-2.5">
                            Propose Your Role <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )}
            </div>
          )}

          {/* Don't see your exact role? Card */}
          <Reveal>
            <div className="rounded-3xl border border-border bg-card/60 p-8 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-ocean/10 text-ocean">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-navy">Don't see your exact role?</h3>
              <p className="text-xs text-muted-foreground max-w-xl mx-auto leading-relaxed">
                We frequently create custom positions for high-craft builders, kernel hackers, systems researchers, and
                ergonomic designers. Tell us what you want to build at QuietoraLabs.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/careers/apply" search={{ role: "other" }}>
                  <Button className="rounded-xl bg-navy text-white hover:bg-navy-soft gap-2 text-xs">
                    Apply for Other / Custom Role <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link to="/careers/apply" search={{ role: "general" }}>
                  <Button variant="outline" className="rounded-xl border-navy/20 gap-2 text-xs">
                    Submit General Application
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
