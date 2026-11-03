import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) {
      headers.delete("Authorization");
    }

    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

function parseCookie(cookieStr: string | null | undefined, name: string): string | null {
  if (!cookieStr) return null;
  const match = cookieStr.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1] || "") : null;
}

export const requireSupabaseAuth = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    let token: string | undefined;
    try {
      const { supabase } = await import("./client");
      const { data } = await supabase.auth.getSession();
      token = data.session?.access_token;
    } catch {
      // client may not have an active session
    }

    return next({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      sendContext: { accessToken: token || "" },
    });
  })
  .server(async ({ next, context }) => {
    const SUPABASE_URL = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
    const SUPABASE_PUBLISHABLE_KEY =
      process.env["SUPABASE_PUBLISHABLE_KEY"] ||
      process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
      process.env["VITE_SUPABASE_ANON_KEY"] ||
      process.env["SUPABASE_ANON_KEY"];

    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      console.warn("[Database Configuration] Missing Supabase environment variables in server context.");
      throw new Error("UNCONFIGURED: Database credentials missing in hosting environment. Please add them in Vercel settings.");
    }

    let token: string | null = null;

    // 1. Check sendContext from client middleware
    const ctxAny = context as Record<string, unknown> | undefined;
    if (ctxAny && typeof ctxAny["accessToken"] === "string" && ctxAny["accessToken"].trim()) {
      token = ctxAny["accessToken"].trim();
    }

    // 2. Check HTTP Authorization header if available
    if (!token) {
      const request = getRequest();
      if (request?.headers) {
        const authHeader = request.headers.get("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
          token = authHeader.replace("Bearer ", "").trim();
        }

        // 3. Check Cookie headers as fallback
        if (!token) {
          const cookieHeader = request.headers.get("cookie");
          token = parseCookie(cookieHeader, "sb-access-token");
        }
      }
    }

    if (!token) {
      throw new Error("Unauthorized: No session token provided");
    }

    if (token.split(".").length !== 3) {
      throw new Error("Unauthorized: Invalid token format");
    }

    const supabase = createClient<Database>(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY,
      {
        global: {
          fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        auth: {
          storage: undefined,
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    let userId = claimsData?.claims?.sub;

    if (!userId || claimsError) {
      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      if (userError || !userData?.user?.id) {
        throw new Error("Unauthorized: Invalid or expired token");
      }
      userId = userData.user.id;
    }

    return next({
      context: {
        supabase,
        userId,
        accessToken: token,
      },
    });
  });
