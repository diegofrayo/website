import { T_PageRoute } from "~/types";

export const ROUTES: Record<T_RoutesKeys, T_PageRoute> = {
  HOME: "/",
  // ABOUT_ME: "/about-me",
  // RESUME: "/resume",
  BOOKMARKS: "/bookmarks",
  BLOG: "/blog",
  BLOG_DETAILS: "/blog/[slug]",
  MUSIC: "/music",
  MUSIC_DETAILS: "/music/[song]",
  PERSONAL: "/personal",
  PROJECTS: "/projects",
  TIMER: "/timer",
  SIGN_IN: "/sign-in",
  ERROR_404: "/404",
  ERROR_500: "/500",
};

export const DYNAMIC_MAIN_PAGES = [
  // "about-me",
  // "resume",
];

// --- Types ---

type T_RoutesKeys =
  | "HOME"
  | "BOOKMARKS"
  | "BLOG"
  | "BLOG_DETAILS"
  | "MUSIC"
  | "MUSIC_DETAILS"
  | "PERSONAL"
  | "PROJECTS"
  | "TIMER"
  | "SIGN_IN"
  | "ERROR_404"
  | "ERROR_500";
