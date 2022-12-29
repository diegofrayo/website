import { cleanEnv, port, str } from "envalid";
import { config } from "dotenv";

config({ path: `.env.${process.env["NODE_ENV"] || "development"}.local` });

const envVars = cleanEnv(process.env, {
	NODE_ENV: str({ choices: ["development", "production"] }),

	// # SERVER
	PORT: port(),

	// # FIREBASE
	FIREBASE_API_KEY: str(),
	FIREBASE_AUTH_DOMAIN: str(),
	FIREBASE_DATABASE_URL: str(),

	// # TOKENS
	BASIC_RESOURCES_PROTECTION_TOKEN: str(),
	PRIVATE_DATA_PROTECTION_TOKEN: str(),
	AUTH_TOKEN: str(),
	SESSIONS_TOKEN: str(),
});

export default envVars;
