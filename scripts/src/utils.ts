import * as prettier from "prettier";
import prettierConfig from "../../.prettierrc.js";

export function formatCode(code: string, parser: "css") {
	// @ts-ignore
	return prettier.format(code, {
		parser,
		...prettierConfig,
	});
}
