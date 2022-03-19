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

export type T_Locale = "en";

export type T_PageRoute =
  | "/"
  | "/about-me"
  | "/resume"
  | "/bookmarks"
  | "/blog"
  | "/blog/[slug]"
  | "/music"
  | "/music/[song]"
  | "/personal"
  | "/timer"
  | "/sign-in"
  | "/sign-out"
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
  thumbnail: string;
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
  category:
    | "0|IN_PROGRESS"
    | "1|DONE"
    | "2|TO_PRACTICE"
    | "3|SOME_DAY"
    | "4|NO_SING"
    | "5|ABANDONED";
  spotifyUrl: string;
  youtubeUrl: string;
  createdAt: string;
  isPublic: boolean;
  sources: {
    order: number;
    text: string;
    url: string;
    source: "youtube" | "lacuerda" | "url" | "instagram" | "spotify" | "ultimate-guitar";
  }[];
  chords: string[];
  assets: T_Object<string>;
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
  isPublic: boolean;
};

// --- Books ---

export type T_Book = {
  id: string;
  title: string;
  author: string;
  year: number;
  calification: number;
  addedDate: string;
  url: string;
  cover: string;
  isPublic: boolean;
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
    instagram: string;
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
  "FLOWER_1" = "FLOWER_1",
  "FLOWER_2" = "FLOWER_2",
  "FLOWER_3" = "FLOWER_3",
  "GITHUB" = "GITHUB",
  "GITHUB_LIGHT" = "GITHUB_LIGHT",
  "GMAIL" = "GMAIL",
  "GUITAR" = "GUITAR",
  "INSTAGRAM" = "INSTAGRAM",
  "LINKEDIN" = "LINKEDIN",
  "NETFLIX" = "NETFLIX",
  "SOCCER" = "SOCCER",
  "SPOTIFY" = "SPOTIFY",
  "TWITTER" = "TWITTER",
  "WHATSAPP" = "WHATSAPP",
  "YOUTUBE" = "YOUTUBE",

  "ARROW_UP" = "ARROW_UP",
  "BOOK_OPEN" = "BOOK_OPEN",
  "CALENDAR" = "CALENDAR",
  "CHAT" = "CHAT",
  "CHECK" = "CHECK",
  "CHEVRON_DOUBLE_DOWN" = "CHEVRON_DOUBLE_DOWN",
  "CHEVRON_DOWN" = "CHEVRON_DOWN",
  "CHEVRON_LEFT" = "CHEVRON_LEFT",
  "CHEVRON_RIGHT" = "CHEVRON_RIGHT",
  "CLIPBOARD" = "CLIPBOARD",
  "CLOCK" = "CLOCK",
  "CODE" = "CODE",
  "COG" = "COG",
  "COLOR_SWATCH" = "COLOR_SWATCH",
  "DOTS_CIRCLE_HORIZONTAL" = "DOTS_CIRCLE_HORIZONTAL",
  "DOTS_CIRCLE_HORIZONTAL_SOLID" = "DOTS_CIRCLE_HORIZONTAL_SOLID",
  "EDIT" = "EDIT",
  "EXTERNAL_LINK" = "EXTERNAL_LINK",
  "FILM" = "FILM",
  "HEART" = "HEART",
  "KEY" = "KEY",
  "LINK" = "LINK",
  "MENU" = "MENU",
  "MINUS" = "MINUS",
  "MOON" = "MOON",
  "MUSIC_NOTE" = "MUSIC_NOTE",
  "PAUSE" = "PAUSE",
  "PHOTOGRAPH" = "PHOTOGRAPH",
  "PLAY" = "PLAY",
  "PRESENTATION_CHART_LINE" = "PRESENTATION_CHART_LINE",
  "REFRESH" = "REFRESH",
  "REPLY" = "REPLY",
  "SERVER" = "SERVER",
  "STAR" = "STAR",
  "SUN" = "SUN",
  "USER_CIRCLE" = "USER_CIRCLE",
  "VOLUME_OFF" = "VOLUME_OFF",
  "VOLUME_UP" = "VOLUME_UP",
  "X" = "X",
  "ZOOM_IN" = "ZOOM_IN",
  "ZOOM_OUT" = "ZOOM_OUT",
}
