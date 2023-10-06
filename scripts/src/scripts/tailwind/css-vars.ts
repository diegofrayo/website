/* eslint @typescript-eslint/dot-notation: 0 */

import fs from "fs";
import colorConvert from "color-convert";
import CUSTOM_THEME, { COLOR_PALETTE } from "./theme";

function main() {
	fs.writeFileSync("./src/styles/variables.css", generateCSSVars());
}

main();

// --- UTILS ---

function generateCSSVars() {
	const defaultModeOutput = Object.entries({ ...CUSTOM_THEME, ...COLOR_PALETTE }).reduce(
		(result, [className, config]) => {
			if (config.property === "multiple") {
				return result;
			}

			if (
				typeof config.value === "object" &&
				config.value["default"] &&
				!className.includes("-color-")
			) {
				return `${result}--dr-${className}: ${hexToRgba(
					config.property,
					config.value["default"],
				)};\n`;
			}

			if (typeof config.value === "string") {
				return `${result}--dr-${className}: ${hexToRgba(config.property, config.value)};\n`;
			}

			return result;
		},
		"",
	);

	return `html { ${defaultModeOutput} }`;
}

function hexToRgba(property: string, value: string, alpha?: number) {
	if (property.includes("color")) {
		const rgbaColor = colorConvert.hex.rgb(value).concat(alpha ? [alpha] : []);
		return mountRgbaString(...rgbaColor);
	}

	return value;
}

function mountRgbaString(...args: number[]) {
	const [r, g, b, a] = args;
	return `rgba(${r}, ${g}, ${b}, ${typeof a === "number" ? a : 1})`;
}
