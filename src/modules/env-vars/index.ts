import { envalid, str, url } from "@diegofrayo/next-envalid";

const EnvVarsScheme = {
	NODE_ENV: str({ choices: ["development", "production"] }),
	NEXT_PUBLIC_WEBSITE_URL: url(),
};

const EnvVars = envalid(EnvVarsScheme, {
	NODE_ENV: process.env.NODE_ENV,
	NEXT_PUBLIC_WEBSITE_URL: process.env["NEXT_PUBLIC_WEBSITE_URL"],
});

export default EnvVars;
