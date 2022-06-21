import * as React from "react";

import {
  Block,
  Code,
  Collapsible,
  Icon,
  Image,
  Link,
  List,
  Space,
  Text,
} from "~/components/primitive";
import { ImageWithLink, Playground, SourceCode, Timeline, TitleCreator } from "~/components/shared";
import * as BlogComponents from "~/components/pages/blog/components";
import * as MusicComponents from "~/components/pages/music/components";
import AboutMeBlock from "~/components/pages/about-me/components";
import * as ResumeComponents from "~/components/pages/resume";
import { ROUTES } from "~/utils/routing";
import type { T_ReactChildren, T_ReactElement } from "~/types";

import { ENV_VARS } from "./constants";

/* WARN:
 * I don't know how to type this object, so, I used any for this
 * It is not important to solve this
 */
// @ts-ignore
export const MDXComponents = {
  a: function A({ children, href }: { children: T_ReactChildren; href: string }): T_ReactElement {
    return (
      <Link
        href={href}
        variant={Link.variant.PRIMARY}
        isExternalLink
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
  ul: function UL({ children }: { children: T_ReactChildren }): T_ReactElement {
    return <List variant={List.variant.DEFAULT}>{children}</List>;
  },
  pre: function Pre({ children }: { children: T_ReactChildren }): T_ReactElement {
    return <Code variant={Code.variant.MULTILINE}>{children}</Code>;
  },
  code: function InlineCode({ children }: { children: T_ReactChildren }): T_ReactElement {
    return <Code variant={Code.variant.INLINE}>{children}</Code>;
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
  Text,

  // Shared components
  ImageWithLink,
  Playground,
  SourceCode,
  Timeline,

  // Pages components
  ...BlogComponents,
  ...MusicComponents,
  ...ResumeComponents,
  AboutMeBlock,
} as any; // eslint-disable-line @typescript-eslint/no-explicit-any

export const MDXScope = {
  DATA: {
    ROUTES,
    SERVER_URL: ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL,
  },
} as const;
