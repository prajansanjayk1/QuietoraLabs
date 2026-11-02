import { describe, expect, it } from "vitest";
import { leadSchema, pathwayErrors } from "@/lib/lead-schema";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { QueryClient } from "@tanstack/react-query";

describe("Routing tests", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

  const routes = [
    "/",
    "/about",
    "/careers",
    "/careers/apply",
    "/contact",
    "/products",
    "/products/quietora-focus",
    "/products/quietora-campus",
    "/projects",
    "/projects/medique",
    "/partners",
    "/privacy",
    "/terms",
    "/admin",
  ];

  for (const path of routes) {
    it(`correctly resolves route for ${path}`, () => {
      const matches = router.matchRoutes(path);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    });
  }
});

describe("Form Validation & Schema (End to End)", () => {
  it("validates early access submission successfully", () => {
    const input = {
      kind: "early_access" as const,
      name: "Praveen Raja",
      email: "praveen@example.com",
      roleTitle: "Working professional",
      consent: true as const,
      sourcePath: "/products/quietora-focus",
    };

    const parsed = leadSchema.safeParse(input);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      const extraErrors = pathwayErrors(parsed.data);
      expect(Object.keys(extraErrors).length).toBe(0);
    }
  });

  it("validates partnership submission successfully", () => {
    const input = {
      kind: "partnership" as const,
      name: "Dean of Academics",
      email: "dean@engineering-college.edu.in",
      organization: "National Institute of Tech",
      enquiryType: "College / university",
      message: "We want to explore a student focus pilot for the upcoming semester.",
      consent: true as const,
      sourcePath: "/partners",
    };

    const parsed = leadSchema.safeParse(input);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      const extraErrors = pathwayErrors(parsed.data);
      expect(Object.keys(extraErrors).length).toBe(0);
    }
  });

  it("fails partnership submission when organization is missing", () => {
    const input = {
      kind: "partnership" as const,
      name: "Dean of Academics",
      email: "dean@college.edu.in",
      enquiryType: "College / university",
      message: "We want to explore a student focus pilot.",
      consent: true as const,
    };

    const parsed = leadSchema.safeParse(input);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      const extraErrors = pathwayErrors(parsed.data);
      expect(extraErrors["organization"]).toBeDefined();
    }
  });

  it("validates general contact submission successfully", () => {
    const input = {
      kind: "contact" as const,
      name: "Aakash Sharma",
      email: "aakash@example.com",
      enquiryType: "General enquiry",
      message: "I am interested in learning more about your product roadmap.",
      consent: true as const,
      sourcePath: "/contact",
    };

    const parsed = leadSchema.safeParse(input);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      const extraErrors = pathwayErrors(parsed.data);
      expect(Object.keys(extraErrors).length).toBe(0);
    }
  });

  it("rejects contact submission when message is shorter than 10 characters", () => {
    const input = {
      kind: "contact" as const,
      name: "Aakash Sharma",
      email: "aakash@example.com",
      enquiryType: "General enquiry",
      message: "Hello",
      consent: true as const,
    };

    const parsed = leadSchema.safeParse(input);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      const extraErrors = pathwayErrors(parsed.data);
      expect(extraErrors["message"]).toBeDefined();
    }
  });

  it("rejects submission when consent is false", () => {
    const input = {
      kind: "contact" as const,
      name: "Test User",
      email: "test@example.com",
      enquiryType: "General enquiry",
      message: "Valid test message here",
      consent: false,
    };

    const parsed = leadSchema.safeParse(input);
    expect(parsed.success).toBe(false);
  });

  it("validates career job application submission successfully", () => {
    const input = {
      kind: "contact" as const,
      name: "Rohit Verma",
      email: "rohit.verma@example.com",
      enquiryType: "Careers",
      roleTitle: "Windows Systems Engineer",
      message: "I have 5 years experience building C++ desktop tools and want to contribute to Focus.",
      details: {
        phone: "+91 9876543210",
        portfolioUrl: "https://github.com/rohitverma",
        resumeUrl: "https://drive.google.com/file/d/sample-resume",
        location: "Bengaluru",
        availability: "Immediate",
        appliedRole: "Windows Systems Engineer",
      },
      consent: true as const,
      sourcePath: "/careers",
    };

    const parsed = leadSchema.safeParse(input);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      const extraErrors = pathwayErrors(parsed.data);
      expect(Object.keys(extraErrors).length).toBe(0);
    }
  });

  it("detects bot honeypot input", () => {
    const input = {
      kind: "contact" as const,
      name: "Spam Bot",
      email: "bot@spam.com",
      enquiryType: "General enquiry",
      message: "Buy cheap backlinks now",
      consent: true as const,
      website: "https://spamsite.com",
    };

    const parsed = leadSchema.safeParse(input);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.website).toBe("https://spamsite.com");
    }
  });

  it("validates dynamic job postings structure", async () => {
    const { DEFAULT_JOB_POSTINGS } = await import("@/lib/jobs.functions");
    expect(DEFAULT_JOB_POSTINGS.length).toBeGreaterThanOrEqual(4);
    for (const job of DEFAULT_JOB_POSTINGS) {
      expect(job.title).toBeTruthy();
      expect(job.slug).toBeTruthy();
      expect(job.department).toBeTruthy();
      expect(job.location).toBeTruthy();
      expect(job.responsibilities.length).toBeGreaterThan(0);
      expect(job.requirements.length).toBeGreaterThan(0);
      expect(["published", "draft", "closed"]).toContain(job.status);
    }
  });
});
