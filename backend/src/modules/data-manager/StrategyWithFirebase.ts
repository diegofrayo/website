import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";

import envVars from "~/utils/env";

import I_DataManager from "./Interface";
import { T_QueryConfigParam } from "./Types";

class StrategyWithFirebase implements I_DataManager {
	constructor() {
		initializeApp(FIREBASE_CONFIG);
	}

	async query<G_Return>(config: T_QueryConfigParam): Promise<G_Return> {
		const path = ["data", config.model, config.query || ""].join("/");
		const dbRef = ref(getDatabase());
		const snapshot = await get(child(dbRef, path));

		if (snapshot.exists()) {
			return snapshot.val() as G_Return;
		}

		throw new Error(`Data not found on "${path}"`);
	}
}

export default StrategyWithFirebase;

// --- Constants ---

const FIREBASE_CONFIG = {
	apiKey: envVars.FIREBASE_API_KEY,
	authDomain: envVars.FIREBASE_AUTH_DOMAIN,
	databaseURL: envVars.FIREBASE_DATABASE_URL,
};
