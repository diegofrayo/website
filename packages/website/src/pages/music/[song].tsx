import React, { useState, useEffect } from "react";
import fs from "fs";
import classnames from "classnames";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";

import { Page, MainLayout } from "~/components/layout";
import { SongInfo, SongSources } from "~/components/mdx/blog-posts/music";
import { MDXContent } from "~/components/shared";
import Metadata from "~/data/metadata.json";
import Routes from "~/data/routes.json";
import { useDidMount, useInternationalization } from "~/hooks";
import SongsService from "~/services/music";
import { TypeSong, TypePagesRoutes } from "~/types";
import { copyToClipboard, isBrowser } from "~/utils/browser";
import { MDXComponentsConfig, MDXScope } from "~/utils/mdx";

type TypeSongPageProps = {
  song: TypeSong;
  content: any;
};

function SongPage({ song, content }: TypeSongPageProps): any {
  const { SiteTexts } = useInternationalization({
    page: Routes.MUSIC as TypePagesRoutes,
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
            url: Routes.HOME as TypePagesRoutes,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.music,
            url: Routes.MUSIC as TypePagesRoutes,
          },
          {
            text: song.title,
          },
        ]}
        title={song.title}
      >
        <SongInfo song={song} SiteTexts={SiteTexts} className="tw-mb-6" />
        <div
          className="dfr-border-color-primary dark:dfr-border-color-primary tw-border-l-4 tw-pl-4 tw-max-w-full tw-overflow-x-auto tw-mb-8 tw-relative tw-pt-10"
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
              <img
                src="/static/images/icons/zoom-in.svg"
                className="tw-h-6 tw-w-6"
                alt="Zoom in icon"
              />
            </button>
            <button
              className={classnames(
                "tw-inline-block tw-mr-2 dark:tw-rounded-md dark:dfr-bg-secondary dark:tw-p-1 tw-transition-opacity hover:tw-opacity-50 dark:hover:tw-opacity-75",
                fontSize === 0.6 && "tw-opacity-25 dark:tw-opacity-50",
              )}
              disabled={fontSize === 0.6}
              onClick={() => setFontSize(cv => Number((cv - 0.2).toFixed(1)))}
            >
              <img
                src="/static/images/icons/zoom-out.svg"
                className="tw-h-6 tw-w-6"
                alt="Zoom out icon"
              />
            </button>
            <button
              className="tw-inline-block tw-mr-2 dark:tw-rounded-md dark:dfr-bg-secondary dark:tw-p-1 tw-transition-opacity hover:tw-opacity-50 dark:hover:tw-opacity-75"
              data-clipboard-text={`${Metadata.WEBSITE_METADATA.url}${Routes.MUSIC}/${song.id}`}
              onClick={e => {
                copyToClipboard(e);
              }}
            >
              <img
                src="/static/images/icons/link.svg"
                width="21"
                className="tw-h-6 dark:tw-w-6 tw-transform tw-rotate-45"
                alt="Link icon"
              />
            </button>
          </div>

          <MDXContent content={mdxContent} variant={MDXContent.variant.UNSTYLED} />
        </div>
        <SongSources sources={song.sources} />
      </MainLayout>
    </Page>
  );
}

// TODO: Next types
export async function getStaticPaths(): Promise<Record<string, any>> {
  return {
    paths: (await SongsService.fetchSongsList()).reduce((result, song: TypeSong) => {
      return result.concat([{ params: { song: song.id } }]);
    }, [] as Array<any>),
    fallback: false,
  };
}

// TODO: Next types
export async function getStaticProps({
  params,
}: Record<string, any>): Promise<Record<string, any>> {
  const song: TypeSong | undefined = (await SongsService.fetchSongsList()).find(
    song => song.id === params.song,
  );

  const file = fs.readFileSync(`${process.cwd()}/src/data/music/songs/${song?.id}.mdx`, "utf8");
  const content = await renderToString(file, {
    components: MDXComponentsConfig,
    scope: { DATA: { ...MDXScope.DATA } },
  });

  return { props: { song, content } };
}

export default SongPage;
