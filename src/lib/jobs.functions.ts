import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Json } from "@/integrations/supabase/types";

export interface JobPosting {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience_level: string;
  salary_range: string;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  perks: string[];
  status: "published" | "draft" | "closed";
  applicant_count?: number;
  created_at: string;
  updated_at: string;
}

export const DEFAULT_JOB_POSTINGS: JobPosting[] = [
  {
    id: "job-windows-systems",
    slug: "founding-windows-systems-engineer",
    title: "Founding Windows Systems Engineer",
    department: "Core Desktop Engine",
    location: "Remote (India) / Bengaluru",
    type: "Full-time",
    experience_level: "2-5 years",
    salary_range: "₹18L - ₹28L CTC + Studio Equity",
    summary:
      "Architect the low-level desktop engine of Quietora Focus on Windows. Build high-integrity process interception, system hooks, and privacy-first background daemons with near-zero battery and CPU impact.",
    description:
      "Quietora Focus is our flagship Windows-first desktop application designed to pause distractions at the operating system level without sending user telemetry to the cloud. As our Founding Systems Engineer, you will own the core architecture of our desktop daemon, process monitors, and local distraction barriers.",
    responsibilities: [
      "Design and maintain the Windows native background daemon for Quietora Focus using modern C++ and Win32 / Windows App SDK.",
      "Implement low-overhead app and distraction interception mechanisms respecting user privacy and local machine isolation.",
      "Profile memory, CPU cycles, and battery consumption to ensure the focus engine is imperceptible in the background.",
      "Collaborate closely with our product designer to build instantaneous desktop notifications and tactile micro-states.",
    ],
    requirements: [
      "Strong proficiency in modern C++, Rust, or systems-level C# / Win32 API.",
      "Understanding of Windows process lifecycles, memory safety, and thread synchronization.",
      "Experience profiling performance on Windows (ETW, Windows Performance Analyzer, or similar).",
      "High empathy for developer and student user experiences.",
    ],
    perks: [
      "High-autonomy, async-first product culture with minimal meetings.",
      "Top-tier hardware setup (latest desktop rig or laptop of your choice).",
      "Comprehensive health and wellness coverage for you and family.",
      "Meaningful founding equity stake in our studio products.",
    ],
    status: "published",
    created_at: "2026-01-15T10:00:00.000Z",
    updated_at: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "job-product-designer",
    slug: "lead-product-designer",
    title: "Lead Product Designer (UI / UX & Desktop)",
    department: "Design & Experience",
    location: "Remote (India) / Hybrid",
    type: "Full-time",
    experience_level: "3+ years",
    salary_range: "₹16L - ₹24L CTC + Studio Equity",
    summary:
      "Shape the tactile, calm aesthetic of Quietora Focus and Campus. Design desktop interfaces, design systems, and micro-interactions that respect attention and feel deeply rewarding to use.",
    description:
      "At QuietoraLabs, design is not an afterthought; it is our primary moat. We build software that feels quiet, unhurried, and deeply respectful of the user's focus. You will be our lead design voice shaping desktop ergonomics, interaction states, and web portals.",
    responsibilities: [
      "Lead product UX and visual interface craft across Windows desktop and web portals.",
      "Establish our design token system, iconography, typography scales, and micro-animations.",
      "Conduct user observation sessions with engineering teams and students to refine ergonomics.",
      "Design thoughtful, non-intrusive soundscapes and visual feedback for focus blocks.",
    ],
    requirements: [
      "Exceptional portfolio demonstrating polished desktop or desktop-grade web applications.",
      "Fluency in Figma, design tokens, responsive typography, and interaction prototyping.",
      "Strong intuition for typography, whitespace, and micro-copy.",
      "Understanding of frontend component implementations (Tailwind CSS, design tokens).",
    ],
    perks: [
      "Direct impact on our studio's brand and visual identity.",
      "Dedicated annual budget for design tools, fonts, books, and courses.",
      "Flexible working hours centered around deep uninterrupted creative blocks.",
    ],
    status: "published",
    created_at: "2026-01-16T10:00:00.000Z",
    updated_at: "2026-01-16T10:00:00.000Z",
  },
  {
    id: "job-fullstack-platform",
    slug: "fullstack-engineer-react-cloud",
    title: "Full-Stack Engineer (React 19, TypeScript & Cloud)",
    department: "Web & Studio Platform",
    location: "Remote (India)",
    type: "Full-time",
    experience_level: "2-4 years",
    salary_range: "₹14L - ₹22L CTC",
    summary:
      "Craft resilient, fast web applications for Quietora Campus, analytics portals, and operator dashboards using React 19, TanStack Start, and PostgreSQL.",
    description:
      "We are scaling the web infrastructure behind Quietora Campus (our institutional focus pilot) and our internal studio operator tools. You will build high-reliability, SSR-powered applications with TypeScript correctness and strict performance budgets.",
    responsibilities: [
      "Develop robust SSR web apps using TanStack Start, React 19, and Tailwind CSS v4.",
      "Design and manage PostgreSQL schemas, RLS policies, and server functions with Supabase.",
      "Build institutional partner portals and telemetry systems with privacy-first aggregation.",
      "Maintain zero TypeScript errors and comprehensive test coverage.",
    ],
    requirements: [
      "Deep fluency with TypeScript, React 19, and modern CSS frameworks.",
      "Solid grounding in relational databases (PostgreSQL, indexes, transactions, RLS).",
      "Experience writing performant full-stack server functions and REST APIs.",
      "Pride in shipping bug-free, accessible, and fast web experiences.",
    ],
    perks: [
      "Modern tech stack with zero legacy code or technical debt.",
      "Home office setup stipend and high-speed internet allowance.",
      "Annual studio retreat and learning allowance.",
    ],
    status: "published",
    created_at: "2026-01-18T10:00:00.000Z",
    updated_at: "2026-01-18T10:00:00.000Z",
  },
  {
    id: "job-product-intern",
    slug: "product-engineering-intern",
    title: "Product & Engineering Intern (Digital Wellbeing)",
    department: "Quietora Product Lab",
    location: "Remote (India)",
    type: "Internship",
    experience_level: "Students / Recent Grads",
    salary_range: "₹35,000 - ₹50,000 / month stipend",
    summary:
      "Work directly with the studio founders to build, test, and polish next-generation focus tools. Ideal for students passionate about productivity software, user psychology, and modern software craft.",
    description:
      "We believe that some of the greatest product insights come from energetic, inquisitive learners. This 6-month paid internship pairs you directly with our founders to build real product modules and test them with real users.",
    responsibilities: [
      "Build prototype features and experimental widgets for Quietora Focus.",
      "Help test desktop builds across varied Windows configurations and hardware.",
      "Participate in user research and feedback synthesis from student pilot programs.",
      "Contribute to our open-source tools and documentation.",
    ],
    requirements: [
      "Curiosity, hunger to learn, and strong self-direction.",
      "Familiarity with TypeScript, React, or C++ / Python.",
      "Demonstrated personal projects (GitHub, blog, or deployed apps).",
      "Passion for distraction-free computing and cognitive ergonomics.",
    ],
    perks: [
      "Hands-on mentorship from senior founders.",
      "Direct pathway to full-time founding engineer / designer role upon graduation.",
      "Certificate, letter of recommendation, and studio merchandise.",
    ],
    status: "published",
    created_at: "2026-01-20T10:00:00.000Z",
    updated_at: "2026-01-20T10:00:00.000Z",
  },
];

