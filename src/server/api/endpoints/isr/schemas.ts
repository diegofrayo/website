import { object, string, type Input, parse } from "valibot";

export const ISRForm = {
	schema: object({
		path: string(),
		secret: string(),
	}),
};

export type T_ISRForm = Input<typeof ISRForm.schema>;

export function parseRequestBody(input: unknown) {
	return parse(ISRForm.schema, input);
}
