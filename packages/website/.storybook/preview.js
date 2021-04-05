import "../src/styles/tailwind.css";
import "../src/styles/tailwind-utils.css";
import "../src/styles/index.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  themes: {
    clearable: false,
    target: "html",
    list: [
      {
        default: true,
        name: "Light",
        class: ["tw-light"],
        color: "#ffffff",
      },
      {
        name: "Dark",
        class: ["tw-dark"],
        color: "#000000",
      },
    ],
  },
};
