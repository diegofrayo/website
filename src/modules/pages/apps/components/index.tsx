import * as React from "react";

export function Output({ children }: { children: string }) {
	return (
		<output className="tw-block tw-min-h-[40px] tw-w-full tw-whitespace-break-spaces tw-break-all tw-border tw-p-3 tw-font-mono tw-text-sm dr-border-color-surface-300">
			{children}
		</output>
	);
}
