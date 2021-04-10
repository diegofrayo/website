require("dotenv").config({ path: ".env" });
const Feed = require("feed").Feed;
const fs = require("fs");

const { posts } = require("../src/data/blog/posts.json");
const { website: WebsiteMetadata, seo: SEOMetadata } = require("../src/data/metadata.json");
const { pages } = require("../src/data/texts.json");

const feed = new Feed({
  title: SEOMetadata.title,
  description: pages["/"][pages["/"].config.default_locale].meta_description,
  id: WebsiteMetadata.username,
  link: WebsiteMetadata.urlProd,
  language: "es",
  image: `${WebsiteMetadata.urlProd}/static/images/favicon/favicon.ico`,
  favicon: `${WebsiteMetadata.urlProd}/static/images/favicon/android-chrome-512x512.png`,
  copyright: `All rights reserved 2020, ${WebsiteMetadata.shortName}`,
  feedLinks: {
    json: `${WebsiteMetadata.urlProd}/feed.json`,
    atom: `${WebsiteMetadata.urlProd}/atom.xml`,
    rss: `${WebsiteMetadata.urlProd}/rss.xml`,
  },
  author: {
    name: WebsiteMetadata.fullName,
    email: WebsiteMetadata.email,
    link: WebsiteMetadata.urlProd,
  },
});

Object.values(posts).forEach((post) => {
  if (post.config.is_published === false) return null;

  const url = `${WebsiteMetadata.urlProd}/blog/${post.slug}`;

  feed.addItem({
    title: post[post.default_locale].title,
    id: url,
    link: url,
    description: post[post.default_locale].description,
    content: post[post.default_locale].description,
    author: [
      {
        name: WebsiteMetadata.shortName,
        email: WebsiteMetadata.email,
        link: `${WebsiteMetadata.urlProd}/about-me`,
      },
    ],
    date: new Date(post.published_at),
  });
});

["Tech", "Programming", "Software Development", "React", "Next.js", "Blog"].forEach(
  feed.addCategory,
);

fs.writeFileSync("./public/rss.xml", feed.rss2());
fs.writeFileSync("./public/atom.xml", feed.atom1());
fs.writeFileSync("./public/feed.json", feed.json1());

console.log("RSS files created");
