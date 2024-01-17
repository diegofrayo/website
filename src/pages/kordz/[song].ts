import type { GetStaticProps, GetStaticPaths } from "next";

import { compile } from "~/modules/mdx/server";
import type { T_SongPageProps } from "~/modules/pages/kordz/pages/SongPage";
import type { T_RawKordzResponse, T_RawSongResponse } from "~/modules/pages/kordz/types";
import { isChordsSong } from "~/modules/pages/kordz/utils";
import { loadData, loadPageContent } from "~/server/data-loader";
import { KordzService } from "@diegofrayo/kordz";
import v from "@diegofrayo/v";

export { default } from "~/modules/pages/kordz/pages/SongPage";

// --- NEXT.JS FUNCTIONS ---

export const getStaticPaths: GetStaticPaths = async function getStaticPaths() {
	const songs = await loadData<T_RawKordzResponse>({ page: "kordz", remote: true });

	return {
		paths: songs.map((song) => {
			return { params: { song: song.id } };
		}),
		fallback: "blocking",
	};
};

export const getStaticProps: GetStaticProps<T_SongPageProps, { song: string }> = async ({
	params,
}) => {
	const songId = params?.song || "";
	if (!songId) throw new Error(`Song not found: "${songId}"`);

	const cmsContent = await loadPageContent({ page: "kordz/songs" });
	const data = await loadData<T_RawSongResponse>({
		localPath: `kordz/songs/lyrics-and-chords/${songId}.json`,
	});

	const mdxCompiled = await compile({ content: data.mdx });
	const { parsedText, foundChords } = KordzService.parseMusicText(
		isChordsSong(data.details) ? KordzService.generateChordsPageContent() : data.txt,
	);

	return {
		props: {
			cmsContent,
			songDetails: {
				...data.details,
				chords: foundChords,
				parsedLyrics: parsedText,
				artist: v.isArray(data.details.artist)
					? data.details.artist.join(", ")
					: data.details.artist,
			},
			songContent: mdxCompiled.code,
		},
	};
};
