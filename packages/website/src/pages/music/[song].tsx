import React, { useState, useEffect } from "react";
import classNames from "classnames";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";
import { GetStaticPaths } from "next";

import { Page, MainLayout } from "~/components/layout";
import { Blockquote, Icon, Button } from "~/components/primitive";
import { MDXContent } from "~/components/pages/_shared";
import { SongDetails, SongSources } from "~/components/pages/music";
import { useDidMount, useTranslation } from "~/hooks";
import MusicService from "~/services/music";
import { T_ReactElement, T_Song } from "~/types";
import { copyToClipboard, isBrowser } from "~/utils/browser";
import { WEBSITE_METADATA } from "~/utils/constants";
import { MDXComponents, MDXScope } from "~/utils/mdx";
import { ROUTES } from "~/utils/routing";
import { getPageContentStaticProps } from "~/server/i18n";
import { loader } from "~/server/loader";

type T_PageProps = {
  song: T_Song;
  songMDXContent: string;
};

function SongPage({ song, songMDXContent }: T_PageProps): T_ReactElement {
  const { t } = useTranslation({
    page: true,
    layout: true,
  });

  const [fontSize, setFontSize] = useState(0);

  const mdxContent = hydrate(songMDXContent, { components: MDXComponents });

  useDidMount(() => {
    setFontSize(getFontSize());
  });

  useEffect(
    function updateFontSizeOnLocalStorage() {
      window.localStorage.setItem("MUSIC_FONT_SIZE", `${fontSize}`);
    },
    [fontSize],
  );

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
        description: t("seo:description"),
        pathname: `${ROUTES.MUSIC}/${song.id}`,
        disableSEO: Boolean(t("page:config:is_seo_disabled")),
      }}
    >
      <MainLayout
        breadcumb={[
          {
            text: t("layout:breadcumb:home"),
            url: ROUTES.HOME,
          },
          {
            text: t("layout:breadcumb:music"),
            url: ROUTES.MUSIC,
          },
          {
            text: song.title,
          },
        ]}
        title={`🎼 ${song.title}`}
        showGoToTopButton
      >
        <SongDetails song={song} className="tw-mb-8" />

        <Blockquote
          className="tw-mb-8"
          style={{ fontSize: `${fontSize}rem` }}
          variant={Blockquote.variant.UNSTYLED}
        >
          <div className="tw-mb-6 tw-text-sm">
            <Button
              className={classNames(
                "tw-inline-block tw-mr-3",
                fontSize === 2 && "tw-opacity-25 dark:tw-opacity-50",
              )}
              disabled={fontSize === 2}
              onClick={() => setFontSize((cv) => Number((cv + 0.2).toFixed(1)))}
            >
              <Icon icon={Icon.icon.ZOOM_IN} size={24} />
            </Button>
            <Button
              className={classNames(
                "tw-inline-block tw-mr-3",
                fontSize === 0.6 && "tw-opacity-25 dark:tw-opacity-50",
              )}
              disabled={fontSize === 0.6}
              onClick={() => setFontSize((cv) => Number((cv - 0.2).toFixed(1)))}
            >
              <Icon icon={Icon.icon.ZOOM_OUT} size={24} />
            </Button>
            <Button
              className="tw-inline-block tw-mr-3"
              data-clipboard-text={`${WEBSITE_METADATA.url}${ROUTES.MUSIC}/${song.id}`}
              onClick={copyToClipboard}
            >
              <Icon icon={Icon.icon.LINK} size={24} />
            </Button>
          </div>

          <div className="tw-max-w-full tw-overflow-x-auto">
            <MDXContent content={mdxContent} variant={MDXContent.variant.UNSTYLED} />
          </div>
        </Blockquote>

        <SongSources sources={song.sources} />
      </MainLayout>
    </Page>
  );
}

export default SongPage;

// --- Next.js functions ---

type T_Path = { params: { song: string } };

export const getStaticPaths: GetStaticPaths<{ song: string }> = async function getStaticPaths() {
  return {
    paths: (await MusicService.fetchSongsList()).reduce((result: T_Path[], song: T_Song) => {
      return result.concat([{ params: { song: song.id } }]);
    }, []),
    fallback: false,
  };
};

export const getStaticProps = getPageContentStaticProps<T_PageProps, { song: string }>({
  page: ROUTES.MUSIC,
  callback: async ({ params }) => {
    const song = await MusicService.getSong({ id: params?.song });
    const file = await loader({ path: `/pages/music/[song]/${song.id}.mdx` });
    const songMDXContent = await renderToString(file, {
      components: MDXComponents,
      scope: {
        DATA: {
          ...MDXScope.DATA,
          song: {
            ...song,
            content: await loader({ path: `/pages/music/[song]/${song.id}.txt` }),
          },
        },
      },
    });

    return {
      props: {
        song,
        songMDXContent,
      },
    };
  },
});
