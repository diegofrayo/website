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
import { Main, Texts, Measure } from "~/components/pages/blog/components/html-semantic-tags";
import {
  HelloWorldMDX,
  SpotifyPlaylist,
} from "~/components/pages/blog/components/my-favorite-music-and-mdx";
import { SongDetails, LyricsAndChords, Solo } from "~/components/pages/music";
import { ResumeTimeline } from "~/components/pages/resume";
import { TableOfContent, Snippets } from "~/components/pages/snippets";
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

  Code,
  Collapsible,
  Image,
  Link,
  List,
  Space,

  GithubRepo,
  HelloWorldMDX,
  LyricsAndChords,
  Main,
  Measure,
  Playground,
  ResumeTimeline,
  Snippets,
  Solo,
  SongDetails,
  SpotifyPlaylist,
  TableOfContent,
  TextWithEmoji,
  Texts,
};

export const MDXScope = {
  DATA: {
    GITHUB_DATA,
    WEBSITE_METADATA,
    ROUTES,
  },
};
