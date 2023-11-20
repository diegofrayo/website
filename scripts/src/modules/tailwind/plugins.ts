/* eslint @typescript-eslint/dot-notation: 0 */

import colorConvert from "color-convert";
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
				value: config.value["default"],
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
	value,
}: {
	cssProperty: string;
	className: string;
	value: string;
}) {
	if (cssProperty === "backgroundColor") {
		return {
			"--fallback": "1",
			backgroundColor: hexToRgba(value),
		};
	}

	if (
		[
			"color",
			"borderColor",
			"borderTopColor",
			"borderRightColor",
			"borderBottomColor",
			"borderLeftColor",
		].includes(cssProperty)
	) {
		return {
			[cssProperty]: `var(--dr-color-${className.split("-color-")[1]})`,
		};
	}

	return {
		[cssProperty]: `var(--dr-${className})`,
	};
}

function hexToRgba(value: string) {
	const [r, g, b] = colorConvert.hex.rgb(value);
	return `rgba(${r}, ${g}, ${b}, var(--tw-bg-opacity, var(--fallback)))`;
}
