import { InlineText } from "~/components/primitive";

export function BlogPostCategory({ text }: { text: string }) {
	const composedText = `#${text}`;

	return (
		<InlineText className="inline-block rounded-md px-1.5 py-0.5 font-mono text-xs font-bold text-zinc-600 underline">
			{composedText}
		</InlineText>
	);
}
