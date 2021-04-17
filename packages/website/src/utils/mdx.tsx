import React from "react";

import {
  Blockquote,
  Code as CodePrimitive,
  Collapsible,
  Image,
  Link,
  List,
  Space,
} from "~/components/primitive";
import { Code, Title, TextWithEmoji, GithubRepo, Playground } from "~/components/pages/_shared";
import * as HTMLSemanticTagsBlogPostComponents from "~/components/pages/blog//html-semantic-tags";
import * as MyFavoriteMusicAndMDXBlogPostComponents from "~/components/pages/blog//my-favorite-music-and-mdx";
import * as MusicComponents from "~/components/pages/music";
import * as ResumeComponents from "~/components/pages/resume";
import * as SnippetsComponents from "~/components/pages/snippets";
import { T_ReactChildrenProp, T_ReactElement } from "~/types";
import { WEBSITE_METADATA, GITHUB_DATA } from "~/utils/constants";
import { ROUTES } from "~/utils/routing";

export const MDXComponents = {
  a: Link,
  blockquote: Blockquote,
  h1: Title("h1", { showLinkIcon: true }),
  h2: Title("h2", { showLinkIcon: true }),
  h3: Title("h3", { showLinkIcon: true }),
  h4: Title("h4", { showLinkIcon: true }),
  img: Image,
  ul: List,
  pre: CodePrimitive,
  inlineCode: function InlineCode({
    children,
    ...rest
  }: {
    children: T_ReactChildrenProp;
  }): T_ReactElement {
    return (
      <CodePrimitive variant={CodePrimitive.variant.INLINE} {...rest}>
        {children}
      </CodePrimitive>
    );
  },
  hr: function HR(): T_ReactElement {
    return <Space variant={Space.variant.DASHED} />;
  },

  // Primitive components
  Code,
  Collapsible,
  Image,
  Link,
  List,
  Space,

  // Shared components
  GithubRepo,
  Playground,
  TextWithEmoji,

  // Pages components
  ...HTMLSemanticTagsBlogPostComponents,
  ...MyFavoriteMusicAndMDXBlogPostComponents,
  ...MusicComponents,
  ...ResumeComponents,
  ...SnippetsComponents,
};

export const MDXScope = {
  DATA: {
    GITHUB_DATA,
    WEBSITE_METADATA,
    ROUTES,
  },
};
