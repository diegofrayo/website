import { object, string, type Input, parse } from "valibot";

export const SecurityPinForm = {
	schema: object({
		securityPin: string(),
	}),
};

export type T_SecurityPinForm = Input<typeof SecurityPinForm.schema>;

export function parseRequestBody(input: unknown) {
	return parse(SecurityPinForm.schema, input);
}
