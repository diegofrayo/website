import envalid, { str, url } from "@diegofrayo-pkg/next-envalid";

const EnvVarsScheme = {
	NODE_ENV: str({ choices: ["development", "production"] }),
	NEXT_PUBLIC_WEBSITE_URL: url(),
	NEXT_PUBLIC_WEBSITE_URL_PROD: url(),
	NEXT_PUBLIC_AUTH_TOKEN: str(),
};

export const EnvVars = envalid(EnvVarsScheme, {
	NODE_ENV: process.env.NODE_ENV,
	NEXT_PUBLIC_WEBSITE_URL: process.env["NEXT_PUBLIC_WEBSITE_URL"],
	NEXT_PUBLIC_WEBSITE_URL_PROD: process.env["NEXT_PUBLIC_WEBSITE_URL_PROD"],
	NEXT_PUBLIC_AUTH_TOKEN: process.env["NEXT_PUBLIC_AUTH_TOKEN"],
});
