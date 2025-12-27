import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Redirect logged-in users away from Auth pages
    if (token && (pathname === "/login" || pathname === "/signup" || pathname === "/verifyemail" || pathname === "/")) {
      const url = req.nextUrl.clone();
      
      if (token.role === "admin") url.pathname = "/admin";
      else if (token.role === "donor") url.pathname = "/donor";
      else if (token.role === "receiver") url.pathname = "/receiver";
      else url.pathname = "/"; // Fallback

      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Public paths
        const publicPaths = ["/", "/about", "/signup", "/login", "/verifyemail"];
        if (publicPaths.includes(pathname)) return true;

        // Protected paths based on roles
        if (pathname.startsWith("/admin")) return token?.role === "admin";
        if (pathname.startsWith("/donor")) return token?.role === "donor";
        if (pathname.startsWith("/receiver")) return token?.role === "receiver";

        return !!token;
      },
    },
    // CRITICAL: Explicitly pass the secret for Vercel production
    secret: process.env.NEXTAUTH_SECRET,
  }
);

export const config = {
  matcher: [
    "/",
    "/about",
    "/login",
    "/signup",
    "/verifyemail",
    "/admin/:path*",
    "/donor/:path*",
    "/receiver/:path*",
    "/profile/:path*",
  ],
};