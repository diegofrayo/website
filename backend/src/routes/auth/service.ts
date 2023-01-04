/*
import { AuthService, T_UserSession } from "~/modules/auth";
import { logger } from "~/modules/logger";
import { T_Response } from "~/types";

import type { T_AuthCredentials } from "./models";

class AuthControllerService {
	async signIn(authCredentials: T_AuthCredentials): Promise<T_SignInResponse> {
		const signInResponse = await this.signInWithFirebase(authCredentials);
		const token = AuthService.writeJWT(signInResponse);

		return { token };
	}

	saveCookie(res: T_Response, token: T_SignInResponse["token"]): void {
		AuthService.saveAuthCookie(res, token);
	}

	private async signInWithFirebase(
		authCredentials: T_AuthCredentials,
	): Promise<T_UserSession["user"]> {
		// TODO: Implement this using firebase
		logger("log", authCredentials, "THIS IS TEMP");

		return {
			id: "a39a01fc-09e7-4f66-afb3-30842f858da0",
			role: "ADMIN",
		};
	}
}

export default new AuthControllerService();

// --- Types ---

type T_SignInResponse = {
	token: string;
};
*/

export default {};
