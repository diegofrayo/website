import * as React from "react";

import { Image, Link } from "~/components/primitive";
import type { T_ImageProps } from "~/components/primitive/Image";
import v from "@diegofrayo/v";

function ImageWithLink({ src, alt, ...rest }: T_ImageProps) {
	if (v.isNotEmptyString(src)) {
		return (
			<Link
				variant={Link.variant.SIMPLE}
				href={src}
				className="tw-block"
				isExternalLink
			>
				<Image
					{...rest}
					src={src}
					alt={alt}
				/>
			</Link>
		);
	}

	return null;
}

export default ImageWithLink;
