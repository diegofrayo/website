import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "valibot";

import EnvVars from "~/modules/env-vars";

import { HttpError } from "../../errors";
import { sendServerError } from "../../utils";
import { SignInForm } from "./schemas";

export default function signInHandler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const { email, password } = parse(SignInForm.schema, req.body);

		if (email.toLowerCase() === EnvVars.SIGN_IN_EMAIL && password === EnvVars.SIGN_IN_PASSWORD) {
			res.status(200).send("Success");
		} else {
			throw new HttpError({
				id: "INVALID_CREDENTIALS",
				message: "Invalid email or password",
				type: HttpError.types.BAD_REQUEST,
			});
		}
	} catch (error) {
		sendServerError(res, error);
	}
}
