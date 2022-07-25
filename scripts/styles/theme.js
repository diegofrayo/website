const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

const COMMON_COLORS = {
	// Global tokens
	["color-gs-white"]: {
		value: {
			light: colors.white,
			dark: colors.white,
		},
	},
	["color-gs-400"]: {
		property: "color",
		value: {
			light: colors.gray["400"],
			dark: colors.gray["400"],
		},
	},
	["color-gs-700"]: {
		property: "borderColor",
		value: {
			light: colors.gray["700"],
			dark: colors.gray["700"],
		},
	},
	["color-gs-black"]: {
		value: {
			light: colors.black,
			dark: colors.black,
		},
	},

	// Alias tokens
	["color-bw"]: {
		value: {
			light: colors.black,
			dark: colors.white,
		},
	},
	["color-wb"]: {
		value: {
			light: colors.white,
			dark: colors.black,
		},
	},
};

const MY_THEME = {
	// Global tokens
	["max-w-layout"]: {
		property: "maxWidth",
		value: defaultTheme.screens.md,
	},
	["font-family"]: {
		property: "fontFamily",
		value: "'Mulish', monospace",
	},
	["shadow"]: {
		property: "boxShadow",
		value: {
			light: "0px 0px 3px 0px rgba(0, 0, 0, 0.5)",
			dark: "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgb(31, 41, 55) 0px 1px 2px 0px",
		},
	},
	["transition-opacity"]: {
		property: "",
		value: {
			transition: defaultTheme.transitionProperty.opacity,
			transitionDuration: defaultTheme.transitionDuration["500"],
			"&:hover": {
				opacity: defaultTheme.opacity[70],
			},
		},
	},

	// Alias tokens
	["bg-color-primary"]: {
		property: "backgroundColor",
		value: {
			light: colors.white,
			dark: "#1A1E23",
		},
	},
	["bg-color-secondary"]: {
		property: "backgroundColor",
		value: {
			light: colors.gray["50"],
			dark: "#1F2328",
		},
	},
	["bg-color-tertiary"]: {
		property: "backgroundColor",
		value: {
			light: colors.gray["100"],
			dark: colors.gray["700"],
		},
	},
	["border-color-primary"]: {
		property: "borderColor",
		value: {
			light: colors.gray["200"],
			dark: colors.gray["700"],
		},
	},
	["text-color-primary"]: {
		property: "color",
		value: {
			light: colors.gray["600"],
			dark: colors.gray["400"],
		},
	},
	["text-color-secondary"]: {
		property: "color",
		value: {
			light: colors.gray["400"],
			dark: colors.gray["500"],
		},
	},

	// Colors for some elements
	["text-color-links"]: {
		property: "color",
		value: {
			light: colors.amber["600"],
			dark: colors.red["400"],
		},
	},
	["text-color-inline-code"]: {
		property: "color",
		value: {
			light: colors.red["600"],
			dark: colors.amber["400"],
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
