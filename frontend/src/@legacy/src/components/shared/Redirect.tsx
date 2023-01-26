import { useDidMount } from "~/@legacy/src/hooks";
import { redirect, T_RoutesValues } from "~/@legacy/src/features/routing";

export default function Redirect({ href }: { href: T_RoutesValues }): null {
	useDidMount(() => {
		redirect(href);
	});

	return null;
}
