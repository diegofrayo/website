import dotenv from "dotenv";
import fs from "fs";
import axios from "axios";
import { Feed } from "feed";

dotenv.config({ path: ".env" });

async function main() {
  const { data: BLOG } = await axios.get(
    `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/pages/blog/data.json`,
  );
  const {
    data: { seo: SEO_METADATA, website: WEBSITE_METADATA },
  } = await axios.get(`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/metadata.json`);

  const DEFAULT_LOCALE = "es";
  await generateFeed(SEO_METADATA[DEFAULT_LOCALE], WEBSITE_METADATA, BLOG, DEFAULT_LOCALE);

  console.log("RSS files created");
}

main();

// --- Utils ---

async function generateFeed(SEO_METADATA, WEBSITE_METADATA, BLOG, DEFAULT_LOCALE) {
  const feed = new Feed({
    title: SEO_METADATA.title,
    description: SEO_METADATA.description,
    id: WEBSITE_METADATA.username,
    link: WEBSITE_METADATA.url,
    language: DEFAULT_LOCALE,
    image: `${WEBSITE_METADATA.url}/static/images/favicon/favicon.ico`,
    favicon: `${WEBSITE_METADATA.url}/static/images/favicon/android-chrome-512x512.png`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${WEBSITE_METADATA.shortName}`,
    feedLinks: {
      json: `${WEBSITE_METADATA.url}/feed.json`,
      atom: `${WEBSITE_METADATA.url}/atom.xml`,
      rss: `${WEBSITE_METADATA.url}/rss.xml`,
    },
    author: {
      name: WEBSITE_METADATA.fullName,
      email: WEBSITE_METADATA.email,
      link: `${WEBSITE_METADATA.url}/about-me`,
    },
  });

  Object.values(BLOG.posts).forEach((post) => {
    if (post.config.is_published === false) return null;

    const url = `${WEBSITE_METADATA.url}/blog/${post.config.slug}`;

    feed.addItem({
      title: post[DEFAULT_LOCALE].title,
      id: url,
      link: url,
      description: post[DEFAULT_LOCALE].description,
      content: post[DEFAULT_LOCALE].description,
      author: [
        {
          name: WEBSITE_METADATA.shortName,
          email: WEBSITE_METADATA.email,
          link: `${WEBSITE_METADATA.url}/about-me`,
        },
      ],
      date: new Date(post.config.updated_at),
    });
  });

  [
    "Blog",
    "JAMStack",
    "Next.js",
    "Programming",
    "React",
    "Software Development",
    "Tech",
    "TypeScript",
  ].forEach(feed.addCategory);

  fs.writeFileSync("./public/rss.xml", feed.rss2());
  fs.writeFileSync("./public/atom.xml", feed.atom1());
  fs.writeFileSync("./public/feed.json", feed.json1());
}