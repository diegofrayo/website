import { envalid, number, str, url } from "@diegofrayo/next-envalid";

const EnvVarsScheme = {
	NODE_ENV: str({ choices: ["development", "production"] }),
	NEXT_PUBLIC_WEBSITE_URL: url(),
	DATABASE_API_KEY: str(),
	DATABASE_AUTH_DOMAIN: str(),
	DATABASE_URL: url(),
	DENCRYPT_KEY: str(),
	ISR_SECURITY_PIN: number(),
	SIGN_IN_EMAIL: str(),
	SIGN_IN_PASSWORD: str(),
};

const EnvVars = envalid(EnvVarsScheme, {
	NODE_ENV: process.env.NODE_ENV,
	NEXT_PUBLIC_WEBSITE_URL: process.env["NEXT_PUBLIC_WEBSITE_URL"],
	DATABASE_API_KEY: process.env["DATABASE_API_KEY"],
	DATABASE_AUTH_DOMAIN: process.env["DATABASE_AUTH_DOMAIN"],
	DATABASE_URL: process.env["DATABASE_URL"],
	DENCRYPT_KEY: process.env["DENCRYPT_KEY"],
	ISR_SECURITY_PIN: process.env["ISR_SECURITY_PIN"],
	SIGN_IN_EMAIL: process.env["SIGN_IN_EMAIL"],
	SIGN_IN_PASSWORD: process.env["SIGN_IN_PASSWORD"],
});

export default EnvVars;
