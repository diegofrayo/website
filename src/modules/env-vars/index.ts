const EnvVars = {
	NODE_ENV: process.env.NODE_ENV || "",
	NEXT_PUBLIC_WEBSITE_URL: process.env["NEXT_PUBLIC_WEBSITE_URL"] || "",
} as const;

export default EnvVars;
