import type ReactTypes from "@diegofrayo-pkg/types/react";
import type { Resume } from "@diegofrayo-pkg/types/resume";

import { Icon, InlineText, Paragraph } from "~/components/primitive";
import { IconCatalog } from "~/components/primitive/icon";

export function Location({
	location,
}: {
	location: Resume["contactInfo"]["location"];
}): ReactTypes.JSXElement {
	return (
		<Paragraph className="text-xs">
			<Icon
				name={IconCatalog.MAP_PIN}
				className="mr-0.5"
			/>
			<InlineText className="align-middle">{`${location.city}, ${location.country} (${location.timezone})`}</InlineText>
		</Paragraph>
	);
}
