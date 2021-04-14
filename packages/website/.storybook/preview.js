import "../src/styles/index.post.css";

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
