import cn from "@diegofrayo-pkg/cn";

import type { IconProps } from "../icon";

const InlineIcons = {
	GITHUB_MONO: {
		icon: GithubMonoIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	GMAIL_MONO: {
		icon: GmailMonoIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	INSTAGRAM_MONO: {
		icon: InstagramMonoIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	LINKEDIN_MONO: {
		icon: LinkedinMonoIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	SPOTIFY_MONO: {
		icon: SpotifyMonoIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	TWITTER: {
		icon: TwitterMonoIcon,
		defaultProps: {
			alt: "Twitter",
			className: "",
		},
	},
	WHATSAPP_MONO: {
		icon: WhatsAppMonoIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
};

export default InlineIcons;

// --- INLINE ICONS ---

export function GithubMonoIcon({ className, height, width }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			width={width}
			height={height}
			className={cn(className)}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M12 0.5C5.65 0.5 0.5 5.65 0.5 12c0 5.1 3.29 9.43 7.86 10.96.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.1-3.2.7-3.88-1.54-3.88-1.54-.52-1.32-1.28-1.67-1.28-1.67-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.97.1-.75.4-1.26.73-1.55-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.28 1.2-3.08-.12-.3-.52-1.5.11-3.13 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.5 3.2-1.18 3.2-1.18.63 1.63.23 2.83.11 3.13.75.8 1.2 1.82 1.2 3.08 0 4.43-2.7 5.4-5.28 5.68.41.36.77 1.08.77 2.18 0 1.58-.01 2.85-.01 3.24 0 .3.2.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35 0.5 12 0.5z" />
		</svg>
	);
}

export function GmailMonoIcon({ className, height, width }: IconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={cn("icon icon-tabler icon-tabler-brand-github", className)}
			viewBox="0 0 24 24"
			width={width}
			height={height}
			strokeWidth="1.2"
			stroke="currentColor"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path
				stroke="none"
				d="M0 0h24v24H0z"
				fill="none"
			/>
			<path d="M16 20h3a1 1 0 0 0 1 -1v-14a1 1 0 0 0 -1 -1h-3v16z" />
			<path d="M5 20h3v-16h-3a1 1 0 0 0 -1 1v14a1 1 0 0 0 1 1z" />
			<path d="M16 4l-4 4l-4 -4" />
			<path d="M4 6.5l8 7.5l8 -7.5" />
		</svg>
	);
}

export function InstagramMonoIcon({ className, height, width }: IconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={cn(className)}
			viewBox="0 0 24 24"
			width={width}
			height={height}
			strokeWidth="1.2"
			stroke="currentColor"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path
				stroke="none"
				d="M0 0h24v24H0z"
				fill="none"
			/>
			<path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
			<path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
			<path d="M16.5 7.5l0 .01" />
		</svg>
	);
}

export function LinkedinMonoIcon({ className, height, width }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.8}
			width={width}
			height={height}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={cn(className)}
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* Outer rounded square */}
			<rect
				x="2"
				y="2"
				width="20"
				height="20"
				rx="5"
				ry="5"
			/>

			{/* "in" logo */}
			<line
				x1="8"
				y1="11"
				x2="8"
				y2="16"
			/>
			<circle
				cx="8"
				cy="8"
				r="1"
			/>

			<path d="M12 16v-3a2 2 0 0 1 4 0v3" />
		</svg>
	);
}

export function SpotifyMonoIcon({ className, height, width }: IconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={cn(className)}
			viewBox="0 0 24 24"
			width={width}
			height={height}
			strokeWidth="1.2"
			stroke="currentColor"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path
				stroke="none"
				d="M0 0h24v24H0z"
				fill="none"
			/>
			<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
			<path d="M8 11.973c2.5 -1.473 5.5 -.973 7.5 .527" />
			<path d="M9 15c1.5 -1 4 -1 5 .5" />
			<path d="M7 9c2 -1 6 -2 10 .5" />
		</svg>
	);
}

export function TwitterMonoIcon({ className, height, width }: IconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={cn(className)}
			viewBox="0 0 24 24"
			width={width}
			height={height}
			strokeWidth="1.2"
			stroke="currentColor"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path
				stroke="none"
				d="M0 0h24v24H0z"
				fill="none"
			/>
			<path d="M4 4l11.733 16h4.267l-11.733 -16z" />
			<path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
		</svg>
	);
}

export function WhatsAppMonoIcon({ className, height, width }: IconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={cn(className)}
			viewBox="0 0 24 24"
			width={width}
			height={height}
			stroke="none"
		>
			<path
				fill="none"
				d="M0 0h24v24H0z"
			/>
			<path
				d="M7.253 18.494l.724.423A7.953 7.953 0 0 0 12 20a8 8 0 1 0-8-8c0 1.436.377 2.813 1.084 4.024l.422.724-.653 2.401 2.4-.655zM2.004 22l1.352-4.968A9.954 9.954 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.954 9.954 0 0 1-5.03-1.355L2.004 22zM8.391 7.308c.134-.01.269-.01.403-.004.054.004.108.01.162.016.159.018.334.115.393.249.298.676.588 1.357.868 2.04.062.152.025.347-.093.537a4.38 4.38 0 0 1-.263.372c-.113.145-.356.411-.356.411s-.099.118-.061.265c.014.056.06.137.102.205l.059.095c.256.427.6.86 1.02 1.268.12.116.237.235.363.346.468.413.998.75 1.57 1l.005.002c.085.037.128.057.252.11.062.026.126.049.191.066a.35.35 0 0 0 .367-.13c.724-.877.79-.934.796-.934002a.482.482 0 0 1 .378-.127c.06.004.121.015.177.04.531.243 1.4.622 1.4.622l.582.261c.098.047.187.158.19.265.004.067.01.175-.013.373-.032.259-.11.57-.188.733a1.155 1.155 0 0 1-.21.302 2.378 2.378 0 0 1-.33.288 3.71 3.71 0 0 1-.125.09 5.024 5.024 0 0 1-.383.22 1.99 1.99 0 0 1-.833.23c-.185.01-.37.024-.556.014-.008 0-.568-.087-.568-.087a9.448 9.448 0 0 1-3.84-2.046c-.226-.199-.435-.413-.649-.626-.89-.885-1.562-1.84-1.97-2.742A3.47 3.47 0 0 1 6.9 9.62a2.729 2.729 0 0 1 .564-1.68c.073-.094.142-.192.261-.305.127-.12.207-.184.294-.228a.961.961 0 0 1 .371-.1z"
				fill="currentColor"
			/>
		</svg>
	);
}
