import { ServerAPI } from "../../../config";

async function checkSession(): Promise<boolean> {
	const { data } = await ServerAPI.post<CheckSessionResponse>("/check-session");

	return data.signedIn;
}

export default checkSession;

// --- TYPES ---

type CheckSessionResponse = {
	signedIn: boolean;
};
