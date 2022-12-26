import * as React from "react";

import { Collapsible } from "~/components/primitive";
import { SourceCode } from "~/components/shared";
import type { T_ReactElement } from "~/types";

function JAEContent({ title, content }: { title: string; content: string }): T_ReactElement {
	return (
		<Collapsible title={title}>
			<SourceCode
				language="javascript"
				code={content}
				height={650}
			/>
		</Collapsible>
	);
}

export default JAEContent;
