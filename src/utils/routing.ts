import { NextRouter } from "next/router";
import type { T_PageRoute } from "~/types";
import { isPWA } from "./browser";

// --- Constants ---

export const ROUTES: Record<T_RoutesKeys, T_PageRoute> = {
  HOME: "/",
  ABOUT_ME: "/about-me",
  RESUME: "/resume",
  BOOKMARKS: "/bookmarks",
  BLOG: "/blog",
  BLOG_DETAILS: "/blog/[slug]",
  MUSIC: "/music",
  MUSIC_DETAILS: "/music/[song]",
  PERSONAL: "/personal",
  TIMER: "/timer",
  SIGN_IN: "/sign-in",
  SIGN_OUT: "/sign-out",
  ERROR_404: "/404",
  ERROR_500: "/500",
};

// --- Utils ---

const LOCAL_STORAGE_KEY = "DFR_LAST_PAGE";

export function redirect(path: string): void {
  if (isPWA()) {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, path);
  }

  window.location.href = path;
}

export function initPWARoutingConfig(router: NextRouter): any {
  if (!window.navigator.onLine) return;

  const lastPageVisited = window.localStorage.getItem(LOCAL_STORAGE_KEY) || "";
  const handleRouteChangeComplete = () => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, window.location.pathname);
  };

  if (lastPageVisited && lastPageVisited !== window.location.pathname) {
    window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    window.location.href = lastPageVisited;
    return;
  }

  router.events.on("routeChangeComplete", handleRouteChangeComplete);

  return () => {
    router.events.off("routeChangeComplete", handleRouteChangeComplete);
  };
}

export function goBack(): void {
  const urlItems = window.location.pathname.split("/");

  redirect(urlItems.slice(0, urlItems.length - 1).join("/") + "/");
}

// --- Types ---

type T_RoutesKeys =
  | "HOME"
  | "BOOKMARKS"
  | "ABOUT_ME"
  | "RESUME"
  | "BLOG"
  | "BLOG_DETAILS"
  | "MUSIC"
  | "MUSIC_DETAILS"
  | "PERSONAL"
  | "TIMER"
  | "SIGN_IN"
  | "SIGN_OUT"
  | "ERROR_404"
  | "ERROR_500";
