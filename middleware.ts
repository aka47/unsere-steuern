import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define paths that are protected (require authentication)
  const protectedPaths = ["/dashboard", "/profile", "/settings"];
  const isPathProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // Define authentication paths
  const isAuthRoute = pathname.startsWith("/auth");

  // Get the token
  const token = await getToken({ req: request });

  // Redirect logic
  if (isPathProtected && !token) {
    // Redirect to auth if trying to access a protected route without being authenticated
    const url = new URL("/auth", request.url);
    url.searchParams.set("callbackUrl", encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && token) {
    // Redirect to home if already authenticated and trying to access auth routes
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Match all paths except for static files, api routes, and _next
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};