import { GetStaticPaths } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

import SongPage from "~/features/pages/music/[song]";
import MusicService, { T_Song } from "~/features/pages/music/service";
import { getPageContentStaticProps } from "~/features/i18n";
import { GuitarService } from "~/lib/guitar";
import http from "~/lib/http";
import dataLoader from "~/server";
import { isDevelopmentEnvironment } from "~/utils/app";
import { getMDXScope } from "~/features/mdx";
import { ROUTES } from "~/features/routing";
import { notFound } from "~/utils/validations";

type T_PageProps = {
	song: T_Song;
	songMDXContent: MDXRemoteSerializeResult;
};

export default SongPage;

// --- Next.js functions ---

type T_StaticPath = { song: string };

export const getStaticPaths: GetStaticPaths<T_StaticPath> = async function getStaticPaths() {
	return {
		paths: (await MusicService.fetchSongs()).reduce(
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

		if (notFound(song)) {
			return {
				notFound: true,
			};
		}

		let songContent;
		if (isDevelopmentEnvironment()) {
			songContent = await dataLoader({ path: `/pages/music/[song]/assets/${song.id}.json` });
		} else {
			songContent = (await http.get(song.assets.serverUrl)).data;
		}

		const { parsedText, foundChords } = GuitarService.parseMusicText(songContent.txt);
		const songMDXContent = await serialize(songContent.mdx, {
			scope: {
				DATA: {
					...getMDXScope().DATA,
					song: {
						...song,
						parsedLyrics: parsedText,
						chords: foundChords,
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
