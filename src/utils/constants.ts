import { posts } from "~/data/blog/posts.json";

import { toUpperCaseObjectProperty } from "./misc";

export const DEFAULT_LOCALE = "en";

export const PAGES_NAMES = ["about-me", "resume", "roadmap"];

export const Routes: Record<string, any> = {
  HOME: "/",
  ...PAGES_NAMES.reduce((acum, curr) => {
    acum[toUpperCaseObjectProperty(curr)] = `/${curr}`;
    return acum;
  }, {}),
  PROJECTS: createUrl("projects"),
  ERROR_404: "/404",
  ERROR_500: "/500",

  BLOG: createUrl("blog"),
  ...Object.keys(posts).reduce((acum, curr) => {
    acum[toUpperCaseObjectProperty(curr)] = `/blog/${curr}`;
    return acum;
  }, {}),
};

function createUrl(root: string): any {
  return function createUrl_return(slug?: string) {
    return `/${root}${slug ? "/" + slug : ""}`;
  };
}
