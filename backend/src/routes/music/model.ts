import { z } from "zod";

const RawMusicResponseSchema = z.object({
	songs: z.array(
		z.object({
			id: z.string(),
			title: z.string(),
			artist: z.string(),
			album: z.string(),
			year: z.number(),
			country: z.string(),
			category: z.string(),
			order: z.number(),
			created_at: z.string(),
			is_public: z.boolean(),
			spotify_url: z.string(),
			youtube_url: z.string(),
			assets: z.object({ server_url: z.string() }),
			sources: z.array(z.object({ text: z.string(), url: z.string(), source: z.string() })),
		}),
	),
	chords: z.record(
		z.union([
			z.array(z.object({ music_notes: z.string(), touched_strings: z.string() })),
			z.object({
				music_notes: z.string(),
				touched_strings: z.string(),
			}),
		]),
	),
});

export type T_RawMusicResponse = z.infer<typeof RawMusicResponseSchema>;

export type T_RawMusicSongResponse = z.infer<typeof RawMusicResponseSchema.shape.songs.element>;
