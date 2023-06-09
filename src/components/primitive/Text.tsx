import * as React from "react";
import classNames from "classnames";

import type { T_HTMLElementAttributes, T_ReactChildren, T_ReactElement } from "~/types";

type T_TextProps = T_HTMLElementAttributes["p"];

function Text({ children, className = "", ...rest }: T_TextProps): T_ReactElement {
	return (
		<p
			className={classNames("dfr-Text", className)}
			{...rest}
		>
			{removeTextElements(children)}
		</p>
	);
}

export default Text;

// --- UTILS ---

function removeTextElements(children: T_ReactChildren): T_ReactChildren {
	if (React.isValidElement(children) && children.type === "p") {
		return children.props.children;
	}

	return children;
}
