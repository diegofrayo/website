import { T_Object, T_PageRoute } from "~/types";

export const ROUTES: T_Object<T_PageRoute> = {
  HOME: "/",
  ABOUT_ME: "/about-me",
  RESUME: "/resume",
  BLOG: "/blog",
  BLOG_DETAILS: "/blog/[slug]",
  MUSIC: "/music",
  MUSIC_DETAILS: "/music/[song]",
  PLAYGROUND: "/playground",
  SIGN_IN: "/sign-in",
  ERROR_404: "/404",
  ERROR_500: "/500",
};

export const DYNAMIC_MAIN_PAGES = ["about-me", "resume"];
