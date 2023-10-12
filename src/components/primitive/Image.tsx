import * as React from "react";
import NextImage, { type ImageProps } from "next/image";

import { omit } from "@diegofrayo/utils/arrays-and-objects";
import type DR from "@diegofrayo/types";

// --- PROPS & TYPES ---

type T_ImgHtmlAttributes = DR.DOM.HTMLElementAttributes["img"];

interface I_NativeImage extends T_ImgHtmlAttributes {
	alt: string;
	useNativeImage: true;
}

interface I_NextImage extends ImageProps {
	alt: string;
}

export type T_ImageProps = I_NativeImage | I_NextImage;

// --- COMPONENT DEFINITION ---

function Image({ ...props }: T_ImageProps) {
	if ("useNativeImage" in props) {
		return (
			// eslint-disable-next-line @next/next/no-img-element
			<img
				loading="lazy"
				{...omit(props, ["useNativeImage"])}
				alt={props.alt}
			/>
		);
	}

	return <NextImage {...props} />;
}

export default Image;
