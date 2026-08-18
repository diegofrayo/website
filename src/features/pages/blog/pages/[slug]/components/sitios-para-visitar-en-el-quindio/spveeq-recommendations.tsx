import { isNotEmptyString } from "@diegofrayo-pkg/validator";

import BoxWithTitle from "~/components/common/box-with-title";
import { Blockquote, Box, Collapsible, Icon, Link, Pre } from "~/components/primitive";
import { IconCatalog } from "~/components/primitive/icon";
import AnalyticsService from "~/features/analytics";

type SPVEEQRecommendationsProps = {
	data: {
		id: string;
		name: string;
		instagram: string;
		airbnb: string;
		website: string;
		whatsapp: string;
		description: string;
	}[];
};

function SPVEEQRecommendations({ data: recommendations }: SPVEEQRecommendationsProps) {
	return (
		<Box>
			{recommendations.map((recommendation) => {
				return (
					<Collapsible
						key={recommendation.id}
						title={recommendation.name}
						contentClassName="pt-1 pb-4"
						onShowContentHandler={AnalyticsService.trackClickEvent(
							"BLOG|SPVEEQ_RECOMMENDATION|OPEN",
							{
								recommendation: recommendation.id,
							},
						)}
						onHideContentHandler={AnalyticsService.trackClickEvent(
							"BLOG|SPVEEQ_RECOMMENDATION|CLOSE",
							{
								recommendation: recommendation.id,
							},
						)}
					>
						<BoxWithTitle
							title="Links de contacto"
							className="my-2 p-2 pt-3"
						>
							{isNotEmptyString(recommendation.website) ? (
								<Link
									href={recommendation.website}
									variant={Link.variant.SMOOTH}
									className="mr-2 inline-block"
									onClick={AnalyticsService.trackClickEvent("BLOG|SPVEEQ|LINK", {
										place: recommendation.name,
										link: "website",
									})}
									isExternalLink
								>
									<Icon
										icon={IconCatalog.GLOBE}
										size={24}
									/>
								</Link>
							) : null}
							{isNotEmptyString(recommendation.instagram) ? (
								<Link
									href={recommendation.instagram}
									variant={Link.variant.SMOOTH}
									className="mr-2 inline-block"
									onClick={AnalyticsService.trackClickEvent("BLOG|SPVEEQ|LINK", {
										place: recommendation.name,
										link: "instagram",
									})}
									isExternalLink
								>
									<Icon
										icon={IconCatalog.INSTAGRAM}
										size={24}
									/>
								</Link>
							) : null}
							{isNotEmptyString(recommendation.airbnb) ? (
								<Link
									href={recommendation.airbnb}
									variant={Link.variant.SMOOTH}
									className="mr-2 inline-block"
									onClick={AnalyticsService.trackClickEvent("BLOG|SPVEEQ|LINK", {
										place: recommendation.name,
										link: "airbnb",
									})}
									isExternalLink
								>
									<Icon
										icon={IconCatalog.AIRBNB}
										size={24}
									/>
								</Link>
							) : null}
							{isNotEmptyString(recommendation.whatsapp) && (
								<Link
									href={`https://api.whatsapp.com/send?phone=${recommendation.whatsapp}`}
									variant={Link.variant.SMOOTH}
									className="mr-2 inline-block"
									onClick={AnalyticsService.trackClickEvent("BLOG|SPVEEQ|LINK", {
										place: recommendation.name,
										link: "whatsapp",
									})}
									isExternalLink
								>
									<Icon
										icon={IconCatalog.WHATSAPP}
										size={24}
									/>
								</Link>
							)}
						</BoxWithTitle>

						<Blockquote>
							<Pre variant={Pre.variant.BREAK_WITH_BLANK_LINES}>{recommendation.description}</Pre>
						</Blockquote>
					</Collapsible>
				);
			})}
		</Box>
	);
}

export default SPVEEQRecommendations;
