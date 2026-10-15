import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Handle Discord OAuth callback — strip `iss` param and skip intl middleware
  if (request.nextUrl.pathname === "/api/auth/callback/discord") {
    const url = request.nextUrl.clone();
    if (url.searchParams.has("iss")) {
      url.searchParams.delete("iss");
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/api/auth/callback/discord",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
