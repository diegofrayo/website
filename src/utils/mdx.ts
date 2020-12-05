import { Link } from "~/components";
import * as MDXComponents from "~/components/MDXComponents";
import GithubData from "~/data/github.json";

import { Routes } from "./constants";

export const MDXComponentsConfig = {
  ...MDXComponents,
  a: Link,
};

export const MDXScope = {
  github: GithubData,
  Routes: { ...Routes, BLOG: Routes.BLOG() },
};
