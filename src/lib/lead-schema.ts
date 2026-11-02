import { z } from "zod";

export const LEAD_KINDS = ["early_access", "partnership", "contact"] as const;
export type LeadKind = (typeof LEAD_KINDS)[number];

export const CONTACT_TYPES = [
  "Partnership",
  "General enquiry",
  "Media",
  "Careers",
  "Collaboration",
] as const;

export const PARTNER_TYPES = [
  "College / university",
  "Coding bootcamp",
  "Coaching centre",
  "Researcher",
  "Product collaborator",
  "Other",
] as const;

export const FOCUS_ROLES = ["Student", "Working professional", "Educator", "Other"] as const;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Must be ${max} characters or fewer`)
    .optional()
    .transform((v) => (v ? v : undefined));

export const leadSchema = z.object({
  kind: z.enum(LEAD_KINDS),
  name: z.string().trim().min(2, "Please enter your name").max(120, "Name is too long"),
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(254),
  organization: optionalText(160),
  roleTitle: optionalText(120),
  enquiryType: optionalText(60),
  message: optionalText(4000),
  details: z.record(z.string().max(60), z.string().max(300)).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "Please confirm consent to continue" }) }),
  sourcePath: optionalText(200),
  // Honeypot: real people never see or fill this.
  website: z.string().max(200).optional(),
});

export type LeadInput = z.input<typeof leadSchema>;

/** Rules per pathway, enforced server-side in addition to the base schema. */
export function pathwayErrors(input: z.output<typeof leadSchema>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (input.kind === "contact") {
    if (!input.enquiryType || !(CONTACT_TYPES as readonly string[]).includes(input.enquiryType))
      errors["enquiryType"] = "Choose an enquiry type";
    if (!input.message || input.message.length < 10)
      errors["message"] = "Please write at least 10 characters";
  }
  if (input.kind === "partnership") {
    if (!input.organization) errors["organization"] = "Organisation is required for partnerships";
    if (!input.enquiryType || !(PARTNER_TYPES as readonly string[]).includes(input.enquiryType))
      errors["enquiryType"] = "Choose a partner type";
    if (!input.message || input.message.length < 10)
      errors["message"] = "Tell us a little about what you have in mind";
  }
  if (input.kind === "early_access") {
    if (input.roleTitle && !(FOCUS_ROLES as readonly string[]).includes(input.roleTitle))
      errors["roleTitle"] = "Choose an option";
  }
  return errors;
}
