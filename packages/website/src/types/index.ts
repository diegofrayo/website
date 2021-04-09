import React, { CSSProperties, RefObject } from "react";

// --- Primitives ---

export type T_Primitive = string | number | boolean;

export type T_ObjectWithPrimitives = Record<string, T_Primitive>;

export type T_ReactChildrenProp = React.ReactNode;

export type T_ReactFCReturn = JSX.Element | null;

export type T_ReactStylesProp = CSSProperties;

export type T_ReactRefObject<Type> = RefObject<Type>;

// --- Internationalization ---

export type T_Locale = "es" | "en";

export type T_PagesRoutes =
  | "/"
  | "/blog"
  | "/about-me"
  | "/resume"
  | "/snippets"
  | "/playground"
  | "/music"
  | "/404"
  | "/500";

export type T_GenerateSupportedLocales = {
  name: T_Locale;
  route: string;
}[];

export type T_SiteTexts = {
  layout: {
    config: Record<string, any>;
    common: Record<string, any>;
    current_locale: Record<string, any>;
  };
  page: {
    config: Record<string, any>;
    common: Record<string, any>;
    current_locale: Record<string, any>;
  };
};

export type T_GetSiteTextsParam = {
  page?: T_PagesRoutes;
  layout?: boolean;
  locale?: T_Locale;
};

export type T_GetAssetsParam = "vr"[];

// --- Blog ---

interface T_BlogPostBase {
  slug: string;
  is_legacy: boolean;
  default_locale: T_Locale;
  locales: T_Locale[];
  created_at: string;
  published_at: string;
  updated_at: string;
  config: {
    is_published: boolean;
    meta_no_robots: boolean;
  };
  assets?: Record<string, string>;
}

interface T_BlogPostBaseWithES extends T_BlogPostBase {
  es: {
    title: string;
    description: string;
  };
}

interface T_BlogPostBaseWithEN extends T_BlogPostBase {
  en: {
    title: string;
    description: string;
  };
}

export type T_BlogPost = T_BlogPostBaseWithES | T_BlogPostBaseWithEN;

// --- Music ---

export type T_Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  year: number;
  progress: number;
  spotifyUrl: string;
  youtubeUrl: string;
  created_at: string;
  published: boolean;
  sources: { text: string; url: string; source: string }[];
};

// --- Components props ---

export type T_BreadcumbProps = {
  items: {
    text: string;
    url?: T_PagesRoutes;
  }[];
};

export type T_CodeProps = {
  language: "jsx" | "css" | "typescript" | "javascript" | "bash" | "yaml";
  code: any;
  fileName?: string;
  sourceURL?: string;
};

export enum E_Icons {
  "500_PX" = "500_PX",
  "GITHUB" = "GITHUB",
  "GMAIL" = "GMAIL",
  "SPOTIFY" = "SPOTIFY",
  "WHATSAPP" = "WHATSAPP",
  "YOUTUBE" = "YOUTUBE",

  "CALENDAR" = "CALENDAR",
  "CODE" = "CODE",
  "EDIT" = "EDIT",
  "LINK" = "LINK",
  "MOON" = "MOON",
  "SUN" = "SUN",
  "X" = "X",
  "ZOOM_IN" = "ZOOM_IN",
  "ZOOM_OUT" = "ZOOM_OUT",
}
