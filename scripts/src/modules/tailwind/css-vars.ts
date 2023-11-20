/* eslint @typescript-eslint/dot-notation: 0 */

import fs from "fs";
import CUSTOM_THEME, { COLOR_PALETTE } from "./theme";
import { formatCode } from "../../utils";

async function main() {
	fs.writeFileSync("./src/styles/variables.css", await formatCode(generateCSSVars(), "css"));
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
				return `${result}--dr-${className}: ${config.value["default"]};\n`;
			}

			if (typeof config.value === "string") {
				return `${result}--dr-${className}: ${config.value};\n`;
			}

			return result;
		},
		"",
	);

	return `html { ${defaultModeOutput} }`;
}
