import * as React from "react";

import { Image, Link } from "~/components/primitive";
import v from "~/lib/v";
import type { T_ImageProps } from "~/components/primitive/Image";
import type { T_ReactElementNullable } from "~/types";

function ImageWithLink({ src, ...rest }: T_ImageProps): T_ReactElementNullable {
	if (v.isNotEmptyString(src)) {
		return (
			<Link
				variant={Link.variant.SIMPLE}
				href={src}
				className="tw-block"
				isExternalLink
			>
				<Image
					src={src}
					{...rest}
				/>
			</Link>
		);
	}

	return null;
}

export default ImageWithLink;
