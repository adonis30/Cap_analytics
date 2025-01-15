import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define the protected routes (if needed)
const isProtectedRoute = createRouteMatcher([
  '/protected', // Example protected routes, add specific routes here
  '/dashboard',
]);

// Define the public routes, including the sign-in page
const isPublicRoute = createRouteMatcher([
  '/api/webhooks/clerk',
  '/',
  '/api/getUser',
  '/api/uploadthing',
  '/sign-in', // Ensure this allows unauthenticated access
  '/sign-up', // Include sign-up if relevant
]);

export default clerkMiddleware((auth, req) => {
  // Protect the route only if it is not public and is marked as protected
  if (!isPublicRoute(req) && isProtectedRoute(req)) {
    auth().protect();
  }
});

// Config for matcher, ensure it applies middleware to the intended routes
export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // Matches everything except files or Next.js internal routes
    "/",
    "/(api|trpc)(.*)",
  ],
};

