import "server-only";

import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  // Memaksa Stack Auth menggunakan URL Vercel secara konsisten
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://inventory-app-lsml.vercel.app",
});
