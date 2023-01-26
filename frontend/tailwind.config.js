/** @type {import('tailwindcss').Config} */

const dfrUtilitiesPlugin = require("./src/@legacy/scripts/styles/tailwind");

module.exports = {
	jit: true,
	prefix: "tw-",
	darkMode: "class",
	important: false,
	plugins: [dfrUtilitiesPlugin],
	content: ["./src/**/*.{ts,tsx}"],
	safelist: [
		{
			pattern: /^(sm:|md:)?(tw-my-|tw-mx-|tw-mt-|tw-mb-)/,
		},
		{
			pattern: /dfr-/,
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
		},
		extend: {
			transitionDuration: {
				DEFAULT: "500ms",
			},
			zIndex: {},
			lineHeight: {
				0: "0",
			},
			inset: {
				"1px": "1px",
				"-1px": "-1px",
			},
			fontSize: {
				xxs: "0.6rem",
			},
			borderWidth: {},
		},
	},
};
