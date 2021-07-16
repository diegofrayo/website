import { T_Object, T_PagesRoutes } from "~/types";

export const ROUTES: T_Object<T_PagesRoutes> = {
  HOME: "/",
  ABOUT_ME: "/about-me",
  MOVIES: "/about-me/movies",
  BOOKS: "/about-me/books",
  RESUME: "/resume",
  SNIPPETS: "/snippets",
  ERROR_404: "/404",
  ERROR_500: "/500",
  BLOG: "/blog",
  PLAYGROUND: "/playground",
  MUSIC: "/music",
  CONTACT: "/contact",
};

export const DYNAMIC_MAIN_PAGES = ["about-me", "resume", "snippets"];
