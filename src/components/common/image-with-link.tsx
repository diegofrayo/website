import type ReactTypes from "@diegofrayo-pkg/types/react";
import { isNonEmptyString } from "@diegofrayo-pkg/validator";

import { Image, Link } from "~/components/primitive";
import type { ImageProps } from "~/components/primitive/image";

import { LinkVariants } from "../primitive/link";

function ImageWithLink({ src, alt, ...rest }: ImageProps): ReactTypes.JSXElementNullable {
	if (isNonEmptyString(src)) {
		return (
			<Link
				variant={LinkVariants.SMOOTH}
				href={src}
				className="block"
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
