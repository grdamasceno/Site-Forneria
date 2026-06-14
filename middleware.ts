import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Protects /admin routes. Resilient: if Supabase env is unavailable in the
// Edge runtime, it skips the check (the /admin layout still gates server-side)
// instead of crashing with MIDDLEWARE_INVOCATION_FAILED.
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();
    const { pathname } = request.nextUrl;
    const isLogin = pathname === "/admin/login";

    if (!user && pathname.startsWith("/admin") && !isLogin) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin/login";
      return NextResponse.redirect(redirectUrl);
    }
    if (user && isLogin) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin";
      return NextResponse.redirect(redirectUrl);
    }
  } catch {
    // Never break the app from middleware — the admin layout enforces auth.
    return NextResponse.next();
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
