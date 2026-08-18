import envalid, { str, url } from "@diegofrayo-pkg/next-envalid";

const EnvVarsScheme = {
	NODE_ENV: str({ choices: ["development", "production"] }),
	NEXT_PUBLIC_WEBSITE_URL: url(),
	NEXT_PUBLIC_WEBSITE_URL_DEV: url(),
	NEXT_PUBLIC_WEBSITE_URL_PROD: url(),
	AUTH_TOKEN: str(),
	ISR_PIN: str(),
	JWT_SECRET: str(),
};

export const EnvVars = envalid(EnvVarsScheme, {
	NODE_ENV: process.env.NODE_ENV,
	NEXT_PUBLIC_WEBSITE_URL: process.env["NEXT_PUBLIC_WEBSITE_URL"],
	NEXT_PUBLIC_WEBSITE_URL_DEV: process.env["NEXT_PUBLIC_WEBSITE_URL_DEV"],
	NEXT_PUBLIC_WEBSITE_URL_PROD: process.env["NEXT_PUBLIC_WEBSITE_URL_PROD"],
	AUTH_TOKEN: process.env["AUTH_TOKEN"],
	ISR_PIN: process.env["ISR_PIN"],
	JWT_SECRET: process.env["JWT_SECRET"],
});
