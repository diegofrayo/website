import I_DataManager from "./Interface";
import { T_QueryConfigParam } from "./Types";

class DataManagerContext {
	private strategy: I_DataManager;

	constructor(strategy: I_DataManager) {
		this.strategy = strategy;
	}

	setStrategy(strategy: I_DataManager): void {
		this.strategy = strategy;
	}

	async query<G_Return>(config: T_QueryConfigParam): Promise<G_Return> {
		return this.strategy.query<G_Return>(config);
	}
}

export default DataManagerContext;
