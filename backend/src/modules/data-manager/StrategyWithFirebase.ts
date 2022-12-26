import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";

import envVars from "~/utils/env";

import IDataManager from "./Interface";

class StrategyWithFirebase implements IDataManager {
	constructor() {
		initializeApp(FIREBASE_CONFIG);
	}

	async query(config) {
		const dbRef = ref(getDatabase());
		const snapshot = await get(child(dbRef, `data/${config.model}`));

		if (snapshot.exists()) {
			return snapshot.val();
		}

		throw new Error(`Data not found on "${config.model}"`);
	}
}

export default StrategyWithFirebase;

// --- Constants ---

const FIREBASE_CONFIG = {
	apiKey: envVars.FIREBASE_API_KEY,
	authDomain: envVars.FIREBASE_AUTH_DOMAIN,
	databaseURL: envVars.FIREBASE_DATABASE_URL,
};
