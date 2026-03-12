declare module "sugar-high" {
	export function highlight(code: unknown): string;
}

declare module "*.css" {}

interface Window {
	rybbit: {
		pageview: (path?: string) => void;
		event: (name: string, data?: Record<string, unknown>) => void;
	};
}
