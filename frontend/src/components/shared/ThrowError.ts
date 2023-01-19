import { useDidMount } from "~/@diegofrayo/library/hooks";

function ThrowError({ message = "Render error" }) {
	// effects
	useDidMount(() => {
		throw new Error(message);
	});

	return null;
}

export default ThrowError;
