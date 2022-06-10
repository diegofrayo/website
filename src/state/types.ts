import type { T_Locale, T_UnknownObject } from "~/types";

export type T_Store = T_UnknownObject;

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
