import { posts } from "~/data/blog/posts.json";

import { toUpperCaseObjectProperty } from "./misc";

export const DEFAULT_LOCALE = "es";

export const PAGES_NAMES = ["about-me", "resume", "roadmap"];

export const Routes: Record<string, any> = {
  HOME: "/",
  ...PAGES_NAMES.reduce((acum, curr) => {
    acum[toUpperCaseObjectProperty(curr)] = `/${curr}`;
    return acum;
  }, {}),

  ERROR_404: "/404",
  ERROR_500: "/500",

  BLOG: (slug?: string): string => `/blog${slug ? "/" + slug : ""}`,
  ...Object.keys(posts).reduce((acum, curr) => {
    acum[toUpperCaseObjectProperty(curr)] = `/blog/${curr}`;
    return acum;
  }, {}),
};
