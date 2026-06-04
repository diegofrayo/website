import { isNotEmptyString } from "@diegofrayo-pkg/validator";

import { Image, Link } from "~/components/primitive";
import { type ImageProps } from "~/components/primitive/image";

function ImageWithLink({ src, alt, ...rest }: ImageProps) {
	if (isNotEmptyString(src)) {
		return (
			<Link
				variant={Link.variant.SMOOTH}
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
