import * as React from "react";

import { Block } from "~/components/primitive";
import { withAuthComponent } from "~/features/auth";
import v from "~/lib/v";
import type { T_ReactChildren, T_ReactElement } from "~/types";

type T_ProtectedComponent = {
	children: T_ReactChildren;
	withoutBlockContainer?: boolean;
	className?: string;
};

function ProtectedComponent({
	children,
	withoutBlockContainer,
	className,
}: T_ProtectedComponent): T_ReactElement {
	return v.isTrue(withoutBlockContainer) ? (
		(children as T_ReactElement)
	) : (
		<Block className={className}>{children}</Block>
	);
}

export default withAuthComponent(ProtectedComponent);
