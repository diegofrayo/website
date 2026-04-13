import cn from "@diegofrayo-pkg/cn";

import { InlineText } from "~/components/primitive";

export function Skill({ children, className }: { children: string; className?: string }) {
	return (
		<InlineText
			className={cn(
				"inline-block border border-slate-300 bg-slate-100 px-1.5 py-0.5 pt-1 font-mono text-xs leading-tight font-semibold text-slate-600",
				className,
			)}
		>
			{children.trim()}
		</InlineText>
	);
}
