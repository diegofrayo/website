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
    /*
    [
      "import",
      {
        libraryName: "~/components",
        libraryDirectory: "",
        camel2DashComponentName: false,
        customName: name => {
          const components = [
            "Breadcumb",
            "ErrorPage",
            "MDXContent",
            "MainLayout",
            "Page",
          ];

          if (components.indexOf(name) !== -1) {
            return `~/components/${name}`;
          }

          return "~/components";
        },
      },
      "components",
    ],
    */
  ],
};
