require("dotenv").config({ path: ".env" });
const SitemapGenerator = require("sitemap-generator");
const fs = require("fs");

const { WEBSITE_METADATA } = require("../src/data/metadata");
const { pages } = require("../src/data/texts.json");

const pagesToIgnore = Object.entries(pages)
  .map(([slug, page]) => {
    return page.config && page.config.meta_no_robots ? slug : "";
  })
  .filter(Boolean);

// create generator
const generator = SitemapGenerator(WEBSITE_METADATA.url, {
  stripQuerystring: false,
  filepath: "./public/sitemap.xml",
  ignore: url => {
    return pagesToIgnore.filter(page => url.includes(page)).length > 0;
  },
});

// register event listeners
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

// start the crawler
generator.start();
