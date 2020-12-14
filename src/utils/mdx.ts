import { Link, UL, TextWithEmoji, Emoji } from "~/components";
import * as MDXComponents from "~/components/MDXComponents";
import GithubData from "~/data/github.json";
import { getSiteTexts } from "~/i18n";

import { Routes } from "./constants";

export const MDXComponentsConfig = {
  ...MDXComponents,
  a: Link,
  ul: UL,
  Link,
  TextWithEmoji,
  Emoji,
};

export const MDXScope = {
  github: GithubData,
  Routes: { ...Routes, BLOG: Routes.BLOG(), PROJECTS: Routes.PROJECTS() },
  resume: getSiteTexts({ page: Routes.RESUME }).page,
};
