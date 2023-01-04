import jwt from "jsonwebtoken";
import envVars from "~/modules/env";
import { logger } from "~/modules/logger";

import type { T_AuthCredentials } from "./models";

class AuthService {
	async signIn(authCredentials: T_AuthCredentials): Promise<{ token: string }> {
		const signInResponse = await this.signInWithFirebase(authCredentials);
		const token = jwt.sign(signInResponse, envVars.JWT_SECRET);

		return { token };
	}

	private async signInWithFirebase(
		authCredentials: T_AuthCredentials,
	): Promise<{ id: string; role: "ADMIN" }> {
		// TODO: Implement this
		logger("log", authCredentials);

		return {
			id: "a39a01fc-09e7-4f66-afb3-30842f858da0",
			role: "ADMIN",
		};
	}
}

export default new AuthService();
