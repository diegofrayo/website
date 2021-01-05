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
  BLOG_POSTS: {
    ...Object.keys(posts).reduce((acum, curr) => {
      acum[curr] = `/blog/${curr}`;
      return acum;
    }, {}),
  },

  PLAYGROUND: "/playground",
  PLAYGROUND_PROJECTS: {
    ...["chords", "strings", "stupid", "virtual-reality"].reduce((acum, curr) => {
      acum[curr] = `/playground/${curr}`;
      return acum;
    }, {}),
  },

  __DYNAMIC_PAGES: DYNAMIC_PAGES,
};

function toUpperCaseObjectProperty(url) {
  return url.toUpperCase().replace(/-+/g, "_");
}

fs.writeFileSync("./src/data/routes.json", JSON.stringify(ROUTES));

console.log("Routes file created");
