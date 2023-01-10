import apicache from "apicache";

import { logger } from "~/modules/logger";
import { Controller } from "~/modules/mvc";

const cache = apicache.middleware;

class TestsController extends Controller {
	constructor() {
		super("tests");
		this.config = {
			"/error": {
				method: "get",
				handler: async (req): Promise<void> => {
					throw new Error(req.path);
				},
			},
			"/error-async": {
				method: "get",
				handler: async (req): Promise<void> => {
					return new Promise((_, reject) => {
						setTimeout(() => {
							reject(new Error(req.path));
						}, 1000);
					});
				},
			},
			"/error-with-custom-handling": {
				method: "get",
				handler: async (req, _, next): Promise<void> => {
					setTimeout(() => {
						try {
							throw new Error(req.path);
						} catch (error) {
							next(error);
						}
					}, 1000);
				},
			},
			"/cookies": {
				method: "get",
				handler: async (req, res): Promise<void> => {
					res.send(req.cookies);
				},
			},
			"/cache": {
				method: "get",
				handler: [
					cache("1 minutes"),
					async (_, res): Promise<void> => {
						const result = `${Math.floor(Math.random() * 5)}Response`;
						logger("log", result);
						res.send(result);
					},
				],
			},
			"/exit": {
				method: "post",
				handler: async (req, res): Promise<void> => {
					res.json({
						cwd: process.cwd(),
						getgid: process.getgid(),
						version: process.version,
						argv: process.argv,
						env: process.env,
					});

					process.exit([0, 1].includes(req.body.code) ? req.body.code : undefined);
				},
			},
		};
	}
}

export default TestsController;
