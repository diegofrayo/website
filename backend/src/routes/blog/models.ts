import { z } from "zod";

const RawBlogResponseSchema = z.object({
	categories: z.array(z.object({ id: z.string(), value: z.string(), color: z.string() })),
	posts: z.record(
		z.object({
			config: z.object({
				slug: z.string(),
				categories: z.array(z.string()),
				locales: z.array(z.string()),
				created_at: z.string(),
				published_at: z.string(),
				updated_at: z.string(),
				is_published: z.boolean(),
				sources: z.array(
					z.object({
						title: z.string(),
						url: z.string(),
					}),
				),
			}),
			en: z.object({ title: z.string(), description: z.string() }),
			assets: z.object({}),
		}),
	),
});

export type T_RawBlogResponse = z.infer<typeof RawBlogResponseSchema>;
