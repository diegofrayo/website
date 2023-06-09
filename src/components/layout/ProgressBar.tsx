import * as React from "react";
import NProgress from "nprogress";
import classNames from "classnames";
import { useRouter } from "next/router";

import { Block } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import type { T_ReactElementNullable } from "~/types";

import styles from "./ProgressBar.styles.module.css";

function NProgressBar(): T_ReactElementNullable {
	// --- HOOKS ---
	const router = useRouter();

	// --- EFFECTS ---
	useDidMount(() => {
		NProgress.configure({ parent: ".NProgressBar" });

		function showProgressBar(): void {
			NProgress.done();
			NProgress.start();
		}

		function hideProgressBar(): void {
			setTimeout(() => {
				NProgress.done();
			}, 250);
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

	return <Block className={classNames("NProgressBar", styles["NProgressBar"])} />;
}

export default NProgressBar;
