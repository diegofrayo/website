// --- Primitives ---

export type TypePrimitive = string | number | boolean;

export type TypeObjectWithPrimitives = Record<string, TypePrimitive>;

// --- Internationalization ---

export type TypeLocale = "es" | "en";

export type TypePagesRoutes =
  | "/"
  | "/blog"
  | "/about-me"
  | "/resume"
  | "/snippets"
  | "/playground"
  | "/roadmap"
  | "/404"
  | "/500";

export type TypeGenerateSupportedLocales = Array<{
  name: TypeLocale;
  route: string;
}>;

export type TypeSiteTexts = {
  page: {
    config: Record<string, any>;
    common: Record<string, any>;
    current_locale: Record<string, any>;
  };
  layout: {
    config: Record<string, any>;
    common: Record<string, any>;
    current_locale: Record<string, any>;
  };
};

export type TypeGetSiteTextsParam = {
  page?: TypePagesRoutes;
  layout?: boolean;
  locale?: TypeLocale;
};

export type TypeGetAssetsParam = Array<"header" | "blog_post" | "footer" | "vr">;

// --- Blog ---

interface TypeBlogPostBase {
  slug: string;
  is_legacy: boolean;
  default_locale: TypeLocale;
  locales: TypeLocale[];
  created_at: string;
  published_at: string;
  updated_at: string;
  config: {
    is_published: boolean;
    meta_no_robots: boolean;
  };
  assets?: Record<string, string>;
}

interface TypeBlogPostBaseWithES extends TypeBlogPostBase {
  es: {
    title: string;
    description: string;
  };
}

interface TypeBlogPostBaseWithEN extends TypeBlogPostBase {
  en: {
    title: string;
    description: string;
  };
}

export type TypeBlogPost = TypeBlogPostBaseWithES | TypeBlogPostBaseWithEN;

// --- Music ---

export type TypeSong = {
  id: string;
  title: string;
  artist: string;
  album: string;
  spotifyUrl: string;
  youtubeUrl: string;
  created_at: string;
  published: boolean;
};

// --- Components props ---

export type TypeBreadcumbProps = {
  items: Array<{
    text: string;
    url?: TypePagesRoutes;
  }>;
};

export type TypeCodeProps = {
  language: "jsx" | "css" | "typescript" | "javascript" | "bash" | "yaml";
  code: any;
  fileName?: string;
  sourceURL?: string;
};
