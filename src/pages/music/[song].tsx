import { GetStaticPaths } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

import SongPage from "~/components/pages/music/[song]";
import { getPageContentStaticProps } from "~/i18n";
import http from "~/lib/http";
import { dataLoader } from "~/server";
import MusicService from "~/services/music";
import type { T_Song } from "~/types";
import { MDXScope } from "~/utils/mdx";
import { isDevelopmentEnvironment } from "~/utils/misc";
import { ROUTES } from "~/utils/routing";

type T_PageProps = {
  song: T_Song;
  songMDXContent: MDXRemoteSerializeResult;
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
  callback: async ({ params }) => {
    const song = await MusicService.getSong({ id: params?.song });
    const file = (await dataLoader({
      path: `/pages/music/[song]/assets/${song.id}.mdx`,
    })) as string;

    const songMDXContent = await serialize(file, {
      scope: {
        DATA: {
          ...MDXScope.DATA,
          song: {
            ...song,
            content: isDevelopmentEnvironment()
              ? await dataLoader({ path: `/pages/music/[song]/assets/${song.id}.txt` })
              : song.assets.serverUrl
              ? (
                  await http.get(song.assets.serverUrl)
                ).data
              : await dataLoader({ path: `/pages/music/[song]/assets/${song.id}.txt` }),
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
