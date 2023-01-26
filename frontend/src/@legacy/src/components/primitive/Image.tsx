import * as React from "react";
import NextImage, { ImageProps } from "next/image";

import { logger } from "~/@legacy/src/features/logging";
import v from "~/@legacy/src/lib/v";
import type { T_ReactElementNullable } from "~/@legacy/src/types";

export type T_ImageProps = ImageProps & { useNextImage?: boolean };

function Image({
	src,
	alt,
	className = "",
	useNextImage = true,
	...rest
}: T_ImageProps): T_ReactElementNullable {
	if (src) {
		if (useNextImage) {
			return (
				<NextImage
					src={src}
					alt={alt}
					className={className}
					{...rest}
				/>
			);
		}

		if (v.isString(src)) {
			return (
				<img
					src={src}
					alt={alt}
					className={className}
					loading="lazy"
					{...rest}
				/>
			);
		}

		throw new Error(`Invalid src prop => (${src}"`);
	}

	logger("WARN", `Invalid src prop => (${src}"`);

	return null;
}

export default Image;
