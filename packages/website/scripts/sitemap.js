require("dotenv").config({ path: ".env" });
const SitemapGenerator = require("sitemap-generator");
const fs = require("fs");

const { posts } = require("../src/data/blog/posts.json");
const { website: WebsiteMetadata } = require("../src/data/metadata.json");
const { pages } = require("../src/data/texts.json");

const pagesToIgnore = Object.entries(pages)
  .map(([slug, page]) => {
    return page.config && page.config.meta_no_robots ? slug : "";
  })
  .filter(Boolean);

const generator = SitemapGenerator(WebsiteMetadata.url, {
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

  const url = `${WebsiteMetadata.url}/blog/${post.slug}`;
  generator.queueURL(url);
});

generator.on("done", () => {
  try {
    fs.writeFileSync(
      "./public/sitemap.xml",
      fs
        .readFileSync("./public/sitemap.xml", "utf8")
        .replace(new RegExp(WebsiteMetadata.url, "g"), WebsiteMetadata.urlProd),
    );

    console.log("Sitemap created");
  } catch (err) {
    console.error(err);
  }
});
