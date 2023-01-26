import * as React from "react";

import { Page } from "~/@legacy/src/components/layout";
import { Block } from "~/@legacy/src/components/primitive";
import { Loader } from "~/@legacy/src/components/shared";
import { useDidMount } from "~/@legacy/src/hooks";
import { redirect, ROUTES } from "~/@legacy/src/features/routing";
import type { T_ReactElement } from "~/@legacy/src/types";

function SignOutPage(): T_ReactElement {
	// effects
	useDidMount(() => {
		setTimeout(() => {
			window.localStorage.clear();
			redirect(`${ROUTES.HOME}?a=d`);
		}, 2000);
	});

	return (
		<Page
			config={{
				title: "Cerrando sesión...",
				disableSEO: true,
			}}
		>
			<Block className="tw-p-4 tw-text-center">
				<Loader />
			</Block>
		</Page>
	);
}

export default SignOutPage;
