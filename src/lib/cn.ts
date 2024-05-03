import { twMerge } from "tailwind-merge";
import classNames from "classnames";

function cn(...inputs: (string | undefined | boolean)[]) {
	return twMerge(classNames(inputs));
}

export default cn;
