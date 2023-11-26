import { GetStaticPaths } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

import SongPage from "~/features/pages/music/[song]";
import MusicService, { T_Song } from "~/features/pages/music/service";
import getPageContentStaticProps from "~/features/i18n/server";
import { getMDXScope } from "~/features/mdx";
import { ROUTES } from "~/features/routing";
import { GuitarService } from "~/lib/guitar";
import v from "~/lib/v";
import { dataFileLoader } from "~/server";

type T_PageProps = {
	song: T_Song;
	songMDXContent: MDXRemoteSerializeResult;
};

export default SongPage;

// --- NEXT.JS FUNCTIONS ---

type T_StaticPath = { song: string };

export const getStaticPaths: GetStaticPaths<T_StaticPath> = async function getStaticPaths() {
	return {
		paths: (await MusicService.fetchSongs(await dataFileLoader("music/data.json"))).reduce(
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
		const song = await MusicService.getSong(await dataFileLoader("music/data.json"), {
			id: params.song,
		});

		if (v.notFound(song)) {
			return {
				notFound: true,
			};
		}

		const songContent = (await dataFileLoader(`/music/[song]/json/${song.id}.json`)) as {
			txt: string;
			mdx: string;
		};

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
				song: { ...song, chords: foundChords },
				songMDXContent,
			},
		};
	},
});
