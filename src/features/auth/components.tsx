import type ReactTypes from "@diegofrayo-pkg/types/react";

import { withAuth } from "./hocs";
import type { AuthUserRole } from "./types";

type WithAuthProps = {
	children: ReactTypes.Children;
	roles: AuthUserRole[];
	asChild?: boolean;
	className?: string;
};

export function WithAuth({ roles, children, ...rest }: WithAuthProps) {
	/* eslint react-hooks/static-components: 0 */
	const WithAuthHOC = withAuth(function WithAuthHOC(props: Omit<WithAuthProps, "roles">) {
		return props.asChild ? children : <div className={props.className}>{props.children}</div>;
	}, roles);

	return <WithAuthHOC {...rest}>{children}</WithAuthHOC>;
}
