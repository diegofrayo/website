import { T_Object, T_PageRoute } from "~/types";

export const ROUTES: T_Object<T_PageRoute> = {
  HOME: "/",
  ABOUT_ME: "/about-me",
  RESUME: "/resume",
  CONTACT: "/contact",
  BLOG: "/blog",
  BLOG_DETAILS: "/blog/[id]",
  MUSIC: "/music",
  MUSIC_DETAILS: "/music/[id]",
  PLAYGROUND: "/playground",
  ERROR_404: "/404",
  ERROR_500: "/500",
};

export const DYNAMIC_MAIN_PAGES = ["about-me", "resume"];
