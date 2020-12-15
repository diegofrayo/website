require("dotenv").config({ path: ".env" });
const Feed = require("feed").Feed;

const { WEBSITE_METADATA, SEO_METADATA } = require("../src/data/metadata");
const { posts } = require("../src/data/blog/posts.json");

const feed = new Feed({
  title: SEO_METADATA.title,
  description: SEO_METADATA.description,
  id: WEBSITE_METADATA.username,
  link: WEBSITE_METADATA.urlProd,
  language: "en",
  image: `${WEBSITE_METADATA.urlProd}/static/images/favicon/favicon.ico`,
  favicon: `${WEBSITE_METADATA.urlProd}/static/images/favicon/android-chrome-512x512.png`,
  copyright: `All rights reserved 2020, ${WEBSITE_METADATA.shortName}`,
  feedLinks: {
    json: `${WEBSITE_METADATA.urlProd}/feed.json`,
    atom: `${WEBSITE_METADATA.urlProd}/atom.xml`,
    rss: `${WEBSITE_METADATA.urlProd}/rss.xml`,
  },
  author: {
    name: WEBSITE_METADATA.fullName,
    email: WEBSITE_METADATA.email,
    link: WEBSITE_METADATA.urlProd,
  },
});

Object.values(posts).forEach(post => {
  if (post.is_published === false) return null;

  const url = `${WEBSITE_METADATA.urlProd}/blog/${post.slug}`;

  feed.addItem({
    title: post.en.title,
    id: url,
    link: url,
    description: post.description,
    content: post.description,
    author: [
      {
        name: WEBSITE_METADATA.shortName,
        email: WEBSITE_METADATA.email,
        link: `${WEBSITE_METADATA.urlProd}/about-me`,
      },
    ],
    date: new Date(post.published_at),
  });
});

["Tech", "Programming", "Software Development", "React", "Next.js", "Blog"].forEach(
  feed.addCategory,
);

fs = require("fs");
fs.writeFileSync("./public/rss.xml", feed.rss2());
fs.writeFileSync("./public/atom.xml", feed.atom1());
fs.writeFileSync("./public/feed.json", feed.json1());
