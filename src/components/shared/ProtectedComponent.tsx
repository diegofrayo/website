import * as React from "react";

import { Block } from "~/components/primitive";
import { withAuthenticationRequired } from "~/hocs";
import { isTrue } from "~/utils/validations";
import type { T_ReactChildren, T_ReactElement } from "~/types";

type T_ProtectedComponent = {
	children: T_ReactChildren;
	withoutBlockContainer?: boolean;
};

function ProtectedComponent({
	children,
	withoutBlockContainer,
}: T_ProtectedComponent): T_ReactElement {
	return isTrue(withoutBlockContainer) ? (children as T_ReactElement) : <Block>{children}</Block>;
}

export default withAuthenticationRequired(ProtectedComponent);
