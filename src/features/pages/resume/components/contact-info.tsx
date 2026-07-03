import cn from "@diegofrayo-pkg/cn";
import type { Resume } from "@diegofrayo-pkg/types/resume";

import { Box, Icon, InlineText, Link } from "~/components/primitive";
import { IconCatalog } from "~/components/primitive/icon";

export function ContactInfo({
	contactInfo,
	variant,
}: {
	contactInfo: Resume["contactInfo"];
	variant: "SIMPLE" | "STYLISH";
}) {
	const classes = {
		item: cn(
			"inline-flex shrink-0 items-center justify-center gap-1",
			"odd:sm:justify-end even:sm:justify-start",
		),
	};
	const isShortVariant = variant === "SIMPLE";

	return (
		<Box className="grid grid-cols-1 gap-x-3 gap-y-1 text-black sm:grid-cols-2">
			<Link
				variant={Link.variant.SMOOTH}
				href={`mailto:${contactInfo.email}`}
				className={classes.item}
				isExternalLink
			>
				{isShortVariant ? (
					<Icon
						icon={IconCatalog.MAILS}
						size={16}
					/>
				) : (
					<Icon
						icon={IconCatalog.GMAIL}
						size={22}
					/>
				)}
				<InlineText className="text-sm font-semibold">{contactInfo.email}</InlineText>
			</Link>
			<Link
				variant={Link.variant.SMOOTH}
				href={contactInfo.website}
				className={classes.item}
				isExternalLink
			>
				{isShortVariant ? (
					<Icon
						icon={IconCatalog.GLOBE}
						size={16}
					/>
				) : (
					<Icon
						icon={IconCatalog.WEBSITE}
						size={16}
					/>
				)}
				<InlineText className="text-sm font-semibold">
					{contactInfo.website.replace("https://", "")}
				</InlineText>
			</Link>
			<Link
				variant={Link.variant.SMOOTH}
				href={contactInfo.profiles[0].url}
				className={classes.item}
				isExternalLink
			>
				{isShortVariant ? (
					<Icon
						icon={IconCatalog.LINKEDIN_MONO}
						className="size-4"
						strokeWidth={2}
					/>
				) : (
					<Icon
						icon={IconCatalog.LINKEDIN}
						wrapperClassName="size-4"
					/>
				)}
				<InlineText className="text-sm font-semibold">
					{contactInfo.profiles[0].url.replace("https://www.", "")}
				</InlineText>
			</Link>
			<Link
				variant={Link.variant.SMOOTH}
				href={contactInfo.profiles[1].url}
				className={classes.item}
				isExternalLink
			>
				{isShortVariant ? (
					<Icon
						icon={IconCatalog.GITHUB_MONO}
						className="size-4"
					/>
				) : (
					<Icon
						icon={IconCatalog.GITHUB}
						wrapperClassName="size-4"
					/>
				)}
				<InlineText className="text-sm font-semibold">
					{contactInfo.profiles[1].url.replace("https://www.", "")}
				</InlineText>
			</Link>
		</Box>
	);
}
