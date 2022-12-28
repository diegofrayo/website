import envVars from "~/modules/env";

import DataManagerContext from "./Context";
import StrategyWithFileSystem from "./StrategyWithFileSystem";
import StrategyWithFirebase from "./StrategyWithFirebase";

export default new DataManagerContext(
	envVars.isProd ? new StrategyWithFirebase() : new StrategyWithFileSystem(),
);
