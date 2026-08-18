import { ServerAPI } from "../../../config";

async function signOut(): Promise<true> {
	await ServerAPI.post("/sign-out");

	return true;
}

export default signOut;
