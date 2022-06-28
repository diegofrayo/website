import { isString } from "~/utils/validations";

import type { T_LibraryIconComponent } from "./types";

export default function isIconElementFromLibrary(input: unknown): input is T_LibraryIconComponent {
	return !isString(input);
}
