import type { SignInRequestBody } from "~/features/server/api/endpoints/sign-in/schemas";

import { ServerAPI } from "../../../config";

async function signIn(body: SignInRequestBody): Promise<true> {
	await ServerAPI.post("/sign-in", body);

	return true;
}

export default signIn;
