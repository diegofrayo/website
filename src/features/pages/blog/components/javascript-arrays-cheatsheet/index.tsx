import * as React from "react";

import { Collapsible } from "~/components/primitive";
import { SourceCode } from "~/components/shared";
import type { T_ReactElement } from "~/types";

function JACContent({ title, content }: { title: string; content: string }): T_ReactElement {
	return (
		<Collapsible title={title}>
			<SourceCode
				fileName={title}
				language="javascript"
				code={content}
				height={650}
			/>
		</Collapsible>
	);
}

export default JACContent;
