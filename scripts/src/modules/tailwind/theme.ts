import TW_DEFAULT_THEME from "tailwindcss/defaultTheme";

export const COLOR_PALETTE = generateColorPalette();

const MY_THEME = {
	// GLOBAL TOKENS
	"font-main-title": {
		property: "fontFamily",
		value: "var(--font-main-title)",
	},
	"font-titles": {
		property: "fontFamily",
		value: "var(--font-titles)",
	},
	"font-texts": {
		property: "fontFamily",
		value: "var(--font-texts)",
	},
	"transition-opacity": {
		property: "multiple",
		value: {
			transition: TW_DEFAULT_THEME.transitionProperty.opacity,
			transitionDuration: TW_DEFAULT_THEME.transitionDuration["500"],
			"&:hover": {
				opacity: TW_DEFAULT_THEME.opacity[75],
			},
		},
	},
	shadow: {
		property: "multiple",
		value: {
			default: {
				boxShadow: "0px 0px 3px 0px rgba(0, 0, 0, 0.5)",
			},
		},
	},

	...enhanceTheme(COLOR_PALETTE, ["bg", "text", "border", "shadow"]),
};

export default MY_THEME;

// --- INTERNALS ---

function enhanceTheme(
	colors: typeof COLOR_PALETTE,
	properties: ["bg", "text", "border", "shadow"],
) {
	return Object.entries(colors).reduce((result, [colorName, colorConfig]) => {
		const generatedProperties = properties.reduce((result, property) => {
			return {
				...result,
				...(property === "border"
					? ["all", "t", "r", "b", "l"].reduce((result, side) => {
							return {
								...result,
								[`${property}${side === "all" ? "" : `-${side}`}-${colorName}`]: {
									property:
										side === "t"
											? "borderTopColor"
											: side === "r"
											? "borderRightColor"
											: side === "b"
											? "borderBottomColor"
											: side === "l"
											? "borderLeftColor"
											: "borderColor",
									value: colorConfig.value,
								},
							};
					  }, {})
					: property === "shadow"
					? {
							[`${property}-${colorName}`]: {
								property: "multiple",
								value: {
									"--tw-shadow-color": colorConfig.value.default,
									"--tw-shadow": "var(--tw-shadow-colored)",
								},
							},
					  }
					: {
							[`${property}-${colorName}`]: {
								property: property === "bg" ? "backgroundColor" : "color",
								value: colorConfig.value,
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

function generateColorPalette(): Record<string, { property: "color"; value: { default: string } }> {
	const palette = `
    /** CSS DARK THEME PRIMARY COLORS */
    --color-primary-100: #d1d442;
    --color-primary-200: #d7d95b;
    --color-primary-300: #dedd71;
    --color-primary-400: #e3e286;
    --color-primary-500: #e9e79a;
    --color-primary-600: #eeecaf;
    /** CSS DARK THEME SURFACE COLORS */
    --color-surface-100: #000000;
    --color-surface-200: #1e1e1e;
    --color-surface-300: #353535;
    --color-surface-400: #4e4e4e;
    --color-surface-500: #696969;
    --color-surface-600: #858585;
    /** CSS DARK THEME MIXED SURFACE COLORS */
    --color-surface-mixed-100: #19180d;
    --color-surface-mixed-200: #2e2d24;
    --color-surface-mixed-300: #44443b;
    --color-surface-mixed-400: #5c5b54;
    --color-surface-mixed-500: #75746e;
    --color-surface-mixed-600: #8f8f89;
  `;

	return palette
		.split("\n")
		.map((line) => line.trim())
		.reduce((result, line) => {
			if (line.startsWith("/**") || !line) {
				return result;
			}

			const [colorName, colorValue] = line.replace("--", "").replace(";", "").split(":");

			return {
				...result,
				[colorName.trim()]: { property: "color", value: { default: colorValue.trim() } },
			};
		}, {});
}
