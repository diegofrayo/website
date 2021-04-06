import { TypePagesRoutes } from "~/types";

export const Routes: Record<string, TypePagesRoutes> = {
  HOME: "/",
  ABOUT_ME: "/about-me",
  RESUME: "/resume",
  SNIPPETS: "/snippets",
  ERROR_404: "/404",
  ERROR_500: "/500",
  BLOG: "/blog",
  PLAYGROUND: "/playground",
  MUSIC: "/music",
};

export const DYNAMIC_MAIN_PAGES = ["about-me", "resume", "snippets"];

export function goTo() {
  console.warn("Implement this someday...");
}
