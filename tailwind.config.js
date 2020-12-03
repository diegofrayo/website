const {
  borderRadius,
  leading,
  width,
  height,
  minHeight,
} = require("tailwindcss/defaultTheme");

module.exports = {
  prefix: "tw-",
  important: false,
  plugins: [require("@tailwindcss/typography")],
  purge: {
    content: ["./src/components/**/*.tsx", "./src/pages/**/*.tsx"],
    options: {
      safelist: createWhitelist(),
    },
  },
  theme: {
    extend: {
      borderRadius: {
        ...borderRadius,
        full: "100%",
      },
      leading: {
        ...leading,
        0: "0",
      },
      width: {
        ...width,
        300: "300px",
        400: "400px",
        500: "500px",
        600: "600px",
      },
      height: {
        ...height,
        300: "300px",
        400: "400px",
        500: "500px",
        600: "600px",
      },
      minHeight: {
        ...minHeight,
        300: "300px",
        400: "400px",
        500: "500px",
        600: "600px",
      },
    },
  },
  variants: {
    borderWidth: ["responsive", "last"],
    margin: ["responsive", "last"],
  },
};

function createWhitelist() {
  const breakpoints = ["", "sm:", "md:", "lg:", "xl:"];
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64];
  const margins = ["tw-my-", "tw-mx-", "tw-mb-", "tw-mt-"];
  const whitelist = [];

  margins.forEach(margin => {
    numbers.forEach(number => {
      breakpoints.forEach(breakpoint => {
        whitelist.push(`${breakpoint}${margin}${number}`);
      });
    });
  });

  return whitelist;
}
