import React, {
  CSSProperties,
  Dispatch,
  EffectCallback,
  ReactNode,
  RefObject,
  SetStateAction,
} from "react";

// --- Own ---

export type T_Primitive = string | number | boolean | undefined | null;

export type T_Object<Value = any> = Record<string, Value>;

export type T_Function<Return = void> = () => Return;

export type T_ReactChildrenProp = React.ReactNode;

export type T_ReactStylesProp = CSSProperties;

export type T_ReactElement = JSX.Element | null;

export type T_ReactFunctionComponent<Props = T_Object> = React.FunctionComponent<Props>;

export type T_ReactRefObject<RefType> = RefObject<RefType>;

export type T_ReactForwardedRef = React.ForwardedRef<unknown>;

export type T_ReactEffectCallback = EffectCallback;

export type T_ReactSetState<T_State> = Dispatch<SetStateAction<T_State>>;

export type T_HTMLAttributes = JSX.IntrinsicElements;

export type T_OnClickEvent<HTMLElement = HTMLButtonElement> = React.MouseEvent<HTMLElement>;

export type T_OnChangeEvent<HTMLElement> = React.ChangeEventHandler<HTMLElement>;

export type T_OnScrollEvent = React.UIEvent<HTMLElement>;

export type T_FormEvent<HTMLElement> = React.FormEvent<HTMLElement>;

// --- Internationalization ---

export type T_Locale = "es" | "en";

export type T_PagesRoutes =
  | "/"
  | "/blog"
  | "/about-me"
  | "/about-me/movies"
  | "/about-me/books"
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
    config: T_Object;
    common: T_Object;
    current_locale: T_Object;
  };
  page: {
    config: T_Object;
    common: T_Object;
    current_locale: T_Object;
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
  assets?: T_Object<string>;
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
  artist: string | string[];
  album: string;
  year: number;
  progress: number;
  spotifyUrl: string;
  youtubeUrl: string;
  createdAt: string;
  isPublished: boolean;
  sources: { text: string; url: string; source: "youtube" | "lacuerda" | "url" }[];
};

// --- Movies ---

export type T_Movie = {
  id: string;
  title: string;
  type: "Serie" | "Película" | "Documental" | "Serie documental";
  source: "Netflix" | "YouTube" | "imdb" | "Amazon Prime Video";
  categories: string[];
  calification: number;
};

// --- Books ---

export type T_Book = {
  id: string;
  title: string;
  author: string;
  year: number;
  calification: number;
  url: string;
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
  language: "jsx" | "tsx" | "css" | "typescript" | "javascript" | "bash" | "yaml";
  code: string;
  fileName?: string;
  sourceURL?: string;
  showOnlySourceCode?: boolean;
};

export enum E_Icons {
  "500PX" = "500PX",
  "GITHUB" = "GITHUB",
  "GMAIL" = "GMAIL",
  "NETFLIX" = "NETFLIX",
  "SPOTIFY" = "SPOTIFY",
  "WHATSAPP" = "WHATSAPP",
  "YOUTUBE" = "YOUTUBE",

  "CALENDAR" = "CALENDAR",
  "CHECK" = "CHECK",
  "CHEVRON_LEFT" = "CHEVRON_LEFT",
  "CHEVRON_RIGHT" = "CHEVRON_RIGHT",
  "CODE" = "CODE",
  "EDIT" = "EDIT",
  "HEART" = "HEART",
  "LINK" = "LINK",
  "MINUS" = "MINUS",
  "MOON" = "MOON",
  "STAR" = "STAR",
  "SUN" = "SUN",
  "X" = "X",
  "ZOOM_IN" = "ZOOM_IN",
  "ZOOM_OUT" = "ZOOM_OUT",
}
