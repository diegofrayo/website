interface IDataManager {
	query<G_Return>(config: { model: string }): G_Return | Promise<G_Return>;
}

export default IDataManager;
