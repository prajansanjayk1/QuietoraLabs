import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { leadSchema, pathwayErrors } from "./lead-schema";
import type { Database, Json } from "@/integrations/supabase/types";

export type SubmitResult =
  | { ok: true; duplicate?: boolean }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/**
 * Public submission endpoint for early access, partnerships and contact.
 * Validates server-side, drops honeypot hits, dedupes early-access by email,
 * and applies a short per-email cooldown. Writes with the service role so the
 * table never needs a public insert/read policy.
 */
export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input)
  .handler(async ({ data }): Promise<SubmitResult> => {
    const parsed = leadSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
      return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
    }
    const input = parsed.data;
    if (input.website) return { ok: true }; // honeypot: silently ignore bots

    const extra = pathwayErrors(input);
    if (Object.keys(extra).length)
      return { ok: false, error: "Please check the highlighted fields.", fieldErrors: extra };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const since = new Date(Date.now() - 60_000).toISOString();
    const { count } = await supabaseAdmin
      .from("submissions")
      .select("id", { count: "exact", head: true })
      .eq("email", input.email)
      .gte("created_at", since);
    if ((count ?? 0) >= 2)
      return { ok: false, error: "You've just sent something. Please wait a minute and try again." };

    const { error } = await supabaseAdmin.from("submissions").insert({
      kind: input.kind,
      name: input.name,
      email: input.email,
      organization: input.organization ?? null,
      role_title: input.roleTitle ?? null,
      enquiry_type: input.enquiryType ?? null,
      message: input.message ?? null,
      details: input.details ?? {},
      consent: true,
      source_path: input.sourcePath ?? null,
    });
    if (error) {
      if (error.code === "23505") return { ok: true, duplicate: true };
      console.error("submitLead insert failed", error.message);
      return { ok: false, error: "We couldn't save that right now. Please try again shortly." };
    }
    return { ok: true };
  });

async function assertAdmin(supabase: any, userId: string) {
  // 1. First attempt: call has_role RPC
  try {
    const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (!error && data) return;
  } catch {
    // Continue to fallback
  }

  // 2. Direct table check with service role client as fallback
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roleRow } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (roleRow) return;

  throw new Error("FORBIDDEN: Operator admin role required");
}

export const getAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    let isAdmin = false;
    try {
      const { data } = await context.supabase.rpc("has_role", {
        _user_id: context.userId,
        _role: "admin",
      });
      if (data) isAdmin = true;
    } catch {
      // Continue to table check
    }

    if (!isAdmin) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: roleRow } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", context.userId)
        .eq("role", "admin")
        .maybeSingle();
      if (roleRow) isAdmin = true;
    }

    return { isAdmin, userId: context.userId };
  });

export const listSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data;
  });

export const updateSubmissionStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["new", "in_review", "responded", "archived"]),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("submissions")
      .update({ status: data.status, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const createSubmissionAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        kind: z.enum(["early_access", "partnership", "contact"]),
        name: z.string().min(1).max(120),
        email: z.string().email().max(254),
        organization: z.string().max(160).optional(),
        role_title: z.string().max(120).optional(),
        enquiry_type: z.string().max(60).optional(),
        message: z.string().max(4000).optional(),
        status: z.enum(["new", "in_review", "responded", "archived"]).default("new"),
        details: z.record(z.string(), z.any()).default({}),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: inserted, error } = await supabaseAdmin
      .from("submissions")
      .insert({
        kind: data.kind,
        status: data.status,
        name: data.name,
        email: data.email.toLowerCase().trim(),
        organization: data.organization || null,
        role_title: data.role_title || null,
        enquiry_type: data.enquiry_type || null,
        message: data.message || null,
        details: data.details,
        consent: true,
        source_path: "/admin (operator created)",
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, data: inserted };
  });

export const deleteSubmissionAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("submissions")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateSubmissionDetailsAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        name: z.string().min(1).max(120).optional(),
        email: z.string().email().max(254).optional(),
        organization: z.string().max(160).nullable().optional(),
        role_title: z.string().max(120).nullable().optional(),
        message: z.string().max(4000).nullable().optional(),
        details: z.record(z.string(), z.any()).optional(),
        status: z.enum(["new", "in_review", "responded", "archived"]).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const updates: Database["public"]["Tables"]["submissions"]["Update"] = {
      updated_at: new Date().toISOString(),
    };
    if (data.name !== undefined) updates.name = data.name;
    if (data.email !== undefined) updates.email = data.email.toLowerCase().trim();
    if (data.organization !== undefined) updates.organization = data.organization;
    if (data.role_title !== undefined) updates.role_title = data.role_title;
    if (data.message !== undefined) updates.message = data.message;
    if (data.status !== undefined) updates.status = data.status;
    if (data.details !== undefined) updates.details = data.details as Json;

    const { error } = await supabaseAdmin
      .from("submissions")
      .update(updates)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
