import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that do not require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/register(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/flashcard(.*)",
  "/cbt(.*)",
  "/kanji(.*)",
  "/lms(.*)",
  "/admin(.*)",
  "/api/questions(.*)",
  "/api/vocabularies(.*)",
  "/api/exam-sessions(.*)",
  "/api/lkpd(.*)",
  "/api/webhooks(.*)",
  "/api/public(.*)",
  "/modul(.*)",
  "/lkpd(.*)",
  "/rapor(.*)",
  "/api/rapor(.*)",
]);

import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, request) => {
  // If Clerk is not configured on Cloudflare runtime yet, allow public access
  if (!process.env.CLERK_SECRET_KEY) {
    return NextResponse.next();
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:pdf|html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp3|m4a|wav|ogg)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
