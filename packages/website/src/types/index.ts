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

export type T_PageContent = {
  seo?: T_Object<T_Primitive>;
  page?: T_Object<any> & {
    common?: T_Object<T_Primitive>;
    config?: T_Object<any>;
  };
  layout?: {
    header?: T_Object<T_Primitive>;
    breadcumb?: T_Object<T_Primitive>;
    footer?: T_Object<T_Primitive>;
  };
};

export type T_Locale = "es" | "en";

export type T_PageRoute =
  | "/"
  | "/about-me"
  | "/resume"
  | "/blog"
  | "/blog/[id]"
  | "/contact"
  | "/music"
  | "/music/[id]"
  | "/playground"
  | "/404"
  | "/500";

export type T_GenerateSupportedLocales = {
  name: T_Locale;
  route: string;
}[];

// --- Blog ---

export type T_BlogPost = {
  title: string;
  description: string;
  slug: string;
  categories: T_BlogPostCategory[];
  locales: T_Locale[];
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
  isLegacy: boolean;
  isPublished: boolean;
  assets?: T_Object<string>;
};

export type T_BlogPostCategory = { id: string; value: string };

// --- Music ---

export type T_Song = {
  id: string;
  title: string;
  artist: string | string[];
  album: string;
  year: number;
  country: string;
  progress: number;
  spotifyUrl: string;
  youtubeUrl: string;
  createdAt: string;
  isPublished: boolean;
  sources: { score: number; text: string; url: string; source: "youtube" | "lacuerda" | "url" }[];
};

// --- Movies ---

export type T_Movie = {
  id: string;
  title: string;
  type: "Serie" | "Película" | "Documental" | "Serie documental";
  source: "Netflix" | "YouTube" | "imdb" | "Amazon Prime Video";
  categories: string[];
  calification: number;
  cover: string;
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

// --- Redux ---

export type T_Store = T_Object;

export type T_MetadataReducer = {
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
    "500px": string;
  };
};

export type T_SEOMetadata = {
  title: string;
};
export type T_UIReducer = {
  locales: T_Locale[];
  reloadLocaleUpdate: boolean;
};

// --- Components props ---

export type T_BreadcumbProps = {
  items: {
    text: string;
    url?: T_PageRoute;
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
  "INSTAGRAM" = "INSTAGRAM",
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
