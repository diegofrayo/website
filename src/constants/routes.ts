export const Routes = {
	INDEX: "/",
	BLOG: "/blog",
	BLOG_POST: (slug: string) => `/blog/${slug}`,
	RESUME: "/resume",
	PROJECTS: "/projects",
} as const;
