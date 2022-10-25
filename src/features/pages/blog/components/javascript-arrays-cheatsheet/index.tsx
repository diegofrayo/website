import * as React from "react";

import { Collapsible } from "~/components/primitive";
import { MarkdownContent } from "~/components/shared";
import type { T_ReactElement } from "~/types";

function JACContent({ title, content }: { title: string; content: string }): T_ReactElement {
	return (
		<Collapsible title={title}>
			<MarkdownContent content={content} />
		</Collapsible>
	);
}

export default JACContent;