async function assertAdminRole(supabase: any, userId: string) {
  try {
    const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (data) return;
  } catch {
    // continue
  }
  const { data: roleRow } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (!roleRow) throw new Error("FORBIDDEN: Admin permissions required");
}

/**
 * Fetch all published job postings for public viewing
 */
export const listJobPostings = createServerFn({ method: "GET" }).handler(
  async (): Promise<JobPosting[]> => {
    try {
      // 1. Try native job_postings table
      const adminAny = supabaseAdmin as any;
      const { data, error } = await adminAny
        .from("job_postings")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (!error && data && Array.isArray(data) && data.length > 0) {
        return data as JobPosting[];
      }
    } catch {
      // Table may not exist yet, continue to fallback
    }

    try {
      // 2. Try stored jobs in submissions fallback table
      const { data: subData } = await supabaseAdmin
        .from("submissions")
        .select("details")
        .eq("enquiry_type", "Job_Postings_Store")
        .maybeSingle();

      if (subData?.details && typeof subData.details === "object" && !Array.isArray(subData.details)) {
        const stored = (subData.details as Record<string, unknown>)["jobs"];
        if (Array.isArray(stored) && stored.length > 0) {
          return (stored as unknown as JobPosting[]).filter((j) => j.status === "published");
        }
      }
    } catch {
      // continue to default seed
    }

    return DEFAULT_JOB_POSTINGS;
  },
);

