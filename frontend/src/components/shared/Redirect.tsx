import { useDidMount } from "~/hooks";
import { redirect, T_RoutesValues } from "~/features/routing";

export default function Redirect({ href }: { href: T_RoutesValues }): null {
	useDidMount(() => {
		redirect(href);
	});

	return null;
}
