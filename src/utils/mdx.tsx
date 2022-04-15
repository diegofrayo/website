import * as React from "react";

import { Code, Collapsible, Icon, Image, Link, List, Space, Block } from "~/components/primitive";
import {
  ImageWithLink,
  Playground,
  SourceCode,
  TextWithEmoji,
  Timeline,
  TitleCreator,
} from "~/components/shared";
import * as BlogComponents from "~/components/pages/blog/components";
import * as MusicComponents from "~/components/pages/music/components";
import * as AboutMeComponents from "~/components/pages/about-me/components";
import * as ResumeComponents from "~/components/pages/resume";
import type { T_ReactChildrenProp, T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";

export const MDXComponents = {
  a: function A({ children, ...rest }: { children: T_ReactChildrenProp }): T_ReactElement {
    return (
      <Link
        variant={Link.variant.PRIMARY}
        {...rest}
        isExternalUrl
      >
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
      <List
        variant={List.variant.DEFAULT}
        {...rest}
      >
        {children}
      </List>
    );
  },
  pre: function Pre({ children, ...rest }: { children: T_ReactChildrenProp }): T_ReactElement {
    return (
      <Code
        variant={Code.variant.MULTILINE}
        {...rest}
      >
        {children}
      </Code>
    );
  },
  code: function InlineCode({
    children,
    ...rest
  }: {
    children: T_ReactChildrenProp;
  }): T_ReactElement {
    return (
      <Code
        variant={Code.variant.INLINE}
        {...rest}
      >
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
  ImageWithLink,
  Playground,
  SourceCode,
  TextWithEmoji,
  Timeline,

  // Pages components
  ...BlogComponents,
  ...MusicComponents,
  ...AboutMeComponents,
  ...ResumeComponents,
};

export const MDXScope = {
  DATA: {
    ROUTES,
    SERVER_URL: process.env.NEXT_PUBLIC_ASSETS_SERVER_URL,
  },
};
