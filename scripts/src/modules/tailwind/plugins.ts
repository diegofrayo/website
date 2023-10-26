/* eslint @typescript-eslint/dot-notation: 0 */

import plugin from "tailwindcss/plugin";
import TW_DEFAULT_THEME from "tailwindcss/defaultTheme";
import CUSTOM_THEME from "./theme";

function drPlugins({ addUtilities }) {
	const defaultPluginConfig = generateDefaultPluginConfig();
	const widthAndHeightPluginConfig = generateWidthAndHeightPluginConfig();

	addUtilities(defaultPluginConfig, {
		respectPrefix: false,
		variants: [],
	});

	addUtilities(widthAndHeightPluginConfig, {
		respectPrefix: true,
		variants: [],
	});
}

export default plugin(drPlugins);

// --- PLUGINS ---

function generateDefaultPluginConfig() {
	return Object.entries(CUSTOM_THEME).reduce((result, [className, config]) => {
		const currentResult = {};

		if (config.property === "multiple") {
			if (config.value["default"]) {
				currentResult[`.dr-${className}`] = config.value["default"];
			} else {
				currentResult[`.dr-${className}`] = config.value;
			}
		} else if (
			(typeof config.value === "object" && config.value["default"]) ||
			typeof config.value === "string"
		) {
			currentResult[`.dr-${className}`] = createTailwindStyleValue({
				cssProperty: config.property,
				className,
			});
		}

		return { ...result, ...currentResult };
	}, {});
}

function generateWidthAndHeightPluginConfig() {
	return Object.entries({ ...TW_DEFAULT_THEME.spacing, full: "100%" }).reduce(
		(result, [size, sizeValue]) => {
			return { ...result, [`.wh-${size}`]: { width: sizeValue, height: sizeValue } };
		},
		{},
	);
}

// --- UTILS ---

function createTailwindStyleValue({
	cssProperty,
	className,
}: {
	cssProperty: string;
	className: string;
}) {
	if (
		[
			"backgroundColor",
			"color",
			"borderColor",
			"borderTopColor",
			"borderRightColor",
			"borderBottomColor",
			"borderLeftColor",
		].includes(cssProperty)
	) {
		return {
			"--fallback": "1",
			[cssProperty]: `var(--dr-color-${className.split("-color-")[1]})`,
		};
	}

	return {
		[cssProperty]: `var(--dr-${className})`,
	};
}
