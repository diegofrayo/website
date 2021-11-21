const fs = require("fs");
const MY_THEME = require("./theme");

function main() {
  const output = Object.entries(MY_THEME).reduce((result, [item, config]) => {
    if (config.property === "") return result;

    if (typeof config.value === "object") {
      if (config.value.light && config.value.dark) {
        result += `--dfr-${item}: ${config.value.light};\n`;
        result += `--dark--dfr-${item}: ${config.value.dark};\n`;
      } else {
        Object.keys(config.value).forEach((valueKey) => {
          result += `--dfr-${item}-${valueKey}: ${config.value[valueKey]};\n`;
        });
      }
    } else if (typeof config.value === "string") {
      result += `--dfr-${item}: ${config.value};\n`;
    }

    return result;
  }, "");

  fs.writeFileSync("./src/styles/variables.post.css", `body { ${output} }`);
}

main();
