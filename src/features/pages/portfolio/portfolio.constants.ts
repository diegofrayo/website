import { Routes } from "~/features/routing";

// --- TYPES ---

export type Project = {
	id: string;
	title: string;
	url?: string;
	github?: boolean;
	description: string;
	date: string;
	techStack: string[];
	type: ProjectType;
};

export type ProjectType = "SIDE_PROJECT" | "PROFESSIONAL_PROJECT";

// --- CONSTANTS ---

export const SIDE_PROJECTS: Array<Project> = [
	{
		id: "dranki",
		title: "Dranki",
		url: "https://dranki.diegofrayo.dev",
		date: "2026",
		description:
			"A mobile-first web app to learn English through flashcard decks, grammar lessons, and reading comprehension texts.",
		techStack: ["Tan Stack Start", "React", "TypeScript", "Tailwind CSS", "Zod", "Zustand"],
		github: true,
		type: "SIDE_PROJECT",
	},
	{
		id: "lab",
		title: "Lab",
		url: "https://lab.diegofrayo.dev",
		date: "2026",
		description:
			"A collection of subprojects for experimenting and testing features and concepts about programming.",
		techStack: [
			"Next.js",
			"React",
			"TypeScript",
			"Tailwind CSS",
			"Zod",
			"React Hook Form",
			"GraphQL",
		],
		github: true,
		type: "SIDE_PROJECT",
	},
	{
		id: "bets",
		title: "Bets",
		url: "/assets/pages/demo/bets/index.html",
		date: "2024",
		description:
			"A web app that displays daily fixtures for various soccer leagues, providing stats and predictions for each match to support sports betting decisions.",
		techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
		type: "SIDE_PROJECT",
	},
	{
		id: "kordz",
		title: "Kordz",
		url: "https://kordz.diegofrayo.dev",
		date: "2022",
		description:
			"A web app to host and browse chords and lyrics for the songs I can play on guitar.",
		techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Firebase", "MDX"],
		type: "SIDE_PROJECT",
	},
	{
		id: "website",
		title: "Website",
		url: Routes.BLOG,
		date: "2020",
		description:
			"A personal website built to showcase my resume, portfolio, social media links, and a static blog.",
		techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Firebase", "MDX"],
		github: true,
		type: "SIDE_PROJECT",
	},
];

export const PROFESSIONAL_PROJECTS: Array<Project> = [
	{
		id: "crypto-trading-platform",
		title: "Crypto Trading Platform",
		date: "2024",
		description:
			"A platform to trade alt coins. I led the front-end development from scratch using React and TypeScript, while actively contributing to back-end development.",
		techStack: [
			"React",
			"TypeScript",
			"Storybook",
			"Tailwind CSS",
			"Firebase",
			"Node.js",
			"Fastify",
			"WebSockets",
			"Solana",
		],
		type: "PROFESSIONAL_PROJECT",
	},
	{
		id: "arlene",
		title: "Arlene",
		date: "2023",
		description:
			"Arlene was a start-up that developed multiple editors to create customizable 3D scenarios and AR experiences, providing a seamless way to share and reproduce these experiences through a URL.",
		techStack: [
			"React",
			"TypeScript",
			"Svelte",
			"Firebase",
			"Node.js",
			"Fastify",
			"Puppeteer",
			"Three.js",
			"Marzipano",
		],
		type: "PROFESSIONAL_PROJECT",
	},
	{
		id: "career-circle",
		title: "CareerCircle",
		url: "https://www.careercircle.com",
		date: "2018",
		description:
			"A job search web application. Led the front-end development integrating it with back-end services provided by the client's team.",
		techStack: [
			"TypeScript",
			"React",
			"React Native",
			"Node.js",
			"Tailwind CSS",
			"Next.js",
			"GraphQL",
			"Apollo Client",
			"Prisma.io",
			"Auth0",
		],
		type: "PROFESSIONAL_PROJECT",
	},
	{
		id: "festa",
		title: "Festa",
		date: "2015",
		description:
			"Festa was a platform to play music from YouTube and create collaborative playlists among multiple users.",
		techStack: [
			"Angular.js",
			"Bootstrap Material",
			"Node.js",
			"Sails.js",
			"MongoDB",
			"Firebase",
			"PHP",
			"jQuery",
		],
		type: "PROFESSIONAL_PROJECT",
	},
];
