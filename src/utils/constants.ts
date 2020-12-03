export const Routes = {
  HOME: "/",
  ABOUT_ME: "/acerca-de-mi",
  BLOG: (slug?: string): string => `/blog${slug ? "/" + slug : ""}`,
};
