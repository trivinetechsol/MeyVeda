import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "mv_auth";

interface CookiePayload {
  role: string;
  phone: string;
}

function getAuth(req: NextRequest): CookiePayload | null {
  const value = req.cookies.get(COOKIE_NAME)?.value;
  if (!value) return null;
  try {
    return JSON.parse(atob(value)) as CookiePayload;
  } catch {
    return null;
  }
}

// Routes that require the practitioner role
const PRACTITIONER_ROUTES = ["/pro"];

// Routes that require any authenticated user
const PROTECTED_ROUTES = [
  "/",
  "/discover",
  "/ai-chat",
  "/records",
  "/apothecary",
  "/profile",
  "/doctor",
  "/booking",
  "/checkout",
  "/prescription",
  "/consent",
  "/orders",
  "/consult",
  "/waiting-room",
  "/post-consult",
  "/appointments",
  "/dinacharya",
  "/notifications",
];

function matchesProtected(pathname: string): boolean {
  if (pathname === "/") return true;
  return PROTECTED_ROUTES.some((r) => r !== "/" && pathname.startsWith(r));
}

function matchesPractitioner(pathname: string): boolean {
  return PRACTITIONER_ROUTES.some((r) => pathname.startsWith(r));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const auth = getAuth(req);

  // Auth page: redirect already-authenticated users to their dashboard
  if (pathname.startsWith("/onboarding")) {
    if (auth) {
      const dest = auth.role === "practitioner" ? "/pro" : "/";
      return NextResponse.redirect(new URL(dest, req.url));
    }
    return NextResponse.next();
  }

  // Practitioner-only routes (e.g. /pro, /pro/emr)
  if (matchesPractitioner(pathname)) {
    if (!auth) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    if (auth.role !== "practitioner") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // General protected routes
  if (matchesProtected(pathname)) {
    if (!auth) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
