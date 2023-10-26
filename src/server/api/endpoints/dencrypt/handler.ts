import type { NextApiRequest, NextApiResponse } from "next";
import cryptoJS from "crypto-js";

import EnvVars from "~/modules/env-vars";
import { getErrorMessage } from "@diegofrayo/utils/misc";
import v from "@diegofrayo/v";

import { HttpError, ServerError } from "../../errors";
import { sendServerError } from "../../utils";
import { parseRequestBody } from "./schemas";

export default async function dencryptHandler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const { action, text } = parseRequestBody(req.body);
		const result = await (action === "encrypt" ? encrypt(text) : decrypt(text));

		res.json({ output: result });
	} catch (error) {
		sendServerError(
			res,
			new HttpError({
				id: "DENCRYPT",
				type: HttpError.types.INTERNAL_SERVER_ERROR,
				message: getErrorMessage(error),
			}),
		);
	}
}

// --- UTILS ---

async function encrypt(text: string): Promise<string> {
	if (v.isEmptyString(EnvVars.DENCRYPT_KEY)) {
		throw new ServerError("Ooops! Invalid 'DENCRYPT_KEY' value");
	}

	return cryptoJS.AES.encrypt(text, EnvVars.DENCRYPT_KEY).toString();
}

async function decrypt(text: string): Promise<string> {
	if (v.isEmptyString(EnvVars.DENCRYPT_KEY)) {
		throw new ServerError("Ooops! Invalid 'DENCRYPT_KEY' value");
	}

	try {
		const decryptedText = cryptoJS.AES.decrypt(text, EnvVars.DENCRYPT_KEY).toString(
			cryptoJS.enc.Utf8,
		);

		if (!decryptedText) {
			throw new Error();
		}

		return decryptedText;
	} catch (error) {
		throw new ServerError("Ooops! The text could not be decrypted");
	}
}
