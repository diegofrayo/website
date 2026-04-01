/* eslint storybook/no-uninstalled-addons: 0 */

import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
	stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: ["@storybook/addon-docs", "@storybook/addon-vitest"],
	framework: {
		name: "@storybook/nextjs-vite",
		options: {},
	},
};

export default config;
