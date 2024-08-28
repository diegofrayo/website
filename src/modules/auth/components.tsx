import * as React from "react";

import { Block } from "~/components/primitive";
import type DR from "@diegofrayo/types";

import { withAuth } from "./hocs";
import type { T_Role } from "./types";

type T_ComponentWithAuth = {
	children: DR.React.Children;
	withoutContainer?: boolean;
	className?: string;
	roles?: T_Role[];
};

export function ComponentWithAuth({ roles, children, ...rest }: T_ComponentWithAuth) {
	const ComponentWithAuthInner = withAuth(function ComponentWithAuthInner(
		props: Omit<T_ComponentWithAuth, "roles">,
	) {
		return props.withoutContainer ? (
			children
		) : (
			<Block className={props.className}>{props.children}</Block>
		);
	}, roles);

	return <ComponentWithAuthInner {...rest}>{children}</ComponentWithAuthInner>;
}
