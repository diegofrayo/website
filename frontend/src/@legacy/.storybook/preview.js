import "../src/styles/index.post.css";
import { StyleRegistry } from "styled-jsx";

export const decorators = [
	(Story) => (
		<StyleRegistry>
			<Story />
		</StyleRegistry>
	),
];

export const parameters = {
	themes: {
		clearable: false,
		target: "html",
		list: [
			{
				default: true,
				name: "Light",
				class: ["tw-light"],
				color: "#ffffff",
			},
			{
				name: "Dark",
				class: ["tw-dark"],
				color: "#000000",
			},
		],
	},
};
