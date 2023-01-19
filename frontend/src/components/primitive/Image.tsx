import * as React from "react";
import NextImage, { ImageProps } from "next/image";

import { T_ReactElementNullable } from "~/@diegofrayo/library/types/react";

export type T_ImageProps = ImageProps & { src: string; useNextImage?: boolean };

function Image({
	src,
	alt,
	className = "",
	useNextImage = true,
	...rest
}: T_ImageProps): T_ReactElementNullable {
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

export default Image;
