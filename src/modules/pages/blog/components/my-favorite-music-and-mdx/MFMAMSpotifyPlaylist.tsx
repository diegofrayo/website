import * as React from "react";

import { Block } from "~/components/primitive";
import EnvVars from "~/modules/env-vars";
import { isDevelopmentEnvironment } from "~/utils/app";

export default function MFMAMSpotifyPlaylist() {
	if (isDevelopmentEnvironment(EnvVars)) {
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
