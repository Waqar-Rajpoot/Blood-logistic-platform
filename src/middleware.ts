import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;
    
    const guestOnlyPaths = [
      "/", 
      "/about", 
      "/search", 
      "/login", 
      "/signup", 
      "/verifyemail"
    ];

    if (token && guestOnlyPaths.some(path => pathname === path)) {
      const url = req.nextUrl.clone();

      if (token.role === "admin") url.pathname = "/admin";
      else if (token.role === "donor") url.pathname = "/donor";
      else if (token.role === "receiver") url.pathname = "/receiver";
      else url.pathname = "/"; // Fallback if role is missing

      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Publicly accessible paths (for non-logged in users)
        const publicPaths = [
          "/",
          "/about",
          "/signup",
          "/login",
          "/verifyemail",
          "/search",
        ];
        
        if (publicPaths.includes(pathname)) return true;

        // Protected paths: must have token and matching role
        if (pathname.startsWith("/admin")) return token?.role === "admin";
        if (pathname.startsWith("/donor")) return token?.role === "donor";
        if (pathname.startsWith("/receiver")) return token?.role === "receiver";

        return !!token;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
);

export const config = {
  matcher: [
    "/",
    "/about",
    "/login",
    "/signup",
    "/search",
    "/verifyemail",
    "/admin/:path*",
    "/donor/:path*",
    "/receiver/:path*",
  ],
};