// TODO: Improve this type (avoid any)
export type TypeSiteTexts = {
  page?: {
    config: Record<string, any>;
    common: Record<string, any>;
    current_locale: Record<string, any>;
  };
  layout?: {
    config: Record<string, any>;
    common: Record<string, any>;
    current_locale: Record<string, any>;
  };
};

export type TypeLocale = "es" | "en";

// TODO: ES or EN is required
export type TypeBlogPost = {
  is_legacy: boolean;
  locales: TypeLocale[];
  default_locale: TypeLocale;
  is_published: boolean;
  created_at: string;
  published_at: string;
  updated_at: string;
  slug: string;
  es?: {
    title: string;
    description: string;
  };
  en?: {
    title: string;
    description: string;
  };
  assets?: Record<string, string>;
};

export type TypeGetSiteTextsParam = {
  page?: string; // TODO: Set posible pages
  layout?: boolean;
  locale?: TypeLocale;
};

export type TypeBreadcumbProps = {
  items: Array<{
    text: string;
    url: string;
  }>;
};

export type TypeGenerateSupportedLocales = Array<{
  name: TypeLocale;
  route: string;
}>;

export type TypeGetAssetsParam = Array<"header" | "blog_post" | "footer" | "vr">;
