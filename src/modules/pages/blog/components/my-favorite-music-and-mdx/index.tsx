import * as React from "react";

import { Block, Icon, Link, Text, Title } from "~/components/primitive";
import { isDevelopmentEnvironment } from "~/utils/app";

export function MFMAMHelloWorldMDX({ text }: { text: string }) {
	return <Text className="tw-block tw-bg-red-200 tw-p-2 tw-text-red-700">{text}</Text>;
}

type T_GitHubRepoProps = {
	name: string;
	url: string;
	description: string;
};

export function MFMAMGitHubRepo({ name, url, description }: T_GitHubRepoProps) {
	return (
		<Block
			className="tw-text-center"
			data-markdown-block
		>
			<Link
				variant={Link.variant.SIMPLE}
				className="tw-relative tw-flex tw-items-center tw-rounded-md tw-border tw-p-4 tw-pr-8 dr-bg-color-surface-200 dr-border-color-surface-300 sm:tw-inline-flex"
				href={url}
				isExternalLink
			>
				<Icon
					icon={Icon.icon.GITHUB_MONO}
					wrapperClassName="tw-mr-3"
					size={24}
				/>
				<Block className="tw-flex-1 tw-text-left">
					<Title
						is="h3"
						className="tw-text-base sm:tw-text-lg"
						variant={Title.variant.UNSTYLED}
					>
						{name}
					</Title>
					<Text className="tw-text-sm">{description}</Text>
				</Block>

				<Icon
					icon={Icon.icon.LINK}
					wrapperClassName="tw-absolute tw-top-2 tw-right-2"
				/>
			</Link>
		</Block>
	);
}

export function MFMAMSpotifyPlaylist() {
	if (isDevelopmentEnvironment()) {
		return null;
	}

	return (
		<Block className="tw-overflow-hidden tw-rounded-3xl tw-border-4 dr-border-color-surface-300">
			<iframe
				src="https://open.spotify.com/embed/playlist/37i9dQZF1EM1nsROE2cRZE"
				height="500"
				width="100%"
				allow="encrypted-media"
				loading="lazy"
				title="Spotify playlist"
			/>
		</Block>
	);
}
