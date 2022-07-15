import * as React from "react";

import { Image, Link } from "~/components/primitive";
import { isNotEmptyString } from "~/utils/validations";
import type { T_HTMLElementAttributes, T_ReactElementNullable } from "~/types";

type T_ImageWithLink = T_HTMLElementAttributes["img"];

function ImageWithLink({ src, className, alt, ...rest }: T_ImageWithLink): T_ReactElementNullable {
	if (isNotEmptyString(src)) {
		return (
			<Link
				variant={Link.variant.SIMPLE}
				href={src}
				className="tw-block"
				isExternalLink
			>
				<Image
					src={src}
					alt={alt}
					className={className}
					{...rest}
				/>
			</Link>
		);
	}

	return null;
}

export default ImageWithLink;
