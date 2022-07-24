import * as React from "react";

import { Block, Icon, Link, Text, Title as TitlePrimitive } from "~/components/primitive";
import type { T_ReactElement, T_ReactElementNullable } from "~/types";
import { isDevelopmentEnvironment } from "~/utils/app";

export function MFMAM_HelloWorldMDX({ text }: { text: string }): T_ReactElement {
	return <Text className="tw-block tw-bg-red-200 tw-p-2 tw-text-red-700">{text}</Text>;
}

type T_GitHubRepoProps = {
	name: string;
	url: string;
	description: string;
};

export function MFMAM_GitHubRepo({ name, url, description }: T_GitHubRepoProps): T_ReactElement {
	return (
		<Block
			className="tw-text-right"
			data-markdown-block
		>
			<Link
				variant={Link.variant.SIMPLE}
				className="dfr-bg-color-primary tw-relative tw-flex tw-items-center tw-rounded-md tw-border tw-p-4 tw-pr-8 dfr-border-color-secondary-inv sm:tw-inline-flex"
				href={url}
				isExternalLink
			>
				<Icon
					icon={Icon.icon.GITHUB}
					wrapperClassName="tw-mr-3"
					size={32}
					withBackgroundWhenDarkMode
				/>
				<Block className="tw-flex-1 tw-text-left">
					<TitlePrimitive
						is="h3"
						className="tw-text-base dfr-text-color-black-pin dark:dfr-text-color-white-pin sm:tw-text-lg"
						variant={TitlePrimitive.variant.UNSTYLED}
					>
						{name}
					</TitlePrimitive>
					<Text className="tw-text-sm">{description}</Text>
				</Block>

				<Icon
					icon={Icon.icon.LINK}
					wrapperClassName="tw-absolute tw-top-2 tw-right-2"
					iconClassName="dfr-text-color-black-pin"
				/>
			</Link>
		</Block>
	);
}

export function MFMAM_SpotifyPlaylist(): T_ReactElementNullable {
	if (isDevelopmentEnvironment()) {
		return null;
	}

	return (
		<Block
			className="tw-border-4 dfr-border-color-secondary-inv"
			data-markdown-block
		>
			<iframe
				src="https://open.spotify.com/embed/playlist/37i9dQZF1EM1nsROE2cRZE"
				height="380"
				width="100%"
				allow="encrypted-media"
				frameBorder="0"
				loading="lazy"
				title="Spotify playlist"
			/>
		</Block>
	);
}
