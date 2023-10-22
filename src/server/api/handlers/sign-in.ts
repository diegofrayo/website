import type { NextApiRequest, NextApiResponse } from "next";
import { email, minLength, object, parse, string } from "valibot";

import EnvVars from "~/modules/env-vars";

import { sendServerError } from "../utils";

export default function signInHandler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const { email: emailParam, password } = parse(SignInSchema, req.body);

		if (
			emailParam.toLowerCase() === EnvVars.SIGN_IN_EMAIL &&
			password === EnvVars.SIGN_IN_PASSWORD
		) {
			res.status(200).json({ message: "Success" });
		} else {
			throw new Error("Invalid email or password");
		}
	} catch (error) {
		sendServerError(res, error);
	}
}

// --- SCHEMAS ---

const SignInSchema = object({
	email: string([email()]),
	password: string([minLength(10)]),
});
