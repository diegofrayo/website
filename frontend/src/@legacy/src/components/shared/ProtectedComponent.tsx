import * as React from "react";

import { Block } from "~/@legacy/src/components/primitive";
import { withAuthComponent } from "~/@legacy/src/features/auth";
import v from "~/@legacy/src/lib/v";
import type { T_ReactChildren, T_ReactElement } from "~/@legacy/src/types";

type T_ProtectedComponent = {
	children: T_ReactChildren;
	withoutBlockContainer?: boolean;
};

function ProtectedComponent({
	children,
	withoutBlockContainer,
}: T_ProtectedComponent): T_ReactElement {
	return v.isTrue(withoutBlockContainer) ? (children as T_ReactElement) : <Block>{children}</Block>;
}

export default withAuthComponent(ProtectedComponent);