import dotenv from "dotenv";
import fs from "fs";
import axios from "axios";

dotenv.config({ path: ".env" });

async function main() {
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
    { path: "/", isEnabledToIndex: true },
    { path: "/blog", isEnabledToIndex: true },
    { path: "/about-me", isEnabledToIndex: true },
    { path: "/resume", isEnabledToIndex: true },
    { path: "/contact", isEnabledToIndex: true },
    { path: "/music", isEnabledToIndex: false },
    { path: "/playground", isEnabledToIndex: false },
  ]
    .concat(
      Object.values(BLOG.posts).map((post) => {
        return {
          path: `/blog/${post.config.slug}`,
          isEnabledToIndex: post.config.is_published,
        };
      }),
    )
    .concat(
      MUSIC.songs.map((song) => {
        return {
          path: `/music/${song.id}`,
          isEnabledToIndex: song.progress === 5,
        };
      }),
    );

  generateSitemapFile(pages, WEBSITE_METADATA.url);

  console.log("Sitemap created");
}

main();

// --- Utils ---

function generateSitemapFile(pages, websiteUrl) {
  let output = `<?xml version="1.0" encoding="utf-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  pages
    .filter((page) => page.isEnabledToIndex)
    .forEach((page) => {
      output += `
  <url>
    <loc>${websiteUrl}${page.path}</loc>
  </url>`;
    });
  output += "\n</urlset>";

  fs.writeFileSync("./public/sitemap.xml", output);
}
