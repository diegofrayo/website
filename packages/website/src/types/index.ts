import React, { CSSProperties, EffectCallback, RefObject } from "react";

// --- Primitives ---

export type T_Primitive = string | number | boolean | undefined | null;

export type T_ObjectWithPrimitives = Record<string, T_Primitive>;

export type T_ReactChildrenProp = React.ReactNode;

export type T_ReactFCReturn = JSX.Element | null;

export type T_ReactStylesProp = CSSProperties;

export type T_ReactRefObject<Type> = RefObject<Type>;

export type T_HTML_Attributes = JSX.IntrinsicElements;

export type T_HTMLElement = HTMLElement;

export type T_EffectCallback = EffectCallback;

export type T_Object<T = any> = Record<string, T>;

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
  isLegacy: boolean;
  defaultLocale: T_Locale;
  locales: T_Locale[];
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
  config: {
    isPublished: boolean;
    metaNoRobots: boolean;
  };
  assets?: Record<string, string>;
}

export type T_BlogPostLocaleData = {
  title: string;
  description: string;
  categories: [{ id: number; value: string }];
};

interface T_BlogPostBaseWithES extends T_BlogPostBase {
  es: T_BlogPostLocaleData;
}

interface T_BlogPostBaseWithEN extends T_BlogPostBase {
  en: T_BlogPostLocaleData;
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
    isNextLink?: boolean;
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
