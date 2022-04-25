import { networkInterfaces } from "os";
import { parse, stringify } from "envfile";
import fs from "fs";

async function main() {
  // ipconfig getifaddr en0
  const localIP = getIP();

  const envVars = parse(fs.readFileSync("./.env"));
  envVars["NEXT_PUBLIC_ASSETS_SERVER_URL"] = `http://${localIP}:4000`;
  // envVars["NEXT_PUBLIC_ASSETS_SERVER_URL"] = `https://diegofrayo-backend.vercel.app`;

  fs.writeFileSync("./.env", stringify(envVars));
  console.log("Local IP address", envVars["NEXT_PUBLIC_ASSETS_SERVER_URL"]);
}

main();

// --- Utils ---

function getIP() {
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

  return results.en0[0];
}
