import { isEmptyString } from "./validations";

const MY_STUPID_SECRET_KEY = process.env["NEXT_PUBLIC_CRYPTO_KEY"] || "MY_STUPID_SECRET_KEY";

export async function encrypt(value: string): Promise<string> {
  if (isEmptyString(value)) {
    throw new Error(`encrypt: Invalid value to encrypt: ${value}`);
  }

  const CryptoJS = await import("crypto-js");
  return CryptoJS.AES.encrypt(value, MY_STUPID_SECRET_KEY).toString();
}

export async function decrypt(value: string): Promise<string> {
  if (isEmptyString(value)) {
    throw new Error(`decrypt: Invalid value to decrypt: ${value}`);
  }

  const CryptoJS = await import("crypto-js");
  const decryptedText = CryptoJS.AES.decrypt(value, MY_STUPID_SECRET_KEY).toString(
    CryptoJS.enc.Utf8,
  );

  if (!decryptedText) {
    throw new Error(`decrypt: value "${value}" has not been decrypted`);
  }

  return decryptedText;
}
