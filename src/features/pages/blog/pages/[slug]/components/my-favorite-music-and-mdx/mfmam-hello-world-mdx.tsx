import type ReactTypes from "@diegofrayo-pkg/types/react";

import { Paragraph } from "~/components/primitive";

function MFMAMHelloWorldMDX({ text }: { text: string }): ReactTypes.JSXElement {
	return <Paragraph className="bg-amber-200 p-2 text-amber-700">{text}</Paragraph>;
}

export default MFMAMHelloWorldMDX;
