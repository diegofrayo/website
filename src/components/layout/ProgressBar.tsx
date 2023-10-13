import * as React from "react";
import NProgress from "nprogress";
import classNames from "classnames";
import { useRouter } from "next/router";

import { Block } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import type { T_ReactElementNullable } from "~/types";

import styles from "./ProgressBar.styles.module.css";
import { delay } from "~/utils/misc";
import { logger } from "~/features/logging";

function NProgressBar(): T_ReactElementNullable {
	// --- HOOKS ---
	const router = useRouter();

	// --- EFFECTS ---
	useDidMount(() => {
		NProgress.configure({ parent: ".NProgressBar" });
		removeVercelPreviewDeploymentsMenu();

		function showProgressBar(): void {
			NProgress.done();
			NProgress.start();
		}

		function hideProgressBar(): void {
			setTimeout(() => {
				NProgress.done();
			}, 250);

			removeVercelPreviewDeploymentsMenu();
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

	// --- UTILS ---
	async function removeVercelPreviewDeploymentsMenu(): Promise<void> {
		await delay(1500);
		const $menu = document.getElementsByTagName("vercel-live-feedback")[0];

		if ($menu) {
			$menu.remove();
			logger("LOG", "vercel-live-feedback element removed!");
		} else {
			logger("LOG", "vercel-live-feedback element not found!");
		}
	}

	return <Block className={classNames("NProgressBar", styles["NProgressBar"])} />;
}

export default NProgressBar;
