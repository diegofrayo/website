// --- Routing ---

export abstract class IController {
	protected config: T_Config;
	name: string;

	getConfig() {
		if (!this.config) {
			throw new Error(`Controller "${this.name}" does not have a defined config`);
		}

		return this.config;
	}
}

export type Controller = new () => IController;

type T_Config = Record<
	string,
	{
		method: "get" | "post" | "put" | "patch" | "delete";
		handler: (req, res) => void;
	}
>;
