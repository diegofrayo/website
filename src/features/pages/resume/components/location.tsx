import type { Resume } from "@diegofrayo-pkg/types/resume";

import { Icon, IconCatalog, InlineText, Text } from "~/components/primitive";

export function Location({ location }: { location: Resume["contactInfo"]["location"] }) {
	return (
		<Text className="text-xs">
			<Icon
				icon={IconCatalog.MAP_PIN}
				wrapperClassName="mr-0.5"
			/>
			<InlineText className="align-middle">{`${location.city}, ${location.country} (${location.timezone})`}</InlineText>
		</Text>
	);
}
