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

const rawUrl =
  (typeof import.meta !== "undefined" && import.meta.env?.["VITE_SUPABASE_URL"]) ||
  process.env["VITE_SUPABASE_URL"] ||
  process.env["SUPABASE_URL"];

const rawAnonKey =
  (typeof import.meta !== "undefined" && import.meta.env?.["VITE_SUPABASE_ANON_KEY"]) ||
  (typeof import.meta !== "undefined" && import.meta.env?.["VITE_SUPABASE_PUBLISHABLE_KEY"]) ||
  process.env["VITE_SUPABASE_ANON_KEY"] ||
  process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
  process.env["SUPABASE_ANON_KEY"] ||
  process.env["SUPABASE_PUBLISHABLE_KEY"];

export const isSupabaseConfigured = Boolean(rawUrl && rawAnonKey);

function createSupabaseClient() {
  const SUPABASE_URL = rawUrl || "https://placeholder-project.supabase.co";
  const SUPABASE_ANON_KEY = rawAnonKey || "placeholder-anon-key";

  if (!isSupabaseConfigured) {
    console.warn(
      "[Database Configuration] Supabase environment variables are missing. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your hosting dashboard (e.g. Vercel).",
    );
  }

  const client = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      fetch: createSupabaseFetch(SUPABASE_ANON_KEY),
    },
    auth: {
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  if (typeof window !== "undefined") {
    // Keep cookie in sync so server functions & SSR always have access
    try {
      client.auth.onAuthStateChange((_event, session) => {
        const token = session?.access_token;
        if (token) {
          document.cookie = `sb-access-token=${token}; Path=/; SameSite=Lax; Max-Age=604800`;
        } else {
          document.cookie = `sb-access-token=; Path=/; SameSite=Lax; Max-Age=0`;
        }
      });
    } catch {
      // safe fallback if storage is unconfigured
    }
  }

  return client;
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
