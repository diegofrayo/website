import dotenv from "dotenv";
import fs from "fs";
import { Feed } from "feed";

import BLOG_POSTS from "../src/data/blog/posts.json";
import METADATA from "../src/data/metadata.json";
import PAGES_TEXTS from "../src/data/texts.json";

dotenv.config({ path: ".env" });

const { pages } = PAGES_TEXTS;
const { website: WEBSITE_METADATA, seo: SEO_METADATA } = METADATA;
const { posts } = BLOG_POSTS;
const URL_PRODUCTION = "https://diegofrayo.vercel.app";

const feed = new Feed({
  title: SEO_METADATA.title,
  description: pages["/"][pages["/"].config.default_locale].meta_description,
  id: WEBSITE_METADATA.username,
  link: URL_PRODUCTION,
  language: "es",
  image: `${URL_PRODUCTION}/static/images/favicon/favicon.ico`,
  favicon: `${URL_PRODUCTION}/static/images/favicon/android-chrome-512x512.png`,
  copyright: `All rights reserved ${new Date().getFullYear()}, ${WEBSITE_METADATA.shortName}`,
  feedLinks: {
    json: `${URL_PRODUCTION}/feed.json`,
    atom: `${URL_PRODUCTION}/atom.xml`,
    rss: `${URL_PRODUCTION}/rss.xml`,
  },
  author: {
    name: WEBSITE_METADATA.fullName,
    email: WEBSITE_METADATA.email,
    link: `${URL_PRODUCTION}/about-me`,
  },
});

generateFeed();

fs.writeFileSync("./public/rss.xml", feed.rss2());
fs.writeFileSync("./public/atom.xml", feed.atom1());
fs.writeFileSync("./public/feed.json", feed.json1());

console.log("RSS files created");

// --- Utils ---

function generateFeed() {
  Object.values(posts).forEach((post) => {
    if (post.config.is_published === false) return null;

    const url = `${URL_PRODUCTION}/blog/${post.slug}`;

    feed.addItem({
      title: post[post.default_locale].title,
      id: url,
      link: url,
      description: post[post.default_locale].description,
      content: post[post.default_locale].description,
      author: [
        {
          name: WEBSITE_METADATA.shortName,
          email: WEBSITE_METADATA.email,
          link: `${URL_PRODUCTION}/about-me`,
        },
      ],
      date: new Date(post.published_at),
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
}
