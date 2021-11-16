import renderToString from "next-mdx-remote/render-to-string";
import { GetStaticPaths } from "next";

import SongPage from "~/components/pages/music/[song]";
import { getPageContentStaticProps } from "~/i18n";
import { dataLoader } from "~/server";
import MusicService from "~/services/music";
import { T_Song } from "~/types";
import { MDXComponents, MDXScope } from "~/utils/mdx";
import { ROUTES } from "~/utils/routing";

type T_PageProps = {
  song: T_Song;
  songMDXContent: string;
};

export default SongPage;

// --- Next.js functions ---

type T_StaticPath = { params: { song: string } };

export const getStaticPaths: GetStaticPaths<{ song: string }> = async function getStaticPaths() {
  return {
    paths: (await MusicService.fetchSongsList()).reduce((result: T_StaticPath[], song: T_Song) => {
      if (!song.isPublic) return result;
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
