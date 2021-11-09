import * as React from "react";

import { Code, Collapsible, Icon, Image, Link, List, Space, Block } from "~/components/primitive";
import {
  GitHubRepo,
  ImageWithLink,
  Playground,
  SourceCode,
  TextWithEmoji,
  TitleCreator,
} from "~/components/pages/_shared";
import { Sources } from "~/components/pages/blog";
import * as HTMLSemanticTagsBlogPostComponents from "~/components/pages/blog/[slug]/html-semantic-tags";
import * as MyFavoriteMusicAndMDXBlogPostComponents from "~/components/pages/blog/[slug]/my-favorite-music-and-mdx";
import * as MusicComponents from "~/components/pages/music";
import * as ResumeComponents from "~/components/pages/resume";
import { T_ReactChildrenProp, T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";

export const MDXComponents = {
  a: function A({ children, ...rest }: { children: T_ReactChildrenProp }): T_ReactElement {
    return (
      <Link variant={Link.variant.PRIMARY} {...rest}>
        {children}
      </Link>
    );
  },
  h1: TitleCreator("h1", { showLinkIcon: true }),
  h2: TitleCreator("h2", { showLinkIcon: true }),
  h3: TitleCreator("h3", { showLinkIcon: true }),
  h4: TitleCreator("h4", { showLinkIcon: true }),
  img: Image,
  ul: function UL({ children, ...rest }: { children: T_ReactChildrenProp }): T_ReactElement {
    return (
      <List variant={List.variant.DEFAULT} {...rest}>
        {children}
      </List>
    );
  },
  pre: Code,
  inlineCode: function InlineCode({
    children,
    ...rest
  }: {
    children: T_ReactChildrenProp;
  }): T_ReactElement {
    return (
      <Code variant={Code.variant.INLINE} {...rest}>
        {children}
      </Code>
    );
  },
  hr: function HR(): T_ReactElement {
    return <Space variant={Space.variant.DASHED} />;
  },

  // Primitive components
  Block,
  Collapsible,
  Icon,
  Image,
  Link,
  List,
  Space,

  // Shared components
  GitHubRepo,
  ImageWithLink,
  Playground,
  SourceCode,
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
