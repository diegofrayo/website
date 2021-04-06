import React, { useState, useEffect } from "react";
import fs from "fs";
import classnames from "classnames";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";

import { Page, MainLayout } from "~/components/layout";
import { Blockquote, Icon } from "~/components/primitive";
import { MDXContent } from "~/components/pages/_shared";
import { SongDetails, SongSources } from "~/components/pages/music";
import { useDidMount, useInternationalization } from "~/hooks";
import MusicService from "~/services/music";
import { TypeSong } from "~/types";
import { copyToClipboard, isBrowser } from "~/utils/browser";
import { WebsiteMetadata } from "~/utils/constants";
import { MDXComponentsConfig, MDXScope } from "~/utils/mdx";
import { Routes } from "~/utils/routing";

type TypeSongPageProps = {
  song: TypeSong;
  content: any;
};

function SongPage({ song, content }: TypeSongPageProps): any {
  const { SiteTexts } = useInternationalization({
    page: Routes.MUSIC,
    layout: true,
  });

  const [fontSize, setFontSize] = useState(0);

  const mdxContent = hydrate(content, { components: MDXComponentsConfig });

  useDidMount(() => {
    setFontSize(getFontSize());
  });

  useEffect(() => {
    window.localStorage.setItem("MUSIC_FONT_SIZE", `${fontSize}`);
  }, [fontSize]);

  function getFontSize(): number {
    const INITIAL_VALUE = 0.8;
    const fontSize = isBrowser()
      ? Number(window.localStorage.getItem("MUSIC_FONT_SIZE"))
      : INITIAL_VALUE;

    if (!fontSize || Number.isNaN(fontSize)) {
      return INITIAL_VALUE;
    }

    return fontSize;
  }

  return (
    <Page
      config={{
        title: song.title,
        pathname: `${Routes.MUSIC}/${song.id}`,
      }}
    >
      <MainLayout
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: Routes.HOME,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.music,
            url: Routes.MUSIC,
          },
          {
            text: song.title,
          },
        ]}
        title={song.title}
      >
        <SongDetails song={song} SiteTexts={SiteTexts} className="tw-mb-6" />
        <Blockquote
          className="tw-max-w-full tw-overflow-x-auto tw-mb-8 tw-relative tw-pt-16"
          style={{ fontSize: `${fontSize}rem` }}
        >
          <div className="tw-absolute tw-top-0 tw-left-0 tw-pl-4 tw-flex tw-items-start">
            <button
              className={classnames(
                "tw-inline-block tw-mr-2 dark:tw-rounded-md dark:dfr-bg-secondary dark:tw-p-1 tw-transition-opacity hover:tw-opacity-50 dark:hover:tw-opacity-75",
                fontSize === 2 && "tw-opacity-25 dark:tw-opacity-50",
              )}
              disabled={fontSize === 2}
              onClick={() => setFontSize(cv => Number((cv + 0.2).toFixed(1)))}
            >
              <Icon icon={Icon.icon.ZOOM_IN} className="tw-h-6 tw-w-6" />
            </button>
            <button
              className={classnames(
                "tw-inline-block tw-mr-2 dark:tw-rounded-md dark:dfr-bg-secondary dark:tw-p-1 tw-transition-opacity hover:tw-opacity-50 dark:hover:tw-opacity-75",
                fontSize === 0.6 && "tw-opacity-25 dark:tw-opacity-50",
              )}
              disabled={fontSize === 0.6}
              onClick={() => setFontSize(cv => Number((cv - 0.2).toFixed(1)))}
            >
              <Icon icon={Icon.icon.ZOOM_OUT} className="tw-h-6 tw-w-6" />
            </button>
            <button
              className="tw-inline-block tw-mr-2 dark:tw-rounded-md dark:dfr-bg-secondary dark:tw-p-1 tw-transition-opacity hover:tw-opacity-50 dark:hover:tw-opacity-75"
              data-clipboard-text={`${WebsiteMetadata.url}${Routes.MUSIC}/${song.id}`}
              onClick={copyToClipboard}
            >
              <Icon icon={Icon.icon.LINK} />
            </button>
          </div>

          <MDXContent content={mdxContent} variant={MDXContent.variant.UNSTYLED} />
        </Blockquote>
        <SongSources sources={song.sources} />
      </MainLayout>
    </Page>
  );
}

// TODO: Next types
export async function getStaticPaths(): Promise<Record<string, any>> {
  return {
    paths: (await MusicService.fetchSongsList()).reduce((result, song: TypeSong) => {
      return result.concat([{ params: { song: song.id } }]);
    }, [] as Array<any>),
    fallback: false,
  };
}

// TODO: Next types
export async function getStaticProps({
  params,
}: Record<string, any>): Promise<Record<string, any>> {
  const song: TypeSong | undefined = (await MusicService.fetchSongsList()).find(
    song => song.id === params.song,
  );

  const file = fs.readFileSync(`${process.cwd()}/src/data/music/songs/${song?.id}.mdx`, "utf8");
  const content = await renderToString(file, {
    components: MDXComponentsConfig,
    scope: { DATA: { ...MDXScope.DATA, song } },
  });

  return { props: { song, content } };
}

export default SongPage;
