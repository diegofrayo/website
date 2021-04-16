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

dotenv.config({ path: ".env" });

const pagesToIgnore = Object.entries(pages)
  .map(([slug, page]) => {
    return page.config && page.config.meta_no_robots ? slug : "";
  })
  .filter(Boolean);

const generator = SitemapGenerator(WEBSITE_METADATA.url, {
  stripQuerystring: false,
  filepath: "./public/sitemap.xml",
  ignore: (url) => {
    return pagesToIgnore.filter((page) => url.includes(page)).length > 0;
  },
});

generator.start();

Object.values(posts).forEach((post) => {
  if (post.config.is_published === false || post.config.meta_no_robots === true) {
    return;
  }

  const url = `${WEBSITE_METADATA.url}/blog/${post.slug}`;
  generator.queueURL(url);
});

generator.on("done", () => {
  try {
    fs.writeFileSync(
      "./public/sitemap.xml",
      fs
        .readFileSync("./public/sitemap.xml", "utf8")
        .replace(new RegExp(WEBSITE_METADATA.url, "g"), WEBSITE_METADATA.urlProd),
    );

    console.log("Sitemap created");
  } catch (err) {
    console.error(err);
  }
});
