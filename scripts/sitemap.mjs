import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env" });

async function main() {
  try {
    const { data: BLOG } = await axios.get(
      `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/pages/blog/data.json`,
    );
    const {
      data: { website: WEBSITE_METADATA },
    } = await axios.get(`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/metadata.json`);
    const { data: MUSIC } = await axios.get(
      `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/pages/music/data.json`,
    );

    const pages = [
      { path: "/", isEnabledToBeIndexed: true },
      { path: "/blog", isEnabledToBeIndexed: true },
      { path: "/about-me", isEnabledToBeIndexed: true },
      { path: "/resume", isEnabledToBeIndexed: true },
      { path: "/contact", isEnabledToBeIndexed: true },
      { path: "/music", isEnabledToBeIndexed: false },
      { path: "/playground", isEnabledToBeIndexed: false },
    ]
      .concat(
        Object.values(BLOG.posts).map((post) => {
          return {
            path: `/blog/${post.config.slug}`,
            isEnabledToBeIndexed: post.config.is_published,
          };
        }),
      )
      .concat(
        MUSIC.songs.map((song) => {
          return {
            path: `/music/${song.id}`,
            isEnabledToBeIndexed: song.is_public,
          };
        }),
      );

    generateSitemapFile(pages, WEBSITE_METADATA.url);

    console.log("Sitemap created");
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
    .filter((page) => page.isEnabledToBeIndexed)
    .forEach((page) => {
      output += `
  <url>
    <loc>${websiteUrl}${page.path}</loc>
  </url>`;
    });
  output += "\n</urlset>";

  fs.writeFileSync("./public/sitemap.xml", output);
}
