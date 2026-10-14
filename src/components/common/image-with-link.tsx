import type ReactTypes from "@diegofrayo-pkg/types/react";
import { isNonBlankString } from "@diegofrayo-pkg/validator";

import { Image, Link } from "~/components/primitive";
import { type ImageProps } from "~/components/primitive/image";
import { LinkVariant } from "~/components/primitive/link";

function ImageWithLink({ src, alt, ...rest }: ImageProps): ReactTypes.JSXElementNullable {
	if (isNonBlankString(src)) {
		return (
			<Link
				variant={LinkVariant.SMOOTH}
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
