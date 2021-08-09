module.exports = {
  presets: [
    [
      "next/babel",
      {
        "styled-jsx": {
          plugins: ["styled-jsx-plugin-postcss"],
        },
        "@babel/preset-env": {
          targets: { node: "current" },
        },
      },
    ],
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    [
      "import",
      {
        libraryName: "~/hooks",
        libraryDirectory: "",
        camel2DashComponentName: false,
      },
      "hooks",
    ],
    [
      "import",
      {
        libraryName: "~/hocs",
        libraryDirectory: "",
        camel2DashComponentName: false,
      },
      "hocs",
    ],
    [
      "import",
      {
        libraryName: "~/components/primitive",
        libraryDirectory: "",
        camel2DashComponentName: false,
      },
      "components/primitive",
    ],
  ],
};
