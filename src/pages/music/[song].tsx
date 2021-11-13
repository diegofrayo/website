import * as React from "react";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";
import { GetStaticPaths } from "next";
import { useRouter } from "next/router";

import { Page, MainLayout } from "~/components/layout";
import { Icon, Button, Space, Block, Text } from "~/components/primitive";
import { MDXContent, Loader, RateContent } from "~/components/shared";
import { SongDetails, SongSources } from "~/components/pages/music/components";
import { useDidMount } from "~/hooks";
import { getPageContentStaticProps, useTranslation } from "~/i18n";
import { GuitarService } from "~/lib/guitar";
import { dataLoader } from "~/server";
import MusicService from "~/services/music";
import { T_ReactElement, T_Song } from "~/types";
import { copyToClipboard } from "~/utils/browser";
import { MDXComponents, MDXScope } from "~/utils/mdx";
import { ROUTES } from "~/utils/routing";

type T_PageProps = {
  song: T_Song;
  songMDXContent: string;
};

function SongPage(props: T_PageProps): T_ReactElement {
  const {
    // props
    song,

    // states
    fontSize,

    // handlers
    increaseFontSize,
    decreaseFontSize,

    // vars
    mdxContent,
    isMaxFontSize,
    isMinFontSize,
  } = useController(props);

  const router = useRouter();
  const { t } = useTranslation();

  if (router.isFallback) {
    return (
      <Block className="tw-p-4 tw-text-center">
        <Loader />
      </Block>
    );
  }

  return (
    <Page
      config={{
        title: MusicService.isChordsPage(song)
          ? song.title
          : t("seo:title", { title: song.title, artist: song.artist }),
        replaceTitle: !MusicService.isChordsPage(song),
        description: t("seo:description", { title: song.title, artist: song.artist }),
        pathname: `${ROUTES.MUSIC}/${song.id}`,
        disableSEO: song.isPublic === false,
      }}
    >
      <MainLayout title={song.title}>
        <SongDetails song={song} className="tw-mb-8" />

        <Block variant="FEATURED" className="tw-mb-8 " style={{ fontSize: `${fontSize}rem` }}>
          <Block className="tw-mb-6 tw-text-sm">
            <Button
              variant={Button.variant.SIMPLE}
              disabled={isMaxFontSize}
              onClick={increaseFontSize}
            >
              <Icon icon={Icon.icon.ZOOM_IN} size={24} />
            </Button>
            <Space size={1} orientation="v" />
            <Button
              variant={Button.variant.SIMPLE}
              disabled={isMinFontSize}
              onClick={decreaseFontSize}
            >
              <Icon icon={Icon.icon.ZOOM_OUT} size={24} />
            </Button>
            <Space size={1} orientation="v" />
            <Button
              variant={Button.variant.SIMPLE}
              onClick={(e) => copyToClipboard(e, window.location.href)}
            >
              <Icon icon={Icon.icon.LINK} size={24} />
            </Button>
          </Block>

          <Block className="tw-max-w-full tw-overflow-x-auto tw-pb-3">
            <MDXContent content={mdxContent} variant={MDXContent.variant.UNSTYLED} />
          </Block>
          <Space size={6} />

          <Block
            variant="FEATURED"
            className="tw-p-4 tw-border dfr-border-color-primary dark:dfr-border-color-primary tw-text-base"
          >
            <Text className="tw-font-bold tw-mb-2">
              {t("page:chords_title")} [{song.chords.length}]
            </Text>
            <pre
              className="tw-break-all tw-max-w-full tw-whitespace-normal"
              dangerouslySetInnerHTML={{
                __html: GuitarService.formatText(song.chords.join(" | ")),
              }}
            />
          </Block>
        </Block>

        <SongSources sources={song.sources} />
        <Space size={6} />

        <RateContent />
      </MainLayout>
    </Page>
  );
}

export default SongPage;

// --- Next.js functions ---

type T_StaticPath = { params: { song: string } };

export const getStaticPaths: GetStaticPaths<{ song: string }> = async function getStaticPaths() {
  return {
    paths: (await MusicService.fetchSongsList()).reduce((result: T_StaticPath[], song: T_Song) => {
      if (song.isPublic === false) return result;
      return result.concat([{ params: { song: song.id } }]);
    }, []),
    fallback: "blocking",
  };
};

export const getStaticProps = getPageContentStaticProps<T_PageProps, { song: string }>({
  page: [ROUTES.MUSIC, ROUTES.MUSIC_DETAILS],
  locale: "es",
  callback: async ({ params }) => {
    const song = await MusicService.getSong({ id: params?.song });
    const file = await dataLoader({ path: `/pages/music/[song]/assets/${song.id}.mdx` });

    const songMDXContent = await renderToString(file, {
      components: MDXComponents,
      scope: {
        DATA: {
          ...MDXScope.DATA,
          song: {
            ...song,
            content: await dataLoader({ path: `/pages/music/[song]/assets/${song.id}.txt` }),
          },
        },
      },
    });

    return {
      props: {
        song,
        songMDXContent,
      },
      revalidate: 60,
    };
  },
});

// --- Controller ---

function useController({ songMDXContent, song }: T_PageProps): Pick<T_PageProps, "song"> & {
  fontSize: number;
  mdxContent: string;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  isMaxFontSize: boolean;
  isMinFontSize: boolean;
} {
  const [fontSize, setFontSize] = React.useState(0);

  const mdxContent = hydrate(songMDXContent, { components: MDXComponents }) as string;

  useDidMount(() => {
    setFontSize(getFontSize());
    document.documentElement.lang = "es";
  });

  React.useEffect(
    function updateFontSizeOnLocalStorage() {
      window.localStorage.setItem("DFR_MUSIC_FONT_SIZE", `${fontSize}`);
    },
    [fontSize],
  );

  function getFontSize(): number {
    const INITIAL_VALUE = 0.8;
    const fontSize = Number(window.localStorage.getItem("DFR_MUSIC_FONT_SIZE"));

    if (!fontSize || Number.isNaN(fontSize)) {
      return INITIAL_VALUE;
    }

    return fontSize;
  }

  function increaseFontSize(): void {
    setFontSize((cv) => Number((cv + 0.2).toFixed(1)));
  }

  function decreaseFontSize(): void {
    setFontSize((cv) => Number((cv - 0.2).toFixed(1)));
  }

  return {
    // props
    song,

    // states
    fontSize,

    // handlers
    increaseFontSize,
    decreaseFontSize,

    // vars
    mdxContent,
    isMaxFontSize: fontSize === 2,
    isMinFontSize: fontSize === 0.6,
  };
}
