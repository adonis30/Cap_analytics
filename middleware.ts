import {
  clerkMiddleware,
  createRouteMatcher
} from '@clerk/nextjs/server';

// Define the protected routes
const isProtectedRoute = createRouteMatcher([
  
]);

// Define the public routes
const isPublicRoute = createRouteMatcher([
  '/api/webhooks/clerk',
  '/',
  '/api/getUser',
  '/api/uploadthing',
]);

export default clerkMiddleware((auth, req) => {
  // Only protect the route if it is not a public route and is a protected route
  if (!isPublicRoute(req) && isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
