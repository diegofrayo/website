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
						className="tw-mb-4"
						contentClassName="tw-pt-1"
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
							title="Contacto"
							className="tw-my-2 tw-p-2 tw-pt-3"
						>
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
