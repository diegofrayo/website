import { Link, UL, TextWithEmoji, Emoji } from "~/components";
import * as MDXComponents from "~/components/MDXComponents";
import GithubData from "~/data/github.json";
import { WEBSITE_METADATA } from "~/data/metadata";

import { Routes } from "./constants";
import { getSiteTexts } from "./i18n";

export const MDXComponentsConfig = {
  ...MDXComponents,
  a: Link,
  ul: UL,
  h1: MDXComponents.Title("h1"),
  h2: MDXComponents.Title("h2"),
  h3: MDXComponents.Title("h3"),
  Link,
  TextWithEmoji,
  Emoji,
};

export const MDXScope = {
  DATA: {
    github: GithubData,
    resume: getSiteTexts({ page: Routes.RESUME }).page.current_locale,
    website: WEBSITE_METADATA,
    routes: {
      ...Routes,
      BLOG: Routes.BLOG(),
      PLAYGROUND: Routes.PLAYGROUND(),
    },
  },
};
