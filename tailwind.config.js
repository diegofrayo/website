module.exports = {
  prefix: "tw-",
  darkMode: "class",
  important: false,
  plugins: [],
  purge: {
    content: ["./src/components/**/*.tsx", "./src/pages/**/*.tsx"],
    options: {
      safelist: createWhitelist(),
    },
  },
  theme: {
    extend: {
      borderRadius: {
        full: "100%",
      },
      leading: {
        0: "0",
      },
      inset: {
        "1px": "1px",
      },
    },
  },
  variants: {
    borderWidth: ["responsive", "last", "hover"],
    margin: ["responsive", "last"],
    inset: ["responsive", "hover"],
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
