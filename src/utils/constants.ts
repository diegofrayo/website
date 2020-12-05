import { posts } from "~/data/blog/posts.json";

export const DEFAULT_LOCALE = "es";

export const Routes = {
  HOME: "/",
  ABOUT_ME: "/about-me",

  ERROR_404: "/404",
  ERROR_500: "/500",

  BLOG: (slug?: string): string => `/blog${slug ? "/" + slug : ""}`,
  ...Object.keys(posts).reduce((acum, curr) => {
    acum[curr.toUpperCase().replace(/-+/g, "_")] = `/blog/${curr}`;
    return acum;
  }, {}),
};
