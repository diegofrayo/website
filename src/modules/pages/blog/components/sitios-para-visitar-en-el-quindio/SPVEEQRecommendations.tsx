import * as React from "react";

import { Block, Blockquote, Collapsible, Icon, Link, Pre } from "~/components/primitive";
import { BoxWithTitle } from "~/components/shared";
import AnalyticsService from "~/modules/analytics";
import v from "@diegofrayo/v";

type T_SPVEEQRecommendationsProps = {
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

function SPVEEQRecommendations({ data: recommendations }: T_SPVEEQRecommendationsProps) {
	return (
		<Block>
			{recommendations.map((recommendation) => {
				return (
					<Collapsible
						key={recommendation.id}
						title={recommendation.name}
						contentClassName="tw-pt-1 tw-pb-4"
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
							className="tw-my-2 tw-p-2 tw-pt-3"
						>
							{v.isNotEmptyString(recommendation.website) ? (
								<Link
									href={recommendation.website}
									variant={Link.variant.SIMPLE}
									className="tw-mr-2 tw-inline-block"
									isExternalLink
								>
									<Icon
										icon={Icon.icon.WEBSITE}
										size={24}
									/>
								</Link>
							) : null}
							{v.isNotEmptyString(recommendation.instagram) ? (
								<Link
									href={recommendation.instagram}
									variant={Link.variant.SIMPLE}
									className="tw-mr-2 tw-inline-block"
									isExternalLink
								>
									<Icon
										icon={Icon.icon.INSTAGRAM}
										size={24}
									/>
								</Link>
							) : null}
							{v.isNotEmptyString(recommendation.airbnb) ? (
								<Link
									href={recommendation.airbnb}
									variant={Link.variant.SIMPLE}
									className="tw-mr-2 tw-inline-block"
									isExternalLink
								>
									<Icon
										icon={Icon.icon.AIRBNB}
										size={24}
									/>
								</Link>
							) : null}
							{v.isNotEmptyString(recommendation.whatsapp) ? (
								<Link
									href={`https://api.whatsapp.com/send?phone=${recommendation.whatsapp}`}
									variant={Link.variant.SIMPLE}
									className="tw-mr-2 tw-inline-block"
									isExternalLink
								>
									<Icon
										icon={Icon.icon.WHATSAPP}
										size={24}
									/>
								</Link>
							) : null}
						</BoxWithTitle>

						<Blockquote>
							<Pre variant={Pre.variant.BREAK_WITH_BLANK_LINES}>{recommendation.description}</Pre>
						</Blockquote>
					</Collapsible>
				);
			})}
		</Block>
	);
}

export default SPVEEQRecommendations;
