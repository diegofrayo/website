import { networkInterfaces } from "os";
import { parse, stringify } from "envfile";
import fs from "fs";

async function main() {
	// ipconfig getifaddr en0
	const localIP = getIP();
	const envVars = parse(fs.readFileSync("./.env"));

	envVars["NEXT_PUBLIC_WEBSITE_URL"] = `http://${localIP}:3000`;

	fs.writeFileSync("./.env", stringify(envVars));

	console.log("Local IP address", envVars["NEXT_PUBLIC_WEBSITE_URL"]);
	console.log("Env-vars script executed successfully");
}

main();

// --- Utils ---

function getIP() {
	try {
		const nets = networkInterfaces();
		const results = Object.create(null);

		Object.keys(nets).forEach((name) => {
			Object.values(nets[name]).forEach((net) => {
				if (net.family === "IPv4" && !net.internal) {
					if (!results[name]) {
						results[name] = [];
					}
					results[name].push(net.address);
				}
			});
		});

		return results.en0?.[0] || results["Wi-Fi"]?.[0] || "localhost";
	} catch (error) {
		console.log("Error getting the ip address:", error.message);
		return "localhost";
	}
}
