"use client";

import { Tooltip } from "@base-ui/react/tooltip";
import { Toaster } from "sonner";

import { useDidMount } from "@diegofrayo-pkg/hooks";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { isMobileDevice } from "@diegofrayo-pkg/utilities/browser/device";

import { EnvVars } from "~/constants";
import AnalyticsService from "~/features/analytics";
import AuthService from "~/features/auth";
import DevTools from "~/features/dev-tools";
import { addGlobalErrorListener } from "~/features/logger";

type ProvidersProps = {
	children: ReactTypes.Children;
};

function Providers({ children }: ProvidersProps) {
	// --- EFFECTS ---
	useDidMount(() => {
		addGlobalErrorListener();

		if (isMobileDevice()) {
			document.body.classList.add("mobile");
		}

		AuthService.loadSession();
		AuthService.onSessionLoad(() => {
			AnalyticsService.trackPageLoaded();
		});
	});

	return (
		<Tooltip.Provider>
			{children}

			<Toaster
				position="bottom-center"
				toastOptions={{
					classNames: {
						toast: "justify-center bg-white shadow-md text-black",
						closeButton: "bg-white text-black shadow-lg border border-zinc-300",
					},
				}}
				richColors={false}
				closeButton
			/>

			<DevTools
				devURL={EnvVars.NEXT_PUBLIC_WEBSITE_URL_DEV}
				productionURL={EnvVars.NEXT_PUBLIC_WEBSITE_URL_PROD}
			/>
		</Tooltip.Provider>
	);
}

export default Providers;