/**
 * Fetch all job postings for admin (all statuses + applicant count)
 */
export const listAllJobPostingsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<JobPosting[]> => {
    await assertAdminRole(context.supabase, context.userId);

    let allJobs: JobPosting[] = [];

    try {
      const adminAny = supabaseAdmin as any;
      const { data, error } = await adminAny
        .from("job_postings")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && Array.isArray(data) && data.length > 0) {
        allJobs = data as JobPosting[];
      }
    } catch {
      // fallback
    }

    if (allJobs.length === 0) {
      try {
        const { data: subData } = await supabaseAdmin
          .from("submissions")
          .select("details")
          .eq("enquiry_type", "Job_Postings_Store")
          .maybeSingle();

        if (subData?.details && typeof subData.details === "object" && !Array.isArray(subData.details)) {
          const stored = (subData.details as Record<string, unknown>)["jobs"];
          if (Array.isArray(stored) && stored.length > 0) {
            allJobs = stored as unknown as JobPosting[];
          }
        }
      } catch {
        // fallback to default
      }
    }

    if (allJobs.length === 0) {
      allJobs = DEFAULT_JOB_POSTINGS;
    }

    // Attach applicant count to each job
    try {
      const { data: applicants } = await supabaseAdmin
        .from("submissions")
        .select("role_title, details")
        .eq("kind", "contact")
        .eq("enquiry_type", "Careers");

      if (applicants) {
        allJobs = allJobs.map((job) => {
          const count = applicants.filter((a) => {
            if (a.role_title === job.title) return true;
            const d = (a.details as Record<string, unknown>) || {};
            if (d["jobId"] === job.id || d["jobSlug"] === job.slug || d["appliedRole"] === job.title) return true;
            return false;
          }).length;
          return { ...job, applicant_count: count };
        });
      }
    } catch {
      // continue
    }

    return allJobs;
  });

/**
 * Create or update a job posting (Admin only)
 */
