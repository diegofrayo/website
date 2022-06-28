import * as React from "react";

import { ImageWithLink } from "~/components/shared";
import { withAuthenticationRequired } from "~/hocs";
import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";

function ProtectedImage({
	src = "",
	className,
	alt,
}: T_HTMLElementAttributes["img"]): T_ReactElement {
	return (
		<ImageWithLink
			src={src}
			alt={alt}
			className={className}
		/>
	);
}

export default withAuthenticationRequired(ProtectedImage);
