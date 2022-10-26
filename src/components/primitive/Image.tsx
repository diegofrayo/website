import * as React from "react";

import { logger } from "~/features/logging";
import type { T_HTMLElementAttributes, T_ReactElementNullable } from "~/types";

export type T_ImagePrimitiveComponent = (
	props: T_HTMLElementAttributes["img"],
) => T_ReactElementNullable;

const Image: T_ImagePrimitiveComponent = function Image({ src, ...rest }) {
	if (src) {
		return (
			<img
				src={src}
				loading="lazy"
				alt="Generic alt text"
				{...rest}
			/>
		);
	}

	logger("WARN", `Invalid src("${src}") prop`);

	return null;
};

export default Image;
