import { Link, UL, TextWithEmoji, Emoji, Image } from "~/components";
import * as MDXComponents from "~/components/MDXComponents";
import GithubData from "~/data/github.json";
import { WEBSITE_METADATA } from "~/data/metadata.json";
import Routes from "~/data/routes.json";
import { TypePagesRoutes } from "~/types";

import { getSiteTexts } from "./internationalization";

export const MDXComponentsConfig = {
  ...MDXComponents,
  a: Link,
  ul: UL,
  img: Image,
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
    resume: getSiteTexts({ page: Routes.RESUME as TypePagesRoutes }).page.current_locale,
    website: WEBSITE_METADATA,
    routes: Routes,
  },
};
