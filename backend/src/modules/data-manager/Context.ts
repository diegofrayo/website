import IDataManager from "./Interface";

class DataManagerContext {
	private strategy: IDataManager;

	constructor(strategy: IDataManager) {
		this.strategy = strategy;
	}

	setStrategy(strategy: IDataManager) {
		this.strategy = strategy;
	}

	async query(query) {
		return this.strategy.query(query);
	}
}

export default DataManagerContext;
