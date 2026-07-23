import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";
import { reportServerError } from "@/lib/posthog/server";

// Refreshes the auth session cookie on every request so Server Components
// always see a valid session. See Supabase's Next.js SSR auth guide.
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not remove — this call refreshes the session token. Wrapped: this
  // runs on every request, so a Supabase outage must not take the whole
  // site down with it — report and let the request continue either way.
  try {
    await supabase.auth.getUser();
  } catch (error) {
    await reportServerError(error, "Middleware session refresh failed");
  }

  return supabaseResponse;
}
