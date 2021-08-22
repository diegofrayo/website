import React from "react";

import {
  Blockquote,
  Code as CodePrimitive,
  Collapsible,
  Icon,
  Image,
  Link,
  List,
  Space,
} from "~/components/primitive";
import {
  Code,
  TitleCreator,
  TextWithEmoji,
  GitHubRepo,
  Playground,
  ImageWithLink,
} from "~/components/pages/_shared";
import { Sources } from "~/components/pages/blog";
import * as HTMLSemanticTagsBlogPostComponents from "~/components/pages/blog/[slug]/html-semantic-tags";
import * as MyFavoriteMusicAndMDXBlogPostComponents from "~/components/pages/blog/[slug]/my-favorite-music-and-mdx";
import * as MusicComponents from "~/components/pages/music";
import * as ResumeComponents from "~/components/pages/resume";
import { T_ReactChildrenProp, T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";

export const MDXComponents = {
  a: Link,
  blockquote: Blockquote,
  h1: TitleCreator("h1", { showLinkIcon: true }),
  h2: TitleCreator("h2", { showLinkIcon: true }),
  h3: TitleCreator("h3", { showLinkIcon: true }),
  h4: TitleCreator("h4", { showLinkIcon: true }),
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
  Collapsible,
  Icon,
  Image,
  Link,
  List,
  Space,

  // Shared components
  Code,
  GitHubRepo,
  ImageWithLink,
  Playground,
  TextWithEmoji,

  // Blog components
  ...HTMLSemanticTagsBlogPostComponents,
  ...MyFavoriteMusicAndMDXBlogPostComponents,
  Sources,

  // Pages components
  ...MusicComponents,
  ...ResumeComponents,
};

export const MDXScope = {
  DATA: {
    ROUTES,
  },
};
