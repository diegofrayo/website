import type { Resume } from "@diegofrayo-pkg/types/resume";

import { Icon, InlineText, Paragraph } from "~/components/primitive";
import { IconCatalog } from "~/components/primitive/icon";

export function Location({ location }: { location: Resume["contactInfo"]["location"] }) {
	return (
		<Paragraph className="text-xs">
			<Icon
				icon={IconCatalog.MAP_PIN}
				wrapperClassName="mr-0.5"
			/>
			<InlineText className="align-middle">{`${location.city}, ${location.country} (${location.timezone})`}</InlineText>
		</Paragraph>
	);
}
