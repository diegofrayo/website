import "../src/styles/tailwind.css";
import "../src/styles/index.post.css";
import "../src/styles/tailwind-utils.css";

export const parameters = {
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
