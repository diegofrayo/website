import type DR from "@diegofrayo-pkg/types";

import { Box } from "../components/primitive";
import { withAuth } from "./hocs";
import type { AuthUserRole } from "./types";

type WithAuthProps = {
	children: DR.React.Children;
	roles: AuthUserRole[];
	asChild?: boolean;
	className?: string;
};

export function WithAuth({ roles, children, ...rest }: WithAuthProps) {
	/* eslint react-hooks/static-components: 0 */
	const WithAuthHOC = withAuth(function WithAuthHOC(props: Omit<WithAuthProps, "roles">) {
		return props.asChild ? children : <Box className={props.className}>{props.children}</Box>;
	}, roles);

	return <WithAuthHOC {...rest}>{children}</WithAuthHOC>;
}
