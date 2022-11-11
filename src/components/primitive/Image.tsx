import * as React from "react";
import NextImage, { ImageProps } from "next/future/image";

import { logger } from "~/features/logging";
import { isDevelopmentEnvironment } from "~/utils/app";
import { isString } from "~/utils/validations";
import type { T_ReactElementNullable } from "~/types";

export type T_ImageProps = ImageProps & { useNextImage?: boolean };

function Image({
	src,
	alt,
	className = "",
	useNextImage = true,
	...rest
}: T_ImageProps): T_ReactElementNullable {
	if (src) {
		// TODO: Enable this component on production
		if (useNextImage && isDevelopmentEnvironment()) {
			return (
				<NextImage
					src={src}
					alt={alt}
					className={className}
					{...rest}
				/>
			);
		}

		if (isString(src)) {
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
