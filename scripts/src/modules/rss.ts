import { Feed } from "feed";
import { writeFile } from "../../../src/lib/@diegofrayo/utils/files";
import BLOG_POSTS from "../../../src/data/blog/data.json";
import WEBSITE_METADATA from "../../../src/data/metadata.json";

async function main() {
	await generateRSSFiles();

	console.log(`"rss" script executed successfully`);
}

main();

// --- UTILS ---

async function generateRSSFiles() {
	const DEFAULT_LOCALE = "en";
	const feed = new Feed({
		title: WEBSITE_METADATA.title,
		description: WEBSITE_METADATA.description,
		id: WEBSITE_METADATA.username,
		link: WEBSITE_METADATA.url,
		language: DEFAULT_LOCALE,
		image: `${WEBSITE_METADATA.url}/assets/images/favicon/favicon.ico`,
		favicon: `${WEBSITE_METADATA.url}/assets/images/favicon/android-chrome-512x512.png`,
		copyright: `All rights reserved ${new Date().getFullYear()}, ${WEBSITE_METADATA.shortName}`,
		feedLinks: {
			json: `${WEBSITE_METADATA.url}/feed.json`,
			atom: `${WEBSITE_METADATA.url}/atom.xml`,
			rss: `${WEBSITE_METADATA.url}/rss.xml`,
		},
		author: {
			name: WEBSITE_METADATA.fullName,
			email: WEBSITE_METADATA.email,
			link: WEBSITE_METADATA.url,
		},
	});

	Object.values(BLOG_POSTS).forEach((post) => {
		const postContent = post.content[DEFAULT_LOCALE];
		const postUrl = `${WEBSITE_METADATA.url}/blog/${post.slug}`;

		if (post.is_published) {
			feed.addItem({
				title: postContent.title,
				id: postUrl,
				link: postUrl,
				description: postContent.description,
				content: postContent.description,
				author: [
					{
						name: WEBSITE_METADATA.shortName,
						email: WEBSITE_METADATA.email,
						link: WEBSITE_METADATA.url,
					},
				],
				date: new Date(post.updated_at),
			});
		}
	});

	[
		"Blog",
		"JAMStack",
		"MDX",
		"Next.js",
		"Programming",
		"React",
		"Software Development",
		"Tech",
		"TypeScript",
	].forEach(feed.addCategory);

	writeFile("./public/rss.xml", feed.rss2());
	writeFile("./public/atom.xml", feed.atom1());
	writeFile("./public/feed.json", feed.json1());
}
