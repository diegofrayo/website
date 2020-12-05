import { Link } from "~/components";
import * as MDXComponents from "~/components/MDXComponents";
import GithubData from "~/data/github.json";

const MDXComponentsConfig = {
  ...MDXComponents,
  a: Link,
};

const MDXScope = { github: GithubData };

export { MDXComponentsConfig, MDXScope };
