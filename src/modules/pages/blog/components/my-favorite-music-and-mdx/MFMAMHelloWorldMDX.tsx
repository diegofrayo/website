import * as React from "react";

import { Text } from "~/components/primitive";

export default function MFMAMHelloWorldMDX({ text }: { text: string }) {
	return <Text className="tw-block tw-bg-red-200 tw-p-2 tw-text-red-700">{text}</Text>;
}
