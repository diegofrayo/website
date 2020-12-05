export const DEFAULT_LOCALE = "es-419";

export const Routes = {
  HOME: "/",
  ABOUT_ME: "/acerca-de-mi",
  BLOG: (slug?: string): string => `/blog${slug ? "/" + slug : ""}`,
  ERROR_404: "/404",
  ERROR_500: "/500",
};
