import * as React from "react";

type T_TextFormatterProps = {
	children: string;
};

function TextFormatter({ children }: T_TextFormatterProps) {
	return (
		<pre
			className="dr-kordz-text-formatter"
			dangerouslySetInnerHTML={{
				__html: children,
			}}
		/>
	);
}

export default TextFormatter;
