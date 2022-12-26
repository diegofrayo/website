import { T_QueryConfigParam } from "./Types";

interface I_DataManager {
	query<G_Return>(config: T_QueryConfigParam): G_Return | Promise<G_Return>;
}

export default I_DataManager;
