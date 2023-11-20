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

export function WhatsAppMonoIcon({ className, height, width }: T_IconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={className}
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
				d="M7.253 18.494l.724.423A7.953 7.953 0 0 0 12 20a8 8 0 1 0-8-8c0 1.436.377 2.813 1.084 4.024l.422.724-.653 2.401 2.4-.655zM2.004 22l1.352-4.968A9.954 9.954 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.954 9.954 0 0 1-5.03-1.355L2.004 22zM8.391 7.308c.134-.01.269-.01.403-.004.054.004.108.01.162.016.159.018.334.115.393.249.298.676.588 1.357.868 2.04.062.152.025.347-.093.537a4.38 4.38 0 0 1-.263.372c-.113.145-.356.411-.356.411s-.099.118-.061.265c.014.056.06.137.102.205l.059.095c.256.427.6.86 1.02 1.268.12.116.237.235.363.346.468.413.998.75 1.57 1l.005.002c.085.037.128.057.252.11.062.026.126.049.191.066a.35.35 0 0 0 .367-.13c.724-.877.79-.934.796-.934v.002a.482.482 0 0 1 .378-.127c.06.004.121.015.177.04.531.243 1.4.622 1.4.622l.582.261c.098.047.187.158.19.265.004.067.01.175-.013.373-.032.259-.11.57-.188.733a1.155 1.155 0 0 1-.21.302 2.378 2.378 0 0 1-.33.288 3.71 3.71 0 0 1-.125.09 5.024 5.024 0 0 1-.383.22 1.99 1.99 0 0 1-.833.23c-.185.01-.37.024-.556.014-.008 0-.568-.087-.568-.087a9.448 9.448 0 0 1-3.84-2.046c-.226-.199-.435-.413-.649-.626-.89-.885-1.562-1.84-1.97-2.742A3.47 3.47 0 0 1 6.9 9.62a2.729 2.729 0 0 1 .564-1.68c.073-.094.142-.192.261-.305.127-.12.207-.184.294-.228a.961.961 0 0 1 .371-.1z"
				fill="currentColor"
			/>
		</svg>
	);
}
