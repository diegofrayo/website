import dotenv from "dotenv";
import fs from "fs";
import SitemapGenerator from "sitemap-generator";

import BLOG_POSTS from "../src/data/blog/posts.json";
import METADATA from "../src/data/metadata.json";
import PAGES_TEXTS from "../src/data/texts.json";

dotenv.config({ path: ".env" });

const { pages } = PAGES_TEXTS;
const { website: WEBSITE_METADATA } = METADATA;
const { posts } = BLOG_POSTS;

const pagesToIgnore = Object.entries(pages)
  .map(([slug, page]) => {
    return page.config.meta_no_robots === true ? slug : "";
  })
  .filter(Boolean);

const generator = SitemapGenerator(WEBSITE_METADATA.url, {
  stripQuerystring: false,
  filepath: "./public/sitemap.xml",
  ignore: (url) => {
    return (
      pagesToIgnore.find((ignoredPage) => url.includes(ignoredPage)) !== undefined ||
      url.includes("/movies") ||
      url.includes("/books")
    );
  },
});

// Add a URL to crawler's queue. Useful to help crawler fetch pages it can't find itself.
Object.values(posts).forEach((post) => {
  if (post.config.is_published === false || post.config.meta_no_robots === true) {
    return;
  }

  const url = `${WEBSITE_METADATA.url}/blog/${post.slug}`;
  generator.queueURL(url);
});

generator.start();

generator.on("done", () => {
  const URL_PRODUCTION = "https://diegofrayo.vercel.app";

  try {
    fs.writeFileSync(
      "./public/sitemap.xml",
      fs
        .readFileSync("./public/sitemap.xml", "utf8")
        .replace(new RegExp(WEBSITE_METADATA.url, "g"), URL_PRODUCTION),
    );

    console.log("Sitemap created");
  } catch (err) {
    console.error(err);
  }
});
