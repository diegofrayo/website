import cn from "@diegofrayo-pkg/cn";
import type DR from "@diegofrayo-pkg/types";

// --- PROPS & TYPES ---

type BlockQuoteProps = DR.DOM.HTMLElementAttributes["blockquote"];

// --- COMPONENT DEFINITION ---

function BlockQuote({ children, className, ...rest }: BlockQuoteProps) {
	return (
		<blockquote
			className={cn("dr-blockquote", "border-l-4 border-black pl-3 text-black", className)}
			{...rest}
		>
			{children}
		</blockquote>
	);
}

export default BlockQuote;
