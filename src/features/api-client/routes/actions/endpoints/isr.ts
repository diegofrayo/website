import type { ISRRequestBody } from "~/features/server/api/endpoints/isr/schemas";

import { ServerAPI } from "../../../config";

async function isr(body: ISRRequestBody): Promise<true> {
	await ServerAPI.post("/isr", body);

	return true;
}

export default isr;
