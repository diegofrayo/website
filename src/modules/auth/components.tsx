import * as React from "react";

import { Block } from "~/components/primitive";
import type DR from "@diegofrayo/types";

import { withAuth } from "./hocs";

type T_ComponentWithAuth = {
	children: DR.React.Children;
	withoutContainer?: boolean;
	className?: string;
};

export const ComponentWithAuth = withAuth(function ComponentWithAuth({
	children,
	withoutContainer,
	className,
}: T_ComponentWithAuth) {
	return withoutContainer ? children : <Block className={className}>{children}</Block>;
});
