import React, { CSSProperties, Dispatch, EffectCallback, RefObject, SetStateAction } from "react";

// --- Own ---

export type T_Primitive = string | number | boolean | undefined | null;

export type T_Object<Value = any> = Record<string, Value>;

export type T_ReactChildrenProp = React.ReactNode;

export type T_ReactStylesProp = CSSProperties;

export type T_ReactElement = JSX.Element | null;

export type T_ReactFunctionComponent<Props = T_Object> = React.FunctionComponent<Props>;

export type T_ReactRefObject<RefType> = RefObject<RefType>;

export type T_ReactForwardedRef = React.ForwardedRef<unknown>;

export type T_ReactEffectCallback = EffectCallback;

export type T_ReactSetState<T_State> = Dispatch<SetStateAction<T_State>>;

export type T_HTMLElementAttributes = JSX.IntrinsicElements;

export type T_OnClickEvent<HTMLElement = HTMLButtonElement> = React.MouseEvent<HTMLElement>;

export type T_OnChangeEvent<HTMLElement> = React.ChangeEventHandler<HTMLElement>;

export type T_OnScrollEvent = React.UIEvent<HTMLElement>;

export type T_FormEvent<HTMLElement> = React.FormEvent<HTMLElement>;

// --- i18n ---

export type T_PageContent = {
  seo?: T_Object<T_Primitive>;
  page?: T_Object<any> & {
    common?: T_Object<T_Primitive>;
    config?: T_Object<any>;
  };
  layout?: {
    header?: T_Object<T_Primitive>;
    footer?: T_Object<T_Primitive>;
  };
};

export type T_Locale = "es" | "en";

export type T_PageRoute =
  | "/"
  // | "/about-me"
  | "/resume"
  | "/blog"
  | "/blog/[slug]"
  | "/music"
  | "/music/[song]"
  | "/playground"
  | "/sign-in"
  | "/404"
  | "/500";

export type T_GenerateSupportedLocales = {
  name: T_Locale;
  route: string;
}[];

// --- Shared ---

export type T_ItemCategory = { id: string; value: string };

// --- Blog ---

export type T_BlogPost = {
  title: string;
  description: string;
  slug: string;
  categories: T_ItemCategory[];
  locales: T_Locale[];
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
  isPublished: boolean;
  assets?: T_Object<string>;
};

// --- Music ---

export type T_Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  year: number;
  country: string;
  progress: number;
  spotifyUrl: string;
  youtubeUrl: string;
  createdAt: string;
  isPublic: boolean;
  sources: {
    score: number;
    text: string;
    url: string;
    source: "youtube" | "lacuerda" | "url" | "instagram" | "spotify" | "ultimate-guitar";
  }[];
  chords: string[];
};

// --- Films ---

export type T_Film = {
  id: string;
  title: string;
  type: "Serie" | "Película" | "Documental" | "Serie documental";
  source: "Netflix" | "YouTube" | "imdb" | "Amazon Prime Video";
  categories: string[];
  calification: number;
  cover: string;
  addedDate: string;
};

// --- Books ---

export type T_Book = {
  id: string;
  title: string;
  author: string;
  year: number;
  calification: number;
  url: string;
  cover: string;
};

// --- TimeLine ---

export type T_TimeLine = {
  categories: T_TimeLineCategory[];
  items: { year: number; items: T_TimeLineItem[] }[];
};

export type T_TimeLineCategory = T_ItemCategory & { emoji: string };

export type T_TimeLineItem = {
  id: string;
  startDate: string;
  endDate: string;
  description: string;
  categories: T_TimeLineCategory[];
  assets: string[];
};

// --- Redux ---

export type T_Store = T_Object;

export type T_Metadata = {
  website: T_WebsiteMetadata;
  seo: T_SEOMetadata;
};

export type T_WebsiteMetadata = {
  email: string;
  fullName: string;
  shortName: string;
  username: string;
  jobTitle: string;
  url: string;
  nationality: string;
  address: {
    "@type": string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  social: {
    github: string;
    linkedin: string;
    twitter: string;
    "500px": string;
    spotify: string;
    couchsurfing: string;
  };
};

export type T_SEOMetadata = {
  title: string;
  description: string;
};

export type T_PageConfig = {
  locales: T_Locale[];
  reloadWhenLocaleChanges: boolean;
};

// --- Components props ---

export type T_CodeProps = {
  language: "jsx" | "tsx" | "css" | "typescript" | "javascript" | "bash" | "yaml";
  code: string;
  fileName?: string;
  sourceURL?: string;
  showOnlySourceCode?: boolean;
};

export enum E_Icons {
  "500PX" = "500PX",
  "COUCHSURFING" = "COUCHSURFING",
  "GITHUB" = "GITHUB",
  "GMAIL" = "GMAIL",
  "INSTAGRAM" = "INSTAGRAM",
  "LINKEDIN" = "LINKEDIN",
  "NETFLIX" = "NETFLIX",
  "SPOTIFY" = "SPOTIFY",
  "TWITTER" = "TWITTER",
  "WHATSAPP" = "WHATSAPP",
  "YOUTUBE" = "YOUTUBE",

  "ARROW_UP" = "ARROW_UP",
  "CALENDAR" = "CALENDAR",
  "CAMERA" = "CAMERA",
  "CHECK" = "CHECK",
  "CHEVRON_DOUBLE_DOWN" = "CHEVRON_DOUBLE_DOWN",
  "CHEVRON_DOWN" = "CHEVRON_DOWN",
  "CHEVRON_LEFT" = "CHEVRON_LEFT",
  "CHEVRON_RIGHT" = "CHEVRON_RIGHT",
  "CODE" = "CODE",
  "COG" = "COG",
  "DOTS_CIRCLE_HORIZONTAL" = "DOTS_CIRCLE_HORIZONTAL",
  "DOTS_CIRCLE_HORIZONTAL_SOLID" = "DOTS_CIRCLE_HORIZONTAL_SOLID",
  "EDIT" = "EDIT",
  "EXTERNAL_LINK" = "EXTERNAL_LINK",
  "HEART" = "HEART",
  "LINK" = "LINK",
  "MENU" = "MENU",
  "MINUS" = "MINUS",
  "MOON" = "MOON",
  "REPLY" = "REPLY",
  "STAR" = "STAR",
  "SUN" = "SUN",
  "X" = "X",
  "ZOOM_IN" = "ZOOM_IN",
  "ZOOM_OUT" = "ZOOM_OUT",
}
