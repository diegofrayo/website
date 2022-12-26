import { z } from "zod";

const RawReadingsResponseSchema = z.object({
	category_colors: z.array(z.string()),
	readings: z.record(
		z.object({
			title: z.string(),
			url: z.string(),
			author: z.string(),
			date: z.string(),
			starred: z.boolean(),
		}),
	),
});

export type T_RawReadingsResponse = z.infer<typeof RawReadingsResponseSchema>;
