/*
import HttpError from "~/exceptions/HttpError";
import { Controller } from "~/modules/mvc";
import { parseSchemaSafe } from "~/modules/schemas";
import type { T_Request, T_Response } from "~/types";

import { authCredentialsSchema, T_AuthCredentials } from "./models";
import AuthService from "./service";

class AuthController extends Controller {
	constructor() {
		super("auth");
		this.config = {
			"/sign-in": {
				method: "post",
				handler: this.signIn,
			},
		};
	}

	private async signIn(req: T_Request, res: T_Response): Promise<void> {
		try {
			const { data: authCredentials, errors } = parseSchemaSafe<T_AuthCredentials>(
				authCredentialsSchema,
				req.body,
			);

			if (errors) {
				if (errors.email) {
					throw new HttpError({
						type: HttpError.types.BAD_REQUEST,
						description: `invalid email`,
					});
				}

				if (errors.password) {
					throw new HttpError({
						type: HttpError.types.BAD_REQUEST,
						description: `invalid password`,
					});
				}
			} else {
				const response = await AuthService.signIn(authCredentials);

				AuthService.saveCookie(res, response.token);

				res.json(response);
			}
		} catch (error) {
			res.sendError(error);
		}
	}
}

export default AuthController;
*/

export default {};
