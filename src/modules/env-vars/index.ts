import { envalid, str, url } from "@diegofrayo/next-envalid";

const EnvVarsScheme = {
	NODE_ENV: str({ choices: ["development", "production"] }),
	NEXT_PUBLIC_WEBSITE_URL: url(),
	SIGN_IN_EMAIL: str(),
	SIGN_IN_PASSWORD: str(),
	DENCRYPT_KEY: str(),
};

const EnvVars = envalid(EnvVarsScheme, {
	NODE_ENV: process.env.NODE_ENV,
	NEXT_PUBLIC_WEBSITE_URL: process.env["NEXT_PUBLIC_WEBSITE_URL"],
	SIGN_IN_EMAIL: process.env["SIGN_IN_EMAIL"],
	SIGN_IN_PASSWORD: process.env["SIGN_IN_PASSWORD"],
	DENCRYPT_KEY: process.env["DENCRYPT_KEY"],
});

export default EnvVars;
