import { GetStaticPaths } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

import SongPage from "~/components/pages/music/[song]";
import { getPageContentStaticProps } from "~/i18n";
import http from "~/lib/http";
import { dataLoader } from "~/server";
import MusicService, { T_Song } from "~/services/music";
import { isDevelopmentEnvironment } from "~/utils/app";
import { MDXScope } from "~/utils/mdx";
import { ROUTES } from "~/utils/routing";
import { isEmptyStringOrNotDefined } from "~/utils/validations";

type T_PageProps = {
  song: T_Song;
  songMDXContent: MDXRemoteSerializeResult;
};

export default SongPage;

// --- Next.js functions ---

type T_StaticPath = { song: string };

export const getStaticPaths: GetStaticPaths<T_StaticPath> = async function getStaticPaths() {
  return {
    paths: (await MusicService.fetchSongsList()).reduce(
      (result: { params: T_StaticPath }[], song: T_Song) => {
        if (song.isPublic) {
          return result.concat([{ params: { song: song.id } }]);
        }

        return result;
      },
      [],
    ),
    fallback: "blocking",
  };
};

export const getStaticProps = getPageContentStaticProps<T_PageProps, T_StaticPath>({
  page: [ROUTES.MUSIC, ROUTES.MUSIC_DETAILS],
  callback: async ({ params }) => {
    const song = await MusicService.getSong({ id: params.song });
    const file = (await dataLoader({
      path: `/pages/music/[song]/assets/${song.id}.mdx`,
    })) as string;

    let content;
    if (isDevelopmentEnvironment() || isEmptyStringOrNotDefined(song.assets?.serverUrl)) {
      content = await dataLoader({ path: `/pages/music/[song]/assets/${song.id}.txt` });
    } else {
      content = (await http.get(song.assets?.serverUrl || "")).data;
    }

    const songMDXContent = await serialize(file, {
      scope: {
        DATA: {
          ...MDXScope.DATA,
          song: {
            ...song,
            content,
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
