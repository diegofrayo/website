import { ROUTES } from "~/features/routing";
import { useDidMount } from "~/hooks";

export default function HomePage(): null {
	useDidMount(() => {
		window.location.href = ROUTES.MUSIC;
	});

	return null;
}
