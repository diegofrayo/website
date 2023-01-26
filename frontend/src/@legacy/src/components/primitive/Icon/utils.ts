import v from "~/@legacy/src/lib/v";

import type { T_LibraryIconComponent } from "./types";

export default function isIconElementFromLibrary(input: unknown): input is T_LibraryIconComponent {
	return !v.isString(input);
}
