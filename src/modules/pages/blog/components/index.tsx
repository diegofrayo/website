import { InlineText } from "~/components/primitive";

export function BlogPostCategory({ children }: { children: string }) {
	return (
		<InlineText
			key={children}
			className="tw-mx-0.5 tw-mt-1 tw-inline-block tw-rounded-md tw-border tw-border-dotted tw-px-1.5 tw-py-0.5 tw-font-mono tw-text-sm dr-bg-color-surface-200 dr-border-color-surface-300 dr-text-color-surface-600"
		>{`#${children}`}</InlineText>
	);
}
