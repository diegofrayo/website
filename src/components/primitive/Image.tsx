import * as React from "react";
import NextImage from "next/image";

import { logger } from "~/features/logging";
import type { T_HTMLElementAttributes, T_ReactElementNullable } from "~/types";

export type T_ImagePrimitiveComponent = (
	props: T_HTMLElementAttributes["img"] & { useNextImage?: boolean },
) => T_ReactElementNullable;

const Image: T_ImagePrimitiveComponent = function Image({
	src,
	useNextImage = false,
	className = "",
	height = 32,
	width = 32,
	...rest
}) {
	if (src) {
		if (useNextImage) {
			return (
				<NextImage
					src={src}
					alt="Generic alt text"
					width={width}
					height={height}
					className={className}
				/>
			);
		}

		return (
			<img
				src={src}
				loading="lazy"
				alt="Generic alt text"
				className={className}
				{...rest}
			/>
		);
	}

	logger("WARN", `Invalid src("${src}") prop`);

	return null;
};

export default Image;
