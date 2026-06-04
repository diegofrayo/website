import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";

// --- PROPS & TYPES ---

type BlockquoteProps = ReactTypes.DOM.HTMLElementAttributes["blockquote"];

// --- COMPONENT DEFINITION ---

function Blockquote({ children, className, ...rest }: BlockquoteProps) {
	return (
		<blockquote
			className={cn("dr-blockquote", "border-l-4 border-black pl-3 text-black", className)}
			{...rest}
		>
			{children}
		</blockquote>
	);
}

export default Blockquote;
