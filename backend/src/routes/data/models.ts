import { z } from "zod";

import { MODELS } from "./utils";

export const findDataReqBodySchema = z.object({
	model: z.union([
		z.literal(MODELS[0].name),
		z.literal(MODELS[1].name),
		z.literal(MODELS[2].name),
		z.literal(MODELS[3].name),
		z.literal(MODELS[4].name),
		z.literal(MODELS[5].name),
	]),
});

export type T_ModelParam = z.infer<typeof findDataReqBodySchema.shape.model>;
