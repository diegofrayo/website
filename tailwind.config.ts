import type { Config } from "tailwindcss";
import drPlugins from "./scripts/.ts-node/plugins.js";

const config: Config = {
	prefix: "tw-",
	jit: true,
	important: false,
	content: [
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
	],
	safelist: [
		{
			pattern: /^(sm:|md:)?(tw-my-|tw-mx-|tw-mt-|tw-mb-)/,
		},
		{
			pattern: /dr-/,
		},
		{
			pattern: /tw-max-w/,
		},
		{
			pattern: /tw-bg/,
		},
	],
	theme: {
		screens: {
			// => @media (min-width: 640px) { ... }
			sm: "640px",

			// => @media (min-width: 768px) { ... }
			md: "768px",

			// => @media (min-width: 1024px) { ... }
			lg: "1024px",
		},
		extend: {
			lineHeight: {
				"0": "0",
			},
			borderWidth: {
				"12": "12px",
			},
			fontSize: {
				xxs: "0.5rem",
				"7xl": "4.5rem",
				"8xl": "5.25rem",
				"9xl": "6rem",
				"10xl": "6.75rem",
			},
			height: {
				"dv-screen": "100dvh",
			},
			minHeight: {
				"dv-screen": "100dvh",
			},
			animation: {
				intermitent: "intermitent 1.5s infinite",
				"spin-slow": "spin 2s linear infinite",
			},
			keyframes: {
				intermitent: {
					"0%": { opacity: "0" },
					"50%": { opacity: "1" },
					"100%": { opacity: "0" },
				},
			},
		},
	},
	plugins: [drPlugins],
};

export default config;
