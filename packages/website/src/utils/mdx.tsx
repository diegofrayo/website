import React from "react";

import {
  Collapsible,
  Image,
  Link,
  Space,
  List,
  Blockquote,
  Code as CodePrimitive,
} from "~/components/primitive";
import { Code, Title, TextWithEmoji, GithubRepo } from "~/components/pages/_shared";
import { Main, Texts, Measure } from "~/components/pages/blog/html-semantic-tags";
import { HelloWorldMDX, SpotifyPlaylist } from "~/components/pages/blog/my-favorite-music-and-mdx";
import { SongDetails, LyricsAndChords, Solo } from "~/components/pages/music";
import { ResumeTimeline } from "~/components/pages/resume";
import { WebsiteMetadata, GithubData } from "~/utils/constants";
import { Routes } from "~/utils/routing";

import { getSiteTexts } from "./internationalization";

export const MDXComponentsConfig = {
  a: Link,
  blockquote: Blockquote,
  h1: Title("h1"),
  h2: Title("h2"),
  h3: Title("h3"),
  h4: Title("h4"),
  img: Image,
  ul: List,
  pre: CodePrimitive,
  inlineCode: function InlineCode({ children, ...rest }) {
    return (
      <CodePrimitive variant={CodePrimitive.variant.INLINE} {...rest}>
        {children}
      </CodePrimitive>
    );
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
  ResumeTimeline,
  Solo,
  SongDetails,
  SpotifyPlaylist,
  TextWithEmoji,
  Texts,
};

export const MDXScope = {
  DATA: {
    github: GithubData,
    website: WebsiteMetadata,
    routes: Routes,
    resume: getSiteTexts({ page: Routes.RESUME }).page.current_locale,
  },
};
