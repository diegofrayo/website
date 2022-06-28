import { ENV_VARS } from "./constants";

import { isEmptyString } from "./validations";

const MY_STUPID_SECRET_KEY = ENV_VARS.NEXT_PUBLIC_CRYPTO_KEY;

export async function encrypt(value: string): Promise<string> {
	const CryptoJS = await import("crypto-js");
	return CryptoJS.AES.encrypt(value, MY_STUPID_SECRET_KEY).toString();
}

export async function decrypt(value: string): Promise<string> {
	const CryptoJS = await import("crypto-js");
	const decryptedText = CryptoJS.AES.decrypt(value, MY_STUPID_SECRET_KEY).toString(
		CryptoJS.enc.Utf8,
	);

	if (isEmptyString(decryptedText)) {
		throw new Error(`decrypt: value "${value}" has not been decrypted`);
	}

	return decryptedText;
}
