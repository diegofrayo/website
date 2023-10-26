import { initializeApp } from "firebase/app";
import {
	child,
	getDatabase,
	ref,
	set,
	get as databaseGet,
	update as databaseUpdate,
} from "firebase/database";

import type DR from "../types";
import { throwError } from "./misc";

const DATABASE_CONFIG = {
	apiKey: process.env["DATABASE_API_KEY"] || throwError(`Invalid "DATABASE_API_KEY" value`),
	authDomain:
		process.env["DATABASE_AUTH_DOMAIN"] || throwError(`Invalid "DATABASE_AUTH_DOMAIN" value`),
	databaseURL: process.env["DATABASE_URL"] || throwError(`Invalid "DATABASE_URL" value`),
};
const app = initializeApp(DATABASE_CONFIG);
const database = getDatabase(app);
const BASE_PATH = "diegofrayo";

function get(path: string) {
	const dbRef = ref(database);

	return databaseGet(child(dbRef, `${BASE_PATH}/${path}`)).then((snapshot) => {
		if (snapshot.exists()) {
			return snapshot.val();
		}

		return null;
	});
}

function write(path: string, data: unknown) {
	return set(ref(database, `${BASE_PATH}/${path}`), data);
}

function update(path: string, updates: DR.Object) {
	return databaseUpdate(ref(database, `${BASE_PATH}/${path}`), updates);
}

function remove(path: string) {
	return write(path, null);
}

const DatabaseService = {
	get,
	write,
	update,
	remove,
};

export default DatabaseService;
