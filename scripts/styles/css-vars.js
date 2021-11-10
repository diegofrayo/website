const fs = require("fs");
const MY_THEME = require("./theme");

function main() {
  const output = Object.entries(MY_THEME).reduce((result, [item, config]) => {
    if (config.value.light && config.value.dark) {
      result += `--dfr-${item}: ${config.value.light};\n`;
      result += `--dark--dfr-${item}: ${config.value.dark};\n`;
    } else if (typeof config.value === "string") {
      result += `--dfr-${item}: ${config.value};\n`;
    }

    return result;
  }, "");

  fs.writeFileSync("./src/styles/variables.post.css", `body { ${output} }`);
}

main();
