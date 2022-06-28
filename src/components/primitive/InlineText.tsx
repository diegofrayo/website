import * as React from "react";

import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";

type T_InlineTextProps = T_HTMLElementAttributes["span"] & {
	is?: "span" | "strong";
};

function InlineText({ is: Tag = "span", children, ...rest }: T_InlineTextProps): T_ReactElement {
	return <Tag {...rest}>{children}</Tag>;
}

export default InlineText;
