import { readFile, writeFile } from "../../../src/lib/@diegofrayo/utils/files";
import { replaceAll } from "../../../src/lib/@diegofrayo/utils/strings";
import type { T_RawBlogPostsResponse } from "../../../src/modules/pages/blog/types";
import type { T_RawKordzResponse } from "../../../src/modules/pages/kordz/types";
import WEBSITE_METADATA from "../../../src/data/metadata.json";

async function main() {
	const BLOG_POSTS = JSON.parse(
		await readFile("./src/data/blog/data.json"),
	) as T_RawBlogPostsResponse;
	const KORDZ_SONGS = JSON.parse(
		await readFile("./src/data/_local_/kordz/data.json"),
	) as T_RawKordzResponse;
	const WEBSITE_PAGES = {
		HOME: "/",
		RESUME: "/resume",
		BLOG: "/blog",
		KORDZ: "/kordz",
	};
	const sitemapItems = Object.values(WEBSITE_PAGES)
		.concat(
			Object.values(BLOG_POSTS)
				.map((post) => {
					return post.is_published ? `/blog/${post.slug}` : "";
				})
				.filter(Boolean),
		)
		.concat(
			Object.values(KORDZ_SONGS)
				.map((song) => {
					return song.is_public ? `/kordz/${song.id}` : "";
				})
				.filter(Boolean),
		);

	await generateSitemapFile(sitemapItems, WEBSITE_METADATA.url);

	console.log(`"sitemap" script executed successfully`);
}

main();

// --- UTILS ---

function generateSitemapFile(sitemapItems: string[], websiteUrl: string) {
	const output = replaceAll(
		`
      <?xml version="1.0" encoding="UTF-8" ?>
      <urlset
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd"
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      >
      ${sitemapItems
				.map((path) => {
					return `
              <url>
                <loc>${websiteUrl}${path}</loc>
              </url>
          `;
				})
				.join("\n")}
      </urlset>
    `,
		" ".repeat(6),
		"",
	)
		.split("\n")
		.filter((line) => line.trim() !== "")
		.join("\n");

	writeFile("./public/sitemap.xml", output);
}
