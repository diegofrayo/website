import { object, parse, string, type InferOutput } from "valibot";

export const ISRRequestBody = {
	schema: object({
		path: string(),
		secret: string(),
	}),
};

export type ISRRequestBody = InferOutput<typeof ISRRequestBody.schema>;

export function parseRequestBody(input: unknown) {
	return parse(ISRRequestBody.schema, input);
}
