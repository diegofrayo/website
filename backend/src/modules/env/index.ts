import { cleanEnv, port, str, url } from "envalid";
import { config } from "dotenv";

config({ path: `.env.${process.env["NODE_ENV"] || "development"}.local` });

const envVars = cleanEnv(process.env, {
	NODE_ENV: str({ choices: ["development", "production"] }),

	// # SERVER
	PORT: port(),
	CORS_ALLOWED_ORIGINS: url(),

	// # FIREBASE
	FIREBASE_API_KEY: str(),
	FIREBASE_AUTH_DOMAIN: str(),
	FIREBASE_DATABASE_URL: str(),

	// # TOKENS
	AUTH_TOKEN: str(),
	BASIC_RESOURCES_PROTECTION_TOKEN: str(),
	JWT_SECRET: str(),
	PRIVATE_DATA_PROTECTION_TOKEN: str(),
	SESSIONS_TOKEN: str(),
});

export default envVars;
