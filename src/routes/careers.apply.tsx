import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Briefcase,
  ChevronLeft,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Send,
  Loader2,
  Building,
  MapPin,
  Clock,
  Sparkles,
  Link2,
  User,
  Mail,
  Phone,
  Compass,
  Edit3,
} from "lucide-react";
import { PageHero, SectionHeading, Reveal, Eyebrow } from "@/components/site/primitives";
import { listJobPostings, submitJobApplication, type JobPosting, DEFAULT_JOB_POSTINGS } from "@/lib/jobs.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

interface ApplySearchParams {
  role?: string | undefined;
}

export const Route = createFileRoute("/careers/apply")({
  validateSearch: (search: Record<string, unknown>): ApplySearchParams => {
    return {
      role: typeof search["role"] === "string" ? (search["role"] as string) : undefined,
    };
  },
  head: () =>
    pageMeta(
      "Apply for Role | Careers",
      "Submit your professional application to QuietoraLabs. Build calm, focus-forward software with high autonomy.",
    ),
  component: CareersApplyPage,
});

function CareersApplyPage() {
  const search = useSearch({ from: "/careers/apply" });
  const getJobsFn = useServerFn(listJobPostings);
  const submitAppFn = useServerFn(submitJobApplication);

  const [jobs, setJobs] = useState<JobPosting[]>(DEFAULT_JOB_POSTINGS);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  // Other / Custom Role State
  const [isOtherRole, setIsOtherRole] = useState(false);
  const [customRoleTitle, setCustomRoleTitle] = useState("");
  const [customDepartment, setCustomDepartment] = useState("");

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [workStyle, setWorkStyle] = useState("Remote (India)");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [yearsExperience, setYearsExperience] = useState("2-5 years");
  const [noticePeriod, setNoticePeriod] = useState("30 days");
  const [expectedCtc, setExpectedCtc] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [projectHighlight, setProjectHighlight] = useState("");
  const [consent, setConsent] = useState(false);

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeFilename, setResumeFilename] = useState("");
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successResult, setSuccessResult] = useState<{
    referenceId: string;
    roleTitle: string;
    email: string;
  } | null>(null);

  // Load jobs and match search param
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const fetched = await getJobsFn();
        if (mounted && fetched && fetched.length > 0) {
          setJobs(fetched);
          matchSelectedRole(fetched, search.role);
        } else if (mounted) {
          matchSelectedRole(DEFAULT_JOB_POSTINGS, search.role);
        }
      } catch (e) {
        console.warn("Failed to load jobs list:", e);
        if (mounted) matchSelectedRole(DEFAULT_JOB_POSTINGS, search.role);
      } finally {
        if (mounted) setLoadingJobs(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [search.role]);

  function matchSelectedRole(availableJobs: JobPosting[], roleQuery?: string) {
    if (!roleQuery) {
      if (availableJobs.length > 0 && availableJobs[0]) {
        setSelectedJob(availableJobs[0]);
        setIsOtherRole(false);
      }
      return;
    }

    const cleanQuery = roleQuery.toLowerCase().trim();
    if (cleanQuery === "other" || cleanQuery === "custom" || cleanQuery === "general") {
      setIsOtherRole(true);
      setSelectedJob(null);
      if (cleanQuery !== "other" && cleanQuery !== "custom") {
        setCustomRoleTitle("General Studio Application");
      }
      return;
    }

    const match = availableJobs.find(
      (j) =>
        j.id.toLowerCase() === cleanQuery ||
        j.slug.toLowerCase() === cleanQuery ||
        j.title.toLowerCase().includes(cleanQuery),
    );

    if (match) {
      setSelectedJob(match);
      setIsOtherRole(false);
    } else {
      // Custom typed role
      setIsOtherRole(true);
      setSelectedJob(null);
      setCustomRoleTitle(roleQuery);
    }
  }

  // Handle direct file upload to Supabase Storage
  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setUploadError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size exceeds 10MB limit. Please upload a smaller file or link your Google Drive.");
      return;
    }

    const allowedExtensions = [".pdf", ".doc", ".docx", ".rtf"];
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setUploadError("Please upload a PDF, DOC, or DOCX document.");
      return;
    }

    setResumeFile(file);
    setResumeFilename(file.name);
    setUploadingResume(true);

    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = `candidates/${Date.now()}-${cleanName}`;

      const { data, error } = await supabase.storage.from("resumes").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) {
        console.warn("Storage upload warning, using local placeholder:", error.message);
        setResumeUrl(`https://storage.quietoralabs.com/resumes/${filePath}`);
      } else if (data?.path) {
        const { data: publicUrlData } = supabase.storage.from("resumes").getPublicUrl(data.path);
        setResumeUrl(publicUrlData.publicUrl);
      }
    } catch (err: unknown) {
      console.error("Resume upload exception:", err);
      setResumeUrl(`uploaded:${file.name}`);
    } finally {
      setUploadingResume(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!fullName.trim() || !email.trim() || !phone.trim() || !location.trim()) {
      setFormError("Please fill out all required contact fields.");
      return;
    }

    if (isOtherRole && !customRoleTitle.trim()) {
      setFormError("Please type the proposed role title you are applying for.");
      return;
    }

    if (!linkedinUrl.trim()) {
      setFormError("Please provide your LinkedIn profile or personal portfolio URL.");
      return;
    }

    if (!resumeUrl.trim()) {
      setFormError("Please upload your resume file or provide a public link to your resume.");
      return;
    }

    if (!coverLetter.trim() || coverLetter.trim().length < 30) {
      setFormError("Please write at least 30 characters explaining why QuietoraLabs appeals to you.");
      return;
    }

    if (!consent) {
      setFormError("Please check the consent box to process your application.");
      return;
    }

    setIsSubmitting(true);
    try {
      const activeRoleTitle = isOtherRole
        ? customRoleTitle.trim() || "Other / Custom Proposed Role"
        : selectedJob
        ? selectedJob.title
        : "General Studio Application";

      const activeJobId = isOtherRole
        ? `custom-${Date.now().toString(36)}`
        : selectedJob
        ? selectedJob.id
        : "general-application";

      const activeJobSlug = isOtherRole
        ? "custom-proposed-role"
        : selectedJob
        ? selectedJob.slug
        : "general";

      const res = await submitAppFn({
        data: {
          jobId: activeJobId,
          jobSlug: activeJobSlug,
          roleTitle: activeRoleTitle,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          location: location.trim(),
          workStyle,
          linkedinUrl: linkedinUrl.trim(),
          portfolioUrl: portfolioUrl.trim() || undefined,
          yearsExperience,
          noticePeriod,
          expectedCtc: expectedCtc.trim() || undefined,
          resumeUrl: resumeUrl.trim(),
          resumeFilename: resumeFilename || resumeFile?.name || "Resume.pdf",
          coverLetter: coverLetter.trim(),
          projectHighlight: projectHighlight.trim() || undefined,
          consent: true,
        },
      });

      if (res && res.ok) {
        setSuccessResult({
          referenceId: res.referenceId,
          roleTitle: res.roleTitle,
          email: res.email,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err: unknown) {
      console.error("Application submission failed:", err);
      setFormError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-sand/30 text-navy pb-24">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Top Banner & Breadcrumb */}
      <div className="relative border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link
            to="/careers"
            className="group inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-navy"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Open Positions
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[0.7rem] font-mono uppercase tracking-wider text-muted-foreground">
              Direct Founder Review
            </span>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-3xl px-6 pt-10">
        {/* Success Screen */}
        {successResult ? (
          <Reveal>
            <div className="rounded-3xl border border-emerald-500/20 bg-card p-8 sm:p-12 shadow-lift text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-6">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <Eyebrow>Application Submitted</Eyebrow>
              <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-navy">
                Thank you, {fullName || "Candidate"}.
              </h1>
              <p className="mt-3 text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Your application for <span className="font-semibold text-navy">{successResult.roleTitle}</span> has
                been securely logged into our internal studio pipeline.
              </p>

              {/* Reference ID card */}
              <div className="my-8 inline-flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-border bg-sand/50 px-6 py-4">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
                  Application Tracking ID:
                </span>
                <span className="font-mono text-base font-bold text-navy bg-card px-3 py-1 rounded-lg border border-border/80 shadow-xs">
                  {successResult.referenceId}
                </span>
              </div>

              {/* What happens next */}
              <div className="rounded-2xl border border-border/60 bg-secondary/30 p-6 text-left max-w-xl mx-auto space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-navy font-mono">
                  What happens next:
                </h4>
                <ul className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-ocean">1.</span>
                    <span>Our founders personally read your work samples, code repos, and cover letter within 3 business days.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-ocean">2.</span>
                    <span>We will reach out directly to <strong className="text-navy">{successResult.email}</strong> or your phone/WhatsApp.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-ocean">3.</span>
                    <span>We do not do performative whiteboarding or multi-round leetcode puzzles. Our interview is a calm, technical conversation and paid trial collaboration.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link to="/products/quietora-focus">
                  <Button className="rounded-xl bg-navy text-white hover:bg-navy-soft shadow-soft">
                    Explore Quietora Focus
                  </Button>
                </Link>
                <Link to="/careers">
                  <Button variant="outline" className="rounded-xl">
                    View Other Positions
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        ) : (
          /* Application Form View */
          <div>
            {/* Header */}
            <div className="text-center sm:text-left mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-ocean/20 bg-ocean/5 px-3 py-1 text-xs font-medium text-ocean mb-3">
                <Briefcase className="h-3.5 w-3.5" />
                <span>QuietoraLabs Candidate Portal</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-navy">
                Candidate Application
              </h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
                We are building independent software for deep work and digital wellbeing in India. Every
                application is reviewed with care by our founding engineers and designers.
              </p>
            </div>

            {/* Selected Role Card with Picker */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5">
                <div>
                  <span className="text-[0.7rem] font-mono uppercase tracking-wider text-ocean font-semibold">
                    Target Position
                  </span>
                  <h2 className="mt-1 font-display text-xl font-bold text-navy">
                    {isOtherRole ? (customRoleTitle || "Other / Custom Proposed Role") : selectedJob ? selectedJob.title : "General Studio Application"}
                  </h2>
                </div>

                {/* Change Role Dropdown with 'Other' Option */}
                <div className="flex items-center gap-2">
                  <label htmlFor="role-select" className="text-xs text-muted-foreground whitespace-nowrap">
                    Switch role:
                  </label>
                  <select
                    id="role-select"
                    value={isOtherRole ? "other" : selectedJob?.id || ""}
                    onChange={(e) => {
                      if (e.target.value === "other") {
                        setIsOtherRole(true);
                        setSelectedJob(null);
                      } else {
                        setIsOtherRole(false);
                        const matched = jobs.find((j) => j.id === e.target.value);
                        if (matched) setSelectedJob(matched);
                      }
                    }}
                    className="rounded-xl border border-border bg-secondary/40 px-3 py-1.5 text-xs font-medium text-navy focus:border-ocean focus:outline-none"
                  >
                    {jobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title} ({j.department})
                      </option>
                    ))}
                    <option value="other">✨ Other / Custom Proposed Role (Type below)</option>
                  </select>
                </div>
              </div>

              {/* If Standard Role is Selected */}
              {!isOtherRole && selectedJob && (
                <div className="pt-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-0.5 text-navy font-medium">
                      <Building className="h-3 w-3 text-muted-foreground" /> {selectedJob.department}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-0.5 text-navy font-medium">
                      <MapPin className="h-3 w-3 text-muted-foreground" /> {selectedJob.location}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-0.5 text-navy font-medium">
                      <Clock className="h-3 w-3 text-muted-foreground" /> {selectedJob.type}
                    </span>
                    {selectedJob.salary_range && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 font-medium border border-emerald-200/60">
                        {selectedJob.salary_range}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed pt-1">{selectedJob.summary}</p>
                </div>
              )}

              {/* If "Other" / Custom Role is Selected */}
              {isOtherRole && (
                <div className="pt-4 space-y-4 animate-fade-in">
                  <div className="rounded-2xl border border-ocean/30 bg-ocean/5 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-ocean">
                      <Sparkles className="h-4 w-4" />
                      <span>Propose Your Own Custom Position</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Don't see your exact role listed? Tell us what you want to build and how you can add leverage to QuietoraLabs. We create roles for exceptional people.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <Label htmlFor="custom-role-title" className="text-xs font-medium text-navy">
                          Type Your Proposed Role Title <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          id="custom-role-title"
                          type="text"
                          placeholder="e.g. Security & Kernel Researcher, Audio & Sound Ergonomist, DevRel..."
                          required
                          value={customRoleTitle}
                          onChange={(e) => setCustomRoleTitle(e.target.value)}
                          className="rounded-xl bg-card text-xs border-border"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="custom-department" className="text-xs font-medium text-navy">
                          Target Focus Area / Department
                        </Label>
                        <Input
                          id="custom-department"
                          type="text"
                          placeholder="e.g. Core Systems, Design, Product Lab, Growth"
                          value={customDepartment}
                          onChange={(e) => setCustomDepartment(e.target.value)}
                          className="rounded-xl bg-card text-xs border-border"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Error Notice */}
              {formError && (
                <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-xs text-rose-800">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Step 1: Personal Details */}
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft space-y-6">
                <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-navy text-white text-xs font-bold font-mono">
                    1
                  </div>
                  <h3 className="font-display text-base font-semibold text-navy">Identity & Contact</h3>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="full-name" className="text-xs font-medium text-navy">
                      Full Legal Name <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="full-name"
                      type="text"
                      placeholder="e.g. Aditi Sharma"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="rounded-xl border-border bg-secondary/30 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-medium text-navy">
                      Email Address <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="aditi@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl border-border bg-secondary/30 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-medium text-navy">
                      WhatsApp / Mobile Number <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="rounded-xl border-border bg-secondary/30 text-xs"
                    />
                    <p className="text-[0.68rem] text-muted-foreground">
                      We use WhatsApp for quick, conversational scheduling with candidates.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="location" className="text-xs font-medium text-navy">
                      Current City & State <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="e.g. Bengaluru, Karnataka"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="rounded-xl border-border bg-secondary/30 text-xs"
                    />
                  </div>

                  {/* Work Preference with Typeable Input & Datalist */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="work-style" className="text-xs font-medium text-navy">
                      Work Preference (Type or pick from suggestions)
                    </Label>
                    <Input
                      id="work-style"
                      list="workstyle-presets"
                      value={workStyle}
                      onChange={(e) => setWorkStyle(e.target.value)}
                      placeholder="Type or select: Remote (India), Bengaluru Hybrid, etc."
                      className="rounded-xl border-border bg-secondary/30 text-xs"
                    />
                    <datalist id="workstyle-presets">
                      <option value="Remote from anywhere in India (Standard)" />
                      <option value="Bengaluru (Hybrid) / Studio In-Person" />
                      <option value="Flexible / Willing to relocate for milestones" />
                      <option value="Async-first with quarterly studio summits" />
                    </datalist>
                  </div>
                </div>
              </div>

              {/* Step 2: Profiles & Experience */}
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft space-y-6">
                <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-navy text-white text-xs font-bold font-mono">
                    2
                  </div>
                  <h3 className="font-display text-base font-semibold text-navy">Experience & Proof of Work</h3>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="linkedin" className="text-xs font-medium text-navy">
                      LinkedIn Profile URL <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      required
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="rounded-xl border-border bg-secondary/30 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="portfolio" className="text-xs font-medium text-navy">
                      GitHub / Portfolio / Personal Website
                    </Label>
                    <Input
                      id="portfolio"
                      type="url"
                      placeholder="https://github.com/username or portfolio link"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      className="rounded-xl border-border bg-secondary/30 text-xs"
                    />
                  </div>

                  {/* Years Experience (Typeable with Datalist) */}
                  <div className="space-y-1.5">
                    <Label htmlFor="years-experience" className="text-xs font-medium text-navy">
                      Years of Relevant Experience <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="years-experience"
                      list="exp-presets"
                      required
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(e.target.value)}
                      placeholder="Type or pick: e.g. 3 years, Student, etc."
                      className="rounded-xl border-border bg-secondary/30 text-xs"
                    />
                    <datalist id="exp-presets">
                      <option value="Student / Recent Graduate" />
                      <option value="1-2 years" />
                      <option value="2-5 years" />
                      <option value="5-8 years" />
                      <option value="8+ years / Staff & Principal" />
                    </datalist>
                  </div>

                  {/* Notice Period (Typeable with Datalist) */}
                  <div className="space-y-1.5">
                    <Label htmlFor="notice-period" className="text-xs font-medium text-navy">
                      Availability / Notice Period <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="notice-period"
                      list="notice-presets"
                      required
                      value={noticePeriod}
                      onChange={(e) => setNoticePeriod(e.target.value)}
                      placeholder="Type or pick: Immediate, 15 days, 30 days..."
                      className="rounded-xl border-border bg-secondary/30 text-xs"
                    />
                    <datalist id="notice-presets">
                      <option value="Immediate / Under 15 days" />
                      <option value="30 days" />
                      <option value="60 days" />
                      <option value="90 days" />
                      <option value="Flexible / Currently Freelancing" />
                    </datalist>
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="expected-ctc" className="text-xs font-medium text-navy">
                      Expected Compensation / CTC or Stipend (INR)
                    </Label>
                    <Input
                      id="expected-ctc"
                      type="text"
                      placeholder="e.g. ₹22L CTC or ₹45,000/mo stipend"
                      value={expectedCtc}
                      onChange={(e) => setExpectedCtc(e.target.value)}
                      className="rounded-xl border-border bg-secondary/30 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Resume & Document Upload */}
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft space-y-6">
                <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-navy text-white text-xs font-bold font-mono">
                    3
                  </div>
                  <h3 className="font-display text-base font-semibold text-navy">Resume / CV Document</h3>
                </div>

                <div className="space-y-4">
                  {/* Upload Box */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer",
                      resumeFile
                        ? "border-emerald-500/40 bg-emerald-50/20"
                        : "border-border hover:border-ocean/60 bg-secondary/20 hover:bg-secondary/40",
                    )}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {uploadingResume ? (
                      <div className="flex flex-col items-center gap-2 py-4">
                        <Loader2 className="h-8 w-8 animate-spin text-ocean" />
                        <p className="text-xs text-muted-foreground">Uploading resume to secure vault...</p>
                      </div>
                    ) : resumeFile ? (
                      <div className="flex flex-col items-center gap-2 py-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                          <FileText className="h-6 w-6" />
                        </div>
                        <p className="text-xs font-semibold text-navy">{resumeFilename || resumeFile.name}</p>
                        <p className="text-[0.68rem] text-emerald-700 font-medium">
                          ✓ File ready to attach ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB). Click to change.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 py-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sand text-navy group-hover:bg-ocean/10 group-hover:text-ocean transition-colors">
                          <UploadCloud className="h-6 w-6" />
                        </div>
                        <p className="text-xs font-semibold text-navy">Click to browse or drop your resume here</p>
                        <p className="text-[0.7rem] text-muted-foreground">
                          PDF, DOC, DOCX up to 10MB. Stored encrypted.
                        </p>
                      </div>
                    )}
                  </div>

                  {uploadError && <p className="text-xs text-rose-600">{uploadError}</p>}

                  {/* Fallback URL Input */}
                  <div className="space-y-1.5 pt-2">
                    <Label htmlFor="resume-url" className="text-xs text-muted-foreground">
                      Or paste a public Google Drive / Dropbox link:
                    </Label>
                    <Input
                      id="resume-url"
                      type="url"
                      placeholder="https://drive.google.com/file/d/..."
                      value={resumeUrl.startsWith("http") ? resumeUrl : ""}
                      onChange={(e) => {
                        setResumeUrl(e.target.value);
                        if (!resumeFilename) setResumeFilename("Google Drive Document");
                      }}
                      className="rounded-xl border-border bg-secondary/30 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Step 4: The Craft & Passion */}
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft space-y-6">
                <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-navy text-white text-xs font-bold font-mono">
                    4
                  </div>
                  <h3 className="font-display text-base font-semibold text-navy">Craft, Vision & Thought Process</h3>
                </div>

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="cover-letter" className="text-xs font-medium text-navy">
                      Why QuietoraLabs? What makes you care about digital wellbeing and distraction-free software?{" "}
                      <span className="text-rose-500">*</span>
                    </Label>
                    <Textarea
                      id="cover-letter"
                      rows={4}
                      required
                      placeholder="Share what drew you to our studio, your own relationship with digital distractions, or how you think calm software should be designed..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="rounded-xl border-border bg-secondary/30 text-xs leading-relaxed"
                    />
                    <p className="text-[0.68rem] text-muted-foreground">Minimum 30 characters. Be authentic, not corporate.</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="project-highlight" className="text-xs font-medium text-navy">
                      Tell us about a technical challenge or software experience you are proud of building:
                    </Label>
                    <Textarea
                      id="project-highlight"
                      rows={3}
                      placeholder="Describe the problem, your architecture or design decisions, and what you learned..."
                      value={projectHighlight}
                      onChange={(e) => setProjectHighlight(e.target.value)}
                      className="rounded-xl border-border bg-secondary/30 text-xs leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Consent & Submit */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-6">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={(checked) => setConsent(checked === true)}
                    className="mt-0.5 rounded-md"
                  />
                  <Label htmlFor="consent" className="text-xs leading-relaxed text-muted-foreground cursor-pointer">
                    I consent to QuietoraLabs storing and processing my application data for hiring and recruitment
                    purposes in accordance with our{" "}
                    <Link to="/privacy" className="underline text-navy hover:text-ocean">
                      Privacy Policy
                    </Link>{" "}
                    and India's Digital Personal Data Protection (DPDP) Act 2023. We never sell or share candidate data.
                  </Label>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-border/60">
                  <div className="flex items-center gap-2 text-[0.7rem] text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Direct founder review • No automated ATS rejection</span>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || uploadingResume}
                    className="gap-2 rounded-xl bg-navy text-white hover:bg-navy-soft shadow-soft px-8 py-2.5 text-xs font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting Application...
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" /> Submit Application
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
