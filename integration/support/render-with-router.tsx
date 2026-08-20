import { render, type RenderResult } from "@testing-library/react";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import type { NextRouter } from "next/router";

import type ReactTypes from "@diegofrayo-pkg/types/react";

export function renderWithRouter(
	ui: ReactTypes.JSXElementNullable,
	router: Partial<NextRouter>,
): RenderResult {
	const mockRouter: NextRouter = {
		route: router.pathname || "/",
		pathname: router.pathname || "/",
		query: {},
		asPath: router.pathname || "/",
		basePath: "",
		isLocaleDomain: false,
		push: async () => true,
		replace: async () => true,
		reload: () => {},
		back: () => {},
		forward: () => {},
		prefetch: async () => {},
		beforePopState: () => {},
		events: { on: () => {}, off: () => {}, emit: () => {} },
		isFallback: false,
		isReady: true,
		isPreview: false,
		...router,
	};

	return render(<RouterContext.Provider value={mockRouter}>{ui}</RouterContext.Provider>);
}
