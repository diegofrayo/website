/* eslint @typescript-eslint/dot-notation: 0 */

import { readFile, writeFile } from "../../../src/lib/@diegofrayo/utils/files";
import { replaceAll } from "../../../src/lib/@diegofrayo/utils/strings";
import type { T_RawBlogPostsResponse } from "../../../src/modules/pages/blog/types";

async function main() {
	const BLOG_POSTS = JSON.parse(
		await readFile("./src/data/blog/data.json"),
	) as T_RawBlogPostsResponse;
	const WEBSITE_METADATA = JSON.parse(await readFile("./src/data/metadata.json"));
	const WEBSITE_PAGES = {
		HOME: "/",
		RESUME: "/resume",
		BLOG: "/blog",
	};
	const sitemapItems = Object.values(WEBSITE_PAGES).concat(
		Object.values(BLOG_POSTS)
			.map((post) => {
				return post.is_published ? `/blog/${post.slug}` : "";
			})
			.filter(Boolean),
	);

	await generateSitemapFile(sitemapItems, WEBSITE_METADATA["url"]);

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
