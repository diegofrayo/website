import cn from "classnames";

type T_IconProps = {
	className?: string;
	width?: string;
	height?: string;
};

export function GithubMonoIcon({ className, height, width }: T_IconProps) {
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
				d="M0 0h24v24H0z"
				stroke="none"
			/>
			<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 00-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
		</svg>
	);
}

export function GmailMonoIcon({ className, height, width }: T_IconProps) {
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

export function InstagramMonoIcon({ className, height, width }: T_IconProps) {
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
			<path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
			<path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
			<path d="M16.5 7.5l0 .01" />
		</svg>
	);
}

export function LinkedinMonoIcon({ className, height, width }: T_IconProps) {
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
			<path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
			<path d="M8 11l0 5" />
			<path d="M8 8l0 .01" />
			<path d="M12 16l0 -5" />
			<path d="M16 16v-3a2 2 0 0 0 -4 0" />
		</svg>
	);
}

export function SpotifyMonoIcon({ className, height, width }: T_IconProps) {
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
			<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
			<path d="M8 11.973c2.5 -1.473 5.5 -.973 7.5 .527" />
			<path d="M9 15c1.5 -1 4 -1 5 .5" />
			<path d="M7 9c2 -1 6 -2 10 .5" />
		</svg>
	);
}

export function TwitterMonoIcon({ className, height, width }: T_IconProps) {
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
			<path d="M4 4l11.733 16h4.267l-11.733 -16z" />
			<path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
		</svg>
	);
}
