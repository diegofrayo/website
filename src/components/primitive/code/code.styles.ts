import { cva } from "class-variance-authority";

import { keyMirror } from "@diegofrayo-pkg/utilities/arrays-and-objects";

// --- PROPS ---

const CodeVariant = keyMirror(["UNSTYLED", "STYLED"]);
type CodeVariant = keyof typeof CodeVariant;

export { CodeVariant };

// --- STYLES ---

export const codeStyles = cva("text-left font-mono", {
	variants: {
		variant: {
			[CodeVariant.UNSTYLED]: "",
			[CodeVariant.STYLED]:
				"inline-block rounded-md bg-amber-300 px-1.5 py-0.5 text-sm font-bold text-amber-700",
		},
	},
});
