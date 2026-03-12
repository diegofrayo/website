import NextImage, { type ImageProps as NextImageProps } from "next/image";

import type DR from "@diegofrayo-pkg/types";
import { omit } from "@diegofrayo-pkg/utilities/arrays-and-objects";

// --- PROPS & TYPES ---

type ImgHtmlAttributes = DR.DOM.HTMLElementAttributes["img"];

interface NativeImage extends ImgHtmlAttributes {
	alt: string;
	useNativeElement: true;
}

interface NextImage extends NextImageProps {
	alt: string;
	useNativeElement?: false;
}

export type ImageProps = NativeImage | NextImage;

// --- COMPONENT DEFINITION ---

function Image({ ...props }: ImageProps) {
	if ("useNativeElement" in props && props.useNativeElement === true) {
		return (
			<img
				loading="lazy"
				{...omit(props, ["useNativeElement"])}
				alt={props.alt}
			/>
		);
	}

	return <NextImage {...props} />;
}

export default Image;
