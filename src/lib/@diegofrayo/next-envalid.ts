import { isBrowser, isServer } from "./utils/misc";
import v from "./v";

type T_EnvVarConfigAPI = {
	validate: (input: unknown) => boolean;
	getErrorMessage: typeof getErrorMessage;
};

export function str(opts?: { choices: string[] }): T_EnvVarConfigAPI {
	return {
		validate: (input) => {
			return v.isString(input) && opts && v.isArray(opts?.choices)
				? opts.choices.includes(input)
				: v.isString(input);
		},
		getErrorMessage,
	};
}

export function url(): T_EnvVarConfigAPI {
	return {
		validate: (input) => {
			try {
				new URL(input as string); // eslint-disable-line no-new
				return true;
			} catch (error) {
				return false;
			}
		},
		getErrorMessage,
	};
}

export function envalid<
	G_Object extends object,
	G_Keys extends keyof G_Object,
	G_Return extends { [K in G_Keys]: string },
>(envVarsScheme: G_Object, envVars: { [K in G_Keys]: string | undefined }): G_Return {
	return Object.entries(envVarsScheme).reduce((result, item) => {
		const [envVarKey, envVarConfig] = item as [string, T_EnvVarConfigAPI];
		const envVarValue = envVars[envVarKey as G_Keys];

		if (
			(envVarKey.startsWith("NEXT_PUBLIC") && isBrowser()) ||
			(!envVarKey.startsWith("NEXT_PUBLIC") && isServer())
		) {
			if (envVarConfig.validate(envVarValue)) {
				return { ...result, [envVarKey]: envVarValue || "" };
			}

			throw new Error(envVarConfig.getErrorMessage(envVarKey, envVarValue));
		}

		return { ...result, [envVarKey]: envVarValue || "" };
	}, {} as G_Return);
}

// --- INTERNALS ---

function getErrorMessage(key: string, value: unknown) {
	return `Invalid env var => KEY: "${key}" | VALUE: "${value}"`;
}
