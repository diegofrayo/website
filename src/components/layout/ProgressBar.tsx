import * as React from "react";
import { useRouter } from "next/router";
import NProgress from "nprogress";

import { Block } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import type { T_ReactElement, T_SetTimeout } from "~/types";

function ProgressBar(): T_ReactElement {
	// hooks
	const router = useRouter();

	// effects
	useDidMount(() => {
		let timeout: T_SetTimeout;

		function showProgressBar(): void {
			timeout = setTimeout(NProgress.start, 100);
		}

		function hideProgressBar(): void {
			clearTimeout(timeout);
			NProgress.done();
		}

		router.events.on("routeChangeStart", showProgressBar);
		router.events.on("routeChangeComplete", hideProgressBar);
		router.events.on("routeChangeError", hideProgressBar);

		return () => {
			router.events.off("routeChangeStart", showProgressBar);
			router.events.off("routeChangeComplete", hideProgressBar);
			router.events.off("routeChangeError", hideProgressBar);
		};
	});

	return (
		<Block>
			<style jsx>{`
				:global(#nprogress .bar) {
					@apply tw-bg-yellow-500;
					height: 5px;
					left: 0;
					position: fixed;
					top: 0;
					width: 100%;
					z-index: 1000;
				}
			`}</style>
		</Block>
	);
}

export default ProgressBar;
