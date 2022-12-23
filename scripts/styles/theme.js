const TW_DEFAULT_THEME = require("tailwindcss/defaultTheme");
const TW_COLORS = require("tailwindcss/colors");
const color = require("color");
// https://github.com/Qix-/color | https://github.com/bgrins/TinyColor | https://gka.github.io/chroma.js/

const COMMON_COLORS = {
	// Global tokens
	["color-gs-white"]: {
		value: {
			light: TW_COLORS.white,
			dark: TW_COLORS.white,
		},
	},
	["color-gs-400"]: {
		value: {
			light: TW_COLORS.gray["400"],
			dark: TW_COLORS.gray["400"],
		},
	},
	["color-gs-700"]: {
		value: {
			light: TW_COLORS.gray["700"],
			dark: TW_COLORS.gray["700"],
		},
	},
	["color-gs-black"]: {
		value: {
			light: TW_COLORS.black,
			dark: TW_COLORS.black,
		},
	},

	// Alias tokens
	["color-bw"]: {
		value: {
			light: TW_COLORS.black,
			dark: TW_COLORS.white,
		},
	},
	["color-wb"]: {
		value: {
			light: TW_COLORS.white,
			dark: TW_COLORS.black,
		},
	},
};

const BG_DARK_MODE = "#1A1E23";

const MY_THEME = {
	// Global tokens
	["max-w-layout"]: {
		property: "maxWidth",
		value: TW_DEFAULT_THEME.screens.md,
	},
	["font-family"]: {
		property: "fontFamily",
		value: "'Mulish', sans-serif",
	},
	["transition-opacity"]: {
		property: "multiple",
		value: {
			transition: TW_DEFAULT_THEME.transitionProperty.opacity,
			transitionDuration: TW_DEFAULT_THEME.transitionDuration["500"],
			"&:hover": {
				opacity: TW_DEFAULT_THEME.opacity[70],
			},
		},
	},
	["shadow"]: {
		property: "multiple",
		value: {
			light: {
				boxShadow: "0px 0px 3px 0px rgba(0, 0, 0, 0.5)",
			},
			dark: {
				boxShadow: "0px 0px 3px 0px rgba(255, 255, 255, 0.1)",
			},
		},
	},

	// Alias tokens
	["bg-color-primary"]: {
		property: "backgroundColor",
		value: {
			light: TW_COLORS.white,
			dark: BG_DARK_MODE,
		},
	},
	["bg-color-secondary"]: {
		property: "backgroundColor",
		value: {
			light: TW_COLORS.gray["50"],
			dark: color(BG_DARK_MODE)
				.lighten(0.3)
				.hex(),
		},
	},
	["bg-color-tertiary"]: {
		property: "backgroundColor",
		value: {
			light: TW_COLORS.gray["100"],
			dark: color(BG_DARK_MODE)
				.lighten(0.6)
				.hex(),
		},
	},
	["border-color-primary"]: {
		property: "borderColor",
		value: {
			light: TW_COLORS.gray["200"],
			dark: color(BG_DARK_MODE)
				.lighten(0.9)
				.hex(),
		},
	},
	["text-color-primary"]: {
		property: "color",
		value: {
			light: TW_COLORS.gray["600"],
			dark: TW_COLORS.gray["400"],
		},
	},
	["text-color-secondary"]: {
		property: "color",
		value: {
			light: TW_COLORS.zinc["400"],
			dark: TW_COLORS.gray["500"],
		},
	},

	// Colors for some elements
	["text-color-links"]: {
		property: "color",
		value: {
			light: TW_COLORS.amber["600"],
			dark: TW_COLORS.red["400"],
		},
	},
	["text-color-inline-code"]: {
		property: "color",
		value: {
			light: TW_COLORS.red["600"],
			dark: TW_COLORS.amber["400"],
		},
	},
	["bg-color-inline-code"]: {
		property: "backgroundColor",
		value: {
			light: TW_COLORS.red["400"],
			dark: TW_COLORS.amber["600"],
		},
	},
	["border-color-inline-code"]: {
		property: "borderColor",
		value: {
			light: TW_COLORS.red["400"],
			dark: TW_COLORS.amber["600"],
		},
	},

	...enhanceTheme(COMMON_COLORS, ["bg", "text", "border"]),
};

module.exports = MY_THEME;

// --- Utils ---

function enhanceTheme(COMMON_COLORS, properties) {
	return Object.entries(COMMON_COLORS).reduce((result, [key, config]) => {
		const generatedProperties = properties.reduce((result, property) => {
			return {
				...result,
				...(property === "border"
					? ["t", "r", "b", "l", "all"].reduce((result, curr) => {
							return {
								...result,
								[`${property}${curr === "all" ? "" : `-${curr}`}-${key}`]: {
									property:
										curr === "t"
											? "borderTopColor"
											: curr === "r"
											? "borderRightColor"
											: curr === "b"
											? "borderBottomColor"
											: curr === "l"
											? "borderLeftColor"
											: "borderColor",
									value: config.value,
								},
							};
					  }, {})
					: {
							[`${property}-${key}`]: {
								property: property === "bg" ? "backgroundColor" : "color",
								value: config.value,
							},
					  }),
			};
		}, {});

		return {
			...result,
			...generatedProperties,
		};
	}, {});
}
