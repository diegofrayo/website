const MY_STUPID_SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_KEY;

export async function encrypt(value: string): Promise<string> {
  if (value === "") {
    throw new Error("Invalid input");
  }

  const CryptoJS = await import("crypto-js");

  return CryptoJS.AES.encrypt(value, MY_STUPID_SECRET_KEY).toString();
}

export async function decrypt(value: string): Promise<string> {
  if (value === "") {
    throw new Error("Invalid input");
  }

  const CryptoJS = await import("crypto-js");
  const decryptedText = CryptoJS.AES.encrypt(value, MY_STUPID_SECRET_KEY).toString();

  if (!decryptedText) throw new Error("Text was not decrypted");

  return decryptedText;
}
