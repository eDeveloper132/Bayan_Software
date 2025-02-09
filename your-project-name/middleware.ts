import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: ["/(.*?)"], // This ensures the middleware does not match any routes
};
