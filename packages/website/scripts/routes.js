require("dotenv").config({ path: ".env" });
const fs = require("fs");

const { posts } = require("../src/data/blog/posts.json");

const DYNAMIC_PAGES = ["about-me", "resume", "roadmap", "snippets"];
const ROUTES = {
  HOME: "/",
  ...DYNAMIC_PAGES.reduce((acum, curr) => {
    acum[toUpperCaseObjectProperty(curr)] = `/${curr}`;
    return acum;
  }, {}),
  ERROR_404: "/404",
  ERROR_500: "/500",

  BLOG: "/blog",
  PLAYGROUND: "/playground",

  __DYNAMIC_PAGES: DYNAMIC_PAGES,
};

function toUpperCaseObjectProperty(url) {
  return url.toUpperCase().replace(/-+/g, "_");
}

fs.writeFileSync("./src/data/routes.json", JSON.stringify(ROUTES));

console.log("Routes file created");
