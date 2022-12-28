import { Controller } from "~/modules/mvc";

class ErrorController extends Controller {
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
		};
	}
}

export default ErrorController;
