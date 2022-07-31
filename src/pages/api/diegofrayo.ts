import type { NextApiRequest, NextApiResponse } from "next";

import { logger } from "~/utils/app";
import { ENV_VARS } from "~/constants";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	if (req.body.secret !== ENV_VARS.NEXT_PUBLIC_ISR_TOKEN) {
		logger("WARN", {
			message: "Invalid token",
			secret: req.body.secret,
			envVar: ENV_VARS.NEXT_PUBLIC_ISR_TOKEN,
		});

		res.status(401).json({ message: "Invalid token" });

		return;
	}

	try {
		await res.revalidate(req.body.path);
		res.json({ revalidated: true, date: new Date() });
	} catch (err) {
		// If there was an error, Next.js will continue to show the last successfully generated page
		res.status(500).send("Error revalidating");
	}
}
