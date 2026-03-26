import "~/styles/globals.css";

import type { Decorator, Preview } from "@storybook/react";

// --- GLOBAL CONFIG ---

(function injectGlobalCSS() {
	if (typeof window === "undefined") return;
	const style = document.createElement("style");
	style.innerHTML = `body { visibility: visible !important; }`;
	document.head.appendChild(style);
})();

const SetBodyAsVisibleDecorator: Decorator = (Story, context) => {
	document.body.classList.add("visible");
	return <Story />;
};

// --- MAIN CONFIG ---

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
	decorators: [SetBodyAsVisibleDecorator],
};

export default preview;
