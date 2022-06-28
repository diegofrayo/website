import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env" });

async function main() {
	try {
		const { data: BLOG } = await axios.post(
			`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`,
			{
				path: "/data",
				model: "blog",
			},
		);
		const {
			data: { website: WEBSITE_METADATA },
		} = await axios.get(`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/metadata.json`);

		const pages = [
			{ path: "/", hasToBeIndexed: true },
			{ path: "/about-me", hasToBeIndexed: true },
			{ path: "/resume", hasToBeIndexed: true },
			{ path: "/blog", hasToBeIndexed: true },
		].concat(
			Object.values(BLOG.posts).map((post) => {
				return {
					path: `/blog/${post.config.slug}`,
					hasToBeIndexed: post.config.is_published,
				};
			}),
		);

		generateSitemapFile(pages, WEBSITE_METADATA.url);
		console.log("Sitemap script executed successfully");
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
}

main();

// --- Utils ---

function generateSitemapFile(pages, websiteUrl) {
	let output = `<?xml version="1.0" encoding="utf-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
	pages
		.filter((page) => page.hasToBeIndexed)
		.forEach((page) => {
			output += `
  <url>
    <loc>${websiteUrl}${page.path}</loc>
  </url>`;
		});
	output += "\n</urlset>";

	fs.writeFileSync("./public/sitemap.xml", output);
}