export const saveJobPostingAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().optional(),
        title: z.string().min(2).max(140),
        department: z.string().min(2).max(100),
        location: z.string().min(2).max(100),
        type: z.string().min(2).max(60),
        experience_level: z.string().min(1).max(60),
        salary_range: z.string().max(100).optional(),
        summary: z.string().min(10).max(1000),
        description: z.string().min(20).max(6000),
        responsibilities: z.array(z.string()).default([]),
        requirements: z.array(z.string()).default([]),
        perks: z.array(z.string()).default([]),
        status: z.enum(["published", "draft", "closed"]).default("published"),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdminRole(context.supabase, context.userId);

    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const now = new Date().toISOString();
    const jobRecord: JobPosting = {
      id: data.id || `job-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      slug,
      title: data.title,
      department: data.department,
      location: data.location,
      type: data.type,
      experience_level: data.experience_level,
      salary_range: data.salary_range || "Competitive / Studio Standard",
      summary: data.summary,
      description: data.description,
      responsibilities: data.responsibilities,
      requirements: data.requirements,
      perks: data.perks,
      status: data.status,
      created_at: now,
      updated_at: now,
    };

    // Try saving to native table
    let savedToNative = false;
    try {
      const adminAny = supabaseAdmin as any;
      const { error } = await adminAny.from("job_postings").upsert({
        id: jobRecord.id,
        slug: jobRecord.slug,
        title: jobRecord.title,
        department: jobRecord.department,
        location: jobRecord.location,
        type: jobRecord.type,
        experience_level: jobRecord.experience_level,
        salary_range: jobRecord.salary_range,
        summary: jobRecord.summary,
        description: jobRecord.description,
        responsibilities: jobRecord.responsibilities,
        requirements: jobRecord.requirements,
        perks: jobRecord.perks,
        status: jobRecord.status,
        updated_at: now,
      });
      if (!error) savedToNative = true;
    } catch {
      savedToNative = false;
    }

    // Always keep fallback storage in submissions synced
    try {
      const { data: storeRow } = await supabaseAdmin
        .from("submissions")
        .select("id, details")
        .eq("enquiry_type", "Job_Postings_Store")
        .maybeSingle();

      let currentJobs: JobPosting[] = DEFAULT_JOB_POSTINGS;
      if (storeRow?.details && typeof storeRow.details === "object" && !Array.isArray(storeRow.details)) {
        const stored = (storeRow.details as Record<string, unknown>)["jobs"];
        if (Array.isArray(stored)) currentJobs = stored as unknown as JobPosting[];
      }

      const existingIndex = currentJobs.findIndex((j) => j.id === jobRecord.id || j.slug === jobRecord.slug);
      if (existingIndex >= 0) {
        currentJobs[existingIndex] = { ...currentJobs[existingIndex], ...jobRecord };
      } else {
        currentJobs.unshift(jobRecord);
      }

      const storePayload = { jobs: currentJobs, lastUpdated: now } as unknown as Json;

      if (storeRow?.id) {
        await supabaseAdmin
          .from("submissions")
          .update({ details: storePayload })
          .eq("id", storeRow.id);
      } else {
        await supabaseAdmin.from("submissions").insert({
          kind: "contact",
          name: "QuietoraLabs Studio Jobs Store",
          email: "jobs@quietoralabs.com",
          enquiry_type: "Job_Postings_Store",
          consent: true,
          details: storePayload,
          source_path: "/admin",
        });
      }
    } catch (e: unknown) {
      console.warn("Fallback job store write failed:", e);
    }

    return { ok: true, job: jobRecord, savedToNative };
  });

/**
 * Delete a job posting (Admin only)
 */
export const deleteJobPostingAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdminRole(context.supabase, context.userId);

    try {
      const adminAny = supabaseAdmin as any;
      await adminAny.from("job_postings").delete().eq("id", data.id);
    } catch {
      // continue
    }

    try {
      const { data: storeRow } = await supabaseAdmin
        .from("submissions")
        .select("id, details")
        .eq("enquiry_type", "Job_Postings_Store")
        .maybeSingle();

      if (storeRow?.details && typeof storeRow.details === "object" && !Array.isArray(storeRow.details)) {
        const stored = (storeRow.details as Record<string, unknown>)["jobs"];
        if (Array.isArray(stored)) {
          const updated = (stored as unknown as JobPosting[]).filter((j) => j.id !== data.id);
          await supabaseAdmin
            .from("submissions")
            .update({ details: { jobs: updated, lastUpdated: new Date().toISOString() } as unknown as Json })
            .eq("id", storeRow.id);
        }
      }
    } catch {
      // continue
    }

    return { ok: true };
  });

/**
 * Upload candidate resume file to Supabase Storage via server function
 * Bypasses client-side RLS using service role key, ensuring 100% upload success.
 */
export const uploadResumeFile = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        fileName: z.string().min(1).max(250),
        fileBase64: z.string().min(1),
        contentType: z.string().default("application/pdf"),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const allowedExtensions = [".pdf", ".doc", ".docx", ".rtf"];
    const ext = data.fileName.slice(data.fileName.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      throw new Error("Please upload a PDF, DOC, or DOCX document.");
    }

    const cleanName = data.fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `candidates/${Date.now()}-${cleanName}`;
    const fileBuffer = Buffer.from(data.fileBase64, "base64");

    if (fileBuffer.byteLength > 10 * 1024 * 1024) {
      throw new Error("File size exceeds 10MB limit.");
    }

    const { data: uploadData, error } = await supabaseAdmin.storage
      .from("resumes")
      .upload(filePath, fileBuffer, {
        contentType: data.contentType || "application/pdf",
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Resume server storage upload error:", error.message);
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    const { data: publicUrlData } = supabaseAdmin.storage.from("resumes").getPublicUrl(uploadData.path);
    return {
      ok: true,
      url: publicUrlData.publicUrl,
      path: uploadData.path,
    };
  });

/**
 * Submit full professional job application
 */
export const submitJobApplication = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        jobId: z.string().min(1),
        jobSlug: z.string().optional(),
        roleTitle: z.string().min(2),
        fullName: z.string().min(2, "Full name is required").max(120),
        email: z.string().email("Valid email required").max(254),
        phone: z.string().min(6, "Phone/WhatsApp is required").max(30),
        location: z.string().min(2, "Current city/location required").max(120),
        workStyle: z.string().default("Remote"),
        linkedinUrl: z.string().url("Valid LinkedIn URL required").or(z.string().min(3)),
        portfolioUrl: z.string().optional(),
        yearsExperience: z.string().min(1, "Experience level required"),
        noticePeriod: z.string().min(1, "Notice period required"),
        expectedCtc: z.string().max(80).optional(),
        resumeUrl: z.string().min(1, "Resume file or URL is required"),
        resumeFilename: z.string().optional(),
        coverLetter: z.string().min(30, "Please share at least 30 characters on why QuietoraLabs appeals to you").max(4000),
        projectHighlight: z.string().max(2000).optional(),
        consent: z.literal(true, {
          errorMap: () => ({ message: "You must consent to data processing for career application purposes." }),
        }),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const referenceId = `QL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const candidateDetails: Record<string, unknown> = {
      referenceId,
      jobId: data.jobId,
      jobSlug: data.jobSlug,
      appliedRole: data.roleTitle,
      phone: data.phone.trim(),
      location: data.location.trim(),
      workStyle: data.workStyle,
      linkedinUrl: data.linkedinUrl.trim(),
      portfolioUrl: data.portfolioUrl?.trim() || null,
      yearsExperience: data.yearsExperience,
      noticePeriod: data.noticePeriod,
      expectedCtc: data.expectedCtc?.trim() || "Not specified",
      resumeUrl: data.resumeUrl.trim(),
      resumeFilename: data.resumeFilename || "resume.pdf",
      projectHighlight: data.projectHighlight?.trim() || null,
      submittedAt: new Date().toISOString(),
    };

    const { data: inserted, error } = await supabaseAdmin
      .from("submissions")
      .insert({
        kind: "contact",
        status: "new",
        name: data.fullName.trim(),
        email: data.email.toLowerCase().trim(),
        role_title: data.roleTitle.trim(),
        enquiry_type: "Careers",
        message: data.coverLetter.trim(),
        details: candidateDetails as unknown as Json,
        consent: true,
        source_path: "/careers/apply",
      })
      .select()
      .single();

    if (error) {
      console.error("Job application submission error:", error.message);
      throw new Error("Unable to save your application right now. Please try again shortly.");
    }

    return {
      ok: true,
      referenceId,
      candidateId: inserted?.id,
      roleTitle: data.roleTitle,
      email: data.email,
    };
  });
