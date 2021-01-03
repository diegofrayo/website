import { Link, UL, TextWithEmoji, Emoji, Image } from "~/components";
import * as MDXComponents from "~/components/MDXComponents";
import GithubData from "~/data/github.json";
import { WEBSITE_METADATA } from "~/data/metadata.json";
import Routes from "~/data/routes.json";

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

// TODO: Set type for this const
export const MDXScope = {
  DATA: {
    github: GithubData,
    resume: getSiteTexts({ page: Routes.RESUME }).page.current_locale,
    website: WEBSITE_METADATA,
    routes: Routes,
  },
};
