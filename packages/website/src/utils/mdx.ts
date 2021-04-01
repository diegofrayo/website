import { Collapsible, Image, Link, Separator, UL } from "~/components/primitive";
import { Emoji, TextWithEmoji, ToDoList } from "~/components/shared";
import * as MDXComponents from "~/components/mdx";
import GithubData from "~/data/github.json";
import Metadata from "~/data/metadata.json";
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
  h4: MDXComponents.Title("h4"),
  Collapsible,
  Emoji,
  Link,
  Separator,
  TextWithEmoji,
  ToDoList,
};

export const MDXScope = {
  DATA: {
    github: GithubData,
    resume: getSiteTexts({ page: Routes.RESUME as TypePagesRoutes }).page.current_locale,
    website: Metadata.WEBSITE_METADATA,
    routes: Routes,
  },
};
