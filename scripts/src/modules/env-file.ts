import { networkInterfaces } from "os";
import { parse, stringify } from "envfile";

import { readFile, writeFile } from "../../../src/lib/@diegofrayo/utils/files";
import { throwError, getErrorMessage } from "../../../src/lib/@diegofrayo/utils/misc";

async function main() {
	const localIP = getIP();
	const envVars = parse(readFile("./.env")) as T_EnvVars;

	envVars.NEXT_PUBLIC_WEBSITE_URL = `http://${localIP}:3000`;

	writeFile("./.env", stringify(envVars));

	console.log(`"env-file" script executed successfully`);
	console.log("Local IP address:", envVars.NEXT_PUBLIC_WEBSITE_URL);
}

main();

// --- TYPES ---

type T_EnvVars = {
	NEXT_PUBLIC_SERVER_URL: string;
	NEXT_PUBLIC_WEBSITE_URL: string;
};

// --- UTILS ---

function getIP() {
	try {
		const nets = networkInterfaces();
		const results = Object.create(null);

		Object.keys(nets).forEach((name) => {
			Object.values(nets[name] || {}).forEach((net) => {
				if (net.family === "IPv4" && !net.internal) {
					if (!results[name]) {
						results[name] = [];
					}

					results[name].push(net.address);
				}
			});
		});

		return (
			results.en0?.[0] ||
			results["Wi-Fi"]?.[0] ||
			throwError(`Invalid IP: ${JSON.stringify(results)}`)
		);
	} catch (error) {
		console.log("Error getting the ip address:", getErrorMessage(error));
		return "localhost";
	}
}
